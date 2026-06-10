## التشخيص

السيرفر بُني وانطلق بنجاح (`Listening on http://localhost:3000`) — Nitro يعمل والـ Dockerfile صحيح. الفشل سببه **متغيرات بيئة ناقصة في Coolify فقط**، لا في الكود:

```
[Supabase] Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
[Supabase] Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
```

كل طلب SSR يستدعي `redirectsMiddleware` → `supabaseAdmin` → يرمي لأن `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` غير موجودة. الـ healthcheck يفشل لأن الصفحة الرئيسية ترجع 500.

بالإضافة، Coolify يحذّر من `NODE_ENV=production` كـ Build Variable لأنه يمنع تثبيت devDependencies (Vite/TypeScript).

## الإصلاحات (إعدادات Coolify فقط — لا تعديل كود)

### 1) إزالة `NODE_ENV=production` من Build Variables

في Coolify → Environment Variables:
- ابحث عن `NODE_ENV` وأزل علامة **"Available at Buildtime"** (أو احذف المتغير كلياً — الـ Dockerfile يضبط `NODE_ENV=production` في طبقة runtime بنفسه عبر `ENV NODE_ENV=production`).

### 2) إضافة Build Variables (مع علامة "Build Variable" / "Available at Buildtime")

هذه يدمجها Vite في bundle العميل وقت البناء:

| الاسم | القيمة |
|---|---|
| `VITE_SUPABASE_URL` | `https://supabase.art-traffics.com` (أو رابط Supabase الذاتي عندك) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon key من Supabase |
| `VITE_SUPABASE_PROJECT_ID` | `self-hosted` |

### 3) إضافة Runtime Variables (بدون علامة Build)

هذه يقرأها سيرفر Node وقت التشغيل:

| الاسم | القيمة |
|---|---|
| `SUPABASE_URL` | نفس رابط Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | نفس anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key (server-only) |
| `PORT` | `3000` |
| `HOST` | `0.0.0.0` |

> ملاحظة: `SUPABASE_SERVICE_ROLE_KEY` لا تضع لها بادئة `VITE_` أبداً ولا تجعلها Build Variable.

### 4) إصلاح الـ Healthcheck (اختياري لكن مهم)

تحذير Coolify: `wget` غير موجود في `node:20-alpine`. خياران:

- **أ) عطّل healthcheck في Coolify UI** (Application → Healthcheck → Disabled).
- **ب) أو في build mode سأعدّل `Dockerfile` لإضافة `RUN apk add --no-cache wget`** في طبقة runtime.

### 5) إعادة النشر

بعد إضافة المتغيرات: Redeploy. توقّع رؤية الصفحة الرئيسية تعمل، وإذا بقي خطأ ستظهر stack trace حقيقية في `docker logs`.

## ما لن يتغير

- لا تعديل على الكود إلا إذا اخترت الخيار (4-ب) لإضافة `wget`.
- لا تعديل على schema قاعدة البيانات.

## ما عليك تأكيده قبل التنفيذ

1. هل تريدني (في build mode) أن أعدّل `Dockerfile` لإضافة `wget` لحل تحذير healthcheck؟ أم ستعطّله من Coolify UI؟
2. هل رابط Supabase الذاتي عندك هو `https://supabase.art-traffics.com` أم رابط آخر؟
