# بيت المصور — BM Platform

منصة LMS/e-commerce عربية (RTL) لتعليم التصوير الفوتوغرافي وصناعة الأفلام.

## Stack

- Next.js 15 · React 18 · Prisma · PostgreSQL · NextAuth v5
- Tailwind CSS · UploadThing · Resend · Moyasar / Tamara / Tabby

## البدء السريع

```bash
npm install
cp .env.example .env   # ثم عدّل المتغيرات
npx prisma db push
npx prisma db seed     # بيانات تجريبية
npm run dev
```

## النشر

راجع **[DEPLOY.md](./DEPLOY.md)** للتفاصيل الكاملة (Railway، متغيرات البيئة، webhooks).

## الاختبار

```bash
npm run build
npm run test:e2e
npx tsx scratch/test_crm.ts
```

## الأدوار

| الدور | المسار |
|-------|--------|
| Admin | `/dashboard/admin` |
| Instructor | `/dashboard/instructor` |
| Student | `/dashboard/student` |

## المستودع

https://github.com/zagweb101/platformBM
