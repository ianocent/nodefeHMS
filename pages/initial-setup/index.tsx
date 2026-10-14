import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Seo from "../../components/common/seo";
import { FetchData, GetDecrypt, GetEncrypt } from "../../components/helper";

const GLOBALURI = "/cms/initial-setup";

/* ------------------------------------------------------------------ */
/* Design tokens - one accent, 8px rhythm, semantic surfaces            */
/* ------------------------------------------------------------------ */
const T = {
  accent: "#845ADF",
  accentSoft: "#F5F0FF",
  accentRing: "rgba(132,90,223,0.35)",
  card: "bg-white",
  line: "border-gray-200",
  ink: "text-gray-900",
  ink2: "text-gray-600",
  ink3: "text-gray-400",
} as const;

const inputBase =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-shadow duration-150 " +
  "placeholder:text-gray-400 focus:outline-none focus:border-[#845ADF] focus:ring-4 focus:ring-[rgba(132,90,223,0.18)] " +
  "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(132,90,223,0.35)] focus-visible:ring-offset-1 " +
  "disabled:cursor-not-allowed disabled:opacity-45";

const btnPrimary = `${btnBase} bg-[#845ADF] text-white hover:bg-[#6a46c9] active:scale-[0.985]`;
const btnSecondary = `${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.985]`;
const btnGhost = `${btnBase} px-3 text-gray-600 hover:bg-gray-100`;
const btnDanger = `${btnBase} bg-red-600 text-white hover:bg-red-700 active:scale-[0.985]`;

const fieldLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500";

const card = `${T.card} ${T.line} rounded-xl`;
const sectionTitle = "text-sm font-semibold text-gray-900";

interface StepRow {
  step: string;
  label: string;
  done: number;
  total: number;
  is_complete: boolean;
}

interface TagRow {
  id: number;
  name: string;
  description?: string;
  sort?: number;
  status?: number;
}

const TAG_GROUPS: { value: string; label: string }[] = [
  { value: "building", label: "Building" },
  { value: "floor", label: "Floor" },
  { value: "area", label: "Area / Zone" },
  { value: "room-configuration", label: "Room Configurator" },
  { value: "room-type-grouping", label: "Room Type Grouping" },
  { value: "template-floor-plan", label: "Template Floor Plan" },
  { value: "in-room-equipment", label: "In-Room Equipment" },
  { value: "work-type", label: "Work Type" },
  { value: "guest-title", label: "Guest Title" },
  { value: "guest-status", label: "Guest Status" },
  { value: "market-segment-1", label: "Market Segment 1" },
  { value: "market-segment-2", label: "Market Segment 2" },
  { value: "market-segment-3", label: "Market Segment 3" },
  { value: "market-segment-4", label: "Market Segment 4" },
  { value: "source", label: "Source" },
  { value: "company-type", label: "Company Type" },
  { value: "cancellation-reservation", label: "Cancellation Reason" },
  { value: "remark-room", label: "Room Remark" },
  { value: "remark-additional-item", label: "Additional Item Remark" },
  { value: "location", label: "Location" },
  { value: "unit-of-measurement", label: "Unit of Measurement" },
];

const CLONE_STEPS: { value: string; label: string }[] = [
  { value: "building", label: "Building" },
  { value: "floor", label: "Floor" },
  { value: "room_configuration", label: "Room Configurator" },
  { value: "room_type_grouping", label: "Room Type Grouping" },
  { value: "guest_title", label: "Guest Title" },
  { value: "guest_status", label: "Guest Status" },
  { value: "market_segment", label: "Market Segment 1-4" },
  { value: "source", label: "Source" },
  { value: "company_type", label: "Company Type" },
  { value: "code_billing", label: "Billing Code" },
  { value: "code_gl", label: "General Ledger" },
  { value: "code_post", label: "Post Code" },
  { value: "code_item", label: "Item Code" },
  { value: "payment_method", label: "Payment Code" },
  { value: "room_type", label: "Room Type" },
  { value: "room_type_from_grouping", label: "Room Type from Grouping" },
  { value: "role", label: "Role + Menu Access" },
  { value: "report_permission", label: "Report Permission" },
];

const WIZARD = [
  { title: "Property", desc: "Choose the property and see exactly what is still missing." },
  { title: "Clone Master", desc: "Copy master setup from a property that is already running." },
  { title: "Master Data", desc: "Edit buildings, floors, configurators, codes and payment methods." },
  { title: "Room Generator", desc: "Create room types and generate rooms in bulk." },
  { title: "Verify", desc: "Review the checklist and the change log." },
];

type Tone = "ok" | "err" | "info";
interface Banner {
  tone: Tone;
  text: string;
  detail?: string;
}

