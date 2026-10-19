"use client";

/**
 * Mobile navigation drawer (§3.3 `components/mobile/shell/MobileDrawer`).
 * Slide-in panel from the left listing mobile-enabled modules from the
 * registry + logout. Menu data is NOT fetched from `/cms/menu` here —
 * only modules with a mobile view exist in `pages/m/*` (Approach A);
 * permission gating per module reuses redux permissions directly.
 */
import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Logout, GetDecrypt } from "../../helper";
import { IconClose } from "./icons";
import { MOBILE_MODULES } from "../nav/modules";
import {
  hasPermission,
  getUserRoles,
} from "../../../redux/auth/permissionHelper";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state?.auth);
  const roles = getUserRoles(auth);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const doLogout = () => {
    const token = (() => {
      try {
        return auth?.isLogin
          ? JSON.parse(GetDecrypt(auth.isLogin))?.data?.access_token
          : undefined;
      } catch {
        return undefined;
      }
    })();
    if (token) {
      Logout("", "POST", "", token, router, dispatch);
    } else {
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login");
    }
    onClose();
  };

  const items = MOBILE_MODULES.map((m) => {
    const accessible =
      m.menuIds.length === 0 ||
      m.menuIds.some((id) => hasPermission(auth?.permissions || {}, id, "view", roles));
    return { ...m, accessible };
  });

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] bg-black bg-opacity-55"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="animate-fade-in-left fixed inset-y-0 left-0 z-[1001] flex w-72 flex-col rounded-r-2xl bg-gray-900 text-white"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="flex items-center justify-between px-4 pt-4"
          style={{ paddingTop: "max(env(safe-area-inset-top), 1rem)" }}
        >
          <span className="text-sm font-medium tracking-wide text-white/80">
            Anyaman Mobile
          </span>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 active:bg-white/10"
          >
            <IconClose width={20} height={20} />
          </button>
        </div>

        <nav className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto px-2">
          {items
            .filter((m) => m.accessible || m.key === "profile")
            .map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => (m.ready ? go(m.href) : undefined)}
                disabled={!m.ready}
                className={`w-full rounded-xl px-3 py-3 text-left ${
                  router.pathname.startsWith(m.href)
                    ? "bg-white/15"
                    : "active:bg-white/10"
                } ${m.ready ? "" : "opacity-40"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-white">
                    {m.title}
                  </span>
                  {!m.ready && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
                      Soon
                    </span>
                  )}
                </div>
                {m.subtitle && (
                  <p className="mt-0.5 truncate text-xs text-white/60">
                    {m.subtitle}
                  </p>
                )}
              </button>
            ))}
        </nav>

        <div className="px-2 pb-[max(env(safe-area-inset-bottom),1rem)] pt-2">
          <button
            type="button"
            onClick={doLogout}
            className="w-full rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-red-300 active:bg-white/10"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileDrawer;
