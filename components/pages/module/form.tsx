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

  const onSaveData = async () => {
    try {
      const mth = GetQueryStr("data") ? "PUT" : "POST";
      const isFormData = props.data?.form?.isFormData ?? false;
      const rawJson = JSON.stringify({ form: dataForm });

      var rawBody = rawJson;
      const aesraw = GetEncrypt(rawBody);

      const formData = new FormData();
      formData.append("datajson", aesraw);

      if (isFormData) {
      }
      let uriRedirect = window.location.pathname;
      let manualRedirect = "";
      if (GetQueryStr("tblid")) {
        uriRedirect = "";
      } else if (GetQueryStr("urlrefere")) {
        manualRedirect = "/module/" + GetQueryStr("urlrefere");
        uriRedirect = ""; // Prevent FetchData from shallow routing
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
        } else if (manualRedirect != "") {
          setTimeout(() => {
            window.location.assign(manualRedirect);
          }, 800);
        }
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log(error);
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

  return (
    <>
      <div
        key={window.location.pathname}
        className="grid grid-cols-12 h-fit gap-4 "
      >
        <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
          <div className="col-span-12">
            <fieldset className="border">
              <legend className="ml-2">
                {data?.form?.label ?? "Create/Update"}
              </legend>
              {/* tab */}
              <div className="flex gap-2 ml-2 mb-4 mt-4 mr-2">
                {dataForm?.map((rw, i) => (
                  <>
                    <button
                      className={
                        (activeList == i
                          ? " bg-[#1b9aaa] "
                          : " bg-[#bcd4e6] ") +
                        " hover:bg-[#1b9aaa]  text-white uppercase font-bold py-2 px-4 rounded"
                      }
                      onClick={() => {
                        setActiveList(i);
                        // setActiveStep(0);
                      }}
                    >
                      {rw?.lang}
                    </button>
                  </>
                ))}
              </div>

              {/* Steper */}
              <ul className=" relative flex flex-row gap-x-2 max-w-4xl mx-auto px-4 mt-6">
                {dataForm[activeList]?.step?.map((rw, i) => (
                  <>
                    <li
                      className="shrink basis-0 flex-1 group cursor-pointer"
                      onClick={() => {
                        setActiveStep(i);
                      }}
                    >
                      <div className="flex justify-center flex-col min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
                        <span
                          className={
                            (i == activeStep
                              ? " bg-black text-white scale-110 shadow-md transition-transform "
                              : " bg-gray-200 text-black ") +
                            "size-8 flex justify-center items-center shrink-0 font-medium rounded-full dark:bg-neutral-700 dark:text-white"
                          }
                        >
                          {i + 1}
                        </span>
                        <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
                      </div>
                      <div className="mt-3 flex justify-center">
                        <span
                          className={
                            (i == activeStep
                              ? " font-bold text-[#1b9aaa] border-b-2 border-[#1b9aaa] pb-1 "
                              : " font-medium text-gray-500 ") +
                            "block text-sm text-center whitespace-nowrap transition-colors"
                          }
                        >
                          {rw?.name}
                        </span>
                      </div>
                    </li>
                  </>
                ))}
              </ul>
              {/* form */}
              <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                {dataForm[activeList]?.step[activeStep]?.input?.map((rw, i) => (
                  <>
                    <div key={rw?.uri} className={rw?.col ?? "col-span-12"}>
                      {(rw?.type == "text" ||
                        rw?.type == "number" ||
                        rw?.type == "autocomplete" ||
                        rw?.type == "date" ||
                        rw?.type == "datetime" ||
                        rw?.type == "datetime-local") && (
                        <>
                          <InputBase
                            error={false}
                            label={rw?.label}
                            onchangeCus={(e: any) => {
                              changeValue(
                                e,
                                activeList,
                                activeStep,
                                i,
                                rw?.allLanguage
                              )
                            }}
                            rest={{
                              value: rw?.value,
                              onChange: (e) => {
                                changeValue(
                                  e.target.value,
                                  activeList,
                                  activeStep,
                                  i,
                                  rw?.allLanguage,
                                  rw?.trigerIndex ?? [],
                                  rw?.replaceTriggerValue ?? "none",
                                  false
                                );
                              },
                              type: rw?.type,
                              placeholder:
                                rw?.placeholder ?? "Input " + rw?.label,
                            }}
                            required={rw?.mandatory ?? false}
                            clasCus={rw?.classCustome ?? " "}
                            widthCus={rw?.widthCustome ?? " "}
                            uriAutoComp={rw?.uriAutoComplete ?? " "}
                            valEdit={rw?.value}
                            key={rw?.label + "-" + i}
                          />
                        </>
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
                            // console.log("dataaja", e);
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
                          {rw?.label && (
                            <div className="font-bold text-[14px] leading-[19px] mb-2 text-sky-700">
                              | {rw.label}
                            </div>
                          )}
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
                            isEditTable={rw?.isEditTable ?? true}
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

                      {rw?.type == "addrowtbl" && (
                        <div className="overflow-x-auto">
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                // onChange(name, [
                                //   ...(rw?.value || []),
                                //   Object.fromEntries(
                                //     rw?.value.map((f) => [f.name, f.value])
                                //   ),
                                // ])
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
                              className="mt-2 px-3 py-1 font-bold mb-2  rounded text-sm bg-gray-100 hover:bg-gray-200"
                            >
                              + Add Item
                            </button>
                          </div>
                          <table className="w-full border border-sky-200 rounded shadow bg-white">
                            <thead className="bg-sky-50 text-sky-700">
                              <tr>
                                <th></th>
                                {rw?.items?.map((rws, is) => (
                                  <>
                                    {" "}
                                    <th>{rws?.label}</th>
                                  </>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(rw?.value || []).map(
                                (item: any, idx: number) => (
                                  <tr
                                    key={idx}
                                    className="border-t border-sky-100 hover:bg-sky-50 transition"
                                  >
                                    <td className="px-3 py-2 font-medium text-sky-600">
                                      {idx + 1}
                                    </td>

                                    {rw?.items?.map((field, fi) => {
                                      // const hidden = isFieldHidden(field, item);
                                      // if (hidden) return null;

                                      return (
                                        <td key={i} className="px-3 py-2">
                                          {field?.type == "select" && (
                                            <InputField
                                              type={"select-single"}
                                              label={""}
                                              name={field?.name}
                                              uriSelect={field?.uri}
                                              options={field?.options}
                                              value={item[field.name]}
                                              onChange={(subName, subVal) => {
                                                // update row sesuai select
                                                let newRow = {
                                                  ...(item || {}),
                                                  [field.name]: subVal,
                                                };
                                                

                                                // tambahkan field ekstra dari targetKey

                                                if (
                                                  Array.isArray(
                                                    field?.targetKey
                                                  )
                                                ) {
                                                  field.targetKey.forEach(
                                                    (f) => {
                                                      newRow[f] = subVal[f];
                                                    }
                                                  );
                                                }

                                                // update array row
                                                const updated = (
                                                  rw?.value || []
                                                ).map((row, idx2) =>
                                                  idx2 === idx ? newRow : row
                                                );
                                                // console.log("wowssws", item);
                                                // simpan ke state/parent
                                                changeValue(
                                                  updated,
                                                  activeList,
                                                  activeStep,
                                                  i,
                                                  rw?.allLanguage
                                                );
                                              }}
                                            />
                                          )}
                                          {(field?.type == "text" ||
                                            field?.type == "number" ||
                                            field?.type == "autocomplete" ||
                                            field?.type == "date" ||
                                            field?.type == "datetime") && (
                                            <>
                                              {/* widy */}
                                              <InputBase
                                                error={false}
                                                label={""}
                                                onchangeCus={(e: any) => {
                                                  changeValue(
                                                    e,
                                                    activeList,
                                                    activeStep,
                                                    i,
                                                    rw?.allLanguage
                                                  )
                                                }}
                                                rest={{
                                                  value: item[field.name],
                                                  
                                                  onChange: (e) => {
                                                    // update row sesuai select
                                                    let newRow = {
                                                      ...(item || {}),
                                                      [field?.name]:
                                                        e.target.value,
                                                    };

                                                    // tambahkan field ekstra dari targetKey

                                                    if (
                                                      Array.isArray(
                                                        field?.targetKey
                                                      )
                                                    ) {
                                                      field.targetKey.forEach(
                                                        (f) => {
                                                          newRow[f] =
                                                            e.target.value;
                                                        }
                                                      );
                                                    }
                                                    if (
                                                      Array.isArray(
                                                        field?.targetOperator
                                                      )
                                                    ) {
                                                      field.targetOperator.forEach(
                                                        (f) => {
                                                          let val = 0;
                                                          if (
                                                            f.operator == "x"
                                                          ) {
                                                            val =
                                                              Number(
                                                                e.target.value
                                                              ) *
                                                              Number(
                                                                item[
                                                                  f.keyOperator
                                                                ]
                                                              );
                                                          }
                                                          newRow[
                                                            f.targetOperator
                                                          ] = val;
                                                        }
                                                      );
                                                    }

                                                    // update array row
                                                    const updated = (
                                                      rw?.value || []
                                                    ).map((row, idx2) =>
                                                      idx2 === idx
                                                        ? newRow
                                                        : row
                                                    );

                                                    console.log(updated);
                                                    // console.log("wowssws", item);
                                                    // simpan ke state/parent
                                                    changeValue(
                                                      updated,
                                                      activeList,
                                                      activeStep,
                                                      i,
                                                      rw?.allLanguage
                                                    );
                                                  },
                                                  type: rw?.type,
                                                  placeholder:
                                                    "Input " + item[field.name],
                                                }}
                                                valEdit={item[field.name]}
                                                key={rw?.label + "-" + i}
                                              />
                                            </>
                                          )}
                                        </td>
                                      );
                                    })}

                                    {/* Tombol Hapus */}
                                    <td className="px-3 py-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = (rw?.value || []).filter(
                                            (_, i) => i !== idx
                                          );
                                          changeValue(
                                            updated,
                                            activeList,
                                            activeStep,
                                            i,
                                            rw?.allLanguage
                                          );
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        ✕
                                      </button>
                                    </td>
                                  </tr>
                                )
                              )}
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
        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
            {activeStep == dataForm[activeList]?.step?.length - 1 ? (
              <>
                <ButtonSubmit
                  onCreate={() => {
                    setActiveStep(activeStep - 1);
                  }}
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
            ) : (
              <>
                {activeStep > 0 && (
                  <ButtonSubmit
                    onCreate={() => {
                      setActiveStep(activeStep - 1);
                    }}
                    loading={loading}
                    label="Prev"
                  />
                )}
                <ButtonSubmit
                  onCreate={() => {
                    setActiveStep(activeStep + 1);
                  }}
                  loading={loading}
                  label="Next"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ModuleAddPage;
