'use client';
/**
 * M10 — Pool Area desktop (menu 1202). GET/POST/PUT/DELETE /cms/pool/areas.
 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FetchData, GetDecrypt, GetEncrypt } from '../../helper';
import { toast } from 'react-toastify';
import { useFormPermission } from '../../../hooks/useFormPermission';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

const GLOBALURI = '/cms/pool/areas';

const curStatus = [
  { value: 0, label: 'Closed', cls: 'bg-gray-100 text-gray-600' },
  { value: 1, label: 'Open', cls: 'bg-green-100 text-green-700' },
  { value: 2, label: 'Maintenance', cls: 'bg-amber-100 text-amber-700' },
];
const areaType = [
  { value: '', label: '—' },
  { value: 'main', label: 'Main Pool' },
  { value: 'kids', label: 'Kids Pool' },
  { value: 'jacuzzi', label: 'Jacuzzi' },
  { value: 'lounge', label: 'Lounge' },
];

export const PoolAreas = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canDelete, canView } = useFormPermission(1202);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const token = React.useMemo(() => {
    try { return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? '' : ''; } catch { return ''; }
  }, [isLogin]);

  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const form = useDisclosure();
  const [editId, setEditId] = React.useState<string | null>(null);
  const [f, setF] = React.useState<any>({ status: true, current_status: 0, capacity: 0, sort: 0 });
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

  const openCreate = () => {
    setEditId(null);
    setF({ status: true, current_status: 0, capacity: 0, sort: 0, code: '', name: '', area_type: '', depth_meter: '', location_note: '' });
    form.onOpen();
  };

  const openEdit = (row: any) => { setEditId(String(row?.id)); setF(row); form.onOpen(); };

  const save = async () => {
    if (!f?.code?.trim() || !f?.name?.trim()) { toast.error('Code and Name are required.'); return; }
    const allowed = ['code', 'name', 'area_type', 'capacity', 'depth_meter', 'location_note', 'sort', 'status', 'current_status'];
    const payload = allowed.reduce((acc: any, k) => { if (f[k] !== undefined && f[k] !== null) acc[k] = f[k]; return acc; }, {});
    setSaving(true);
    try {
      const res: any = await FetchData(editId ? `${GLOBALURI}/${editId}` : GLOBALURI, editId ? 'PUT' : 'POST', GetEncrypt(JSON.stringify(payload)), false, token, router, '');
      if (res?.code === 200 || res?.code == '200') { toast.success('Area saved'); form.onClose(); load(); }
      else toast.error(res?.message ?? 'Save failed');
    } finally { setSaving(false); }
  };

  const del = async () => {
    const res: any = await FetchData(`${GLOBALURI}/${delRow?.id}`, 'DELETE', '', false, token, router, '');
    if (res?.code === 200 || res?.code == '200') { toast.success('Area deleted'); delModal.onClose(); load(); }
    else toast.error(res?.message ?? 'Delete failed');
  };

  if (!canView) {
    return <p className="py-16 text-center text-sm text-gray-500">You don't have access to view the Pool Area module.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Pool Area Master</h3>
        {canCreate && <Button className="rounded-md" size="sm" color="primary" onPress={openCreate}>Create Area</Button>}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Capacity</th>
              <th className="px-3 py-2">Depth</th>
              <th className="px-3 py-2">Operations</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r?.id} className="border-t border-gray-100">
                <td className="px-3 py-2 font-mono text-xs">{r?.code}</td>
                <td className="px-3 py-2 font-medium text-gray-800">{r?.name}</td>
                <td className="px-3 py-2">{areaType.find((a) => a.value === r?.area_type)?.label ?? '—'}</td>
                <td className="px-3 py-2">{r?.capacity ?? 0}</td>
                <td className="px-3 py-2">{r?.depth_meter ?? '—'} m</td>
                <td className="px-3 py-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${curStatus[Number(r?.current_status)]?.cls}`}>
                    {curStatus[Number(r?.current_status)]?.label ?? '-'}
                  </span>
                </td>
                <td className="px-3 py-2">{r?.status ? 'Yes' : 'No'}</td>
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
              <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No areas yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={form.isOpen} onClose={form.onClose}
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
          <ModalHeader>{editId ? 'Edit Area' : 'Create Area'}</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Sort</label>
                <input type="number" value={f?.sort ?? 0} onChange={(e) => setF({ ...f, sort: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs text-gray-500">Code *</label>
                <input value={f?.code ?? ''} onChange={(e) => setF({ ...f, code: e.target.value })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Name *</label>
              <input value={f?.name ?? ''} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Type</label>
                <select value={f?.area_type ?? ''} onChange={(e) => setF({ ...f, area_type: e.target.value || null })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm">
                  {areaType.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Capacity</label>
                <input type="number" value={f?.capacity ?? 0} onChange={(e) => setF({ ...f, capacity: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Depth (m)</label>
                <input value={f?.depth_meter ?? ''} onChange={(e) => setF({ ...f, depth_meter: e.target.value })} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Location note</label>
              <textarea rows={2} value={f?.location_note ?? ''} onChange={(e) => setF({ ...f, location_note: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Operations</label>
              <div className="flex gap-2">
                {curStatus.map((c) => (
                  <button key={c.value} type="button"
                    onClick={() => setF({ ...f, current_status: c.value })}
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${Number(f?.current_status) === c.value ? c.cls : 'bg-white text-gray-500 border border-gray-300'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!f?.status} onChange={(e) => setF({ ...f, status: e.target.checked })} className="h-4 w-4" />
              Active
            </label>
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
          <ModalHeader>Delete area?</ModalHeader>
          <ModalBody><p className="text-sm"><strong>{delRow?.name}</strong> will be deleted (soft delete).</p></ModalBody>
          <ModalFooter>
            <Button className="rounded-md" variant="light" onPress={delModal.onClose}>Cancel</Button>
            <Button className="rounded-md" color="danger" onPress={del}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PoolAreas;
