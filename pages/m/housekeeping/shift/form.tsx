"use client";

/**
 * M2 — Shift form (create/edit), full-screen satu kolom.
 * Replikasi payload desktop shift-roster/form/index.tsx OnSave:
 *   POST/PUT /cms/housekeeping/shift-roster(/{id})
 *   body = { ...row, time_start: ranges[0].start, time_end: ranges[0].end, time_ranges }
 * Validasi client = salinan 1:1 dari backend generic.controller.ts:100-137
 * (backend tetap penjaga — defense in depth; R4).
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import MobileHeader from "../../../../components/mobile/shell/MobileHeader";
import MobileActionBar from "../../../../components/mobile/form/MobileActionBar";
import { MobileChip } from "../../../../components/mobile/list/MobileCard";
import { IconClose, IconPlus } from "../../../../components/mobile/shell/icons";
import mobileLayout from "../../_layout";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/housekeeping/shift-roster";
type TimeRange = { start: string; end: string };

/* ── Salinan exact validateShiftRosterRanges (generic.controller.ts:100-137) ── */
const validateRangesClient = (body: {
  time_start?: string;
  time_end?: string;
  time_ranges?: TimeRange[];
}): string | null => {
  let ranges: { start: any; end: any }[] =
    Array.isArray(body.time_ranges) && body.time_ranges.length > 0
      ? body.time_ranges.map((r) => ({ start: r.start, end: r.end }))
      : [{ start: body.time_start, end: body.time_end }];
  if (!ranges.length) ranges = [{ start: body.time_start, end: body.time_end }];
  ranges[0] = { start: body.time_start, end: body.time_end };
  if (ranges.length > 3) return "Maksimal 3 time range per shift.";

  const toMin = (t: any): number | null => {
    const s = String(t ?? "");
    if (!/^\d{1,2}:\d{2}$/.test(s)) return null;
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };

  let totalHours = 0;
  for (let i = 0; i < ranges.length; i++) {
    const sm = toMin(ranges[i].start);
    const em = toMin(ranges[i].end);
    if (sm === null || em === null) return "Format jam harus H:i.";
    let durMinutes = em - sm;
    if (durMinutes <= 0) durMinutes += 24 * 60; // overnight shift
    const durHours = durMinutes / 60;
    if (durHours > 8) return `Range ${i + 1} tidak boleh lebih dari 8 jam.`;
    totalHours += durHours;
  }
  if (totalHours > 16) return "Total jam kerja tidak boleh lebih dari 16 jam.";
  return null;
};

const totalHoursLabel = (ranges: TimeRange[]): string => {
  const toMin = (t?: string): number | null => {
    const s = String(t ?? "");
    if (!/^\d{1,2}:\d{2}$/.test(s)) return null;
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };
  let total = 0;
  for (const r of ranges) {
    const sm = toMin(r.start);
    const em = toMin(r.end);
    if (sm === null || em === null) continue;
    let dur = em - sm;
    if (dur <= 0) dur += 24 * 60;
    total += dur;
  }
  return `${(total / 60).toFixed(total % 60 === 0 ? 0 : 1)} jam`;
};

