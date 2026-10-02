/**
 * Breadcrumb labels for the header.
 *
 * The header used to derive every crumb from the URL slug, which made the label
 * wrong wherever the route name and the menu name disagree:
 *
 *   /room-statistic/room-availability -> "Reservation > Reservation > Room statistic"
 *   /choose-property                  -> "Reservation > Reservation > Choose property"
 *   /house-keeping/room-status        -> "Reservation > Reservation > House keeping > Room status"
 *
 * Two independent causes:
 *
 *   1. Slug, not menu name. `room-availability` sits under the `room-statistic`
 *      route, so the crumb showed the folder, not the page.
 *   2. Stale crumbs. next.config.js rewrites every sub-route of a module onto a
 *      single page (`/rate-management/:path*` -> `/rate-management`), so
 *      `router.pathname` never changes when you move between tabs. The effect
 *      keyed on `router.pathname` therefore stopped re-running and the previous
 *      route's crumbs stayed on screen.
 *
 * `resolveCrumbLabel` fixes (1) from a table of known route-name -> menu-name
 * pairs, and `buildBreadcrumbs` fixes (2) by always deriving from the live
 * `asPath` and always returning a fresh array, so a shorter route can never
 * inherit the longer route's crumbs.
 */

/**
 * Route segment -> the label the sidebar actually shows. Keys are lowercase and
 * dash-separated to match the URL segment they replace.
 */
const SEGMENT_LABELS: Record<string, string> = {
  // master setup
  "type-payment": "Payment Type",
  "code-item": "Item Code",
  "code-post": "Post Code",
  "code-gls": "GL Code",
  "code-billing": "Billing Code",

  // rate management
  rate: "Rate Setup",
  fit: "Reservation FIT",
  git: "Reservation GIT",
  vr: "Reservation Virtual",
  dayuse: "Day Use",
  "day-use": "Day Use",
  bar: "BAR Setup",

  // front desk / reservation
  "room-availability": "Room Availability",
  "room-statistic": "Room Statistic",
  "check-in": "Check In",
  "check-out": "Check Out",
  "batch-check-out": "Batch Check Out",
  "batch-posting": "Batch Posting",
  "virtual-folio": "Virtual Folio",
  "room-type-groupings": "Room Type Groupings",
  "room-types": "Room Types",
  "move-reservation-modal": "Move Reservation",

  // front office
  "choose-property": "Choose Property",
  "guest-request": "Guest Request",
  "end-of-day": "End of Day",
  endshift: "End Shift",
  "night-audit": "Night Audit",
  "system-balance": "System Balance",

  // housekeeping / event
  "housekeeping-setup": "Housekeeping Setup",
  "master-layout": "Master Layout",
  "master-venue": "Master Venue",
  "master-capacity": "Master Capacity",
  "master-inventory": "Master Inventory",

  // accounting / others
  "pos-transactions": "POS Transactions",
  "postcode-budget": "Postcode Budget",
  "security-audit": "Security Audit",
  "approval-matrix": "Approval Matrix",
  "hotel-competitor": "Hotel Competitor",
  "list-hotel": "List Hotel",
  "guest-listing-report": "Guest Listing Report",
  "room-configuration": "Room Configuration",
};

/**
 * Full-path overrides, checked before the per-segment table. A module can expose
 * several pages under one folder (`/rate-management/rate/promotion`), so the
 * last segment sometimes needs a different name than it has on its own.
 */
const PATH_LABELS: Record<string, string> = {
  "/rate-management/rate": "Rate Code",
  "/rate-management/rate/promotion": "Rate Promotion",
  "/rate-management/rate/code-item": "Additional Item To Sell",
  "/rate-management/rate/link": "Rate Link",
  "/rate-management/package": "Package",
  "/room-statistic/room-availability": "Room Availability",
  "/room-statistic/floor-plan": "Floor Plan",
  "/room-statistic/occupancy": "Occupancy",
  "/room-statistic": "Room Statistic",
  "/front-desk/folio": "Folio",
  "/house-keeping": "Housekeeping",
  "/master-setup": "Master Setup",
};

const prettify = (segment: string) =>
  segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

/** Label for a single URL segment. */
export function resolveCrumbLabel(segment: string): string {
  const key = segment.toLowerCase();
  return SEGMENT_LABELS[key] ?? prettify(segment);
}

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Build the breadcrumb trail for a pathname. Always returns a new array so the
 * consumer can never keep rendering a previous route's crumbs.
 */
export function buildBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Prefer a whole-path override; otherwise fall back to the segment table.
    const label = PATH_LABELS[href] ?? resolveCrumbLabel(segment);
    return { label, href };
  });
}

/** Page title: the deepest segment's label, falling back to the whole route. */
export function resolvePageTitle(pathname: string): string {
  const crumbs = buildBreadcrumbs(pathname);
  if (crumbs.length === 0) return "Dashboard";
  return crumbs[crumbs.length - 1].label;
}
