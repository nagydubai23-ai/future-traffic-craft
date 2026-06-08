## الهدف
تصدير نسخة كاملة من قاعدة بيانات Lovable Cloud الحالية في ملف SQL واحد، جاهز لرفعه على سيرفر Hetzner لاحقًا.

## الخطوات

1. **تشغيل سكريبت تصدير** يستخدم `pg_dump` على قاعدة البيانات الحالية عبر `SUPABASE_DB_URL` المتاح في البيئة.

2. **إنتاج 3 ملفات** في مجلد `/mnt/documents/db-backup-2026-06-08/`:
   - `schema.sql` — هيكل الجداول والـ policies والـ functions (DDL فقط)
   - `data.sql` — كل البيانات في جداول `public` (29 جدول blog_posts, services, projects, cities, إلخ)
   - `auth_users.sql` — مستخدمي `auth.users` و `auth.identities` مع الحفاظ على الـ UUIDs

3. **تصدير ملفات Storage** من bucket `cms-images` كملف مضغوط `cms-images.tar.gz` في نفس المجلد (عبر سكريبت `deploy/storage-export.mjs` الموجود مسبقًا).

4. **حزم كل شيء** في ملف واحد `database-backup-2026-06-08.zip` يحتوي على:
   - الـ 3 ملفات SQL
   - أرشيف الـ storage
   - ملف `README.md` بتعليمات الاستيراد المختصرة

5. **عرض الملف** عبر `<presentation-artifact>` لتحميله مباشرة.

## ملاحظات تقنية
- السكريبتات الموجودة في `deploy/db-export.sh` و `deploy/storage-export.sh` تتطلب تشغيلًا محليًا. هذه الخطة تنفذها مباشرة من البيئة الحالية بدون الحاجة لجهازك.
- الملف الناتج يصلح للاستيراد على أي Postgres 15+ (بما فيها Supabase الذاتي على Coolify).
- لن يتم أي تعديل على الكود أو قاعدة البيانات — قراءة فقط.

اضغط "Implement plan" لبدء التصدير.