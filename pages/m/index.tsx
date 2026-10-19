"use client";

/**
 * Mobile launcher (§6.1 M1) — `/m`.
 * Grid of mobile-enabled modules filtered by the same redux permissions the
 * desktop uses (`hasPermission` — lenient, correct per-module menuId).
 * `ready: false` modules render as "Soon" cards until their milestone lands.
 */
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { GetDecrypt } from "../../components/helper";
import MobileHeader from "../../components/mobile/shell/MobileHeader";
import { MobileCard, MobileCardField, MobileChip } from "../../components/mobile/list/MobileCard";
import { MobileEmptyState } from "../../components/mobile/list/MobileEmptyState";
import { MOBILE_MODULES } from "../../components/mobile/nav/modules";
import {
  hasPermission,
  getUserRoles,
} from "../../redux/auth/permissionHelper";
import { IconChevronRight } from "../../components/mobile/shell/icons";
import mobileLayout from "./_layout";

const MobileLauncher = () => {
  const router = useRouter();
  const auth = useSelector((state: any) => state?.auth);

  const userName = useMemo(() => {
    try {
      const parsed = auth?.isLogin ? JSON.parse(GetDecrypt(auth.isLogin)) : null;
      const u = parsed?.data?.user ?? parsed?.data ?? {};
      return u?.name ?? u?.username ?? "";
    } catch {
      return "";
    }
  }, [auth?.isLogin]);

  const modules = useMemo(() => {
    const roles = getUserRoles(auth);
    return MOBILE_MODULES.map((m) => ({
      ...m,
      accessible:
        m.menuIds.length === 0 ||
        m.menuIds.some(
          (id) => hasPermission(auth?.permissions || {}, id, "view", roles)
        ),
    }));
  }, [auth]);

  const visible = modules.filter((m) => m.accessible);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title="Anyaman Mobile"
        subtitle={userName ? `Halo, ${userName}` : undefined}
        hideBack
      />
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {visible.length === 0 ? (
          <MobileEmptyState
            title="Belum ada modul"
            description="Role Anda belum punya akses ke modul dengan tampilan mobile."
          />
        ) : (
          visible.map((m) => (
            <MobileCard
              key={m.key}
              onClick={() => {
                if (m.ready) router.push(m.href);
              }}
              className={m.ready ? "" : "opacity-60"}
            >
              <div className="flex items-center justify-between gap-3 py-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <MobileCardField>
                      <span className="text-[16px] font-semibold text-gray-900">
                        {m.title}
                      </span>
                    </MobileCardField>
                    {!m.ready && <MobileChip tone="amber">Soon</MobileChip>}
                  </div>
                  {m.subtitle && (
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {m.subtitle}
                    </p>
                  )}
                </div>
                {m.ready && (
                  <IconChevronRight width={20} height={20} className="text-gray-300" />
                )}
              </div>
            </MobileCard>
          ))
        )}
      </div>
    </div>
  );
};

MobileLauncher.getLayout = mobileLayout as any;

export default MobileLauncher;
