// الدخول برقم الجوال وكلمة المرور بدون إيميل:
// نحوّل رقم الجوال داخليًا إلى معرّف ثابت يستخدمه Supabase كاسم دخول.
const LOGIN_DOMAIN = "nabd-services.app";

export function normalizePhone(value) {
  const latin = String(value || "")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  return latin.replace(/\D/g, "");
}

export function isValidPhone(value) {
  const digits = normalizePhone(value);
  return digits.length >= 9 && digits.length <= 15;
}

export function phoneToLoginId(value) {
  return `${normalizePhone(value)}@${LOGIN_DOMAIN}`;
}
