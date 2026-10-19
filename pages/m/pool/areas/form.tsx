"use client";

/**
 * M9 — Pool Area form (create/edit), menuId 1202.
 * GET/POST/PUT/DELETE /cms/pool/areas[/:id]
 * Payload parity controller: code* nama*, area_type select chips,
 * capacity/deep/sort number, status & current_status toggle chips.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { toast } from "react-toastify";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import MobileSheet from "../../../../components/mobile/form/MobileSheet";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/pool/areas";

const areaTypeOptions = [
  { value: "main", label: "Main Pool" },
  { value: "kids", label: "Kids Pool" },
  { value: "jacuzzi", label: "Jacuzzi" },
  { value: "lounge", label: "Lounge" },
];
const currentStatuses = [
  { value: 0, label: "Closed", tone: "bg-gray-200 text-gray-700" },
  { value: 1, label: "Open", tone: "bg-green-50 text-green-700" },
  { value: 2, label: "Maintenance", tone: "bg-amber-50 text-amber-700" },
];

const AreaFormPage = () => {
  const router = useRouter();
  const { canUpdate, canDelete } = useFormPermission(1202);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const token = useMemo(() => {
    try {
      return isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  const id = (router.query.data as string) ?? "0";
  const isNew = id === "0" || id === "";

  const [form, setForm] = useState<any>({
    status: true,
    current_status: 0,
    capacity: 0,
    sort: 0,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let dead = false;
    (async () => {
      if (isNew) return;
      setFetchLoading(true);
      try {
        const res: any = await FetchData(`${GLOBALURI}/${id}`, "GET", "", false, token, router, "");
        if (dead) return;
        if (res?.data) setForm(res.data);
      } finally {
        if (!dead) setFetchLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setField = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const onSave = async () => {
    if (!form?.code?.toString().trim() || !form?.name?.toString().trim()) {
      toast.error("Code and Name are required.");
      return;
    }
    const allowed = [
      "code", "name", "area_type", "capacity", "depth_meter",
      "location_note", "sort", "status", "current_status",
    ];
    const payload: any = allowed.reduce((acc: any, k) => {
      if (form[k] !== undefined) acc[k] = form[k];
      return acc;
    }, {});
    setLoading(true);
    try {
      await FetchData(
        isNew ? GLOBALURI : `${GLOBALURI}/${id}`,
        isNew ? "POST" : "PUT",
        GetEncrypt(JSON.stringify(payload)),
        false,
        token,
        router,
        ""
      );
      toast.success("Area saved");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setConfirmDelete(false);
    await FetchData(`${GLOBALURI}/${id}`, "DELETE", "", false, token, router, "");
    toast.success("Area deleted");
    router.back();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title={isNew ? "Add Area" : "Edit Area"}
        subtitle={isNew ? undefined : String(form?.name ?? "")}
      />

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-1">
        {fetchLoading ? (
          <div className="space-y-3 pt-2">
            <div className="h-11 animate-shimmer rounded-lg bg-gray-200" />
            <div className="h-11 animate-shimmer rounded-lg bg-gray-200" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="mb-1 block text-[12px] font-medium text-gray-500">
                  Sort No
                </label>
                <input
                  type="number"
                  value={form?.sort ?? ""}
                  onChange={(e) => setField("sort", Number(e.target.value) || 0)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none focus:border-[rgb(132,90,223)]"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-[12px] font-medium text-gray-500">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  value={form?.code ?? ""}
                  onChange={(e) => setField("code", e.target.value)}
                  placeholder="e.g. POOL-01"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-[12px] font-medium text-gray-500">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form?.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Grand Main Pool"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
              />
            </div>
            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] font-medium text-gray-500">
                Area Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {areaTypeOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setField("area_type", o.value)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      (form?.area_type ?? "") === o.value
                        ? "border-transparent bg-[rgb(132,90,223)] text-white"
                        : "border-gray-200 bg-white text-gray-600 active:bg-gray-50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-gray-500">
                  Capacity (pax)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form?.capacity ?? 0}
                  onChange={(e) => setField("capacity", Number(e.target.value) || 0)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none focus:border-[rgb(132,90,223)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-gray-500">
                  Depth (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form?.depth_meter ?? ""}
                  onChange={(e) => setField("depth_meter", e.target.value)}
                  placeholder="e.g. 1.20"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-[12px] font-medium text-gray-500">
                Location Note
              </label>
              <textarea
                rows={2}
                value={form?.location_note ?? ""}
                onChange={(e) => setField("location_note", e.target.value)}
                placeholder="Optional"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
              />
            </div>
            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] font-medium text-gray-500">
                Operational Status
              </label>
              <div className="flex gap-1.5">
                {currentStatuses.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setField("current_status", o.value)}
                    className={`h-10 flex-1 rounded-xl text-[13px] font-semibold ${
                      Number(form?.current_status) === o.value
                        ? o.tone + " border border-current"
                        : "bg-white text-gray-500 border border-gray-200"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-md border border-gray-200 bg-white p-4">
              <span className="text-[14px] text-gray-800">Active</span>
              <input
                type="checkbox"
                checked={!!form?.status}
                onChange={(e) => setField("status", e.target.checked)}
                className="h-5 w-5"
              />
            </div>
          </>
        )}
      </div>

      {!isNew && canDelete && (
        <div className="border-t border-gray-200 bg-white px-4 pb-2 pt-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="h-10 w-full rounded-md bg-red-50 text-[14px] font-semibold text-red-600 active:bg-red-100"
          >
            Delete this area
          </button>
        </div>
      )}

      <MobileActionBar radius="md" loadingLabel="Saving..."
        secondaryLabel="Cancel"
        onSecondary={() => router.back()}
        primaryLabel="Save"
        onPrimary={onSave}
        loading={loading}
        disabled={fetchLoading}
      />

      <MobileSheet
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete area?"
        footer={
          <MobileActionBar radius="md" loadingLabel="Saving..."
            secondaryLabel="Cancel"
            onSecondary={() => setConfirmDelete(false)}
            primaryLabel="Delete"
            tone="danger"
            onPrimary={onDelete}
          />
        }
      >
        <p className="text-[14px] leading-relaxed text-gray-600">
          <span className="font-semibold">{String(form?.name ?? "")}</span> will
          be deleted (soft delete). Existing attendance & usage records will be lost.
        </p>
      </MobileSheet>
    </div>
  );
};

AreaFormPage.getLayout = mobileLayout as any;

export default AreaFormPage;
