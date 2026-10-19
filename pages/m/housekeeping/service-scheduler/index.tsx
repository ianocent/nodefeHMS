"use client";

/**
 * M5 — Service Scheduler mobile (menuId 1181).
 * Default: AGENDA view (list per hari, 7 hari ke depan) — kalender bulanan tidak
 * dipakai di 360px. Alternatif tab: Timeline per shift.
 *
 * Endpoint (semua existing):
 * - GET  /cms/housekeeping/service-scheduler?date_from&date_to  (rows = assignment
 *   per user/date/shift + assigned_users[{name,total_rooms,floors}] + shift obj)
 * - GET  /cms/housekeeping/service-scheduler/shifts
 * - GET  /cms/housekeeping/service-scheduler/housekeepers
 * - POST /cms/housekeeping/rosters (array {date, shift_id, user_id, is_assigned})
 *   — payload persis desktop create-schedule-modal :145-152 (tanwa batch rooms;
 *   room assign lewat M6 Room Status)
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
import { IconChevronDown, IconPlus } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";

const SCHED_URI = "/cms/housekeeping/service-scheduler";
const ROSTER_URI = "/cms/housekeeping/rosters";

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const next7 = () => {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push(formatDate(d));
  }
  return out;
};

const agendaDays = (): { date: string; label: string; dayNum: string }[] =>
  next7().map((date, i) => {
    const d = new Date(date + "T00:00:00");
    return {
      date,
      label: i === 0 ? "Hari ini" : d.toLocaleDateString("id-ID", { weekday: "short" }),
      dayNum: String(d.getDate()).padStart(2, "0"),
    };
  });

const AgendaPage = () => {
  const router = useRouter();
  const { canCreate, canView } = useFormPermission(1181);
  const canAssignHousekeeper = useTransactionPermission("assign_housekeeper");
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  const days = useMemo(() => agendaDays(), []);
  const [view, setView] = useState<"agenda" | "timeline">("agenda");

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [shiftNames, setShiftNames] = useState<Record<number, { name: string; time: string }>>(
    {}
  );
  const [housekeepers, setHousekeepers] = useState<any[]>([]);
  const [openDay, setOpenDay] = useState<string | null>(next7()[0]);
  const [addOpen, setAddOpen] = useState(false);
  const [addDate, setAddDate] = useState(next7()[0]);
  const [addShift, setAddShift] = useState<number | null>(null);
  const [pickedHK, setPickedHK] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [shiftSelectOpen, setShiftSelectOpen] = useState(false);

  /* fetch week rows + shifts + housekeepers */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await FetchData(
        `${SCHED_URI}?date_from=${days[0].date}&date_to=${days[days.length - 1].date}&limit=1000`,
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
  }, [token]);

  useEffect(() => {
    load();
    let dead = false;
    (async () => {
      const [sh, hks] = await Promise.all([
        FetchData(`${SCHED_URI}/shifts`, "GET", "", false, token, router, ""),
        FetchData(`${SCHED_URI}/housekeepers`, "GET", "", false, token, router, ""),
      ]);
      if (dead) return;
      const map: Record<number, { name: string; time: string }> = {};
      if (sh?.code == "200" || sh?.code === 200) {
        (sh?.data ?? []).forEach((s: any) => {
          map[Number(s?.id)] = {
            name: s?.name ?? `Shift ${s?.id}`,
            time: s?.time_start ? `${String(s.time_start).slice(0, 5)}–${String(s.time_end ?? "").slice(0, 5)}` : "",
          };
        });
        setShiftNames(map);
      }
      if (hks?.code == 200 || hks?.code === 200) setHousekeepers(hks?.data ?? []);
    })();
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* group helpers */
  const byDay = useCallback(
    (date: string) => rows.filter((r) => r?.date === date),
    [rows]
  );
  const byShift = useCallback(
    (shiftId: number) => rows.filter((r) => Number(r?.shift_id) === shiftId),
    [rows]
  );

  const shiftsUsed = useMemo(() => {
    const ids = [...new Set(rows.map((r) => Number(r?.shift_id)).filter(Boolean))];
    return ids.map((id) => ({ id, ...(shiftNames[id] ?? { name: `Shift ${id}`, time: "" }) }));
  }, [rows, shiftNames]);

  if (!canView) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <MobileHeader title="Service Scheduler" />
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            Anda tidak punya izin lihat modul Service Scheduler.
          </p>
        </div>
      </div>
    );
  }

  const saveSchedule = async () => {
    if (addShift == null) return;
    setSaving(true);
    try {
      const hkIds = canAssignHousekeeper ? Array.from(pickedHK) : [];
      /* payload parity desktop create-schedule-modal :145-152 */
      const payload =
        hkIds.length > 0
          ? hkIds.map((hkId) => ({
              date: addDate,
              shift_id: Number(addShift),
              user_id: Number(hkId),
              is_assigned: true,
            }))
          : [{ date: addDate, shift_id: Number(addShift), is_assigned: true }];

      const res = await FetchData(
        ROSTER_URI,
        "POST",
        GetEncrypt(JSON.stringify(payload)),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        if (res?.skipped?.length > 0) {
          toast.info(`Tersimpan, ${res.skipped.length} dilewati (sudah ada)`);
        } else {
          toast.success("Schedule disimpan");
        }
        setAddOpen(false);
        load();
      } else {
        toast.error(res?.message ?? "Gagal menyimpan schedule");
      }
    } finally {
      setSaving(false);
    }
  };

  const AgendaStaffRow: React.FC<{ row: any }> = ({ row }) => {
    const au = row?.assigned_users?.[0];
    return (
      <div className="flex items-center justify-between gap-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-gray-900">
            {au?.name ?? `User #${row?.user_id}`}
          </p>
          <p className="text-[12px] text-gray-400">
            {au?.total_rooms != null ? `${au.total_rooms} kamar` : "belum ada data kamar"}
            {au?.floors?.length > 0 && ` · ${au.floors.join(", ")}`}
          </p>
        </div>
        <MobileChip tone="primary">
          {shiftNames[Number(row?.shift_id)]?.name ?? `Shift ${row?.shift_id}`}
        </MobileChip>
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Service Scheduler" subtitle="Jadwal kerja staf" />

      {/* tab switch */}
      <div className="flex gap-1 border-b border-gray-200 bg-white px-4 py-2">
        {(["agenda", "timeline"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`h-9 flex-1 rounded-full text-[13px] font-semibold ${
              view === v
                ? "bg-[rgb(132,90,223)] text-white"
                : "text-gray-500 active:bg-gray-100"
            }`}
          >
            {v === "agenda" ? "Agenda" : "Timeline Shift"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3">
        {loading ? (
          <MobileSkeleton count={4} />
        ) : rows.length === 0 ? (
          <MobileEmptyState
            title="Belum ada jadwal"
            description="7 hari ke depan kosong."
            action={
              canCreate ? (
                <button
                  type="button"
                  onClick={() => {
                    setAddDate(next7()[0]);
                    setAddShift(null);
                    setPickedHK(new Set());
                    setAddOpen(true);
                  }}
                  className="rounded-full bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
                >
                  + Buat Schedule
                </button>
              ) : undefined
            }
          />
        ) : view === "agenda" ? (
          /* ── Agenda: group by tanggal (7 hari ke depan) ── */
          days.map((d) => {
            const dayRows = byDay(d.date);
            if (dayRows.length === 0) return null;
            const open = openDay === d.date;
            return (
              <div key={d.date} className="mb-3">
                {/* sticky-ish day header */}
                <button
                  type="button"
                  onClick={() => setOpenDay(open ? null : d.date)}
                  className="flex w-full items-center justify-between rounded-t-xl border border-b-0 border-gray-200 bg-gray-50 px-4 py-2.5 active:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-gray-800">
                      {d.label === "Hari ini" ? "Hari ini" : d.label}
                    </span>
                    <span className="text-[12px] text-gray-400">
                      {d.date} · {dayRows.length} staf
                    </span>
                  </span>
                  <IconChevronDown
                    width={16}
                    height={16}
                    className={`text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`}
                  />
                </button>
                {open && (
                  <div className="rounded-b-xl border border-gray-200 bg-white px-4 pb-1.5">
                    {dayRows.map((row) => (
                      <AgendaStaffRow key={row?.id} row={row} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* ── Timeline per shift ── */
          shiftsUsed.map((s) => {
            const sRows = byShift(s.id);
            return (
              <div key={s.id} className="mb-3">
                <div className="mb-1.5 flex items-center gap-2">
                  <MobileChip tone="primary">{s.name}</MobileChip>
                  <span className="text-[12px] text-gray-400">{s.time}</span>
                  <span className="text-[12px] text-gray-400">· {sRows.length} staf</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 pb-1.5">
                  {sRows.map((row) => (
                    <div key={row?.id} className="border-b border-gray-100 py-2 last:border-0">
                      <AgendaStaffRow row={row} />
                      <p className="pb-1 text-[11px] text-gray-400">{row?.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {canCreate && (
        <button
          type="button"
          aria-label="Buat schedule"
          onClick={() => {
            setAddDate(next7()[0]);
            setAddShift(null);
            setPickedHK(new Set());
            setAddOpen(true);
          }}
          className="absolute bottom-6 right-4 z-[600] flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(132,90,223)] text-white shadow-lg active:opacity-85"
        >
          <IconPlus />
        </button>
      )}

      {/* create schedule sheet — shift → tanggal → housekeepers */}
      <MobileSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Buat Schedule"
        height="90%"
        footer={
          <MobileActionBar
            secondaryLabel="Batal"
            onSecondary={() => setAddOpen(false)}
            primaryLabel={
              canAssignHousekeeper && pickedHK.size
                ? `Simpan (${pickedHK.size} staf)`
                : "Simpan"
            }
            onPrimary={saveSchedule}
            loading={saving}
            disabled={addShift == null}
          />
        }
      >
        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          Shift
        </label>
        <button
          type="button"
          onClick={() => setShiftSelectOpen(true)}
          className="mb-4 flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-[15px] active:bg-gray-50"
        >
          <span className={addShift ? "text-gray-900" : "text-gray-400"}>
            {addShift ? shiftNames[addShift]?.name : "Pilih shift"}
          </span>
          <IconChevronDown width={16} height={16} className="text-gray-400" />
        </button>

        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          Tanggal
        </label>
        <input
          type="date"
          value={addDate}
          onChange={(e) => setAddDate(e.target.value)}
          className="mb-4 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none focus:border-[rgb(132,90,223)]"
        />

        {canAssignHousekeeper && (
          <>
            <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
              Housekeepers ({pickedHK.size} dipilih) — kosong = shift tanpa staf tetap
            </label>
            <div className="max-h-[40vh] overflow-y-auto overscroll-contain rounded-xl border border-gray-100 bg-white">
              {housekeepers.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-gray-400">
                  Tidak ada housekeeper dengan akses cleaning
                </p>
              )}
              {housekeepers.map((u) => {
                const checked = pickedHK.has(String(u?.id));
                return (
                  <button
                    key={u?.id}
                    type="button"
                    onClick={() => {
                      setPickedHK((prev) => {
                        const next = new Set(prev);
                        checked ? next.delete(String(u?.id)) : next.add(String(u?.id));
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
                    <span className="text-[14px] text-gray-800">{u?.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </MobileSheet>

      {/* shift picker sheet */}
      <MobileSheet
        open={shiftSelectOpen}
        onClose={() => setShiftSelectOpen(false)}
        title="Pilih Shift"
      >
        <div className="space-y-1.5">
          {Object.entries(shiftNames).map(([id, s]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setAddShift(Number(id));
                setShiftSelectOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left active:bg-gray-50 ${
                addShift === Number(id)
                  ? "border-[rgb(132,90,223)] bg-[rgb(132,90,223)] bg-opacity-5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-[14px] font-semibold text-gray-800">{s.name}</span>
              <span className="text-[12px] text-gray-400">{s.time}</span>
            </button>
          ))}
        </div>
      </MobileSheet>
    </div>
  );
};

AgendaPage.getLayout = mobileLayout as any;

export default AgendaPage;
