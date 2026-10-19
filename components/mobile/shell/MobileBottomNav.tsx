"use client";

/**
 * Bottom navigation bar (§3.3 `components/mobile/shell/MobileBottomNav`).
 * Rendered by MobileShell when the page declares a `mobileNav` array:
 *
 *   MyPage.mobileNav = [{ key: "today", label: "Hari Ini", href: "/m/..." }]
 */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export interface MobileNavItem {
  key: string;
  label: string;
  href: string;
}

const MobileBottomNav: React.FC<{ items?: MobileNavItem[] }> = ({ items = [] }) => {
  const router = useRouter();
  if (!items.length) return null;

  return (
    <nav
      className="border-t border-gray-200 bg-white bg-opacity-95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-14 items-stretch">
        {items.map((it) => {
          const active = router.pathname.startsWith(it.href);
          return (
            <Link
              key={it.key}
              href={it.href}
              className={`flex flex-1 items-center justify-center text-[13px] font-semibold transition-colors ${
                active ? "text-[rgb(132,90,223)]" : "text-gray-500"
              }`}
            >
              <span className="border-b-2 border-transparent pt-0.5">
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
