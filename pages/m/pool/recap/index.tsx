"use client";

/**
 * M9 — Pool Recap (menuId 1206).
 * GET /cms/pool/recap?date_from&date_to → meta-free body { rows[] } per hari:
 * usages/amounts/draft/posted/void/swimmers + attendances/present/late/absent.
 */
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt } from "../../../../components/helper";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import { MobileEmptyState, MobileSkeleton } from "../../../../components/mobile/list/MobileEmptyState";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const fmtMoney = (n: any) =>
  (Number(n) || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

const isoDaysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const RecapPage = () => {
  const router = useRouter();
  const { canView } = useFormPermission(1206);
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
  const bizShift = (n: number) => {
    const d = new Date((bizDate || new Date().toISOString().slice(0, 10)) + "T00:00:00.000Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const [from, setFrom] = useState(bizDate ? bizShift(-6) : isoDaysAgo(6));
  const [to, setTo] = useState(bizDate || new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await FetchData(
        `/cms/pool/recap?date_from=${from}&date_to=${to}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const ok = res?.code === 200 || res?.code == "200";
      setRows(ok ? res?.data?.rows ?? [] : []);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, token]);

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          amounts: acc.amounts + Number(r.amounts) || acc.amounts,
          usages: acc.usages + (Number(r.usages) || 0),
          swimmers: acc.swimmers + (Number(r.swimmers) || 0),
        }),
        { amounts: 0, usages: 0, swimmers: 0 }
      ),
    [rows]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader title="Pool Recap" subtitle="Daily" />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            You don't have access to view the Pool Recap module.
          </p>
        </div>
      ) : (
        <>
          <div className="border-b border-gray-200 bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-[13px] outline-none focus:border-[rgb(132,90,223)]"
              />
              <span className="text-gray-400">→</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-[13px] outline-none focus:border-[rgb(132,90,223)]"
              />
              <button
                type="button"
                onClick={load}
                className="h-10 flex-none rounded-md bg-[rgb(132,90,223)] px-4 text-[13px] font-semibold text-white active:opacity-85"
              >
                Apply
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
              <span className="text-[13px] font-bold text-gray-900">
                Rp <span className="text-[rgb(132,90,223)]">{fmtMoney(totals.amounts)}</span>
              </span>
              <span className="text-gray-500">{totals.usages} usage</span>
              <span className="text-gray-500">{totals.swimmers} swimmers</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-4">
            {loading ? (
              <MobileSkeleton count={5} />
            ) : rows.length === 0 ? (
              <MobileEmptyState
                title="No data"
                description={`${from} → ${to}`}
              />
            ) : (
              <div className="space-y-2.5">
                {rows.map((r) => (
                  <div key={r?.date} className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-gray-900">{r?.date}</span>
                      <span className="text-[14px] font-bold text-[rgb(132,90,223)]">
                        Rp {fmtMoney(r?.amounts)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                      <span>{r?.usages ?? 0} usages</span>
                      <span>draft {r?.draft ?? 0}</span>
                      <span>posted {r?.posted ?? 0}</span>
                      {Number(r?.void) > 0 && (
                        <span className="text-red-500">void {r?.void}</span>
                      )}
                      <span>·</span>
                      <span>{r?.swimmers ?? 0} swimmers</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                      <span>attendance {r?.attendances ?? 0}</span>
                      <span className="text-green-700">present {r?.present ?? 0}</span>
                      {Number(r?.late) > 0 && (
                        <span className="text-amber-700">late {r?.late}</span>
                      )}
                      {Number(r?.absent) > 0 && (
                        <span className="text-red-500">absent {r?.absent}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

RecapPage.getLayout = mobileLayout as any;

export default RecapPage;
