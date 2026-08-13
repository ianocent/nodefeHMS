# HMS Anyaman — Frontend Node (Next.js)

Salinan frontend Next.js yang diadaptasi buat nyambung ke backend baru (`nodeHMS`). Frontend asli di `../frontend/` dibiarkan utuh — semua perubahan buat migrasi dikerjakan di folder ini.

Repo: https://github.com/ianocent/nodefeHMS · SSH `git@github.com:ianocent/nodefeHMS.git`

## Repo lain yang nyambung

| Repo | Isinya |
|------|--------|
| `ianocent/hms-frontend` | Frontend Next.js asli (sumber, jangan diedit) |
| `ianocent/hms-backend` | Backend Laravel lama (referensi) |
| `ianocent/nodeHMS` | Backend baru Express/PostgreSQL yang dilayani frontend ini |

## Status

- Sudah jalan: layout, login flow (AES + `Authorization: Bearer`), helper `FetchData`, permission helper.
- TODO adaptasi: API base URL masih hardcoded (`next.config*.js`), bug `permissionHelper` (=== true vs nilai 1/"true"), dan menyesuaikan endpoint yang formatnya berubah — track di issues repo ini (label `milestone`).

## Command

```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # eslint
```

## Catatan penting

- `next.config*.js` (ada `sPassAes` + `uriApi` di dalamnya) dan `.env*` **jangan pernah di-commit** — itu udah di-`.gitignore`, tapi kalau suatu saat kepaksa nambahin file konfigurasi lokal, pastikan namanya masuk ignore dulu.
- File lokal kayak `cookie.txt`, `login_response.txt` bekas debug juga jangan ikut ter-push.
- Backend baru butuh `Authorization: Bearer <token>` (token dari login), `X-Token` masih didukung untuk kompatibilitas aplikasi native.
