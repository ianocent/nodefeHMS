"use client";

/**
 * M2–M6 selesai — hub modul Housekeeping mobile.
 * Dispatcher?module= ala desktop TIDAK diperlukan: router Next real routes.
 * Gate view per sub-modul ada di masing-masing page (useFormPermission).
 */
import React from "react";
import { useRouter } from "next/router";
import MobileHeader from "../../../components/mobile/shell/MobileHeader";
import { MobileCard, MobileChip } from "../../../components/mobile/list/MobileCard";
import mobileLayout from "../_layout";
import { hasPermission, getUserRoles } from "../../../redux/auth/permissionHelper";
import { useSelector } from "react-redux";

const SUB_MODULES = [
  {
    key: "room-status",
    title: "Room Status",
    subtitle: "Rekap · checklist · assign HK",
    href: "/m/housekeeping/room-status",
    menuId: 172,
  },
  {
    key: "shift",
    title: "Shift",
    subtitle: "Master shift & overtime",
    href: "/m/housekeeping/shift",
    menuId: 158,
  },
  {
    key: "roster",
    title: "Roster",
    subtitle: "Jadwal mingguan · copy week",
    href: "/m/housekeeping/roster",
    menuId: 164,
  },
  {
    key: "service-scheduler",
    title: "Service Scheduler",
    subtitle: "Agenda · timeline shift",
    href: "/m/housekeeping/service-scheduler",
    menuId: 1181,
  },
  {
    key: "setup",
    title: "Housekeeping Setup",
    subtitle: "Master checklist item",
    href: "/m/housekeeping/setup",
    menuId: 1172,
  },
];

const HousekeepingHub = () => {
  const router = useRouter();
  const auth = useSelector((state: any) => state?.auth);

  const items = SUB_MODULES.filter((m) =>
    hasPermission(auth?.permissions || {}, m.menuId, "view", getUserRoles(auth))
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Housekeeping" subtitle="Modul" hideBack />
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {items.length === 0 && (
          <p className="px-2 pt-8 text-center text-sm text-gray-500">
            Belum ada akses ke modul Housekeeping.
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

HousekeepingHub.getLayout = mobileLayout as any;

export default HousekeepingHub;
