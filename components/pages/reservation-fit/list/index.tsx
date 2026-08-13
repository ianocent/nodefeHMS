import ButtonAddList from "../../../common/button/ButtonAddList";
import PaperBase from "../../../common/paper/PaperBase";
import React, { useContext, useEffect, useRef, useState } from "react";
import Seo from "../../../common/seo";
import TableView from "../../../common/table-edit";
import InputMain from "../../../common/input/InputMain";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { useSelector } from "react-redux";

import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
} from "../../../helper";
import { useRouter } from "next/router";
import TabMenuIcon from "../../../common/tabIcon/tab";
interface ReservationFitprp {
  isType?: string;
}
const ListView = (props: ReservationFitprp) => {
  const { isType = "fit" } = props;
  const GLOBALURI = "/cms/reservation";
  const groups = "";
  const ref = useRef(null);
  const [loading, setloading] = useState(false);

  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [dataval, setData] = useState<any>({});
  const [datavala, setDataa] = useState<any>({});
  const [datadetail, setDataDetail] = useState<any>({});
  const [queryStr, setqueryStr] = useState("");
  const [isLoad, setIsload] = useState(true);
  const [popup, setpopup] = useState(false);

  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Stay Dates",
          name: "stay_dates",
          type: "select-multi",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Start Date",
          name: "start_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "End Date",
          name: "end_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Status Folio",
          name: "display_status",
          type: "select-multi",
          cols: "col-span-3",
          options: [{}],
          ismulti: true,
          isAll: false,
        },
      ],
    },
    {
      name: "main",
      data: [
        {
          label: "Message",
          name: "message",
          type: "textarea",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Remark",
          name: "remark",
          type: "textarea",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
      ],
    },
  ]);
  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    // setIsload(false);
    setqueryStr("");
    let qStr = "";
    // console.log("widylog", b + "-" + name + "-" + e?.target?.value + "-");
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      setData({ ...dataval, [e.target.name]: e.target.value });
      qStr = "&" + e.target.name + "=" + e?.target?.value;
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.forEach((element: any) => {
          valarr.push(element?.value);
          qStr += "&" + element?.value + "=true";
        });
      }
      setData({
        ...dataval,
        [name + "_ori"]: e,
        [name]: ismulti ? valarr : e?.value,
      });
      qStr = qStr + "&" + name + "=" + e?.value;
    } else if (b == "checkbox") {
      if (ismulti) {
        if (e.target.checked == true) {
          setData({ ...dataval, [e.target.value]: e.target.checked });
          qStr = "&" + e.target.value + "=" + e.target.checked;
        }
        let valarr = [];
        options?.map((row) => {
          if (dataval[row?.value]) {
            valarr.push(row?.value);
          }
        });
        setData({ ...dataval, [name]: valarr });
      } else {
        setData({ ...dataval, [name]: e.target.checked });
        qStr = "&" + name + "=" + e.target.checked;
      }
    }
    // setError("");

    var objVal = Object.keys(dataval);
    objVal?.map((val) => {
      if (dataval[val]) {
        if (val != name && val != e?.target?.name && val != e?.target?.value) {
          console.log("bs", val + "-" + name);
          qStr = "&" + val + "=" + dataval[val] + qStr;
        }
      }
    });
    setqueryStr(qStr);
    setIsload(true);

    router.replace({
      pathname: window.location.pathname,
      query: {
        parent: parentid,
        req: 1,
        time: new Date().getTime(),
      },
    });
  };
  const changeHandlera = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    // setIsload(false);
    // console.log("widylog", b + "-" + name + "-" + e?.target?.value + "-");
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      setDataa({ ...datavala, [e.target.name]: e.target.value });
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      setDataa({
        ...datavala,
        [name + "_ori"]: e,
        [name]: ismulti ? valarr : e?.value,
      });
    } else if (b == "checkbox") {
      if (ismulti) {
        if (e.target.checked == true) {
          setDataa({ ...datavala, [e.target.value]: e.target.checked });
        }
        let valarr = [];
        options?.map((row) => {
          if (dataval[row?.value]) {
            valarr.push(row?.value);
          }
        });
        setDataa({ ...datavala, [name]: valarr });
      } else {
        setDataa({ ...datavala, [name]: e.target.checked });
      }
    }
    // setError("");

    setIsload(true);
  };
  const GetDetailData = async (i: any) => {
    try {
      let getuuri = "/cms/reservation/master";

      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      let dataInput = [...dataform];
      dataInput[0].data[0].options = datauser?.master?.stay_dates;
      dataInput[0].data[3].options = datauser?.master?.display_status;

      setdataform([...dataInput]);
      dataform?.map((row) => {
        var dataobj = { [row?.name]: datauser?.data[row?.name] };
        setData((dataval) => ({ ...dataval, ...dataobj }));
      });

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetDataDetail = async () => {
    try {
      let getuuri = "/cms/reservation/" + GetQueryStr("data");

      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data?.code == "200") {
        setDataDetail(data);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const ContentPopUp = (key) => {
    return (
      <>
        <div className="p-4 font-bold">
          <h1>{datadetail?.data?.folio}</h1>
        </div>
        <div className="flex justify-center p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              {dataform[1].data?.map((row: any, index) => (
                <>
                  {row?.type != "hidden" ? (
                    <div className={row?.cols + " relative "}>
                      {(GetQueryStr("key") == "add_message" &&
                        row?.name == "message") ||
                      (GetQueryStr("key") == "view_message" &&
                        row?.name == "message") ? (
                        <TableView
                          uri="/cms/message"
                          queryString={"&folio_id=" + GetQueryStr("data")}
                          groups=""
                          isEditTable={true}
                          isTitle={true}
                          isDeleted={false}
                          isBtnAdd={true}
                          isPageing={false}
                        />
                      ) : (
                        <></>
                      )}
                      {(GetQueryStr("key") == "add_remark" &&
                        row?.name == "remark") ||
                      (GetQueryStr("key") == "view_remark" &&
                        row?.name == "remark") ? (
                        <InputMain
                          typeInput={
                            row?.type == "text" ||
                            row?.type == "number" ||
                            row?.type == "date"
                              ? "base"
                              : row?.type
                          }
                          error={false}
                          required={true}
                          label={row?.label}
                          rest={{
                            name: row?.name,
                            placeholder: row?.placeholder ?? row?.label,
                            value:
                              datavala[row?.name] ?? row?.name == "message"
                                ? datadetail?.data?.message
                                : datadetail?.data?.remark,
                            type: row?.type,
                            onChange: (e) => {
                              changeHandlera(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: datavala[row?.name] ?? datavala[row?.name],
                            onChange: (e) => {
                              changeHandlera(e, row?.type, row?.name);
                            },
                            disabled:
                              key == "add_message" || key == "add_remark"
                                ? false
                                : true,
                          }}
                          onChangeSel={(e) => {
                            changeHandlera(
                              e,
                              row?.type,
                              row?.name,
                              row?.ismulti,
                              row?.options
                            );
                          }}
                          valueSel={
                            row?.ismulti
                              ? datavala[row?.name + "_ori"] ??
                                datavala[row?.name + "_ori"]
                              : datavala[row?.name] ?? datavala[row?.name]
                          }
                          options={row?.options}
                          isMulti={row?.ismulti}
                          valuename={row?.name}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </div>
            <div className="col-span-4 flex gap-2">
              <ButtonSubmit
                label="Cancel"
                onCreate={() => {
                  setpopup(false);
                  ResetPath();
                }}
                isprimary={false}
              />
              {key == "add_remark" ? (
                <ButtonSubmit
                  label="Save"
                  onCreate={() => {
                    OnSaveMsgRmk();
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  const OnSaveMsgRmk = async () => {
    // console.log("widylog", dataval);
    try {
      let urisave = GLOBALURI + "/create";
      let mth = "POST";
      const raw = JSON.stringify(datavala);
      urisave = GLOBALURI + "/data/" + GetQueryStr("data") + "";
      mth = "PUT";

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
        //
        setpopup(false);
        // ResetPath();
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const ResetPath = () => {
    setData({});
    setDataa({});
    setqueryStr("");
    router.replace({
      pathname: window.location.pathname,
      query: {
        parent: new URLSearchParams(window.location.search).get("parent"),
        data: GetQueryStr("data"),
      },
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("data");
    const view = urlParams.get("view");
    const body = urlParams.get("body");

    setparentid(parent);
    setadd(add);
    setview(view);
    GetDetailData(0);
  }, []);
  function filterCom() {
    return (
      <>
        <fieldset className="mb-2">
          <legend>Filter</legend>
          <div className="sm:grid grid-cols-12 h-fit gap-4 ml-2 mb-2 mr-2">
            <div className="col-span-12">
              <div className="sm:grid grid-cols-12 h-fit gap-4  mb-2 mt-2 mr-2">
                {dataform[0].data?.map((row: any) => (
                  <div
                    className={
                      row?.cols +
                      (row?.type == "checkbox" && row?.name != "fields"
                        ? " border  border-dashed !border-blue rounded-md p-2 "
                        : "")
                    }
                  >
                    <InputMain
                      typeInput={
                        row?.type == "text" ||
                        row?.type == "number" ||
                        row?.type == "date"
                          ? "base"
                          : row?.type
                      }
                      error={false}
                      required={true}
                      label={row?.label}
                      rest={{
                        name: row?.name,
                        placeholder: row?.label,
                        value: dataval[row?.name] ?? dataval[row?.name],
                        type: row?.type,
                        onChange: (e) => {
                          changeHandler(e, row?.type, row?.name);
                        },
                        min: row?.mindate,
                      }}
                      restArea={{
                        placeholder: row?.label,
                        name: row?.name,
                        value: dataval[row?.name] ?? dataval[row?.name],
                        onChange: (e) => {
                          changeHandler(e, row?.type, row?.name);
                        },
                      }}
                      onChangeSel={(e) => {
                        changeHandler(
                          e,
                          row?.type,
                          row?.name,
                          row?.ismulti,
                          row?.options
                        );
                      }}
                      valueSel={
                        dataval[row?.name + "_ori"] ?? dataval[row?.name]
                      }
                      options={row?.options}
                      isMulti={row?.ismulti}
                      valuename={"b" + row?.name}
                      colspan={row?.isOneColumn ? "col-span-12" : "0"}
                      isAll={row?.isAll}
                      valMulti={dataval}
                    />
                  </div>
                ))}
                <div className="col-span-3 flex items-end ">
                  <div className="">
                    <ButtonSubmit
                      label="Reset"
                      onCreate={() => {
                        ResetPath();
                      }}
                      isprimary={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-span-4">
              <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2"></div>
            </div> */}
          </div>
        </fieldset>
      </>
    );
  }
  useEffect(() => {
    // console.log(isType);
    const urlParams = new URLSearchParams(window.location.search);
    const getkey = urlParams.get("key");
    console.log("wdy", getkey);
    if (getkey == "add_message") {
      setpopup(true);
      GetDataDetail();
      var objmsg = {
        ["type"]: "message",
      };
      setDataa((datavala) => ({
        ...datavala,
        ...objmsg,
      }));
    } else if (getkey == "add_remark") {
      setpopup(true);
      GetDataDetail();
      var objmsg = {
        ["type"]: "remark",
      };
      setDataa((datavala) => ({
        ...datavala,
        ...objmsg,
      }));
    } else if (getkey == "view_remark") {
      setpopup(true);
      GetDataDetail();
    } else if (getkey == "view_message") {
      setpopup(true);
      GetDataDetail();
    } else if (getkey == "move_reservation") {
      setpopup(true);
      GetDataDetail();
    } else {
      setpopup(false);
      setDataa({});
    }
  }, [window.location.search]);
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        if (popup) {
          router.replace({
            pathname: window.location.pathname,
            query: {
              parent: new URLSearchParams(window.location.search).get("parent"),
            },
          });
          setpopup(false);
        }

        // setoverflow(true);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      {/* {popup ? (
        <div className="overlay">
          <div
            ref={ref}
            className="w-[30%] relative h-min-max bg-white z-20 top-[200px] left-[40%]"
          >
            {ContentPopUp(
              new URLSearchParams(window.location.search).get("key")
            )}
          </div>
        </div>
      ) : (
        <></>
      )} */}
      <div className="mt-2 min-w-full table-auto">
        {isLoad ? (
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            isTitle={false}
            queryString={
              (isType == "fit"
                ? "&fit=1"
                : isType == "git"
                ? "&git=1"
                : isType == "vr"
                ? "&vr=1"
                : isType == "day-use"
                ? "&dayuse=1"
                : "&vr=1") + queryStr
            }
            isAdvance={true}
            filter={filterCom()}
            isNAudit={false}
            isBtnAdd={false}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ListView;
