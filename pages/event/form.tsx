import React, { useContext, useEffect, useState } from "react";
import ButtonSubmit from "../../components/common/button/ButtonSubmit";
import ButtonCreate from "../../components/common/button/ButtonCreate";
import InputBase from "../../components/common/input/InputBase";
import MultiSelectBAse from "../../components/common/input/MultiSelectBase";
import { forEach } from "jszip";
import RichEditorBase from "../../components/common/input/RichEditorBase";
import TextareaBase from "../../components/common/input/TextareaBase";
import FileInputBase from "../../components/common/input/FileInputBase";
import { FetchData, GetDecrypt, GetEncrypt, GetQueryStr } from "../../components/helper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import TableView from "../../components/common/table-edit";
import InputField from "../../components/common/input/SelectAsycn";
import LayoutComponent from "../../components/common/layout/LayoutComponent";
import { env } from "../../next.config";
import { useFormPermission } from "../../hooks/useFormPermission";

interface AddProps {
  data: any;
}
const ModuleAddPage = (props: AddProps) => {
  const { data } = props;
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = JSON.parse(GetDecrypt(isLogin ?? ""));
  const routers = useRouter();
  const [loading, setloading] = useState(false);
  const [dataForm, setDataForm] = useState(props.data?.form?.list);
  const [activeList, setActiveList] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const { canCreate, canUpdate } = useFormPermission(1159);
  const changeValue = (
    val,
    curList,
    curStep,
    curInput,
    allLang,
    target = [],
    replaceVal = "none",
    options = false
  ) => {
    let tempForm = [...dataForm];

    if (allLang) {
      dataForm?.forEach((item, index) => {
        tempForm[index].step[curStep].input[curInput].value = val;
      });
    } else {
      tempForm[curList].step[curStep].input[curInput].value = val;
    }
    target?.forEach((item, index) => {
      let valTarget = val;

      if (replaceVal == "SpaceToStrip") {
        valTarget = val.replaceAll(" ", "-");
      }
      if (options) {
        valTarget = val.triggerValue[index];
      }

      if (allLang) {
        dataForm?.forEach((itm, i) => {
          tempForm[i].step[curStep].input[item].value = valTarget;
        });
      } else {
        tempForm[curList].step[curStep].input[item].value = valTarget;
      }
    });
    setDataForm(tempForm);
  };
  const handleDownload = async (item: any) => {
    try {
      const response = await fetch(env.uriApi + item.value, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${datalocal?.data?.access_token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = item.label + `-${GetQueryStr("data")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the report. Please try again.");
    }
  };
  const onSaveData = async () => {
    try {
      const mth = GetQueryStr("data") ? "PUT" : "POST";
      const isFormData = props.data?.form?.isFormData ?? false;

      const newDataForm = [...dataForm];
      const rawJson = JSON.stringify({ form: newDataForm });

      const aesraw = GetEncrypt(rawJson);

      const formData = new FormData();
      formData.append("datajson", aesraw);

      if (isFormData) {
        // Handle if needed
      }
      let uriRedirect = window.location.pathname;
      if (GetQueryStr("tblid")) {
        uriRedirect = "";
      }
      const saveprocess = await FetchData(
        props.data?.form?.action,
        mth,
        isFormData ? formData : aesraw,
        false,
        datalocal?.data?.access_token,
        routers,
        uriRedirect
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        if (GetQueryStr("tblid")) {
          window.location.assign(
            "/module/" +
              GetQueryStr("urlrefere") +
              "?data=" +
              GetQueryStr("tblid").split("-")[1] +
              "&step=section"
          );
        }
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    if (GetQueryStr("step")) {
      dataForm[activeList]?.step?.map((rw, i) => {
        if (rw?.name.toLowerCase() == GetQueryStr("step").toLowerCase()) {
          setActiveStep(i);
        }
      });
    }
  }, []);

  useEffect(() => {
    const currentStepName = dataForm[activeList]?.step[activeStep]?.name ?? activeStep;
    routers.replace({
      pathname: window.location.pathname,
      query: {
        ...routers.query,
        step: currentStepName,
      },
    });
  }, [activeStep]);

  useEffect(() => {
    const currentStepInputs = dataForm?.[activeList]?.step?.[activeStep]?.input || [];
    const venueInput = currentStepInputs.find(f => f.name === "venue_id");
    const layoutInput = currentStepInputs.find(f => f.name === "layout_id");

    const venueId =
      typeof venueInput?.value === "object" ? venueInput?.value?.value : venueInput?.value;
    const layoutId =
      typeof layoutInput?.value === "object" ? layoutInput?.value?.value : layoutInput?.value;

    if (venueId && layoutId) {
      const capacityInput = currentStepInputs.find(f => f.name === "max_capacity");
      const inputCapacity = capacityInput ? Number(capacityInput.value) : null;

      getMaxCapacity(venueId, layoutId, inputCapacity);
    }
  }, [
    activeList,
    activeStep,
    dataForm?.[activeList]?.step?.[activeStep]?.input?.find(f => f.name === "venue_id")?.value,
    dataForm?.[activeList]?.step?.[activeStep]?.input?.find(f => f.name === "layout_id")?.value,
    dataForm?.[activeList]?.step?.[activeStep]?.input?.find(f => f.name === "max_capacity")?.value
  ]);

  const [capacityMapping, setCapacityMapping] = useState({
    pax: null,
    capacity_value: null,
  });

  const getMaxCapacity = async (venueId, layoutId, inputCapacity = null) => {
    try {
      const res = await FetchData(
        `/cms/event-package/get-max-capacity?venue_id=${venueId}&layout_id=${layoutId}`,
        "GET",
        null,
        false,
        datalocal?.data?.access_token,
        routers,
        "",
        true
      );

      if (res.code === 200) {
        const newDataForm = [...dataForm];
        const currentStepInputs = newDataForm?.[activeList]?.step?.[activeStep]?.input || [];
        const paxInputIndex = currentStepInputs.findIndex(f => f.name === "pax");

        if (paxInputIndex !== -1) {
          newDataForm[activeList].step[activeStep].input[paxInputIndex].value = res.data.pax || "";
          setDataForm(newDataForm);

          setCapacityMapping(prev => ({
            ...prev,
            pax: res.data.pax || "",
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching capacity:", err);
    }
  };
  const eventEditSteps = [
    "Event General",
    "Event Items",
    "Event Instructions",
    "Event Deposit",
  ];

  /**
   * Convert backend col class (e.g. "col-span-4") into mobile-first responsive class.
   * - Mobile  : always full width (col-span-12)
   * - md+     : use the original backend value
   *
   * Backend sends plain "col-span-X" without breakpoint prefix.
   * We remap it to "col-span-12 md:col-span-X" so fields are
   * never squeezed on small screens.
   *
   * If backend already includes a breakpoint prefix we leave it untouched.
   * If col is undefined/empty we fall back to full width.
   */
  const toResponsiveCol = (col?: string): string => {
    if (!col) return "col-span-12";
    // Already has a breakpoint prefix — backend is already responsive, trust it
    if (col.includes("md:") || col.includes("sm:") || col.includes("lg:")) return col;
    // Extract every "col-span-X" token and prefix it with "md:"
    const mdVersion = col
      .split(" ")
      .map((cls) => (cls.startsWith("col-span-") ? `md:${cls}` : cls))
      .join(" ");
    return `col-span-12 ${mdVersion}`;
  };

  return (
    <>
      <div
        key={window.location.pathname}
        className="grid grid-cols-1 md:grid-cols-12 h-fit gap-4"
      >
        {window.location.pathname.includes("event-list") &&
        !!GetQueryStr("data") && (
          <div className="col-span-1 md:col-span-12 border-b border-gray-200 mt-2 flex flex-wrap gap-1 items-center overflow-x-auto">
            {eventEditSteps.map((label, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-all duration-200 whitespace-nowrap
                  ${
                    activeStep === index
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300"
                  }`}
              >
                {label}
              </button>
            ))}
            {/* CHANGED: relative on mobile, absolute on lg+ */}
            <div className="ml-auto lg:absolute lg:right-10">
              <MultiSelectBAse
                disabled={false}
                error={null}
                label=""
                required={false}
                placeholder="Print"
                options={[
                  {
                    label: "Event Calculation",
                    value: `/cms/report/event/${GetQueryStr("data")}/event-breakdown-calculation`,
                  },
                  {
                    label: "Banquet Event Order",
                    value: `/cms/report/event/${GetQueryStr("data")}/banquet-event-order`,
                  },
                ]}
                onChange={(e) => handleDownload(e)}
                ismulti={false}
              />
            </div>
          </div>
        )}
        <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-12 h-fit gap-4">
          <div className="col-span-1 md:col-span-12">
            <fieldset className="border">
              <div className="grid grid-cols-12 h-fit gap-3 sm:gap-4 ml-2 mb-4 mt-4 mr-2">
                {dataForm[activeList]?.step[activeStep]?.input?.map((rw, i) => (
                  <>
                    <div key={rw?.uri} className={toResponsiveCol(rw?.col)}>
                      {(rw?.type === "text" ||
                    rw?.type === "number" ||
                    rw?.type === "autocomplete" ||
                    rw?.type === "date" ||
                    rw?.type === "datetime" ||
                    rw?.type === "datetime-local") && (
                    <InputBase
                      error={false}
                      label={rw?.label}
                      onchangeCus={(e) => changeValue(e, activeList, activeStep, i, rw?.allLanguage)}
                      rest={{
                        value: rw?.value,
                        onChange: (e) => {
                          const val = e.target.value;
                          changeValue(val, activeList, activeStep, i, rw?.allLanguage);

                          if (rw?.name === "max_capacity") {
                            const newVal = Number(val);
                            setCapacityMapping(prev => ({
                              ...prev,
                              capacity_value: newVal,
                            }));
                            const currentStepInputs = dataForm?.[activeList]?.step?.[activeStep]?.input || [];
                            const venueInput = currentStepInputs.find(f => f.name === "venue_id");
                            const layoutInput = currentStepInputs.find(f => f.name === "layout_id");
                            const venueId = typeof venueInput?.value === "object" ? venueInput?.value?.value : venueInput?.value;
                            const layoutId = typeof layoutInput?.value === "object" ? layoutInput?.value?.value : layoutInput?.value;

                            if (venueId && layoutId) {
                              getMaxCapacity(venueId, layoutId, newVal);
                            }
                          }
                        },
                        type: rw?.type,
                        placeholder: rw?.placeholder ?? "Input " + rw?.label,
                      }}
                      required={rw?.mandatory ?? false}
                      clasCus={rw?.classCustome ?? " "}
                      widthCus={rw?.widthCustome ?? " "}
                      uriAutoComp={rw?.uriAutoComplete ?? " "}
                      valEdit={rw?.value}
                      key={rw?.label + "-" + i}
                    />
                  )}
                      {rw?.type == "select" && (
                        <MultiSelectBAse
                          disabled={false}
                          error={false}
                          label={rw?.label}
                          required={rw?.mandatory ?? false}
                          options={rw?.options}
                          onChange={(e) => {
                            changeValue(
                              e,
                              activeList,
                              activeStep,
                              i,
                              rw?.allLanguage,
                              rw?.trigerIndex ?? [],
                              rw?.replaceTriggerValue ?? "none",
                              true
                            );
                          }}
                          value={rw?.value}
                          ismulti={rw?.selectMulti ?? false}
                          placeholder={rw?.placeholder ?? "Select " + rw?.label}
                          onMenuClose={() => {}}
                          onMenuOpen={() => {}}
                          key={rw?.label + "-" + i}
                        />
                      )}
                      {rw?.type == "textarea" && (
                        <RichEditorBase
                          label={rw?.label}
                          required={rw?.mandatory ?? false}
                          value={rw?.value}
                          onChange={(e) => {
                            changeValue(
                              e,
                              activeList,
                              activeStep,
                              i,
                              rw?.allLanguage
                            );
                          }}
                        />
                      )}
                      {rw?.type == "textareaonly" && (
                        <TextareaBase
                          error={false}
                          label={rw?.label}
                          rest={{
                            value: rw?.value,
                            onChange: (e) => {
                              changeValue(
                                e.target.value,
                                activeList,
                                activeStep,
                                i,
                                rw?.allLanguage
                              );
                            },
                            placeholder:
                              rw?.placeholder ?? "Input " + rw?.label,
                          }}
                          required={rw?.mandatory ?? false}
                        />
                      )}
                      {rw?.type == "fileimage" && (
                        <FileInputBase
                          label={rw?.label}
                          onChangeFiles={(e) => {
                            changeValue(
                              e[0].url,
                              activeList,
                              activeStep,
                              i,
                              rw?.allLanguage
                            );
                          }}
                          required={rw?.mandatory ?? false}
                          urlImg={rw?.value}
                        />
                      )}
                      {rw?.type == "table" && !loading && (
                        <>
                          {rw?.newUri && (
                            <>
                              <ButtonSubmit
                                onCreate={() => {
                                  window.location.assign(rw?.newUri);
                                }}
                                loading={loading}
                                label="New Data"
                              />
                            </>
                          )}
                          {/* CHANGED: overflow-x-auto for table scroll on mobile */}
                          <div className="overflow-x-auto">
                            <TableView
                              groups={""}
                              uri={rw?.uri ?? ""}
                              isEditTable={true}
                              isBtnView={false}
                            />
                          </div>
                        </>
                      )}
                      {rw?.type == "readonly" && (
                        <>
                          <div
                            key={activeStep + "-" + i + "-" + activeList}
                            className={toResponsiveCol(rw?.col)}
                          >
                            <div className="font-bold text-[14px] leading-[19px]">
                              {rw?.label}
                            </div>
                            <div
                              className="text-sm"
                              dangerouslySetInnerHTML={{ __html: rw?.value }}
                            ></div>
                          </div>
                        </>
                      )}
                      {rw?.type === "addrowtbl" && (
                        <div className="overflow-x-auto">
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                changeValue(
                                  [
                                    ...(rw?.value || []),
                                    Object.fromEntries(
                                      rw?.items.map((f) => [f.name, f.value])
                                    ),
                                  ],
                                  activeList,
                                  activeStep,
                                  i,
                                  rw?.allLanguage
                                )
                              }
                              className="mt-2 px-3 py-1 font-bold mb-2 rounded text-sm bg-gray-100 hover:bg-gray-200"
                            >
                              + Add Item
                            </button>
                          </div>
                          {/* CHANGED: min-w-full for table to allow horizontal scroll */}
                          <table className="min-w-full border border-sky-200 rounded shadow bg-white">
                            <thead className="bg-sky-50 text-sky-700">
                              <tr>
                                <th></th>
                                {rw?.items?.map((rws, is) => (
                                  <th key={is} className="px-3 py-2 text-left text-sm whitespace-nowrap">{rws?.label}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(rw?.value || []).map((item: any, idx: number) => (
                                <tr
                                  key={idx}
                                  className="border-t border-sky-100 hover:bg-sky-50 transition"
                                >
                                  <td className="px-3 py-2 font-medium text-sky-600">
                                    {idx + 1}
                                  </td>

                                  {rw?.items?.map((field, fi) => (
                                    <td key={fi} className="px-3 py-2">
                                      {field?.type === "select" && (
                                        <InputField
                                          type={"select-single"}
                                          label={""}
                                          name={field?.name}
                                          uriSelect={field?.uri}
                                          value={item[field.name]}
                                          onChange={(subName, subVal) => {
                                            let newRow = { ...(item || {}), [field.name]: subVal };
                                            if (Array.isArray(field?.targetKey)) {
                                              field.targetKey.forEach((f) => {
                                                if (subVal && typeof subVal === 'object' && f in subVal) {
                                                  newRow[f] = subVal[f];
                                                }
                                              });
                                            }
                                            const updated = (rw?.value || []).map((row, idx2) =>
                                              idx2 === idx ? newRow : row
                                            );
                                            changeValue(updated, activeList, activeStep, i, rw?.allLanguage);
                                          }}
                                        />
                                      )}
                                      {(field?.type === "text" ||
                                        field?.type === "number" ||
                                        field?.type === "autocomplete" ||
                                        field?.type === "date" ||
                                        field?.type === "datetime") && (
                                        <InputBase
                                          error={false}
                                          label={""}
                                          onchangeCus={(e) => {
                                            changeValue(e, activeList, activeStep, i, rw?.allLanguage);
                                          }}
                                          rest={{
                                            value: item[field.name],
                                            onChange: (e) => {
                                              let newRow = { ...(item || {}), [field?.name]: e.target.value };
                                              if (Array.isArray(field?.targetKey)) {
                                                field.targetKey.forEach((f) => {
                                                  newRow[f] = e.target.value;
                                                });
                                              }
                                              if (Array.isArray(field?.targetOperator)) {
                                                field.targetOperator.forEach((f) => {
                                                  let val = 0;
                                                  if (f.operator === "x") {
                                                    val = Number(e.target.value) * Number(item[f.keyOperator] || 0);
                                                  }
                                                  newRow[f.targetOperator] = val;
                                                });
                                              }
                                              const updated = (rw?.value || []).map((row, idx2) =>
                                                idx2 === idx ? newRow : row
                                              );
                                              changeValue(updated, activeList, activeStep, i, rw?.allLanguage);
                                            },
                                            type: field?.type,
                                            placeholder: "Input " + item[field.name],
                                          }}
                                          valEdit={item[field.name]}
                                          key={field?.label + "-" + i}
                                        />
                                      )}
                                    </td>
                                  ))}

                                  <td className="px-3 py-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = (rw?.value || []).filter((_, i) => i !== idx);
                                        changeValue(updated, activeList, activeStep, i, rw?.allLanguage);
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30 shadow-md">
          <div className="lg:ms-[250px] flex flex-wrap justify-end px-2 sm:px-4 gap-2 sm:gap-4">

            {(() => {
              const isEdit = !!GetQueryStr("data");
              const path = window.location.pathname;
              const isEvent = path.includes("event-list");
              const isPackage = path.includes("event-package");

              if (activeStep === 0) {
                if (isEvent) {
                  if (isEdit) {
                    return (
                      <>
                        <ButtonSubmit
                          onCreate={() => routers.back()}
                          loading={loading}
                          isprimary={false}
                          label="Back"
                        />
                        <ButtonSubmit
                          onCreate={() => setActiveStep(activeStep + 1)}
                          loading={loading}
                          label="Next"
                        />
                      </>
                    );
                  } else {
                    return (
                      <>
                        <ButtonSubmit
                          onCreate={() => routers.back()}
                          loading={loading}
                          isprimary={false}
                          label="Back"
                        />
                        <ButtonSubmit
                          isBtnAdd={canCreate || canUpdate}
                          onCreate={() => {
                            setloading(true);
                            onSaveData();
                          }}
                          loading={loading}
                          label="Save Change"
                        />
                      </>
                    );
                  }
                }

                if (isPackage) {
                  return (
                    <>
                      <ButtonSubmit
                        onCreate={() => routers.back()}
                        loading={loading}
                        isprimary={false}
                        label="Back"
                      />
                      <ButtonSubmit
                        isBtnAdd={canCreate || canUpdate}
                        onCreate={() => {
                          setloading(true);
                          onSaveData();
                        }}
                        loading={loading}
                        label="Save Change"
                      />
                    </>
                  );
                }
              }

              if (activeStep > 0 && activeStep < dataForm[activeList]?.step?.length - 1) {
                return (
                  <>
                    <ButtonSubmit
                      onCreate={() => setActiveStep(activeStep - 1)}
                      loading={loading}
                      label="Prev"
                    />
                    <ButtonSubmit
                      onCreate={() => setActiveStep(activeStep + 1)}
                      loading={loading}
                      label="Next"
                    />
                  </>
                );
              }

              if (activeStep === dataForm[activeList]?.step?.length - 1) {
                return (
                  <>
                    <ButtonSubmit
                      onCreate={() => setActiveStep(activeStep - 1)}
                      loading={loading}
                      label="Prev"
                    />
                    <ButtonSubmit
                      isBtnAdd={canCreate || canUpdate}
                      onCreate={() => {
                        setloading(true);
                        onSaveData();
                      }}
                      loading={loading}
                      label="Save Change"
                    />
                  </>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </>
  );
};
export default ModuleAddPage;