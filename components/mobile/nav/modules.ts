/**
 * Registry of modules exposed in the mobile app (Approach A, `pages/m/*`).
 *
 * Only modules with a mobile view are listed here. `ready: false` modules are
 * rendered as "soon" cards until their milestone lands (M2+ housekeeping,
 * M9 pool). Permission gate uses the same lenient `hasPermission` helper as
 * the desktop app — wrong menuId per endpoint (old `158` bug) is NOT copied.
 */
export interface MobileModule {
  key: string;
  title: string;
  subtitle?: string;
  href: string;
  /** Menu IDs that gate visibility (view action). Empty = always visible. */
  menuIds: number[];
  ready: boolean;
}

export const MOBILE_MODULES: MobileModule[] = [
  {
    key: "housekeeping",
    title: "Housekeeping",
    subtitle: "Room Status · Shift · Roster · Scheduler · Setup",
    href: "/m/housekeeping",
    menuIds: [158, 164, 172, 1181, 1172],
    ready: true, // M2–M6 selesai
  },
  {
    key: "pool",
    title: "Swimming Pool",
    subtitle: "Attendance · Usage · Recap · Master",
    href: "/m/pool",
    menuIds: [1201, 1202, 1203, 1204, 1205, 1206],
    ready: true, // M9
  },
  {
    key: "profile",
    title: "Profil",
    subtitle: "Akun · Logout · Status sync",
    href: "/m/profile",
    menuIds: [],
    ready: false, // M11
  },
];
