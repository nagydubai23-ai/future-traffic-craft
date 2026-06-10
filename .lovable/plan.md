## التشخيص النهائي — احتمال A مؤكد

### السبب الجذري
المفاتيح اللي محطوطة في Coolify (`SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SERVICE_ROLE_KEY`) **مش بتاعت** الـ Supabase self-hosted بتاعك على `supabase.art-traffics.com`. دي مفاتيح مشروع Lovable Cloud الأصلي.

لما الـ JWT بيتفك على Kong بتاعك، الـ signature بيتعمله verify بـ `JWT_SECRET=BW9JZhGrBC3Vi2UF9dtXJ2QgBzRBV3qC` ← ومفاتيح Lovable Cloud اتوقعت بـ secret تاني خالص → Kong يرفضها بـ 401.

ده يفسر:
- `/rest/v1/site_settings` → **401** (المفتاح المرسل من المتصفح مرفوض)
- `/` → **500** (السيرفر بيحاول يقرأ من Supabase بمفتاح Service Role مرفوض كمان)

---

### الإصلاح المطلوب (في Coolify، مش في الكود)

افتح **Environment Variables** للمشروع في Coolify، وحدّث القيم دي بالضبط:

| المتغير | القيمة الجديدة | Build | Runtime |
|---|---|---|---|
| `VITE_SUPABASE_URL` | `https://supabase.art-traffics.com` | ✅ | ✅ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.dfPPchPVRhLR4QlteMcQFIZqH7W_ojc7RrrQHvvyscQ` | ✅ | ✅ |
| `SUPABASE_URL` | `https://supabase.art-traffics.com` | ❌ | ✅ |
| `SUPABASE_PUBLISHABLE_KEY` | نفس قيمة `VITE_SUPABASE_PUBLISHABLE_KEY` فوق | ❌ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.ZPUqeE6Q30xQYM4tnq7VgbP0Y8BdWWcCYh4qwf7Pyfg` | ❌ | ✅ |

بعدين اضغط **Redeploy** (مش Restart — لازم rebuild عشان الـ `VITE_*` تتحقن في الـ bundle).

---

### التحقق بعد الـ Redeploy

١) من المتصفح: افتح أي صفحة وشوف `Network` → request لـ `site_settings` لازم يرجع **200**.

٢) من السيرفر، اختبار مباشر (سطر واحد، نضيف):
```bash
curl -i "https://supabase.art-traffics.com/rest/v1/site_settings?select=key&limit=1" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.dfPPchPVRhLR4QlteMcQFIZqH7W_ojc7RrrQHvvyscQ" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.dfPPchPVRhLR4QlteMcQFIZqH7W_ojc7RrrQHvvyscQ"
```
المتوقع: **200** + JSON بالبيانات (أو `[]` لو الجدول فاضي).

---

### ملاحظات أمنية مهمة (بعد ما تشتغل)

١. **مفاتيح Lovable Cloud القديمة** اللي كانت في Coolify لازم تتشال نهائيًا.

٢. **JWT_SECRET** بتاعك (`BW9JZhGrBC3Vi2UF9dtXJ2QgBzRBV3qC`) اتسرّب في الشات دلوقتي. ينصح بشدة تعمل rotate له (وللمفاتيح المشتقة منه) بعد ما تستقر النسخة الشغالة.

٣. الـ `GOTRUE_SITE_URL=https://art-traffics.com` — تأكد إن ده الدومين النهائي للتطبيق، عشان روابط تأكيد الإيميل/استرجاع الباسورد تشتغل صح.

---

### مفيش أي تعديل على الكود
كل المشكلة في إعداد البيئة في Coolify. الكود سليم.