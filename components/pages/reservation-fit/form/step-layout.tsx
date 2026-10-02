import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import InputMain from "../../../common/input/InputMain";
import TableView from "../../../common/table-edit";
import { GetNextDay } from "../../../helper";

interface StepLayoutProps {
  dataform: any[];
  setdataform: (d: any[]) => void;
  dataval: any;
  setData: (d: any) => void;
  changeHandler: (e: any, b?: any, name?: string, ismulti?: boolean, options?: any, isArray?: boolean) => void;
  changeHandlera: (e: any, b?: any, name?: string, ismulti?: boolean, options?: any, index?: number, datai?: number) => void;
  GetDataAutoComp: (word: string, uri: string, relate: any, ix: number, ia: number, ftype?: string) => Promise<void>;
  onSelecteda: (rw: any, n: any, id: any, idat: any, name: string, ix: number, ia: number) => void;
  ListTblGuest: (id: any, datI: any, name: any, ix: any, ia: any, isAdd: any) => JSX.Element;
  actAuto: string;
  setactAuto: (v: string) => void;
  businessDate: string;
  openRoom: boolean;
  load: boolean;
  datprice: any;
  printrate: any;
  isview: boolean;
  loading: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  OnSave: () => Promise<void>;
  AddReservation: () => void;
  idusr: string;
  parent: string;
  datalocal: any;
  checkbokmulti: any[];
  setcheckbokmulti: (v: any) => void;
  removeItemMulti: (item: any) => void;
  serverErrors?: { message: string; fields: Record<string, string> } | null;
}

const contentVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.16 } },
};

// Guest search + Guest details are merged into a single "Guest" step now.
const steps = [
  { id: "guest", label: "Guest" },
  { id: "reservation", label: "Reservation" },
  { id: "rate-room", label: "Rate & Room" },
  { id: "confirm", label: "Confirm" },
];

