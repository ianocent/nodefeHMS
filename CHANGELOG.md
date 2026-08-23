# Changelog — frontend-node

All notable changes to this project are documented in this file.
Format based on [Conventional Commits](https://www.conventionalcommits.org/).

---

## 2026-08-23

### Docs
- `9164b7a` 20:22 — add Next.js introduction template to README

### Changed
- `6aea746` 20:16 — remove next.config.js from repo (contains secrets, distributed manually)
- `f0e6729` 20:13 — ignore npm package-lock.json (repo uses yarn)
- `eb300ba` 20:11 — **re-enable ESLint during builds with clean baseline**
  - rewrite eslintrc: TS parser, next/core-web-vitals, legacy noise rules off
  - `eslint.ignoreDuringBuilds = false` (build verified 0 errors / 0 warnings)
  - timezone-safe date helpers: GetSelisihDay + GetNextDay wall-time parity

### Added
- `668e7f6` 17:04 — Between option for Stay Dates filter on front-desk folio list

### Fixed
- `76f520c` 15:46 — toastify
- `1b0bd88` 14:18 — security hardening from FE audit

## 2026-08-22

### Fixed
- `0dc8916` 12:05 — hk history and etc

### Other
- `75558e5` 00:13 — new readme

## 2026-08-21

### Fixed
- `c22c3c3` 16:20 — dynamic-rate stats fetch uses FetchData for toast errors
- `900cf67` 16:09 — additional-item page: disable tab icons (isTabIcon)

## 2026-08-20

### Fixed
- `f9b0a8b` 11:37 — gate TabMenuIcon to front-desk/reservation/night-audit pages

## 2026-08-19

### Fixed
- `948438f` 19:48 — fetch tab actions on folio select (data param)
- `d246377` 18:54 — modal loop: only fetch details when key param present
- `e32feaf` 18:41 — move txPermMap outside JSX, build passes
- `a59b8b8` 18:36 — modal loop + confirmation button + menuId per page
- `d437069` 00:27 — render editable table for isEditTable pages

## 2026-08-18

### Fixed
- `38aca7e` 23:22 — report download filename from report URL segment
- `9d751a0` 23:04 — detect xlsx MIME in table-report blob preview
- `2959961` 12:45 — preserve parent/module query in module drag/form

### Changed
- `bd126a8` 20:40 — use Laravel canonical system-balance URIs

## 2026-08-17

### Docs
- `309f1f2` 02:00 — add migration audit artifacts
- `74815a9` 16:51 — fix system-balance canonical routes

### Other
- `b7d0ebb` / `8902dc4` — misc

## 2026-08-16

### Changed
- `fed7ca3` 17:33 — recent fixes (report, permissions)

### Fixed
- `322547e` 14:11 — table-edit queryString guard + client-side fixes

## 2026-08-15

### Added
- `d4f1fa4` 11:44 — toast error on fetch failure (POST/PUT/DELETE)

### Fixed
- `2703636` 11:09 — sidebar no cache, table min-width + nowrap scroll
- `fa67f35` 10:34 — table render guards + FetchData failure handling

## 2026-08-14

### Changed
- `2bc45a9` 11:31 — remove dead table-report utils/templates (unused)

### Fixed
- `997aba8` 14:14 — rate form dropdown master options index misalignment
- `509ded7` 11:28 — build blockers: dead toastify store import, invalid CSS
- `ce48c67` 11:22 — useTransactionPermission lenient truthy check (values `1`/`"true"`)
- `4e882a8` 03:22 — SSR-safe redux-persist storage, tailwind border fixes

### Other
- `1bb46b7` / `b4670c4` — ESLint config adjustments

## 2026-08-13

### Docs
- `9899977` 17:16 — rewrite README in plain developer style

### Changed
- `f14f6ef` 14:22 — initial frontend-node adaptation codebase (Next.js port of hms-frontend)

### Fixed
- `8ce9f09` 14:23 — split gitignore entries
