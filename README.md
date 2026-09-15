# نبض — نظام تشغيل وصيانة المرافق

نظام حقيقي: تسجيل دخول فعلي + قاعدة بيانات (Supabase) + استضافة مجانية (Vercel).

## الخطوة 1: إنشاء قاعدة البيانات (Supabase)

1. اذهب إلى https://supabase.com وأنشئ حساب مجاني، ثم اضغط **New Project**.
2. اختر اسم للمشروع وكلمة مرور لقاعدة البيانات (احفظها).
3. بعد إنشاء المشروع، من القائمة الجانبية اذهب إلى **SQL Editor** → **New query**.
4. افتح ملف `supabase/schema.sql` من هذا المشروع، انسخ محتواه بالكامل، والصقه في المحرر، ثم اضغط **Run**.
5. اذهب إلى **Project Settings** → **API**. انسخ القيمتين:
   - `Project URL`
   - `anon public key`

## الخطوة 2: تجهيز الكود

1. فك ضغط مجلد المشروع.
2. أنشئ ملف اسمه `.env.local` في جذر المشروع (بجانب `package.json`) بنفس محتوى `.env.local.example`، واستبدل القيمتين بالقيم اللي نسختها من Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
   ```
3. (اختياري للتجربة على جهازك قبل النشر):
   ```
   npm install
   npm run dev
   ```
   ثم افتح http://localhost:3000

## الخطوة 3: رفع الكود على GitHub

1. أنشئ حساب على https://github.com إذا لم يكن عندك.
2. أنشئ مستودع (repository) جديد فارغ، مثلاً باسم `nabd-oms`.
3. من داخل مجلد المشروع على جهازك:
   ```
   git init
   git add .
   git commit -m "نسخة أولى"
   git branch -M main
   git remote add origin https://github.com/USERNAME/nabd-oms.git
   git push -u origin main
   ```

## الخطوة 4: النشر على الإنترنت (Vercel)

1. اذهب إلى https://vercel.com وسجّل دخول بحساب GitHub.
2. اضغط **Add New Project** واختر المستودع `nabd-oms`.
3. في خطوة **Environment Variables** أضف:
   - `NEXT_PUBLIC_SUPABASE_URL` = نفس القيمة من Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = نفس القيمة من Supabase
4. اضغط **Deploy** وانتظر دقيقة إلى دقيقتين.
5. هتحصل على رابط جاهز زي: `https://nabd-oms.vercel.app` — ده رابط النظام الحقيقي شغّال على الإنترنت.

## الخطوة 5: إنشاء أول مستخدم

- افتح الرابط، اضغط **حساب جديد**، سجّل بياناتك.
- بشكل افتراضي Supabase بيبعت إيميل تأكيد. من لوحة Supabase → **Authentication** → **Settings** تقدر توقف خطوة تأكيد الإيميل مؤقتًا أثناء التجربة.
- لإضافة موظفين لاحقًا: كل موظف يعمل "حساب جديد" من نفس الصفحة، أو تقدر تضيفهم يدويًا من **Authentication** → **Users** في Supabase.

## ملاحظات أمان مهمة قبل الاستخدام الفعلي في المستشفى

- فعّل تأكيد البريد الإلكتروني (Email confirmations) في Supabase قبل الإطلاق الحقيقي.
- فكّر في تقييد التسجيل الذاتي (Sign up) وخليه بس عن طريق الإدارة، عشان محدش يعمل حساب من برّه.
- أضف أدوار صلاحيات (admin / engineer / technician) في جدول `profiles` وابني عليها قواعد RLS أدق لو النظام هيتوسع.
- خد نسخة احتياطية دورية من قاعدة البيانات من إعدادات Supabase.

## هيكل المشروع

```
app/
  login/          صفحة تسجيل الدخول وإنشاء حساب
  dashboard/       لوحة التحكم (محمية، تتطلب تسجيل دخول)
    requests/      صفحة بلاغات الصيانة (إضافة/متابعة/إنهاء)
components/         مكونات الواجهة القابلة لإعادة الاستخدام
lib/supabase/       عملاء الاتصال بقاعدة البيانات
supabase/schema.sql  أوامر إنشاء الجداول والصلاحيات
```

الوحدات الظاهرة في الشريط الجانبي كـ"قريبًا" (إدارة الأصول، الصيانة الدورية، المستودعات) مش متفعّلة بعد — دي خطوة تالية لو حبيت نضيفها بنفس الطريقة.
