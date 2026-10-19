'use client';
/**
 * M10 — Pool Setup desktop (menu 1203).
 * GET /pool/setups (rows + payload pool_areas_detail) · /create master ·
 * POST/PUT/DELETE. Repeater bind-area = payload `pool_areas_detail[]`.
 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FetchData, GetDecrypt, GetEncrypt } from '../../helper';
import { toast } from 'react-toastify';
import { useFormPermission } from '../../../hooks/useFormPermission';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

const GLOBALURI = '/cms/pool/setups';

const usedByLabel: Record<string, string> = { attendant: 'Attendant', supervisor: 'Supervisor', both: 'Both' };
const catLabel: Record<string, string> = { equipment: 'Equipment', safety: 'Safety', hygiene: 'Hygiene', linen: 'Linen' };

export const PoolSetup = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canDelete, canView } = useFormPermission(1203);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const token = React.useMemo(() => {
    try { return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? '' : ''; } catch { return ''; }
  }, [isLogin]);

  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const form = useDisclosure();
  const [editId, setEditId] = React.useState<string | null>(null);
  const [f, setF] = React.useState<any>({ is_required: true, mandatory_check: false, status: true, used_by: 'both', sort: 0 });
  const [areaOptions, setAreaOptions] = React.useState<any[]>([]);
  const [details, setDetails] = React.useState<any[]>([]);
  const [saving, setSaving] = React.useState(false);

  const delModal = useDisclosure();
  const [delRow, setDelRow] = React.useState<any>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await FetchData(GLOBALURI, 'GET', '', false, token, router, '');
      if (res?.code === 200 || res?.code == '200') setRows(res?.data ?? []);
    } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  React.useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const loadAreas = async () => {
    if (areaOptions.length) return;
    const m: any = await FetchData(`${GLOBALURI}/create`, 'GET', '', false, token, router, '');
    if (m?.code === 200 || m?.code == '200') setAreaOptions(m?.master?.pool_areas ?? []);
  };

  const openCreate = () => {
    setEditId(null);
    setF({ is_required: true, mandatory_check: false, status: true, used_by: 'both', sort: 0, code: '', item_name: '', category: null, description: '' });
    setDetails([]);
    loadAreas();
    form.onOpen();
  };

  const openEdit = (row: any) => {
    setEditId(String(row?.id));
    setF(row);
    setDetails(
      (row?.pool_areas_detail ?? []).map((r: any) => ({
        pool_area_id: String(r.pool_area_id),
        qty: Number(r.qty) || 1,
        is_required: !!r.is_required,
      }))
    );
    loadAreas();
    form.onOpen();
  };

  const save = async () => {
    if (!f?.code?.trim() || !f?.item_name?.trim()) { toast.error('Code and Item Name are required.'); return; }
    const payload = {
      code: f.code, item_name: f.item_name, category: f.category ?? null,
      used_by: f.used_by ?? 'both', is_required: !!f.is_required,
      mandatory_check: !!f.mandatory_check, description: f.description ?? null,
      sort: Number(f.sort) || 0, status: !!f.status,
      pool_areas_detail: details.map((r) => ({
        pool_area_id: Number(r.pool_area_id), qty: Number(r.qty) || 1, is_required: !!r.is_required,
      })),
    };
    setSaving(true);
    try {
      const res: any = await FetchData(editId ? `${GLOBALURI}/${editId}` : GLOBALURI, editId ? 'PUT' : 'POST', GetEncrypt(JSON.stringify(payload)), false, token, router, '');
      if (res?.code === 200 || res?.code == '200') { toast.success('Setup saved'); form.onClose(); load(); }
      else toast.error(res?.message ?? 'Save failed');
    } finally { setSaving(false); }
  };

  const del = async () => {
    const res: any = await FetchData(`${GLOBALURI}/${delRow?.id}`, 'DELETE', '', false, token, router, '');
    if (res?.code === 200 || res?.code == '200') { toast.success('Setup deleted'); delModal.onClose(); load(); }
    else toast.error(res?.message ?? 'Delete failed');
  };

  if (!canView) {
    return <p className="py-16 text-center text-sm text-gray-500">You don't have access to view the Pool Setup module.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Pool Setup Checklist Master</h3>
        {canCreate && <Button className="rounded-md" size="sm" color="primary" onPress={openCreate}>Create Setup</Button>}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Item Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Used By</th>
              <th className="px-3 py-2">Bind Area</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r?.id} className="border-t border-gray-100">
                <td className="px-3 py-2 font-mono text-xs">{r?.code}</td>
                <td className="px-3 py-2 font-medium text-gray-800">{r?.item_name}</td>
                <td className="px-3 py-2">{r?.category ? catLabel[r?.category] ?? r?.category : '—'}</td>
                <td className="px-3 py-2">{usedByLabel[r?.used_by] ?? r?.used_by}</td>
                <td className="px-3 py-2">{(r?.pool_areas_detail ?? []).length} area(s)</td>
                <td className="px-3 py-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${r?.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r?.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1.5">
                    {canUpdate && <Button className="rounded-md" size="sm" variant="flat" onPress={() => openEdit(r)}>Edit</Button>}
                    {canDelete && (
                      <Button className="rounded-md" size="sm" color="danger" variant="light" onPress={() => { setDelRow(r); delModal.onOpen(); }}>Delete</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No setups yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

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
          <ModalHeader>{editId ? 'Edit Setup' : 'Create Setup'}</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Sort</label>
                <input type="number" value={f?.sort ?? 0} onChange={(e) => setF({ ...f, sort: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
              </div>
              <div className="col-span-1">
                <label className="mb-1 block text-xs text-gray-500">Code *</label>
                <input value={f?.code ?? ''} onChange={(e) => setF({ ...f, code: e.target.value })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs text-gray-500">Item Name *</label>
                <input value={f?.item_name ?? ''} onChange={(e) => setF({ ...f, item_name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Category</label>
                <select value={f?.category ?? ''} onChange={(e) => setF({ ...f, category: e.target.value || null })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm">
                  <option value="">—</option>
                  {Object.entries(catLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Used By</label>
                <select value={f?.used_by ?? 'both'} onChange={(e) => setF({ ...f, used_by: e.target.value })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm">
                  {Object.entries(usedByLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <textarea rows={2} value={f?.description ?? ''} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Description (optional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <div className="flex gap-6 text-sm">
              {[['is_required', 'Required'], ['mandatory_check', 'Mandatory during attendance'], ['status', 'Active']].map(([k, l]: any) => (
                <label key={k} className="flex items-center gap-2">
                  <input type="checkbox" checked={!!f?.[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} className="h-4 w-4" />
                  {l}
                </label>
              ))}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-600">Bind Area ({details.length})</label>
                <Button className="rounded-md" size="sm" variant="flat"
                  onPress={() => setDetails((p) => [...p, { pool_area_id: '', qty: 1, is_required: true }])}>
                  + Area
                </Button>
              </div>
              <div className="divide-y rounded-lg border border-gray-200">
                {details.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <select value={d.pool_area_id} onChange={(e) => setDetails((p) => p.map((x, i) => i === idx ? { ...x, pool_area_id: e.target.value } : x))} className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm">
                      <option value="">— select area —</option>
                      {areaOptions.map((a: any) => <option key={a.value} value={String(a.value)}>{a.label}</option>)}
                    </select>
                    <input type="number" min={1} value={d.qty} onChange={(e) => setDetails((p) => p.map((x, i) => i === idx ? { ...x, qty: Number(e.target.value) || 1 } : x))} className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-center text-sm" />
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={!!d.is_required} onChange={(e) => setDetails((p) => p.map((x, i) => i === idx ? { ...x, is_required: e.target.checked } : x))} className="h-4 w-4" />
                      required
                    </label>
                    <button type="button" onClick={() => setDetails((p) => p.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="rounded-md" variant="light" onPress={form.onClose}>Cancel</Button>
            <Button className="rounded-md" color="primary" isLoading={saving} onPress={save}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={delModal.isOpen} onClose={delModal.onClose}
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
          <ModalHeader>Delete setup?</ModalHeader>
          <ModalBody><p className="text-sm"><strong>{delRow?.item_name}</strong> will be deleted (soft delete).</p></ModalBody>
          <ModalFooter>
            <Button className="rounded-md" variant="light" onPress={delModal.onClose}>Cancel</Button>
            <Button className="rounded-md" color="danger" onPress={del}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PoolSetup;
