'use client';
/**
 * M10 — Pool Usage desktop (menu 1205). Endpoint = M9/M8 identik:
 * GET /usages?date · guest-search · code-items · POST draft · POST :id/post · :id/void
 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FetchData, GetDecrypt, GetEncrypt } from '../../helper';
import { toast } from 'react-toastify';
import { useFormPermission, useTransactionPermission } from '../../../hooks/useFormPermission';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

const GLOBALURI = '/cms/pool/usages';
const fmtMoney = (n: any) => (Number(n) || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 });

const st = (s: number) =>
  s === 1 || s === 2 ? { label: 'Posted', cls: 'bg-green-100 text-green-700' }
  : s === 3 ? { label: 'Void', cls: 'bg-red-100 text-red-700' }
  : { label: 'Draft', cls: 'bg-amber-100 text-amber-700' };

interface ItemRow { code_item_id: string; item_name: string; qty: number; unit_price: number; }

export const PoolUsage = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canView } = useFormPermission(1205);
  const canVoid = useTransactionPermission('void_pool_usage');
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
  const [loading, setLoading] = React.useState(true);

  const form = useDisclosure();
  const [editId, setEditId] = React.useState<string | null>(null);
  const [folioId, setFolioId] = React.useState('');
  const [folioLabel, setFolioLabel] = React.useState('');
  const [guestQuery, setGuestQuery] = React.useState('');
  const [walkInName, setWalkInName] = React.useState('');
  const [walkInCard, setWalkInCard] = React.useState('');
  const [swimmers, setSwimmers] = React.useState(1);
  const [items, setItems] = React.useState<ItemRow[]>([]);
  const [codeItems, setCodeItems] = React.useState<any[]>([]);
  const [notes, setNotes] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const guestModal = useDisclosure();
  const [guestResults, setGuestResults] = React.useState<any[]>([]);

  const voidModal = useDisclosure();
  const [voidRow, setVoidRow] = React.useState<any>(null);
  const [voidReason, setVoidReason] = React.useState('');

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

  React.useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const openCreate = async () => {
    setEditId(null); setFolioId(''); setFolioLabel(''); setGuestQuery(''); setWalkInName('');
    setWalkInCard(''); setSwimmers(1); setItems([]); setNotes('');
    const res: any = await FetchData(`${GLOBALURI}/code-items`, 'GET', '', false, token, router, '');
    if (res?.code === 200 || res?.code == '200') setCodeItems(res?.data ?? []);
    form.onOpen();
  };

  const openEdit = async (row: any) => {
    if (Number(row?.posting_status) !== 0) return;
    setEditId(String(row?.id));
    setFolioId(row?.folio_id != null ? String(row.folio_id) : '');
    setFolioLabel(row?.folio_number ?? '');
    setGuestQuery('');
    setWalkInName(row?.guest_name ?? '');
    setWalkInCard(row?.guest_id_card ?? '');
    setSwimmers(Number(row?.swimmer_qty) || 1);
    setNotes(row?.notes ?? '');
    const [detail, ci]: any[] = await Promise.all([
      FetchData(`${GLOBALURI}/${row?.id}`, 'GET', '', false, token, router, ''),
      FetchData(`${GLOBALURI}/code-items`, 'GET', '', false, token, router, ''),
    ]);
    if (detail?.code === 200 || detail?.code == '200') {
      setItems(
        (detail?.data?.items ?? [])
          .filter((it: any) => it?.transaction_id == null)
          .map((it: any) => ({
            code_item_id: it?.code_item_id != null ? String(it.code_item_id) : '',
            item_name: it?.item_name ?? '',
            qty: Number(it?.qty) || 1,
            unit_price: Number(it?.unit_price) || 0,
          }))
      );
    }
    if (ci?.code === 200 || ci?.code == '200') setCodeItems(ci?.data ?? []);
    form.onOpen();
  };

  const searchGuests = async () => {
    if (!guestQuery.trim()) return;
    const res: any = await FetchData(`${GLOBALURI}/guest-search?q=${encodeURIComponent(guestQuery)}&date=${date}`, 'GET', '', false, token, router, '');
    setGuestResults(res?.code === 200 || res?.code == '200' ? res?.data ?? [] : []);
    guestModal.onOpen();
  };

  const totalAmount = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit_price) || 0), 0);

  const saveDraft = async () => {
    if (items.length === 0) { toast.error('Add at least 1 item.'); return; }
    if (!folioId && !walkInName.trim()) { toast.error('Select an in-house folio OR enter a walk-in name.'); return; }
    setSaving(true);
    const payload: any = {
      usage_date: date, items, swimmer_qty: swimmers, notes: notes || null,
      guest_id_card: walkInCard || null, pool_area_id: null,
    };
    if (folioId) payload.folio_id = Number(folioId); else payload.guest_name = walkInName;
    try {
      const res: any = await FetchData(editId ? `${GLOBALURI}/${editId}` : GLOBALURI, editId ? 'PUT' : 'POST', GetEncrypt(JSON.stringify(payload)), false, token, router, '');
      if (res?.code === 200 || res?.code == '200') { toast.success('Draft saved'); form.onClose(); load(); }
      else toast.error(res?.message ?? 'Save failed');
    } finally { setSaving(false); }
  };

  const postToFolio = async (row: any) => {
    const res: any = await FetchData(`${GLOBALURI}/${row?.id}/post`, 'POST', GetEncrypt(JSON.stringify({})), false, token, router, '');
    if (res?.code === 200 || res?.code == '200') { toast.success('Posted to guest folio'); load(); }
    else toast.error(res?.message ?? 'Posting failed');
  };

  const saveVoid = async () => {
    if (!voidReason.trim()) { toast.error('Void reason is required.'); return; }
    const res: any = await FetchData(`${GLOBALURI}/${voidRow?.id}/void`, 'POST', GetEncrypt(JSON.stringify({ reason: voidReason })), false, token, router, '');
    if (res?.code === 200 || res?.code == '200') { toast.success('Usage voided'); voidModal.onClose(); load(); }
    else toast.error(res?.message ?? 'Void failed');
  };

  if (!canView) {
    return <p className="py-16 text-center text-sm text-gray-500">You don't have access to view the Pool Usage module.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="rounded bg-gray-100 px-3 py-1 font-semibold">Rp {fmtMoney(summary?.amount)}</span>
          <span className="rounded bg-amber-100 px-3 py-1 text-amber-700">Draft {summary?.draft ?? 0}</span>
          <span className="rounded bg-green-100 px-3 py-1 text-green-700">Posted {summary?.posted ?? 0}</span>
          <span className="rounded bg-red-100 px-3 py-1 text-red-700">Void {summary?.void ?? 0}</span>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[rgb(132,90,223)] focus:outline-none" />
          </div>
          {canCreate && <Button className="rounded-md" size="sm" color="primary" onPress={openCreate}>Create Usage</Button>}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Guest / Folio</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Swimmers</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const s = st(Number(r?.posting_status));
              return (
                <tr key={r?.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">
                    <div className="font-medium text-gray-800">{r?.guest_name || r?.folio_number || 'Walk-in'}</div>
                    {r?.folio_number && <div className="text-xs text-gray-400">{r.folio_number}</div>}
                  </td>
                  <td className="px-3 py-2"><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span></td>
                  <td className="px-3 py-2">{r?.swimmer_qty ?? 1}</td>
                  <td className="px-3 py-2">{r?.qty_total ?? 0}</td>
                  <td className="px-3 py-2 text-right font-semibold">Rp {fmtMoney(r?.amount_total)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1.5">
                      {Number(r?.posting_status) === 0 && (
                        <>
                          {canUpdate && <Button className="rounded-md" size="sm" variant="flat" onPress={() => openEdit(r)}>Edit</Button>}
                          {r?.folio_id && canUpdate && <Button className="rounded-md" size="sm" color="primary" onPress={() => postToFolio(r)}>Post Folio</Button>}
                        </>
                      )}
                      {Number(r?.posting_status) !== 3 && canVoid && (
                        <Button className="rounded-md" size="sm" color="danger" variant="light" onPress={() => { setVoidRow(r); setVoidReason(''); voidModal.onOpen(); }}>Void</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !loading && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">No usage for {date}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* form modal */}
      <Modal isOpen={form.isOpen} onClose={form.onClose} size="2xl" scrollBehavior="inside"
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
          <ModalHeader>{editId ? 'Edit Usage Draft' : 'Create Usage'}</ModalHeader>
          <ModalBody>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-gray-600">Guest (in-house folio)</label>
                <input
                  value={folioId ? folioLabel : guestQuery}
                  onChange={(e) => { setGuestQuery(e.target.value); setFolioId(''); setFolioLabel(''); }}
                  placeholder="Search name / folio..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <Button className="rounded-md" size="sm" onPress={searchGuests}>Search</Button>
            </div>
            {folioId && <p className="text-xs text-green-600">Folio: {folioLabel}</p>}
            {!folioId && (
              <div className="grid grid-cols-2 gap-2">
                <input value={walkInName} onChange={(e) => setWalkInName(e.target.value)} placeholder="Walk-in name" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <input value={walkInCard} onChange={(e) => setWalkInCard(e.target.value)} placeholder="ID card no (optional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Number of swimmers</label>
              <input type="number" min={1} value={swimmers} onChange={(e) => setSwimmers(Number(e.target.value) || 1)} className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Items</label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {codeItems.map((ci: any) => (
                  <button key={ci?.value} type="button"
                    onClick={() => setItems((p) => [...p, { code_item_id: String(ci?.value), item_name: ci?.item_name ?? ci?.label ?? '', qty: 1, unit_price: Number(ci?.unit_price) || 0 }])}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                    + {ci?.label}
                  </button>
                ))}
              </div>
              <div className="divide-y rounded-lg border border-gray-200">
                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <span className="flex-1">{it.item_name}</span>
                    <input type="number" min={1} value={it.qty} onChange={(e) => setItems((p) => p.map((x, i) => i === idx ? { ...x, qty: Number(e.target.value) || 1 } : x))} className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center" />
                    <span>×</span>
                    <input type="number" min={0} value={it.unit_price} onChange={(e) => setItems((p) => p.map((x, i) => i === idx ? { ...x, unit_price: Number(e.target.value) || 0 } : x))} className="w-24 rounded-md border border-gray-300 px-2 py-1 text-right" />
                    <span className="w-28 text-right font-semibold">Rp {fmtMoney(it.qty * it.unit_price)}</span>
                    <button type="button" onClick={() => setItems((p) => p.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-right text-sm font-bold">Total: Rp {fmtMoney(totalAmount)}</p>
            </div>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </ModalBody>
          <ModalFooter>
            <Button className="rounded-md" variant="light" onPress={form.onClose}>Cancel</Button>
            <Button className="rounded-md" color="primary" isLoading={saving} onPress={saveDraft}>
              Save Draft {totalAmount ? `· Rp ${fmtMoney(totalAmount)}` : ''}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* guest list modal */}
      <Modal isOpen={guestModal.isOpen} onClose={guestModal.onClose} size="lg"
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
          <ModalHeader>Select Folio</ModalHeader>
          <ModalBody>
            {guestResults.length === 0 && <p className="p-6 text-center text-sm text-gray-400">No in-house folio found</p>}
            {guestResults.map((g: any) => (
              <button key={g?.value} type="button"
                onClick={() => { setFolioId(String(g?.value)); setFolioLabel(g?.label ?? ''); guestModal.onClose(); }}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 text-left text-sm hover:bg-gray-50">
                <span className="font-semibold">{g?.label}</span>
                <span className="text-xs text-gray-500">{g?.guest_name}</span>
              </button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* void modal */}
      <Modal isOpen={voidModal.isOpen} onClose={voidModal.onClose}
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
          <ModalHeader>Void usage?</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              <strong>{voidRow?.guest_name || voidRow?.folio_number || `#${voidRow?.id}`}</strong>
              {' '}Rp {fmtMoney(voidRow?.amount_total)}
            </p>
            {[1, 2].includes(Number(voidRow?.posting_status)) && (
              <p className="text-xs font-semibold text-red-600">⚠️ Already posted: related folio transactions will be deactivated.</p>
            )}
            <input value={voidReason} onChange={(e) => setVoidReason(e.target.value)} placeholder="Void reason (required)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </ModalBody>
          <ModalFooter>
            <Button className="rounded-md" variant="light" onPress={voidModal.onClose}>Cancel</Button>
            <Button className="rounded-md" color="danger" onPress={saveVoid}>Void</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PoolUsage;
