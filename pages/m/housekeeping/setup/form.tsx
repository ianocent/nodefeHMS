"use client";

/**
 * M3 — Housekeeping Setup form (create/edit), sectioned scroll satu kolom.
 * Payload & `*_ori` pattern = salinan persis desktop
 * `pages/house-keeping/housekeeping-setup/form/index.tsx`:
 *   - select → `{ value, label }` + field `_ori`
 *   - repeater rows room_types_detail / rooms_detail
 *   - final payload strips `_ori`, qty → Number, is_required boolean
 * Master options dari GET /create (res.master.room_types, res.master.rooms).
 */
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { toast } from "react-toastify";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import MobileSheet from "../../../../components/mobile/form/MobileSheet";
import { MobileChip } from "../../../../components/mobile/list/MobileCard";
import { IconClose } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping-setup";

interface SelectOption {
  value: string;
  label: string;
}
interface DetailRow {
  id?: string;
  room_type_id?: string;
  room_type_id_ori?: SelectOption | null;
  room_id?: string;
  room_id_ori?: SelectOption | null;
  qty: number;
  is_required: boolean;
}

const usedByOptions: SelectOption[] = [
  { value: "hk", label: "Housekeeper" },
  { value: "hkspv", label: "Supervisor" },
  { value: "both", label: "Both" },
];
const categoryOptions: SelectOption[] = [
  { value: "Bedroom Area", label: "Bedroom Area" },
  { value: "Bathroom Area", label: "Bathroom Area" },
  { value: "Balcony Area", label: "Balcony Area" },
  { value: "Pantry Area", label: "Pantry Area" },
  { value: "Living Room Area (Suite)", label: "Living Room Area" },
  { value: "Corridor/Entrance Area", label: "Corridor/Entrance Area" },
];

const SectionTitle: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="mb-2 mt-5">
    <h2 className="text-[13px] font-bold uppercase tracking-wide text-gray-500">
      {title}
    </h2>
    {hint && <p className="text-[12px] text-gray-400">{hint}</p>}
  </div>
);

