'use client';
/**
 * M10 — Pool desktop wrapper (`/house-keeping/pool?module=`).
 * Komponen isi = endpoints yang SAMA dengan mobile M9, hanya shell berbeda.
 * File baru — file desktop existing tidak tersentuh.
 */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
} from '../../helper';
import { toast } from 'react-toastify';
import { useFormPermission, useTransactionPermission } from '../../../hooks/useFormPermission';
import {
  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

const GLOBALURI = '/cms/pool/attendances';

const STATUS_META: Record<number, { label: string; cls: string }> = {
  0: { label: 'Draft', cls: 'bg-gray-100 text-gray-600' },
  1: { label: 'Present', cls: 'bg-green-100 text-green-700' },
  2: { label: 'Late', cls: 'bg-amber-100 text-amber-700' },
  3: { label: 'Absent', cls: 'bg-red-100 text-red-700' },
  4: { label: 'Leave', cls: 'bg-blue-100 text-blue-700' },
  5: { label: 'Incomplete', cls: 'bg-amber-100 text-amber-700' },
  6: { label: 'Overtime', cls: 'bg-blue-100 text-blue-700' },
};

const fmt = (t: any) => (t ? String(t).slice(11, 16) : '—');

export const PoolAttendance = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canView } = useFormPermission(1204);
  const canCheckIn = useTransactionPermission('check_in_pool');
  const canCheckOut = useTransactionPermission('check_out_pool');
  const canOverride = useTransactionPermission('override_attendance');
  const { isLogin } = useSelector((state: any) => state?.auth);
  const token = React.useMemo(() => {
    try { return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? '' : ''; } catch { return ''; }
  }, [isLogin]);
  // business date dari sesi login (sumber = log_audits property, bukan jam komputer)
  const bizDate = React.useMemo(() => {
    try { return isLogin ? String(JSON.parse(GetDecrypt(isLogin))?.data?.bussinesDate ?? '') : ''; } catch { return ''; }
  }, [isLogin]);

  const [date, setDate] = React.useState(bizDate || new Date().toISOString().slice(0, 10));
  const [rows, setRows] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any>({});
  const [shifts, setShifts] = React.useState<any[]>([]);
  const [areas, setAreas] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const checkIn = useDisclosure();
  const [ciShift, setCiShift] = React.useState<string>('');
  const [ciArea, setCiArea] = React.useState<string>('');
  const [ciStaff, setCiStaff] = React.useState<string>('');
  const [saving, setSaving] = React.useState(false);

  const detail = useDisclosure();
  const [detailRow, setDetailRow] = React.useState<any>(null);
  const [checks, setChecks] = React.useState<any[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await FetchData(`${GLOBALURI}?date=${date}`, 'GET', '', false, token, router, '');
      if (res?.code === 200 || res?.code == '200') {
        setRows(res?.data ?? []);
        setSummary(res?.meta?.summary ?? {});
      }
    } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, token]);

  React.useEffect(() => {
    load();
    (async () => {
      const [sh, ar]: any[] = await Promise.all([
        FetchData(`${GLOBALURI}/shifts`, 'GET', '', false, token, router, ''),
        FetchData('/cms/pool/areas', 'GET', '', false, token, router, ''),
      ]);
      if (sh?.code === 200 || sh?.code == '200') setShifts(sh?.data ?? []);
      if (ar?.code === 200 || ar?.code == '200') setAreas(ar?.data ?? []);
    })().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveCheckIn = async () => {
    if (!ciShift) { toast.error('Select a shift.'); return; }
    setSaving(true);
    try {
      const payload: any = { shift_id: Number(ciShift), date, pool_area_id: ciArea || null };
      if (canCheckIn && ciStaff) payload.user_id = Number(ciStaff);
      const res: any = await FetchData(`${GLOBALURI}/check-in`, 'POST', GetEncrypt(JSON.stringify(payload)), false, token, router, '');
      if (res?.code === 200 || res?.code == '200') { toast.success('Check-in recorded'); checkIn.onClose(); load(); }
      else toast.error(res?.message ?? 'Check-in failed');
    } finally { setSaving(false); }
  };

  const openDetail = async (row: any) => {
    setDetailRow(row);
    detail.onOpen();
    const res: any = await FetchData(`${GLOBALURI}/${row?.id}`, 'GET', '', false, token, router, '');
    if (res?.code === 200 || res?.code == '200') setChecks(res?.data?.checklists ?? []);
  };

  const toggle = (id: any) =>
    setChecks((p) => p.map((c) => (Number(c.id) === Number(id) ? { ...c, is_checked: !c.is_checked } : c)));

  const saveChecks = async () => {
    setSaving(true);
    try {
      const res: any = await FetchData(`${GLOBALURI}/${detailRow?.id}/checklist`, 'PUT', GetEncrypt(JSON.stringify({ checklists: checks })), false, token, router, '');
      if (res?.code === 200 || res?.code == '200') { toast.success('Checklist saved'); detail.onClose(); load(); }
      else toast.error(res?.message ?? 'Save failed');
    } finally { setSaving(false); }
  };

  const checkout = async (row: any) => {
    const raw = window.prompt('Break minutes:', '60');
    if (raw === null) return;
    const res: any = await FetchData(`${GLOBALURI}/check-out`, 'POST', GetEncrypt(JSON.stringify({ attendance_id: row?.id, break_minutes: Number(raw) || 0, date })), false, token, router, '');
    if (res?.code === 200 || res?.code == '200') { toast.success('Check-out recorded'); load(); }
    else toast.error(res?.message ?? 'Check-out failed');
  };

  const override = async (row: any, status: number) => {
    let reason = '';
    if (status === 3) {
      reason = window.prompt('Reason to mark ABSENT (required):') ?? '';
      if (!reason.trim()) return;
    }
    const res: any = await FetchData(`${GLOBALURI}/${row?.id}/override`, 'PUT', GetEncrypt(JSON.stringify({ status, reason })), false, token, router, '');
    if (res?.code === 200 || res?.code == '200') { toast.success('Status overridden'); load(); }
    else toast.error(res?.message ?? 'Override failed');
  };

  if (!canView) {
    return <p className="py-16 text-center text-sm text-gray-500">You don't have access to view the Pool Attendance module.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900">Pool Staff Attendance</h3>
        <div className="flex items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[rgb(132,90,223)]" />
          </div>
          <Button className="rounded-md"
            size="sm"
            color="primary"
            isDisabled={!canCreate && !canUpdate}
            onPress={() => { setCiShift(''); setCiArea(''); setCiStaff(''); checkIn.onOpen(); }}
          >
            Check-in
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <span className="rounded bg-gray-100 px-3 py-1 font-semibold">Total {summary?.total ?? rows.length}</span>
        <span className="rounded bg-green-100 px-3 py-1 text-green-700">Present {summary?.present ?? 0}</span>
        <span className="rounded bg-amber-100 px-3 py-1 text-amber-700">Late {summary?.late ?? 0}</span>
        <span className="rounded bg-red-100 px-3 py-1 text-red-700">Absent {summary?.absent ?? 0}</span>
        <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">Overtime {summary?.overtime ?? 0}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Staff</th>
              <th className="px-3 py-2">Shift</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Check-in</th>
              <th className="px-3 py-2">Check-out</th>
              <th className="px-3 py-2">Break (m)</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r?.id} className="border-t border-gray-100">
                <td className="px-3 py-2 font-medium text-gray-800">{r?.user_name ?? `#${r?.user_id}`}</td>
                <td className="px-3 py-2 text-gray-500">{r?.shift_id}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS_META[Number(r?.status)]?.cls ?? ''}`}>
                    {STATUS_META[Number(r?.status)]?.label ?? '-'}
                  </span>
                  {r?.is_override && <span className="ml-1 text-[10px] text-red-500">(override)</span>}
                </td>
                <td className="px-3 py-2">{fmt(r?.check_in_at)}</td>
                <td className="px-3 py-2">{fmt(r?.check_out_at)}</td>
                <td className="px-3 py-2">{r?.break_minutes ?? 0}m</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1.5">
                    <Button className="rounded-md" size="sm" variant="flat" onPress={() => openDetail(r)}>Checklist</Button>
                    {canCheckOut && r?.check_in_at && !r?.check_out_at && (
                      <Button className="rounded-md" size="sm" color="default" onPress={() => checkout(r)}>Check-out</Button>
                    )}
                    {canOverride && r?.status !== 3 && (
                      <>
                        <Button className="rounded-md" size="sm" color="warning" variant="light" onPress={() => override(r, 2)}>Late</Button>
                        <Button className="rounded-md" size="sm" color="danger" variant="light" onPress={() => override(r, 3)}>Absent</Button>
                        <Button className="rounded-md" size="sm" color="secondary" variant="light" onPress={() => override(r, 4)}>Leave</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No attendance for {date}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* check-in modal */}
      <Modal isOpen={checkIn.isOpen} onClose={checkIn.onClose}
        classNames={{
          body: "py-6 px-8 gap-4 justify-center",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#ffffff] text-[#1f2937]",
          header: "border-b-[1px] border-[#292f46] text-gray-900",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent className="rounded-lg">
          <ModalHeader>Check-in</ModalHeader>
          <ModalBody>
            <label className="text-xs font-semibold text-gray-600">Shift</label>
            <select value={ciShift} onChange={(e) => setCiShift(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">— select —</option>
              {shifts.map((s: any) => <option key={s?.id} value={String(s?.id)}>{s?.name}</option>)}
            </select>
            {canCheckIn && (
              <>
                <label className="mt-2 text-xs font-semibold text-gray-600">Staff ID (blank = me)</label>
                <input value={ciStaff} onChange={(e) => setCiStaff(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </>
            )}
            <label className="mt-2 text-xs font-semibold text-gray-600">Area</label>
            <select value={ciArea} onChange={(e) => setCiArea(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">— no area —</option>
              {areas.filter((a: any) => a?.status && Number(a?.current_status) === 1).map((a: any) => (
                <option key={a?.id} value={String(a?.id)}>{a?.name}</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400">Checklist is auto-generated from setups bound to the area.</p>
          </ModalBody>
          <ModalFooter>
            <Button className="rounded-md" variant="light" onPress={checkIn.onClose}>Cancel</Button>
            <Button className="rounded-md" color="primary" isLoading={saving} onPress={saveCheckIn}>Check-in Now</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* checklist modal */}
      <Modal isOpen={detail.isOpen} onClose={detail.onClose} size="lg"
        classNames={{
          body: "py-6 px-8 gap-4 justify-center",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#ffffff] text-[#1f2937]",
          header: "border-b-[1px] border-[#292f46] text-gray-900",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent className="rounded-lg">
          <ModalHeader>Checklist — {detailRow?.user_name ?? ''}</ModalHeader>
          <ModalBody>
            <div className="divide-y rounded-lg border border-gray-200">
              {checks.length === 0 && <p className="p-6 text-center text-sm text-gray-400">No checklist items</p>}
              {checks.map((c: any) => (
                <label key={c?.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <input type="checkbox" checked={!!c.is_checked} onChange={() => toggle(c?.id)} className="h-4 w-4" />
                  <span className="flex-1">{c?.setup?.item_name ?? `Setup #${c?.pool_setup_id}`}</span>
                  <span className="text-xs text-gray-400">qty {c?.qty_required}</span>
                </label>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="rounded-md" variant="light" onPress={detail.onClose}>Close</Button>
            <Button className="rounded-md" color="primary" isLoading={saving} onPress={saveChecks}>Save Checklist</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PoolAttendance;
