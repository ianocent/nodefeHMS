"use client";

/**
 * M9 — Pool Setup list (menuId 1203).
 * GET /cms/pool/setups?used_by&category — rows include pool_areas_detail.
 * Card: nama item, code mono, category + used_by chip, dot area count.
 * FAB → form. Hapus via form.
 */
import React from "react";
import { useRouter } from "next/router";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileList from "../../../../components/mobile/list/MobileList";
import { MobileCard, MobileChip } from "../../../../components/mobile/list/MobileCard";
import { IconPlus } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/pool/setups";

const categoryLabel: Record<string, string> = {
  equipment: "Equipment",
  safety: "Safety",
  hygiene: "Hygiene",
  linen: "Linen",
};
const usedByLabel: Record<string, string> = {
  attendant: "Attendant",
  supervisor: "Supervisor",
  both: "Both",
};

const SetupListPage = () => {
  const router = useRouter();
  const { canCreate, canView } = useFormPermission(1203);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Master Setup" subtitle="Pool checklist items" />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            You don't have access to view the Pool Setup module.
          </p>
        </div>
      ) : (
        <MobileList
          uri={GLOBALURI}
          renderItem={(row) => {
            const areas: any[] = Array.isArray(row?.pool_areas_detail)
              ? row.pool_areas_detail
              : [];
            return (
              <MobileCard
                key={row?.id}
                onClick={() => router.push(`/m/pool/setups/form?data=${row?.id}`)}
              >
                <div className="flex flex-1 flex-col gap-1.5 py-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[15px] font-semibold text-gray-900">
                      {row?.item_name ?? "-"}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 flex-none rounded-full ${
                        row?.status ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <MobileChip tone="gray">
                      <span className="font-mono">{row?.code ?? "-"}</span>
                    </MobileChip>
                    {row?.category && (
                      <MobileChip tone="primary">
                        {categoryLabel[row?.category] ?? row?.category}
                      </MobileChip>
                    )}
                    <MobileChip tone="amber">
                      {usedByLabel[row?.used_by] ?? row?.used_by}
                    </MobileChip>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {areas.length > 0
                      ? `Ter-bind ke ${areas.length} area · ${areas.reduce(
                          (s: number, a: any) => s + (Number(a?.qty) || 1),
                          0
                        )} qty`
                      : "Not bound to any area"}
                  </p>
                </div>
              </MobileCard>
            );
          }}
          emptyTitle="No setups yet"
          emptyDescription="Tap + to create your first checklist item."
          emptyAction={
            canCreate ? (
              <button
                type="button"
                onClick={() => router.push("/m/pool/setups/form")}
                className="rounded-md bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
              >
                + Create Setup
              </button>
            ) : undefined
          }
        />
      )}

      {canCreate && (
        <button
          type="button"
          aria-label="Add setup"
          onClick={() => router.push("/m/pool/setups/form")}
          className="absolute bottom-20 right-4 z-[600] flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(132,90,223)] text-white shadow-lg active:opacity-85"
        >
          <IconPlus />
        </button>
      )}
    </div>
  );
};

SetupListPage.getLayout = mobileLayout as any;

export default SetupListPage;
