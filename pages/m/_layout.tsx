"use client";

/**
 * Layout guard for the mobile-only route namespace `/m/*` (§3.3).
 *
 * `_app.tsx` applies `Component.getLayout ?? desktop default`; every page
 * under `pages/m/` assigns:
 *
 *   Page.getLayout = mobileLayout;
 *
 * so the desktop LayoutComponent never mounts for /m routes.
 */
import React from "react";
import MobileShell from "../../components/mobile/shell/MobileShell";

export const mobileLayout = (page: React.ReactNode) => (
  <MobileShell>{page}</MobileShell>
);

export default mobileLayout;
