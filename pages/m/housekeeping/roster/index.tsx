"use client";

/**
 * M4 — Roster (roster_list, menuId 164) mobile list.
 * Endpoint GET/POST /cms/housekeeping/roster-list (same as desktop TableView).
 * Card → detail week view (`?data=<roster_list_id>`).
 */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileList from "../../../../components/mobile/list/MobileList";
import MobileSheet from "../../../../components/mobile/form/MobileSheet";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import { MobileCard, MobileCardField, MobileChip } from "../../../../components/mobile/list/MobileCard";
import { IconPlus } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping/roster-list";

const RosterListPage = () => {
  const router = useRouter();
  const { canCreate, canView } = useFormPermission(164);
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = (() => {
    try {
      return isLogin
        ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? ""
        : "";
    } catch {
      return "";
    }
  })();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const saveList = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await FetchData(
        GLOBALURI,
        "POST",
        GetEncrypt(JSON.stringify({ name: name.trim() })),
        false,
        token,
        router,
        ""
      );
      setSheetOpen(false);
      setName("");
      setReloadKey((k) => k + 1); // MobileList re-mounts via key → refetch
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Roster" subtitle="Daftar roster list" />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            Anda tidak punya akses lihat modul Roster.
          </p>
        </div>
      ) : (
        <MobileList
          key={reloadKey}
          uri={GLOBALURI}
          query="&sort=-id"
          limit={50}
          renderItem={(row) => (
            <MobileCard
              key={row?.id}
              onClick={() => router.push(`/m/housekeeping/roster/detail?data=${row?.id}`)}
            >
              <div className="flex flex-1 flex-col gap-1.5 py-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[15px] font-semibold text-gray-900">
                    {row?.name ?? "-"}
                  </span>
                  {row?.status != null && (
                    <MobileChip tone={Number(row?.status) === 1 ? "green" : "gray"}>
                      {Number(row?.status) === 1 ? "Active" : "Inactive"}
                    </MobileChip>
                  )}
                </div>
                {(row?.date_from || row?.date_to) && (
                  <div className="flex items-center gap-2">
                    <MobileCardField label="Periode">
                      {row?.date_from || "—"} – {row?.date_to || "—"}
                    </MobileCardField>
                  </div>
                )}
              </div>
            </MobileCard>
          )}
          emptyTitle="Belum ada roster list"
          emptyDescription="Tap + untuk membuat roster list pertama."
          emptyAction={
            canCreate ? (
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="rounded-full bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
              >
                + Buat Roster List
              </button>
            ) : undefined
          }
        />
      )}

      {canCreate && (
        <button
          type="button"
          aria-label="Tambah roster list"
          onClick={() => setSheetOpen(true)}
          className="absolute bottom-20 right-4 z-[600] flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(132,90,223)] text-white shadow-lg active:opacity-85"
        >
          <IconPlus />
        </button>
      )}

      {/* Create roster list sheet — payload persis desktop form (name saja) */}
      <MobileSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Buat Roster List"
        footer={
          <MobileActionBar
            secondaryLabel="Batal"
            onSecondary={() => setSheetOpen(false)}
            primaryLabel="Simpan"
            onPrimary={saveList}
            loading={saving}
            disabled={!name.trim()}
          />
        }
      >
        <label className="mb-1 block text-[13px] font-semibold text-gray-700">
          Nama Roster
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="cth. Roster Housekeeping Oktober"
          className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
        />
        <p className="mt-2 text-xs text-gray-400">
          Assign petugas & shift dilakukan di layar minggu setelah ini dibuat.
        </p>
      </MobileSheet>
    </div>
  );
};

RosterListPage.getLayout = mobileLayout as any;

export default RosterListPage;
