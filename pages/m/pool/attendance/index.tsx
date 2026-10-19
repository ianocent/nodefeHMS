"use client";

/**
 * M9 — Pool Attendance (menuId 1204) — pilar A.
 * GET  /cms/pool/attendances?date      (meta.summary + list, self-only utk non-FO)
 * GET  /cms/pool/attendances/shifts
 * POST /cms/pool/attendances/check-in  {shift_id, pool_area_id?, user_id?}
 * POST /cms/pool/attendances/check-out {break_minutes?, user_id?}
 * GET  /cms/pool/attendances/:id → toggle checklist → PUT /:id/checklist
 * PUT  /cms/pool/attendances/:id/override (perm override_attendance)
 */
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { toast } from "react-toastify";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileSheet from "../../../../components/mobile/form/MobileSheet";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import { MobileCard, MobileChip } from "../../../../components/mobile/list/MobileCard";
import { MobileEmptyState, MobileSkeleton } from "../../../../components/mobile/list/MobileEmptyState";
import { IconChevronDown } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/pool/attendances";

const statusMeta: Record<number, { label: string; tone: "green" | "red" | "amber" | "primary" | "gray" }> = {
  0: { label: "Draft", tone: "gray" },
  1: { label: "Present", tone: "green" },
  2: { label: "Late", tone: "amber" },
  3: { label: "Absent", tone: "red" },
  4: { label: "Leave", tone: "primary" },
  5: { label: "Incomplete", tone: "amber" },
  6: { label: "Overtime", tone: "primary" },
};
const fmtTime = (t: any) => (t ? String(t).slice(11, 16) : null);

