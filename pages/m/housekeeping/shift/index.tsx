"use client";

/**
 * M2 — Shift (shift_roster, menuId 158) mobile list.
 * Endpoint: GET /cms/housekeeping/shift-roster (generic list, SAME as desktop).
 * Card: nama, chip jam (range 0 + overtime), deskripsi 2 baris, badge jumlah range.
 * Tap → form (`?data=<id>`), FAB → form baru.
 */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileList from "../../../../components/mobile/list/MobileList";
import { MobileCard, MobileChip } from "../../../../components/mobile/list/MobileCard";
import useDebouncedSearch from "../../../../components/mobile/data/useDebouncedSearch";
import { IconPlus } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping/shift-roster";

const fmtRange = (r: { start?: string; end?: string }) =>
  `${r?.start ?? "--:--"}–${r?.end ?? "--:--"}`;

const ShiftListPage = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canView } = useFormPermission(158);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const debounced = useDebouncedSearch(searchInput);

  useEffect(() => setSearch(debounced), [debounced]);

  const query = search ? `&search=${encodeURIComponent(search)}` : "";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Shift" subtitle="Master shift kerja" />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            Anda tidak punya akses lihat modul Shift.
          </p>
        </div>
      ) : (
        <MobileList
          uri={GLOBALURI}
          query={query}
          renderItem={(row) => {
            const ranges: { start: string; end: string }[] = Array.isArray(
              row?.time_ranges
            )
              ? row.time_ranges
              : row?.time_start
              ? [{ start: row.time_start, end: row.time_end }]
              : [];
            return (
              <MobileCard
                key={row?.id}
                onClick={() =>
                  canUpdate && router.push(`/m/housekeeping/shift/form?data=${row?.id}`)
                }
              >
                <div className="flex flex-1 flex-col gap-1.5 py-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[15px] font-semibold text-gray-900">
                      {row?.name ?? "-"}
                    </span>
                    {ranges.length > 1 && (
                      <MobileChip tone="primary">+{ranges.length - 1} OT</MobileChip>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ranges.slice(0, 3).map((r, i) => (
                      <MobileChip key={i} tone={i === 0 ? "gray" : "amber"}>
                        {i === 0 ? fmtRange(r) : `OT${i} ${fmtRange(r)}`}
                      </MobileChip>
                    ))}
                  </div>
                  {row?.description && (
                    <p className="line-clamp-2 text-[13px] leading-snug text-gray-500">
                      {row.description}
                    </p>
                  )}
                </div>
              </MobileCard>
            );
          }}
          emptyTitle="Belum ada shift"
          emptyDescription="Tap + untuk membuat shift pertama."
          emptyAction={
            canCreate ? (
              <button
                type="button"
                onClick={() => router.push("/m/housekeeping/shift/form")}
                className="rounded-full bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
              >
                + Buat Shift
              </button>
            ) : undefined
          }
          header={
            <div className="px-4 pb-1 pt-2">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari shift..."
                className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
              />
            </div>
          }
        />
      )}

      {canCreate && (
        <button
          type="button"
          aria-label="Tambah shift"
          onClick={() => router.push("/m/housekeeping/shift/form")}
          className="absolute bottom-20 right-4 z-[600] flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(132,90,223)] text-white shadow-lg active:opacity-85"
        >
          <IconPlus />
        </button>
      )}
    </div>
  );
};

ShiftListPage.getLayout = mobileLayout as any;

export default ShiftListPage;
