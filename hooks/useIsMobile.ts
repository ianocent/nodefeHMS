"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Reusable mobile breakpoint hook.
 *
 * Wraps the pattern already used in
 * `components/common/layout/components/sidebar/SidebarMobile.tsx:44`
 * (`window.innerWidth <= 1024`) with:
 * - SSR-safe initial value (false until mounted — no hydration mismatch)
 * - live update on resize
 * - URL override `?ui=mobile` (force true) / `?ui=desktop` (force false)
 *   for testing mobile views on a desktop browser and for Capacitor WebView.
 */
export const MOBILE_BREAKPOINT = 1024;

export const readForceUi = (): "mobile" | "desktop" | null => {
  if (typeof window === "undefined") return null;
  const routeUi = new URLSearchParams(window.location.search).get("ui");
  if (routeUi === "mobile") return "mobile";
  if (routeUi === "desktop") return "desktop";
  return null;
};

const compute = (): boolean => {
  const forced = readForceUi();
  if (forced === "mobile") return true;
  if (forced === "desktop") return false;
  if (typeof window === "undefined") return false;
  return window.innerWidth <= MOBILE_BREAKPOINT;
};

const useIsMobile = (): boolean => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Recompute on mount AND whenever the query string changes (?ui= override).
    const update = () => setIsMobile(compute());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [router?.asPath]);

  return isMobile;
};

export default useIsMobile;
