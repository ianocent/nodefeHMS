import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { LayoutContext } from "../../../../context/LayoutContext";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const GLOBALURI = "/cms/profile/guest";

interface GuestWizardProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, fn, ln, ti, pn, em, gs, all) => void;
  /** Popup parent owns the modal, so it must be told to close it. */
  OnCancelSv?: () => void;
  nameinit?: string;
}

type FieldType =
  | "text"
  | "email"
  | "date"
  | "checkbox"
  | "image"
  | "select-multi";

interface GuestField {
  name: string;
  label: string;
  type: FieldType;
  cols: string;
  required?: boolean;
  disable?: boolean;
  /** Key into the `master` payload that supplies this field's options. */
  optionsKey?: string;
  /** Loaded async from /cms/countryByRegion or /cms/cityByCountry. */
  relation?: "region" | "country_id";
}

interface GuestStep {
  id: string;
  label: string;
  sub: string;
  fields: GuestField[];
}

const NAME_STEP: GuestStep = {
  id: "name",
  label: "Name",
  sub: "Title and legal name",
  fields: [
    {
      name: "guest_title",
      label: "Title",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
      required: true,
      optionsKey: "titles",
    },
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      cols: "col-span-12 lg:col-span-4",
      required: true,
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      cols: "col-span-12 lg:col-span-4",
      required: true,
    },
  ],
};

const CONTACT_STEP: GuestStep = {
  id: "contact",
  label: "Contact",
  sub: "How we reach the guest",
  fields: [
    { name: "telp", label: "Telephone", type: "text", cols: "col-span-12 lg:col-span-3" },
    { name: "mobile_phone", label: "Mobile Phone", type: "text", cols: "col-span-12 lg:col-span-3" },
    { name: "email", label: "Email", type: "email", cols: "col-span-12 lg:col-span-3" },
    { name: "fax", label: "Fax", type: "text", cols: "col-span-12 lg:col-span-3" },
  ],
};

const ADDRESS_STEP: GuestStep = {
  id: "address",
  label: "Address",
  sub: "Where the guest lives",
  fields: [
    { name: "address", label: "Address", type: "text", cols: "col-span-12" },
    {
      name: "region",
      label: "Region",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
      optionsKey: "regions",
      relation: "region",
    },
    {
      name: "country_id",
      label: "Country",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
      optionsKey: "countries",
      relation: "country_id",
    },
    {
      name: "city_id",
      label: "City",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
    },
    { name: "postal_code", label: "Postal Code", type: "text", cols: "col-span-12 lg:col-span-6" },
    {
      name: "car_reg_number",
      label: "Car Registration Number",
      type: "text",
      cols: "col-span-12 lg:col-span-6",
    },
  ],
};

const DOCUMENT_STEP: GuestStep = {
  id: "document",
  label: "ID Document",
  sub: "Identity used at check-in",
  fields: [
    {
      name: "card_type",
      label: "NRIC",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
      optionsKey: "nrics",
    },
    { name: "card_number", label: "Insert ID", type: "text", cols: "col-span-12 lg:col-span-5" },
    { name: "card_expiry", label: "ID Expiry", type: "date", cols: "col-span-12 lg:col-span-3" },
    { name: "image", label: "Upload Identity", type: "image", cols: "col-span-12" },
  ],
};

const PROFILE_STEP: GuestStep = {
  id: "profile",
  label: "Profile",
  sub: "Status, nationality and subscription",
  fields: [
    {
      name: "gender",
      label: "Gender",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
      optionsKey: "genders",
    },
    {
      name: "nationality_id",
      label: "Nationality",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
      optionsKey: "countries",
    },
    {
      name: "birth_of_date",
      label: "DOB",
      type: "date",
      cols: "col-span-12 lg:col-span-4",
      // PUT /guests/:id requires it (Laravel parity: 'birth_of_date' =>
      // 'required|date'), while POST /guests does not — so it is only enforced
      // when editing. `isStepValid` skips the check for creates.
      required: true,
    },
    {
      name: "guest_status",
      label: "Status",
      type: "select-multi",
      cols: "col-span-12 lg:col-span-4",
      optionsKey: "statusGuest",
    },
    { name: "status", label: "Active", type: "checkbox", cols: "col-span-6 lg:col-span-2" },
    { name: "blacklist", label: "Blacklist", type: "checkbox", cols: "col-span-6 lg:col-span-2" },
    {
      name: "is_subscribe",
      label: "Subscribe",
      type: "checkbox",
      cols: "col-span-6 lg:col-span-2",
    },
    { name: "short_code", label: "Short Code", type: "text", cols: "col-span-6 lg:col-span-2" },
    { name: "stay", label: "Guest Stay", type: "text", cols: "col-span-6 lg:col-span-2", disable: true },
  ],
};