const AttendancePage = () => {
  const router = useRouter();
  const { canView } = useFormPermission(1204);
  const canCheckInAction = useTransactionPermission("check_in_pool");
  const canCheckOutAction = useTransactionPermission("check_out_pool");
  const canOverride = useTransactionPermission("override_attendance");
  const { isLogin } = useSelector((state: any) => state?.auth);
  const token = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);
  // business date dari sesi login (sumber = log_audits property, bukan jam komputer)
  const bizDate = useMemo(() => {
    try {
      return isLogin ? String(JSON.parse(GetDecrypt(isLogin))?.data?.bussinesDate ?? "") : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  const [date, setDate] = useState(bizDate || new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [shiftPickerOpen, setShiftPickerOpen] = useState(false);
  const [staffId, setStaffId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const [checkoutRow, setCheckoutRow] = useState<any>(null);
  const [breakMin, setBreakMin] = useState(60);

  const [detailRow, setDetailRow] = useState<any>(null);
  const [checks, setChecks] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await FetchData(
        `${GLOBALURI}?date=${date}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const ok = res?.code === 200 || res?.code == "200";
      setRows(ok ? res?.data ?? [] : []);
      setSummary(ok ? res?.meta?.summary ?? {} : {});
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, token]);

  React.useEffect(() => {
    load();
    let dead = false;
    (async () => {
      const [sh, ar] = await Promise.all([
        FetchData(`${GLOBALURI}/shifts`, "GET", "", false, token, router, ""),
        FetchData("/cms/pool/areas", "GET", "", false, token, router, ""),
      ]);
      if (dead) return;
      if (sh?.code === 200 || sh?.code == "200") setShifts(sh?.data ?? []);
      if (ar?.code === 200 || ar?.code == "200") setAreas(ar?.data ?? []);
    })().catch(() => {});
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCheckIn = () => {
    setShiftId(null);
    setAreaId(null);
    setCheckInOpen(true);
  };

  const saveCheckIn = async () => {
    if (!shiftId) return;
    setSaving(true);
    try {
      const payload: any = { shift_id: shiftId, date, pool_area_id: areaId ?? null };
      if (canCheckInAction && staffId) payload.user_id = Number(staffId);
      const res: any = await FetchData(
        `${GLOBALURI}/check-in`,
        "POST",
        GetEncrypt(JSON.stringify(payload)),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        toast.success("Check-in recorded");
        setCheckInOpen(false);
        load();
      } else {
        toast.error(res?.message ?? res?.meta?.message ?? "Check-in failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const saveCheckOut = async () => {
    if (!checkoutRow) return;
    setSaving(true);
    try {
      const res: any = await FetchData(
        `${GLOBALURI}/check-out`,
        "POST",
        GetEncrypt(
          JSON.stringify({
            attendance_id: checkoutRow?.id,
            break_minutes: Number(breakMin) || 0,
            date,
          })
        ),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        toast.success("Check-out recorded");
        setCheckoutRow(null);
        load();
      } else {
        toast.error(res?.message ?? "Check-out failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const openDetail = async (row: any) => {
    setDetailRow(row);
    try {
      const res: any = await FetchData(
        `${GLOBALURI}/${row?.id}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const ok = (res?.code === 200 || res?.code == "200") && res?.data;
      setChecks(ok ? res?.data?.checklists ?? [] : []);
    } catch {
      setChecks([]);
    }
  };

  const toggleCheck = (row: any) =>
    setChecks((prev) =>
      prev.map((c) => (Number(c.id) === Number(row?.id) ? { ...c, is_checked: !c.is_checked } : c))
    );

  const saveChecks = async () => {
    if (!detailRow) return;
    setSaving(true);
    try {
      const res: any = await FetchData(
        `${GLOBALURI}/${detailRow?.id}/checklist`,
        "PUT",
        GetEncrypt(JSON.stringify({ checklists: checks })),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        toast.success("Checklist saved");
        setDetailRow(null);
        load();
      } else {
        toast.error(res?.message ?? "Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const saveOverride = async (row: any, status: number) => {
    let reason = "";
    if (status === 3) {
      reason = window.prompt("Reason to mark ABSENT (required):") ?? "";
      if (!reason.trim()) return;
    }
    try {
      const res: any = await FetchData(
        `${GLOBALURI}/${row?.id}/override`,
        "PUT",
        GetEncrypt(JSON.stringify({ status, reason })),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        toast.success("Status overridden");
        load();
      } else {
        toast.error(res?.message ?? "Override failed");
      }
    } finally {
    }
  };

  const total = summary?.total ?? rows.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title="Pool Attendance"
        subtitle={date}
        right={
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 rounded-full border border-gray-200 bg-white px-3 text-[12px] outline-none"
          />
        }
      />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            You don't have access to view the Pool Attendance module.
          </p>
        </div>
      ) : (
        <>
          <div className="border-b border-gray-200 bg-white px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
              <span className="text-[13px] font-bold text-gray-900">
                Total <span className="text-[rgb(132,90,223)]">{total}</span>
              </span>
              <span className="text-green-700">Present {summary?.present ?? 0}</span>
              <span className="text-amber-700">Late {summary?.late ?? 0}</span>
              <span className="text-red-600">Absent {summary?.absent ?? 0}</span>
              <span className="text-gray-500">Overtime {summary?.overtime ?? 0}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-4">
            {loading ? (
              <MobileSkeleton count={4} />
            ) : rows.length === 0 ? (
              <MobileEmptyState
                title="No attendance yet"
                description={date}
                action={
                  <button
                    type="button"
                    onClick={openCheckIn}
                    className="rounded-md bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
                  >
                    Check-in
                  </button>
                }
              />
            ) : (
              rows.map((row) => {
                const meta = statusMeta[Number(row?.status)] ?? { label: "-", tone: "gray" as const };
                return (
                  <MobileCard key={row?.id} onClick={() => openDetail(row)}>
                    <div className="flex flex-1 flex-col gap-1.5 py-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[15px] font-semibold text-gray-900">
                          {row?.user_name ?? `#${row?.user_id}`}
                        </span>
                        <MobileChip tone={meta.tone}>{meta.label}</MobileChip>
                      </div>
                      <p className="text-[12px] text-gray-400">
                        {fmtTime(row?.check_in_at) ? `In ${fmtTime(row?.check_in_at)}` : "Not in"}
                        {fmtTime(row?.check_out_at) ? ` · Out ${fmtTime(row?.check_out_at)}` : ""}
                        {Number(row?.break_minutes) > 0 ? ` · break ${row?.break_minutes}m` : ""}
                      </p>
                    </div>
                  </MobileCard>
                );
              })
            )}
          </div>

          {(canCheckInAction || canCheckOutAction) && (
            <div className="border-t border-gray-200 bg-white px-4 py-2">
              <button
                type="button"
                onClick={openCheckIn}
                className="h-11 w-full rounded-md bg-[rgb(132,90,223)] text-[15px] font-semibold text-white active:opacity-85"
              >
                Check-in {canCheckInAction ? "staff" : "me"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── check-in sheet ── */}
      <MobileSheet
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        title="Check-in"
        height="80%"
        footer={
          <MobileActionBar radius="md" loadingLabel="Saving..."
            secondaryLabel="Cancel"
            onSecondary={() => setCheckInOpen(false)}
            primaryLabel="Check-in Now"
            onPrimary={saveCheckIn}
            loading={saving}
            disabled={!shiftId}
          />
        }
      >
        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">Shift</label>
        <button
          type="button"
          onClick={() => setShiftPickerOpen(true)}
          className="mb-4 flex h-11 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-4 text-[15px] active:bg-gray-50"
        >
          <span className={shiftId ? "text-gray-900" : "text-gray-400"}>
            {shiftId
              ? shifts.find((s) => Number(s?.id) === shiftId)?.name ?? "Shift"
              : "Select shift"}
          </span>
          <IconChevronDown width={16} height={16} className="text-gray-400" />
        </button>

        {canCheckInAction && (
          <>
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Staff ID (blank = myself)
            </label>
            <input
              inputMode="numeric"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="User ID (e.g. 12)"
              className="mb-4 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
            />
          </>
        )}

        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          Area (optional)
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setAreaId(null)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
              areaId == null
                ? "border-transparent bg-[rgb(132,90,223)] text-white"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            No area
          </button>
          {areas
            .filter((a: any) => a?.status && Number(a?.current_status) === 1)
            .map((a: any) => (
              <button
                key={a?.id}
                type="button"
                onClick={() => setAreaId(Number(a?.id))}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                  areaId === Number(a?.id)
                    ? "border-transparent bg-[rgb(132,90,223)] text-white"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                {a?.name}
              </button>
            ))}
        </div>
        <p className="mt-3 text-[11px] text-gray-400">
          Checklist items are auto-generated from setups bound to the area.
        </p>
      </MobileSheet>

      {/* ── shift picker ── */}
      <MobileSheet open={shiftPickerOpen} onClose={() => setShiftPickerOpen(false)} title="Select Shift">
        <div className="space-y-1.5">
          {shifts.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">No shifts configured</p>
          )}
          {shifts.map((s: any) => (
            <button
              key={s?.id}
              type="button"
              onClick={() => {
                setShiftId(Number(s?.id));
                setShiftPickerOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left active:bg-gray-50 ${
                shiftId === Number(s?.id)
                  ? "border-[rgb(132,90,223)] bg-[rgb(132,90,223)] bg-opacity-5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-[14px] font-semibold text-gray-800">{s?.name}</span>
              <span className="text-[12px] text-gray-400">
                {s?.time_start ? String(s.time_start).slice(0, 5) : ""}
                {"–"}
                {s?.time_end ? String(s.time_end).slice(0, 5) : ""}
              </span>
            </button>
          ))}
        </div>
      </MobileSheet>

      {/* ── detail + checklist sheet ── */}
      <MobileSheet
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow ? `${detailRow?.user_name ?? ""}` : ""}
        height="88%"
        footer={
          checks.length > 0 ? (
            <MobileActionBar radius="md" loadingLabel="Saving..."
              secondaryLabel="Close"
              onSecondary={() => setDetailRow(null)}
              primaryLabel="Save Checklist"
              onPrimary={saveChecks}
              loading={saving}
            />
          ) : undefined
        }
      >
        {detailRow && (
          <>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <MobileChip tone={(statusMeta[Number(detailRow?.status)] ?? { tone: "gray" }).tone}>
                {(statusMeta[Number(detailRow?.status)] ?? { label: "-" }).label}
              </MobileChip>
              {detailRow?.is_override && (
                <MobileChip tone="red">Override: {detailRow?.override_reason}</MobileChip>
              )}
            </div>
            <p className="mb-2 text-[13px] font-semibold text-gray-700">
              Checklist ({checks.filter((c) => c.is_checked).length}/{checks.length})
            </p>
            {checks.length === 0 && (
              <p className="rounded-md border border-gray-200 bg-white px-4 py-4 text-center text-sm text-gray-400">
                No items — this area is not bound to any setup.
              </p>
            )}
            <div className="rounded-md border border-gray-200 bg-white">
              {checks.map((c) => (
                <button
                  key={c?.id}
                  type="button"
                  onClick={() => toggleCheck(c)}
                  className="flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-0 active:bg-gray-50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-6 w-6 flex-none items-center justify-center rounded-md border ${
                        c.is_checked
                          ? "border-[rgb(132,90,223)] bg-[rgb(132,90,223)] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {c.is_checked && (
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={3}>
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span className="truncate text-[14px] text-gray-800">
                      {c?.setup?.item_name ?? `Setup #${c?.pool_setup_id}`}
                    </span>
                  </span>
                  <span className="text-[12px] text-gray-400">qty {c?.qty_required}</span>
                </button>
              ))}
            </div>

            {canOverride && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="mb-2 text-[12px] font-semibold text-red-700">
                  Override (permission required)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { s: 2, label: "Late" },
                    { s: 4, label: "Leave" },
                    { s: 3, label: "Absent" },
                  ].map((o) => (
                    <button
                      key={o.s}
                      type="button"
                      onClick={() => saveOverride(detailRow, o.s)}
                      className="rounded-md bg-white px-3 py-1.5 text-[12px] font-semibold text-red-700 active:bg-red-100"
                    >
                      → {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {canCheckOutAction && detailRow?.check_in_at && !detailRow?.check_out_at && (
              <button
                type="button"
                onClick={() => {
                  setBreakMin(60);
                  setDetailRow(null);
                  setCheckoutRow(detailRow);
                }}
                className="mt-3 h-11 w-full rounded-md bg-gray-900 text-[14px] font-semibold text-white active:opacity-85"
              >
                Check-out now
              </button>
            )}
          </>
        )}
      </MobileSheet>

      {/* ── check-out sheet ── */}
      <MobileSheet
        open={!!checkoutRow}
        onClose={() => setCheckoutRow(null)}
        title="Check-out"
        footer={
          <MobileActionBar radius="md" loadingLabel="Saving..."
            secondaryLabel="Cancel"
            onSecondary={() => setCheckoutRow(null)}
            primaryLabel="Confirm Check-out"
            onPrimary={saveCheckOut}
            loading={saving}
          />
        }
      >
        <p className="text-[14px] font-semibold text-gray-800">
          {checkoutRow?.user_name ?? ""}
        </p>
        <label className="mb-1 mt-3 block text-[12px] font-medium text-gray-500">
          Break minutes
        </label>
        <input
          type="number"
          min={0}
          value={breakMin}
          onChange={(e) => setBreakMin(Number(e.target.value) || 0)}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none focus:border-[rgb(132,90,223)]"
        />
        <p className="mt-2 text-[11px] text-gray-400">
          Check-out time uses server time. Overtime is automatic past the shift end; status
          becomes <strong>Incomplete</strong> if the checklist is not finished.
        </p>
      </MobileSheet>
    </div>
  );
};

AttendancePage.getLayout = mobileLayout as any;

export default AttendancePage;
