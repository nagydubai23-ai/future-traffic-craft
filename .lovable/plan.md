# خطة التشخيص

## النتيجة الحالية
المؤشرات الحالية تقول إن المشكلة **ليست من الواجهة نفسها**، بل من فرق التهيئة بين بيئة Lovable الحالية وبيئة النشر الذاتي على Coolify:

- في المعاينة الحالية، طلبات `site_settings` ترجع `200`.
- في النشر الذاتي عندك، نفس المسار يرجع `401 Unauthorized`.
- الصفحة الرئيسية `/` عندك ترجع `500` لأن لودر الصفحة يعتمد على قراءة SEO من `site_settings` عبر سيرفر التطبيق.

## ما الذي سأثبّته في التشخيص
1. **هل `SUPABASE_URL` في Coolify يشير فعلاً إلى نفس الـ backend المقصود؟**
   - لأن `401` من `/rest/v1/site_settings` يعني غالباً أن الـ URL أو الـ key أو إعداد auth على هذا الـ backend لا يطابق ما يتوقعه التطبيق.

2. **هل `SUPABASE_PUBLISHABLE_KEY` و `VITE_SUPABASE_PUBLISHABLE_KEY` هما فعلاً مفتاح الـ anon / publishable الخاص بنفس البيئة؟**
   - لو المفتاح من مشروع/بيئة مختلفة، فالـ REST API يرد `401` مباشرة.

3. **هل المتغيرات موزعة صح بين Build و Runtime؟**
   - Build: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
   - Runtime: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - وجود المفتاح في Build فقط لا يكفي لتشغيل SSR واللودرز.

4. **هل خدمة الـ backend نفسها تقبل الـ anon key عبر الدومين `supabase.art-traffics.com` من داخل المتصفح ومن داخل التطبيق؟**
   - لو في mismatch بين الدومين/المفاتيح/إعدادات gateway، سيظهر `401` حتى لو الجدول والسياسات صحيحة.

5. **هل سبب `500` على `/` تابع مباشرة لفشل قراءة `site_settings`؟**
   - الصفحة الرئيسية تستخدم loader يستدعي `getStaticPageSeo`، وهذا يقرأ `site_settings` من السيرفر.
   - إذا فشل الاتصال أو كانت مفاتيح runtime غير صحيحة، فالصفحة ستفشل على أول request.

## لماذا هذا هو الاتجاه الصحيح
من الكود الحالي:

- `src/routes/index.tsx` يستدعي `getStaticPageSeo` داخل loader للصفحة الرئيسية.
- `src/lib/content.functions.ts` ينفّذ القراءة من `site_settings` عبر عميل admin server-side.
- `src/integrations/supabase/client.server.ts` يعتمد على:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- بينما الـ panels في لوحة الإدارة تعتمد على browser client، والذي يحتاج:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

لذلك عندك مساران متأثران:
- **401 في المتصفح** = غالباً مشكلة `VITE_*` / publishable key / backend domain.
- **500 في الصفحة الرئيسية** = غالباً مشكلة `SUPABASE_URL` أو `SUPABASE_SERVICE_ROLE_KEY` runtime.

## مخرجات التشخيص المطلوبة
بعد تنفيذ هذه الخطة، سيكون عندنا حكم واضح بين 3 احتمالات:

### الاحتمال A — مفاتيح العميل خاطئة أو تخص بيئة أخرى
العلامة:
- طلبات `/rest/v1/site_settings` من المتصفح ترجع `401`.

### الاحتمال B — مفاتيح السيرفر runtime ناقصة أو خاطئة
العلامة:
- الصفحة `/` ترجع `500` حتى لو التطبيق يبدأ على المنفذ 3000.

### الاحتمال C — الدومين `supabase.art-traffics.com` نفسه ليس مهيأ صح مع الـ backend gateway
العلامة:
- كل من browser requests و SSR requests يفشلون رغم وجود متغيرات شكلها صحيح.

## تفاصيل تقنية
```text
/ (home)
  -> loader in src/routes/index.tsx
  -> getStaticPageSeo()
  -> server admin client
  -> site_settings
  -> if runtime env invalid => 500

Admin panels / browser requests
  -> supabase browser client
  -> VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
  -> if wrong/mismatched => 401
```

## ما لن أفعله في هذا النطاق
- لن أعدّل الكود.
- لن أضيف health endpoint.
- لن أغيّر Dockerfile.
- لن ألمس سياسات الجدول قبل إثبات أن المشكلة ليست مجرد mismatch في البيئة.

## القرار المتوقع بعد التشخيص
إذا وافقت على التنفيذ لاحقاً، فالإجراء الأقرب سيكون أحد التالي فقط:
- تصحيح متغيرات Coolify بدون تعديل كود.
- أو تثبيت أن دومين الـ backend / gateway مهيأ بشكل خاطئ.
- أو بعدها فقط ننتقل لتعديل كود يفصل healthcheck عن الصفحة الرئيسية.