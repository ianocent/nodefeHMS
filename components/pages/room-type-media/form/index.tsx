import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import InputMain from "../../../common/input/InputMain";
import { FetchData, FetchDataDocument, GetDecrypt, getEnv } from "../../../helper";

// Room TYPE scoped media, the scope the booking engine reads
// (hmsBookingEngine RoomType::getRoomTypeImageAttribute / getFacilitiesAttribute
// both key on room_type_id). "image" = room photos, "facility" = amenities.
type Kind = "image" | "facility";

const AddView = ({ kind }: { kind: Kind }) => {
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const urlParams = new URLSearchParams(window.location.search);
  const parent = urlParams.get("parent") ?? "48";

  // The room type being edited travels in ?data=, the same convention every other
  // Room Type sub-tab uses (menu 1095 Main, 1099 Image). It is state, not a constant:
  // the picker below has to switch room type without a full page reload, and reading
  // window.location.search straight into the fetch deps meant the list never refetched.
  const [roomTypeId, setRoomTypeId] = useState<string>(urlParams.get("data") ?? "");
  const GLOBALURI = `/cms/content/room/config-${kind}`;

  const [master, setMaster] = useState<any>({});
  const [masterError, setMasterError] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    id: 0,
    name: "",
    icon: "",
    image: null as File | string | null,
    sort: 0,
    status: 1,
  });
  const [savingId, setsavingId] = useState<number | null>(null);
  const [deletingId, setdeletingId] = useState<number | null>(null);

  const loadMaster = async () => {
    const res: any = await FetchData(
      `${GLOBALURI}/create`,
      "GET",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    if (res?.code == "200") {
      setMaster(res?.master ?? {});
      setMasterError(null);
    } else {
      // The icon/preset pickers silently render empty when master is missing, so the
      // operator sees a form that looks broken with no explanation.
      setMasterError(res?.message || "Could not load the form options.");
    }
  };

  const loadRows = async () => {
    if (!roomTypeId) {
      setRows([]);
      setLoadError(null);
      return;
    }
    const res: any = await FetchData(
      `${GLOBALURI}?room_type_id=${roomTypeId}&limit=200`,
      "GET",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    if (res?.code == "200") {
      // `data` is a row array. Anything else (a single object from a misrouted
      // endpoint, an envelope, null) used to land in setRows and then blow up on
      // `rows.map` — the whole page died with "a client-side exception has occurred".
      setRows(Array.isArray(res?.data) ? res.data : []);
      setLoadError(null);
    } else {
      setRows([]);
      setLoadError(res?.message || "Could not load the list.");
    }
  };

  useEffect(() => {
    loadMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  useEffect(() => {
    loadRows();
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypeId, kind]);

  const resetForm = () =>
    setForm({ id: 0, name: "", icon: "", image: null, sort: 0, status: 1 });

  const startEdit = (row: any) =>
    setForm({
      id: row.id,
      name: row.name ?? "",
      icon: row.icon ?? "",
      image: row.image ?? null,
      sort: row.sort ?? 0,
      status: row.status ?? 1,
    });

  // Multipart because the photo/glyph is a File. isjson=false is mandatory: the
  // response is AES ciphertext served as text/plain, and response.json() on it
  // throws (this is the "Failed to connect to server" bug the banner form hit).
  const submit = async (id: number) => {
    // Validate BEFORE flipping the button into its loading state. The old order set
    // `loading` in the click handler, so any early return here stranded the button in
    // the skeleton forever.
    if (!roomTypeId) {
      toast.error("Pick a room type first");
      return;
    }
    if (!form.name?.toString().trim()) {
      toast.error("Name is required");
      return;
    }
    setloading(true);
    const fd = new FormData();
    fd.append("room_type_id", roomTypeId);
    fd.append("name", form.name.toString().trim());
    fd.append("sort", String(form.sort ?? 0));
    fd.append("status", String(form.status ?? 1));
    if (kind === "facility") fd.append("icon", form.icon ?? "");
    if (form.image instanceof File) fd.append("image", form.image);

    const uri = id ? `${GLOBALURI}/${id}` : GLOBALURI;
    setsavingId(id || 0);
    try {
      const res: any = await FetchDataDocument(
        uri,
        id ? "PUT" : "POST",
        fd,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (res === false) return;
      toast.success(id ? "Saved" : "Added");
      resetForm();
      await loadRows();
    } finally {
      // `loading` drives the button into its skeleton state and nothing else ever
      // cleared it, so a successful save left the button spinning forever even though
      // the toast had already confirmed it. try/finally so a rejected fetch or a thrown
      // validation handler releases the button too.
      setsavingId(null);
      setloading(false);
    }
  };

  const remove = async (row: any) => {
    if (!confirm(`Delete "${row.name}"?`)) return;
    setdeletingId(row.id);
    const res: any = await FetchData(
      `${GLOBALURI}/${row.id}`,
      "DELETE",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    setdeletingId(null);
    if (res === false) return;
    if (form.id === row.id) resetForm();
    loadRows();
  };

  const move = async (row: any, dir: -1 | 1) => {
    const idx = rows.findIndex((r) => r.id === row.id);
    const swap = rows[idx + dir];
    if (!swap) return;
    const fd = new FormData();
    fd.append("name", row.name ?? "");
    fd.append("sort", String(swap.sort ?? 0));
    fd.append("status", String(row.status ?? 1));
    const fd2 = new FormData();
    fd2.append("name", swap.name ?? "");
    fd2.append("sort", String(row.sort ?? 0));
    fd2.append("status", String(swap.status ?? 1));
    await FetchDataDocument(
      `${GLOBALURI}/${row.id}`,
      "PUT",
      fd,
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    await FetchDataDocument(
      `${GLOBALURI}/${swap.id}`,
      "PUT",
      fd2,
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    loadRows();
  };

  const roomTypeLabel =
    master?.room_types?.find((r: any) => String(r.value) === String(roomTypeId))
      ?.label ?? "";

  const presets: any[] = master?.facility_presets ?? [];

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-8">
            <h2 className="text-lg font-bold">
              Room Type {kind === "image" ? "Photos" : "Facilities"}
              {roomTypeLabel ? ` — ${roomTypeLabel}` : ""}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {kind === "image"
                ? "These photos appear on the booking engine room card. The first one is the cover."
                : "These amenities appear on the booking engine room card, with the icon you pick."}
            </p>
          </div>
          <div className="col-span-4 h-fit" />
        </div>

        {masterError && (
          <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {masterError}
          </div>
        )}

        {/* Room type picker. Opened from the Booking Engine Setup tab strip this screen
            has no `?data=`, and without a picker the whole page was a dead end: no room
            type, no list, no upload. `menu 1099` (under Room Type) still arrives with
            ?data= and just preselects it. */}
        <div className="lg:col-span-5">
          <fieldset className="border">
            <legend className="ml-2 mb-5">Room Type</legend>
            <div className="m-2">
              <InputMain
                typeInput="select-multi"
                error={false}
                label="Which room type do these belong to?"
                required={true}
                options={master?.room_types ?? []}
                onChangeSel={(e: any) => setRoomTypeId(String(e?.value ?? ""))}
                restSelect={{}}
                valueSel={
                  master?.room_types?.find(
                    (r: any) => String(r.value) === String(roomTypeId)
                  ) ?? null
                }
                isMulti={false}
                placeholder="Pick a room type"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Stored per room type, because that is the scope the booking engine
                reads.
              </p>
            </div>
          </fieldset>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* ── Add / edit ─────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5">
            <fieldset className="border">
              <legend className="ml-2 mb-5">
                {form.id ? "Edit" : "Add"} {kind === "image" ? "Photo" : "Facility"}
              </legend>
              <div className="grid grid-cols-12 gap-4 m-2">
                <div className="col-span-12">
                  <InputMain
                    typeInput="base"
                    error={false}
                    label="Name"
                    required={true}
                    rest={{
                      name: "name",
                      placeholder: kind === "image" ? "e.g. Deluxe Twin" : "e.g. Non Smoking",
                      value: form.name,
                      type: "text",
                      onChange: (e: any) =>
                        setForm({ ...form, name: e.target.value }),
                    }}
                  />
                </div>

                {kind === "facility" && (
                  <>
                    <div className="col-span-12">
                      <InputMain
                        typeInput="select-multi"
                        error={false}
                        label="Icon"
                        required={false}
                        options={master?.facility_icons ?? []}
                        onChangeSel={(e: any) =>
                          setForm({ ...form, icon: e?.value ?? "" })
                        }
                        restSelect={{}}
                        valueSel={
                          form.icon
                            ? { value: form.icon, label: form.icon }
                            : null
                        }
                        isMulti={false}
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        Drawn by the booking engine. Leave empty to use the neutral
                        default glyph.
                      </p>
                    </div>
                    {presets.length > 0 && (
                      <div className="col-span-12">
                        <label className="mt-2 font-bold text-[14px] leading-[19px]">
                          Presets
                        </label>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {presets.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() =>
                                setForm({
                                  ...form,
                                  name: p.value,
                                  icon: p.icon,
                                })
                              }
                              className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="col-span-6">
                  <InputMain
                    typeInput="base"
                    error={false}
                    label="Sort"
                    required={false}
                    rest={{
                      name: "sort",
                      placeholder: "0",
                      value: form.sort,
                      type: "number",
                      onChange: (e: any) =>
                        setForm({ ...form, sort: e.target.value }),
                    }}
                  />
                </div>
                <div className="col-span-6">
                  <InputMain
                    typeInput="select-multi"
                    error={false}
                    label="Status"
                    required={true}
                    options={master?.statuses ?? []}
                    onChangeSel={(e: any) =>
                      setForm({ ...form, status: e?.value ?? 1 })
                    }
                    restSelect={{}}
                    valueSel={
                      master?.statuses?.find(
                        (s: any) => Number(s.value) === Number(form.status)
                      ) ?? null
                    }
                    isMulti={false}
                  />
                </div>

                <div className="col-span-12">
                  <InputMain
                    typeInput="image"
                    error={false}
                    label={kind === "image" ? "Photo" : "Icon image (optional)"}
                    required={false}
                    useFileObject={true}
                    onChangeFiles={(e: any) => setForm({ ...form, image: e })}
                    valueSel={form.image}
                  />
                  {kind === "facility" && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Optional. A react-icon is enough; upload a picture only if you
                      want a custom glyph.
                    </p>
                  )}
                </div>

                <div className="col-span-12 flex gap-2">
                  <ButtonSubmit
                    onCreate={() => {
                      submit(form.id);
                    }}
                    loading={loading}
                    label={form.id ? "Save Change" : "Add"}
                  />
                  {form.id ? (
                    <ButtonSubmit
                      isprimary={false}
                      onCreate={() => {
                        resetForm();
                        setloading(false);
                      }}
                      loading={false}
                      label="Cancel Edit"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </fieldset>
          </div>

          {/* ── List ────────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-7">
            <fieldset className="border">
              <legend className="ml-2">
                {rows.length} {kind === "image" ? "photo" : "facility"}
                {rows.length === 1 ? "" : "s"}
              </legend>
              {loadError ? (
                <p className="p-4 text-sm text-red-700">{loadError}</p>
              ) : rows.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">
                  {roomTypeId
                    ? "Nothing configured yet."
                    : "Pick a room type above to see its photos."}
                </p>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-2 py-2 text-left">#</th>
                      <th className="border px-2 py-2 text-left">
                        {kind === "image" ? "Preview" : "Icon"}
                      </th>
                      <th className="border px-2 py-2 text-left">Name</th>
                      <th className="border px-2 py-2 text-center">Status</th>
                      <th className="border px-2 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.id}>
                        <td className="border px-2 py-2 text-center">{i + 1}</td>
                        <td className="border px-2 py-2">
                          {kind === "image" ? (
                            row.image ? (
                              <img
                                src={`${getEnv("domainapi")}/storage/${String(
                                  row.image
                                ).replace(/^\/+/, "")}`}
                                alt={row.name ?? ""}
                                className="w-12 h-12 object-cover border"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )
                          ) : row.icon ? (
                            <code className="text-xs">{row.icon}</code>
                          ) : (
                            <span className="text-xs text-gray-400">default</span>
                          )}
                        </td>
                        <td className="border px-2 py-2">{row.name}</td>
                        <td className="border px-2 py-2 text-center">
                          {Number(row.status) === 1 ? "Active" : "Inactive"}
                        </td>
                        <td className="border px-2 py-2">
                          <div className="flex gap-1 justify-center">
                            <button
                              type="button"
                              title="Move up"
                              disabled={i === 0 || savingId === row.id}
                              onClick={() => move(row, -1)}
                              className="px-2 border rounded disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              title="Move down"
                              disabled={
                                i === rows.length - 1 || savingId === row.id
                              }
                              onClick={() => move(row, 1)}
                              className="px-2 border rounded disabled:opacity-30"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              className="px-2 border rounded"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === row.id}
                              onClick={() => remove(row)}
                              className="px-2 border rounded text-red-600 disabled:opacity-30"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </fieldset>
          </div>
        </div>
      </div>

      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
          <ButtonSubmit
            isprimary={false}
            onCreate={() =>
              // Send the operator back to the tab strip they came from: menu 1091 is
              // Booking Engine Setup (parent 1091), anything else is the Room Type tree.
              parent === "1091"
                ? router.replace({
                    pathname: "/module/content-room",
                    query: { parent: "1091", module: "content-room" },
                  })
                : router.replace({
                    pathname: "/master-setup/room-type/",
                    query: { parent: "1120" },
                  })
            }
            loading={false}
            label={parent === "1091" ? "Back to Room" : "Back to Room Type"}
          />
        </div>
      </div>
    </>
  );
};

export default AddView;
