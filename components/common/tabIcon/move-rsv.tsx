import React, { useContext, useEffect, useRef, useState } from "react";
import InputMain from "../../common/input/InputMain";
import Seo from "../../common/seo";
import {
  FetchData,
  GFormatDate,
  GetDecrypt,
  GetEncrypt,
  GetNextDay,
  GetPathUri,
  GetQueryParam,
  GetQueryStr,
  GetSelisihDay,
  NumberClear,
  RouteChange,
  formatAmount,
  removeItem,
} from "../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../context/LayoutContext";
import { Value } from "sass";
import TabMenuIcon from "../../common/tabIcon/tab";
interface AddviewProps {
  uri?: string;
  isType?: string;
  queryString?: string;
  methodFetch?: string;
  isListParentGIT?: Number;
  editData?: boolean;
  isMaster?: boolean;
  isDeleted?: boolean;
  bodyFetch?:{},
  isCheckBox?: boolean;
  dataRsv?: any;
  isFolio?: boolean;
  saveBulk?: (idx) => void;
  onDataLoaded?: (data: any[]) => void;
  isCalculate?: boolean;
  keys?: string;
  isBtnAdd?: boolean,
  isBtnEdit?: boolean,
}
const AddView = (props: AddviewProps) => {
  const {
    uri,
    isType = "fit",
    queryString,
    methodFetch = "GET",
    isListParentGIT = 0,
    editData = true,
    isMaster = false,
    isDeleted = false,
    isCheckBox = false,
    bodyFetch = {},
    dataRsv,
    isFolio = false,
    onDataLoaded,
    saveBulk,
    isCalculate = true,
    keys = "0",
    isBtnAdd = true,
    isBtnEdit = true
  } = props;
  const router = useRouter();
  const ref = useRef(null);
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const [actAuto, setactAuto] = useState("-1");
  const [dataguest, setdataguest] = useState<any>([]);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>([]);
  const [dataform, setdataform] = useState<any>([]);
  // const [isedit, setisedit] = useState(false);
  const [editVal, setValedit] = useState(-1);
  const [calculate, setcalculate] = useState(false);
  const [idusr, setidusr] = useState("0");
  const [datapush, setDatapush] = useState<any>({});
  const [datatable, setdatatable] = useState<any>({});
  const GLOBALURI = uri;
  const Lastpath = window.location.pathname.split("/").pop();
  const [datavalsrc, setDatasrc] = useState<any>({status: { value: "-1", label: "ALL" }});
  const [isidSelected, setisidSelected] = useState<any>(-1);
  const [datadet, setdatadet] = useState<any>({});
  const [isSelected, setisSelected] = useState<any>(-1);
  const [isview, setisview] = useState(false);
  const [isedit, setisedit] = useState(false);
  const [isdeleted, setisDeleted] = useState(isDeleted);
  const GetDataTable = async (i?: any, page?: number, isloadmore?: boolean) => {
    setloading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sort = urlParams.get("sort") ?? "";
      var search = urlParams.get("search");
      var srcfield = urlParams.get("search_field")
        ? "&search_field=" + urlParams.get("search_field")
        : "";
      var srcval = urlParams.get("search_value")
        ? "&search_value=" + urlParams.get("search_value")
        : "";

      let pages = 1;
      if (page) {
        pages = page;
      }
      const raw = JSON.stringify(bodyFetch);
      const aesraw = GetEncrypt(raw);
      const datajson = await FetchData(
        GLOBALURI +
          "?sort=" +
          sort +
          "&group=" +
          Lastpath +
          "&page=" +
          pages +
          "&search=" +
          (datavalsrc?.search ?? (search == null ? "" : search)) +
          "&" +
          (queryString ?? "") +
          "" +
          srcfield +
          "" +
          srcval,
        methodFetch,
        methodFetch == "GET" ? "" : aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        "",
      );
      if (datajson?.code == "200") {
        if (onDataLoaded) {
          onDataLoaded(datajson?.data ?? []);
        }

        if (isidSelected != -1) {
          datajson?.data?.map((rw) => {
            if (isidSelected == rw?.id) {
              setdatadet(rw);
            }
          });
        }

        setloading(false);
        if (!isloadmore) {
          setdatatable(datajson);
          setisSelected(GetQueryStr("data"));
          datajson?.data?.map((row: any, i) => {
            if (row?.id == GetQueryStr("data")) {
              setisSelected(i);
            }
          });
        } else {
          setisSelected(GetQueryStr("data"));
          datajson?.data?.map((row: any, i) => {
            if (row?.id == GetQueryStr("data")) {
              setisSelected(i);
            }
            datatable?.data?.push(row);
          });
          setdatatable({ ...datatable, ["pagging"]: datajson?.pagging });
        }
        if (datajson?.search_data) {
          setDatasrc(datajson?.search_data);
        }
        setisview(datajson?.permission?.view);
        setisedit(datajson?.permission?.edit);
        setisDeleted(datajson?.permission?.delete);
      } else {
        setloading(false);
      }
      return;
    } catch (error) {
      setloading(false);
      console.log("err", error);
      return;
    }
  };

  const changeHandler = (e: any, ia: number, ib: number, price?: boolean) => {
    var values = formatAmount(e.target.value);
    let dataInput: any = [...dataform];
    dataInput[0].items[ia].data[ib].value = price ? values : e.target.value;
    setdataform([...dataInput]);
  };

  const FinalPOstDat = (a, save?: boolean) => {
    var objpost: any = {};
    objpost = dataval;
    var arrCOl = [];
    var obj: any = {};
    dataform[0].items?.map((row: any, i) => {
      if (i == a) {
        row?.data?.map((rw, index) => {
          if (rw?.idpost) {
            obj[rw?.name] = rw?.value;
            obj[rw?.idpost] = rw?.valueid;
          } else {
            if (rw?.isprice) {
              obj[rw?.name] = NumberClear(rw?.value + "");
            } else {
              obj[rw?.name] = rw?.value;
            }
          }
          if (index == 0) {
            obj.check_out_date = GetNextDay(rw?.value, 1);
            obj.adult = rw?.adult;
            obj.child = rw?.child;
            obj.id = rw?.id;
            obj.type_reservation = isType;
            obj.is_list_parent_git = isListParentGIT;
            obj.status_reservation = keys == "0" ? "move_reservation" : keys;
            obj.is_calculate = calculate;
            if (isMaster) {
              if (rw?.is_parentfolio) {
                obj.is_parentfolio = rw?.is_parentfolio;
              }
            }
            if (rw?.is_subfolio) {
              obj.is_subfolio = rw?.is_subfolio;
            }
          }
        });
        arrCOl.push(obj);
      }
    });
    if (save) {
      objpost = obj;
    } else {
      objpost.reservation_list = arrCOl;
      objpost.type_reservation = isType;
      objpost.is_list_parent_git = isListParentGIT;
    }

    return objpost;
  };
  const GetDataAutoComp = async (word, uri, relate: any, ix, ia) => {
    try {
      let getuuri = "";
      if (relate) {
        var relatestr = "" + relate;
        var relatearr = relatestr.split(";");

        relatearr?.map((rw, index) => {
          var repstr = "[" + index + "]";
          uri = uri.replace(
            repstr,
            rw == "company"
              ? dataform[0].items[ix].data[0]?.company_id
              : dataform[0].items[ix].data[relatearr[index]]?.valueid == 0
              ? dataform[0].items[ix].data[relatearr[index]]?.value
              : dataform[0].items[ix].data[relatearr[index]]?.valueid
          );
        });
      }
      getuuri =
        uri.indexOf("?") == -1
          ? (relate
              ? uri + "/" + (dataform[0].items[ix].data[relate]?.valueid ?? 0)
              : uri) +
            "?search=" +
            word
          : uri + "&search=" + word;

      if (uri == "/cms/room-type/get-room") {
        var prmsrc = "";
        // dataform[0].items[ix].data[ia].value?.map((rw) => {
        //   prmsrc =
        //     "&idx_" + rw?.name + "=" + (rw?.value ? "1" : "0") + "" + prmsrc;
        // });
        // console.log("debug", dataform[0]);
        getuuri =
          getuuri +
          "" +
          prmsrc +
          "&check_in_date=" +
          (GetQueryStr("key") == "move_reservation"
            ? dataform[0].items[ix].data[2]?.value
            : dataform[0].items[ix].data[2]?.value) +
          "&check_out_date=" +
          (GetQueryStr("key") == "move_reservation"
            ? dataform[0].items[ix].data[3]?.value
            : dataform[0].items[ix].data[3]?.value) +
          //  GetNextDay(dataform[0].items[ix].data[3]?.value, 1)) +
          "&reservation=1&folio_id=" +
          GetQueryStr("data");
      }
      // console.log("debug", uri);

      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      setdataguest(data);
      return;
    } catch (error) {
      console.log("debug", error);
      return;
    }
  };
  const GetRate = async (a) => {
    try {
      let urisave = "/cms/reservation/charge";
      let mth = "POST";
      const raw = JSON.stringify(FinalPOstDat(a));

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
        // console.log(saveprocess);

        var price = -1;
        saveprocess?.data?.charge?.map((rw) => {
          price = rw?.value;
        });
        let dataInput: any = [...dataform];
        dataInput[0].items[a].data[5].value = price
          .toString()
          .replaceAll(".", "-")
          .replaceAll(",", ".")
          .replaceAll("-", ",");
        setdataform([...dataInput]);
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const onSelecteda = (rw: any, n: any, id: any, idat: any, name, ix, ia) => {
    var names = name.split("-");
    var objinames = {
      [name]: rw[names[0]] ?? "",
    };
    setData((dataval) => ({
      ...dataval,
      ...objinames,
    }));
    var objid = {
      [id]: rw?.id ?? "",
    };
    setData((dataval) => ({
      ...dataval,
      ...objid,
    }));
    dataform.map((rows: any, indexs) => {
      rows.data?.map((row: any, index) => {
        var obj = {
          [row?.name]: rw[row?.name] ?? "",
          [row?.name + "_ori"]: rw[row?.name] ?? "",
        };
        if (row?.name == "title") {
          obj = {
            [row?.name]: rw[row?.name]?.label ?? "",
          };
        }
        if (row?.sugestdata == n && rw[row?.name]) {
          if (ix == row?.parent) {
            setData((dataval) => ({
              ...dataval,
              ...obj,
            }));
          }
        }
      });
    });
    if (ia != -1) {
      let dataInput: any = [...dataform];
      dataInput[0].items[ix].data[ia].valueid = rw?.id;
      dataInput[0].items[ix].data[ia].value = rw[names[0]];
      setdataform([...dataInput]);
    }
    setTimeout(() => {
      if (name == "name-rate") {
        GetRate(ix);
      }
      if (name == "name-room_type") {
        // GetRoomConfig(ix, ia, rw?.id);
      }
    }, 800);
  };
  const OnSaveSugestion = async (a, id) => {
    setloading(true);
    try {
      const raw = JSON.stringify(FinalPOstDat(a, true));

      let urisave = "/cms/reservation-item/" + id + "";
      let mth = "PUT";

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
        setisedit(false);
        setValedit(-1);
        GetDataDetail(idusr);
        setloading(false);
      } else {
        setisedit(false);
        setValedit(-1);
        GetDataDetail(idusr);
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const changeHandlera = (e: any) => {
    var arry = [];
    dataval?.map((rw) => {
      arry.push(rw);
    });
    if (e.target.checked) {
      arry.push(e.target.value);
      setData((dataval) => [...dataval, e.target.value]);
    } else {
      // remove
      var pos = dataval.findIndex((val) => val == e.target.value);
      var arrpos = arry.findIndex((val) => val == e.target.value);
      if (pos >= 0) {
        dataval.splice(pos, 1);
        arry.splice(arrpos, 1);
      }
    }
    saveBulk(arry);
  };
  const ListTblGuest = (id, datI, name, ix, ia, isAdd) => {
    return (
      <>
        <div
          ref={ref}
          className="p-2 rounded-md w-[500px] z-50 border-black border-b-[1px] border-r-[1px] border-l-[1px] absolute bg-white"
        >
          <>
            <div className="table-responsive w-full">
              <table className={"shadow-lg table-auto w-full"}>
                <thead>
                  <tr className="">
                    {dataguest?.table?.map((row: any, i: any) => (
                      <>
                        {row.label != "No" && row.label != "Status" ? (
                          <td
                            title={"Sort By " + row.label}
                            key={i}
                            className="bg-[#232020] text-white p-2 font-bold cursor-pointer"
                          >
                            {row.label}
                          </td>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataguest?.data?.map((row: any, index) => (
                    <>
                      <tr
                        key={row?.id + "-" + index}
                        className={`${
                          index % 2 == 0 ? "bg-gray-300" : ""
                        } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] `}
                      >
                        {dataguest?.table?.map((item: any, a: any) => {
                          return item.row != 1 &&
                            item.key != "status" &&
                            item.key != "no" ? (
                            <td
                              key={item.key + "-" + a}
                              onClick={() => {
                                onSelecteda(row, "a", id, datI, name, ix, ia);
                                setactAuto("-1");
                              }}
                            >
                              {typeof row[item.key] == "string" ||
                              typeof row[item.key] == "number" ||
                              typeof row[item.key] == "boolean" ? (
                                row[item.key] == true &&
                                typeof row[item.key] == "boolean" ? (
                                  <img
                                    src="/assets/images/apps/checklist.png"
                                    className="w-[20px]"
                                  />
                                ) : row[item.key] == false &&
                                  typeof row[item.key] == "boolean" ? (
                                  <img
                                    src="/assets/images/apps/cross.png"
                                    className="w-[20px]"
                                  />
                                ) : item?.is_html ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: row[item.key],
                                    }}
                                  />
                                ) : (
                                  row[item.key]
                                )
                              ) : Array.isArray(row[item.key]) ? (
                                row[item.key]?.map((rw, i) => {
                                  return (
                                    <div
                                      className="bg-success px-1 py-1 text-white rounded-md mt-1 text-center"
                                      key={i}
                                    >
                                      {rw?.en ?? rw?.label}
                                    </div>
                                  );
                                })
                              ) : (
                                row[item.key]?.en ?? row[item.key]?.label
                              )}
                            </td>
                          ) : (
                            <></>
                          );
                        })}
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
              {dataguest?.data?.length <= 0 ? (
                isAdd ? (
                  <div className="flex w-full justify-center mt-2">
                    <ButtonSubmit
                      label="Add"
                      onCreate={() => {
                        setactAuto("-1");
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
          </>
        </div>
      </>
    );
  };
  const GetDataDetail = async (id) => {
    try {
      var dataFrm = [];
      let getuuri = uri;
      // console.log("widy", dataRsv);
      if (isMaster) {
        var obj = {
          noFolio: "",
          data: [
            {
              label: "Status",
              name: "status_reservation",
              type: "none",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: dataRsv?.status,
              required: true,
              valueid: 0,
              id: dataRsv?.id,
              is_parentfolio: true,
            },
            {
              label: "Guest",
              name: "name-guest",
              type: "text",
              cols: "col-span-12",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Guest Here.",
              idpost: "guest_profile_id",
              uri: "/cms/profile/guest",
              disable: false,
              AdduRi: "profile/guest/main?parent=82&add=1",
              required: true,
              valueid: dataRsv?.guest_profile_id,
              value: dataRsv?.guest,
              widthCus: "w-[185px]",
            },
            {
              label: "Check in",
              name: "check_in_date",
              type: "date",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              isDate: true,
              value: dataRsv?.reservation_items[0]?.check_in_date,
              required: true,
              valueid: 0,
              adult: dataRsv?.reservation_items[0]?.adult,
              child: dataRsv?.reservation_items[0]?.child,
              company_id: dataRsv?.company_profile_id,
              id: dataRsv?.id,
              is_parentfolio: true,
            },
            {
              label: "Check out",
              name: "check_out_date",
              type: "date",
              cols: "col-span-3",
              isDate: true,
              options: [{}],
              ismulti: false,
              valueid: 0,
              value: dataRsv?.reservation_items[0]?.check_out_date,
              required: true,
            },
            {
              label: "Room Type",
              name: "name-room_type",
              type: "text",
              cols: "col-span-8",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Type Here.",
              idpost: "room_type_id",
              relate: "0;1",
              uri: "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]",
              sugestdata: "a",
              value: "",
              valueid: 0,
              required: true,
            },
            {
              label: "Room",
              name: "name-room",
              type: "text",
              cols: "col-span-8",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Here.",
              idpost: "room_id",
              relate: "2",
              uri: "/cms/room-type/get-room",
              value: "",
              valueid: 0,
              required: false,
            },
          ],
        };
        dataFrm.push(obj);
        var dataFr = [
          {
            name: "main",
            items: dataFrm,
          },
        ];
        setdataform(dataFr);
        return;
      }
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
        // console.log("wdydts", data);
        data?.data.map((rw, index) => {
          var obj = {
            noFolio: rw?.folio_number,
            data: [
              {
                label: "Status",
                name: "status_reservation",
                type: "none",
                cols: "col-span-3",
                options: [{}],
                ismulti: false,
                value: rw?.status,
                required: true,
                valueid: 0,
                id: rw?.id,
                is_parentfolio: true,
              },
              {
                label: "Guest",
                name: "guest_name-guest",
                type: "text",
                cols: "col-span-12",
                options: [{}],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Guest Here.",
                idpost: "guest_profile_id",
                uri: "/cms/profile/guest",
                disable: false,
                AdduRi: "profile/guest/main?parent=82&add=1",
                required: true,
                valueid: rw?.guest_profile_id,
                value: rw?.guest,
                widthCus: "w-[185px]",
              },
              {
                label: "Check in",
                name: "check_in_date",
                type: "date",
                cols: "col-span-3",
                options: [{}],
                ismulti: false,
                isDate: true,
                value: rw?.check_in_date,
                required: true,
                valueid: 0,
                adult: rw?.adult,
                child: rw?.child,
                company_id: rw?.company_id,
                id: rw?.id,
                is_subfolio: isFolio,
              },
              {
                label: "Check out",
                name: "check_out_date",
                type: "date",
                cols: "col-span-3",
                options: [{}],
                ismulti: false,
                value: rw?.check_out_date,
                isDate: true,
                required: true,
                valueid: 0,
                adult: rw?.adult,
                child: rw?.child,
                id: rw?.id,
                company_id: rw?.company_id,
              },
              {
                label: "Room Type",
                name: "name-room_type",
                type: "text",
                cols: "col-span-8",
                options: [{}],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Type Here.",
                idpost: "room_type_id",
                relate: "0;1",
                uri:
                  "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]&rate_id=" +
                  rw?.rate_id,
                sugestdata: "a",
                value: rw?.room_type,
                valueid: rw?.room_type_id,
                required: true,
              },
              {
                label: "Room",
                name: "name-room",
                type: "text",
                cols: "col-span-8",
                options: [{}],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Here.",
                idpost: "room_id",
                relate: "4",
                uri: "/cms/room-type/get-room",
                value: rw?.room,
                valueid: rw?.room_id,
                required: false,
              },
            ],
          };
          dataFrm.push(obj);
        });

        var dataFr = [
          {
            name: "main",
            items: dataFrm,
          },
        ];
        setdatatable(data);
        setdataform(dataFr);
        // set
        return;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const [parent, setparent] = useState("0");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    let dataForms: any = [...dataform];
    setdataform([...dataForms]);
    setparent(idparent);
    if (idreq) {
      GetDataDetail(idreq);
      GetDataTable();
      // GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      // GetDetailUser(0);
      setidusr("0");
    }
  }, []);
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        setactAuto("-1");
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
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4"></div>
          <div className="col-span-8 h-fit"></div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-12 ">
              {isCalculate && (
                <>
                  <InputMain
                    typeInput="checkbox"
                    required={false}
                    label="Calculate"
                    error={false}
                    valuename="calculate"
                    valueSel={calculate}
                    onChangeSel={(e) => {
                      setcalculate(e.target.checked);
                    }}
                  />
                </>
              )}

              <div
                className={
                  actAuto == "-1"
                    ? " table-responsive"
                    : " w-full overflow-auto min-h-screen"
                }
              >
                <table className={"shadow-lg table-auto w-full gap-2"}>
                  <thead>
                    <tr className="">
                      {isCheckBox && (
                        <>
                          <td>Select</td>
                        </>
                      )}
                      <>
                        <td></td>
                      </>
                      {isFolio && (
                        <>
                          <td>#No</td>
                        </>
                      )}
                      {dataform[0]?.items[0]?.data?.map((row: any, i: any) => (
                        <td
                          title={"Sort By " + row.label}
                          key={i}
                          className="bg-[#232020] text-white p-2 font-bold cursor-pointer"
                        >
                          {row.label}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataform[0]?.items?.map((item: any, index) => (
                      <>
                        <tr
                          key={"-" + index}
                          className={`${
                            index % 2 == 0 ? "bg-gray-300" : ""
                          } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] `}
                          onDoubleClick={() => {
                            setisedit(true);
                            setValedit(index);
                          }}
                        >
                          {isCheckBox && (
                            <>
                              <td>
                                <input
                                  type={"checkbox"}
                                  id={item?.data[0]?.id}
                                  name={"nm_id"}
                                  value={item?.data[0]?.id}
                                  onChange={(e) => {
                                    changeHandlera(e);
                                  }}
                                />
                              </td>
                            </>
                          )}
                          <>
                            <td>
                              <>
                                <div className="flex gap-2">
                                  {isedit && isBtnEdit && editVal == index ? (
                                    <>
                                      <ButtonSubmit
                                        label="Close"
                                        isprimary={false}
                                        onCreate={() => {
                                          setisedit(false);
                                          setValedit(-1);
                                          GetDataDetail(idusr);
                                        }}
                                        ClassCustome="px-2 my-2"
                                      />
                                      <ButtonSubmit
                                        ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                                        ClassCustome="px-2 my-2"
                                        label="Save"
                                        onCreate={() => {
                                          OnSaveSugestion(
                                            index,
                                            item?.data[0]?.id
                                          );
                                        }}
                                        loading={loading}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {isBtnEdit && (
                                        <button
                                          className="w-[21px]"
                                          onClick={() => {
                                            setisedit(true);
                                            setValedit(index);
                                          }}
                                        >
                                          <img
                                            src="/assets/images/apps/edit.png"
                                            className="w-[21px]"
                                          />
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </>
                            </td>
                          </>
                          {isFolio && (
                            <>
                              <td>{item?.noFolio}</td>
                            </>
                          )}
                          {item?.data?.map((row: any, a: any) => (
                            <>
                              <td
                                key={row.name + "-" + a + "" + index}
                                onClick={() => {}}
                              >
                                <>
                                  {isedit && editVal == index ? (
                                    <>
                                      {row?.type != "hidden" ? (
                                        <div
                                          className={row?.cols + " relative "}
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
                                            required={false}
                                            label={""}
                                            rest={{
                                              disabled: row?.disable,
                                              autoComplete: row?.isAutoComp
                                                ? "off"
                                                : "on",
                                              name: row?.name,
                                              placeholder:
                                                row?.placeholder ?? row?.label,
                                              value: row?.value,
                                              type: row?.type,
                                              onChange: (e) => {
                                                changeHandler(
                                                  e,
                                                  index,
                                                  a,
                                                  row?.isprice
                                                );
                                              },
                                              onKeyUp: (e: any) => {
                                                if (row?.isAutoComp) {
                                                  if (
                                                    e.target?.value?.length > 1
                                                  ) {
                                                    setactAuto(a + index);
                                                    GetDataAutoComp(
                                                      e.target?.value,
                                                      row?.uri,
                                                      row?.relate,
                                                      index,
                                                      a
                                                    );
                                                  } else {
                                                    setactAuto("-1");
                                                  }
                                                }
                                                if (row?.isprice) {
                                                  changeHandler(
                                                    e,
                                                    index,
                                                    a,
                                                    row?.isprice
                                                  );
                                                }
                                              },
                                              onFocus: () => {
                                                if (row?.relate) {
                                                  setactAuto(a + index);
                                                  GetDataAutoComp(
                                                    "",
                                                    row?.uri,
                                                    row?.relate,
                                                    index,
                                                    a
                                                  );
                                                }
                                              },
                                            }}
                                            restArea={{
                                              placeholder: row?.label,
                                              name: row?.name,
                                              value: row?.value,
                                              onChange: (e) => {
                                                changeHandler(
                                                  e,
                                                  index,
                                                  a,
                                                  row?.isprice
                                                );
                                              },
                                            }}
                                            onChangeSel={(e) => {
                                              changeHandler(
                                                e,
                                                index,
                                                a,
                                                row?.isprice
                                              );
                                            }}
                                            valueSel={row?.value}
                                            options={row?.options}
                                            isMulti={row?.ismulti}
                                            valuename={row?.name}
                                            isAll={row?.isAll}
                                            colspan={row?.colcheckbox}
                                          />
                                          {row?.isAutoComp &&
                                          actAuto == a + index ? (
                                            <>
                                              {ListTblGuest(
                                                row?.idpost,
                                                0,
                                                row?.name,
                                                index,
                                                a,
                                                row?.AdduRi ?? false
                                              )}
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      ) : (
                                        <>{row?.value}</>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {row?.isDate
                                        ? GFormatDate(row?.value)
                                        : row?.value}
                                    </>
                                  )}
                                </>
                              </td>
                            </>
                          ))}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddView;
