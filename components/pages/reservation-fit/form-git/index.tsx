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
  RouteChange,
  removeItem,
  GetCurrentDate,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import TableReservatuinView from "../../../common/table-reservation";
import GuestAdd from "../../guest/form/index";
import CompanyAdd from "../../company-profile/form/index";
import ModalNotedComponent from "../../../common/modal/ModalNoted";
import { Value } from "sass";
import { useFormPermission } from "../../../../hooks/useFormPermission";
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
  const [canSave, setCanSave] = useState(false);
  const [checked, setChecked] = useState(false);
  const [actAuto, setactAuto] = useState("-1");
  const [ispackage, setispackage] = useState(false);
  const [popup, setpopup] = useState(false);
  const [dataguest, setdataguest] = useState<any>([]);
  const [datprice, setdatprice] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const [load, setisload] = useState(false);
  const [GetRateload, setisGetRateload] = useState(false);
  const [prmsrc, setprmsrc] = useState<any>({});
  const [idrate, setidrate] = useState("");
  const [namePopUp, setnamePopup] = useState("");
  const [confi, setconfi] = useState([]);
  const [checkbokmulti, setcheckbokmulti] = useState([]);
  const [IsOpenModal, setIsOpenModal] = useState(false);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({
    type_reservation: isType,
    eta: "12:00",
    etd: "12:00",
  });
  const { canCreate, canUpdate } = useFormPermission(63);
  const [datavaled, setDataEd] = useState<any>({});
  const [businessDate, setbusinessDate] = useState("");
  const [dataform, setdataform] = useState<any>([
    {
      name: "main",
      data: [
        {
          label: "Guest Search",
          name: "first_name-guest_profile",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Guest Here.",
          idpost: "guest_profile_id",
          uri: "/cms/profile/guest?reservation=1",
          disable: false,
          AdduRi: "profile/guest/main?parent=82&add=1",
          required: true,
        },
        {
          label: "Company Search",
          name: "name-company",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Company Here.",
          idpost: "company_profile_id",
          uri: "/cms/profile/company?reservation=1",
          disable: false,
          AdduRi: "profile/company/main?parent=83&add=1",
          required: true,
        },
        {
          label: "Group Name",
          name: "name",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 2,
          disable: false,
        },

        {
          label: "Check In",
          name: "check_in_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: "",
          required: true,
        },
        {
          label: "ETA",
          name: "eta",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "12:00",
        },
        {
          label: "Check Out",
          name: "check_out_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: "",
          required: true,
        },
        {
          label: "ETD",
          name: "etd",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "12:00",
        },
        {
          label: "Night",
          name: "night",
          type: "number",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "",
        },
        {
          label: "",
          name: "checkbokmulti",
          type: "checkbox",
          cols: "col-span-12",
          options: [
            { label: "Pending", value: "is_pending" },
            { label: "Guaranteed", value: "guaranted" },
            { label: "Print", value: "print_status" },
            { label: "Use Allotment", value: "use_allotment" },
          ],
          isAll: false,
          ismulti: true,
          sugestdata: "a",
          colcheckbox: "col-span-2",
          disable: false,
        },
        {
          label: "Room Configuration",
          name: "room_conf",
          type: "checkbox",
          cols: "col-span-12",
          options: [{}],
          isAll: false,
          ismulti: true,
          colcheckbox: "col-span-2",
          value: [],
        },
        {
          label: "Rate Code",
          name: "name-rate",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Rate Here.",
          idpost: "rate_id",
          relate: "company_profile_id;check_in_date;check_out_date",
          uri: "/cms/reservation/rate-by-company-id?company_profile_id=[0]&check_in_date=[1]&check_out_date=[2]",
          required: true,
        },
      ],
    },
    {
      name: "main",
      items: [
        {
          data: [],
        },
      ],
    },
    {
      name: "main",
      data: [
        {
          label: "Booking Agent",
          name: "name-booking_agent",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Booking Agent Here.",
          idpost: "booking_agent_id",
          uri: "/cms/profile/company",
          value: "",
          valueid: "",
        },
        {
          label: "Contact Person",
          name: "contact_person_id",
          type: "select-multi",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Booking Agent Here.",
          idpost: "contact_person_id",
          relate: "booking_agent_id",
          uri: "/cms/profile/company-contact?company_id=[0]",
        },
        {
          label: "Market Segment 1",
          name: "market_segment_1",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
          sugestdata: "a",
          parent: 1,
        },
        {
          label: "Market Segment 2",
          name: "market_segment_2",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
          sugestdata: "a",
          parent: 1,
        },
        {
          label: "Market Segment 3",
          name: "market_segment_3",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
          sugestdata: "a",
          parent: 1,
        },
        {
          label: "Market Segment 4",
          name: "market_segment_4",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
          sugestdata: "a",
          parent: 1,
        },
        {
          label: "Source",
          name: "source",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
          sugestdata: "a",
          parent: 1,
        },
        {
          label: "Booking No",
          name: "booking_no",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Promo Code",
          name: "promo_code",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: false,
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");
  useEffect(() => {
    console.log(confi);
  }, [confi]);
  const [idusr, setidusr] = useState("0");
  const ActSv = (id, fn, ln, ti, pn, em, type, market = [], source = []) => {
    setpopup(false);

    if (type == "guest") {
      var objcus = {
        ["guest_profile_id"]: id,
        ["title"]: ti,
        ["first_name"]: fn,
        ["last_name"]: ln,
        ["email"]: em,
        ["telp"]: pn,
        ["first_name-guest_profile"]: fn + " " + ln,
      };
      setData((dataval) => ({
        ...dataval,
        ...objcus,
      }));
    } else {
      var objcompany = {
        ["company_profile_id"]: id,
        ["name"]: fn,
        ["name-company"]: fn + " " + ln,
      };
      market.map((rw, index) => {
        objcompany["market_segment_" + (index + 1)] = rw;
        objcompany["market_segment_" + (index + 1) + "_ori"] = rw;
      });
      source.map((rw, index) => {
        objcompany["source"] = rw;
        objcompany["source_ori"] = rw;
      });
      setData((dataval) => ({
        ...dataval,
        ...objcompany,
      }));
    }
  };

  const removeItem = (item) => {
    setconfi((prevState) => prevState.filter((prevItem) => prevItem !== item));
  };

  const removeItemMulti = (item) => {
    setcheckbokmulti((prevState) =>
      prevState.filter((prevItem) => prevItem !== item)
    );
  };

  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any,
    isArray?: boolean
  ) => {
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date" ||
      b == "time"
    ) {
      let objinames = {};
      if (e.target.name == "check_out_date") {
        objinames = {
          ["night"]: GetSelisihDay(dataval?.check_in_date, e.target.value),
          [e.target.name]: e.target.value,
        };
      } else if (e.target.name == "check_in_date") {
        if (
          dataval?.check_out_date == "" ||
          dataval?.check_out_date == null ||
          dataval?.check_out_date == 0
        ) {
          objinames = {
            ["check_out_date"]: GetNextDay(e.target.value, 1),
            ["night"]: GetSelisihDay(
              e.target.value,
              GetNextDay(e.target.value, 1)
            ),
            [e.target.name]: e.target.value,
          };
        } else {
          objinames = {
            ["night"]: GetSelisihDay(
              e.target.value,
              GetNextDay(e.target.value, 1)
            ),
            [e.target.name]: e.target.value,
          };
        }
      } else if (e.target.name == "night") {
        objinames = {
          [e.target.name]: e.target.value,
          ["check_out_date"]: GetNextDay(
            dataval?.check_in_date,
            e.target.value
          ),
        };
      } else {
        objinames = {
          [e.target.name]: e.target.value,
        };
      }
      setData((dataval) => ({
        ...dataval,
        ...objinames,
      }));
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      setData({
        ...dataval,
        [name + "_ori"]: e,
        [name]: e,
      });
      if (e.value == "is_walk_in") {
        let dataInput: any = [...dataform];
        dataInput[0].data[2].disable = !dataInput[0].data[2].disable
          ? true
          : false;
        dataInput[0].data[8].disable = !dataInput[0].data[8].disable
          ? true
          : false;

        setdataform([...dataInput]);
      } else {
        let dataInput: any = [...dataform];
        dataInput[0].data[2].disable = false;
        dataInput[0].data[8].disable = false;
        setdataform([...dataInput]);
      }
    } else if (b == "checkbox") {
      if (ismulti) {
        if (name == "checkbokmulti") {
          if (e.target.checked == true) {
            setcheckbokmulti([...checkbokmulti, e.target.value]);
          } else {
            removeItemMulti(e.target.value);
          }
          setData({
            ...dataval,
            [e.target.value]: e.target.checked,
          });
        } else {
          if (e.target.checked == true) {
            setconfi([...confi, e.target.value]);
          } else {
            removeItem(e.target.value);
          }

          setData({ ...dataval, [name]: confi });
        }
      } else {
        setData({ ...dataval, [name]: e.target.checked });
      }
    }
    // setError("");
  };
  const FinalPOstDat = () => {
    var objpost: any = {};
    objpost = dataval;
    var arrCOl = [];

    dataform[1].items?.map((row: any, i) => {
      var obj = {};
      row?.data?.map((rw, index) => {
        if (rw?.idpost) {
          obj[rw?.name] = rw?.value;
          obj[rw?.idpost] = rw?.valueid;
        } else {
          obj[rw?.name] = rw?.value;
        }
      });
      arrCOl.push(obj);
    });
    objpost.reservation_list = arrCOl;
    objpost.type_reservation = isType;
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
          uri = uri.replace(repstr, dataval[relatearr[index]]);
        });
      }

      getuuri =
        uri.indexOf("?") == -1
          ? uri + "?search=" + word
          : uri + "&search=" + word;

      if (uri == "/cms/room-type/get-room") {
        var prmsrc = "";
        dataform[1].items[ia].data[1].value?.map((rw) => {
          prmsrc =
            "&idx_" + rw?.name + "=" + (rw?.value ? "1" : "0") + "" + prmsrc;
        });
        getuuri =
          getuuri +
          "" +
          prmsrc +
          "&check_in_date=" +
          dataform[1].items[ia].data[4].value +
          "&check_out_date=" +
          dataform[1].items[ia].data[6].value +
          "&folio_id=" +
          GetQueryStr("data");
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
  const GetRate = async () => {
    try {
      setisload(false);
      let urisave = "/cms/reservation/charge";
      let mth = "POST";
      const raw = JSON.stringify(FinalPOstDat());
      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
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
        setisload(true);
        setdatprice(saveprocess);
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const GetRoomConfig = async () => {
    try {
      let getuuri = "/cms/setup/get-type?group=room-configuration";

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
        let dataInput = [...dataform];
        dataInput[0].data[10].options = data?.data;
        setdataform([...dataInput]);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetCp = async (id) => {
    try {
      let urisave = "/cms/profile/company/contactPerson/" + id;
      let mth = "GET";
      const raw = JSON.stringify(FinalPOstDat());

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
        let datain = [...dataform];
        datain[2].data[1].options = saveprocess?.data;
        datain[2].data[1].value = saveprocess?.data[0];
        setdataform(datain);
        setData((dataval) => ({
          ...dataval,
          contact_person_id_ori: saveprocess?.data[0],
        }));
      } else {
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const onSelecteda = (rw: any, n: any, id: any, idat: any, name, ix, ia) => {
    if (name == "name-booking_agent") {
      GetCp(rw?.id);
    }
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
      dataInput[1].items[ia].data[ix].valueid = rw?.id;
      dataInput[1].items[ia].data[ix].value = rw[names[0]];
      setdataform([...dataInput]);
    }
    setTimeout(() => {
      if (name == "name-rate") {
        // GetRate();
        setidrate(rw?.id);
        setisGetRateload(true);
        var prmsrc = "";
        confi?.map((rw) => {
          prmsrc = "&idx_" + rw + "=1" + prmsrc;
        });
        setprmsrc(prmsrc);

        router.replace({
          pathname: window.location.pathname,
          query: { parent: parent, add: 1, time: new Date().getTime() },
        });
        setData((dataval) => ({
          ...dataval,
          ["room_reservation_list"]: [],
        }));
      }
      if (name == "name-room_type") {
        GetRoomConfig();
      }
    }, 800);
  };
  const ListTblGuest = (id, datI, name, ix, ia, isAdd) => {
    return (
      <>
        <div
          ref={ref}
          className="p-2 rounded-md w-full z-50 border-black border-b-[1px] border-r-[1px] border-l-[1px] absolute bg-white"
        >
          <>
            <div className="table-responsive w-full">
              <table className={"shadow-lg table-auto w-full"}>
                <thead>
                  <tr className="">
                    {dataguest?.table?.map((row: any, i: any) => (
                      <td
                        title={"Sort By " + row.label}
                        key={i}
                        className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                      >
                        {row.label}
                      </td>
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
                          return item.row != 1 ? (
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
                                          ? row.color +
                                            " px-1 py-1 text-white rounded-md mt-1 text-center"
                                          : "bg-success px-1 py-1 text-white rounded-md mt-1 text-center"
                                      }
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
                        setpopup(true);
                        setnamePopup(name);
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
  const OnSave = async () => {
    setloading(true);
    // console.log(FinalPOstDat());
    try {
      let urisave = GLOBALURI + "/create";
      let mth = "POST";
      const raw = JSON.stringify(FinalPOstDat());
      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
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
        router.replace({
          pathname: "/reservation/git/reservation",
          query: {
            parent: GetQueryStr("parent"),
            data: saveprocess?.data?.id,
          },
        });
        // history.back();
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const OnCheck = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    setloading(true);
    setCanSave(false); // reset dulu sebelum check ulang

    try {
      let urisave = GLOBALURI + "/on-check";
      let mth = "POST";
      const raw = JSON.stringify(FinalPOstDat());
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
        if (!saveprocess?.data?.check) {
          // Check gagal
          setIsOpenModal(true);
          setCanSave(false); // pastikan tombol Save gak muncul
        } else {
          // Check sukses
          setIsOpenModal(false);
          setCanSave(true); // baru boleh munculkan tombol Save
        }

        setdatprice(saveprocess);
      } else {
        setCanSave(false);
      }
    } catch (error) {
      console.log("erro", error);
      setCanSave(false);
    } finally {
      setloading(false);
    }
  };
  const ContentPopUp = (key) => {
    return (
      <>
        <div className=" m-4">
          <div className="p-2 font-bold">
            <h1 className="capitalize">
              {namePopUp == "first_name-guest_profile"
                ? "Guest Profil"
                : "Company"}
            </h1>
          </div>
          {namePopUp == "first_name-guest_profile" ? (
            <>
              <GuestAdd
                isPopup={true}
                nameinit={dataval["first_name-guest_profile"] ?? ""}
                ActionSv={(id, fn, ln, ti, pn, em) =>
                  ActSv(id, fn, ln, ti, pn, em, "guest")
                }
              />
            </>
          ) : (
            <>
              <CompanyAdd
                isPopup={true}
                nameinit={dataval["name-company"] ?? ""}
                ActionSv={(id, nm, market, source) =>
                  ActSv(id, nm, "", "", "", "", "company", market, source)
                }
              />
            </>
          )}
        </div>
      </>
    );
  };
  const GetDataDetail = async () => {
    try {
      let getuuri = GLOBALURI + "/create";
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
        // console.log(data?.master?.business_date);
        let dataInput = [...dataform];
        setData({
          ...dataval,
          check_in_date: data?.master?.business_date,
          check_out_date: GetNextDay(data?.master?.business_date, 1),
          night: 1,
        });

        dataInput[2].data[2].options = data?.master?.market_segment_1;
        dataInput[2].data[2].type =
          data?.master?.markets?.is_market_segment_1 != true
            ? "hidden"
            : dataInput[2].data[2].type;
        dataInput[2].data[3].options = data?.master?.market_segment_2;
        dataInput[2].data[3].type =
          data?.master?.markets?.is_market_segment_2 != true
            ? "hidden"
            : dataInput[2].data[3].type;
        dataInput[2].data[4].options = data?.master?.market_segment_3;
        dataInput[2].data[4].type =
          data?.master?.markets?.is_market_segment_3 != true
            ? "hidden"
            : dataInput[2].data[4].type;
        dataInput[2].data[5].options = data?.master?.market_segment_4;
        dataInput[2].data[5].type =
          data?.master?.markets?.is_market_segment_4 != true
            ? "hidden"
            : dataInput[2].data[5].type;
        dataInput[2].data[6].options = data?.master?.source;
        dataInput[2].data[6].type =
          data?.master?.markets?.is_source != true
            ? "hidden"
            : dataInput[2].data[6].type;
        setdataform([...dataInput]);
        setbusinessDate(data?.master?.business_date);
      }

      return;
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
    GetDataDetail();
    GetRoomConfig();
    if (idreq) {
      // GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      // GetDetailUser(0);
      setidusr("0");
    }
  }, []);
  useEffect(() => {
    const handleOutSideClick = (event) => {
      // console.log("coba,", event.target.className);
      if (event?.target?.className.length) {
        if (event?.target?.className?.split(" ")[0] == "close-btn") {
          setactAuto("-1");
          setpopup(false);
        }
      }

      if (!ref.current?.contains(event.target)) {
        // console.log("coba,", event.target.className);
        if (event?.target?.className.length) {
          if (
            event?.target?.className?.split(" ")[0] !=
              "Select2__input-container" &&
            event?.target?.className?.split(" ")[0] !=
              "Select2__value-container" &&
            event?.target?.className?.split(" ")[0] != "Select2__indicator" &&
            event?.target?.className?.split(" ")[0] != "Select2__placeholder"
          ) {
            setactAuto("-1");
            setpopup(false);
          }
        }

        // setactAuto("-1");
        // setpopup(false);
        // setoverflow(true);
        // console.log("coba", event.target.className?.split(" ")[0]);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  return (
    <>
      <Seo title={"Management " + layout?.title} />
      {popup ? (
        <div className="overlay">
          <div
            ref={ref}
            className="w-[75%] overflow-auto relative h-[650px] bg-gray-200 z-20 top-2 xl:top-[110px] left-[20%]"
          >
            {ContentPopUp(
              new URLSearchParams(window.location.search).get("key")
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold capitalize">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") +
                " " +
                GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-8 ">
              <fieldset className="border">
                <legend className="">Guest Profile</legend>
                <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any, index) => (
                    <>
                      {row?.type != "hidden" ? (
                        <div className={row?.cols + " relative "}>
                          <InputMain
                            typeInput={
                              row?.type == "text" ||
                              row?.type == "number" ||
                              row?.type == "date" ||
                              row?.type == "time"
                                ? "base"
                                : row?.type
                            }
                            error={false}
                            required={row?.required ?? false}
                            label={row?.label}
                            rest={{
                              disabled: row?.disable,
                              autoComplete: row?.isAutoComp ? "off" : "on",
                              name: row?.name,
                              placeholder: row?.placeholder ?? row?.label,
                              value: dataval[row?.name],
                              type: row?.type,
                              min:
                                row?.name == "check_out_date" &&
                                dataval?.check_in_date
                                  ? GetNextDay(dataval?.check_in_date, 1)
                                  : row?.name == "check_in_date"
                                  ? businessDate
                                  : "",
                              onChange: (e) => {
                                changeHandler(e, row?.type, row?.name);
                              },
                              onKeyUp: (e: any) => {
                                if (row?.isAutoComp) {
                                  if (e.target?.value?.length > 1) {
                                    setactAuto("0" + index);
                                    GetDataAutoComp(
                                      e.target?.value,
                                      row?.uri,
                                      row?.relate,
                                      index,
                                      -1
                                    );
                                  } else {
                                    setactAuto("-1");
                                  }
                                }
                              },
                              onFocus: () => {
                                if (row?.relate) {
                                  setactAuto("0" + index);
                                  GetDataAutoComp(
                                    "",
                                    row?.uri,
                                    row?.relate,
                                    index,
                                    -1
                                  );
                                }
                              },
                            }}
                            restArea={{
                              placeholder: row?.label,
                              name: row?.name,
                              value: dataval[row?.name] ?? datavaled[row?.name],
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
                              dataval[row?.name] ?? datavaled[row?.name]
                            }
                            options={row?.options}
                            isMulti={row?.ismulti}
                            valuename={row?.name}
                            isAll={row?.isAll}
                            widthCus={row?.widthOptions}
                            colspan={row?.colcheckbox}
                          />
                          {row?.isAutoComp && actAuto == "0" + index ? (
                            <>
                              {ListTblGuest(
                                row?.idpost,
                                0,
                                row?.name,
                                index,
                                -1,
                                row?.AdduRi ?? false
                              )}
                            </>
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
              </fieldset>
              <div className="mb-2">
                {GetRateload ? (
                  <>
                    <TableReservatuinView
                      uri="/cms/reservation/room-git"
                      queryString={
                        "&rate_id=" +
                        idrate +
                        "&check_in_date=" +
                        dataval?.check_in_date +
                        "&check_out_date=" +
                        dataval?.check_out_date +
                        prmsrc
                      }
                      groups=""
                      isEditTable={false}
                      isTitle={false}
                      isDeleted={false}
                      isBtnAdd={false}
                      isPageing={false}
                      onDataval={(data) => {
                        setData((dataval) => ({
                          ...dataval,
                          ["room_reservation_list"]: data,
                        }));
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="col-span-4 ">
              <div>
                <div className="mb-2">
                  {dataval?.check_in_date && dataval?.check_out_date && load ? (
                    <>
                      <TableView
                        uri="/cms/reservation/available-room"
                        queryString={
                          "&check_in_date=" +
                          dataval?.check_in_date +
                          "&check_out_date=" +
                          dataval?.check_out_date
                        }
                        groups=""
                        isEditTable={false}
                        isTitle={false}
                        isDeleted={false}
                        isBtnAdd={false}
                        isPageing={false}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <fieldset className="border min-w-full table-auto">
                  <legend className="">Price</legend>

                  <div className="grid grid-cols-12 gap-2 ml-2 mb-4 mt-4 mr-2">
                    <div className="col-span-4 font-bold">#</div>
                    <div className="col-span-4 font-bold">Dates</div>
                    <div className="col-span-4 font-bold">Rate</div>
                    {datprice?.data?.date?.map((row, index) => (
                      <>
                        <div className="col-span-4">{index + 1}</div>
                        <div className="col-span-4">{row?.date}</div>
                        <div className="col-span-4">{row?.charge}</div>
                      </>
                    ))}

                    <div className="col-span-12 border-b-2"></div>

                    {datprice?.data?.charge?.map((row, index) => (
                      <>
                        <div className="col-span-4"></div>
                        <div className="col-span-4">{row?.label}</div>
                        <div className="col-span-4">{row?.value}</div>
                      </>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="border min-w-full table-auto">
                  <legend className="">Data Others</legend>
                  <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                    {dataform[2]?.data?.map((row: any, index) => (
                      <>
                        {row?.type != "hidden" ? (
                          <div className={row?.cols + " relative "}>
                            <InputMain
                              typeInput={
                                row?.type == "text" ||
                                row?.type == "number" ||
                                row?.type == "date" ||
                                row?.type == "time"
                                  ? "base"
                                  : row?.type
                              }
                              error={false}
                              required={row?.required ?? false}
                              label={row?.label}
                              rest={{
                                name: row?.name,
                                placeholder: row?.placeholder ?? row?.label,
                                value:
                                  dataval[row?.name] ?? datavaled[row?.name],
                                type: row?.type,
                                onChange: (e) => {
                                  changeHandler(e, row?.type, row?.name);
                                },
                                onKeyUp: (e: any) => {
                                  if (row?.isAutoComp) {
                                    if (e.target?.value?.length > 1) {
                                      setactAuto("2" + index);
                                      GetDataAutoComp(
                                        e.target?.value,
                                        row?.uri,
                                        row?.relate,
                                        index,
                                        -1
                                      );
                                    } else {
                                      setactAuto("-1");
                                    }
                                  }
                                },
                              }}
                              restArea={{
                                placeholder: row?.label,
                                name: row?.name,
                                value:
                                  dataval[row?.name] ?? datavaled[row?.name],
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
                                dataval[row?.name + "_ori"] ??
                                datavaled[row?.name]
                              }
                              options={row?.options}
                              isMulti={row?.ismulti}
                              isAll={row?.isAll}
                              valuename={row?.name}
                            />
                            {row?.isAutoComp && actAuto == "2" + index ? (
                              <>
                                {ListTblGuest(
                                  row?.idpost,
                                  2,
                                  row?.name,
                                  index,
                                  -1,
                                  row?.AdduRi ?? false
                                )}
                              </>
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
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalNotedComponent
        text="The room is not available; it will be added as a pending reservation."
        title="Notice"
        IsOpenModel={IsOpenModal}
        ChangeonClose={(e) => {
          setIsOpenModal(e);
        }}
      />
      <div className={"fixed w-full bg-white py-2 px-4 bottom-0 left-0 "}>
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              // setloading(true);
              // router.replace({
              //   pathname: window.location.pathname,
              //   query: { parent: parent },
              // });
              history.back();
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />
          {isview ? (
            <></>
          ) : (
            <>
              <ButtonSubmit
                isBtnAdd={canCreate || canUpdate}
                onCreate={OnCheck}
                loading={loading}
                isprimary={true}
                ClassCustome="bg-info px-4"
                label="Check Availability"
              />

              {canSave && (
                <ButtonSubmit
                  onCreate={() => {
                    setloading(true);
                    OnSave();
                  }}
                  loading={loading}
                  label="Save Change"
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddView;
