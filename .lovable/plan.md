## الهدف
جعل meta title و meta description لكل صفحة ثابتة قابلة للتعديل من لوحة التحكم (المقالات والخدمات والمدن لديها بالفعل عبر تبويب SEO).

## الصفحات المشمولة
- الرئيسية `/`
- من نحن `/about`
- تواصل معنا `/contact`
- الخدمات `/services`
- المدونة `/blog`
- المشاريع `/projects`

## التنفيذ

### 1. تخزين في قاعدة البيانات
استخدام جدول `site_settings` الموجود (key/value). لكل صفحة مفتاحان:
- `seo:<page>:title`
- `seo:<page>:description`

(لا حاجة لمايقريشن — الجدول جاهز.)

### 2. لوحة التحكم
تبويب جديد في admin اسمه **"SEO الصفحات الثابتة"** يعرض قائمة بالصفحات الستة، ولكل صفحة:
- حقل Meta Title (مع عداد ≤60)
- حقل Meta Description (مع عداد ≤160)
- زر حفظ موحّد

ملف جديد: `src/components/admin/StaticPagesSeoPanel.tsx`.

### 3. تحميل القيم في كل صفحة
- إضافة server function `getStaticPageSeo({ page })` في `src/lib/content.functions.ts` تقرأ المفتاحين وترجع `{ title, description }` مع fallback للقيم الحالية المكتوبة في الكود.
- استدعاؤها من `loader` في كل صفحة من الست، ثم استخدام النتيجة داخل `head({ loaderData })` لتعيين `title` و `description` و `og:title` و `og:description`.
- القيم الحالية في الكود تبقى كـ defaults حتى لا تتعطل الصفحات قبل الحفظ.

### 4. ما لن يتغير
- لا تعديل على routes أو مخطط قاعدة البيانات.
- المقالات/الخدمات/المدن تبقى تستخدم حقول SEO الموجودة لديها.
- لا تغيير على بقية الميزات.

## تأكيد
هل تريد أن أضمّن أيضاً حقول og:image و canonical للصفحات الثابتة، أم نكتفي بـ title و description فقط؟
