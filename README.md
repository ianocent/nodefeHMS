# Frontend Node (Next.js Adaptation)

## Reserved for future frontend changes

All frontend changes for the Node.js migration go here.
DO NOT modify original `frontend/` directory.

Original frontend: `../frontend/` (Next.js 14, React 18, TypeScript)
This dir: `frontend-node/` - adapted copy for backend-node compatibility.

## Git Repo (push / pull / issues)

- **Repo ini**: https://github.com/ianocent/nodefeHMS
- SSH: `git@github.com:ianocent/nodefeHMS.git`

## Repo Terkait

| Repo | Isi | Link |
|------|-----|------|
| `hms-frontend` | Frontend Next.js asli (sumber) | https://github.com/ianocent/hms-frontend |
| `hms-backend` | Backend Laravel (kode lama) | https://github.com/ianocent/hms-backend |
| `backend-node` (`nodeHMS`) | Backend baru Express/PostgreSQL | https://github.com/ianocent/nodeHMS |

## Aturan Keamanan

- `next.config*.js` (berisi `sPassAes` / `uriApi`) dan `.env*` **tidak pernah di-commit**.
- Konfigurasi local tetap ada di folder ini, tapi di-ignore git.