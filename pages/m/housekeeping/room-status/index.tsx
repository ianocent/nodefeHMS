"use client";

/**
 * M6 — Room Status mobile (menuId 172) — modul paling penting.
 * - Summary header = hitung client-side dari payload
 * - Filter → bottom sheet (6 filter) + chip aktif
 * - Group by floor dengan sub-header
 * - Card 1 kolom: name, room type, chips status, HK, guest, progress
 * - Aksi: quick status (start/end/inspection/still-need), Assign HK,
 *   Checklist, (overflow) Clean All Rooms — 2-step confirm
 *
 * Endpoint (semua existing, zero backend change):
 * GET /room-status?date&maid_status&room_status&floor&building&room_type
 * GET /room-status/master  · GET /room-status/current-housekeepers?date
 * POST /room-status/batch  · PUT /room-status/status/:id
 * GET /middleware/room/clean-from-dirty?client_uid
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { toast } from "react-toastify";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileSheet from "../../../../components/mobile/form/MobileSheet";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import { MobileCard, MobileChip } from "../../../../components/mobile/list/MobileCard";
import MobileFilterSheet, { ActiveFilter } from "../../../../components/mobile/list/MobileFilterSheet";
import { MobileEmptyState } from "../../../../components/mobile/list/MobileEmptyState";
import { IconClose } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping/room-status";

const chipTone = (label: string): "green" | "red" | "amber" | "primary" | "gray" => {
  const l = String(label ?? "").toLowerCase();
  if (l.includes("clean") && !l.includes("inspection")) return "green";
  if (l.includes("dirty") || l.includes("buruk")) return "red";
  if (l.includes("inspect")) return "amber";
  if (l.includes("occup")) return "primary";
  return "gray";
};

const RoomStatusPage = () => {
  const router = useRouter();
  const { canUpdate, canView } = useFormPermission(172);
  const canCleanAllRooms = useTransactionPermission("clean_all_room");
  const canAssignHousekeeper = useTransactionPermission("assign_housekeeper");
  const canInspect = useTransactionPermission("perform_inspection");
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);
  const clientUid = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.NameProperty ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  /* master */
  const [master, setMaster] = useState<any>(null);
  const [date, setDate] = useState<string>("");

  /* filters (multi-value arrays) */
  const emptyFilters = { maid_status: [] as number[], room_status: [] as number[], floor: [] as number[], building: [] as number[], room_type: [] as number[] };
  const [filters, setFilters] = useState<typeof emptyFilters>({ ...emptyFilters });
  const [filterOpen, setFilterOpen] = useState(false);

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  /* action sheets */
  const [statusSheetRow, setStatusSheetRow] = useState<any>(null);
  const [assignSheetRow, setAssignSheetRow] = useState<any>(null);
  const [assignPicked, setAssignPicked] = useState<Set<string>>(new Set());
  const [assignSaving, setAssignSaving] = useState(false);
  const [confirmCleanAll, setConfirmCleanAll] = useState(false);
  const [cleanAllState, setCleanAllState] = useState<"idle" | "confirm2">("idle");
  const [cleanAllSaving, setCleanAllSaving] = useState(false);

  const [currentHks, setCurrentHks] = useState<any[]>([]);

  const buildQuery = useCallback(
    (f = filters) => {
      const parts: string[] = [`date=${date}`];
      if (f.maid_status.length) parts.push(`maid_status=${f.maid_status.join(",")}`);
      if (f.room_status.length) parts.push(`room_status=${f.room_status.join(",")}`);
      if (f.floor.length) parts.push(`floor=${f.floor.join(",")}`);
      if (f.building.length) parts.push(`building=${f.building.join(",")}`);
      if (f.room_type.length) parts.push(`room_type=${f.room_type.join(",")}`);
      return parts.join("&");
    },
    [filters, date]
  );

  /* master + rows */
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const res = await FetchData(`${GLOBALURI}/master`, "GET", "", false, token, router, "");
        if (dead) return;
        const m = res?.master ?? {};
        setMaster(m);
        if (m.business_date) setDate(m.business_date);
        else setDate(new Date().toISOString().slice(0, 10));
      } finally {
      }
    })();
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRows = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const res = await FetchData(
        `${GLOBALURI}?limit=1000&${buildQuery()}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      setRows(res?.code == "200" || res?.code === 200 ? res?.data ?? [] : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildQuery, date, token]);

  useEffect(() => {
    loadRows();
  }, [loadRows, reloadKey]);

  /* rekap header — client-side */
  const summary = useMemo(() => {
    const total = rows.length;
    let clean = 0, dirty = 0, inspect = 0, out = 0, other = 0;
    rows.forEach((r) => {
      const l = String(r?.maid_status?.label ?? "").toLowerCase();
      if (l.includes("clean") && !l.includes("inspection")) clean++;
      else if (l.includes("dirty")) dirty++;
      else if (l.includes("inspect")) inspect++;
      else other++;
      const rl = String(r?.room_status?.label ?? "").toLowerCase();
      if (rl.includes("out")) out++;
    });
    return { total, clean, dirty, inspect, other, out };
  }, [rows]);

  /* group by floor */
  const groups = useMemo(() => {
    const map = new Map<string, any[]>();
    rows.forEach((r) => {
      const key = r?.floor?.label || "-";
      map.set(key, [...(map.get(key) ?? []), r]);
    });
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .map(([label, list]) => ({ label, list }));
  }, [rows]);

  const activeFilters: ActiveFilter[] = useMemo(
    () =>
      Object.entries(filters)
        .filter(([, ids]) => ids.length > 0)
        .map(([key, ids]) => ({
          key,
          label: key
            .replace("_", " ")
            .replace("maid status", "Clean")
            .replace("room status", "Room") + (ids.length > 1 ? ` ×${ids.length}` : ""),
        })),
    [filters]
  );

  const removeFilter = (key: string) => {
    const next = { ...filters, [key]: [] };
    setFilters(next);
    setFilterOpen(true);
  };

  /* quick status = PUT /room-status/status/:id (types match backend :1917-1991) */
  const quickStatus = async (row: any, type: string) => {
    if (!canUpdate) {
      toast.error("Tidak ada izin ubah status.");
      return;
    }
    try {
      await FetchData(
        `${GLOBALURI}/status/${row?.id}`,
        "PUT",
        GetEncrypt(JSON.stringify({ type, date })),
        false,
        token,
        router,
        ""
      );
      setStatusSheetRow(null);
      setReloadKey((k) => k + 1);
    } finally {
    }
  };

  /* assign HK = POST /room-status/batch (payload parity desktop :455-459) */
  const openAssign = async (row: any) => {
    setAssignSheetRow(row);
    setAssignPicked(new Set((row?.housekeeper ?? []).map((h: any) => String(h?.value))));
    try {
      const res = await FetchData(
        `${GLOBALURI}/current-housekeepers?date=${date}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") setCurrentHks(res?.data ?? []);
    } catch {
      setCurrentHks([]);
    }
  };

  const saveAssign = async () => {
    const hkList = currentHks.length
      ? currentHks.filter((h) => assignPicked.has(String(h?.value)))
      : (master?.housekeepers ?? []).filter((h: any) => assignPicked.has(String(h?.value)));
    if (!assignSheetRow) return;
    setAssignSaving(true);
    try {
      await FetchData(
        `${GLOBALURI}/batch`,
        "POST",
        GetEncrypt(
          JSON.stringify({
            housekeeper: hkList,
            selectedRoomId: { [assignSheetRow?.id]: true },
            date,
          })
        ),
        false,
        token,
        router,
        ""
      );
      toast.success("Housekeeper di-assign");
      setAssignSheetRow(null);
      setReloadKey((k) => k + 1);
    } finally {
      setAssignSaving(false);
    }
  };

  /* Clean All Rooms = GET /middleware/room/clean-from-dirty (parity desktop uriClean) */
  const cleanAll = async () => {
    setCleanAllSaving(true);
    try {
      const res = await FetchData(
        `/middleware/room/clean-from-dirty?client_uid=${clientUid}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      if (res?.code == "200" || res?.code === 200) {
        toast.success("Semua kamar dirty → clean");
        setConfirmCleanAll(false);
        setCleanAllState("idle");
        setReloadKey((k) => k + 1);
      } else {
        toast.error("Gagal clean all");
      }
    } finally {
      setCleanAllSaving(false);
    }
  };

  const hkOptions = currentHks.length
    ? currentHks
    : (master?.housekeepers ?? []).map((h: any) => ({ value: Number(h?.value), label: h?.label ?? h?.name }));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title="Room Status"
        subtitle={date ? `Tanggal kerja ${date}` : undefined}
        right={
          <button
            type="button"
            aria-label="Filter"
            onClick={() => setFilterOpen(true)}
            className={`mr-1 flex h-9 items-center gap-1 rounded-full px-3 text-[12px] font-semibold active:bg-gray-100 ${
              activeFilters.length ? "text-white bg-[rgb(132,90,223)]" : "text-gray-600 bg-gray-100"
            }`}
          >
            Filter
            {activeFilters.length > 0 && (
              <span className="rounded-full bg-white bg-opacity-25 px-1.5">
                {activeFilters.length}
              </span>
            )}
          </button>
        }
      />

      {/* summary sticky header */}
      <div className="border-b border-gray-200 bg-white px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-[13px] font-bold text-gray-900">
            Total <span className="text-[rgb(132,90,223)]">{summary.total}</span>
          </span>
          <span className="text-[12px] text-green-700">Clean {summary.clean}</span>
          <span className="text-[12px] text-red-600">Dirty {summary.dirty}</span>
          <span className="text-[12px] text-amber-700">Inspect {summary.inspect}</span>
          <span className="text-[12px] text-gray-500">Lain {summary.other}</span>
        </div>
        {(canAssignHousekeeper || canUpdate) && (
          <p className="mt-0.5 text-[11px] text-gray-400">
            Tap kamar → aksi: checklist, assign, ubah tahap bersih.
          </p>
        )}
      </div>

      {/* active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => removeFilter(f.key)}
              className="inline-flex flex-none items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-semibold text-gray-700 active:bg-gray-200"
            >
              {f.label}
              <IconClose width={10} height={10} />
            </button>
          ))}
        </div>
      )}

      {/* list grouped by floor */}
      <div className="flex-1 overflow-y-auto overscroll-contain pb-4">
        {loading ? (
          <div className="space-y-2.5 px-4 pt-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-shimmer rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <MobileEmptyState
            title="Tidak ada kamar"
            description="Filter kosong atau data belum ada pada tanggal ini."
          />
        ) : (
          groups.map((g) => (
            <div key={g.label}>
              <div className="sticky top-0 z-[400] flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-1.5">
                <span className="text-[12px] font-bold uppercase tracking-wide text-gray-600">
                  {g.label}
                </span>
                <span className="text-[12px] text-gray-400">{g.list.length} kamar</span>
              </div>
              <div className="px-4 pt-2">
                {g.list.map((row) => (
                  <MobileCard key={row?.id}>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[16px] font-bold text-gray-900">
                            {row?.name}
                          </span>
                          <p className="text-[12px] text-gray-400">
                            {row?.building?.label ? `${row.building.label} · ` : ""}
                            {row?.floor?.label ?? ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStatusSheetRow(row)}
                          className={
                            canUpdate
                              ? "rounded-full px-2 py-1 active:opacity-70"
                              : "rounded-full px-2 py-1 opacity-70"
                          }
                        >
                          <MobileChip tone={chipTone(row?.maid_status?.label)}>
                            {String(row?.maid_status?.label ?? "-").toUpperCase()}
                          </MobileChip>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <MobileChip tone="gray">{row?.room_type_id?.label ?? "-"}</MobileChip>
                        <MobileChip tone={chipTone(row?.room_status?.label)}>
                          {row?.room_status?.label ?? "-"}
                        </MobileChip>
                        {row?.is_do_not_disturb && <MobileChip tone="red">DND</MobileChip>}
                      </div>
                      {(row?.housekeeper?.length > 0 || row?.guest) && (
                        <p className="text-[12px] text-gray-500">
                          {row?.housekeeper?.length > 0 &&
                            `HK: ${row.housekeeper.map((h: any) => h.label).join(", ")}`}
                          {row?.housekeeper?.length > 0 && row?.guest ? " · " : ""}
                          {row?.guest ? `Tamu: ${row.guest}` : ""}
                        </p>
                      )}
                      <div className="flex gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/m/housekeeping/room-status/checklist?room=${row?.id}&name=${encodeURIComponent(
                                row?.name ?? ""
                              )}`
                            )
                          }
                          className="h-9 flex-1 rounded-full bg-gray-100 text-[13px] font-semibold text-gray-700 active:bg-gray-200"
                        >
                          Isi Checklist
                        </button>
                        {canAssignHousekeeper && (
                          <button
                            type="button"
                            onClick={() => openAssign(row)}
                            className="h-9 flex-1 rounded-full bg-gray-100 text-[13px] font-semibold text-gray-700 active:bg-gray-200"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </div>
                  </MobileCard>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* overflow: clean all */}
      {canCleanAllRooms && (
        <button
          type="button"
          onClick={() => setConfirmCleanAll(true)}
          className="mx-4 mb-2 h-10 rounded-xl border border-red-200 bg-red-50 text-[13px] font-semibold text-red-600 active:bg-red-100"
        >
          ⋯ Clean All Rooms
        </button>
      )}

      {/* ── quick status sheet ── */}
      <MobileSheet
        open={!!statusSheetRow}
        onClose={() => setStatusSheetRow(null)}
        title={statusSheetRow ? `${statusSheetRow?.name}` : ""}
      >
        {statusSheetRow && (
          <>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <MobileChip tone={chipTone(statusSheetRow?.maid_status?.label)}>
                {statusSheetRow?.maid_status?.label ?? "-"}
              </MobileChip>
              <MobileChip tone="gray">{statusSheetRow?.room_status?.label ?? "-"}</MobileChip>
            </div>
            <p className="mb-2 text-[12px] text-gray-500">
              Tahap bersih (mengubah clean status & history hari ini):
            </p>
            <div className="space-y-2">
              {[
                { t: "start_clean_time", label: "▶ Mulai dibersihkan", cls: "bg-blue-50 text-blue-700" },
                { t: "end_clean_time", label: "✓ Selesai dibersihkan (→ inspeksi)", cls: "bg-amber-50 text-amber-700" },
                ...(canInspect
                  ? [{ t: "done_inspection", label: "✔ Inspeksi selesai (→ clean)", cls: "bg-green-50 text-green-700" }]
                  : []),
                { t: "still_need_to_clean", label: "↺ Masih perlu dibersihkan (→ dirty)", cls: "bg-red-50 text-red-700" },
              ].map((a) => (
                <button
                  key={a.t}
                  type="button"
                  onClick={() => quickStatus(statusSheetRow, a.t)}
                  className={`h-11 w-full rounded-xl text-[14px] font-semibold active:opacity-80 ${a.cls}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              Perlu history hari ini (assign HK dulu bila belum ada).
            </p>
          </>
        )}
      </MobileSheet>

      {/* ── assign housekeeper sheet — payload parity desktop batch :455-459 ── */}
      <MobileSheet
        open={!!assignSheetRow}
        onClose={() => setAssignSheetRow(null)}
        title={assignSheetRow ? `Assign HK · ${assignSheetRow?.name}` : ""}
        height="80%"
        footer={
          <MobileActionBar
            secondaryLabel="Batal"
            onSecondary={() => setAssignSheetRow(null)}
            primaryLabel={`Assign${assignPicked.size ? ` (${assignPicked.size})` : ""}`}
            onPrimary={saveAssign}
            loading={assignSaving}
            disabled={assignPicked.size === 0}
          />
        }
      >
        <p className="mb-2 text-[12px] text-gray-500">
          Housekeeper yang sedang shift (fallback: semua HK).
        </p>
        <div className="max-h-[50vh] overflow-y-auto overscroll-contain rounded-xl border border-gray-100 bg-white">
          {hkOptions.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              Tidak ada housekeeper yang tersedia
            </p>
          )}
          {hkOptions.map((h) => {
            const checked = assignPicked.has(String(h?.value));
            return (
              <button
                key={h?.value}
                type="button"
                onClick={() => {
                  setAssignPicked((prev) => {
                    const next = new Set(prev);
                    checked ? next.delete(String(h?.value)) : next.add(String(h?.value));
                    return next;
                  });
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-gray-50"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                    checked
                      ? "border-[rgb(132,90,223)] bg-[rgb(132,90,223)] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={3}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className="text-[14px] text-gray-800">{h?.label}</span>
              </button>
            );
          })}
        </div>
      </MobileSheet>

      {/* ── filter sheet (6 filter, parity desktop dataForm) ── */}
      <MobileFilterSheet
        open={filterOpen}
        onClose={() => {
          setFilterOpen(false);
          setReloadKey((k) => k + 1);
        }}
        activeFilters={activeFilters}
        onRemoveFilter={removeFilter}
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFilters({ ...emptyFilters });
                setFilterOpen(false);
                setReloadKey((k) => k + 1);
              }}
              className="h-12 flex-1 rounded-full border border-gray-300 text-[15px] font-semibold text-gray-700 active:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterOpen(false);
                setReloadKey((k) => k + 1);
              }}
              className="h-12 flex-1 rounded-full bg-[rgb(132,90,223)] text-[15px] font-semibold text-white active:opacity-80"
            >
              Terapkan
            </button>
          </div>
        }
      >
        <label className="mb-1.5 block text-[12px] font-medium text-gray-500">
          Tanggal kerja
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mb-4 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none focus:border-[rgb(132,90,223)]"
        />
        {[
          { key: "maid_status", label: "Clean Status", opts: master?.maidStatuses ?? [] },
          { key: "room_status", label: "Room Status", opts: master?.roomStatuses ?? [] },
          { key: "floor", label: "Floor", opts: master?.floor ?? [] },
          { key: "building", label: "Tower", opts: master?.builder ?? [] },
          { key: "room_type", label: "Room Type", opts: master?.roomTypes ?? [] },
        ].map((grp) => (
          <div key={grp.key} className="mb-4">
            <p className="mb-1.5 text-[13px] font-semibold text-gray-700">{grp.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {grp.opts.map((o: any) => {
                const active = (filters as any)[grp.key]?.includes(Number(o.value));
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => {
                        const cur: number[] = (prev as any)[grp.key] ?? [];
                        return {
                          ...prev,
                          [grp.key]: active
                            ? cur.filter((x) => x !== Number(o.value))
                            : [...cur, Number(o.value)],
                        };
                      });
                    }}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      active
                        ? "border-transparent bg-[rgb(132,90,223)] text-white"
                        : "border-gray-200 bg-white text-gray-600 active:bg-gray-50"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </MobileFilterSheet>

      {/* ── clean all 2-step confirm ── */}
      <MobileSheet
        open={confirmCleanAll}
        onClose={() => {
          setConfirmCleanAll(false);
          setCleanAllState("idle");
        }}
        title={cleanAllState === "idle" ? "Clean All Rooms?" : "Yakin?"}
        footer={
          <MobileActionBar
            primaryLabel={
              cleanAllState === "idle"
                ? "Lanjut"
                : cleanAllSaving
                ? "Memproses..."
                : "YAKIN, CLEAN ALL"
            }
            tone={cleanAllState === "idle" ? "primary" : "danger"}
            onPrimary={() => (cleanAllState === "idle" ? setCleanAllState("confirm2") : cleanAll())}
            loading={cleanAllSaving}
          />
        }
      >
        {cleanAllState === "idle" ? (
          <p className="text-[14px] leading-relaxed text-gray-600">
            Menandai <span className="font-semibold">semua kamar dirty</span> pada tanggal {date}{" "}
            sebagai clean. Aksi ini massal.
          </p>
        ) : (
          <p className="text-[14px] leading-relaxed text-red-700">
            Ketuk <span className="font-semibold">YAKIN, CLEAN ALL</span> untuk konfirmasi final.
            Perubahan status langsung tampil di front desk.
          </p>
        )}
      </MobileSheet>
    </div>
  );
};

RoomStatusPage.getLayout = mobileLayout as any;

export default RoomStatusPage;
