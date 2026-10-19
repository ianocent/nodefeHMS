"use client";

/**
 * M9 — Pool Usage (menuId 1205) — pilar B, pemakaian tamu + charge folio.
 * GET  /cms/pool/usages?date         (meta.summary total/draft/posted/void/amount)
 * GET  /cms/pool/usages/guest-search?q=&date=
 * GET  /cms/pool/usages/code-items   (handuk/locker dst)
 * POST /cms/pool/usages              (draft; items[])
 * GET  /cms/pool/usages/:id
 * POST /cms/pool/usages/:id/post     (charge folio — hanya draft, folio wajib)
 * POST /cms/pool/usages/:id/void     (perm void_pool_usage)
 */
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { toast } from "react-toastify";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileSheet from "../../../../components/mobile/form/MobileSheet";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import { MobileCard, MobileChip } from "../../../../components/mobile/list/MobileCard";
import { MobileEmptyState, MobileSkeleton } from "../../../../components/mobile/list/MobileEmptyState";
import mobileLayout from "../../_layout";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/pool/usages";

const fmtMoney = (n: any) =>
  (Number(n) || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

const statusOf = (s: number): { label: string; tone: "green" | "amber" | "red" | "gray" } =>
  s === 1 || s === 2
    ? { label: "Posted", tone: "green" }
    : s === 3
    ? { label: "Void", tone: "red" }
    : s === 0
    ? { label: "Draft", tone: "amber" }
    : { label: "-", tone: "gray" };

interface ItemRow {
  code_item_id: string;
  item_name: string;
  qty: number;
  unit_price: number;
}

const UsagePage = () => {
  const router = useRouter();
  const { canCreate, canUpdate, canView } = useFormPermission(1205);
  const canVoid = useTransactionPermission("void_pool_usage");
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

  const [date, setDate] = useState(bizDate || new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);

  /* create/edit sheet */
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [folioId, setFolioId] = useState<string>("");
  const [folioLabel, setFolioLabel] = useState<string>("");
  const [walkInName, setWalkInName] = useState<string>("");
  const [walkInCard, setWalkInCard] = useState<string>("");
  const [swimmers, setSwimmers] = useState(1);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [codeItems, setCodeItems] = useState<any[]>([]);
  const [guestQuery, setGuestQuery] = useState("");
  const [guestResults, setGuestResults] = useState<any[]>([]);
  const [guestOpen, setGuestOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  /* void */
  const [voidRow, setVoidRow] = useState<any>(null);
  const [voidReason, setVoidReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await FetchData(
        `${GLOBALURI}?date=${date}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const ok = res?.code === 200 || res?.code == "200";
      setRows(ok ? res?.data ?? [] : []);
      setSummary(ok ? res?.meta?.summary ?? {} : {});
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, token]);

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCodeItems = async () => {
    if (codeItems.length) return;
    const res: any = await FetchData(
      `${GLOBALURI}/code-items`,
      "GET",
      "",
      false,
      token,
      router,
      ""
    );
    if (res?.code === 200 || res?.code == "200") setCodeItems(res?.data ?? []);
  };

  const searchGuests = async () => {
    if (!guestQuery.trim()) return;
    setGuestOpen(true);
    const res: any = await FetchData(
      `${GLOBALURI}/guest-search?q=${encodeURIComponent(guestQuery)}&date=${date}`,
      "GET",
      "",
      false,
      token,
      router,
      ""
    );
    setGuestResults(res?.code === 200 || res?.code == "200" ? res?.data ?? [] : []);
  };

  const resetForm = () => {
    setEditId(null);
    setFolioId("");
    setFolioLabel("");
    setWalkInName("");
    setWalkInCard("");
    setSwimmers(1);
    setItems([]);
    setGuestQuery("");
    setNotes("");
  };

  const openCreate = async () => {
    resetForm();
    setFormOpen(true);
    await loadCodeItems();
  };

  const openEdit = async (row: any) => {
    if (Number(row?.posting_status) === 3 || [1, 2].includes(Number(row?.posting_status))) {
      // dilihat saja (read-only) untuk posted/void
      return;
    }
    resetForm();
    try {
      const res: any = await FetchData(
        `${GLOBALURI}/${row?.id}`,
        "GET",
        "",
        false,
        token,
        router,
        ""
      );
      const d = res?.data;
      if (d) {
        setEditId(String(d?.id));
        setFolioId(d?.folio_id != null ? String(d.folio_id) : "");
        setFolioLabel(d?.folio_number ?? "");
        setWalkInName(d?.guest_name ?? "");
        setWalkInCard(d?.guest_id_card ?? "");
        setSwimmers(Number(d?.swimmer_qty) || 1);
        setItems(
          (d?.items ?? [])
            .filter((it: any) => it?.transaction_id == null)
            .map((it: any) => ({
              code_item_id: it?.code_item_id != null ? String(it.code_item_id) : "",
              item_name: it?.item_name ?? "",
              qty: Number(it?.qty) || 1,
              unit_price: Number(it?.unit_price) || 0,
            }))
        );
        setNotes(d?.notes ?? "");
        await loadCodeItems();
        setFormOpen(true);
      }
    } catch {}
  };

  const addItem = (ci: any) => {
    setItems((prev) => [
      ...prev,
      {
        code_item_id: String(ci?.value),
        item_name: ci?.item_name ?? ci?.label ?? "",
        qty: 1,
        unit_price: Number(ci?.unit_price) || 0,
      },
    ]);
  };

  const updateItem = (idx: number, field: string, value: any) =>
    setItems((prev) =>
      prev.map((it, i) => (i !== idx ? it : { ...it, [field]: value }))
    );

  const totalAmount = items.reduce(
    (s, it) => s + (Number(it.qty) || 0) * (Number(it.unit_price) || 0),
    0
  );

  const saveDraft = async () => {
    if (items.length === 0) {
      toast.error("Add at least 1 item (towel/locker).");
      return;
    }
    if (!folioId && !walkInName.trim()) {
      toast.error("Select an in-house guest folio OR enter a walk-in name.");
      return;
    }
    setSaving(true);
    const payload: any = {
      usage_date: date,
      items,
      swimmer_qty: swimmers,
      notes: notes || null,
      guest_id_card: walkInCard || null,
      pool_area_id: null,
    };
    if (folioId) payload.folio_id = Number(folioId);
    else payload.guest_name = walkInName;
    try {
      const res: any = await FetchData(
        editId ? `${GLOBALURI}/${editId}` : GLOBALURI,
        editId ? "PUT" : "POST",
        GetEncrypt(JSON.stringify(payload)),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        toast.success("Draft saved");
        setFormOpen(false);
        load();
      } else {
        toast.error(res?.message ?? "Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const postToFolio = async (row: any) => {
    setSaving(true);
    try {
      const res: any = await FetchData(
        `${GLOBALURI}/${row?.id}/post`,
        "POST",
        GetEncrypt(JSON.stringify({})),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        toast.success("Posted to guest folio");
        load();
      } else {
        toast.error(res?.message ?? "Posting failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const saveVoid = async () => {
    if (!voidRow) return;
    if (!voidReason.trim()) {
      toast.error("Void reason is required.");
      return;
    }
    setSaving(true);
    try {
      const res: any = await FetchData(
        `${GLOBALURI}/${voidRow?.id}/void`,
        "POST",
        GetEncrypt(JSON.stringify({ reason: voidReason })),
        false,
        token,
        router,
        ""
      );
      if (res?.code === 200 || res?.code == "200") {
        toast.success("Usage voided");
        setVoidRow(null);
        setVoidReason("");
        load();
      } else {
        toast.error(res?.message ?? "Void failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title="Guest Usage"
        subtitle={date}
        right={
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 rounded-full border border-gray-200 bg-white px-3 text-[12px] outline-none"
          />
        }
      />

      {!canView ? (
        <div className="flex flex-1 items-center justify-center px-8">
          <p className="text-center text-sm text-gray-500">
            You don't have access to view the Pool Usage module.
          </p>
        </div>
      ) : (
        <>
          <div className="border-b border-gray-200 bg-white px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-[13px] font-bold text-gray-900">
                Rp <span className="text-[rgb(132,90,223)]">{fmtMoney(summary?.amount)}</span>
              </span>
              <span className="text-[12px] text-amber-700">Draft {summary?.draft ?? 0}</span>
              <span className="text-[12px] text-green-700">Posted {summary?.posted ?? 0}</span>
              <span className="text-[12px] text-red-600">Void {summary?.void ?? 0}</span>
            </div>
            {(canCreate || canUpdate) && (
              <p className="mt-0.5 text-[11px] text-gray-400">
                Draft → select in-house folio → post; walk-in needs only a name.
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-4">
            {loading ? (
              <MobileSkeleton count={4} />
            ) : rows.length === 0 ? (
              <MobileEmptyState
                title="No usage yet"
                description={date}
                action={
                  canCreate ? (
                    <button
                      type="button"
                      onClick={openCreate}
                      className="rounded-md bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
                    >
                      + Create Usage
                    </button>
                  ) : undefined
                }
              />
            ) : (
              rows.map((row) => {
                const st = statusOf(Number(row?.posting_status));
                const isDraft = Number(row?.posting_status) === 0;
                return (
                  <MobileCard key={row?.id} onClick={() => isDraft && canUpdate && openEdit(row)}>
                    <div className="flex flex-1 flex-col gap-1.5 py-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[15px] font-semibold text-gray-900">
                          {row?.guest_name || row?.folio_number || "Walk-in"}
                        </span>
                        <MobileChip tone={st.tone}>{st.label}</MobileChip>
                      </div>
                      <p className="text-[12px] text-gray-400">
                        {row?.folio_number ? `${row.folio_number} · ` : ""}
                        {row?.swimmer_qty ?? 1} swimmers · {row?.qty_total ?? 0} items
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-gray-800">
                          Rp {fmtMoney(row?.amount_total)}
                        </span>
                        <div className="flex gap-2">
                          {isDraft && canUpdate && row?.folio_id && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                postToFolio(row);
                              }}
                              className="h-8 rounded-md bg-[rgb(132,90,223)] px-3 text-[12px] font-semibold text-white active:opacity-80"
                            >
                              Post Folio
                            </button>
                          )}
                          {Number(row?.posting_status) !== 3 && canVoid && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVoidReason("");
                                setVoidRow(row);
                              }}
                              className="h-8 rounded-md bg-red-50 px-3 text-[12px] font-semibold text-red-600 active:bg-red-100"
                            >
                              Void
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </MobileCard>
                );
              })
            )}
          </div>

          {canCreate && (
            <button
              type="button"
              aria-label="Create usage"
              onClick={openCreate}
              className="absolute bottom-20 right-4 z-[600] flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(132,90,223)] text-white shadow-lg active:opacity-85"
            >
              <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}
        </>
      )}

      {/* ── form sheet ── */}
      <MobileSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Edit Usage Draft" : "Create Usage"}
        height="92%"
        footer={
          <MobileActionBar radius="md" loadingLabel="Saving..."
            secondaryLabel="Cancel"
            onSecondary={() => setFormOpen(false)}
            primaryLabel={`Save Draft${totalAmount ? ` · Rp ${fmtMoney(totalAmount)}` : ""}`}
            onPrimary={saveDraft}
            loading={saving}
          />
        }
      >
        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          Guest (in-house folio)
        </label>
        <div className="mb-2 flex gap-2">
          <input
            value={folioId ? folioLabel : guestQuery}
            onChange={(e) => {
              setGuestQuery(e.target.value);
              setFolioId("");
              setFolioLabel("");
            }}
            placeholder="Search name / folio..."
            className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
          />
          <button
            type="button"
            onClick={searchGuests}
            className="h-11 flex-none rounded-md bg-gray-900 px-4 text-[13px] font-semibold text-white active:opacity-85"
          >
            Cari
          </button>
        </div>
        {folioId && (
          <MobileChip tone="green">Folio: {folioLabel}</MobileChip>
        )}
        {!folioId && (
          <>
            <label className="mb-1 mt-3 block text-[13px] font-semibold text-gray-700">
              Or walk-in
            </label>
            <input
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              placeholder="Guest name"
              className="mb-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
            />
            <input
              value={walkInCard}
              onChange={(e) => setWalkInCard(e.target.value)}
              placeholder="ID card no (optional)"
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
            />
          </>
        )}

        <label className="mb-1 mt-4 block text-[12px] font-medium text-gray-500">
          Number of swimmers
        </label>
        <div className="flex h-10 w-fit items-center rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setSwimmers(Math.max(1, swimmers - 1))}
            className="h-full px-3 text-gray-600 active:bg-gray-50"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={swimmers}
            onChange={(e) => setSwimmers(Number(e.target.value) || 1)}
            className="w-12 border-0 text-center text-[14px] outline-none [appearance:textfield]"
          />
          <button
            type="button"
            onClick={() => setSwimmers(swimmers + 1)}
            className="h-full px-3 text-gray-600 active:bg-gray-50"
          >
            +
          </button>
        </div>

        <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-gray-700">
          Items ({items.length}) — towels · lockers · etc
        </label>
        <div className="flex flex-wrap gap-1.5">
          {codeItems.map((ci) => (
            <button
              key={ci?.value}
              type="button"
              onClick={() => addItem(ci)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-600 active:bg-gray-50"
            >
              + {ci?.label}
            </button>
          ))}
          {codeItems.length === 0 && (
            <p className="text-[12px] text-gray-400">
              Loading items (Pool code_items seed)...
            </p>
          )}
        </div>
        <div className="mt-2 space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-md border border-gray-200 bg-white p-3">
              <p className="text-[14px] font-semibold text-gray-800">{it.item_name}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 items-center rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => updateItem(idx, "qty", Math.max(1, it.qty - 1))}
                    className="h-full px-3 text-gray-600 active:bg-gray-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => updateItem(idx, "qty", Number(e.target.value) || 1)}
                    className="w-12 border-0 text-center text-[14px] outline-none [appearance:textfield]"
                  />
                  <button
                    type="button"
                    onClick={() => updateItem(idx, "qty", it.qty + 1)}
                    className="h-full px-3 text-gray-600 active:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-[12px] text-gray-500">×</span>
                <input
                  type="number"
                  min={0}
                  value={it.unit_price}
                  onChange={(e) => updateItem(idx, "unit_price", Number(e.target.value) || 0)}
                  className="h-10 w-28 rounded-lg border border-gray-200 px-2 text-right text-[14px] outline-none focus:border-[rgb(132,90,223)]"
                />
                <span className="ml-auto text-[13px] font-bold text-gray-800">
                  Rp {fmtMoney(it.qty * it.unit_price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <label className="mb-1 mt-4 block text-[12px] font-medium text-gray-500">
          Notes
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
        />
      </MobileSheet>

      {/* ── guest results sheet ── */}
      <MobileSheet open={guestOpen} onClose={() => setGuestOpen(false)} title="Select Folio">
        <div className="space-y-1.5">
          {guestResults.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              No in-house folio found
            </p>
          )}
          {guestResults.map((g) => (
            <button
              key={g?.value}
              type="button"
              onClick={() => {
                setFolioId(String(g?.value));
                setFolioLabel(g?.label ?? "");
                setGuestOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 text-left active:bg-gray-50"
            >
              <span className="text-[14px] font-semibold text-gray-800">{g?.label}</span>
              <span className="text-[12px] text-gray-400">{g?.guest_name}</span>
            </button>
          ))}
        </div>
      </MobileSheet>

      {/* ── void sheet ── */}
      <MobileSheet
        open={!!voidRow}
        onClose={() => setVoidRow(null)}
        title="Void usage?"
        footer={
          <MobileActionBar radius="md" loadingLabel="Saving..."
            secondaryLabel="Cancel"
            onSecondary={() => setVoidRow(null)}
            primaryLabel="Void"
            tone="danger"
            onPrimary={saveVoid}
            loading={saving}
          />
        }
      >
        <p className="text-[14px] text-gray-700">
          <span className="font-semibold">
            {voidRow?.guest_name || voidRow?.folio_number || `#${voidRow?.id}`}
          </span>{" "}
          Rp {fmtMoney(voidRow?.amount_total)}
        </p>
        {(() => {
          const st = Number(voidRow?.posting_status);
          return st === 1 || st === 2 ? (
            <p className="mt-1 text-[12px] text-red-700">
              ⚠️ Already posted: related folio transactions will be deactivated.
            </p>
          ) : null;
        })()}
        <input
          value={voidReason}
          onChange={(e) => setVoidReason(e.target.value)}
          placeholder="Void reason (required)"
          className="mt-3 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-red-400"
        />
      </MobileSheet>
    </div>
  );
};

UsagePage.getLayout = mobileLayout as any;

export default UsagePage;