const SetupFormPage = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canDelete } = useFormPermission(1172);
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  const id = (router.query.data as string) ?? "0";

  const [dataval, setDataval] = useState<any>({
    status: true,
    is_required: true,
    mandatory_inspection: false,
    used_by: "both",
    sort: 0,
  });
  const [roomTypeOptions, setRoomTypeOptions] = useState<SelectOption[]>([]);
  const [roomOptions, setRoomOptions] = useState<SelectOption[]>([]);
  const [roomTypesDetail, setRoomTypesDetail] = useState<DetailRow[]>([]);
  const [roomsDetail, setRoomsDetail] = useState<DetailRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let dead = false;
    (async () => {
      setFetchLoading(true);
      try {
        const uri = id === "0" || id === "" ? `${GLOBALURI}/create` : `${GLOBALURI}/${id}/update`;
        const res: any = await FetchData(uri, "GET", "", false, token, router, "");
        if (dead) return;
        setRoomTypeOptions(
          (res?.master?.room_types ?? []).map((o: any) => ({
            value: String(o.value),
            label: o.label,
          }))
        );
        setRoomOptions(
          (res?.master?.rooms ?? []).map((o: any) => ({
            value: String(o.value),
            label: o.label,
          }))
        );
        if (id !== "0" && id !== "" && res?.data) {
          const data = res.data;
          setDataval(data);
          setRoomTypesDetail(
            (data.room_types_detail ?? []).map((r: any) => ({
              ...r,
              room_type_id: String(r.room_type_id),
              room_type_id_ori: r.room_type_id_ori
                ? { value: String(r.room_type_id_ori.value), label: r.room_type_id_ori.label }
                : null,
            }))
          );
          setRoomsDetail(
            (data.rooms_detail ?? []).map((r: any) => ({
              ...r,
              room_id: String(r.room_id),
              room_id_ori: r.room_id_ori
                ? { value: String(r.room_id_ori.value), label: r.room_id_ori.label }
                : null,
            }))
          );
        }
      } finally {
        if (!dead) setFetchLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setField = (name: string, value: any) => setDataval((p: any) => ({ ...p, [name]: value }));

  /* select pattern selaras desktop: isi `_ori` + scalar */
  const setSelect = (name: string, opt: SelectOption) =>
    setDataval((p: any) => ({ ...p, [name]: opt.value, [name + "_ori"]: opt }));

  const isValid = useMemo(
    () => !!dataval?.code?.toString()?.trim() && !!dataval?.item_name?.toString()?.trim(),
    [dataval]
  );

  const onSave = async () => {
    if (!isValid) {
      toast.error("Code dan Item Name wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      /* payload persis desktop OnSave (:212-227) */
      const payload = {
        ...dataval,
        used_by: dataval?.used_by_ori?.value ?? dataval?.used_by,
        category: dataval?.category_ori?.value ?? dataval?.category,
        status: dataval?.status_ori?.value ?? dataval?.status,
        room_types_detail: roomTypesDetail.map((r) => ({
          room_type_id: String(r.room_type_id),
          qty: Number(r.qty) || 1,
          is_required: r.is_required,
        })),
        rooms_detail: roomsDetail.map((r) => ({
          room_id: String(r.room_id),
          qty: Number(r.qty) || 1,
          is_required: r.is_required,
        })),
      };
      const isNew = id === "0" || id === "";
      await FetchData(
        isNew ? GLOBALURI : `${GLOBALURI}/${id}`,
        isNew ? "POST" : "PUT",
        GetEncrypt(JSON.stringify(payload)),
        false,
        token,
        router,
        ""
      );
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setConfirmDelete(false);
    await FetchData(`${GLOBALURI}/${id}`, "DELETE", "", false, token, router, "");
    toast.success("Setup dihapus");
    router.back();
  };

  /* repeater updates — parity updateRoomTypeRow / updateRoomRow desktop */
  const updateDetail = (
    which: "rt" | "room",
    idx: number,
    field: string,
    value: any
  ) => {
    const setter = which === "rt" ? setRoomTypesDetail : setRoomsDetail;
    setter((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        if (which === "rt" && field === "ori") {
          const opt = value as SelectOption | null;
          return { ...row, room_type_id: opt?.value ?? "", room_type_id_ori: opt };
        }
        if (which === "room" && field === "ori") {
          const opt = value as SelectOption | null;
          return { ...row, room_id: opt?.value ?? "", room_id_ori: opt };
        }
        return { ...row, [field]: value };
      })
    );
  };

  const DetailRepeater: React.FC<{ which: "rt" | "room" }> = ({ which }) => {
    const rows: DetailRow[] = which === "rt" ? roomTypesDetail : roomsDetail;
    const options = which === "rt" ? roomTypeOptions : roomOptions;
    const idField = which === "rt" ? "room_type_id" : "room_id";
    return (
      <>
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="mb-2 rounded-xl border border-gray-200 bg-white p-3"
          >
            <div className="flex items-start gap-2">
              <select
                value={
                  ((which === "rt" ? row.room_type_id_ori?.value : row.room_id_ori?.value) ??
                    "") as string
                }
                onChange={(e) => {
                  const opt = options.find((o) => o.value === e.target.value) ?? null;
                  updateDetail(which, idx, "ori", opt);
                }}
                className="h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-[14px] outline-none focus:border-[rgb(132,90,223)]"
              >
                <option value="">{which === "rt" ? "Pilih room type" : "Pilih room unit"}</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Hapus baris"
                onClick={() =>
                  (which === "rt" ? setRoomTypesDetail : setRoomsDetail)((prev) =>
                    prev.filter((_, i) => i !== idx)
                  )
                }
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-red-50 text-red-600 active:bg-red-100"
              >
                <IconClose width={16} height={16} />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[12px] text-gray-500">Qty</span>
              <div className="flex h-10 items-center rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => updateDetail(which, idx, "qty", Math.max(1, Number(row.qty) - 1))}
                  className="h-full px-3 text-gray-600 active:bg-gray-50"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={row.qty}
                  onChange={(e) => updateDetail(which, idx, "qty", Number(e.target.value) || 1)}
                  className="w-12 border-0 text-center text-[14px] outline-none [appearance:textfield]"
                />
                <button
                  type="button"
                  onClick={() => updateDetail(which, idx, "qty", Number(row.qty) + 1)}
                  className="h-full px-3 text-gray-600 active:bg-gray-50"
                >
                  +
                </button>
              </div>
              <label className="ml-auto flex items-center gap-1.5 text-[13px] text-gray-600">
                <input
                  type="checkbox"
                  checked={!!row.is_required}
                  onChange={(e) => updateDetail(which, idx, "is_required", e.target.checked)}
                />
                Required
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            (which === "rt" ? setRoomTypesDetail : setRoomsDetail)((prev) => [
              ...prev,
              which === "rt"
                ? { room_type_id: "", room_type_id_ori: null, qty: 1, is_required: true }
                : { room_id: "", room_id_ori: null, qty: 1, is_required: true },
            ])
          }
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl border border-dashed border-[rgb(132,90,223)] text-[14px] font-semibold text-[rgb(132,90,223)] active:bg-[rgb(132,90,223)] active:bg-opacity-5"
        >
          + {which === "rt" ? "Add Room Type" : "Add Specific Room"}
        </button>
      </>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title={id !== "0" && id !== "" ? "Edit Setup" : "Tambah Setup"}
        subtitle={id !== "0" && id !== "" ? String(dataval?.item_name ?? "") : undefined}
      />

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-1">
        {fetchLoading ? (
          <div className="space-y-3 pt-2">
            <div className="h-11 animate-shimmer rounded-lg bg-gray-200" />
            <div className="h-11 animate-shimmer rounded-lg bg-gray-200" />
            <div className="h-20 animate-shimmer rounded-lg bg-gray-200" />
          </div>
        ) : (
          <>
            {/* ── section 1: Info ── */}
            <SectionTitle title="Info" />
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="mb-1 block text-[12px] font-medium text-gray-500">
                  Sort No
                </label>
                <input
                  type="number"
                  value={dataval?.sort ?? ""}
                  onChange={(e) => setField("sort", Number(e.target.value) || 0)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none focus:border-[rgb(132,90,223)]"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-[12px] font-medium text-gray-500">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  value={dataval?.code ?? ""}
                  onChange={(e) => setField("code", e.target.value)}
                  placeholder="cth. TOWEL-01"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-[12px] font-medium text-gray-500">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                value={dataval?.item_name ?? ""}
                onChange={(e) => setField("item_name", e.target.value)}
                placeholder="cth. Handuk Mandi"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
              />
            </div>
            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] font-medium text-gray-500">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categoryOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setSelect("category", o)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      (dataval?.category ?? "") === o.value
                        ? "border-transparent bg-[rgb(132,90,223)] text-white"
                        : "border-gray-200 bg-white text-gray-600 active:bg-gray-50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] font-medium text-gray-500">
                Used By
              </label>
              <div className="flex flex-wrap gap-1.5">
                {usedByOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setSelect("used_by", o)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      (dataval?.used_by ?? "both") === o.value
                        ? "border-transparent bg-[rgb(132,90,223)] text-white"
                        : "border-gray-200 bg-white text-gray-600 active:bg-gray-50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-[12px] font-medium text-gray-500">
                Description
              </label>
              <textarea
                rows={3}
                value={dataval?.description ?? ""}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Opsional"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
              />
            </div>

            {/* ── section 2: Opsi ── */}
            <SectionTitle title="Opsi" />
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
              {[
                { key: "is_required", label: "Required" },
                { key: "mandatory_inspection", label: "Mandatory Inspection" },
                { key: "status", label: "Active" },
              ].map((c) => (
                <label key={c.key} className="flex items-center justify-between">
                  <span className="text-[14px] text-gray-800">{c.label}</span>
                  <input
                    type="checkbox"
                    checked={!!dataval?.[c.key]}
                    onChange={(e) => setField(c.key, e.target.checked)}
                    className="h-5 w-5"
                  />
                </label>
              ))}
            </div>

            {/* ── section 3: Room Types ── */}
            <SectionTitle
              title="Room Types"
              hint={`${roomTypesDetail.length} tipe kamar ter-bind`}
            />
            <DetailRepeater which="rt" />

            {/* ── section 4: Rooms ── */}
            <SectionTitle
              title="Specific Rooms"
              hint={`${roomsDetail.length} unit kamar ter-bind`}
            />
            <DetailRepeater which="room" />
          </>
        )}
      </div>

      {/* delete strip di atas action bar, hanya saat edit + canDelete */}
      {(id !== "0" && id !== "" ) && canDelete && (
        <div className="border-t border-gray-200 bg-white px-4 pb-2 pt-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="h-10 w-full rounded-xl bg-red-50 text-[14px] font-semibold text-red-600 active:bg-red-100"
          >
            Hapus setup ini
          </button>
        </div>
      )}

      <MobileActionBar
        secondaryLabel="Batal"
        onSecondary={() => router.back()}
        primaryLabel="Simpan"
        onPrimary={onSave}
        loading={loading}
        disabled={fetchLoading}
      />

      <MobileSheet
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Hapus setup?"
        footer={
          <MobileActionBar
            secondaryLabel="Batal"
            onSecondary={() => setConfirmDelete(false)}
            primaryLabel="Hapus"
            tone="danger"
            onPrimary={onDelete}
          />
        }
      >
        <p className="text-[14px] leading-relaxed text-gray-600">
          <span className="font-semibold">{String(dataval?.item_name ?? "")}</span> akan
          dihapus. Setup yang dipakai checklist riwayat tidak ikut hilang.
        </p>
      </MobileSheet>
    </div>
  );
};

SetupFormPage.getLayout = mobileLayout as any;

export default SetupFormPage;
