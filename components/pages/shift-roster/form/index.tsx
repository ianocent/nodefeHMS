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
import TableRosters from "../../../common/table-rosters";
import { useFormPermission } from "../../../../hooks/useFormPermission";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, fn, ln, ti, pn, em) => void;
  nameinit?: string;
}
const AddPage = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/housekeeping/shift-roster";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const { canUpdate, canCreate } = useFormPermission(158);
  const [view, setview] = useState("0");
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataMaster, setDataMaster] = useState<any>();
  const pathname = usePathname();
  const [dataform, setdataform] = useState([
    {
      name: "Shift Roster",
      data: [
        {
          label: "Name",
          name: "name",
          type: "text",
          cols: "col-span-6",
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          cols: "col-span-6",
        },
        // {
        //   label: "Start Time",
        //   name: "time_start",
        //   type: "time",
        //   cols: "col-span-6",
        // },
        // {
        //   label: "End Time",
        //   name: "time_end",
        //   type: "time",
        //   cols: "col-span-6",
        // }
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
  const [hasOvertime, setHasOvertime] = useState(false);
  const [timeRanges, setTimeRanges] = useState<{ start: string; end: string }[]>([
    { start: "", end: "" }
  ]);

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

      setDataEd(datauser?.data);
      setData(datauser?.data);
      if (datauser?.data?.time_ranges?.length > 0) {
        setTimeRanges(datauser.data.time_ranges);
      } else {
        setTimeRanges([{
          start: datauser?.data?.time_start ?? "",
          end:   datauser?.data?.time_end   ?? "",
        }]);
      }
      setDataMaster(datauser?.master);
      let dataInput = [...dataform];

      setdataform([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const transformData = (data) => {
    const newData = { ...data };
    // Daftar properti yang perlu diubah
    const propertiesToTransform = ["shift_id"];

    propertiesToTransform.forEach((property) => {
      if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const OnSave = async () => {
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      // const transformedData = transformData(dataval);
      const transformedData = {
        ...transformData(dataval),
        time_start:   timeRanges[0]?.start ?? "",
        time_end:     timeRanges[0]?.end   ?? "",
        time_ranges:  timeRanges,
      };

      // const raw = JSON.stringify(transformedData);
      const raw = JSON.stringify(transformedData);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      var redirects = isPopup ? "" : `${pathname}?parent=158`;
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        redirects
      );
    } catch (error) {
      console.log("erro", error);
      setloading(false);
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
    const view = urlParams.get("view");
    setview(view);
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
              <fieldset className="border">
                <legend className="ml-2">
                  {new URLSearchParams(window.location.search).get("data") ===
                  null
                    ? "Create "
                    : ""}
                  Shift
                </legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
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
                {/* ── Dynamic Time Ranges ── */}
                <div className="col-span-12 ml-2 mr-2">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 700, color: "#333335" }}>
                      Work Time
                    </label>
                  </div>

                  {timeRanges.map((range, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex", gap: 12, alignItems: "flex-end",
                        marginBottom: 12, padding: "12px 14px",
                        background: idx === 0 ? "#F8FAFC" : "#FFF7ED",
                        borderRadius: 8,
                        border: `1px solid ${idx === 0 ? "#E5E7EB" : "#FED7AA"}`,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 4 }}>
                          {idx === 0 ? "START TIME" : `OVERTIME ${idx} START`}
                        </label>
                        <input
                          type="time"
                          value={range.start}
                          onChange={(e) => {
                            const next = [...timeRanges];
                            next[idx].start = e.target.value;
                            setTimeRanges(next);
                            // sync ke dataval untuk index 0
                            if (idx === 0) setData((prev: any) => ({ ...prev, time_start: e.target.value }));
                          }}
                          style={{
                            width: "100%", padding: "8px 10px",
                            border: "1px solid #D1D5DB", borderRadius: 6,
                            fontSize: 13,
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 4 }}>
                          {idx === 0 ? "END TIME" : `OVERTIME ${idx} END`}
                        </label>
                        <input
                          type="time"
                          value={range.end}
                          onChange={(e) => {
                            const next = [...timeRanges];
                            next[idx].end = e.target.value;
                            setTimeRanges(next);
                            if (idx === 0) setData((prev: any) => ({ ...prev, time_end: e.target.value }));
                          }}
                          style={{
                            width: "100%", padding: "8px 10px",
                            border: "1px solid #D1D5DB", borderRadius: 6,
                            fontSize: 13,
                          }}
                        />
                      </div>

                      {/* Hapus tombol — hanya untuk index > 0 */}
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => setTimeRanges(timeRanges.filter((_, i) => i !== idx))}
                          style={{
                            padding: "8px 12px", background: "#FEE2E2",
                            color: "#DC2626", border: "none", borderRadius: 6,
                            cursor: "pointer", fontWeight: 700, fontSize: 14,
                            flexShrink: 0, marginBottom: 1,
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {timeRanges.length < 3 && (
                    <button
                      type="button"
                      onClick={() => setTimeRanges([...timeRanges, { start: "", end: "" }])}
                      style={{
                        fontSize: 12, fontWeight: 600,
                        color: "#2563EB", background: "#EFF6FF",
                        border: "1px solid #BFDBFE", borderRadius: 6,
                        padding: "4px 12px", cursor: "pointer",
                      }}
                    >
                      + Add Overtime
                    </button>
                  )}
                </div>
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

                  {view !== "1" && (canCreate || canUpdate) && (
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
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPage;