const BANNER_STYLE: Record<Tone, { wrap: string; icon: React.ReactNode; bar: string }> = {
  ok: {
    wrap: "bg-emerald-50 text-emerald-900 border-emerald-200",
    bar: "bg-emerald-500",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-emerald-600" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  err: {
    wrap: "bg-red-50 text-red-900 border-red-200",
    bar: "bg-red-500",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-8-4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    wrap: "bg-blue-50 text-blue-900 border-blue-200",
    bar: "bg-blue-500",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-blue-600" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-8 9a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 19zm0-11a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export default function InitialSetup() {
  const router = useRouter();
  const auth = useSelector((state: any) => state?.auth);
  const isLogin = auth?.isLogin;
  const token: string = isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";

  /* ---------------- wizard state ---------------- */
  const [step, setStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);

  const [propertyId, setPropertyId] = useState<string>("");
  const [properties, setProperties] = useState<{ id: number; name: string }[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [steps, setSteps] = useState<StepRow[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [busy, setBusy] = useState(false);

  // step 2 - clone
  const [fromProperty, setFromProperty] = useState<string>("999");
  const [cloneSteps, setCloneSteps] = useState<string[]>(CLONE_STEPS.map((s) => s.value));
  const [cloneResult, setCloneResult] = useState<any[]>([]);

  // step 3 - editor
  const [group, setGroup] = useState<string>("building");
  const [rows, setRows] = useState<TagRow[]>([]);
  const [dirty, setDirty] = useState(false);

  // step 4 - rooms
  const [roomTypes, setRoomTypes] = useState<{ id: number; name: string }[]>([]);
  const [roomTypeId, setRoomTypeId] = useState<string>("");
  const [newRoomType, setNewRoomType] = useState<string>("");
  const [newRoomRate, setNewRoomRate] = useState<string>("");
  const [rtError, setRtError] = useState<string>("");
  const [groupings, setGroupings] = useState<{ id: number; name: string }[]>([]);
  const [pickedGroupings, setPickedGroupings] = useState<string[]>([]);
  const [floors, setFloors] = useState<{ id: number; name: string }[]>([]);
  const [floorIds, setFloorIds] = useState<string[]>([]);
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  const [buildingId, setBuildingId] = useState<string>("");
  const [configs, setConfigs] = useState<{ id: number; name: string; group: string }[]>([]);
  const [configIds, setConfigIds] = useState<string[]>([]);
  const [prefix, setPrefix] = useState<string>("");
  const [startNo, setStartNo] = useState<number>(1);
  const [perFloor, setPerFloor] = useState<number>(10);
  const [maxPax, setMaxPax] = useState<number>(2);
  const [totalBed, setTotalBed] = useState<number>(1);
  const [confirmRooms, setConfirmRooms] = useState<null | { total: number }>(null);

  // step 5 - audit
  const [auditRows, setAuditRows] = useState<any[]>([]);

  const bannerTimer = useRef<any>(null);

  /* ---------------- banner ---------------- */
  const notify = useCallback((tone: Tone, text: string, detail?: string) => {
    setBanner({ tone, text, detail });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), tone === "err" ? 9000 : 5000);
  }, []);

  useEffect(() => () => bannerTimer.current && clearTimeout(bannerTimer.current), []);

  /* ---------------- api ---------------- */
  // isNotToast = true -> the page owns the feedback (FetchData's global toast
  // fires on every non-200 and would double up with the inline banner).
  const call = useCallback(
    async (uri: string, method: string, body?: any) => {
      const payload = body ? GetEncrypt(JSON.stringify(body)) : "";
      return FetchData(uri, method, payload, false, token, router, "", true);
    },
    [token, router],
  );

  const get = useCallback(
    (uri: string) => FetchData(uri, "GET", "", false, token, router, "", true),
    [token, router],
  );

  /* ---------------- loaders ---------------- */

  const loadProperties = useCallback(async () => {
    try {
      const res = await get(`${GLOBALURI}/properties`);
      if (res?.code === 200 && Array.isArray(res.data)) {
        setProperties(res.data.map((p: any) => ({ id: Number(p.id), name: p.name })));
        setPropertyId((prev) => prev || (res.data.length ? String(res.data[0].id) : ""));
      } else {
        notify("err", res?.message ?? "Could not load the property list");
      }
    } catch {
      notify("err", "Could not load the property list");
    }
  }, [get, notify]);

  const loadOverview = useCallback(async () => {
    if (!propertyId) return;
    setBusy(true);
    try {
      const [ov, cl] = await Promise.all([
        get(`${GLOBALURI}/overview?property_id=${propertyId}`),
        get(`${GLOBALURI}/checklist?property_id=${propertyId}`),
      ]);
      if (ov?.code === 200) setOverview(ov.data);
      else notify("err", ov?.message ?? "Could not load the overview");
      const raw = cl?.data;
      setSteps(Array.isArray(raw) ? raw : Array.isArray(raw?.steps) ? raw.steps : []);
    } catch (e: any) {
      notify("err", e?.message ?? "Could not load the overview");
    } finally {
      setBusy(false);
    }
  }, [propertyId, get, notify]);

  const loadTags = useCallback(async () => {
    if (!propertyId) return;
    setBusy(true);
    try {
      const res = await get(`${GLOBALURI}/tags?property_id=${propertyId}&group=${encodeURIComponent(group)}`);
      if (res?.code === 200 && Array.isArray(res.data)) {
        setRows(
          res.data.map((r: any) => ({
            id: Number(r.id),
            name: r.name,
            description: r.description ?? "",
            sort: r.sort ?? 0,
            status: r.status ?? 1,
          }))
        );
        setDirty(false);
      }
    } catch {
      setRows([]);
    } finally {
      setBusy(false);
    }
  }, [propertyId, group, get]);

  const loadRoomInputs = useCallback(async () => {
    if (!propertyId) return;
    setBusy(true);
    try {
      const [rtRes, flRes, bdRes, cfgRes, ircRes, grRes] = await Promise.all([
        get(`${GLOBALURI}/room-types?property_id=${propertyId}`),
        get(`${GLOBALURI}/tags?property_id=${propertyId}&group=floor`),
        get(`${GLOBALURI}/tags?property_id=${propertyId}&group=building`),
        get(`${GLOBALURI}/tags?property_id=${propertyId}&group=room-configuration`),
        get(`${GLOBALURI}/tags?property_id=${propertyId}&group=in-room-equipment`),
        get(`${GLOBALURI}/tags?property_id=${propertyId}&group=room-type-grouping`),
      ]);
      const rts = rtRes?.code === 200 && Array.isArray(rtRes.data) ? rtRes.data : [];
      const fls = flRes?.code === 200 && Array.isArray(flRes.data) ? flRes.data : [];
      const bds = bdRes?.code === 200 && Array.isArray(bdRes.data) ? bdRes.data : [];
      const cfgs = [
        ...(cfgRes?.code === 200 && Array.isArray(cfgRes.data) ? cfgRes.data : []),
        ...(ircRes?.code === 200 && Array.isArray(ircRes.data) ? ircRes.data : []),
      ];
      const grs = grRes?.code === 200 && Array.isArray(grRes.data) ? grRes.data : [];
      setRoomTypes(rts.map((r: any) => ({ id: Number(r.id), name: r.name })));
      setFloors(fls.map((r: any) => ({ id: Number(r.id), name: r.name })));
      setBuildings(bds.map((b: any) => ({ id: Number(b.id), name: b.name })));
      setConfigs(cfgs.map((c: any) => ({ id: Number(c.id), name: c.name, group: c.group })));
      setGroupings(grs.map((g: any) => ({ id: Number(g.id), name: g.name })));
      setRoomTypeId((prev) =>
        prev && rts.some((r: any) => String(r.id) === prev) ? prev : rts.length ? String(rts[0].id) : ""
      );
      setBuildingId((prev) =>
        prev && bds.some((b: any) => String(b.id) === prev) ? prev : bds.length ? String(bds[0].id) : ""
      );
      setConfigIds((prev) => prev.filter((id) => cfgs.some((c: any) => String(c.id) === id)));
    } catch {
      setRoomTypes([]);
      setFloors([]);
      setBuildings([]);
      setConfigs([]);
      setGroupings([]);
      setRoomTypeId("");
      setBuildingId("");
      setConfigIds([]);
    } finally {
      setBusy(false);
    }
  }, [propertyId, get]);

  /**
   * Groupings that have no room type yet. Clone brings the grouping LIST across
   * but not the `room_types` rows, so a fresh property looks "set up" in step 3
   * and still has nothing to pick in the Room Generator.
   */
  const groupingsWithoutRoomType = useMemo(() => {
    const names = new Set(roomTypes.map((r) => r.name.toLowerCase()));
    return groupings.filter((g) => !names.has(g.name.toLowerCase()));
  }, [groupings, roomTypes]);

  const createRoomTypesFromGroupings = async () => {
    if (!pickedGroupings.length) {
      notify("err", "Pick at least one Room Type Grouping");
      return;
    }
    setBusy(true);
    setBanner(null);
    try {
      const rate = newRoomRate.trim() === "" ? 0 : Number(newRoomRate);
      const res = await call(`${GLOBALURI}/room-types/from-groupings`, "POST", {
        property_id: Number(propertyId),
        groupings: pickedGroupings,
        rate: Number.isFinite(rate) ? rate : 0,
      });
      if (res?.code === 200) {
        const created = res.data?.created ?? 0;
        const list = res.data?.room_types ?? [];
        // Insert straight into local state so the select fills in immediately.
        setRoomTypes((prev) => [
          ...prev,
          ...list.filter((n: any) => !prev.some((p) => p.id === n.id)).map((n: any) => ({ id: n.id, name: n.name })),
        ]);
        if (list.length) setRoomTypeId(String(list[0].id));
        setPickedGroupings([]);
        setNewRoomRate("");
        notify(
          "ok",
          created ? `Created ${created} room type(s)` : "Those room types already existed",
          created ? "The first one is selected below." : "Linked to their Room Type Grouping."
        );
        loadOverview();
      } else {
        notify("err", res?.message ?? "Could not build room types from groupings");
      }
    } catch (e: any) {
      notify("err", e?.message ?? "Could not build room types from groupings");
    } finally {
      setBusy(false);
    }
  };

  const loadAudit = useCallback(async () => {
    if (!propertyId) return;
    try {
      const res = await get(`${GLOBALURI}/audit?property_id=${propertyId}&limit=200`);
      setAuditRows(res?.code === 200 && Array.isArray(res.data) ? res.data : []);
    } catch {
      setAuditRows([]);
    }
  }, [propertyId, get]);

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setBanner(null);
    setConfirmRooms(null);
    if (step === 2) loadTags();
    else if (step === 3) loadRoomInputs();
    else if (step === 4) loadAudit();
    else loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, propertyId]);

  const goTo = (n: number) => {
    setStep(n);
    setMaxStepReached((m) => Math.max(m, n));
  };

  /* ---------------- actions ---------------- */

  const runClone = async () => {
    setBusy(true);
    try {
      const res = await call(`${GLOBALURI}/clone`, "POST", {
        from_property_id: Number(fromProperty),
        to_property_id: Number(propertyId),
        steps: cloneSteps,
      });
      if (res?.code === 200) {
        const results = res.data?.results ?? [];
        setCloneResult(results);
        const total = results.reduce((a: number, b: any) => a + Number(b.inserted ?? 0), 0);
        notify(
          "ok",
          total > 0 ? `Cloned ${total} master rows` : "Nothing to clone - everything already exists",
          `${results.filter((r: any) => Number(r.inserted) > 0).length} of ${results.length} groups received new rows.`
        );
        loadOverview();
      } else {
        notify("err", res?.message ?? "Clone failed");
      }
    } catch (e: any) {
      notify("err", e?.message ?? "Clone failed");
    } finally {
      setBusy(false);
    }
  };

  const saveTags = async () => {
    const payload = rows.filter((r) => r.name.trim());
    if (!payload.length) {
      notify("err", "Nothing to save", "Every row needs a name.");
      return;
    }
    setBusy(true);
    try {
      const res = await call(`${GLOBALURI}/bulk-upsert`, "POST", {
        property_id: Number(propertyId),
        group,
        rows: payload.map((r) => ({ name: r.name, description: r.description, sort: r.sort, status: r.status })),
      });
      if (res?.code === 200) {
        notify("ok", `Saved ${payload.length} rows`, `Group: ${TAG_GROUPS.find((g) => g.value === group)?.label}`);
        loadTags();
        loadOverview();
      } else {
        notify("err", res?.message ?? "Save failed");
      }
    } catch (e: any) {
      notify("err", e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  /* Optimistic: the new room type shows up in the select straight away, no reload. */
  const createRoomType = async () => {
    const name = newRoomType.trim();
    if (!name) {
      setRtError("Room type name is required.");
      return;
    }
    if (name.length > 120) {
      setRtError("Keep the name under 120 characters.");
      return;
    }
    const parsedRate = newRoomRate.trim() === "" ? 0 : Number(newRoomRate);
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      setRtError("Base rate must be a number of 0 or more.");
      return;
    }
    setRtError("");
    setBusy(true);
    try {
      const res = await call(`${GLOBALURI}/room-types`, "POST", {
        property_id: Number(propertyId),
        name,
        rate: parsedRate,
        min_rate: parsedRate,
        sort: roomTypes.length,
      });
      if (res?.code === 200) {
        const id = Number(res.data?.id);
        setRoomTypes((prev) => (prev.some((r) => r.id === id) ? prev : [...prev, { id, name }]));
        setRoomTypeId(String(id));
        setNewRoomType("");
        setNewRoomRate("");
        notify("ok", `Room type "${name}" created`, "It is already selected below.");
        loadOverview();
      } else {
        setRtError(res?.message ?? "Could not create the room type.");
        notify("err", res?.message ?? "Could not create the room type");
      }
    } catch (e: any) {
      setRtError(e?.message ?? "Could not create the room type.");
      notify("err", e?.message ?? "Could not create the room type");
    } finally {
      setBusy(false);
    }
  };

  const doGenerateRooms = async () => {
    setConfirmRooms(null);
    setBusy(true);
    try {
      const res = await call(`${GLOBALURI}/generate-rooms`, "POST", {
        property_id: Number(propertyId),
        room_type_id: Number(roomTypeId),
        floor_ids: floorIds.map(Number),
        building_ids: buildingId ? [Number(buildingId)] : [],
        room_configuration_ids: configIds.map(Number),
        prefix,
        start_no: startNo,
        count_per_floor: perFloor,
        max_pax: maxPax,
        total_bed: totalBed,
      });
      if (res?.code === 200) {
        notify(
          "ok",
          `${res.data?.created ?? res.data?.total ?? 0} rooms created`,
          `${res.data?.total ?? 0} numbers checked. Existing rooms were not overwritten.`
        );
        loadOverview();
      } else {
        notify("err", res?.message ?? "Room generation failed");
      }
    } catch (e: any) {
      notify("err", e?.message ?? "Room generation failed");
    } finally {
      setBusy(false);
    }
  };

  const runGenerateRooms = () => {
    if (!roomTypeId) {
      notify("err", "Select a room type first", "If the list is empty, create one on the right.");
      return;
    }
    if (!floorIds.length) {
      notify("err", "Select at least one floor");
      return;
    }
    if (!buildingId && buildings.length) {
      notify("err", "Select a building", "Every room belongs to exactly one building.");
      return;
    }
    const total = floorIds.length * (Number.isFinite(perFloor) ? perFloor : 0);
    if (total > 50) {
      setConfirmRooms({ total });
      return;
    }
    doGenerateRooms();
  };

  /* ---------------- derived ---------------- */

  const percent = useMemo(() => {
    if (!steps.length) return 0;
    return Math.round((steps.filter((s) => s.is_complete).length / steps.length) * 100);
  }, [steps]);

  const selectedProperty = properties.find((p) => String(p.id) === propertyId);
  const missing = steps.filter((s) => !s.is_complete).map((s) => s.label);
  // Floors without any digit ("Floor LG", "Floor G") fall back to their position
// in the selection - the backend does the same, so the preview matches what
// actually gets created instead of showing "00" for every floor.
const firstFloorDigits =
    floors.find((f) => floorIds.includes(String(f.id)))?.name.match(/[0-9]+/)?.[0] ?? "1";
  const safePerFloor = Number.isFinite(perFloor) ? perFloor : 0;
  const roomTarget = floorIds.length * safePerFloor;

  const STATS = useMemo(
    () => [
      { label: "Buildings", value: overview?.counts?.building },
      { label: "Floors", value: overview?.counts?.floor },
      { label: "Room Configurators", value: overview?.counts?.room_configuration },
      { label: "Room Types", value: overview?.counts?.room_type },
      { label: "Rooms", value: overview?.counts?.room },
      { label: "Billing Codes", value: overview?.codes?.code_billing },
      { label: "GL Accounts", value: overview?.codes?.code_gl },
      { label: "Post Codes", value: overview?.codes?.code_post },
      { label: "Item Codes", value: overview?.codes?.code_item },
      { label: "Payment Methods", value: overview?.codes?.payment_method },
      { label: "Roles", value: overview?.counts?.role },
      { label: "Report Permissions", value: overview?.counts?.report_permission },
    ],
    [overview]
  );

  /* ---------------- pieces ---------------- */

  const BannerBox = banner ? (
    <div
      role="status"
      aria-live="polite"
      className={`mb-4 flex items-start gap-3 overflow-hidden rounded-xl border ${BANNER_STYLE[banner.tone].wrap}`}
    >
      <span className={`w-1 self-stretch ${BANNER_STYLE[banner.tone].bar}`} aria-hidden="true" />
      <span className="py-3">{BANNER_STYLE[banner.tone].icon}</span>
      <div className="min-w-0 flex-1 py-3 pr-2">
        <p className="text-sm font-semibold leading-snug">{banner.text}</p>
        {banner.detail && <p className="mt-0.5 text-xs opacity-80">{banner.detail}</p>}
      </div>
      <button
        onClick={() => setBanner(null)}
        aria-label="Dismiss notification"
        className="shrink-0 px-3 py-3 text-current opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  ) : null;

  const Sidebar = (
    <aside className="w-full lg:w-72 shrink-0">
      <div className={`${card} overflow-hidden lg:sticky lg:top-4`}>
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Setup progress</div>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-3xl font-bold leading-none text-gray-900">{percent}%</span>
            <span className="pb-0.5 text-xs text-gray-500">
              {steps.filter((s) => s.is_complete).length}/{steps.length || 0} complete
            </span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Setup completeness"
          >
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: T.accent }} />
          </div>
        </div>

        <nav aria-label="Setup steps">
          <ol>
            {WIZARD.map((w, i) => {
              const state = i === step ? "current" : i < step ? "done" : i <= maxStepReached ? "open" : "locked";
              return (
                <li key={w.title} className="relative">
                  <button
                    onClick={() => goTo(i)}
                    disabled={state === "locked"}
                    aria-current={state === "current" ? "step" : undefined}
                    className={[
                      "group relative flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[rgba(132,90,223,0.35)]",
                      state === "current" ? "bg-[#F5F0FF]" : "",
                      state === "locked" ? "cursor-not-allowed opacity-45" : "hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {state === "current" && <span className="absolute inset-y-0 left-0 w-1 bg-[#845ADF]" aria-hidden="true" />}
                    <span className="relative flex shrink-0 flex-col items-center">
                      <span
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-150",
                          state === "current" ? "bg-[#845ADF] text-white ring-4 ring-[#E9DFFD]" : "",
                          state === "done" ? "bg-emerald-500 text-white" : "",
                          state === "open" ? "border-2 border-gray-300 bg-white text-gray-600 group-hover:border-[#845ADF]" : "",
                          state === "locked" ? "bg-gray-200 text-gray-500" : "",
                        ].join(" ")}
                      >
                        {state === "done" ? (
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M16.704 5.29a.75.75 0 01.006 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06l2.97 2.97 6.97-6.97a.75.75 0 011.06-.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </span>
                      {i < WIZARD.length - 1 && (
                        <span
                          className={`mt-1 min-h-[16px] w-0.5 flex-1 ${state === "done" ? "bg-emerald-300" : "bg-gray-200"}`}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="min-w-0 pb-0.5">
                      <span className={`block text-sm font-semibold ${state === "current" ? "text-[#845ADF]" : "text-gray-900"}`}>
                        {w.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-gray-500">{w.desc}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );

  const ConfirmDialog = confirmRooms ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className={`${card} w-full max-w-md p-6 shadow-xl`}>
        <h3 id="confirm-title" className="text-base font-bold text-gray-900">
          Create {confirmRooms.total} rooms?
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {floorIds.length} floor(s) x {safePerFloor} room(s). Room numbers that already exist are skipped, so this is
          safe to run again. Each room is tagged with{" "}
          <b>{buildings.find((b) => String(b.id) === buildingId)?.name ?? "every building"}</b>
          {configIds.length ? (
            <>
              {" "}and {configIds.length} Room Configurator item(s)
            </>
          ) : null}
          .
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button className={btnSecondary} onClick={() => setConfirmRooms(null)} autoFocus>
            Cancel
          </button>
          <button className={btnPrimary} onClick={doGenerateRooms}>
            Yes, create rooms
          </button>
        </div>
      </div>
    </div>
  ) : null;

  /* ---------------- render ---------------- */

  return (
    <>
      <Seo title="Initial Setup" />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900">Initial Setup</h1>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="is-property" className="text-xs font-medium text-gray-500">
            Property
          </label>
          <select
            id="is-property"
            className={inputBase + " min-w-[200px] w-auto"}
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          >
            <option value="">Select property...</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button className={btnSecondary} onClick={loadOverview} disabled={busy || !propertyId} title="Refresh">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 3a7 7 0 00-6.32 4H1.5a.75.75 0 01-.74-.83l.35-1.83A.75.75 0 011.86 4h2.9a.75.75 0 01.7.46 8 8 0 019.08 0 .75.75 0 01.7-.46h2.9a.75.75 0 011.75.66l.35 1.83a.75.75 0 01-.74.83h-2.18A7 7 0 1010 3zm0 4a3 3 0 100 6 3 3 0 000-6z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {BannerBox}

      <div className="flex flex-col items-start gap-4 lg:flex-row">
        {Sidebar}

        <div className="min-w-0 w-full flex-1">
          <div className={`${card} overflow-hidden`}>
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#845ADF]">
                Step {step + 1} of {WIZARD.length}
              </div>
              <h2 className="mt-0.5 text-base font-bold text-gray-900">{WIZARD[step].title}</h2>
              <p className="mt-0.5 text-sm text-gray-500">{WIZARD[step].desc}</p>
            </div>

            <div className="min-h-[320px] p-6">
              {/* ============ 1 - PROPERTY ============ */}
              {step === 0 && (
                <div className="space-y-6">
                  {overview?.advanced_schema === false && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                      The change log needs the optimized database. Clone, master data editor and room generator work either
                      way.
                    </div>
                  )}

                  {missing.length > 0 ? (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">
                          {missing.length} item{missing.length > 1 ? "s" : ""} still missing
                        </span>{" "}
                        {missing.join(", ")}
                      </p>
                      <p className="mt-1 text-xs text-blue-700">
                        Step 2 (Clone Master) fills most of them in one click.
                      </p>
                    </div>
                  ) : steps.length > 0 ? (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      Every checklist item is complete for this property.
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {STATS.map((c) => (
                      <div key={c.label} className="rounded-lg border border-gray-200 px-4 py-3">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{c.label}</div>
                        <div className="mt-1 text-2xl font-bold leading-none text-gray-900">{c.value ?? "-"}</div>
                      </div>
                    ))}
                  </div>

                  {Array.isArray(overview?.tags_by_group) && overview.tags_by_group.length > 0 && (
                    <div>
                      <div className={sectionTitle + " mb-2"}>Tags by group</div>
                      <div className="flex flex-wrap gap-2">
                        {overview.tags_by_group.map((g: any) => (
                          <span
                            key={g.group}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                          >
                            {g.group || "(blank)"} <b className="text-gray-900">{g.total}</b>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============ 2 - CLONE ============ */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[220px]">
                      <label className={fieldLabel} htmlFor="is-clone-from">
                        Source property
                      </label>
                      <select id="is-clone-from" className={inputBase} value={fromProperty} onChange={(e) => setFromProperty(e.target.value)}>
                        {properties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button className={btnPrimary} onClick={runClone} disabled={busy || !propertyId || fromProperty === propertyId}>
                      {busy ? "Cloning..." : "Clone Master Setup"}
                    </button>
                    <p className="pb-2 text-xs text-gray-500">
                      Into <b className="text-gray-700">{selectedProperty?.name ?? "-"}</b>
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className={sectionTitle}>Data to copy</div>
                      <div className="flex gap-3 text-xs">
                        <button className="font-medium text-[#845ADF] hover:underline" onClick={() => setCloneSteps(CLONE_STEPS.map((s) => s.value))}>
                          Select all
                        </button>
                        <button className="text-gray-500 hover:underline" onClick={() => setCloneSteps([])}>
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {CLONE_STEPS.map((s) => {
                        const on = cloneSteps.includes(s.value);
                        return (
                          <label
                            key={s.value}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors duration-150 ${
                              on ? "border-[#C9B4F5] bg-[#F5F0FF]" : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={(e) =>
                                setCloneSteps((prev) =>
                                  e.target.checked ? [...prev, s.value] : prev.filter((x) => x !== s.value)
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300 text-[#845ADF] focus:ring-[#845ADF]"
                            />
                            <span className={on ? "text-gray-900" : "text-gray-500"}>{s.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {cloneResult.length > 0 && (
                    <div className="border-t border-gray-100 pt-5">
                      <div className={sectionTitle + " mb-2"}>Last run</div>
                      <div className="flex flex-wrap gap-2">
                        {cloneResult.map((r: any) => (
                          <span
                            key={r.step}
                            className={`rounded-full border px-3 py-1 text-xs ${
                              Number(r.inserted) > 0
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-gray-200 bg-gray-50 text-gray-500"
                            }`}
                          >
                            {r.step} <b>{r.inserted}</b>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============ 3 - MASTER DATA ============ */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[220px]">
                      <label className={fieldLabel} htmlFor="is-group">
                        Data group
                      </label>
                      <select id="is-group" className={inputBase} value={group} onChange={(e) => setGroup(e.target.value)}>
                        {TAG_GROUPS.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button className={btnSecondary} onClick={loadTags} disabled={busy}>
                      Reload
                    </button>
                    <button className={btnPrimary} onClick={saveTags} disabled={busy || !dirty || !propertyId}>
                      {busy ? "Saving..." : "Save all"}
                    </button>
                    <button
                      className={btnSecondary}
                      onClick={() => setRows((p) => [...p, { id: 0, name: "", description: "", sort: p.length, status: 1 }])}
                    >
                      + Add row
                    </button>
                    {dirty && (
                      <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                        Unsaved changes
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                          <th scope="col" className="w-10 px-3 py-2.5 text-left">#</th>
                          <th scope="col" className="px-3 py-2.5 text-left">Name</th>
                          <th scope="col" className="px-3 py-2.5 text-left">Description</th>
                          <th scope="col" className="w-20 px-3 py-2.5 text-center">Sort</th>
                          <th scope="col" className="w-16 px-3 py-2.5 text-center">Active</th>
                          <th scope="col" className="w-10 px-3 py-2.5"><span className="sr-only">Remove</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr key={r.id || `new-${i}`} className="border-t border-gray-100">
                            <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-1.5">
                              <input
                                aria-label={`Row ${i + 1} name`}
                                className={inputBase}
                                value={r.name}
                                onChange={(e) => {
                                  setDirty(true);
                                  setRows((p) => p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)));
                                }}
                              />
                            </td>
                            <td className="px-3 py-1.5">
                              <input
                                aria-label={`Row ${i + 1} description`}
                                className={inputBase}
                                value={r.description ?? ""}
                                onChange={(e) => {
                                  setDirty(true);
                                  setRows((p) => p.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)));
                                }}
                              />
                            </td>
                            <td className="px-3 py-1.5">
                              <input
                                type="number"
                                aria-label={`Row ${i + 1} sort`}
                                className={inputBase + " text-center"}
                                value={r.sort ?? 0}
                                onChange={(e) => {
                                  setDirty(true);
                                  setRows((p) => p.map((x, j) => (j === i ? { ...x, sort: Number(e.target.value) } : x)));
                                }}
                              />
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <input
                                type="checkbox"
                                aria-label={`Row ${i + 1} active`}
                                checked={r.status === 1}
                                onChange={(e) => {
                                  setDirty(true);
                                  setRows((p) => p.map((x, j) => (j === i ? { ...x, status: e.target.checked ? 1 : 0 } : x)));
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-[#845ADF] focus:ring-[#845ADF]"
                              />
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <button
                                aria-label={`Remove row ${i + 1}`}
                                className="rounded p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                                onClick={() => {
                                  setDirty(true);
                                  setRows((p) => p.filter((_, j) => j !== i));
                                }}
                              >
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {!rows.length && (
                          <tr>
                            <td colSpan={6} className="px-3 py-12 text-center text-gray-400">
                              No rows for <b className="text-gray-600">{TAG_GROUPS.find((g) => g.value === group)?.label}</b> on
                              this property. Use &quot;Add row&quot; or go back to step 2 and clone.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ============ 4 - ROOM GENERATOR ============ */}
              {step === 3 && (
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
                  <div className="space-y-6 xl:col-span-3">
                    {/* room type */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F0FF] text-[11px] font-bold text-[#845ADF]">
                          1
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Room type <span className="text-red-500">*</span>
                        </span>
                      </div>

                      <select
                        className={inputBase}
                        value={roomTypeId}
                        onChange={(e) => setRoomTypeId(e.target.value)}
                        disabled={!roomTypes.length}
                        aria-label="Room type"
                      >
                        <option value="">{roomTypes.length ? "Select room type..." : "No room type yet"}</option>
                        {roomTypes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>

                      {!roomTypes.length && (
                        <div className="mt-2 p-2.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800">
                          This property has no room type, so the generator cannot run.
                          {groupings.length
                            ? " Build them from the Room Type Grouping below."
                            : " Add a Room Type Grouping in step 3 first."}
                        </div>
                      )}

                      {roomTypes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {roomTypes.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setRoomTypeId(String(r.id))}
                              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                                String(r.id) === roomTypeId
                                  ? "border-[#845ADF] bg-[#845ADF] text-white"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-[#C9B4F5] hover:text-[#845ADF]"
                              }`}
                            >
                              {r.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Build room types straight from the Room Type Grouping list */}
                      {groupingsWithoutRoomType.length > 0 && (
                        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">
                              Create from Room Type Grouping
                            </span>
                            <span className="rounded-full bg-[#F5F0FF] px-2 py-0.5 text-[10px] font-semibold text-[#845ADF]">
                              {groupingsWithoutRoomType.length} available
                            </span>
                          </div>
                          <p className="mb-2 text-[11px] leading-relaxed text-gray-500">
                            Cloning carries the grouping list across but not the room types themselves. Pick the groupings
                            you want and one room type is created for each, linked back to its grouping.
                          </p>
                          <div className="mb-2 flex flex-wrap gap-2">
                            {groupingsWithoutRoomType.map((g) => {
                              const on = pickedGroupings.includes(g.name);
                              return (
                                <button
                                  key={g.id}
                                  aria-pressed={on}
                                  onClick={() =>
                                    setPickedGroupings((p) => (on ? p.filter((x) => x !== g.name) : [...p, g.name]))
                                  }
                                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                    on
                                      ? "border-[#845ADF] bg-[#845ADF] text-white"
                                      : "border-gray-300 bg-white text-gray-600 hover:border-[#C9B4F5] hover:text-[#845ADF]"
                                  }`}
                                >
                                  {g.name}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              className={inputBase + " w-32"}
                              type="number"
                              min={0}
                              placeholder="Base rate"
                              value={newRoomRate}
                              onChange={(e) => setNewRoomRate(e.target.value)}
                              aria-label="Base rate for generated room types"
                            />
                            <button
                              className={btnPrimary}
                              onClick={createRoomTypesFromGroupings}
                              disabled={busy || !pickedGroupings.length}
                            >
                              {busy ? "Creating..." : `Create ${pickedGroupings.length || ""} room type(s)`.trim()}
                            </button>
                            <button
                              className={btnGhost}
                              onClick={() => setPickedGroupings(groupingsWithoutRoomType.map((g) => g.name))}
                            >
                              Select all
                            </button>
                            <button className={btnGhost} onClick={() => setPickedGroupings([])}>
                              Clear
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="mb-2 text-xs font-semibold text-gray-600">
                          {roomTypes.length ? "Add another room type" : "Create the first room type"}
                        </div>
                        <div className="flex flex-wrap items-start gap-2">
                          <div className="min-w-[160px] flex-1">
                            <input
                              className={inputBase + (rtError ? " border-red-400 focus:border-red-500 focus:ring-red-200" : "")}
                              placeholder="Name, e.g. Deluxe"
                              value={newRoomType}
                              onChange={(e) => {
                                setNewRoomType(e.target.value);
                                if (rtError) setRtError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") createRoomType();
                              }}
                              aria-invalid={!!rtError}
                              aria-describedby={rtError ? "rt-error" : undefined}
                            />
                          </div>
                          <div className="w-32">
                            <input
                              className={inputBase}
                              type="number"
                              min={0}
                              placeholder="Base rate"
                              value={newRoomRate}
                              onChange={(e) => {
                                setNewRoomRate(e.target.value);
                                if (rtError) setRtError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") createRoomType();
                              }}
                              aria-label="Base rate"
                            />
                          </div>
                          <button className={btnPrimary} onClick={createRoomType} disabled={busy || !newRoomType.trim()}>
                            {busy ? "..." : "Create"}
                          </button>
                        </div>
                        {rtError && (
                          <p id="rt-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
                            {rtError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* floors */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F0FF] text-[11px] font-bold text-[#845ADF]">
                          2
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Floors <span className="text-red-500">*</span>
                        </span>
                      </div>
                      {floors.length ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {floors.map((f) => {
                              const on = floorIds.includes(String(f.id));
                              return (
                                <button
                                  key={f.id}
                                  aria-pressed={on}
                                  onClick={() =>
                                    setFloorIds((p) => (on ? p.filter((x) => x !== String(f.id)) : [...p, String(f.id)]))
                                  }
                                  className={`rounded-lg border px-3.5 py-2 text-sm transition-all duration-150 ${
                                    on
                                      ? "border-[#845ADF] bg-[#845ADF] text-white shadow-sm"
                                      : "border-gray-300 bg-white text-gray-700 hover:border-[#C9B4F5] hover:text-[#845ADF]"
                                  }`}
                                >
                                  {f.name}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-2 flex gap-3 text-xs">
                            <button className="font-medium text-[#845ADF] hover:underline" onClick={() => setFloorIds(floors.map((f) => String(f.id)))}>
                              Select all
                            </button>
                            <button className="text-gray-500 hover:underline" onClick={() => setFloorIds([])}>
                              Clear
                            </button>
                            <span className="ml-auto text-gray-500">
                              {floorIds.length} of {floors.length} selected
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                          This property has no floors yet. Add them in step 3, group &quot;Floor&quot;.
                        </div>
                      )}
                    </div>

                    {/* building */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F0FF] text-[11px] font-bold text-[#845ADF]">
                          3
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Building <span className="text-red-500">*</span>
                        </span>
                      </div>
                      {buildings.length ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {buildings.map((b) => {
                              const on = buildingId === String(b.id);
                              return (
                                <button
                                  key={b.id}
                                  aria-pressed={on}
                                  onClick={() => setBuildingId(on ? "" : String(b.id))}
                                  className={`rounded-lg border px-3.5 py-2 text-sm transition-all duration-150 ${
                                    on
                                      ? "border-[#845ADF] bg-[#845ADF] text-white shadow-sm"
                                      : "border-gray-300 bg-white text-gray-700 hover:border-[#C9B4F5] hover:text-[#845ADF]"
                                  }`}
                                >
                                  {b.name}
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            A room belongs to exactly one building. Every generated room is tagged with it.
                          </p>
                        </>
                      ) : (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                          This property has no building yet. Add one in step 3, group &quot;Building&quot;. The generator falls back
                          to every building of this property until you pick one.
                        </div>
                      )}
                    </div>

                    {/* room configurator */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F0FF] text-[11px] font-bold text-[#845ADF]">
                          3
                        </span>
                        <span className="text-sm font-semibold text-gray-900">Room Configurator</span>
                      </div>
                      {configs.length ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {configs.map((c) => {
                              const on = configIds.includes(String(c.id));
                              return (
                                <button
                                  key={c.id}
                                  aria-pressed={on}
                                  onClick={() =>
                                    setConfigIds((p) => (on ? p.filter((x) => x !== String(c.id)) : [...p, String(c.id)]))
                                  }
                                  className={`rounded-lg border px-3.5 py-2 text-sm transition-all duration-150 ${
                                    on
                                      ? "border-[#845ADF] bg-[#845ADF] text-white shadow-sm"
                                      : "border-gray-300 bg-white text-gray-700 hover:border-[#C9B4F5] hover:text-[#845ADF]"
                                  }`}
                                >
                                  {c.name}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-2 flex gap-3 text-xs">
                            <button className="font-medium text-[#845ADF] hover:underline" onClick={() => setConfigIds(configs.map((c) => String(c.id)))}>
                              Select all
                            </button>
                            <button className="text-gray-500 hover:underline" onClick={() => setConfigIds([])}>
                              Clear
                            </button>
                            <span className="ml-auto text-gray-500">
                              {configIds.length} of {configs.length} selected
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
                          No configurator items yet. Add them in step 3, group &quot;Room Configuration&quot; or &quot;In-room
                          Equipment&quot;. Optional - rooms are still created without them.
                        </div>
                      )}
                    </div>

                    {/* numbering */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F0FF] text-[11px] font-bold text-[#845ADF]">
                          4
                        </span>
                        <span className="text-sm font-semibold text-gray-900">Numbering</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        <div>
                          <label className={fieldLabel} htmlFor="is-prefix">Prefix</label>
                          <input id="is-prefix" className={inputBase} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="optional" />
                        </div>
                        <div>
                          <label className={fieldLabel} htmlFor="is-start">Start number</label>
                          <input id="is-start" type="number" min={0} className={inputBase} value={startNo} onChange={(e) => setStartNo(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={fieldLabel} htmlFor="is-perfloor">Rooms per floor</label>
                          <input id="is-perfloor" type="number" min={1} max={500} className={inputBase} value={perFloor} onChange={(e) => setPerFloor(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={fieldLabel} htmlFor="is-maxpax">Max pax</label>
                          <input id="is-maxpax" type="number" min={1} className={inputBase} value={maxPax} onChange={(e) => setMaxPax(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={fieldLabel} htmlFor="is-beds">Total bed</label>
                          <input id="is-beds" type="number" min={1} className={inputBase} value={totalBed} onChange={(e) => setTotalBed(Number(e.target.value))} />
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-gray-500">
                        Preview{" "}
                        <b className="text-gray-700">
                          {prefix || ""}
                          {firstFloorDigits.padStart(2, "0")}-{String(startNo).padStart(3, "0")} … {prefix || ""}
                          {firstFloorDigits.padStart(2, "0")}-{String(startNo + Math.max(safePerFloor, 1) - 1).padStart(3, "0")}
                        </b>
                      </p>
                    </div>
                  </div>

                  {/* summary */}
                  <div className="xl:col-span-2">
                    <div className={`${card} bg-gray-50 p-5 xl:sticky xl:top-4`}>
                      <div className="mb-4 text-sm font-bold text-gray-900">Summary</div>
                      <dl className="space-y-2.5 text-sm">
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-gray-500">Property</dt>
                          <dd className="text-right font-medium text-gray-900">{selectedProperty?.name ?? "-"}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-gray-500">Room type</dt>
                          <dd className="text-right font-medium">
                            {roomTypes.find((r) => String(r.id) === roomTypeId)?.name ?? (
                              <span className="text-red-500">not selected</span>
                            )}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-gray-500">Floors</dt>
                          <dd className="text-right font-medium text-gray-900">
                            {floorIds.length
                              ? floorIds.map((id) => floors.find((f) => String(f.id) === id)?.name).join(", ")
                              : "none"}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-gray-500">Building</dt>
                          <dd className="text-right font-medium text-gray-900">
                            {buildings.find((b) => String(b.id) === buildingId)?.name ?? (
                              <span className="text-red-500">not selected</span>
                            )}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-gray-500">Room Configurator</dt>
                          <dd className="text-right font-medium text-gray-900">
                            {configIds.length
                              ? configIds.map((id) => configs.find((c) => String(c.id) === id)?.name).join(", ")
                              : "none"}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3 border-t border-gray-200 pt-2.5">
                          <dt className="text-gray-500">Rooms to create</dt>
                          <dd className="text-right text-lg font-bold text-[#845ADF]">
                            {floorIds.length} × {safePerFloor} = {roomTarget}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-gray-500">Rooms already exist</dt>
                          <dd className="text-right font-medium text-gray-900">{overview?.counts?.room ?? 0}</dd>
                        </div>
                      </dl>

                      <button
                        className={btnPrimary + " mt-5 w-full"}
                        onClick={runGenerateRooms}
                        disabled={busy || !propertyId || !roomTypeId || !floorIds.length || (!!buildings.length && !buildingId)}
                      >
                        {busy ? "Generating..." : `Generate ${roomTarget || ""} rooms`.trim()}
                      </button>
                      <button className={btnSecondary + " mt-2 w-full"} onClick={loadRoomInputs} disabled={busy}>
                        Reload room type, floor &amp; building
                      </button>
                      <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
                        Existing room numbers are never overwritten. Re-running the generator is safe.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ 5 - VERIFY ============ */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <div className={sectionTitle + " mb-2"}>Checklist</div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {steps.map((s) => (
                        <div
                          key={s.step}
                          className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm ${
                            s.is_complete ? "border-emerald-200 bg-emerald-50" : "border-gray-200"
                          }`}
                        >
                          <span className={s.is_complete ? "font-bold text-emerald-600" : "font-bold text-gray-300"} aria-hidden="true">
                            {s.is_complete ? "✓" : "○"}
                          </span>
                          <span className={s.is_complete ? "text-gray-900" : "text-gray-500"}>{s.label}</span>
                          <span className="sr-only">{s.is_complete ? "complete" : "not complete"}</span>
                        </div>
                      ))}
                      {!steps.length && <div className="text-sm text-gray-400">Select a property to load the checklist.</div>}
                    </div>
                  </div>

                  <div>
                    <div className={sectionTitle + " mb-2"}>Change Log</div>
                    {overview?.advanced_schema === false ? (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        The change log is only available on the optimized database (audit.change_log).
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full text-xs">
                          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                              <th scope="col" className="px-3 py-2.5 text-left">When</th>
                              <th scope="col" className="px-3 py-2.5 text-left">Table</th>
                              <th scope="col" className="px-3 py-2.5 text-left">Row</th>
                              <th scope="col" className="px-3 py-2.5 text-left">Action</th>
                              <th scope="col" className="px-3 py-2.5 text-left">Actor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {auditRows.map((r: any) => (
                              <tr key={r.id} className="border-t border-gray-100">
                                <td className="px-3 py-2 text-gray-600">{r.changed_at}</td>
                                <td className="px-3 py-2">{r.table_name}</td>
                                <td className="px-3 py-2">{r.row_id ?? "-"}</td>
                                <td
                                  className={`px-3 py-2 font-medium ${
                                    r.op === "DELETE" ? "text-red-600" : r.op === "INSERT" ? "text-emerald-600" : "text-amber-600"
                                  }`}
                                >
                                  {r.op}
                                </td>
                                <td className="px-3 py-2">{r.actor ?? "system"}</td>
                              </tr>
                            ))}
                            {!auditRows.length && (
                              <tr>
                                <td colSpan={5} className="px-3 py-12 text-center text-gray-400">
                                  No changes recorded yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3">
              <button className={btnSecondary} onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0 || busy}>
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L9.06 10l3.71 3.71a.75.75 0 11-1.06 1.06l-4.24-4.25a.75.75 0 010-1.06l4.24-4.24a.75.75 0 011.06.01z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <span className="flex-1" />
              {step < WIZARD.length - 1 ? (
                <button className={btnPrimary} onClick={() => goTo(step + 1)} disabled={!propertyId || busy}>
                  Next
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 010-1.06L10.94 10 7.21 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.06 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button className={btnSecondary} onClick={loadOverview} disabled={busy}>
                  Re-check
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {ConfirmDialog}
    </>
  );
}
