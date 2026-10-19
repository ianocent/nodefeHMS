"use client";

/**
 * M4 — Roster week view (rosters, menuId 164).
 * ?data=<roster_list_id>
 *
 - Date-strip 7 hari (geser minggu ±), list roster per tanggal terpilih
 - Tambah roster: sheet shift → tanggal → multi-select user → POST array
   (GET/POST /cms/housekeeping/rosters — endpoint sama seperti desktop `table-rosters`)
 - Copy ke Minggu Depan: port 1:1 `TableRosters.handleCopyToNextWeek`
   (table-rosters/index.tsx:525-584) tapi confirm sheet + sheet daftar `skipped`
   (bukan `alert()`) — doc §2.16 / M4. Zero backend change.
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
import { MobileEmptyState, MobileSkeleton } from "../../../../components/mobile/list/MobileEmptyState";
import { IconPlus, IconSearch } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping/rosters";
const USERS_URI = "/cms/housekeeping/shift-user-list?mode=users&type=cleaning";
const SHIFTS_URI = "/cms/housekeeping/shift-roster";

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const stripDays = (startStr: string) => {
  const out: { date: string; label: string; dayNum: string }[] = [];
  const start = new Date(startStr);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({
      date: formatDate(d),
      label: d.toLocaleDateString("id-ID", { weekday: "short" }),
      dayNum: String(d.getDate()).padStart(2, "0"),
    });
  }
  return out;
};

const RosterWeekPage = () => {
  const router = useRouter();
  const rosterListId = (router.query.data as string) ?? "0";
  const { canCreate, canDelete, canView } = useFormPermission(164);
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  /* ── master: shifts + users (load sekali) ── */
  const [shifts, setShifts] = useState<any[]>([]);
  const [shiftName, setShiftName] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [mastersLoading, setMastersLoading] = useState(true);

  const [weekStart, setWeekStart] = useState(formatDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const days = useMemo(() => stripDays(weekStart), [weekStart]);

  const [rows, setRows] = useState<any[]>([]);
  const [rowsLoading, setRowsLoading] = useState(true);

  /* sheet states */
  const [addOpen, setAddOpen] = useState(false);
  const [addDate, setAddDate] = useState(selectedDate);
  const [addShift, setAddShift] = useState<number | null>(null);
  const [pickedUsers, setPickedUsers] = useState<Set<string>>(new Set());
  const [userSearch, setUserSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const [editRow, setEditRow] = useState<any>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultSkipped, setResultSkipped] = useState<string[]>([]);
  const [resultCount, setResultCount] = useState(0);
  const [confirmCopy, setConfirmCopy] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);

  useEffect(() => {
    let dead = false;
    (async () => {
      setMastersLoading(true);
      try {
        const [sh, us] = await Promise.all([
          FetchData(`${SHIFTS_URI}?limit=200`, "GET", "", false, token, router, ""),
          FetchData(`${USERS_URI}&page=1&limit=200&search=`, "GET", "", false, token, router, ""),
        ]);
        if (dead) return;
        if (sh?.code == "200") {
          setShifts(sh?.data ?? []);
          const map: Record<string, string> = {};
          sh?.data?.forEach((s: any) => (map[String(s?.id)] = s?.name ?? `Shift ${s?.id}`));
          setShiftName(map);
        }
        if (us?.code == "200") setUsers(us?.data ?? []);
      } finally {
        if (!dead) setMastersLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rosterListId]);

  /* rosters per tanggal terpilih (rosterList parity: date_from/date_to/roster_list_id) */
  const loadRows = useCallback(
    async (date: string) => {
      setRowsLoading(true);
      try {
        const res = await FetchData(
          `${GLOBALURI}?page=1&limit=1000&date_from=${date}&date_to=${date}&roster_list_id=${rosterListId}`,
          "GET",
          "",
          false,
          token,
          router,
          ""
        );
        if (res?.code == "200" || res?.code === 200) setRows(res?.data ?? []);
        else setRows([]);
      } catch {
        setRows([]);
      } finally {
        setRowsLoading(false);
      }
    },
    [rosterListId, token]
  );

  useEffect(() => {
    loadRows(selectedDate);
  }, [selectedDate, loadRows]);

  const shiftWeek = (dir: number) => {
    const start = new Date(weekStart);
    start.setDate(start.getDate() + dir * 7);
    const s = formatDate(start);
    setWeekStart(s);
    setSelectedDate(dir === 0 ? formatDate(new Date()) : s);
  };

  /* ── add roster: POST array {user_id, shift_id, date, roster_list_id, is_assigned} ── */
  const openAdd = () => {
    setAddDate(selectedDate);
    setAddShift(null);
    setPickedUsers(new Set());
    setUserSearch("");
    setAddOpen(true);
  };

  const saveRosters = async () => {
    if (addShift == null || pickedUsers.size === 0) return;
    setSaving(true);
    try {
      const payload = Array.from(pickedUsers).map((uid) => ({
        user_id: Number(uid),
        shift_id: addShift,
        date: addDate,
        roster_list_id: rosterListId,
        is_assigned: true,
      }));
      const res = await FetchData(
        GLOBALURI,
        "POST",
        GetEncrypt(JSON.stringify(payload)),
        false,
        token,
        router,
        ""
      );
      setAddOpen(false);
      const skipped: string[] = res?.skipped ?? [];
      setResultSkipped(skipped);
      setResultCount(payload.length - skipped.length);
      setResultOpen(true);
      loadRows(selectedDate);
    } finally {
      setSaving(false);
    }
  };

  /* ── edit / hapus satu row ── */
  const changeShift = async (row: any, shiftId: number) => {
    await FetchData(
      `${GLOBALURI}/${row?.id}`,
      "PUT",
      GetEncrypt(
        JSON.stringify({
          shift_id: shiftId,
          is_assigned: true,
          roster_list_id: rosterListId,
        })
      ),
      false,
      token,
      router,
      ""
    );
    setEditRow(null);
    loadRows(selectedDate);
  };

  const deleteRow = async (row: any) => {
    await FetchData(`${GLOBALURI}/${row?.id}`, "DELETE", "", false, token, router, "");
    toast.success("Roster dihapus");
    setEditRow(null);
    loadRows(selectedDate);
  };

  /* ── Copy to Next Week — port TableRosters.handleCopyToNextWeek (:525-584) ── */
  const copyToNextWeek = useCallback(async () => {
    setConfirmCopy(false);
    setCopyLoading(true);
    try {
      // ambil SEMUA roster minggu ini (bukan cuma tanggal terpilih)
      const res = await FetchData(
        `${GLOBALURI}?page=1&limit=1000&date_from=${weekStart}&date_to=${formatDate(
          new Date(new Date(weekStart).setDate(new Date(weekStart).getDate() + 6))
        )}&roster_list_id=${rosterListId}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const weekRows: any[] = (res?.code == "200" || res?.code === 200) ? res?.data ?? [] : [];
      const rostersThisWeek = weekRows.filter((it) => it?.shift_id && it.shift_id !== "");

      if (rostersThisWeek.length === 0) {
        toast.info("Tidak ada shift untuk di-copy.");
        return;
      }

      // shift tanggal +7 (formatDate parity desktop)
      const nextWeekRosters = rostersThisWeek.map((item) => {
        const nd = new Date(item.date);
        nd.setDate(nd.getDate() + 7);
        return {
          user_id: item.user_id,
          shift_id: item.shift_id,
          date: formatDate(nd),
          roster_list_id: rosterListId,
          is_assigned: true,
        };
      });

      const save = await FetchData(
        GLOBALURI,
        "POST",
        GetEncrypt(JSON.stringify(nextWeekRosters)),
        false,
        token,
        router,
        ""
      );

      if (save?.code === 200 || save?.code == "200") {
        if (save?.skipped?.length > 0) {
          setResultSkipped(save.skipped);
          setResultCount(nextWeekRosters.length - save.skipped.length);
          setResultOpen(true);
        } else {
          toast.success(`Copy selesai: ${nextWeekRosters.length} roster dibuat`);
        }
        // geser strip ke minggu depan (parity desktop :563-569)
        const nextStart = new Date(weekStart);
        nextStart.setDate(nextStart.getDate() + 7);
        const s = formatDate(nextStart);
        setWeekStart(s);
        setSelectedDate(s);
      } else {
        toast.error(save?.message ?? "Gagal copy roster.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setCopyLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, rosterListId, token]);

  const filteredUsers = users.filter((u) =>
    String(u?.name ?? "")
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  const userName = (id: number) =>
    users.find((u) => String(u?.id) === String(id))?.name ?? `User #${id}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title="Roster Mingguan"
        subtitle={`Roster #${rosterListId}`}
        right={
          canCreate ? (
            <button
              type="button"
              disabled={copyLoading}
              onClick={() => setConfirmCopy(true)}
              className="mr-1 rounded-full border border-[rgb(132,90,223)] px-3 py-1.5 text-[12px] font-semibold text-[rgb(132,90,223)] active:bg-[rgb(132,90,223)] active:bg-opacity-10 disabled:opacity-40"
            >
              Copy → minggu depan
            </button>
          ) : undefined
        }
      />

      {/* date strip */}
      <div className="border-b border-gray-200 bg-white px-3 pb-2 pt-2">
        <div className="mb-1.5 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => shiftWeek(-1)}
            className="h-9 rounded-full px-3 text-[13px] font-semibold text-gray-600 active:bg-gray-100"
          >
            ‹ Minggu
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(0)}
            className="text-[12px] font-medium text-gray-500"
          >
            Hari ini
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(1)}
            className="h-9 rounded-full px-3 text-[13px] font-semibold text-gray-600 active:bg-gray-100"
          >
            Minggu ›
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {days.map((d) => {
            const active = d.date === selectedDate;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className={`flex h-[52px] w-12 flex-none flex-col items-center justify-center rounded-xl border text-center ${
                  active
                    ? "border-transparent bg-[rgb(132,90,223)] text-white"
                    : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                }`}
              >
                <span className="text-[10px] font-medium uppercase">{d.label}</span>
                <span className="text-[15px] font-bold">{d.dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* rows for selected date */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-4">
        {rowsLoading ? (
          <MobileSkeleton count={3} />
        ) : rows.length === 0 ? (
          <MobileEmptyState
            title="Belum ada roster"
            description={
              canCreate
                ? "Tambah petugas untuk tanggal ini."
                : "Tidak ada petugas yang dijadwalkan."
            }
          />
        ) : (
          rows.map((row) => (
            <MobileCard key={row?.id} onClick={() => setEditRow(row)}>
              <div className="flex flex-1 items-center justify-between gap-2 py-1">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-gray-900">
                    {userName(row?.user_id)}
                  </p>
                  <p className="text-[12px] text-gray-400">
                    dicatat oleh sistem · roster #{row?.id}
                  </p>
                </div>
                <MobileChip tone="primary">{shiftName[String(row?.shift_id)] ?? `Shift ${row?.shift_id}`}</MobileChip>
              </div>
            </MobileCard>
          ))
        )}
      </div>

      {canCreate && (
        <button
          type="button"
          aria-label="Tambah roster"
          onClick={openAdd}
          className="absolute bottom-20 right-4 z-[600] flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(132,90,223)] text-white shadow-lg active:opacity-85"
        >
          <IconPlus />
        </button>
      )}

      {/* ── sheet: tambah roster (shift → tanggal → multi user) ── */}
      <MobileSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Tambah Roster"
        height="90%"
        footer={
          <MobileActionBar
            secondaryLabel="Batal"
            onSecondary={() => setAddOpen(false)}
            primaryLabel={`Simpan${pickedUsers.size ? ` (${pickedUsers.size})` : ""}`}
            onPrimary={saveRosters}
            loading={saving}
            disabled={addShift == null || pickedUsers.size === 0}
          />
        }
      >
        {/* shift picker */}
        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          Pilih Shift
        </label>
        {mastersLoading ? (
          <div className="mb-4 h-10 animate-shimmer rounded-lg bg-gray-200" />
        ) : (
          <div className="mb-4 flex flex-wrap gap-2">
            {shifts.map((s) => (
              <button
                key={s?.id}
                type="button"
                onClick={() => setAddShift(Number(s?.id))}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
                  addShift === Number(s?.id)
                    ? "border-transparent bg-[rgb(132,90,223)] text-white"
                    : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                }`}
              >
                {s?.name}
              </button>
            ))}
          </div>
        )}

        {/* date */}
        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          Tanggal
        </label>
        <input
          type="date"
          value={addDate}
          onChange={(e) => setAddDate(e.target.value)}
          className="mb-4 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none focus:border-[rgb(132,90,223)]"
        />

        {/* user multi-select + search */}
        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          Pilih Petugas ({pickedUsers.size} dipilih)
        </label>
        <div className="relative mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconSearch width={18} height={18} />
          </span>
          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Cari nama petugas..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-[14px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
          />
        </div>
        <div className="max-h-[40vh] overflow-y-auto overscroll-contain rounded-xl border border-gray-100 bg-white">
          {filteredUsers.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">Petugas tidak ditemukan</p>
          )}
          {filteredUsers.map((u) => {
            const checked = pickedUsers.has(String(u?.id));
            return (
              <button
                key={u?.id}
                type="button"
                onClick={() => {
                  setPickedUsers((prev) => {
                    const next = new Set(prev);
                    checked ? next.delete(String(u?.id)) : next.add(String(u?.id));
                    return next;
                  });
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left active:bg-gray-50"
              >
                <span className="flex items-center gap-3">
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
                  <span className="text-[14px] text-gray-800">{u?.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      </MobileSheet>

      {/* ── sheet: edit / hapus row ── */}
      <MobileSheet
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title={editRow ? userName(editRow?.user_id) : ""}
      >
        {editRow && (
          <>
            <p className="mb-2 text-[12px] text-gray-500">
              {editRow?.date} · ganti shift atau hapus roster ini.
            </p>
            <div className="flex flex-wrap gap-2 pb-2">
              {shifts.map((s) => {
                const current = Number(editRow?.shift_id) === Number(s?.id);
                return (
                  <button
                    key={s?.id}
                    type="button"
                    onClick={() => changeShift(editRow, Number(s?.id))}
                    className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
                      current
                        ? "border-[rgb(132,90,223)] bg-[rgb(132,90,223)] bg-opacity-10 text-[rgb(132,90,223)]"
                        : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                    }`}
                  >
                    {current ? "✓ " : ""}
                    {s?.name}
                  </button>
                );
              })}
            </div>
            {canDelete && (
              <button
                type="button"
                onClick={() => deleteRow(editRow)}
                className="mt-2 h-11 w-full rounded-xl bg-red-50 text-[14px] font-semibold text-red-600 active:bg-red-100"
              >
                Hapus roster ini
              </button>
            )}
          </>
        )}
      </MobileSheet>

      {/* ── confirm copy week ── */}
      <MobileSheet
        open={confirmCopy}
        onClose={() => setConfirmCopy(false)}
        title="Copy ke Minggu Depan"
        footer={
          <MobileActionBar
            secondaryLabel="Batal"
            onSecondary={() => setConfirmCopy(false)}
            primaryLabel={copyLoading ? "Menyalin..." : "Ya, Copy"}
            onPrimary={copyToNextWeek}
            loading={copyLoading}
          />
        }
      >
        <p className="text-[14px] leading-relaxed text-gray-600">
          Semua roster (yang punya shift) pada minggu{" "}
          <span className="font-semibold">{weekStart}</span> –{" "}
          <span className="font-semibold">
            {formatDate(new Date(new Date(weekStart).setDate(new Date(weekStart).getDate() + 6)))}
          </span>{" "}
          akan diduplikasi ke minggu berikutnya (+7 hari).
        </p>
        <p className="mt-2 text-[13px] text-gray-500">
          Roster yang sudah ada di minggu tujuan dengan shift sama akan dilewati otomatis.
        </p>
      </MobileSheet>

      {/* ── hasil copy / add ── */}
      <MobileSheet
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title="Hasil"
      >
        <p className="text-[14px] text-gray-700">
          <span className="font-semibold text-green-700">{resultCount}</span> roster{" "}
          {resultCount === 1 ? "entry" : "entries"} dibuat.
        </p>
        {resultSkipped.length > 0 && (
          <>
            <p className="mt-3 mb-1.5 text-[13px] font-semibold text-amber-700">
              Dilewati (sudah ada) · {resultSkipped.length}
            </p>
            <ul className="max-h-[40vh] space-y-1.5 overflow-y-auto">
              {resultSkipped.map((s, i) => (
                <li
                  key={i}
                  className="rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800"
                >
                  {s}
                </li>
              ))}
            </ul>
          </>
        )}
      </MobileSheet>
    </div>
  );
};

RosterWeekPage.getLayout = mobileLayout as any;

export default RosterWeekPage;
