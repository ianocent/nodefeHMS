"use client";

/**
 * Mobile app shell (§3.3 `components/mobile/shell/MobileShell`).
 *
 * Replaces the desktop LayoutComponent for `pages/m/*` via per-page getLayout
 * — `_app.tsx` picks it up through `Component.getLayout`, so desktop chrome is
 * never mounted for /m routes (Approach A, zero desktop diff).
 *
 * Pages can declare a bottom nav by attaching a static to the component:
 *
 *   ShiftPage.mobileNav = [{ key: "shift", label: "Shift", href: "/m/housekeeping/shift" }]
 */
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { GetDecrypt } from "../../helper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileBottomNav, { MobileNavItem } from "./MobileBottomNav";
import { IconUserCircle } from "./icons";

const Splash: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex h-[100dvh] flex-col items-center justify-center bg-gray-100 text-gray-500">
    <IconUserCircle className="mb-3 animate-pulse text-[rgb(132,90,223)]" width={40} height={40} />
    <p className="text-sm">{text}</p>
  </div>
);

interface MobileShellProps {
  children: ReactNode;
}

const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);

  let dataAuth: any = false;
  try {
    dataAuth = isLogin ? JSON.parse(GetDecrypt(isLogin)) : false;
  } catch {
    dataAuth = false;
  }

  // Same live-read requirement as LayoutComponent: redux-persist may rehydrate
  // after this component mounts, so the gate must depend on the live value.
  useEffect(() => {
    if (!dataAuth) router.replace("/login");
  }, [dataAuth, router]);

  if (!dataAuth) return <Splash text="Memuat..." />;

  // Static `mobileNav` attached on the page component (read-only introspection).
  const pageType = (children as any)?.type;
  const navItems: MobileNavItem[] | undefined = pageType?.mobileNav;

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-[520px] flex-col bg-gray-100">
      {/* Page (header + content) — page provides its own MobileHeader */}
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <MobileBottomNav items={navItems} />
      <ToastContainer />
    </div>
  );
};

export default MobileShell;
