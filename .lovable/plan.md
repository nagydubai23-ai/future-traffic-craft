
## السبب الجذري

بعد مراجعة الكود ومنطق `@lovable.dev/vite-tanstack-config` v2 + Nitro 3:

1. **Nitro لا يعمل أصلاً داخل Docker.** في `node_modules/@lovable.dev/vite-tanstack-config/dist/index.js` السطر 348:
   ```
   shouldRunNitro = options.nitro !== false && command === "build" && (explicitNitro || isSandbox)
   ```
   خارج بيئة Lovable sandbox وبدون `nitro: true` صريحة، **يُتخطى Nitro كلياً**. الـ `vite.config.docker.ts` الحالي = `defineConfig({})` بدون أي `nitro`، لذا متغير البيئة `NITRO_PRESET=node_server` في Dockerfile لا يُستخدم، ولا يُبنى سيرفر SSR على الإطلاق.

2. **مسار الـ Dockerfile خاطئ.** preset `node-server` يُخرج إلى `.output/server/index.mjs` (السطر 1287 في `nitro/dist/_presets.mjs` + `commands.preview = "node ./server/index.mjs"`)، بينما الـ Dockerfile ينسخ `dist/` ويشغّل `dist/server/server.js` — مسار غير موجود.

3. **متغيرات `VITE_*` غير ممرّرة وقت البناء.** Vite يدمج `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` في bundle العميل وقت `vite build`. الـ Dockerfile لا يحتوي على `ARG`، فالقيم تكون فارغة في الـ image، والعميل يرمي `Missing Supabase environment variable(s)` فيظهر `ErrorComponent`.

4. **متغيرات Runtime مفقودة.** `src/start.ts` يشغّل `redirectsMiddleware` على كل طلب، ويستدعي `getRedirect` الذي يستورد `supabaseAdmin` من `client.server.ts`. إذا كانت `SUPABASE_URL` أو `SUPABASE_SERVICE_ROLE_KEY` غير مضبوطة، يُرمى استثناء (يُلتقط داخل try/catch هناك، لكن `src/routes/sitemap[.]xml.ts` و `llms.txt.ts` و serverFns الأخرى ترمي بدون التقاط).

## الإصلاحات

### 1) `vite.config.docker.ts` — تفعيل Nitro بصراحة

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: { preset: "node-server" },
});
```

هذا يُجبر Nitro على التشغيل ويختار preset Node الذاتي الاستضافة. لا حاجة لـ `NITRO_PRESET` env بعد الآن.

### 2) `Dockerfile` — تصحيح المسارات + تمرير VITE_* وقت البناء

```dockerfile
# syntax=docker/dockerfile:1.7

FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Build-time args (Vite inlines these into client bundle)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID=self-hosted
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

COPY package.json bun.lock* bunfig.toml ./
RUN bun install --frozen-lockfile
COPY . .

ENV NODE_ENV=production
RUN bun run vite build -c vite.config.docker.ts

# ---- runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Nitro node-server preset writes a self-contained bundle to .output/
COPY --from=builder /app/.output ./.output

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", ".output/server/index.mjs"]
```

### 3) Coolify — متغيرات بيئة لازمة

في إعدادات التطبيق على Coolify:

**Build Variables** (لازم تُعلَّم "Build Variable" حتى تُمرَّر كـ `--build-arg`):
- `VITE_SUPABASE_URL` = `https://supabase.art-traffics.com`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = (anon key الخاص بـ Supabase الذاتي)
- `VITE_SUPABASE_PROJECT_ID` = `self-hosted`

**Runtime Variables**:
- `SUPABASE_URL` = `https://supabase.art-traffics.com`
- `SUPABASE_PUBLISHABLE_KEY` = (نفس anon key)
- `SUPABASE_SERVICE_ROLE_KEY` = (service role key — server only)
- `NODE_ENV=production` ، `PORT=3000` ، `HOST=0.0.0.0`

### 4) (اختياري لكنه يكشف الأخطاء الحقيقية) إعادة بناء بعد الإصلاح

بعد التطبيق، إذا ظلّ خطأ SSR ظاهراً، اطلب من Coolify عرض runtime logs (`docker logs`) — الآن `node-server` preset يطبع stack traces مباشرة على stdout، وستظهر السبب الفعلي (غالباً سيكون متغير bيئة محدد ناقص).

## ما لن يتغير

- `src/server.ts` (الـ Cloudflare Workers fetch wrapper) يبقى للنشر على Lovable — `vite.config.docker.ts` لا يستخدمه أصلاً (لا يوجد `tanstackStart.server.entry` فيه)، فيستخدم Nitro الـ entry الافتراضي المناسب لـ Node.
- لا تعديل على الكود (routes, components, supabase clients).
- لا تعديل على schema قاعدة البيانات.

## ملخّص ما عليك فعله

1. تطبيق التعديلات على ملفين فقط: `vite.config.docker.ts` و `Dockerfile`.
2. في Coolify: إضافة المتغيرات أعلاه (مع وضع علامة Build Variable على الـ `VITE_*`).
3. Redeploy.
