# Self-Hosted Supabase — Post-Deploy Configuration

After Coolify finishes deploying the Supabase stack, run through this checklist.

## 1. Capture the generated keys

In Coolify -> Supabase service -> Environment Variables, copy:

- `SUPABASE_ANON_KEY` -> goes into the app as `VITE_SUPABASE_PUBLISHABLE_KEY` + `SUPABASE_PUBLISHABLE_KEY`
- `SERVICE_ROLE_KEY` -> goes into the app as `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `POSTGRES_PASSWORD` -> needed for the import script

## 2. Expose Kong on a subdomain

- Coolify -> Supabase -> Domains -> set `https://supabase.yourdomain.com` for the `kong` service.
- Verify: `curl https://supabase.yourdomain.com/rest/v1/ -H "apikey: <anon>"` returns JSON.

## 3. Configure Auth

In Coolify Supabase env vars (then restart `auth` service):

- `SITE_URL=https://yourdomain.com`
- `ADDITIONAL_REDIRECT_URLS=https://yourdomain.com,https://www.yourdomain.com`
- `DISABLE_SIGNUP=false`
- `MAILER_AUTOCONFIRM=true` (dev) or wire SMTP for real emails:
  `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SENDER_NAME`, `SMTP_ADMIN_EMAIL`

## 4. Google OAuth (optional)

1. Google Cloud Console -> OAuth client -> add redirect URI:
   `https://supabase.yourdomain.com/auth/v1/callback`
2. In Coolify Supabase env:
   - `GOTRUE_EXTERNAL_GOOGLE_ENABLED=true`
   - `GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=...`
   - `GOTRUE_EXTERNAL_GOOGLE_SECRET=...`
   - `GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=https://supabase.yourdomain.com/auth/v1/callback`
3. Restart the `auth` service.

## 5. Storage bucket

`storage-import.sh` auto-creates `cms-images` as a private bucket. Manual:

- Studio -> Storage -> New bucket -> name `cms-images` -> Private.
- RLS policies on `storage.objects` may need to be re-applied via Studio if
  not preserved by the public-schema dump.

## 6. Database health

```bash
docker exec -it <supabase-db-container> psql -U postgres -d postgres -c "\dt public.*"
```

## 7. App env vars

Use `.env.production.example` as the template. **Mark every `VITE_*` var as
a Build Variable** in Coolify — Vite inlines them at build time.