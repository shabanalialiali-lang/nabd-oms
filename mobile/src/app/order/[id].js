import { useCallback, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";
import RequireAuth from "../../components/RequireAuth";
import { useAuth } from "../../lib/auth";
import { confirm, notify } from "../../lib/notify";
import { Button, Card, EmptyState, Field, Loading, Screen, SectionTitle, StatusPill } from "../../components/ui";
import { getCategory } from "../../constants/categories";
import { formatDate } from "../../constants/status";
import { colors } from "../../constants/theme";

export default function OrderDetailsScreen() {
  return (
    <RequireAuth>
      <OrderDetails />
    </RequireAuth>
  );
}

function OrderDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [contact, setContact] = useState(null);
  const [other, setOther] = useState(null); // الطرف الآخر: الفني للعميل، والعميل للفني
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const load = useCallback(async () => {
    const { data: o } = await supabase.from("service_orders").select("*").eq("id", id).maybeSingle();
    setOrder(o);
    setLoading(false);
    if (!o) return;

    const { data: c } = await supabase.from("service_order_contacts").select("*").eq("order_id", o.id).maybeSingle();
    setContact(c);

    const otherId = o.customer_id === user.id ? o.technician_id : o.customer_id;
    if (otherId) {
      const { data: p } = await supabase.from("profiles").select("full_name, phone, city, bio").eq("id", otherId).maybeSingle();
      setOther(p);
    } else {
      setOther(null);
    }
    if (o.technician_id) {
      const { data: s } = await supabase.from("technician_stats").select("*").eq("technician_id", o.technician_id).maybeSingle();
      setStats(s);
    }
  }, [id, user.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function run(fn, successMsg) {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) {
      notify("تعذر تنفيذ العملية", error.message);
      return;
    }
    if (successMsg) notify(successMsg);
    load();
  }

  const setStatus = (status, extra = {}) =>
    supabase.rpc("update_service_order_status", { p_order_id: order.id, p_status: status, ...extra });

  if (loading) return <Loading />;
  if (!order) return <EmptyState icon="🔍" title="الطلب غير موجود" subtitle="ربما قبله فني آخر أو تم إلغاؤه" />;

  const cat = getCategory(order.category);
  const isCustomer = order.customer_id === user.id;
  const isAssignedTech = order.technician_id === user.id;
  const phone = contact?.contact_phone || other?.phone;

  return (
    <Screen>
      <Card>
        <View style={styles.head}>
          <View style={[styles.icon, { backgroundColor: cat.color + "22" }]}>
            <Text style={{ fontSize: 30 }}>{cat.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cat}>{cat.label} • طلب #{order.id}</Text>
            <Text style={styles.title}>{order.title}</Text>
          </View>
        </View>
        <View style={styles.pills}>
          <StatusPill value={order.status} />
          {order.urgency === "urgent" && <StatusPill value="urgent" />}
        </View>
        {!!order.description && <Text style={styles.desc}>{order.description}</Text>}
        <Row label="المدينة" value={order.city} />
        <Row label="الموعد المناسب" value={order.preferred_time} />
        <Row label="تاريخ الطلب" value={formatDate(order.created_at)} />
        {order.price != null && <Row label="التكلفة" value={`${Number(order.price).toLocaleString("ar-EG")}`} />}
      </Card>

      <Timeline order={order} />

      {/* بيانات الطرف الآخر */}
      {isCustomer && other && (
        <Card>
          <SectionTitle>الفني المسؤول</SectionTitle>
          <Text style={styles.person}>{other.full_name}</Text>
          {!!stats?.avg_rating && (
            <Text style={styles.sub}>
              ⭐ {stats.avg_rating} ({stats.ratings_count} تقييم) • {stats.completed_jobs} عمل منجز
            </Text>
          )}
          {!!other.bio && <Text style={styles.desc}>{other.bio}</Text>}
          {!!other.phone && <Button title={`📞 اتصال ${other.phone}`} variant="outline" onPress={() => Linking.openURL(`tel:${other.phone}`)} style={{ marginTop: 10 }} />}
        </Card>
      )}
      {isAssignedTech && (
        <Card>
          <SectionTitle>بيانات العميل</SectionTitle>
          <Text style={styles.person}>{other?.full_name || "عميل"}</Text>
          {!!contact?.address && <Text style={styles.sub}>📍 {contact.address}</Text>}
          {!!phone && <Button title={`📞 اتصال ${phone}`} variant="outline" onPress={() => Linking.openURL(`tel:${phone}`)} style={{ marginTop: 10 }} />}
        </Card>
      )}

      {/* إجراءات الفني */}
      {!isCustomer && order.status === "open" && (
        <Button
          title="✅ قبول الطلب"
          loading={busy}
          onPress={() => run(() => supabase.rpc("accept_service_order", { p_order_id: order.id }), "تم قبول الطلب — تواصل مع العميل")}
        />
      )}
      {isAssignedTech && order.status === "accepted" && (
        <>
          <Button title="🔧 بدء التنفيذ" loading={busy} onPress={() => run(() => setStatus("in_progress"))} />
          <Button
            title="التراجع عن الطلب"
            variant="outline"
            style={{ marginTop: 10 }}
            onPress={async () => {
              if (await confirm("التراجع عن الطلب", "سيعود الطلب متاحًا لفنيين آخرين")) run(() => setStatus("open"));
            }}
          />
        </>
      )}
      {isAssignedTech && (order.status === "accepted" || order.status === "in_progress") && (
        <Card style={{ marginTop: 12 }}>
          <SectionTitle>إنهاء العمل</SectionTitle>
          <Field label="التكلفة النهائية" value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="مثال: 150" />
          <Button
            title="🏁 تم الإنجاز"
            variant="success"
            loading={busy}
            onPress={() => {
              const value = price.trim() === "" ? null : Number(price);
              if (value !== null && (Number.isNaN(value) || value < 0)) {
                notify("أدخل رقمًا صحيحًا للتكلفة");
                return;
              }
              run(() => setStatus("completed", { p_price: value }), "تم إنهاء الطلب بنجاح");
            }}
          />
        </Card>
      )}

      {/* إجراءات العميل */}
      {isCustomer && (order.status === "open" || order.status === "accepted") && (
        <Button
          title="إلغاء الطلب"
          variant="danger"
          loading={busy}
          onPress={async () => {
            if (await confirm("إلغاء الطلب", "هل أنت متأكد من إلغاء هذا الطلب؟", "إلغاء الطلب")) run(() => setStatus("cancelled"));
          }}
        />
      )}
      {isCustomer && order.status === "completed" && order.rating == null && (
        <Card>
          <SectionTitle>قيّم الفني</SectionTitle>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={6}>
                <Text style={[styles.star, n <= rating && styles.starOn]}>★</Text>
              </Pressable>
            ))}
          </View>
          <Field value={review} onChangeText={setReview} placeholder="اكتب رأيك في الخدمة (اختياري)" multiline />
          <Button
            title="إرسال التقييم"
            disabled={!rating}
            loading={busy}
            onPress={() =>
              run(
                () => supabase.rpc("rate_service_order", { p_order_id: order.id, p_rating: rating, p_review: review.trim() || null }),
                "شكرًا لتقييمك"
              )
            }
          />
        </Card>
      )}
      {order.rating != null && (
        <Card>
          <SectionTitle>التقييم</SectionTitle>
          <Text style={[styles.star, styles.starOn, { fontSize: 22 }]}>{"★".repeat(order.rating)}</Text>
          {!!order.review && <Text style={styles.desc}>{order.review}</Text>}
        </Card>
      )}
    </Screen>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const STEPS = [
  { key: "open", label: "تم إرسال الطلب", at: "created_at" },
  { key: "accepted", label: "قبول الفني", at: "accepted_at" },
  { key: "in_progress", label: "جارٍ التنفيذ" },
  { key: "completed", label: "تم الإنجاز", at: "completed_at" },
];

