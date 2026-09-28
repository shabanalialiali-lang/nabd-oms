import { colors } from "./theme";

export const STATUS = {
  open: { label: "بانتظار فني", fg: colors.amber, bg: colors.amberSoft },
  accepted: { label: "تم قبول الطلب", fg: colors.teal, bg: colors.tealSoft },
  in_progress: { label: "جارٍ التنفيذ", fg: "#2F6FDB", bg: "#E6EEFB" },
  completed: { label: "مكتمل", fg: colors.green, bg: colors.greenSoft },
  cancelled: { label: "ملغي", fg: colors.muted, bg: "#EEF1F1" },
  urgent: { label: "طارئ", fg: colors.pulse, bg: colors.pulseSoft },
};

export const PREFERRED_TIMES = ["في أسرع وقت", "اليوم", "غدًا", "خلال الأسبوع"];

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
