من ملف Supabase self-hosted بتاعك، استخرجت القيم الصحيحة. ضيفهم في **Coolify → Application (مش Supabase) → Environment Variables** بالظبط كده:

## 1) Runtime Variables (بدون علامة "Build Variable")

| الاسم | القيمة |
|---|---|
| `SUPABASE_URL` | `https://supabase.art-traffics.com` |
| `SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.dfPPchPVRhLR4QlteMcQFIZqH7W_ojc7RrrQHvvyscQ` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.ZPUqeE6Q30xQYM4tnq7VgbP0Y8BdWWcCYh4qwf7Pyfg` |

## 2) Build Variables (علّم "Available at Buildtime")

| الاسم | القيمة |
|---|---|
| `VITE_SUPABASE_URL` | `https://supabase.art-traffics.com` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | نفس قيمة `SUPABASE_PUBLISHABLE_KEY` فوق (الـ anon key) |

## 3) Redeploy

بعد إضافة المتغيرات → Redeploy. السيرفر هيلاقي القيم وهيشتغل.

---

## ⚠️ تحذير أمني مهم جداً

أنت لسه نشرت في الشات قيم سرية (service role key + كل كلمات السر). **غير كل القيم دي فوراً** في Supabase بتاعك على Coolify:
- `SERVICE_PASSWORD_JWT` (الأخطر — لو اتسرب أي حد يقدر يعمل توكنز لأي مستخدم)
- `SERVICE_PASSWORD_POSTGRES`, `SERVICE_PASSWORD_ADMIN`, و باقي الباسوردات
- الـ JWT keys هتتولد جديدة تلقائياً لما تغير `JWT_SECRET`

## ملاحظة على إعداد Supabase نفسه

شايف عندك:
```
GOTRUE_SITE_URL=https://supabase.art-traffics.com:8000
API_EXTERNAL_URL=https://supabase.art-traffics.com:8000
```

الـ `:8000` غريب لو عندك Cloudflare/Traefik على 443. لو موقعك الفعلي للأبليكيشن مثلاً `https://art-traffics.com`، لازم تعدّل:
- `GOTRUE_SITE_URL` → دومين موقعك الأساسي (مش Supabase)
- `ADDITIONAL_REDIRECT_URLS` → ضيف فيه دومين موقعك

لكن دي مشكلة منفصلة عن الـ deployment الحالي — أول حاجة خلي الأبليكيشن يشتغل بالخطوات فوق، وبعدين نتعامل مع auth redirects.