function Timeline({ order }) {
  if (order.status === "cancelled") return null;
  const current = STEPS.findIndex((s) => s.key === order.status);
  return (
    <Card>
      {STEPS.map((s, i) => {
        const done = i <= current;
        return (
          <View key={s.key} style={styles.step}>
            <View style={[styles.dot, done && styles.dotOn]}>{done && <Text style={styles.check}>✓</Text>}</View>
            <Text style={[styles.stepLabel, done && { color: colors.ink }]}>{s.label}</Text>
            {s.at && order[s.at] && <Text style={styles.stepTime}>{formatDate(order[s.at])}</Text>}
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  icon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginEnd: 12 },
  cat: { fontSize: 12, color: colors.muted, fontWeight: "600" },
  title: { fontSize: 18, fontWeight: "900", color: colors.ink, marginTop: 2 },
  pills: { flexDirection: "row", gap: 6, marginBottom: 10 },
  desc: { fontSize: 14, color: colors.ink, lineHeight: 22, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  rowLabel: { fontSize: 13, color: colors.muted },
  rowValue: { fontSize: 13, fontWeight: "700", color: colors.ink },
  person: { fontSize: 16, fontWeight: "800", color: colors.ink },
  sub: { fontSize: 13, color: colors.muted, marginTop: 4 },
  step: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, marginEnd: 10, alignItems: "center", justifyContent: "center" },
  dotOn: { backgroundColor: colors.teal, borderColor: colors.teal },
  check: { color: "#fff", fontSize: 12, fontWeight: "900" },
  stepLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: colors.faint },
  stepTime: { fontSize: 11, color: colors.muted },
  stars: { flexDirection: "row", gap: 8, marginBottom: 12 },
  star: { fontSize: 34, color: colors.border },
  starOn: { color: colors.amber },
});
