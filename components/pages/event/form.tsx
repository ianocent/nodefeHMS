import React, { useContext, useEffect, useState } from "react";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import ButtonCreate from "../../common/button/ButtonCreate";
import InputBase from "../../common/input/InputBase";
import MultiSelectBAse from "../../common/input/MultiSelectBase";
import { forEach } from "jszip";
import RichEditorBase from "../../common/input/RichEditorBase";
import TextareaBase from "../../common/input/TextareaBase";
import FileInputBase from "../../common/input/FileInputBase";
import { FetchData, GetDecrypt, GetEncrypt, GetQueryStr } from "../../helper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import TableView from "../../common/table-edit";
import InputField from "../../common/input/SelectAsycn";
import { env } from "../../../next.config";

interface AddProps {
  data: any;
}
const ModuleAddPage = (props: AddProps) => {
  const { data } = props;
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const routers = useRouter();
  const [loading, setloading] = useState(false);
  const [dataForm, setDataForm] = useState(props.data?.form?.list);
  const [activeList, setActiveList] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
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
        // console.log("vasl", val.triggerValue[index]);
        valTarget = val.triggerValue[index];
      }
      // console.log("name", tempForm[curList].step[curStep].input[item].name);
      // console.log("val", tempForm[curList].step[curStep].input[item].value);

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
  const onBack = () => {
    setActiveStep(0);
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
    pax: null, // Fetched max capacity
    capacity_value: null, // User-entered
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

          // Update mapping
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

  const handleDownload = async (item: any) => {
    try {
      const response = await fetch(env.uriApi + item.value, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${datalocal?.data?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = item.label + `-${GetQueryStr("data")}` + ".pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the report. Please try again.");
    }
  };

  return (
    <>
    {/* <LayoutComponent> */}
      <div
        key={window.location.pathname}
        className="grid grid-cols-12 h-fit gap-4 "
      >
        <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
          <div className="col-span-12">
            <fieldset className="border">
              {/* form */}
              <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                {dataForm[activeList]?.step[activeStep]?.input?.map((rw, i) => (
                  <>
                    <div key={rw?.uri} className={rw?.col ?? "col-span-12"}>
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
                          <TableView
                            groups={""}
                            uri={rw?.uri ?? ""}
                            isEditTable={true}
                            // isDrag={true}
                          />
                        </>
                      )}
                      {rw?.type == "readonly" && (
                        <>
                          <div
                            key={activeStep + "-" + i + "-" + activeList}
                            className={rw?.col ?? "col-span-12"}
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
                          <table className="w-full border border-sky-200 rounded shadow bg-white">
                            <thead className="bg-sky-50 text-sky-700">
                              <tr>
                                <th></th>
                                {rw?.items?.map((rws, is) => (
                                  <th key={is}>{rws?.label}</th>
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
                                                // Hanya set jika subVal ada dan memiliki properti f
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
        {/* tombol navigasi bawah */}
        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">

            {(() => {
              const isEdit = !!GetQueryStr("data");
              const path = window.location.pathname;
              const isEvent = path.includes("event-list");
              const isPackage = path.includes("event-package");

              // Kondisi Step Pertama
              if (activeStep === 0) {
                if (isEvent) {
                  if (isEdit) {
                    // Event Edit → Back + Next
                    return (
                      <>
                        <ButtonSubmit
                          onCreate={() => routers.back()}
                          loading={loading}
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
                    // Event Add → Back + Save
                    return (
                      <>
                        <ButtonSubmit
                          onCreate={() => routers.back()}
                          loading={loading}
                          label="Back"
                        />
                        <ButtonSubmit
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
                  // Baik Add maupun Edit → Back + Save
                  return (
                    <>
                      <ButtonSubmit
                        onCreate={() => routers.back()}
                        loading={loading}
                        label="Back"
                      />
                      <ButtonSubmit
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
      <div className="absolute right-10">
        <MultiSelectBAse
          disabled={false}
          error={null}
          label="Print Form"
          required={false}
          options={[
            {
              label: "Pre Registration",
              value: `/cms/report/batch/folio/${GetQueryStr(
                "data"
              )}/pre-registration`,
            },
            {
              label: "Registration Form",
              value: `/cms/report/batch/folio/${GetQueryStr(
                "data"
              )}/registration-form`,
            },
            {
              label: "Confirmation Reservation",
              value: `/cms/report/batch/folio/${GetQueryStr(
                "data"
              )}/confirmation`,
            },
            {
              label: "Letter of aggrement",
              value: `/cms/report/batch/folio/${GetQueryStr(
                "data"
              )}/letter-of-aggrement`,
            },

            {
              label: "Proforma Invoice",
              value: `/cms/report/batch/folio/${GetQueryStr(
                "data"
              )}/proforma-invoice`,
            },
          ]}
          onChange={(e) => handleDownload(e)}
          // value={valueSel}
          ismulti={false}
          placeholder="Print"
        />
      </div>
    </>
  );
};
export default ModuleAddPage;