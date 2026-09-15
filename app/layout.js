import "./globals.css";

export const metadata = {
  title: "نبض | نظام تشغيل وصيانة المرافق",
  description: "نظام إدارة صيانة وأصول المستشفى",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
