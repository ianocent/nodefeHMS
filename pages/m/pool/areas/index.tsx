"use client";

/**
 * M9 — Pool Area list (menuId 1202).
 * Endpoint: GET /cms/pool/areas · DELETE /cms/pool/areas/:id
 * Card: kode mono, nama, area_type + capacity, dot open/closed/maintenance.
 * FAB → form. Hapus via form (sheet confirm).
 */
import React, { useState } from "react";
import { useRouter } from "next/router";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileList from "../../../../components/mobile/list/MobileList";
import { MobileCard, MobileChip } from "../../../../components/mobile/list/MobileCard";
import { IconPlus } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/pool/areas";

const areaTypeLabel: Record<string, string> = {
  main: "Main Pool",
  kids: "Kids Pool",
  jacuzzi: "Jacuzzi",
  lounge: "Lounge",
};

const statusColor: Record<number, string> = {
  0: "bg-gray-400",
  1: "bg-green-500",
  2: "bg-amber-500",
};
const statusLabel: Record<number, string> = {
  0: "Closed",
  1: "Open",
  2: "Maintenance",
};

const AreaListPage = () => {
  const router = useRouter();
  const { canCreate, canView } = useFormPermission(1202);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Master Area" subtitle="Pool areas" />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            You don't have access to view the Pool Area module.
          </p>
        </div>
      ) : (
        <MobileList
          uri={GLOBALURI}
          renderItem={(row) => (
            <MobileCard
              key={row?.id}
              onClick={() => router.push(`/m/pool/areas/form?data=${row?.id}`)}
            >
              <div className="flex flex-1 flex-col gap-1.5 py-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[15px] font-semibold text-gray-900">
                    {row?.name ?? "-"}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 flex-none rounded-full ${
                      statusColor[Number(row?.current_status)] ?? "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <MobileChip tone="gray">
                    <span className="font-mono">{row?.code ?? "-"}</span>
                  </MobileChip>
                  {row?.area_type && (
                    <MobileChip tone="primary">
                      {areaTypeLabel[row?.area_type] ?? row?.area_type}
                    </MobileChip>
                  )}
                  {row?.capacity != null && (
                    <MobileChip tone="amber">
                      {row?.capacity} pax
                    </MobileChip>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  {statusLabel[Number(row?.current_status)] ?? "-"}
                  {row?.depth_meter != null && ` · depth ${row?.depth_meter} m`}
                </p>
              </div>
            </MobileCard>
          )}
          emptyTitle="No areas yet"
          emptyDescription="Tap + to create your first pool area."
          emptyAction={
            canCreate ? (
              <button
                type="button"
                onClick={() => router.push("/m/pool/areas/form")}
                className="rounded-md bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
              >
                + Create Area
              </button>
            ) : undefined
          }
        />
      )}

      {canCreate && (
        <button
          type="button"
          aria-label="Add area"
          onClick={() => router.push("/m/pool/areas/form")}
          className="absolute bottom-20 right-4 z-[600] flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(132,90,223)] text-white shadow-lg active:opacity-85"
        >
          <IconPlus />
        </button>
      )}
    </div>
  );
};

AreaListPage.getLayout = mobileLayout as any;

export default AreaListPage;
