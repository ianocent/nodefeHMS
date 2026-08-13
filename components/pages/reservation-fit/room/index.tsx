import React, { useContext, useEffect, useRef, useState } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
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
  GFormatDate,
  getColor,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import GuestAdd from "../../guest/form/index";
import CompanyAdd from "../../company-profile/form/index";
import { Value } from "sass";
import TabMenuIcon from "../../../common/tabIcon/tab";
import TableReservatuinView from "../../../common/table-reservation";
import MoveRsv from "../../../common/tabIcon/move-rsv";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";
import TextareaBase from "../../../common/input/TextareaBase";
import ModalBulkChangeDate from "../../../common/modal/ModalBulkChangeDate";

interface AddviewProps {
  isview?: boolean;
  isType?: string;
}
const AddView = (props: AddviewProps) => {
  const { isview = false, isType = "fit" } = props;
  const GLOBALURI = "/cms/reservation";
  const router = useRouter();
  const ref = useRef(null);
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const [isParentGIT, setisParentGIT] = useState(false);
  const [actAuto, setactAuto] = useState("-1");
  const [stsRsv, setstsRsv] = useState(-1);
  const [dataguest, setdataguest] = useState<any>([]);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({ type_reservation: isType });
  const [bulkData, setBulkData] = useState<any>([]);
  const [getDataFolio, setgetDataFolio] = useState<any>([]);
  const [remarkGitCancel, setremarkGitCancel] = useState("");
  const [dataform, setdataform] = useState<any>([]);
  const [isedit, setEdit] = useState(false);
  const [Isremarks, setIsremark] = useState(false);
  const [editVal, setValedit] = useState(-1);
  const [reasonOpt, setreasonOpt] = useState<any>([]);
  const [reasonVal, setreasonVal] = useState<any>({});
  const { canCreate, canUpdate } = useFormPermission(62);
  // const changeRoomGit = datalocal?.data?.permissions?.[3]?.access?.[4]?.transaction_actions?.change_room === true;
  const canChangeRoom = useTransactionPermission("change_room");
  const canChangeCompany = useTransactionPermission("change_company");
  const canChangeRate = useTransactionPermission("change_rate");
  const canChangeRateCode = useTransactionPermission("change_rate_code");
  const canCheckIn = useTransactionPermission("check_in");
  const canCheckOut = useTransactionPermission("check_out");
  const canCancelRsv = useTransactionPermission("cancel_reservation");
  const [showChangeDateModal, setShowChangeDateModal] = useState(false);
  const [sampleCheckIn, setSampleCheckIn] = useState<string>("");
  const [sampleCheckOut, setSampleCheckOut] = useState<string>("");

  const handleBulkChangeDate = () => {
    if (bulkData.length === 0) {
      toast.error("Please select at least one reservation");
      return;
    }
  
    if (getDataFolio?.data?.childFolio?.length > 0) {
      const first = getDataFolio.data.childFolio[0];
      setSampleCheckIn(first.check_in_date || "");
      setSampleCheckOut(first.check_out_date || "");
    }
  
    setShowChangeDateModal(true);
  };
  
  const handleConfirmChangeDate = async (newCheckIn: string, newCheckOut: string) => {
    setloading(true);
    try {
      const payload = {
        status_reservation: "change_date",
        folio_ids: bulkData,
        check_in_date: newCheckIn,
        check_out_date: newCheckOut,
        remark: "Bulk date change",
      };
  
      const raw = JSON.stringify(payload);
      const aesraw = GetEncrypt(raw);
  
      const response = await FetchData(
        "/cms/reservation/update-bulk",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (response?.code === 200) {
        toast.success("Dates updated successfully");
        GetDataFolion();
        setBulkData([]);
      } else {
        toast.error(response?.message || "Failed to update dates");
      }
    } catch (err) {
      toast.error("Error during bulk date update");
      console.error(err);
    } finally {
      setloading(false);
      setShowChangeDateModal(false);
    }
  };

  const [idusr, setidusr] = useState("0");

  const changeHandler = (e: any, ia: number, ib: number, price?: boolean) => {
    var values = formatAmount(e.target.value);
    if (price) {
      if (e.target.value == 0) {
        values = e.target.value;
      }
    }

    let dataInput: any = [...dataform];
    // dataInput[0].items[ia].data[ib].valueid = e;
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
            } else if (rw?.label == "Doc Date") {
              var splitdate = rw?.value.split("/");
              console.log(
                splitdate[2] + "-" + splitdate[1] + "-" + splitdate[0]
              );
              // var str = mydate.toString("YYYY-MM-DD");
              obj[rw?.name] =
                splitdate[2] + "-" + splitdate[1] + "-" + splitdate[0];
            } else {
              obj[rw?.name] = rw?.value;
            }
          }
          if (index == 0) {
            obj.check_out_date = GetNextDay(rw?.value, 1);
            obj.adult = rw?.adult;
            obj.child = rw?.child;
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
            rw == "dateadd"
              ? GetNextDay(dataform[0].items[ix].data[0]?.value, 1)
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

        getuuri =
          getuuri +
          "" +
          prmsrc +
          "&check_in_date=" +
          dataform[0].items[ix].data[0]?.value +
          "&check_out_date=" +
          GetNextDay(dataform[0].items[ix].data[0]?.value, 1) +
          "&reservation=1&folio_id=" +
          GetQueryStr("data");
      }
      if (getuuri.split("&rate_id=").length == 2) {
        // &rate_id=" +
        //   dataform[0].items[ix].data[3]?.valueid
        getuuri =
          getuuri.split("&rate_id=")[0] +
          "&rate_id=" +
          dataform[0].items[ix].data[4]?.valueid;
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
        console.log(saveprocess);

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
  const GetDataFolion = async () => {
    try {
      let urisave = "/cms/reservation/" + GetQueryStr("data") + "/update";
      let mth = "GET";

      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setstsRsv(saveprocess?.data?.reservation?.status_reservation?.value);
        setgetDataFolio(saveprocess);
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
  // const OnSaveSugestion = async (a, id) => {
  //   setloading(true);
  //   try {
  //     const raw = JSON.stringify(FinalPOstDat(a, true));

  //     let urisave = "/cms/reservation-item/" + id + "";
  //     let mth = "PUT";

  //     const aesraw = GetEncrypt(raw);
  //     const saveprocess = await FetchData(
  //       urisave,
  //       mth,
  //       aesraw,
  //       false,
  //       datalocal?.data?.access_token,
  //       router,
  //       ""
  //     );
  //     if (saveprocess?.code == "200") {
  //       setEdit(false);
  //       setValedit(-1);
  //       GetDataDetail(idusr);
  //       setloading(false);
  //     } else {
  //       setEdit(false);
  //       setValedit(-1);
  //       GetDataDetail(idusr);
  //       setloading(false);
  //     }
  //   } catch (error) {
  //     console.log("erro", error);
  //     setloading(false);
  //   }
  // };
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [pendingEditIndex, setPendingEditIndex] = useState<number | null>(null);
  const [pendingEditId, setPendingEditId] = useState<number | null>(null);
  const OnSaveSugestion = (index: number, id: number) => {
    setPendingEditIndex(index);
    setPendingEditId(id);
    setShowApplyModal(true);
  };

  // Fungsi baru untuk handle pilihan modal
  const handleApplyChanges = async (
    mode: "single" | "following" | "all"
  ) => {
    if (pendingEditIndex === null || pendingEditId === null) return;

    setloading(true);

    try {
      const editData = {
        ...FinalPOstDat(pendingEditIndex, true),
        apply_mode: mode,
      };

      const raw = JSON.stringify(editData);

      const saveprocess = await FetchData(
        `/cms/reservation-item/${pendingEditId}`,
        "PUT",
        GetEncrypt(raw),
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (saveprocess?.code === "200") {
        setEdit(false);
        setValedit(-1);
        setPendingEditIndex(null);
        setPendingEditId(null);
        GetDataDetail(idusr);
        setloading(false);
      } else {
        setloading(false);
      }

      GetDataDetail(idusr);
    } finally {
      setEdit(false);
      setValedit(-1);
      setloading(false);
      setShowApplyModal(false);
      GetDataDetail(idusr);
    }
  };
  const ListTblGuest = (id, datI, name, ix, ia, isAdd) => {
    return (
      <>
        <div
          ref={ref}
          className="p-2 rounded-md w-[500px] z-50 border-black border-b-[1px] border-r-[1px] border-l-[1px] absolute bg-white"
        >
          <>
            <div className="w-full">
              <table className={"shadow-lg table-auto w-full rounded-md"}>
                <thead>
                  <tr className="">
                    {dataguest?.table?.map((row: any, i: any) => (
                      <>
                        {row.label != "No" && row.label != "Status" ? (
                          <td
                            title={"Sort By " + row.label}
                            key={i}
                            className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
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
                                      className={
                                        row?.is_color
                                          ? getColor(row.color) +
                                            " px-1 py-1 text-white rounded-md mt-1 text-center"
                                          : "bg-success px-1 py-1 text-white rounded-md mt-1 text-center"
                                      }
                                      key={i}
                                      dangerouslySetInnerHTML={{
                                        __html: rw?.en ?? rw?.label,
                                      }}
                                    ></div>
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
      let getuuri =
        "/cms/reservation-item?sort=&group=room&page=1&search=&folio_id=" + id;
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
        setreasonOpt(data?.master?.reasons);
        data?.data.map((rw, index) => {
          var obj = {
            data: [
              {
                label: "Doc Date",
                name: "check_in_date",
                type: "none",
                cols: "col-span-3",
                options: [{}],
                ismulti: false,
                value: rw?.date,
                valueFormat: GFormatDate(rw?.date),
                required: true,
                valueid: 0,
                adult: rw?.adult,
                child: rw?.child,
                id: rw?.id,
                widthCus: "w-[180px]",
              },
              {
                label: "Company",
                name: "name-company",
                type: "text",
                cols: "col-span-12",
                options: [{}],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Company Here.",
                idpost: "company_profile_id",
                uri: "/cms/profile/company",
                // disable: false,
                AdduRi: "profile/company/main?parent=83&add=1",
                required: true,
                valueid: rw?.company_idx,
                value: rw?.company_id,
                widthCus: "w-[185px]",
                disable: !canChangeCompany,
                readOnly: !canChangeCompany,
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
                relate: "0;dateadd",
                uri: "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]&rate_id=0",
                sugestdata: "a",
                value: rw?.room_type_id?.label,
                valueid: rw?.room_type_id?.value,
                required: true,
                widthCus: "w-[120px]",
                disable: !canChangeRoom,
                readOnly: !canChangeRoom,
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
                value: rw?.room_id?.label,
                valueid: rw?.room_id?.value,
                required: false,
                widthCus: "w-[120px]",
                disable: !canChangeRoom,
                readOnly: !canChangeRoom,
              },
              {
                label: "Rate Code",
                name: "name-rate",
                type: "text",
                cols: "col-span-8",
                options: [{}],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Rate Here.",
                idpost: "rate_id",
                relate: "1;0;dateadd",
                uri: "/cms/reservation/rate-by-company-id?company_profile_id=[0]&check_in_date=[1]&check_out_date=[2]",
                value: rw?.rate?.label,
                valueid: rw?.rate?.value,
                required: true,
                widthCus: "w-[150px]",
                disable: !canChangeRateCode,
                readOnly: !canChangeRateCode,
              },
              {
                label: "Rate",
                name: "total",
                type: "text",
                cols: "col-span-4",
                options: [{}],
                ismulti: false,
                sugestdata: "a",
                parent: 0,
                // disable: false,
                disable: !canChangeRate,
                readOnly: !canChangeRate,
                required: true,
                value: rw?.total,
                isprice: true,
              },
              {
                label: "Extra Bed",
                name: "total_extra_bed",
                type: "text",
                cols: "col-span-4",
                options: [{}],
                ismulti: false,
                sugestdata: "a",
                parent: 0,
                required: true,
                value: rw?.total_extra_bed,
                isprice: true,
                disable: !canChangeRate,
                readOnly: !canChangeRate,
              },
              {
                label: "Remark",
                name: "name-remark",
                type: "text",
                cols: "col-span-8",
                options: [{}],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Type Here.",
                idpost: "remark_room",
                relate: "0;dateadd",
                uri: "/cms/setup?sort=&group=remark-room&page=1&search=&",
                sugestdata: "a",
                value: rw?.remark_room?.label,
                valueid: rw?.remark_room?.value,
                required: true,
                widthCus: "w-[180px]",
              },
              {
                label: "M Segment 1",
                name: "name-market-segment-1",
                type: data?.market_property?.is_market_segment_1
                  ? "text"
                  : "hidden",
                cols: "col-span-8",
                options: [],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Type Here.",
                idpost: "market_segment_1",
                relate: "0;dateadd",
                uri: "/cms/setup?sort=&group=market-segment-1&page=1&search=&",
                sugestdata: "a",
                value: rw?.market_segment_1?.label,
                valueid: rw?.market_segment_1?.value,
                required: true,
                widthCus: "w-[150px]",
              },
              {
                label: "M Segment 2",
                name: "name-market-segment-2",
                type: data?.market_property?.is_market_segment_2
                  ? "text"
                  : "hidden",
                cols: "col-span-8",
                options: [],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Type Here.",
                idpost: "market_segment_2",
                relate: "0;dateadd",
                uri: "/cms/setup?sort=&group=market-segment-2&page=1&search=&",
                sugestdata: "a",
                value: rw?.market_segment_2?.label,
                valueid: rw?.market_segment_2?.value,
                required: true,
                widthCus: "w-[150px]",
              },
              {
                label: "M Segment 3",
                name: "name-market-segment-3",
                type: data?.market_property?.is_market_segment_3
                  ? "text"
                  : "hidden",
                cols: "col-span-8",
                options: [],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Type Here.",
                idpost: "market_segment_3",
                relate: "0;dateadd",
                uri: "/cms/setup?sort=&group=market-segment-3&page=1&search=&",
                sugestdata: "a",
                value: rw?.market_segment_3?.label,
                valueid: rw?.market_segment_3?.value,
                required: true,
                widthCus: "w-[150px]",
              },
              {
                label: "M Segment 4",
                name: "name-market-segment-4",
                type: data?.market_property?.is_market_segment_4
                  ? "text"
                  : "hidden",
                cols: "col-span-8",
                options: [],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Type Here.",
                idpost: "market_segment_4",
                relate: "0;dateadd",
                uri: "/cms/setup?sort=&group=market-segment-4&page=1&search=&",
                sugestdata: "a",
                value: rw?.market_segment_4?.label,
                valueid: rw?.market_segment_4?.value,
                required: true,
                widthCus: "w-[150px]",
              },
              {
                label: "Source",
                name: "name-source",
                type: "text",
                cols: "col-span-8",
                options: [],
                ismulti: false,
                isAutoComp: true,
                placeholder: "Search Room Type Here.",
                idpost: "source",
                relate: "0;dateadd",
                uri: "/cms/setup?sort=&group=source&page=1&search=&",
                sugestdata: "a",
                value: rw?.source?.label,
                valueid: rw?.source?.value,
                required: true,
                widthCus: "w-[150px]",
              },

              {
                label: "Staf",
                name: "staf",
                type: "none",
                cols: "col-span-4",
                options: [{}],
                ismulti: false,
                sugestdata: "a",
                parent: 0,
                disable: false,
                required: true,
                value: rw?.updated_by,
              },
            ],
            action_table: rw?.action_table,
          };
          dataFrm.push(obj);
        });
        var dataFr = [
          {
            name: "main",
            items: dataFrm,
          },
        ];
        // console.log(dataFr);
        setdataform(dataFr);
        setisParentGIT(data?.folio?.is_parent_git);

        // set
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const [parent, setparent] = useState("0");

  const OnSaveMsgRmk = async (key) => {
    // console.log("widylog", dataval);
    setloading(true);
    try {
      let urisave = "/cms/reservation/update-bulk";
      let mth = "POST";
      let datapost = {
        status_reservation: key,
        remark: remarkGitCancel,
        folio_ids: bulkData,
        reason: reasonVal.value,
      };

      // check if bulkData is empty
      if (bulkData.length == 0) {
        toast("Please select at least one reservation", {
          autoClose: 6000,
          type: "error",
          position: "bottom-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setloading(false);
        return;
      }

      const raw = JSON.stringify(datapost);

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
        window.location.assign(
          "/reservation/git/reservation/?parent=" +
            GetQueryStr("parent") +
            "&data=" +
            GetQueryStr("data") +
            "&time=1729590399828&card=0&pageload=&group=git"
        );
      } else {
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      // console.log("erro", error);
    }
  };

  const OnSaveParentGIT = async () => {
    // console.log("widylog", dataval);
    setloading(true);
    try {
      let urisave = "/cms/reservation/update-room-parent-git";
      let mth = "PUT";
      // check if bulkData is empty

      const raw = JSON.stringify(dataval);
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
      setloading(false);
      if (saveprocess?.code == "200") {
        // sleep 2
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setloading(false);
      // console.log("erro", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    let dataForms: any = [...dataform];
    setdataform([...dataForms]);
    setparent(idparent);
    if (idreq) {
      GetDataDetail(idreq);
      // GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      // GetDetailUser(0);
      setidusr("0");
    }
    GetDataFolion();
  }, []);
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        setactAuto("-1");
        // setoverflow(true);
        if (Isremarks) {
          setIsremark(false);
        }
      }
    };
    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);

  return (
    <>
      {Isremarks ? (
        <div className="overlay">
          <div
            ref={ref}
            className={
              "w-[77%] relative max-h-[calc(100vh-140px)] bg-white z-50 top-[95px] left-[19%] "
            }
          >
            <div className=" overflow-y-auto">
              <div className="w-full mt-4 p-4">
                <InputMain
                  label="Reason"
                  error={false}
                  required={true}
                  typeInput="select-multi"
                  valueSel={reasonVal}
                  options={reasonOpt}
                  onChangeSel={(e) => {
                    setreasonVal(e);
                  }}
                  isMulti={false}
                />
                <TextareaBase
                  error={false}
                  label={"Remark"}
                  rest={{
                    onChange: (e) => {
                      console.log(e.target.value);
                      setremarkGitCancel(e.target.value);
                    },
                  }}
                  required={true}
                />
                <div className="flex mt-4 gap-2 mb-">
                  {" "}
                  <ButtonSubmit
                    label="Cancel"
                    isprimary={false}
                    loading={loading}
                    // ClassPrimary="ti-btn ti-btn-warning !bg-red !text-white !font-medium"
                    onCreate={() => {
                      setIsremark(false);
                    }}
                  />
                  <ButtonSubmit
                    label="Confirm"
                    isprimary={true}
                    loading={loading}
                    // ClassPrimary="ti-btn ti-btn-warning !bg-red !text-white !font-medium"
                    onCreate={() => {
                      // setIsremark(true);
                      OnSaveMsgRmk("cancel_reservation");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Seo title={"Management " + layout?.title} />

      <TabMenuIcon actMenu={""} id={GetQueryStr("data")} foliodat={""} />
      {!isParentGIT ? (
        <div className="flex flex-col gap-4">
          {isview ? (
            <div className="absolute h-full w-full bg-[rgba(0,0,0,0.61)] z-20"></div>
          ) : (
            <></>
          )}

          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed mt-2">
            <div className="col-span-4">
              <h2 className="text-lg font-bold capitalize">
                {"Room " +
                  GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")}
              </h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>

          <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
              <div className="col-span-12 ">
                <div
                  className={
                    actAuto == "-1"
                      ? " table-responsive"
                      : " table-responsive overflow-auto min-h-screen"
                  }
                >
                  <table className={"shadow-lg table-auto w-full rounded-md"}>
                    <thead>
                      <tr className="">
                        <td className="bg-[#323A50] text-white p-2 rounded-tl-lg"></td>
                        {dataform[0]?.items[0]?.data?.map((row: any, i: any) => {
                          if (row?.type === "hidden") return null;

                          // Hitung posisi di antara kolom yang visible
                          const visibleColumns = dataform[0]?.items[0]?.data?.filter(
                            (r: any) => r?.type !== "hidden"
                          );

                          const currentIndex = visibleColumns.findIndex(
                            (r: any) => r.label === row.label
                          );

                          const isFirst = currentIndex === 0;
                          const isLast = currentIndex === visibleColumns.length - 1;

                          return (
                            <td
                              title={"Sort By " + row.label}
                              key={i}
                              className={`
                                bg-[#323A50] text-white p-2 font-bold cursor-pointer
                                ${isFirst ? '' : ''}
                                ${isLast ? 'rounded-tr-lg' : ''}
                                ${row?.label === "Doc Date" ? "w-[100px]" : ""}
                              `}
                            >
                              <div className={row?.label === "Doc Date" ? "w-[70px]" : ""}>
                                {row.label}
                              </div>
                            </td>
                          );
                        })}
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
                          >
                            <>
                              <td>
                                <>
                                  {item?.action_table ? (
                                    <div className="flex">
                                      {isedit && editVal == index ? (
                                        <>
                                          <ButtonSubmit
                                            label="Close"
                                            isprimary={false}
                                            onCreate={() => {
                                              setEdit(false);
                                              setValedit(-1);
                                              GetDataDetail(idusr);
                                            }}
                                            ClassCustome="px-2 my-2"
                                          />
                                          <ButtonSubmit
                                            ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                                            ClassCustome="px-2 my-2"
                                            label="Save"
                                            isBtnAdd={canCreate && canUpdate}
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
                                          {stsRsv != 1 &&
                                            stsRsv != 2 &&
                                            stsRsv != 5 &&
                                            item?.action_table && 
                                            datalocal?.data?.permissions?.[3]?.access?.[3]?.crud?.edit === true && (
                                              <button
                                                className="w-[21px]"
                                                onClick={() => {
                                                  setEdit(true);
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
                                  ) : (
                                    <></>
                                  )}
                                </>
                              </td>
                            </>
                            {item?.data?.map((row: any, a: any) =>
                              row?.type != "hidden" ? (
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
                                              className={
                                                row?.cols + " relative "
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
                                                widthCus={row?.widthCus}
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
                                                    row?.placeholder ??
                                                    row?.label,
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
                                                        e.target?.value
                                                          ?.length > 1
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
                                          {row?.name == "check_in_date"
                                            ? row?.valueFormat
                                            : row?.value}
                                        </>
                                      )}
                                    </>
                                  </td>
                                </>
                              ) : (
                                <></>
                              )
                            )}
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
      ) : (
        <>
          <TableReservatuinView
            uri="/cms/reservation/room-git"
            queryString={"&folio_id=" + idusr}
            groups=""
            isEditTable={false}
            isTitle={false}
            isDeleted={false}
            isBtnAdd={false}
            isPageing={false}
            onDataval={(data) => {
              setData((dataval) => ({
                ...dataval,
                ["reservation_list"]: data,
                ["type_reservation"]: "git",
                ["folio_id"]: idusr,
              }));
            }}
          />

          <div className="flex gap-4 mt-4 justify-end">
            <ButtonSubmit
              isBtnAdd={canCreate && canUpdate || canChangeRoom}
              label="Submit"
              isprimary={true}
              loading={loading}
              onCreate={() => OnSaveParentGIT()}
            />
          </div>
          {/* hr */}
          <hr className="my-4" />
          <div className="bg-white table-responsive p-2">
            <MoveRsv
              uri={
                "/cms/assign-room?folio_id=" + GetQueryStr("data") + "&type=all"
              }
              isType={getDataFolio?.data?.type_reservation}
              isListParentGIT={getDataFolio?.data?.is_parent_git ? 1 : 0}
              // editData={true}
              editData={true}
              isBtnEdit={canChangeRoom}
              isCheckBox={true}
              isFolio={true}
              isCalculate={false}
              saveBulk={(idx) => setBulkData(idx)}
            />

            {bulkData.length ? (
              <div className="flex gap-4 mt-4 justify-end">
                {showChangeDateModal && (
                  <ModalBulkChangeDate
                    isOpen={showChangeDateModal}
                    onClose={() => setShowChangeDateModal(false)}
                    onConfirm={handleConfirmChangeDate}
                    selectedCount={bulkData.length}
                    currentCheckIn={sampleCheckIn}
                    currentCheckOut={sampleCheckOut}
                  />
                )}
                <ButtonSubmit
                  isBtnAdd={canCreate || canUpdate}
                  label="Change Check In/Out Date"
                  isprimary={true}
                  loading={loading}
                  ClassPrimary="ti-btn ti-btn-primary !bg-green !text-white !font-medium"
                  onCreate={handleBulkChangeDate}
                />
                <ButtonSubmit
                  isBtnAdd={canCheckIn}
                  label="Check In"
                  isprimary={true}
                  loading={loading}
                  ClassPrimary="ti-btn ti-btn-primary !bg-green !text-white !font-medium"
                  onCreate={() => OnSaveMsgRmk("check_in")}
                />
                <ButtonSubmit
                  isBtnAdd={canCheckOut}
                  label="Check Out"
                  isprimary={true}
                  loading={loading}
                  ClassPrimary="ti-btn ti-btn-danger !bg-purple !text-white !font-medium"
                  onCreate={() => OnSaveMsgRmk("check_out")}
                />
                <ButtonSubmit
                  isBtnAdd={canCancelRsv}
                  label="Cancel Reservation"
                  isprimary={true}
                  loading={loading}
                  ClassPrimary="ti-btn ti-btn-warning !bg-red !text-white !font-medium"
                  onCreate={() => {
                    setIsremark(true);
                    // OnSaveMsgRmk("cancel_reservation");
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
      {/* Modal Apply Changes */}
      {showApplyModal && (
        <div className="overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-50% p-2">
            <h3 className="text-lg font-semibold">Apply Changes</h3>
            <p className="text-gray-600">
              Want to applied for?
            </p>
            <div className="flex justify-between flex-col gap-2 p-2">
              <ButtonSubmit
                label="This Night Only"
                isprimary={true}
                onCreate={() => handleApplyChanges("single")}
              />
              <ButtonSubmit
                label="This Night & Following Nights"
                isprimary={false}
                onCreate={() => handleApplyChanges("following")}
              />
              <ButtonSubmit
                label="Cancel"
                isdanger={true}
                onCreate={() => {
                  setShowApplyModal(false);
                  setPendingEditIndex(null);
                  setPendingEditId(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddView;
