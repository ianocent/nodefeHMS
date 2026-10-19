"use client";

/**
 * M9 — hub modul Pool mobile (menu 1201–1206).
 * Gate per sub-modul di masing-masing page + di sini pakai lenient
 * hasPermission (sama seperti hub Housekeeping).
 */
import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import MobileHeader from "../../../components/mobile/shell/MobileHeader";
import { MobileCard, MobileChip } from "../../../components/mobile/list/MobileCard";
import mobileLayout from "../_layout";
import { hasPermission, getUserRoles } from "../../../redux/auth/permissionHelper";

const SUB_MODULES = [
  {
    key: "attendance",
    title: "Pool Attendance",
    subtitle: "Check-in/out · checklist · override",
    href: "/m/pool/attendance",
    menuId: 1204,
  },
  {
    key: "usage",
    title: "Guest Usage",
    subtitle: "Towels · lockers · post to folio (menu 1205)",
    href: "/m/pool/usage",
    menuId: 1205,
  },
  {
    key: "recap",
    title: "Recap",
    subtitle: "Daily attendance & usage (menu 1206)",
    href: "/m/pool/recap",
    menuId: 1206,
  },
  {
    key: "areas",
    title: "Master Area",
    subtitle: "Main/kids pool · jacuzzi · lounge (menu 1202)",
    href: "/m/pool/areas",
    menuId: 1202,
  },
  {
    key: "setups",
    title: "Master Setup",
    subtitle: "Checklist item per area (menu 1203)",
    href: "/m/pool/setups",
    menuId: 1203,
  },
];

const PoolHub = () => {
  const router = useRouter();
  const auth = useSelector((state: any) => state?.auth);

  const items = SUB_MODULES.filter((m) =>
    hasPermission(auth?.permissions || {}, m.menuId, "view", getUserRoles(auth))
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Swimming Pool" subtitle="Modul" hideBack />
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {items.length === 0 && (
          <p className="px-2 pt-8 text-center text-sm text-gray-500">
            You don't have access to the Pool module.
          </p>
        )}
        {items.map((m) => (
          <MobileCard
            key={m.key}
            href={m.href}
            onClick={() => router.push(m.href)}
            chevron
          >
            <div className="flex flex-1 flex-col gap-0.5 py-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-gray-900">
                  {m.title}
                </span>
                <MobileChip tone="gray">#{m.menuId}</MobileChip>
              </div>
              <p className="text-[12px] text-gray-500">{m.subtitle}</p>
            </div>
          </MobileCard>
        ))}
      </div>
    </div>
  );
};

PoolHub.getLayout = mobileLayout as any;

export default PoolHub;
