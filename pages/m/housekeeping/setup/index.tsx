"use client";

/**
 * M3 — Housekeeping Setup list (housekeeping_setups, menuId 1172).
 * GET /cms/housekeeping-setup (generic, parity desktop TableView `&trash=0`).
 * Card: code (mono), item_name, category chip, used_by, active dot.
 * Tap → form (`?data=<id>`); FAB → form baru. Delete ada di dalam form.
 */
import React, { useState } from "react";
import { useRouter } from "next/router";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileList from "../../../../components/mobile/list/MobileList";
import { MobileCard, MobileChip } from "../../../../components/mobile/list/MobileCard";
import { IconPlus } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping-setup";

const usedByLabel: Record<string, string> = {
  hk: "Housekeeper",
  hkspv: "Supervisor",
  both: "Both",
};

const SetupListPage = () => {
  const router = useRouter();
  const { canCreate, canView } = useFormPermission(1172);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  // debounce sederhana tanpa hook terpisah
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);
  React.useEffect(() => setSearch(debounced), [debounced]);

  const query = `&trash=0${search ? `&search=${encodeURIComponent(search)}` : ""}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Housekeeping Setup" subtitle="Master checklist" />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            Anda tidak punya akses lihat modul ini.
          </p>
        </div>
      ) : (
        <MobileList
          uri={GLOBALURI}
          query={query}
          limit={50}
          renderItem={(row) => (
            <MobileCard
              key={row?.id}
              onClick={() => router.push(`/m/housekeeping/setup/form?data=${row?.id}`)}
            >
              <div className="flex flex-1 flex-col gap-1.5 py-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[15px] font-semibold text-gray-900">
                    {row?.item_name ?? "-"}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 flex-none rounded-full ${
                      Number(row?.status) === 1 ? "bg-green-500" : "bg-gray-300"
                    }`}
                    title={Number(row?.status) === 1 ? "Aktif" : "Non-aktif"}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <MobileChip tone="gray">
                    <span className="font-mono">{row?.code ?? "-"}</span>
                  </MobileChip>
                  {row?.category && <MobileChip tone="primary">{row?.category}</MobileChip>}
                  {row?.used_by && (
                    <MobileChip tone="amber">{usedByLabel[row?.used_by] ?? row?.used_by}</MobileChip>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
                  {!!row?.is_required && <span>● Required</span>}
                  {!!row?.mandatory_inspection && <span>● Mandatory Inspection</span>}
                </div>
              </div>
            </MobileCard>
          )}
          emptyTitle="Belum ada setup"
          emptyDescription="Tap + untuk membuat item checklist pertama."
          emptyAction={
            canCreate ? (
              <button
                type="button"
                onClick={() => router.push("/m/housekeeping/setup/form")}
                className="rounded-full bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
              >
                + Buat Setup
              </button>
            ) : undefined
          }
          header={
            <div className="px-4 pb-1 pt-2">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari nama item / kode..."
                className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
              />
            </div>
          }
        />
      )}

      {canCreate && (
        <button
          type="button"
          aria-label="Tambah setup"
          onClick={() => router.push("/m/housekeeping/setup/form")}
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
