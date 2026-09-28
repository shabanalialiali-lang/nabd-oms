import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../constants/theme";
import { STATUS } from "../constants/status";

export function Screen({ children, scroll = true, style, ...rest }) {
  if (!scroll) return <View style={[styles.screen, style]}>{children}</View>;
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.screenContent, style]}
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = "primary", loading, disabled, style }) {
  const v = variants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        (pressed || disabled || loading) && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : <Text style={[styles.buttonText, { color: v.fg }]}>{title}</Text>}
    </Pressable>
  );
}

const variants = {
  primary: { bg: colors.tealDeep, fg: "#fff", border: colors.tealDeep },
  danger: { bg: colors.pulseSoft, fg: colors.pulse, border: colors.pulseSoft },
  outline: { bg: "#fff", fg: colors.ink, border: colors.border },
  success: { bg: colors.green, fg: "#fff", border: colors.green },
};

export function Field({ label, style, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput placeholderTextColor={colors.faint} style={[styles.input, inputProps.multiline && styles.multiline]} {...inputProps} />
    </View>
  );
}

export function Chip({ label, selected, onPress, icon }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {icon ? `${icon} ` : ""}
        {label}
      </Text>
    </Pressable>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => (
        <Pressable key={o.value} onPress={() => onChange(o.value)} style={[styles.segment, value === o.value && styles.segmentActive]}>
          <Text style={[styles.segmentText, value === o.value && styles.segmentTextActive]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function StatusPill({ value }) {
  const s = STATUS[value] || { label: value, fg: colors.muted, bg: "#EEF1F1" };
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <Text style={[styles.pillText, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

export function EmptyState({ icon = "📭", title, subtitle, children }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
      {children}
    </View>
  );
}

export function Loading() {
  return (
    <View style={[styles.screen, { alignItems: "center", justifyContent: "center" }]}>
      <ActivityIndicator size="large" color={colors.teal} />
    </View>
  );
}

export function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  screenContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonText: { fontSize: 15, fontWeight: "700" },
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 6 },
  input: {
    backgroundColor: "#F8FAFA",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.ink,
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
    marginBottom: 8,
    marginEnd: 8,
  },
  chipSelected: { backgroundColor: colors.tealDeep, borderColor: colors.tealDeep },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.ink },
  chipTextSelected: { color: "#fff" },
  segmented: { flexDirection: "row", backgroundColor: "#E9EEEE", borderRadius: radius.md, padding: 4, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, alignItems: "center" },
  segmentActive: { backgroundColor: "#fff" },
  segmentText: { fontWeight: "700", color: colors.muted },
  segmentTextActive: { color: colors.tealDeep },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  pillText: { fontSize: 12, fontWeight: "700" },
  empty: { alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  emptyIcon: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: colors.ink, textAlign: "center" },
  emptySub: { fontSize: 13, color: colors.muted, marginTop: 6, textAlign: "center", lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: colors.ink, marginBottom: 10, marginTop: 6 },
});
