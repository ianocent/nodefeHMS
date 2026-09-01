import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { useRouter } from "next/router";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  NumberClear,
  formatAmount,
} from "../../helper";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import InputMain from "../input/InputMain";
import ButtonSubmit from "../button/ButtonSubmit";
import { useSelector } from "react-redux";
import ButtonAddList from "../button/ButtonAddList";
import TabMenuIcon from "../tabIcon/tab";

interface TableViewProps {
  uri: string;
  uriSave?: string;
  groups: string;
  isEditTable?: boolean;
  queryString?: string;
  isTitle?: boolean;
  isDeleted?: boolean;
  isBtnAdd?: boolean;
  methodFetch?: string;
  bodyFetch?: {};
  headRow?: number;
  checked?: boolean;
  onClosePopUp?: () => void;
  isEditForce?: boolean;
  isAdvance?: boolean;
  filter?: any;
  isPageing?: boolean;
  isNAudit?: boolean;
  NAuditCode?: string;
  isBtnView?: boolean;
  isBtnEdit?: boolean;
  isHeader?: boolean;
  isResult?: boolean;
  isDrillDown?: boolean;
  typeTbl?: string;
  dateDat?: string;
}
const TableView = (props: TableViewProps) => {
  const {
    uri,
    uriSave = "",
    groups,
    isEditTable = true,
    queryString,
    isTitle = true,
    isDeleted = false,
    isBtnAdd = true,
    methodFetch = "GET",
    bodyFetch = {},
    headRow = 1,
    checked = false,
    onClosePopUp,
    isEditForce = false,
    isAdvance = false,
    filter,
    isPageing = true,
    isNAudit = false,
    NAuditCode = "",
    isBtnView = true,
    isBtnEdit = true,
    isHeader = true,
    isResult = false,
    isDrillDown = false,
    typeTbl,
    dateDat,
  } = props;
  const Lastpath = window.location.pathname.split("/").pop();
  const GLOBALURI = uri;
  const [isview, setisview] = useState(false);
  const [isedit, setisedit] = useState(false);
  const [isdeleted, setisDeleted] = useState(isDeleted);
  const router = useRouter();
  const ref = useRef(null);
  const path = router.pathname;
  const [loadingin, setloadingin] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [editActive, seteditActive] = useState(-1);
  const [dataval, setData] = useState<any>({});
  const [datavalMulti, setDataMulti] = useState<any>({});
  const [overflow, setoverflow] = useState(true);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [isSelected, setisSelected] = useState<any>(-1);
  const [isidSelected, setisidSelected] = useState<any>(-1);
  const [isPopup, setIsPopUp] = useState(false);

  const [datavalsrc, setDatasrc] = useState<any>({
    status: { value: "-1", label: "ALL" },
  });
  const [datatable, setdatatable] = useState<any>({});
  const [add, setaddform] = useState<boolean>(false);
  const [idparent, setidparent] = useState("");
  const [loading, setloading] = useState<boolean>(false);
  const [ishide, setishide] = useState<boolean>(false);
  const [popup, setpopup] = useState<boolean>(false);
  const [searchActive, setsearchActive] = useState<boolean>(false);
  const [btnsearchs, setbtnsearchs] = useState<boolean>(false);
  const [actMenu, setActMenu] = useState<any>([
    {
      label: "New FIT",
      key: "new",
      line: false,
      icon: (process.env.uriApi || "") + "/theme/cms/images/reservation/icon/New_Reservation.svg",
    },
    {
      label: "New GIT",
      key: "new",
      line: false,
      icon: (process.env.uriApi || "") + "/theme/cms/images/reservation/icon/New_Reservation.svg",
    },
  ]);
  const [datadet, setdatadet] = useState<any>({});
  const [dataDrillDown, setDataDrillDown] = useState<any>([]);
  const [ShowDataDrill, setShowDataDrill] = useState<any>("-1");
  const [showDrill, setshowDrill] = useState<boolean>(false);

  const onOpen = () => {
    console.log("datalog", "open");
    setoverflow(false);
  };
  const onClose = () => {
    console.log("datalog", "close");
    setoverflow(true);
  };
  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any,
    related?: any
  ) => {
    if (
      b == "text" ||
      b == false ||
      b == "textarea" ||
      b == "number" ||
      b == "date"
    ) {
      // console.log(b);
      if (b == "number") {
        // console.log(formatAmount(e.target.value));
        setData({
          ...dataval,
          [e.target.name]: formatAmount(e.target.value),
        });
      } else {
        setData({ ...dataval, [e.target.name]: e.target.value });
      }
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
        [name]: ismulti ? valarr : e?.value,
      });
    } else if (b == "checkbox") {
      if (ismulti) {
        if (e.target.checked == true) {
          setData({ ...dataval, [e.target.value]: e.target.checked });
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
      }
    } else if (b == "select") {
      let dataMerge = {};
      dataMerge[name] = e.value;
      dataMerge[name + "_ori"] = e;

      if (related) {
        related?.map((row: any) => {
          dataMerge[row] = e[row];
        });
      }

      setData({ ...dataval, ...dataMerge });
    }
    // setError("");
  };
  const changeHandlerSrc = (e: any, b?: boolean, name?: string) => {
    // console.log("widy", e.target);
    var fieldsrc = "";
    var valsrc = "";
    var namecur = "";
    if (!b) {
      setDatasrc({ ...datavalsrc, [e.target.name]: e.target.value });
      if (e.target.name != "search") {
        fieldsrc = e.target.name + ";";
        valsrc = e.target.value + ";";
      } else {
        router.query = { ...router.query, search: e.target.value };
      }

      namecur = e.target.name;
    } else {
      setDatasrc({ ...datavalsrc, [name]: e });
      fieldsrc = name + ";";
      valsrc = e.value + ";";
      namecur = name;
    }

    Object.keys(datavalsrc)?.map((rw) => {
      var minsatu = false;
      if (rw != namecur) {
        if (
          typeof datavalsrc[rw] == "object" &&
          datavalsrc[rw]?.value == "-1"
        ) {
          minsatu = true;
        }
        if (e?.target?.name == "search") {
          minsatu = true;
        }
        if (!minsatu) {
          if (rw != "search") {
            fieldsrc += rw + ";";
            valsrc +=
              (typeof datavalsrc[rw] == "object"
                ? datavalsrc[rw]?.value
                : datavalsrc[rw]) + ";";
          } else {
            router.query = { ...router.query, search: datavalsrc[rw] };
          }
        }
      }
    });
    // console.log("logaja", window.location.href);
    router.query = { ...router.query, search_field: fieldsrc };
    router.query = { ...router.query, search_value: valsrc };
  };
  const submitFilter = () => {
    setIsloading(true);
    router.replace({
      pathname: window.location.pathname,
      query: router.query,
    });
  };

  const ValueSetEdit = (row) => {
    datatable?.table?.map((rw, index) => {
      if (rw?.type == "select") {
        var obj = {
          [rw?.key]: row[rw?.key]?.value,
        };
      } else {
        var obj = {
          [rw?.key]: row[rw?.key],
        };
      }

      setData((dataval) => ({
        ...dataval,
        ...obj,
      }));
    });
  };
  const onCheckAll = (e: any) => {
    let valarr = [];
    if (e.target.checked == true) {
      datatable?.data?.map((row: any) => {
        valarr.push(row?.id);
      });
      let valarrkey = {};
      valarr.forEach((element) => {
        valarrkey[element] = e.target.checked;
      });
      setDataMulti({ ...datavalMulti, ...valarrkey });
    } else {
      valarr = [];
      setDataMulti({});
    }
  };
  const FinalPOstDat = () => {
    var obj = {};
    for (var key in dataval) {
      obj[key] = dataval[key];
      datatable?.table?.map((row: any, index: number) => {
        if (row?.key == key && row?.type == "number") {
          obj[key] = NumberClear("" + dataval[key] + "");
        }
      });
    }
    return obj;
  };
  const onSave = async (id: number) => {
    // console.log("sets", FinalPOstDat());
    try {
      let urisave = uri + "?group=" + Lastpath + "&" + queryString;
      let mth = "POST";

      const raw = JSON.stringify(FinalPOstDat());

      if (id != 0) {
        urisave = uri + "/" + id + "?group=" + Lastpath + "&" + queryString;
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
        seteditActive(-1);
        setaddform(false);
        setData({});
        setloadingin(false);
        GetDataTable();
      } else {
        setloadingin(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloadingin(false);
    }
  };
  const onSaveMulti = async (id: number) => {
    try {
      if (uriSave != "") {
        let urisave = uriSave + "?group=" + Lastpath + "&" + queryString;
        let mth = "POST";

        const transformeddatavalMulti = Object.entries(datavalMulti).filter(
          ([key, value]) => value === true
        );
        const raw = JSON.stringify({
          idx: transformeddatavalMulti.map(([key, value]) => key),
        });

        if (id != 0) {
          urisave = uri + "/" + id + "?group=" + Lastpath + "&" + queryString;
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
          seteditActive(-1);
          setaddform(false);
          setData({});
          setloadingin(false);
          setloading(false);
          GetDataTable();
          onClosePopUp();
        } else {
          setloadingin(false);
          setloading(false);
          onClosePopUp();
        }
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
      setloadingin(false);
      onClosePopUp();
    }
  };
  const onDeleted = async (id: any) => {
    try {
      let getuuri = GLOBALURI + "/" + id + "?q=1&" + queryString;

      const datauser: any = await FetchData(
        getuuri,
        "DELETE",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (datauser?.code == "200") {
        GetDataTable();
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const setDataEdits = (loop) => {
    let valobj = {};
    datatable?.table?.map((item: any, i: any) => {
      datatable?.data?.map((row: any, index) => {
        if (loop == index) {
          valobj[item.key] = row[item.key];
        }
      });
    });
    setData(valobj);
  };
  const clickSort = (row) => {
    const urlParams = new URLSearchParams(window.location.search);
    const sort = urlParams.get("sort");
    let query = {};

    urlParams.forEach((value, key) => {
      if (key == "sort") {
        return;
      }
      query = { ...query, [key]: value };
      return;
    });

    if (sort == row.key) {
      query = { ...query, sort: "-" + row.key };
      router.replace({
        pathname: window.location.pathname,
        query: query,
      });
      GetDataTable();
    } else if ("-" + sort == "-" + row.key) {
      query = { ...query, sort: row.key };
      router.replace({
        pathname: window.location.pathname,
        query: query,
      });
      GetDataTable();
    } else {
      query = { ...query, sort: row.key };
      router.replace({
        pathname: window.location.pathname,
        query: query,
      });
      GetDataTable();
    }
  };
  const GetDataTable = async (i?: any, page?: number, isloadmore?: boolean) => {
    setIsloading(true);
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
        ""
      );
      // console.log("wfh", datajson?.data);
      if (datajson?.code == "200") {
        if (isidSelected != -1) {
          datajson?.data?.map((rw) => {
            if (isidSelected == rw?.id) {
              // console.log(isidSelected + "==" + rw?.id);
              setdatadet(rw);
            }
          });
        }

        setIsloading(false);
        if (!isloadmore) {
          setdatatable(datajson);
          setisSelected(GetQueryStr("data"));
          datajson?.data?.map((row: any, i) => {
            if (row?.id == GetQueryStr("data")) {
              setisSelected(i);
              console.log("indexdat", i);
            }
          });
        } else {
          setisSelected(GetQueryStr("data"));
          datajson?.data?.map((row: any, i) => {
            if (row?.id == GetQueryStr("data")) {
              setisSelected(i);
              console.log("indexdat", i);
            }
            datatable?.data?.push(row);
          });
          setdatatable({ ...datatable, ["pagging"]: datajson?.pagging });
        }
        if (datajson?.search_data) {
          setDatasrc(datajson?.search_data);
        }
        datajson?.table?.map((rw) => {
          if (rw?.is_search) {
            setbtnsearchs(true);
          }
        });

        setisview(datajson?.permission?.view);
        setisedit(isEditForce ? false : datajson?.permission?.edit);
        setisDeleted(datajson?.permission?.delete);
      } else {
        setIsloading(false);
      }
      return;
    } catch (error) {
      setIsloading(false);
      console.log("err", error);
      return;
    }
  };
  const GetDataTableMulti = async (
    i?: any,
    page?: number,
    isloadmore?: boolean
  ) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sort = urlParams.get("sort") ?? "";

      let status = i ?? datavalsrc["status"][0]?.value;

      let pages = 1;
      if (page) {
        pages = page;
      }
      const raw = JSON.stringify(bodyFetch);
      const aesraw = GetEncrypt(raw);
      const datajson = await FetchData(
        uriSave +
          "?sort=" +
          sort +
          "&group=" +
          Lastpath +
          "&page=" +
          pages +
          "&name=" +
          (datavalsrc["search"] ?? "") +
          "&trash=" +
          status +
          "&" +
          queryString,
        methodFetch,
        methodFetch == "GET" ? "" : aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      console.log("datalog", datajson);

      if (datajson?.code == "200") {
        if (checked) {
          let valarr = [];
          datajson?.data?.map((row: any) => {
            valarr.push(row?.id);
          });
          let valarrkey = {};
          valarr.forEach((element) => {
            valarrkey[element] = true;
          });
          setDataMulti({ ...datavalMulti, ...valarrkey });
        }
      }
      return;
    } catch (error) {
      console.log("err", error);
      return;
    }
  };
  const previn = () => {
    // alert(1);
    if (datatable?.pagging?.prev) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.prev);
    }
  };
  const nextin = () => {
    if (datatable?.pagging?.next) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.next);
    }
  };
  const prevJumpin = () => {
    if (datatable?.pagging?.prev_jump) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.prev_jump);
    }
  };
  const nextJumpin = () => {
    if (datatable?.pagging?.next_jump) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.next_jump);
    }
  };
  const onLoadmore = () => {
    if (datatable?.pagging?.next) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.next, true);
    } else {
      setishide(true);
    }
  };
  const el = (sel: any, par?: any) => (par || document).querySelector(sel);

  const showPopup = (evt) => {
    const elPopup = el(".popuponly");
    const elBtn = evt.currentTarget;
    Object.assign(elPopup.style, {
      left: `${evt.pageX + elBtn.scrollLeft - elBtn.offsetLeft + 25}px`,
      top: `${evt.pageY + elBtn.scrollTop - elBtn.offsetTop - 50}px`,
    });
  };
  function DataDrillDown(props) {
    const [inDown, setinDown] = useState<any>([]);
    useEffect(() => {
      async function GetDatadrill(id, type) {
        try {
          let getuuri =
            "/cms/system-balance/get-list-by-id-post/" +
            id +
            "?type=" +
            type +
            "&date=" +
            dateDat;
          const data: any = await FetchData(
            getuuri,
            "GET",
            "",
            false,
            datalocal?.data?.access_token,
            router,
            ""
          );
          var dataTr: any = <></>;
          if (data?.code == "200") {
            var datPush = [];
            data?.data.map((rw) => {
              datPush.push(rw);
            });
            console.log("buz", data);
            setinDown(datPush);
            // return dataTr;
          } else {
            // return <></>;
          }
        } catch (error) {
          // return <></>;
        }
      }
      GetDatadrill(props.id, props.type);
    }, []);
    return (
      <>
        {inDown.map((rw) => {
          return (
            <>
              <tr className={"focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] "}>
                <td className="p-2">{rw?.name}</td>
                <td className="p-2">{rw?.debit}</td>
                <td className="p-2">{rw?.credit}</td>
              </tr>
            </>
          );
        })}
      </>
    );
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const getidparent = urlParams.get("parent");
    setidparent(getidparent);

    if (add) {
      seteditActive(-1);
    }

    if (checked) {
      GetDataTableMulti();
    } else {
      GetDataTable();
    }
  }, [window.location.search, window.location.pathname, add, checked]);

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        setIsPopUp(false);
        // setoverflow(true);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  useEffect(() => {
    datatable?.data?.map((rw) => {
      if (rw?.id != 0 && rw?.id != null) {
        // onLoadDrillDown(rw?.id, typeTbl);
      }
    });
    console.log("wdylog", dataDrillDown);
  }, [datatable]);
  return (
    <>
      <div className="overlay hidden"></div>
      {datatable?.code == "200" ? (
        <>
          {isAdvance ? (
            <>
              <TabMenuIcon
                actMenu={actMenu}
                id={isidSelected}
                foliodat={datadet}
                isNAudit={isNAudit}
                NAuditCode={NAuditCode}
              />

              <div
                className={
                  " popuponly min-w-max min-h-max " +
                  (isPopup ? "block" : "hidden")
                }
                ref={ref}
              >
                {actMenu?.map((row) => (
                  <>
                    <div
                      className="mt-2 w-full cursor-pointer"
                      onClick={() => {
                        if (row?.key == "new") {
                          router.replace({
                            pathname: window.location.pathname,
                            query: {
                              parent: idparent,
                              add: 1,
                            },
                          });
                        } else {
                          router.replace({
                            pathname: window.location.pathname,
                            query: {
                              parent: idparent,
                              key: row?.key,
                              data: isidSelected,
                              time: new Date().getTime(),
                            },
                          });
                        }
                      }}
                    >
                      {row?.label}
                    </div>
                    {row?.line ? <hr /> : <></>}
                  </>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
          {filter}
          {datatable?.permission?.add == 1 ? (
            <>
              {isBtnAdd && (
                <ButtonAddList
                  label="+ Add"
                  title={
                    isTitle
                      ? "" +
                        GetCapitalFirst(
                          GLOBALURI.replaceAll("/cms/", " ")
                            .replaceAll("-", " ")
                            .replaceAll("/", " ")
                        )
                      : ""
                  }
                  isBtnadd={datatable?.permission?.add == 1 ? true : isBtnAdd}
                  onAdd={() => {
                    if (isEditTable) {
                      setaddform(true);
                      let datatype = {};
                      datatable.table.map((row) => {
                        if (row?.type == "number") {
                          datatype = { ...datatype, [row?.key]: 0 };
                        } else if (row?.type == "checkbox") {
                          datatype = { ...datatype, [row?.key]: true };
                        }
                      });
                      setData({ ...dataval, ...datatype });
                    } else {
                      router.replace({
                        pathname: window.location.pathname,
                        query: { parent: idparent, add: 1 },
                      });
                    }
                  }}
                />
              )}
            </>
          ) : (
            <></>
          )}

          {btnsearchs ? (
            <div className="order-3 w-full flex mb-2 mt-2 ">
              <fieldset className="border w-full ">
                <legend
                  className="bg-white mb-4 text-[#845ADF] font-bold cursor-pointer"
                  onClick={() => {
                    if (searchActive) {
                      setsearchActive(false);
                    } else {
                      setsearchActive(true);
                    }
                  }}
                >
                  Search
                </legend>
                {searchActive ? (
                  <>
                    <div className="sm:grid grid-cols-4 gap-2 mt-[20px]  mb-2 justify-end m-2 ">
                      <div className=" w-full">
                        <InputMain
                          typeInput="base"
                          error={false}
                          label="Keyword"
                          required={false}
                          rest={{
                            name: "search",
                            placeholder: "Keyword",
                            value: datavalsrc?.search,
                            type: "text",
                            onChange: (e) => {
                              changeHandlerSrc(e);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e);
                            //GetDataTable(e.value);
                          }}
                          valueSel={{
                            value: "-1",
                            label: "ALL",
                          }}
                          isMulti={false}
                          placeholder="Keyword"
                        />
                      </div>
                      {datatable?.table?.map((row: any, index: number) => {
                        // console.log("log aja", row);
                        var types: string;
                        var typesmain: string;
                        let optionsd = [{ value: "-1", label: "ALL" }];
                        row?.options?.map((rw) => {
                          optionsd?.push(rw);
                        });

                        if (row?.type == "checkbox") {
                          types = "select-multi";
                          typesmain = "select-multi";
                        } else if (row?.type == "select_multiple") {
                          types = "select-multi";
                          typesmain = "select-multi";
                        } else if (row?.type == "select") {
                          types = "select-multi";
                          typesmain = "select-multi";
                        } else {
                          types = row?.type;
                          typesmain = "base";
                        }

                        return row?.is_search ? (
                          <div className=" w-full">
                            <InputMain
                              typeInput={typesmain}
                              error={false}
                              label={row?.label}
                              required={false}
                              options={optionsd}
                              rest={{
                                name: row?.key,
                                placeholder: row?.label,
                                value: datavalsrc[row?.key] ?? "",
                                type: types,
                                onChange: (e) => {
                                  changeHandlerSrc(e, false, row?.key);
                                },
                              }}
                              onChangeSel={(e: any) => {
                                changeHandlerSrc(e, true, row?.key);
                                //GetDataTable(e.value);
                              }}
                              valueSel={
                                datavalsrc[row?.key] ?? {
                                  value: "-1",
                                  label: "ALL",
                                }
                              }
                              isMulti={false}
                              placeholder={row?.label}
                            />
                          </div>
                        ) : (
                          <></>
                        );
                      })}
                      <div className="flex items-end">
                        <div className=" ml-2 h-[50px] mt-4 gap-5">
                          <ButtonSubmit
                            label="Reset"
                            onCreate={() => {
                              router.replace({
                                pathname: window.location.pathname,
                                query: { parent: idparent, module: Lastpath },
                              });
                            }}
                            isprimary={false}
                          ></ButtonSubmit>
                          <ButtonSubmit
                            label="Search"
                            onCreate={() => {
                              submitFilter();
                            }}
                            ClassCustome="!bg-green ml-2"
                          ></ButtonSubmit>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex w-full justify-center mb-4">
                    <div>Please Click Search To Find The Data</div>
                  </div>
                )}
              </fieldset>
            </div>
          ) : (
            <div className="mt-4"></div>
          )}
          {!isloading ? (
            datatable?.table ? (
              <>
                <div
                  className={
                    "table-responsive " +
                    (overflow == true ? " " : "min-h-screen")
                  }
                  contextMenu="mymenu"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <table
                    className={
                      "table-auto m-2" +
                      (editActive != -1 ? " min-w-max " : " min-w-full ")
                    }
                  >
                    <thead>
                      <tr className="">
                        {datatable?.table?.map((row: any, i: any) => {
                          // Skip row yang tidak perlu ditampilkan di header
                          if (row?.row && row?.row !== 1) return null;

                          // Cek apakah ini kolom pertama dan terakhir yang visible
                          const visibleHeaders = datatable?.table?.filter(
                            (r: any) => !r?.row || r?.row === 1
                          );

                          const currentIndex = visibleHeaders.findIndex(
                            (r: any) => r.label === row.label
                          );

                          const isFirst = currentIndex === 0;
                          const isLast = currentIndex === visibleHeaders.length - 1;

                          return (
                            <td
                              title={"Sort By " + row.label}
                              key={i}
                              width={i == 0 ? "50%" : "25%"}
                              className={`
                                ${isHeader
                                  ? "bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                                  : "text-white !bg-[#fff] font-bold"
                                }
                                ${isFirst ? 'rounded-tl-lg' : ''}
                                ${isLast ? 'rounded-tr-lg' : ''}
                              `}
                              rowSpan={row?.rowspan ?? false}
                              colSpan={row?.colspan ?? false}
                            >
                              {isHeader ? row.label : ""}
                            </td>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {datatable?.data?.map((row: any, index) =>
                        editActive != index ? (
                          <>
                            <tr
                              key={row?.id + "-" + index}
                              className={
                                "focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] " +
                                (row?.id != 0 ? " cursor-pointer  " : "")
                              }
                              onClick={() => {
                                if (row?.id != 0) {
                                  if (showDrill) {
                                    setShowDataDrill("-1");
                                    setshowDrill(false);
                                  } else {
                                    setShowDataDrill(row?.id);
                                    setshowDrill(true);
                                  }
                                }
                              }}
                              onContextMenu={(e) => {
                                if (isAdvance) {
                                  setisSelected(index);
                                  setisidSelected(row?.id);
                                  setActMenu(row?.actions);
                                  setIsPopUp(true);
                                  showPopup(e);
                                }
                              }}
                            >
                              {datatable.table.map((item: any, a: any) => {
                                return item.row != 1 ? (
                                  <td
                                    className={`${
                                      index % 2 == 0
                                        ? isAdvance && isSelected == index
                                          ? "bg-[#DAF7A6]"
                                          : "bg-gray-300"
                                        : isAdvance && isSelected == index
                                        ? ""
                                        : ""
                                    } p-2 ${
                                      item?.is_link
                                        ? " cursor-pointer underline text-[rgba(0,0,255,1)]"
                                        : ""
                                    }`}
                                    key={item.key + "-" + a}
                                    onClick={() => {
                                      if (item?.is_link) {
                                        router.replace({
                                          pathname: window.location.pathname,
                                          query: {
                                            parent: idparent,
                                            add: 1,
                                            data: row?.id,
                                          },
                                        });
                                      }
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
                                      <>0,00</>
                                    )}
                                  </td>
                                ) : (
                                  <></>
                                );
                              })}
                            </tr>
                            {row?.id != 0 &&
                              ShowDataDrill == row?.id &&
                              showDrill && (
                                <DataDrillDown id={row?.id} type={typeTbl} />
                              )}
                          </>
                        ) : (
                          <tr
                            key={row?.id + "-" + index}
                            className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]"
                          >
                            <td
                              className={`${
                                index % 2 == 0
                                  ? isAdvance && isSelected == index
                                    ? "bg-[#DAF7A6]"
                                    : "bg-gray-300"
                                  : isAdvance && isSelected == index
                                  ? "bg-[#DAF7A6]"
                                  : ""
                              } p-2 focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]`}
                            >
                              <div className="flex gap-2">
                                <ButtonSubmit
                                  label="Close"
                                  isprimary={false}
                                  onCreate={() => {
                                    seteditActive(-1);
                                    setData({});
                                  }}
                                  ClassCustome="px-2 my-2"
                                />
                                <ButtonSubmit
                                  ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                                  ClassCustome="px-2 my-2"
                                  label="Save"
                                  onCreate={() => {
                                    onSave(row?.id);
                                  }}
                                  loading={loadingin}
                                />
                              </div>
                            </td>

                            {datatable.table.map((item: any, a: any) => {
                              return item.row != 1 ? (
                                <td
                                  className={`${
                                    index % 2 == 0
                                      ? isAdvance && isSelected == index
                                        ? "bg-[#DAF7A6]"
                                        : "bg-gray-300"
                                      : isAdvance && isSelected == index
                                      ? "bg-[#DAF7A6]"
                                      : ""
                                  } p-2 `}
                                  key={item.key + "-" + a}
                                >
                                  {item.type != "none" ? (
                                    item.type == "text" ||
                                    item.type == "date" ||
                                    item?.type == "number" ? (
                                      <InputMain
                                        typeInput="base"
                                        label={"-"}
                                        error={false}
                                        required={false}
                                        rest={{
                                          name: item.key,
                                          type:
                                            item.type == "number"
                                              ? "text"
                                              : item.type,
                                          value:
                                            typeof row[item.key] == "string" ||
                                            typeof row[item.key] == "number"
                                              ? dataval[item.key] ??
                                                row[item.key]
                                              : dataval[item.key] ??
                                                row[item.key]?.en,
                                          onChange: (e) => {
                                            changeHandler(e, item.type);
                                          },
                                        }}
                                      />
                                    ) : item.type == "select" ||
                                      item.type == "select_multiple" ? (
                                      <>
                                        <InputMain
                                          typeInput="select-multi"
                                          label={""}
                                          error={false}
                                          required={false}
                                          valueSel={
                                            dataval[item.key + "_ori"] ??
                                            row[item.key]
                                          }
                                          isMulti={
                                            item.type == "select" ? false : true
                                          }
                                          options={item?.options}
                                          onMenuCloseSell={onClose}
                                          onMenuOpenSell={onOpen}
                                          onChangeSel={(e) => {
                                            changeHandler(
                                              e,
                                              "select",
                                              item.key,
                                              false,
                                              item.options,
                                              item.related
                                            );
                                          }}
                                        />
                                      </>
                                    ) : item.type == "checkbox" ||
                                      item.type == "checkbox_multiple" ? (
                                      <InputMain
                                        typeInput={item.type}
                                        key={item?.key}
                                        label={""}
                                        error={false}
                                        required={false}
                                        valueSel={dataval[item?.key]}
                                        defaultChecked={row[item?.key]}
                                        isMulti={
                                          item.type == "checkbox" ? false : true
                                        }
                                        options={item?.options}
                                        onMenuCloseSell={onClose}
                                        onMenuOpenSell={() => {
                                          onOpen;
                                        }}
                                        onChangeSel={(e) => {
                                          changeHandler(
                                            e,
                                            "checkbox",
                                            item.key,
                                            item.type == "checkbox"
                                              ? false
                                              : true,
                                            item.options
                                          );
                                        }}
                                        valuename={item?.key}
                                      />
                                    ) : typeof row[item.key] == "string" ||
                                      typeof row[item.key] == "number" ? (
                                      row[item.key]
                                    ) : (
                                      <>0</>
                                    )
                                  ) : typeof row[item.key] == "string" ||
                                    typeof row[item.key] == "number" ||
                                    typeof row[item.key] == "boolean" ? (
                                    row[item.key] == true &&
                                    typeof row[item.key] != "number" ? (
                                      <img
                                        src="/assets/images/apps/checklist.png"
                                        className="w-[20px]"
                                      />
                                    ) : row[item.key] == false &&
                                      typeof row[item.key] != "number" ? (
                                      <img
                                        src="/assets/images/apps/cross.png"
                                        className="w-[20px]"
                                      />
                                    ) : (
                                      row[item.key] ?? "0"
                                    )
                                  ) : (
                                    <>0</>
                                  )}
                                </td>
                              ) : (
                                <></>
                              );
                            })}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="mt-8 flex justify-center">Not Data</div>
              </>
            )
          ) : (
            <>
              <div className="mt-8 flex justify-center">
                <IconSpiner />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {isloading ? (
            <>
              <div className="mt-8 flex justify-center">
                <IconSpiner />
              </div>
            </>
          ) : (
            <>
              <div className="mt-8 flex justify-center">Not Data</div>
            </>
          )}
        </>
      )}
      {checked ? (
        <div
          className={
            ishide
              ? "mt-2 w-full justify-center flex hidden"
              : "mt-2 w-full justify-center flex"
          }
        >
          <ButtonSubmit
            onCreate={() => {
              //  setloading(true);
              //  OnSave();
              onLoadmore();
            }}
            loading={loading}
            label="Load More..."
            isprimary={false}
            ClassCustome=" px-4 py-2 bg-[#dbead5]"
          />
        </div>
      ) : isPageing ? (
        <div className="order-3">
          <PaginationTable
            vnext={datatable?.pagging?.next}
            vprev={datatable?.pagging?.prev}
            vnextJump={datatable?.pagging?.next_jump}
            vprevjump={datatable?.pagging?.prev_jump}
            prev={previn}
            next={nextin}
            prevJump={prevJumpin}
            nextJump={nextJumpin}
            totalPage={datatable?.pagging?.end_paging}
            page={datatable?.pagging?.start_paging}
            totalData={datatable?.pagging?.total_data}
          />
        </div>
      ) : (
        <></>
      )}

      {checked ? (
        <div className="mt-2 w-full justify-end flex gap-4">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              onClosePopUp();
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              onSaveMulti(0);

              router.replace({
                pathname: window.location.pathname,
                query: {
                  parent: idparent,
                  data: new URLSearchParams(window.location.search).get("data"),
                  popup: popup ? "1" : "2",
                },
              });
            }}
            loading={false}
            label="Save Change"
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TableView;
