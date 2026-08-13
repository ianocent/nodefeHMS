import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import {
  FetchData,
  GetCurrentDate,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import { redirect, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";
import { env } from "../../../../next.config";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, fn, ln, ti, pn, em) => void;
  nameinit?: string;
}
const AddView = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/housekeeping/work-order";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataMaster, setDataMaster] = useState<any>();
  const pathname = usePathname();
  const { canCreate, canUpdate } = useFormPermission(160);
  const canAssign = useTransactionPermission("assign_engineering");
  const canStartWO = useTransactionPermission("start_work_order");
  const canEndWO = useTransactionPermission("end_work_order");
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
      if (datavaled?.images && Array.isArray(datavaled.images)) {
          setImages(datavaled.images);
      }
  }, [datavaled]);
  const [dataform, setdataform] = useState([
    {
      name: "Work Order",
      data: [
        {
          label: "Reported by",
          name: "reported_by",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
        },
        {
          label: "Reported date",
          name: "date",
          type: "date",
          cols: "col-span-6",
        },
        {
          label: "Area",
          name: "area",
          type: "select-multi",
          cols: "col-span-4",
          options: [{}],
        },
        {
          label: "Room",
          name: "room_id",
          type: "select-multi",
          cols: "col-span-4",
          options: [{}],
          disable: true,
        },

        {
          label: "Work type",
          name: "work_type",
          type: "select-multi",
          cols: "col-span-4",
          options: [{}],
        },
        {
          label: "Work description",
          name: "work_description",
          type: "textarea",
          cols: "col-span-12",
        },
        {
          label: "Estimated date",
          name: "estimated_time",
          type: "date",
          cols: "col-span-6",
        },
      ],
    },
  ]);

  const [dataformAssign, setDataformAssign] = useState([
    {
      name: "Assign",
      data: [
        {
          label: "Assign to",
          name: "assign_to",
          type: "select-multi",
          cols: "col-span-12",
          options: [{}],
          disable: !canAssign
        },
        {
          label: "Start date",
          name: "start_date",
          type: "date",
          cols: "col-span-6",
          disable: true,
        },
        {
          label: "Start time",
          name: "start_time",
          type: "time",
          cols: "col-span-6",
          disable: true,
        },
        {
          label: "End date",
          name: "end_date",
          type: "date",
          cols: "col-span-6",
          disable: true,
        },
        {
          label: "End time",
          name: "end_time",
          type: "time",
          cols: "col-span-6",
          disable: true,
        },
        {
          label: "Notes",
          name: "notes",
          type: "textarea",
          cols: "col-span-12",
        },
      ],
    },
  ]);

  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
    }
  };
  const GetDetailUser = async (i: any) => {
    setuiddata(i);
    try {
      let getuuri = GLOBALURI + "/" + i + "/update";
      if (i == 0) {
        getuuri = GLOBALURI + "/create";
      }
      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      // setData({ ...dataval, date: datalocal?.data?.bussinesDate });
      if (i != 0) {
        setData(datauser?.data);
        setDataEd(datauser?.data);
      } else {
        setData({ ...dataval, date: datalocal?.data?.bussinesDate });
        setDataEd({ ...datavaled, date: datalocal?.data?.bussinesDate });
      }

      setDataMaster(datauser?.master);
      let dataInput = [...dataform];
      dataInput[0].data[0].options = datauser?.master?.users;
      dataInput[0].data[3].options = datauser?.master?.rooms;
      dataInput[0].data[2].options = datauser?.master?.areas;
      dataInput[0].data[4].options = datauser?.master?.workTypes;

      let dataAssign = [...dataformAssign];
      dataAssign[0].data[0].options = datauser?.master?.users;
      setdataform([...dataInput]);
      setDataformAssign([...dataAssign]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    if (dataval?.area?.value_name === "room") {
      let dataInput = [...dataform];
      dataInput[0].data[3].disable = false;
      setdataform([...dataInput]);
    } else {
      let dataInput = [...dataform];
      dataInput[0].data[3].disable = true;
      setdataform([...dataInput]);
    }
  }, [dataval.area]);

  const transformData = (data) => {
    const newData = { ...data };
    // Daftar properti yang perlu diubah
    const propertiesToTransform = [
      "reported_by",
      "room_id",
      "area",
      "work_type",
      "assign_to",
    ];

    propertiesToTransform.forEach((property) => {
      if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const OnSave = async () => {
    try {
      setloading(true);
      
      let urisave = GLOBALURI;
      let mth = "POST";
      const { no, ...dataToSave } = dataval;
      // const transformedData = transformData(dataToSave);
      const transformedData = transformData({ ...dataToSave, images });

      const raw = JSON.stringify(transformedData);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr;
        mth = "PUT";
      }

      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (saveprocess?.code == "200") {
        toast.success(saveprocess?.message || "Work Order berhasil disimpan", {
          position: "top-center",
        });

        // Refresh data
        const urlParams = new URLSearchParams(window.location.search);
        const idreq = urlParams.get("data");
        
        if (idreq) {
          GetDetailUser(idreq);   // refresh form
        } else {
          // Setelah create, reset form atau redirect
          setData({ date: datalocal?.data?.bussinesDate });
          GetDetailUser(0);
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Gagal menyimpan Work Order");
    } finally {
      setloading(false);
    }
  };

  function GetTime() {
    let currentDateTime = new Date();
    let currentTime = currentDateTime.toTimeString().slice(0, 5);

    return currentTime;
  }

  const OnProcess = async (process: string) => {
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const dataStart =
        process === "start"
          ? {
              assign_to: dataval.assign_to,
              start_date: GetCurrentDate(),
              start_time: GetTime(),
            }
          : {
              end_date: GetCurrentDate(),
              end_time: GetTime(),
            };
      const transformedData = transformData(dataStart);

      const raw = JSON.stringify(transformedData);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }

      const aesraw = GetEncrypt(raw);
      var redirects = isPopup ? "" : `${pathname}?parent=160`;
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        // redirects
        ""
      );
      if (saveprocess?.code == "200") {
        if (datavaled.room_id.value) {
          const uriRoomUpdate =
            "/cms/housekeeping/room-status" +
            "/" +
            datavaled.room_id.value +
            "";
          const model = "PUT";

          if (process === "start") {
            const data = {
              room_status: 4,
              maid_status: 4,
            };
            const raw = JSON.stringify(data);
            const aesraw = GetEncrypt(raw);
            const saveprocess = await FetchData(
              uriRoomUpdate,
              model,
              aesraw,
              false,
              datalocal?.data?.access_token,
              router,
              // redirects
              ""
            );
          } else {
            const data = {
              room_status: 0,
              maid_status: 1,
            };
            const raw = JSON.stringify(data);
            const aesraw = GetEncrypt(raw);
            const saveprocess = await FetchData(
              uriRoomUpdate,
              model,
              aesraw,
              false,
              datalocal?.data?.access_token,
              router,
              // redirects
              ""
            );
          }
        }
        const urlParams = new URLSearchParams(window.location.search);
        const idreq = urlParams.get("data");
        GetDetailUser(idreq);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  const [parent, setparent] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    setparent(idparent);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);

  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
            <div className="col-span-12">
            {/* <div className="col-span-12 lg:col-span-4"> */}
              <fieldset className="border">
                <legend className="ml-2">
                  {new URLSearchParams(window.location.search).get("data") ===
                  null
                    ? "Create "
                    : ""}
                  Work orders
                </legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2 form-grid-responsive">
                  {dataform[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "textarea") {
                      types = "textarea";
                      typesmain = "textarea";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else {
                      types = row?.type;
                      typesmain = "base";
                    }
                    return (
                      <div className={row?.cols}>
                        <InputMain
                          disabled={row?.disable}
                          valuename={row?.name}
                          typeInput={typesmain}
                          error={false}
                          label={row?.label}
                          required={false}
                          options={row?.options}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            type: types,
                            disabled: row?.disable,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              {new URLSearchParams(window.location.search).get("data") !==
                null && (
                <fieldset className="border">
                  <div className="flex flex-row gap-2 px-3">
                    <ButtonSubmit
                      isBtnAdd={canCreate || canUpdate && canStartWO}
                      onCreate={() => {
                        dataval?.assign_to?.value
                          ? OnProcess("start")
                          : toast(
                              "Please assign your Engineering Staff first",
                              {
                                autoClose: 3000,
                                type: "error",
                                position: "bottom-center",
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                              }
                            );
                      }}
                      disabled={
                        !canStartWO || datavaled?.start_date?.length > 0 ? true : false
                      }
                      loading={loading}
                      label="Start"
                    />
                    <ButtonSubmit
                      isBtnAdd={canCreate || canUpdate && canEndWO}
                      onCreate={() => {
                        dataval?.assign_to?.value
                          ? OnProcess("end")
                          : toast(
                              "Please assign your Engineering Staff first",
                              {
                                autoClose: 3000,
                                type: "error",
                                position: "bottom-center",
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                              }
                            );
                      }}
                      disabled={
                        !canEndWO || datavaled?.start_date?.length === 0
                          ? true
                          : datavaled?.end_date?.length > 0
                          ? true
                          : false
                      }
                      loading={loading}
                      label="End"
                    />
                  </div>

                  <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                    {dataformAssign[0].data?.map((row: any) => {
                      var types: string;
                      var typesmain: string;

                      if (row?.type == "select-multi") {
                        types = "select-multi";
                        typesmain = "select-multi";
                      } else if (row?.type == "select") {
                        types = "select";
                        typesmain = "select";
                      } else if (row?.type == "textarea") {
                        types = "textarea";
                        typesmain = "textarea";
                      } else if (row?.type == "checkbox") {
                        types = row?.type;
                        typesmain = row?.type;
                      } else {
                        types = row?.type;
                        typesmain = "base";
                      }
                      return (
                        <div className={row?.cols}>
                          <InputMain
                            valuename={row?.name}
                            typeInput={typesmain}
                            error={false}
                            label={row?.label}
                            required={false}
                            options={row?.options}
                            rest={{
                              name: row?.name,
                              placeholder: row?.label,
                              value: dataval[row?.name] ?? datavaled[row?.name],
                              type: types,
                              disabled: row?.disable,
                              onChange: (e) => {
                                changeHandlerSrc(e, row?.type, row?.name);
                              },
                            }}
                            restArea={{
                              placeholder: row?.label,
                              name: row?.name,
                              value: dataval[row?.name] ?? datavaled[row?.name],
                              onChange: (e) => {
                                changeHandlerSrc(e, row?.type, row?.name);
                              },
                            }}
                            onChangeSel={(e: any) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                              //GetDataTable(e.value);
                            }}
                            valueSel={
                              dataval[row?.name] ?? datavaled[row?.name]
                            }
                            isMulti={false}
                            placeholder={row?.label}
                          />
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              )}
            </div>
          </div>
        </div>
      </div>
      {new URLSearchParams(window.location.search).get("data") !== null && (
        <fieldset className="border mt-4">
          <legend className="ml-2 text-sm font-semibold">Documentation / Evidence</legend>
          <div className="p-4">

            {/* Upload button */}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded border text-sm mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Image
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const base64 = ev.target?.result as string;
                      setImages((prev) => [...prev, base64]);
                    };
                    reader.readAsDataURL(file);
                  });
                  e.target.value = "";
                }}
              />
            </label>

            {/* Counter */}
            {images.length > 0 && (
              <p className="text-xs text-gray-500 mb-3">{images.length} image{images.length > 1 ? 's' : ''} uploaded</p>
            )}

            {/* Grid Preview */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {images.map((img, idx) => {
                  const src = img.startsWith('data:image')
                  ? img
                  : `${env.uriApi}/storage${img}`;

                  return (
                    <div
                      key={idx}
                      className="relative group border rounded-lg overflow-hidden bg-gray-50 aspect-square"
                    >
                      {/* Nomor urut */}
                      <div className="absolute top-1 left-1 z-10 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {idx + 1}
                      </div>

                      {/* Thumbnail */}
                      <img
                        src={src}
                        alt={`Documentation ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                        }}
                      />

                      {/* Overlay actions on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        {/* Preview fullscreen */}
                        <button
                          type="button"
                          onClick={() => setLightbox(src)}
                          className="bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow"
                          title="View full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add more tile */}
                <label className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg aspect-square flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">Add more</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const base64 = ev.target?.result as string;
                          setImages((prev) => [...prev, base64]);
                        };
                        reader.readAsDataURL(file);
                      });
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            ) : (
              /* Empty state */
              <label className="cursor-pointer w-full border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">No documentation yet</p>
                <p className="text-xs">Click to upload images as evidence</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const base64 = ev.target?.result as string;
                        setImages((prev) => [...prev, base64]);
                      };
                      reader.readAsDataURL(file);
                    });
                    e.target.value = "";
                  }}
                />
              </label>
            )}

          </div>
        </fieldset>
      )}
      <div
        className={
          isPopup
            ? " w-full bg-white py-2 px-4 "
            : "fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30"
        }
      >
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              router.replace({
                pathname: window.location.pathname,
                query: { parent: parent },
              });
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />
          {isview ? (
            <></>
          ) : (
            <ButtonSubmit
              isBtnAdd={canCreate || canUpdate}
              onCreate={() => {
                setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          )}
        </div>
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>

            {/* Image */}
            <img
              src={lightbox}
              alt="Preview"
              className="w-full h-full object-contain max-h-[85vh] rounded-lg"
            />

            {/* Navigation — prev/next */}
            <button
              type="button"
              onClick={() => {
                const currentIdx = images.findIndex((img) => {
                  const src = img.startsWith('data:image') ? img : `{suriApi}/storage${img}`;
                  return src === lightbox;
                });
                const prevIdx = (currentIdx - 1 + images.length) % images.length;
                const prev = images[prevIdx];
                // setLightbox(prev.startsWith('data:image') ? prev : `{suriApi}/storage${prev}`);
                setLightbox(prev.startsWith('data:image') ? prev : `${env.uriApi}/storage${prev}`);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                const currentIdx = images.findIndex((img) => {
                  const src = img.startsWith('data:image') ? img : `{suriApi}/storage${img}`;
                  return src === lightbox;
                });
                const nextIdx = (currentIdx + 1) % images.length;
                const next = images[nextIdx];
                // setLightbox(next.startsWith('data:image') ? next : `{suriApi}/storage${next}`);
                setLightbox(next.startsWith('data:image') ? next : `${env.uriApi}/storage${next}`); 
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {images.findIndex((img) => {
                const src = img.startsWith('data:image') ? img : `{suriApi}/storage${img}`;
                return src === lightbox;
              }) + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddView;
