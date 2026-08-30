# نشرة أخبار المدرسة

موقع إخباري عام لمدرسة خاصة، مبني بـ Next.js (App Router) و Supabase، مع لوحة تحكم خاصة للإدارة غير التقنية لإضافة وتعديل وحذف الأخبار.

## المكدس التقني

- **Next.js 16 (App Router, TypeScript)** — توليد ثابت + ISR لكل الصفحات العامة
- **Supabase** — قاعدة بيانات Postgres، مصادقة (Auth)، وتخزين ملفات (Storage)
- **Tailwind CSS v4**
- **Vercel** كهدف نشر

## 1) إنشاء مشروع Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com).
2. من `Project Settings → API`، انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (اختياري) `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## 2) تشغيل الـ migration

من `SQL Editor` في لوحة تحكم Supabase، الصق محتوى [`supabase/migration.sql`](supabase/migration.sql) بالكامل ثم نفّذه. هذا الملف ينشئ:

- جدول `news` وسياسات RLS الخاصة به
- جدول `site_settings` (صف واحد فقط) وسياسات RLS الخاصة به
- حاويتي التخزين `news-images` و `site-assets` مع سياسات القراءة العامة والكتابة للمصادَقين فقط
- بيانات أولية (٦ أخبار تجريبية) لتوزّع على كل التصنيفات

بدلًا من ذلك، يمكن استخدام Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## 3) إنشاء حساب المسؤول (Admin)

من `Authentication → Users` في لوحة Supabase، أضف مستخدمًا يدويًا (بريد إلكتروني + كلمة مرور). هذا هو الحساب الذي سيسجل به المسؤول الدخول على `/admin/login`.

> ملاحظة: سياسات RLS في هذا المشروع تمنح صلاحية الكتابة الكاملة لأي مستخدم مُصادَق عليه (`auth.role() = 'authenticated'`). إن أردت تقييدها لمستخدمين محددين، عدّل السياسات في `supabase/migration.sql` لتتحقق من `auth.uid()` مقابل جدول مسؤولين مخصص.

## 4) متغيرات البيئة

انسخ `.env.example` إلى `.env.local` واملأ القيم:

```bash
cp .env.example .env.local
```

## 5) التشغيل محليًا

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) للموقع العام، و [http://localhost:3000/admin/login](http://localhost:3000/admin/login) للوحة التحكم.

## 6) النشر على Vercel

1. ادفع المشروع إلى مستودع Git (GitHub/GitLab/Bitbucket).
2. من [vercel.com](https://vercel.com)، استورد المستودع.
3. أضف نفس متغيرات البيئة من `.env.example` في إعدادات المشروع على Vercel (`Settings → Environment Variables`).
4. اضبط `NEXT_PUBLIC_SITE_URL` على نطاق الإنتاج الفعلي (مطلوب لصحة `sitemap.xml` وعلامات Open Graph).
5. انشر المشروع.

## بنية المشروع

```
app/
  (public)/            الصفحات العامة (الرئيسية، الأخبار، التصنيفات) — تشترك في القالب مع الترويسة والتذييل
  admin/                لوحة التحكم المحمية (دخول، إدارة الأخبار، الإعدادات)
  sitemap.ts            توليد خريطة الموقع ديناميكيًا من الأخبار المنشورة
  robots.ts             السماح للزواحف بالموقع العام ومنعها من /admin
lib/
  categories.ts          تعريف التصنيفات الخمسة وألوانها
  data.ts                دوال قراءة البيانات من Supabase (خوادم)
  supabase/               عملاء Supabase (متصفح، خادم، middleware)
components/
  admin/                  مكونات لوحة التحكم (نماذج، تسجيل خروج، حذف)
supabase/
  migration.sql           مخطط قاعدة البيانات الكامل + RLS + التخزين + بيانات أولية
```

## ملاحظات SEO

- كل صفحة عامة تُولّد ثابتًا مع `revalidate: 60` (ISR)، وتحتوي HTML الكامل من أول تحميل (بدون الاعتماد على JavaScript من جهة العميل).
- `generateMetadata` في `/news/[slug]` ينتج عنوانًا ووصفًا وعلامات Open Graph حقيقية لكل خبر.
- `app/sitemap.ts` يولّد خريطة موقع تشمل كل خبر منشور.
- `app/robots.ts` يسمح بفهرسة الموقع العام ويمنع `/admin`.
- صفحات `/admin/*` تحمل `robots: { index: false, follow: false }`.