const ShiftFormPage = () => {
  const router = useRouter();
  const { canCreate, canUpdate } = useFormPermission(158);
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = useMemo(() => {
    try {
      return isLogin
        ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? ""
        : "";
    } catch {
      return "";
    }
  }, [isLogin]);

  const id = (router.query.data as string) ?? "0";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { start: "", end: "" },
  ]);
  const [row, setRow] = useState<any>(null); // field lain dari payload existing
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  /* Load: id>0 → GET /{id}/update (sama seperti desktop GetDetailUser) */
  useEffect(() => {
    if (id === "0" || id === "") return;
    let dead = false;
    (async () => {
      setFetchLoading(true);
      try {
        const res = await FetchData(
          `${GLOBALURI}/${id}/update`,
          "GET",
          "",
          false,
          token,
          router,
          ""
        );
        if (dead) return;
        const data = res?.data ?? {};
        setRow(data);
        setName(data?.name ?? "");
        setDescription(data?.description ?? "");
        if (Array.isArray(data?.time_ranges) && data.time_ranges.length > 0) {
          setTimeRanges(data.time_ranges.map((r: any) => ({ start: r.start, end: r.end })));
        } else {
          setTimeRanges([{ start: data?.time_start ?? "", end: data?.time_end ?? "" }]);
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

  const validationError = useMemo(() => {
    if (!touched) return null;
    if (!name?.trim()) return "Nama shift wajib diisi.";
    const base = {
      time_start: timeRanges[0]?.start,
      time_end: timeRanges[0]?.end,
      time_ranges: timeRanges,
    };
    // Name & format Jam check like backend (backend checks format inside loop)
    return validateRangesClient(base);
  }, [touched, name, timeRanges]);

  const canSubmit =
    !!name?.trim() &&
    validateRangesClient({
      time_start: timeRanges[0]?.start,
      time_end: timeRanges[0]?.end,
      time_ranges: timeRanges,
    }) === null;

  const onSave = useCallback(async () => {
    if (!canSubmit) {
      setTouched(true);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...(row ?? {}),
        name: name.trim(),
        description: description ?? "",
        time_start: timeRanges[0]?.start ?? "",
        time_end: timeRanges[0]?.end ?? "",
        time_ranges: timeRanges,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, row, name, description, timeRanges, id, token]);

  const updateRange = (idx: number, key: "start" | "end", value: string) => {
    const next = [...timeRanges];
    next[idx] = { ...next[idx], [key]: value };
    setTimeRanges(next);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title={id !== "0" && id !== "" ? "Edit Shift" : "Tambah Shift"}
        right={
          <MobileChip tone="primary">{totalHoursLabel(timeRanges)}</MobileChip>
        }
      />

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4">
        {fetchLoading ? (
          <div className="space-y-3 pt-2">
            <div className="h-11 animate-shimmer rounded-lg bg-gray-200" />
            <div className="h-20 animate-shimmer rounded-lg bg-gray-200" />
            <div className="h-14 animate-shimmer rounded-lg bg-gray-200" />
          </div>
        ) : (
          <>
            {/* Name */}
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Nama Shift
            </label>
            <input
              value={name}
              onChange={(e) => {
                setTouched(true);
                setName(e.target.value);
              }}
              placeholder="cth. Shift Pagi"
              className="mb-4 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
            />

            {/* Description */}
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Deskripsi
            </label>
            <textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Keterangan singkat (opsional)"
              className="mb-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-gray-400 focus:border-[rgb(132,90,223)]"
            />

            {/* Time ranges */}
            <div className="mb-2 mt-5 flex items-center justify-between">
              <label className="text-[13px] font-semibold text-gray-700">
                Jam Kerja & Overtime
              </label>
              <span className="text-[11px] text-gray-400">
                maks 8 jam/range · total maka 16 jam
              </span>
            </div>

            <div className="space-y-3">
              {timeRanges.map((range, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 ${
                    idx === 0 ? "border-gray-200 bg-white" : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <MobileChip tone={idx === 0 ? "primary" : "amber"}>
                      {idx === 0 ? "Jam Kerja" : `Overtime ${idx}`}
                    </MobileChip>
                    {idx > 0 && (
                      <button
                        type="button"
                        aria-label="Hapus range"
                        onClick={() =>
                          setTimeRanges(timeRanges.filter((_, i) => i !== idx))
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 active:bg-red-100"
                      >
                        <IconClose width={16} height={16} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={range.start}
                      onChange={(e) => {
                        setTouched(true);
                        updateRange(idx, "start", e.target.value);
                      }}
                      className="h-11 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-center text-[15px] outline-none focus:border-[rgb(132,90,223)]"
                    />
                    <span className="text-gray-400">–</span>
                    <input
                      type="time"
                      value={range.end}
                      onChange={(e) => {
                        setTouched(true);
                        updateRange(idx, "end", e.target.value);
                      }}
                      className="h-11 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-center text-[15px] outline-none focus:border-[rgb(132,90,223)]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {timeRanges.length < 3 && (
              <button
                type="button"
                onClick={() => setTimeRanges([...timeRanges, { start: "", end: "" }])}
                className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[rgb(132,90,223)] text-[14px] font-semibold text-[rgb(132,90,223)] active:bg-[rgb(132,90,223)] active:bg-opacity-5"
              >
                <IconPlus width={18} height={18} />
                Tambah Overtime
              </button>
            )}

            {/* validation feedback (R4) */}
            {validationError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
                {validationError}
              </p>
            )}
          </>
        )}
      </div>

      {(id === "0" || id === "" ? canCreate : canUpdate) ? (
        <MobileActionBar
          secondaryLabel="Batal"
          onSecondary={() => router.back()}
          primaryLabel="Simpan"
          onPrimary={onSave}
          loading={loading}
          disabled={fetchLoading}
        />
      ) : (
        <MobileActionBar secondaryLabel="Kembali" onSecondary={() => router.back()} />
      )}
    </div>
  );
};

ShiftFormPage.getLayout = mobileLayout as any;

export default ShiftFormPage;
