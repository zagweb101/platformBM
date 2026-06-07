# دليل النشر — بيت المصور

## المتطلبات

- Node.js 20+
- PostgreSQL
- حساب [Railway](https://railway.app) أو Vercel + DB
- [Resend](https://resend.com) للبريد
- [UploadThing](https://uploadthing.com) لرفع الإيصالات

## متغيرات البيئة (إلزامية)

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=至少-32-characters-random-string
NEXTAUTH_URL=https://your-production-domain.com
RESEND_API_KEY=re_...
EMAIL_FROM="بيت المصور <noreply@yourdomain.com>"
CONTACT_ADMIN_EMAIL=info@baytalmosawer.com
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

> **مهم:** `NEXTAUTH_URL` يجب أن يطابق رابط الإنتاج بالضبط.

## متغيرات الدفع (اختياري — يُفعّل تلقائياً عند الإضافة)

```env
MOYASAR_SECRET_KEY=...
MOYASAR_PUBLISHABLE_KEY=...
TAMARA_API_TOKEN=...
TAMARA_NOTIFICATION_TOKEN=...
TAMARA_API_URL=https://api-sandbox.tamara.co
TABBY_SECRET_KEY=...
TABBY_PUBLIC_KEY=...
TABBY_MERCHANT_CODE=...
TABBY_API_URL=https://api.tabby.sa
```

## حماية الفيديو (موصى به للإطلاق التجاري)

```env
CLOUDFLARE_STREAM_CUSTOMER_CODE=...
CLOUDFLARE_STREAM_KEY_ID=...
CLOUDFLARE_STREAM_SIGNING_KEY=...
VIMEO_ACCESS_TOKEN=...
```

- أدخل فيديو الدورة كـ `cfstream:UID` أو رابط Vimeo
- بدون Cloudflare/Vimeo: روابط MP4 المباشرة تعمل تلقائياً
- مع Cloudflare/Vimeo: MP4 المباشر يُحجب (استخدم `ALLOW_DIRECT_VIDEO_URLS=true` للتجاوز)

## Railway

1. اربط المستودع: `https://github.com/zagweb101/platformBM`
2. أضف PostgreSQL service
3. اضبط المتغيرات أعلاه
4. Build: `nixpacks.toml` يشغّل `prisma generate` + `next build`
5. بعد أول نشر: `npx prisma db push` من Railway Shell
6. (اختياري) `npx prisma db seed` للبيانات التجريبية

## Webhooks

| المزود | URL |
|--------|-----|
| Tamara | `{NEXTAUTH_URL}/api/webhooks/tamara` |
| Tabby | `{NEXTAUTH_URL}/api/webhooks/tabby` |
| Moyasar callback | `{NEXTAUTH_URL}/api/payments/moyasar/callback` |

## التحقق بعد النشر

- [ ] `/login` — تسجيل الدخول
- [ ] `/privacy-policy` — سياسة الخصوصية
- [ ] `/dashboard/admin` — لوحة الأدمن
- [ ] `/dashboard/student/payments` — الدفع
- [ ] مشغّل الفيديو للطالب المسجّل
- [ ] نموذج التواصل + `/dashboard/admin/contacts`

## أوامر محلية

```bash
npm install
npx prisma db push
npm run dev
npm run build
npm run test:e2e
npx tsx scratch/test_crm.ts
```

## حسابات seed (بعد `prisma db seed`)

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| Admin | admin@baytalmosawer.com | Admin@123456 |
| Instructor | ahmed@baytalmosawer.com | Instructor@123 |
| Student | khaled@example.com | Student@123 |