const StepLayout = (props: StepLayoutProps) => {
  const {
    dataform, dataval,
    changeHandler, changeHandlera,
    GetDataAutoComp, ListTblGuest,
    actAuto, setactAuto,
    businessDate, openRoom, load, datprice, printrate,
    loading, canCreate, canUpdate,
    OnSave, AddReservation, idusr,
    serverErrors,
  } = props;

  const [step, setStep] = useState(0);
  const totalSteps = steps.length;

  const isStepValid = () => {
    switch (step) {
      case 0:
        return !!(
          (dataval?.["first_name-guest_profile"] || dataval?.guest_profile_id) &&
          dataval?.first_name && dataval?.last_name
        );
      case 1:
        return !!(dataform[1]?.items?.[0]?.data?.[0]?.value && dataform[1]?.items?.[0]?.data?.[2]?.value);
      case 2:
        return !!(dataform[1]?.items?.[0]?.data?.[8]?.valueid && dataform[1]?.items?.[0]?.data?.[9]?.valueid);
      default:
        return true;
    }
  };

  const handleNext = () => step < totalSteps - 1 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);

  // A field counts as "already filled" (e.g. via autocomplete) so we can visually
  // de-emphasize it and let the user focus on what still needs attention.
  const isPrefilled = (name?: string) => !!name && dataval?.[name] !== undefined && dataval?.[name] !== "" && dataval?.[name] !== null;

  const renderFieldRow = (field: any, idxOverride?: number) => {
    if (field?.type == "hidden") return null;
    const fi = idxOverride ?? 0;
    const prefilled = isPrefilled(field?.name) && field?.disable;
    return (
      <div key={field?.name} className={"relative rounded-lg " + (prefilled ? "bg-gray-50" : "")}>
        <InputMain
          typeInput={
            field?.type == "text" || field?.type == "number" || field?.type == "date" || field?.type == "time"
              ? "base"
              : field?.type
          }
          error={false}
          required={field?.required ?? false}
          label={field?.label}
          rest={{
            disabled: field?.disable,
            autoComplete: field?.isAutoComp ? "off" : "on",
            name: field?.name,
            placeholder: field?.placeholder ?? field?.label,
            value: dataval?.[field?.name] ?? field?.value ?? "",
            type: field?.type,
            onChange: (e: any) => changeHandler(e, field?.type, field?.name),
            onKeyUp: (e: any) => {
              if (field?.isAutoComp) {
                if (e.target?.value?.length >= 3) {
                  setactAuto("0" + fi);
                  GetDataAutoComp(e.target?.value, field?.uri, field?.relate, fi, -1);
                } else {
                  setactAuto("-1");
                }
              }
            },
            onClick: () => {
              if (field?.isAutoComp && field?.name == "name-company") {
                setactAuto("0" + fi);
                GetDataAutoComp("A", field?.uri, field?.relate, fi, -1);
              }
            },
            onFocus: () => {
              if (field?.relate) {
                setactAuto("1" + fi);
                GetDataAutoComp("", field?.uri, field?.relate, fi, -1);
              }
            },
          }}
          restArea={{
            placeholder: field?.label,
            name: field?.name,
            value: dataval?.[field?.name] ?? "",
            onChange: (e: any) => changeHandler(e, field?.type, field?.name),
          }}
          onChangeSel={(e: any) => changeHandler(e, field?.type, field?.name, field?.ismulti, field?.options)}
          valueSel={dataval?.[field?.name]}
          options={field?.options}
          isMulti={field?.ismulti}
          isAll={field?.isAll}
          valuename={field?.name}
          colspan={field?.colcheckbox}
          valMulti={printrate}
          disabled={field?.disable}
        />
        {field?.isAutoComp && actAuto == "0" + fi ? (
          <div className="relative z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {ListTblGuest(field?.idpost, 0, field?.name, fi, -1, field?.AdduRi ?? false)}
          </div>
        ) : null}
      </div>
    );
  };

  const renderReservationField = (rw: any, index: number, i: number) => {
    if (rw?.type == "hidden") return null;
    const minVal = rw?.name == "check_out_date"
      ? GetNextDay(dataform[1].items[i].data[0].value, 1)
      : i > 0 && rw?.name == "check_in_date"
      ? GetNextDay(dataform[1].items[i - 1].data[2].value, 0)
      : rw?.name == "adult" ? 1
      : rw?.type == "number" ? 0
      : i == 0 && rw?.name == "check_in_date" ? businessDate
      : "";
    return (
      <div key={rw?.name + "-" + index} className="relative">
        <InputMain
          typeInput={
            rw?.type == "text" || rw?.type == "number" || rw?.type == "date" || rw?.type == "time"
              ? "base"
              : rw?.type
          }
          error={false}
          required={rw?.required ?? false}
          label={rw?.label}
          rest={{
            autoComplete: rw?.isAutoComp ? "off" : "on",
            name: rw?.name,
            placeholder: rw?.placeholder ?? rw?.label,
            value: rw?.value,
            type: rw?.type,
            min: minVal,
            onChange: (e: any) => changeHandlera(e, rw?.type, rw?.name, false, {}, i, index),
            onKeyUp: (e: any) => {
              if (rw?.isAutoComp) {
                if (e.target?.value?.length > 1) {
                  setactAuto("1" + index + "-" + i);
                  GetDataAutoComp(e.target?.value, rw?.uri, rw?.relate, index, i);
                } else {
                  setactAuto("-1");
                }
              }
            },
            onFocus: () => {
              if (rw?.isAutoComp) {
                setactAuto("1" + index + "-" + i);
                GetDataAutoComp("", rw?.uri, rw?.relate, index, i);
              }
            },
          }}
          restArea={{
            placeholder: rw?.label,
            name: rw?.name,
            value: rw?.value,
            onChange: (e: any) => changeHandlera(e, rw?.type, rw?.name, false, {}, i, index),
          }}
          onChangeSel={(e: any) => changeHandlera(e, rw?.type, rw?.name, rw?.ismulti, rw?.options, i, index)}
          valueSel={rw?.ismulti ? dataval?.[rw?.name + "_ori"] : dataval?.[rw?.name]}
          options={rw?.options}
          isMulti={rw?.ismulti}
          isAll={rw?.isAll}
          valuename={rw?.name}
          colspan={rw?.colcheckbox}
        />
        {rw?.isAutoComp && actAuto == "1" + index + "-" + i ? (
          <div className="relative z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {ListTblGuest(rw?.idpost, 1, rw?.name, index, i, rw?.AdduRi ?? false)}
          </div>
        ) : null}
      </div>
    );
  };

  const renderAdditionalField = (row: any, index: number) => {
    if (row?.type == "hidden") return null;
    return (
      <div key={row?.name + "-" + index} className="relative">
        <InputMain
          typeInput={
            row?.type == "text" || row?.type == "number" || row?.type == "date" || row?.type == "time"
              ? "base"
              : row?.type
          }
          error={false}
          required={row?.required ?? true}
          label={row?.label}
          rest={{
            name: row?.name,
            placeholder: row?.placeholder ?? row?.label,
            value: dataval?.[row?.name],
            type: row?.type,
            onChange: (e: any) => changeHandler(e, row?.type, row?.name),
            onKeyUp: (e: any) => {
              if (row?.isAutoComp) {
                if (e.target?.value?.length > 1) {
                  setactAuto("2" + index);
                  GetDataAutoComp(e.target?.value, row?.uri, row?.relate, index, 0);
                } else {
                  setactAuto("-1");
                }
              }
            },
          }}
          restArea={{
            placeholder: row?.label,
            name: row?.name,
            value: dataval?.[row?.name],
            onChange: (e: any) => changeHandler(e, row?.type, row?.name),
          }}
          onChangeSel={(e: any) => changeHandler(e, row?.type, row?.name, row?.ismulti, row?.options)}
          valueSel={dataval?.[row?.name + "_ori"]}
          options={row?.options}
          isMulti={row?.ismulti}
          isAll={row?.isAll}
          valuename={row?.name}
        />
        {row?.isAutoComp && actAuto == "2" + index ? (
          <div className="relative z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {ListTblGuest(row?.idpost, 2, row?.name, index, -1, row?.AdduRi ?? false)}
          </div>
        ) : null}
      </div>
    );
  };

  const renderCheckboxField = (fieldIndex: number = 11) => {
    const field = dataform[0].data?.[fieldIndex];
    if (!field || field?.type == "hidden") return null;
    return (
      <div className="relative">
        <InputMain
          typeInput="checkbox"
          error={false}
          required={field?.required ?? false}
          label={field?.label}
          rest={{
            autoComplete: "on",
            name: field?.name,
            placeholder: field?.label,
            value: field?.value,
            type: field?.type,
          }}
          onChangeSel={(e: any) => changeHandler(e, field?.type, field?.name, field?.ismulti, field?.options)}
          valueSel={dataval?.[field?.name]}
          options={field?.options}
          isMulti={field?.ismulti}
          isAll={field?.isAll}
          valuename={field?.name}
          colspan={field?.colcheckbox}
          valMulti={printrate}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-2 h-[calc(95vh-100px)] rounded-md flex flex-col">
      {/* Step indicator */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <motion.div
                className="flex flex-col items-center cursor-pointer shrink-0"
                whileHover={{ scale: 1.06 }}
                onClick={() => { if (i <= step) setStep(i); }}
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
                <span className={"text-[10px] mt-1 font-medium whitespace-nowrap " + (i <= step ? "text-primary font-bold" : "text-black")}>
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
      </div>

      {/* Card - fixed height, no page scroll */}
      <div className="bg-white border border-gray-200 shadow-md rounded-xl flex flex-col flex-1 min-h-0">
        <div className="px-6 pt-4 pb-2.5 border-b shrink-0">
          <h3 className="text-base font-bold text-gray-800">
            {step === 0 && "Guest"}
            {step === 1 && "Reservation Info"}
            {step === 2 && "Rate & Room"}
            {step === 3 && "Confirmation"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {step === 0 && "Search or select a guest — details auto-fill and can be edited"}
            {step === 1 && "Set check-in / check-out dates and guest count"}
            {step === 2 && "Pick rate code, room type, and assign a room"}
            {step === 3 && "Final details and price summary"}
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
              className="h-full"
            >
              {/* STEP 0 - Guest search + Guest details, side by side */}
              {step === 0 && (
                <div className="h-full grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-2 p-5 overflow-y-auto border-r border-gray-100 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Find Guest</h4>
                    {renderFieldRow(dataform[0].data?.[0], 0)}
                    {renderFieldRow(dataform[0].data?.[1], 1)}
                    {renderFieldRow(dataform[0].data?.[2], 2)}
                  </div>

                  <div className="lg:col-span-3 p-5 overflow-y-auto space-y-3">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Guest Details</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {renderFieldRow(dataform[0].data?.[3], 3)}
                      {renderFieldRow(dataform[0].data?.[4], 4)}
                      {renderFieldRow(dataform[0].data?.[5], 5)}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {renderFieldRow(dataform[0].data?.[6], 6)}
                      {renderFieldRow(dataform[0].data?.[7], 7)}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {renderFieldRow(dataform[0].data?.[8], 8)}
                      {renderFieldRow(dataform[0].data?.[9], 9)}
                    </div>
                    {renderFieldRow(dataform[0].data?.[10], 10)}
                  </div>
                </div>
              )}

              {/* STEP 1 - Reservation info */}
              {step === 1 && (
                <div className="p-6 h-full overflow-y-auto flex flex-col justify-center">
                  <div className="max-w-6xl w-full mx-auto space-y-5">
                    <div className="grid grid-cols-4 gap-4">
                      {dataform[1]?.items?.[0]?.data?.slice(0, 4).map((rw: any, idx: number) =>
                        renderReservationField(rw, idx, 0)
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {dataform[1]?.items?.[0]?.data?.slice(4, 8).map((rw: any, idx: number) =>
                        renderReservationField(rw, idx + 4, 0)
                      )}
                    </div>
                  </div>
                  <div className="w-full pt-4">
                    {renderCheckboxField(11)}
                  </div>
                  <div className="max-w-3xl w-full mx-auto">
                    {dataform[1]?.items?.length > 1 && (
                      <div className="flex gap-2 flex-wrap">
                        {dataform[1].items.map((_: any, i: number) => (
                          <div key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">
                            Room {i + 1}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2 - Rate & Room: form left, available rooms panel right (side-by-side, no page scroll) */}
              {step === 2 && (
                <div className="h-full grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-2 p-6 overflow-y-auto border-r border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {dataform[1]?.items?.[0]?.data?.slice(8, 10).map((rw: any, idx: number) =>
                        renderReservationField(rw, idx + 8, 0)
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {dataform[1]?.items?.[0]?.data?.slice(10, 12).map((rw: any, idx: number) =>
                        renderReservationField(rw, idx + 10, 0)
                      )}
                    </div>
                    <div className="flex gap-3">
                      {dataform[1]?.items?.[0]?.data?.slice(12, 14).map((rw: any, idx: number) =>
                        renderReservationField(rw, idx + 12, 0)
                      )}
                    </div>
                    {/* untuk method ini sepertinya ga perlu, karena ini untuk quick reservation :) */}
                    {/* <ButtonSubmit
                      isBtnAdd={canCreate || canUpdate}
                      label="Add Data Reservation"
                      onCreate={AddReservation}
                    /> */}
                  </div>

                  <div className="lg:col-span-3 flex flex-col min-h-0 bg-gray-50/60">
                    <div className="px-5 pt-6 shrink-0">
                      <h4 className="text-sm font-semibold text-blue-700">Available Rooms</h4>
                    </div>
                    {dataval?.check_in_date && dataval?.check_out_date && load && openRoom ? (
                      <div className="flex-1 min-h-0 overflow-y-auto px-5">
                        <TableView
                          uri="/cms/reservation/available-room"
                          queryString={
                            "&check_in_date=" + dataval?.check_in_date +
                            "&check_out_date=" + dataform[1]?.items?.[dataform[1]?.items?.length - 1]?.data?.[2]?.value
                          }
                          groups=""
                          isEditTable={false}
                          isTitle={false}
                          isDeleted={false}
                          isBtnAdd={false}
                          isPageing={false}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-sm text-gray-400 px-5">
                        Select check-in / check-out dates to see room availability
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 - Confirmation: form left, price summary sticky right */}
              {step === 3 && (
                <div className="h-full grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-3 p-6 overflow-y-auto space-y-4 border-r border-gray-100">
                    {/* Field order in dataform[2].data is:
                        0 booking_agent, 1 contact_person, 2-5 market_segment_1..4,
                        6 source, 7 booking_no, 8 promo_code.
                        The old slice(8, 10) therefore picked up promo_code alone,
                        leaving Booking No stranded on the row above. */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {dataform[2]?.data?.slice(0, 4).map((row: any, idx: number) =>
                        renderAdditionalField(row, idx)
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {dataform[2]?.data?.slice(4, 7).map((row: any, idx: number) =>
                        renderAdditionalField(row, idx + 4)
                      )}
                    </div>
                    {/* Booking No (7) + Promo Code (8) on one row. */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {dataform[2]?.data?.slice(7, 9).map((row: any, idx: number) =>
                        renderAdditionalField(row, idx + 7)
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-blue-50/60 p-5 overflow-y-auto">
                    {datprice?.data?.charge ? (
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Price Summary</h4>
                        {datprice?.data?.date?.map((row: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm py-0.5">
                            <span className="text-gray-600">{row?.date}</span>
                            <span className="font-medium">{row?.charge}</span>
                          </div>
                        ))}
                        <div className="border-t my-2 border-blue-200" />
                        {datprice?.data?.charge?.map((row: any, idx: number) => (
                          <div key={"c-" + idx} className="flex justify-between text-sm py-0.5">
                            <span className="text-gray-600">{row?.label}</span>
                            <span className="font-bold text-gray-800">{row?.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-gray-400">
                        Price summary will appear here
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Server-side validation errors — names the offending field instead of
            a bare "Validation failed" toast. Cleared on next edit by the form. */}
        {serverErrors ? (
          <div
            role="alert"
            className="mx-6 mb-2 shrink-0 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <div className="font-semibold">
              {serverErrors.message.split("\n")[0]}
            </div>
            {Object.keys(serverErrors.fields).length > 0 ? (
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                {Object.entries(serverErrors.fields).map(([field, msg]) => (
                  <li key={field}>
                    <span className="font-medium">{field}</span> — {msg}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {/* Footer - always visible, never scrolls away */}
        <div className="border-t px-6 py-3 flex justify-end gap-2.5 items-center bg-gray-50 shrink-0 rounded-b-lg">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {step > 0 ? (
              <ButtonSubmit onCreate={handleBack} label="Back" isprimary={false} />
            ) : (
              <ButtonSubmit
                onCreate={() => { if (typeof window !== "undefined") window.history.back(); }}
                label="Cancel"
                isprimary={false}
              />
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {step < totalSteps - 1 ? (
              <ButtonSubmit onCreate={handleNext} label="Next" disabled={!isStepValid()} />
            ) : (
              <ButtonSubmit
                isBtnAdd={canCreate || canUpdate}
                onCreate={() => OnSave()}
                loading={loading}
                label={idusr != "0" ? "Update" : "Save"}
              />
            )}
          </motion.div>
        </div>
      </div>

      {dataval?.masterdata?.legend && (
        <div className="flex gap-2 overflow-x-auto mt-2 shrink-0">
          {dataval?.masterdata?.legend.map((rw: any) => (
            <div key={rw?.label} className={rw?.color + " px-3 py-1 text-xs rounded-full shrink-0"}>{rw?.label}</div>
          ))}
        </div>
      )}
    </div>
  );
};
export default StepLayout;