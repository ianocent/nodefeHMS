'use client';
/**
 * M10 — Pool Recap desktop (menu 1206). GET /cms/pool/recap?date_from&date_to.
 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FetchData, GetDecrypt } from '../../helper';
import { useFormPermission } from '../../../hooks/useFormPermission';
import { Button } from '@nextui-org/button';

const fmtMoney = (n: any) => (Number(n) || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 });
const isoDaysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

export const PoolRecap = () => {
  const router = useRouter();
  const { canView } = useFormPermission(1206);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const token = React.useMemo(() => {
    try { return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? '' : ''; } catch { return ''; }
  }, [isLogin]);
  // business date dari sesi login (sumber = log_audits property, bukan jam komputer)
  const bizDate = React.useMemo(() => {
    try { return isLogin ? String(JSON.parse(GetDecrypt(isLogin))?.data?.bussinesDate ?? '') : ''; } catch { return ''; }
  }, [isLogin]);
  const bizShift = (n: number) => {
    const d = new Date((bizDate || new Date().toISOString().slice(0, 10)) + 'T00:00:00.000Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const [from, setFrom] = React.useState(bizDate ? bizShift(-6) : isoDaysAgo(6));
  const [to, setTo] = React.useState(bizDate || new Date().toISOString().slice(0, 10));
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await FetchData(`/cms/pool/recap?date_from=${from}&date_to=${to}`, 'GET', '', false, token, router, '');
      if (res?.code === 200 || res?.code == '200') setRows(res?.data?.rows ?? []);
    } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, token]);

  React.useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const totals = rows.reduce(
    (a, r) => ({ amounts: a.amounts + Number(r.amounts), usages: a.usages + (Number(r.usages) || 0), swimmers: a.swimmers + (Number(r.swimmers) || 0) }),
    { amounts: 0, usages: 0, swimmers: 0 }
  );

  if (!canView) {
    return <p className="py-16 text-center text-sm text-gray-500">You don't have access to view the Pool Recap module.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900">Pool Recap</h3>
        <div className="flex items-end gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-500">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm" />
          </div>
          <Button className="rounded-md" size="sm" color="primary" onPress={load}>Apply</Button>
        </div>
      </div>

      <div className="mb-4 flex gap-4 text-sm">
        <span className="rounded bg-gray-100 px-3 py-1 font-semibold">Rp {fmtMoney(totals.amounts)}</span>
        <span className="rounded bg-gray-100 px-3 py-1">{totals.usages} usage</span>
        <span className="rounded bg-gray-100 px-3 py-1">{totals.swimmers} swimmers</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Usage</th>
              <th className="px-3 py-2">Draft</th>
              <th className="px-3 py-2">Posted</th>
              <th className="px-3 py-2">Void</th>
              <th className="px-3 py-2">Swimmers</th>
              <th className="px-3 py-2">Attendance</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r?.date} className="border-t border-gray-100">
                <td className="px-3 py-2 font-medium text-gray-800">{r?.date}</td>
                <td className="px-3 py-2">{r?.usages ?? 0}</td>
                <td className="px-3 py-2 text-amber-700">{r?.draft ?? 0}</td>
                <td className="px-3 py-2 text-green-700">{r?.posted ?? 0}</td>
                <td className="px-3 py-2 text-red-600">{r?.void ?? 0}</td>
                <td className="px-3 py-2">{r?.swimmers ?? 0}</td>
                <td className="px-3 py-2 text-xs">
                  {r?.attendances ?? 0} (present {r?.present ?? 0}, late {r?.late ?? 0}, absent {r?.absent ?? 0})
                </td>
                <td className="px-3 py-2 text-right font-semibold">Rp {fmtMoney(r?.amounts)}</td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No data {from} → {to}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoolRecap;
