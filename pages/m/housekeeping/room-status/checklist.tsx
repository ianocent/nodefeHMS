"use client";

/**
 * M6 — Checklist layar penuh (?room=<id>&name=<label>).
 * GET  /cms/housekeeping/room-status/checklist?room_id&used_by  → item rows
 *      {id, code, item_name, category, qty, is_required, mandatory_inspection,...}
 * PUT  /cms/housekeeping/room-status/status/:id — type:
 *      start_clean_time / end_clean_time (checklist HK) /
 *      done_inspection (checklist SPV) / still_need_to_clean
 *      (payload parity backend roomStatusUpdateStatus :1869-1991; checklist =
 *       array boolean aligning item rows, LIKE desktop).
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { toast } from "react-toastify";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import { MobileChip } from "../../../../components/mobile/list/MobileCard";
import { MobileEmptyState } from "../../../../components/mobile/list/MobileEmptyState";
import mobileLayout from "../../_layout";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping/room-status";

const ChecklistPage = () => {
  const router = useRouter();
  const room = router.query.room as string;
  const roomName = (router.query.name as string) ?? "";
  const { canUpdate, canView } = useFormPermission(172);
  const canPerformClean = useTransactionPermission("perform_cleaning");
  const canInspect = useTransactionPermission("perform_inspection");
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState("");

  const load = useCallback(async () => {
    if (!room) return;
    setLoading(true);
    try {
      /* business date dulu (pendek: /master di-/cache helper utk /cms/menu saja,
         jadi fetch master di sini untuk business_date) */
      const m = await FetchData(
        `${GLOBALURI}/master`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const dt = m?.master?.business_date || new Date().toISOString().slice(0, 10);
      setDate(dt);

      const res = await FetchData(
        `${GLOBALURI}/checklist?room_id=${room}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const withState = (res?.code == "200" || res?.code === 200 ? res?.data ?? [] : []).map(
        (it: any) => ({ ...it, is_checked: it.is_checked ?? !it.is_required })
      );
      setItems(withState);
      setChecked(withState.map((it: any) => !!it.is_checked));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, token]);

  useEffect(() => {
    load();
  }, [load]);

  const checkedCount = checked.filter(Boolean).length;
  const progress = items.length ? Math.round((checkedCount / items.length) * 100) : 0;

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  /* stepper: rubah qty? checklist backend boolean-only → qty sebagai snapshot tampilan */
  const submit = async (type: string, extra?: Record<string, any>) => {
    if (!canUpdate) {
      toast.error("Tidak ada izin.");
      return;
    }
    setSaving(true);
    try {
      await FetchData(
        `${GLOBALURI}/status/${room}`,
        "PUT",
        GetEncrypt(
          JSON.stringify({
            type,
            checklist: checked,
            date,
            ...(extra ?? {}),
          })
        ),
        false,
        token,
        router,
        ""
      );
      toast.success("Checklist tersimpan");
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();
    items.forEach((it, i) => {
      const key = it?.category || "Lain-lain";
      map.set(key, [...(map.get(key) ?? []), { ...it, _i: i }]);
    });
    return [...map.entries()];
  }, [items]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title={`Checklist ${roomName}`}
        subtitle={date ? `Tanggal kerja ${date}` : undefined}
        right={
          <MobileChip tone={progress === 100 ? "green" : "amber"}>
            {checkedCount}/{items.length} item
          </MobileChip>
        }
      />

      {/* progress bar */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[rgb(132,90,223)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-gray-400">{progress}% ter-center</p>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3">
        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-shimmer rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <MobileEmptyState
            title="Belum ada item checklist"
            description="Item dari Housekeeping Setup yang ter-bind ke room type/unit kamar ini."
          />
        ) : (
          grouped.map(([cat, list]) => (
            <div key={cat as string} className="mb-4">
              <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-gray-500">
                {cat}
              </p>
              <div className="rounded-xl border border-gray-200 bg-white">
                {list.map((it: any, j: number) => (
                  <button
                    key={`${it.id}-${it._i}`}
                    type="button"
                    onClick={() => toggle(it._i)}
                    className={`flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-0 active:bg-gray-50`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-6 w-6 flex-none items-center justify-center rounded-md border ${
                          checked[it._i]
                            ? "border-[rgb(132,90,223)] bg-[rgb(132,90,223)] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {checked[it._i] && (
                          <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={3}>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] text-gray-800">
                          {it?.item_name}
                        </span>
                        {!!it?.is_required && (
                          <span className="text-[11px] font-semibold text-red-400">wajib</span>
                        )}
                      </span>
                    </span>
                    <span className="flex-none text-[12px] text-gray-400">
                      qty {it?.qty ?? 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* aksi = tahap kerja yang sama dengan status sheet (payload backend parity) */}
      <MobileActionBar
        primaryLabel={
          saving ? "Menyimpan..." : canPerformClean && canInspect ? "Simpan sebagai Inspeksi Selesai" : "Simpan & Selesai Bersih"
        }
        onPrimary={() => submit(canPerformClean && canInspect ? "done_inspection" : "end_clean_time")}
        loading={saving}
        disabled={items.length === 0}
      />
    </div>
  );
};

ChecklistPage.getLayout = mobileLayout as any;

export default ChecklistPage;
