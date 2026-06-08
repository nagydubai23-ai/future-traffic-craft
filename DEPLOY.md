# دليل نشر الموقع على Hetzner + Coolify

> الهدف: تشغيل الموقع بالكامل (التطبيق + قاعدة البيانات + المصادقة + التخزين) على سيرفر Hetzner واحد، بدون أي اعتماد على Lovable Cloud بعد النقل.

## المتطلبات

- سيرفر Hetzner (موصى به: **CX33** — 8GB RAM، 80GB SSD).
- نطاق (Domain) جاهز، وقدرة التحكم في DNS عنده.
- على جهازك المحلي: `pg_dump 15+`، `bun` أو `node 20+`، `git`.

---

## 1. تجهيز السيرفر وتثبيت Coolify

```bash
ssh root@<server-ip>
apt update && apt upgrade -y
curl -fsSL https://cdn.coolify.io/coolify/install.sh | bash
```

بعد التثبيت افتح `http://<server-ip>:8000`، أنشئ حساب admin، وأضف النطاق `coolify.yourdomain.com` لـ Coolify نفسه.

---

## 2. ربط النطاق

في إعدادات DNS:

| Type | Name | Value |
| ---- | ---- | ----- |
| A | `@` | `<server-ip>` |
| A | `www` | `<server-ip>` |
| A | `supabase` | `<server-ip>` |

---

## 3. نشر Supabase على السيرفر

1. Coolify → **New Resource** → **Database** → **Supabase** → Deploy.
2. بعد التشغيل: افتح Supabase → **Domains** → اضبط نطاق kong على
   `https://supabase.yourdomain.com`. Coolify يصدر SSL تلقائياً.
3. من **Environment Variables** للخدمة انسخ:
   - `SUPABASE_ANON_KEY`
   - `SERVICE_ROLE_KEY`
   - `POSTGRES_PASSWORD`
4. اتبع [`deploy/supabase-config-notes.md`](./deploy/supabase-config-notes.md).

---

## 4. تصدير قاعدة البيانات من Lovable Cloud

على جهازك المحلي داخل مجلد المشروع:

```bash
# 1. رابط القاعدة من Lovable: Cloud → Database → Connection string (URI)
export SUPABASE_DB_URL='postgresql://postgres:[PWD]@db.vlzxdnadehkufipehngb.supabase.co:5432/postgres'

# 2. تصدير الـ schema + البيانات + المستخدمين
bash deploy/db-export.sh

# 3. تصدير ملفات الـ Storage
export SUPABASE_URL='https://vlzxdnadehkufipehngb.supabase.co'
export SUPABASE_SERVICE_ROLE_KEY='<من Lovable Cloud → Secrets>'
bash deploy/storage-export.sh
```

النتيجة في `deploy/dump/` و `deploy/storage/cms-images/`.

---

## 5. نقل البيانات إلى السيرفر

```bash
scp -r deploy root@<server-ip>:/root/
```

ثم على السيرفر:

```bash
ssh root@<server-ip>
cd /root/deploy

docker ps | grep supabase-db
# مثال: supabase-db-abc123

export POSTGRES_CONTAINER='supabase-db-abc123'
export POSTGRES_PASSWORD='<من Coolify>'
bash import.sh

export SUPABASE_URL='https://supabase.yourdomain.com'
export SUPABASE_SERVICE_ROLE_KEY='<من Coolify>'
bash storage-import.sh
```

---

## 6. نشر التطبيق

### الطريقة الأولى (موصى بها): عبر GitHub

1. في Lovable: اربط المشروع بـ GitHub (Plus menu → GitHub → Connect).
2. في Coolify → **New Resource** → **Public/Private Repository** → اختر الـ repo.
3. **Build Pack: Dockerfile** (سيستخدم الـ `Dockerfile` تلقائياً).
4. **Port:** `3000`.
5. **Domains:** `https://yourdomain.com` و `https://www.yourdomain.com`.
6. **Environment Variables:** انسخ من `.env.production.example` وأكمل القيم.
   - **مهم:** علّم كل متغير `VITE_*` كـ **Build Variable** (Vite يدمجها وقت البناء).
7. اضغط **Deploy** (~5 دقائق أول مرة).

### الطريقة الثانية: نشر يدوي

```bash
git clone https://github.com/<you>/<repo>.git app && cd app
cp .env.production.example .env  # ثم عدّل القيم
docker build -t myapp .
docker run -d --name myapp --env-file .env -p 3000:3000 myapp
```

---

## 7. ما بعد النشر

- [ ] افتح `https://yourdomain.com` — الموقع يعمل.
- [ ] جرّب تسجيل الدخول + لوحة التحكم + رفع صورة.
- [ ] فعّل **Automatic Backups** لـ Postgres في Coolify.
- [ ] فعّل **Auto Deploy on Push** للتطبيق.

---

## 8. التحديثات اللاحقة

1. تعديل في Lovable → Lovable يدفع لـ GitHub.
2. Coolify يكتشف الـ push ويعيد البناء تلقائياً.

---

## 9. النسخ الاحتياطي

- **DB:** Coolify → Supabase → Backups → Daily + S3-compatible.
- **Storage:** backup كامل للسيرفر من Hetzner (Storage Box).
- **الكود:** على GitHub أصلاً.

---

## استكشاف الأخطاء

| المشكلة | الحل |
| --- | --- |
| `Unauthorized` أثناء البناء | متغير `VITE_SUPABASE_*` غير محدد كـ Build Variable |
| الصور لا تظهر | تأكد من `SUPABASE_URL` ووجود bucket `cms-images` |
| `auth.users` فارغ | استخدم Supabase Management API أو إعادة تسجيل |
| 502 Bad Gateway | الحاوية لم تبدأ — راجع logs في Coolify |
| HTTPS لا يعمل | تحقق من DNS propagation عبر `dig yourdomain.com` |

---

## التكلفة السنوية المتوقعة

| البند | التكلفة |
| --- | --- |
| Hetzner CX33 | €13.10/شهر ≈ €157/سنة |
| النطاق (.com) | ~$12/سنة |
| Backup (Storage Box 1TB) | €4/شهر = €48/سنة (اختياري) |
| **المجموع** | **~€170-220/سنة** |