const FULL_STEPS: GuestStep[] = [
  NAME_STEP,
  CONTACT_STEP,
  ADDRESS_STEP,
  DOCUMENT_STEP,
  PROFILE_STEP,
];

const contentVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 0, x: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.16 } },
};

const GuestWizard = (props: GuestWizardProps) => {
  const { isview = false, isPopup = false, ActionSv, OnCancelSv, nameinit } = props;

  // A popup is the reservation/front-desk quick flow: title + name only, then
  // "Save & Close". The standalone profile page runs the full 5-step wizard.
  const steps = useMemo(() => (isPopup ? [NAME_STEP] : FULL_STEPS), [isPopup]);

  const router = useRouter();
  const layout = useContext(LayoutContext);
  const pathname = usePathname();
  const { canCreate, canUpdate } = useFormPermission(62);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const [loading, setloading] = useState(false);
  const [step, setStep] = useState(0);
  const [idusr, setidusr] = useState("0");
  const [view, setview] = useState("0");
  const [parent, setparent] = useState("0");
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataMaster, setDataMaster] = useState<any>();
  const [relOptions, setRelOptions] = useState<Record<string, any[]>>({});
  const [serverError, setServerError] = useState<string>("");

  const isCreate = idusr === "0";
  const currentStep = steps[step];

  useEffect(() => {
    if (nameinit) {
      setData((prev: any) => ({ ...prev, first_name: nameinit }));
    }
  }, []);

  /**
   * `source` is the field the user just picked; `target` is the dependent
   * dropdown that gets repopulated. Selecting a region reloads the country
   * list, selecting a country reloads the city list.
   *
   * An empty source means "no filter yet": the reference treats
   * `region=all|undefined|null` as *every* country, so the Country dropdown is
   * populated on load instead of waiting for a region pick.
   */
  const loadRelation = async (
    source: "region" | "country_id",
    target: "country_id" | "city_id",
    value: any,
  ) => {
    try {
      const uri =
        source === "region"
          ? "/cms/countryByRegion?region=" + (value ?? "all")
          : "/cms/cityByCountry?country=" + value;
      if (source === "country_id" && (value === undefined || value === null || value === "")) {
        setRelOptions((prev) => ({ ...prev, city_id: [] }));
        return;
      }
      const resp: any = await FetchData(
        uri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (resp.code == 200 && Array.isArray(resp.data)) {
        setRelOptions((prev) => ({ ...prev, [target]: resp.data }));
      }
    } catch (error) {
      /* dropdown stays empty — not worth surfacing */
    }
  };

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    setServerError("");
    if (type === "select-multi") {
      if (name === "region") {
        // Narrow the country list to the new region; empty selection falls back
        // to "all" rather than leaving the user with nothing to pick.
        loadRelation("region", "country_id", e?.value ?? "all");
        // Region changed, so the previously chosen country/city no longer hold.
        setData({ ...dataval, region: e, country_id: null, city_id: null });
        return;
      }
      if (name === "country_id") {
        loadRelation("country_id", "city_id", e?.value);
        setData({ ...dataval, country_id: e, city_id: null });
        return;
      }
      setData({ ...dataval, [name as string]: e });
    } else if (type === "image") {
      setData({ ...dataval, [name as string]: e });
    } else if (type === "checkbox") {
      if (name === "blacklist") {
        // Blacklist is modelled as a guest-status pick, so the two stay in sync.
        setData({
          ...dataval,
          blacklist: e.target.checked,
          guest_status: e.target.checked
            ? dataMaster?.statusBlacklist?.[0]
            : dataMaster?.statusGuest?.[0],
        });
      } else {
        setData({ ...dataval, [name as string]: e.target.checked });
      }
    } else {
      if (e.target.name === "first_name" || e.target.name === "last_name") {
        setData({ ...dataval, [e.target.name]: e.target.value.toUpperCase() });
      } else {
        setData({ ...dataval, [e.target.name]: e.target.value });
      }
    }
  };

  const loadForm = async (id: any) => {
    try {
      const uri = id == 0 ? GLOBALURI + "/create" : GLOBALURI + "/" + id + "/update";
      const resp: any = await FetchData(
        uri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      // `master` arrives as response meta on both create and edit, but older
      // builds nested it under `data`. Accept either so the option lists can
      // never silently come back empty.
      const master = resp?.master ?? resp?.data?.master;
      const row = resp?.data ?? {};
      if (!resp?.master && resp?.data?.master) {
        const { master: _drop, ...rest } = resp.data;
        Object.assign(row, rest);
      }

      setDataMaster(master);
      const base = {
        ...row,
        statusBlacklist: master?.statusBlacklist,
      };

      if (id == 0) {
        const seeded = { ...base, guest_status: master?.statusGuest?.[0] };
        setData((prev: any) => ({ ...prev, ...seeded }));
        setDataEd(seeded);
      } else {
        setData((prev: any) => ({ ...prev, ...base }));
      }

      // Pre-load the dependent dropdowns. Country is loaded unfiltered (the
      // reference maps region "all" to every country) so the dropdown is never
      // empty on open; picking a region narrows it. City needs a country.
      loadRelation("region", "country_id", row?.region?.value ?? "all");
      if (row?.country_id?.value) {
        loadRelation("country_id", "city_id", row.country_id.value);
      }
    } catch (error) {
      setServerError("Failed to load the guest form.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idreq = params.get("data");
    setview(params.get("view") ?? "0");

    if (isPopup) {
      setidusr("0");
      loadForm(0);
      return;
    }

    setparent(params.get("parent") ?? "0");
    setidusr(idreq ?? "0");
    loadForm(idreq ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Value handed to the input. Checkboxes need a real boolean: the edit
   * endpoint returns `status` as `{ value, label }`, and passing that object
   * straight to `checked` makes React coerce it (always truthy), so the toggle
   * shows the wrong state and the next save flips it.
   */
  const fieldValue = (field: GuestField) => {
    const raw =
      dataval?.[field.name] !== undefined && dataval?.[field.name] !== null
        ? dataval[field.name]
        : datavaled?.[field.name] ?? "";
    if (field.type === "checkbox") {
      if (typeof raw === "boolean") return raw;
      if (raw && typeof raw === "object" && "value" in raw) return !!raw.value;
      return raw === 1 || raw === "1" || raw === "true";
    }
    return raw;
  };

  const isBlank = (value: any) =>
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (typeof value === "object" && Object.keys(value ?? {}).length === 0);

  // Only what the current step needs to be filled, so Next is never blocked by
  // a field the user has not even reached yet.
  const isStepValid = () => {
    for (const field of currentStep.fields) {
      if (!field.required) continue;
      if (field.name === "birth_of_date" && isCreate) continue;
      if (isBlank(fieldValue(field))) return false;
    }
    return true;
  };

  const handleNext = () => isStepValid() && step < steps.length - 1 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);

  const transformData = (data: any) => {
    const newData = { ...data };
    // Selects are stored as { value, label } everywhere in this codebase; the
    // API only wants the raw column value.
    ["card_type", "status_profile", "gender", "nationality_id", "city_id", "country_id", "region"].forEach(
      (key) => {
        if (newData[key] && newData[key].value !== undefined) {
          newData[key] = newData[key].value;
        }
      }
    );
    // Guest title / status are stored in `model_has_types`, so they must be
    // reduced to their raw type id too — otherwise the backend receives an
    // object and skips the pivot write.
    ["guest_title", "guest_status"].forEach((key) => {
      if (newData[key] && newData[key].value !== undefined) {
        newData[key] = newData[key].value;
      }
    });
    // `status` is a 0/1 column. A checkbox that never fired leaves the edit
    // endpoint's `{ value, label }` pair behind, which the API would read as
    // truthy-by-object; send a definite 0/1 instead.
    if (newData.status !== undefined) {
      const s = newData.status;
      newData.status =
        typeof s === "object" && s !== null ? (s.value ? 1 : 0) : s ? 1 : 0;
    }
    if (newData.blacklist !== undefined) {
      newData.blacklist = newData.blacklist ? 1 : 0;
    }
    return newData;
  };

  const OnSave = async () => {
    if (!isStepValid()) return;
    setloading(true);
    setServerError("");
    try {
      const isUpdate = idusr !== "0";
      const urisave = isUpdate ? GLOBALURI + "/" + idusr : GLOBALURI;
      const mth = isUpdate ? "PUT" : "POST";
      const aesraw = GetEncrypt(JSON.stringify(transformData(dataval)));
      const redirects = isPopup ? "" : `${pathname}?parent=${parent}`;

      const saveprocess: any = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        redirects
      );

      if (saveprocess?.code == "200" || saveprocess?.code == 200) {
        ActionSv?.(
          saveprocess?.data?.id,
          saveprocess?.data?.first_name,
          saveprocess?.data?.last_name,
          saveprocess?.data?.guest_title?.label,
          saveprocess?.data?.mobile_phone,
          saveprocess?.data?.email,
          saveprocess?.data?.guest_status,
          saveprocess?.data
        );
      } else if (saveprocess?.errors) {
        setServerError(
          Object.values(saveprocess.errors)
            .flat()
            .join(" ")
        );
      } else {
        setServerError(saveprocess?.message ?? "Failed to save the guest profile.");
      }
    } catch (error) {
      setServerError("Failed to save the guest profile.");
    } finally {
      setloading(false);
    }
  };

  const onCancel = () => {
    if (isPopup) {
      // The parent owns the modal and closes it; reset first so reopening the
      // popup starts from a clean form instead of the half-typed values.
      setData({ ...datavaled, statusBlacklist: dataMaster?.statusBlacklist });
      setServerError("");
      setStep(0);
      OnCancelSv?.();
      return;
    }
    router.replace({ pathname: window.location.pathname, query: { parent: parent } });
  };

  const renderField = (field: GuestField) => {
    // `relation` records which OTHER dropdown this field feeds. Its own options
    // always come from `master` — region is a master list, while country and
    // city are fetched per selection.
    const options =
      field.name === "country_id"
        ? relOptions.country_id ?? []
        : field.name === "city_id"
        ? relOptions.city_id ?? []
        : dataMaster?.[field.optionsKey as string] ?? [];
    // InputMain only knows "base" / "textarea" / "select" / "select-multi" /
    // "file-image" / "image" / "checkbox" / "rich-editor". Anything else hits
    // its default branch and renders nothing — which is how the name fields
    // went missing. Plain inputs must map to "base".
    const typeInput =
      field.type === "text" || field.type === "email" || field.type === "date"
        ? "base"
        : field.type;
    const restType = field.type === "select-multi" ? "select-multi" : field.type;

    return (
      <div key={field.name} className={field.cols}>
        <InputMain
          valuename={field.name}
          typeInput={typeInput}
          error={false}
          label={field.label}
          required={field.required ?? false}
          options={options}
          rest={{
            name: field.name,
            placeholder: field.label,
            value: fieldValue(field),
            type: restType,
            disabled: field.disable,
            onChange: (e: any) => changeHandlerSrc(e, field.type, field.name),
          }}
          restArea={{
            placeholder: field.label,
            name: field.name,
            value: fieldValue(field),
            onChange: (e: any) => changeHandlerSrc(e, field.type, field.name),
          }}
          onChangeSel={(e: any) => changeHandlerSrc(e, field.type, field.name)}
          onChangeFiles={(e: any) => changeHandlerSrc(e, field.type, field.name)}
          valueSel={fieldValue(field)}
          isMulti={false}
          placeholder={field.label}
        />
      </div>
    );
  };

  // Fields this property will demand at check-in but the quick step omits.
  const pendingMandatory = (dataMaster?.mandatory_check_in ?? []).filter(
    (m: any) => !NAME_STEP.fields.some((f) => f.name === m.value)
  );

  return (
    <>
      <Seo title={"Management " + layout?.title} />

      {isview ? <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20" /> : <></>}

      <div className={isPopup ? "w-full" : "w-full max-w-6xl mx-auto py-4 px-2"}>
        {steps.length > 1 && (
          <div className="flex items-center mb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  className="flex flex-col items-center cursor-pointer shrink-0"
                  whileHover={{ scale: 1.06 }}
                  onClick={() => {
                    if (i <= step) setStep(i);
                  }}
                >
                  <motion.div
                    className={
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 " +
                      (i < step
                        ? "bg-blue-600 border-blue-600 text-white"
                        : i === step
                        ? "bg-primary border-primary/80 text-white shadow-md shadow-blue-200"
                        : "bg-white border-gray-300 text-black")
                    }
                    whileTap={{ scale: 0.95 }}
                  >
                    {i < step ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="green" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </motion.div>
                  <span
                    className={
                      "text-[10px] mt-1 font-medium whitespace-nowrap " +
                      (i <= step ? "text-primary font-bold" : "text-black")
                    }
                  >
                    {s.label}
                  </span>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 -mt-4 rounded-full overflow-hidden bg-gray-200">
                    <motion.div
                      className="h-full bg-primary"
                      initial={false}
                      animate={{ width: i < step ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-gray-200 shadow-md rounded-xl flex flex-col">
          <div className="px-6 pt-4 pb-2.5 border-b shrink-0">
            <h3 className="text-base font-bold text-gray-800">{currentStep.label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{currentStep.sub}</p>
          </div>

          <div className="px-6 py-5">
            {datavaled?.account && (
              <div className="mb-4 font-bold">Guest Acc : {datavaled.account}</div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {currentStep.fields.map(renderField)}
            </div>
          </div>

          {isPopup && pendingMandatory.length > 0 && (
            <div className="mx-6 mb-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              <div className="font-semibold">Profile will be incomplete</div>
              <div className="mt-1">
                Check-in requires: {pendingMandatory.map((m: any) => m.label).join(", ")}. Complete
                them from Profile &rarr; Guest before the guest arrives.
              </div>
            </div>
          )}

          {serverError ? (
            <div role="alert" className="mx-6 mb-2 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {serverError}
            </div>
          ) : null}

          <div className="border-t px-6 py-3 flex justify-end gap-2.5 items-center bg-gray-50 shrink-0 rounded-b-lg">
            {/* Order is always Cancel → Back → primary, matching the reservation
                wizard. Back stays visible on the first step but is disabled so
                the row does not jump around as the user advances. */}
            <ButtonSubmit onCreate={onCancel} label="Cancel" isprimary={false} loading={false} />

            {steps.length > 1 && (
              <ButtonSubmit onCreate={handleBack} label="Back" isprimary={false} disabled={step === 0} />
            )}

            {steps.length > 1 && step < steps.length - 1 ? (
              <ButtonSubmit onCreate={handleNext} label="Next" disabled={!isStepValid()} />
            ) : (
              view !== "1" &&
              (canCreate || canUpdate) && (
                <ButtonSubmit
                  isBtnAdd={canCreate || canUpdate}
                  onCreate={OnSave}
                  loading={loading}
                  disabled={!isStepValid()}
                  label={isPopup ? "Save & Close" : isCreate ? "Save" : "Update"}
                />
              )
            )}
          </div>
        </div>

        {steps.length > 1 && (
          <div className="mt-2 text-xs text-gray-500">
            Managing {layout?.title} profile. Fields marked required must be filled.
          </div>
        )}
      </div>
    </>
  );
};

export default GuestWizard;