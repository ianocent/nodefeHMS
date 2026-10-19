"use client";

/**
 * M9 — Pool Setup form (menuId 1203), items + pivot per area (repeater).
 * GET /create (res.master.pool_areas) · GET /:id (row + pool_areas_detail)
 * POST/PUT /cms/pool/setups[/:id] — payload: code, item_name, category,
 * used_by, is_required, mandatory_check, description, sort, status,
 * pool_areas_detail: [{ pool_area_id, qty, is_required }]
 */
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { toast } from "react-toastify";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import MobileSheet from "../../../../components/mobile/form/MobileSheet";
import { IconClose } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/pool/setups";

const usedByOptions = [
  { value: "attendant", label: "Attendant" },
  { value: "supervisor", label: "Supervisor" },
  { value: "both", label: "Both" },
];
const categoryOptions = [
  { value: "equipment", label: "Equipment" },
  { value: "safety", label: "Safety" },
  { value: "hygiene", label: "Hygiene" },
  { value: "linen", label: "Linen" },
];

interface AreaRow {
  pool_area_id: string;
  qty: number;
  is_required: boolean;
}

const SetupFormPage = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canDelete } = useFormPermission(1203);
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
    is_required: true,
    mandatory_check: false,
    used_by: "both",
    sort: 0,
  });
  const [areaOptions, setAreaOptions] = useState<{ value: string; label: string }[]>([]);
  const [details, setDetails] = useState<AreaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let dead = false;
    (async () => {
      setFetchLoading(true);
      try {
        const res: any = await FetchData(
          isNew ? `${GLOBALURI}/create` : `${GLOBALURI}/${id}`,
          "GET",
          "",
          false,
          token,
          router,
          ""
        );
        if (dead) return;
        if (isNew) {
          setAreaOptions(
            (res?.master?.pool_areas ?? []).map((o: any) => ({
              value: String(o.value),
              label: o.label,
            }))
          );
        } else if (res?.data) {
          const d = res.data;
          setForm(d);
          setDetails(
            (d.pool_areas_detail ?? []).map((r: any) => ({
              pool_area_id: String(r.pool_area_id),
              qty: Number(r.qty) || 1,
              is_required: !!r.is_required,
            }))
          );
        }
        // edit mode butuh opsi area juga (master via /create tetap aman)
        if (!isNew) {
          const m: any = await FetchData(
            `${GLOBALURI}/create`,
            "GET",
            "",
            false,
            token,
            router,
            ""
          );
          if (!dead) {
            setAreaOptions(
              (m?.master?.pool_areas ?? []).map((o: any) => ({
                value: String(o.value),
                label: o.label,
              }))
            );
          }
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

  const setField = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const onSave = async () => {
    if (!form?.code?.toString().trim() || !form?.item_name?.toString().trim()) {
      toast.error("Code and Item Name are required.");
      return;
    }
    const payload = {
      code: form.code,
      item_name: form.item_name,
      category: form.category ?? null,
      used_by: form.used_by ?? "both",
      is_required: !!form.is_required,
      mandatory_check: !!form.mandatory_check,
      description: form.description ?? null,
      sort: Number(form.sort) || 0,
      status: !!form.status,
      pool_areas_detail: details.map((r) => ({
        pool_area_id: Number(r.pool_area_id),
        qty: Number(r.qty) || 1,
        is_required: !!r.is_required,
      })),
    };
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
      toast.success("Setup saved");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setConfirmDelete(false);
    await FetchData(`${GLOBALURI}/${id}`, "DELETE", "", false, token, router, "");
    toast.success("Setup deleted");
    router.back();
  };

  const updateRow = (idx: number, field: string, value: any) =>
    setDetails((prev) => prev.map((row, i) => (i !== idx ? row : { ...row, [field]: value })));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title={isNew ? "Add Setup" : "Edit Setup"}
        subtitle={isNew ? undefined : String(form?.item_name ?? "")}
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
            <h2 className="mb-2 mt-2 text-[13px] font-bold uppercase tracking-wide text-gray-500">
              Info
            </h2>
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
                  placeholder="e.g. NET-SAFETY"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-[12px] font-medium text-gray-500">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form?.item_name ?? ""}
                onChange={(e) => setField("item_name", e.target.value)}
                placeholder="e.g. Safety net ready check"
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
                    onClick={() => setField("category", o.value)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      (form?.category ?? "") === o.value
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
                    onClick={() => setField("used_by", o.value)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      (form?.used_by ?? "both") === o.value
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
                rows={2}
                value={form?.description ?? ""}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Optionsonal"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
              />
            </div>

            <h2 className="mb-2 mt-5 text-[13px] font-bold uppercase tracking-wide text-gray-500">
              Options
            </h2>
            <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4">
              {[
                { key: "is_required", label: "Required" },
                { key: "mandatory_check", label: "Mandatory during attendance" },
                { key: "status", label: "Active" },
              ].map((c) => (
                <label key={c.key} className="flex items-center justify-between">
                  <span className="text-[14px] text-gray-800">{c.label}</span>
                  <input
                    type="checkbox"
                    checked={!!form?.[c.key]}
                    onChange={(e) => setField(c.key, e.target.checked)}
                    className="h-5 w-5"
                  />
                </label>
              ))}
            </div>

            <h2 className="mb-2 mt-5 text-[13px] font-bold uppercase tracking-wide text-gray-500">
              Bind Area
            </h2>
            {details.map((row, idx) => (
              <div key={idx} className="mb-2 rounded-md border border-gray-200 bg-white p-3">
                <div className="flex items-start gap-2">
                  <select
                    value={row.pool_area_id ?? ""}
                    onChange={(e) => updateRow(idx, "pool_area_id", e.target.value)}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-[14px] outline-none focus:border-[rgb(132,90,223)]"
                  >
                    <option value="">Select area</option>
                    {areaOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    aria-label="Remove row"
                    onClick={() => setDetails((prev) => prev.filter((_, i) => i !== idx))}
                    className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-red-50 text-red-600 active:bg-red-100"
                  >
                    <IconClose width={16} height={16} />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[12px] text-gray-500">Qty</span>
                  <div className="flex h-10 items-center rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => updateRow(idx, "qty", Math.max(1, Number(row.qty) - 1))}
                      className="h-full px-3 text-gray-600 active:bg-gray-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={row.qty}
                      onChange={(e) => updateRow(idx, "qty", Number(e.target.value) || 1)}
                      className="w-12 border-0 text-center text-[14px] outline-none [appearance:textfield]"
                    />
                    <button
                      type="button"
                      onClick={() => updateRow(idx, "qty", Number(row.qty) + 1)}
                      className="h-full px-3 text-gray-600 active:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <label className="ml-auto flex items-center gap-1.5 text-[13px] text-gray-600">
                    <input
                      type="checkbox"
                      checked={!!row.is_required}
                      onChange={(e) => updateRow(idx, "is_required", e.target.checked)}
                    />
                    Required
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setDetails((prev) => [
                  ...prev,
                  { pool_area_id: "", qty: 1, is_required: true },
                ])
              }
              className="mt-2 flex h-11 w-full items-center justify-center rounded-md border border-dashed border-[rgb(132,90,223)] text-[14px] font-semibold text-[rgb(132,90,223)] active:bg-[rgb(132,90,223)] active:bg-opacity-5"
            >
              + Bind Area
            </button>
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
            Delete this setup
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
        title="Delete setup?"
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
          <span className="font-semibold">{String(form?.item_name ?? "")}</span> will
          be deleted (soft delete). Area binding will be removed.
        </p>
      </MobileSheet>
    </div>
  );
};

SetupFormPage.getLayout = mobileLayout as any;

export default SetupFormPage;
