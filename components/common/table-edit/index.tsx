// table-edit
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
  getColor,
  formatAmountNoDecimals,
  GFormatDate,
  GetPathUri,
} from "../../helper";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import InputMain from "../input/InputMain";
import ButtonSubmit from "../button/ButtonSubmit";
import { useSelector } from "react-redux";
import ButtonAddList from "../button/ButtonAddList";
import TabMenuIcon from "../../common/tabIcon/tab";
import ModalConfirmationComponent from "../../common/modal/ModalConfirmation";
import ButtonCreate from "../button/ButtonCreate";
import { textarea } from "@material-tailwind/react";
import { useTransactionPermission } from "../../../hooks/useFormPermission";

interface TableViewProps {
  uri: string;
  uriSave?: string;
  groups: string;
  isEditTable?: boolean;
  queryString?: string;
  isTitle?: boolean;
  title?: string;
  isDeleted?: boolean;
  isBtnAdd?: boolean;
  methodFetch?: string;
  bodyFetch?: {};
  headRow?: number;
  checked?: boolean;
  checkedRadio?: boolean;
  onClosePopUp?: () => void;
  isEditForce?: boolean;
  isAdvance?: boolean;
  filter?: any;
  isPageing?: boolean;
  isNAudit?: boolean;
  NAuditCode?: string;
  isBtnView?: boolean;
  isBtnEdit?: boolean;
  isBtnDelete?: boolean;
  CardTab?: string;
  isNotToast?: boolean;
  numberNotdecimals?: boolean;
  isClickAbled?: boolean;
  isTabIcon?: boolean;
  filterProps?: (dataMul: any) => void;
  onDataLoaded?: (data: any[]) => void;
  btnCustome?: any;
  insertHTML?: any;
  btnSave?: boolean;
  actionCol?: boolean;
  lblBtnSave?: string;
}
const TableView = (props: TableViewProps) => {
  const {
    uri,
    uriSave = "",
    groups,
    isEditTable = true,
    queryString,
    isTitle = false,
    title = "",
    isDeleted = false,
    onDataLoaded,
    methodFetch = "GET",
    bodyFetch = {},
    headRow = 1,
    checked = false,
    checkedRadio = false,
    onClosePopUp,
    isEditForce = false,
    isAdvance = false,
    filter,
    isPageing = true,
    isNAudit = false,
    NAuditCode = "0",
    isBtnAdd = true,
    isBtnView = true,
    isBtnEdit = true,
    isBtnDelete = true,
    isNotToast = false,
    numberNotdecimals = false,
    isClickAbled = true,
    isTabIcon = true,
    btnSave = true,
    filterProps,
    btnCustome,
    insertHTML,
    actionCol = true,
    lblBtnSave = "Save Change",
  } = props;
  const Lastpath = window.location.pathname.split("/").pop();
  const GLOBALURI = uri;
  const [isview, setisview] = useState(false);
  const [isedit, setisedit] = useState(false);
  const [isdeleted, setisDeleted] = useState(isDeleted);
  const router = useRouter();
  const ref: any = useRef(null);
  const path = router.pathname;
  const [loadingin, setloadingin] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [editActive, seteditActive] = useState(-1);
  const [dataval, setData] = useState<any>({});
  const [datavalMulti, setDataMulti] = useState<any>({});
  const [overflow, setoverflow] = useState(false);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [isSelected, setisSelected] = useState<any>(-1);
  const [isidSelected, setisidSelected] = useState<any>(-1);
  const [isPopup, setIsPopUp] = useState(false);
  const [path2, setpath2] = useState("");

  const [datavalsrc, setDatasrc] = useState<any>({
    status: { value: "-1", label: "ALL" },
  });
  const [datatable, setdatatable] = useState<any>({});
  const [add, setaddform] = useState<boolean>(false);
  const [idparent, setidparent] = useState("");
  const [loading, setloading] = useState<boolean>(false);
  const [ishide, setishide] = useState<boolean>(false);
  const [popup, setpopup] = useState<boolean>(false);
  const [popupIntbl, setpopupIntbl] = useState<boolean>(false);
  const [titlePopupTbl, settitlePopupTbl] = useState("");
  const [contentPopupTbl, setcontentPopupTbl] = useState("");

  const [searchActive, setsearchActive] = useState<boolean>(false);
  const [btnsearchs, setbtnsearchs] = useState<boolean>(false);
  const [loadbtn, setlaodbtn] = useState<boolean>(false);
  const [hideFrist, sethideFrist] = useState<boolean>(true);

  const [actMenu, setActMenu] = useState<any>({});
  const [pageDat, setPageDat] = useState<any>("0");
  const [left, setleft] = useState<any>("0");
  const [top, settop] = useState<any>("0");
  const [colact, setcolact] = useState<any>(-1);
  const [datadet, setdatadet] = useState<any>({});
  const [datacompany, setdatacompany] = useState<any>(0);
  const [headerPopUpDblclick, setheaderPopUpDblclick] = useState<any>(-1);
  const [SheaderPopUpDblclick, setSheaderPopUpDblclick] = useState<any>(-1);
  const [bodyPopUpDblclick, setbodyPopUpDblclick] = useState<any>(-1);
  const [SbodyPopUpDblclick, setSbodyPopUpDblclick] = useState<any>(-1);
  const [dataFrmPopUp, setdataFrmPopUp] = useState<any>({});
  const canFIT = useTransactionPermission("fit");
  const canGIT = useTransactionPermission("git");
  const canDayUse = useTransactionPermission("day-use");
  const canVR = useTransactionPermission("vr");
  const canCheckIn = useTransactionPermission("check_in");
  const canCheckOut = useTransactionPermission("check_out");
  const canCancelRsv = useTransactionPermission("cancel_reservation");
  const canCopyRsv = useTransactionPermission("copy_reservation");
  const canConfirmRsv = useTransactionPermission("confirm_reservation");
  const canAssignRoom = useTransactionPermission("assign_room");
  const canUnAssignRoom = useTransactionPermission("un_assign_room");
  const canConfirmChangeRoom = useTransactionPermission("confirm_change_room");
  const canCancelChangeRoom = useTransactionPermission("cancel_change_room");
  const canUnCheckOut = useTransactionPermission("un_check_out");
  const canUnCheckIn = useTransactionPermission("un_check_in");
  const canMoveRsv = useTransactionPermission("move_reservation");
  const hasActionAccess = (key: string) => {
    switch (key) {
      case "fit":                  return canFIT;
      case "git":                  return canGIT;
      case "day-use":              return canDayUse;
      case "vr":                   return canVR;
      case "check_in":             return canCheckIn;
      case "check_out":            return canCheckOut;
      case "cancel_reservation":   return canCancelRsv;
      case "copy_reservation":     return canCopyRsv;
      case "confirm_reservation":  return canConfirmRsv;
      case "assign_room":          return canAssignRoom;
      case "un_assign_room":       return canUnAssignRoom;
      case "confirm_change_room":  return canConfirmChangeRoom;
      case "cancel_change_room":   return canCancelChangeRoom;
      case "un_check_out":         return canUnCheckOut;
      case "un_check_in":          return canUnCheckIn;
      case "move_reservation":     return canMoveRsv;
      default: return true;
    }
  };
  
  const GetCompany = async () => {
    try {
      if (datacompany == 0) {
        let urisave = "/cms/profile/company-v2";
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
          setdatacompany(saveprocess?.data);
        } else {
        }
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const onOpen = () => {
    setoverflow(true);
    return true;
  };
  const onClose = () => {
    // console.log("datalog", "close");
    setoverflow(false);
    return false;
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
      b == "date" ||
      b == "time"
    ) {
      // console.log(b);
      if (b == "number") {
        // console.log(formatAmount(e.target.value));
        if (numberNotdecimals) {
          setData({
            ...dataval,
            [e.target.name]: formatAmount(NumberClear(e.target.value)),
          });
        } else {
          setData({
            ...dataval,
            [e.target.name]: formatAmount(e.target.value),
          });
        }
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
          dataMerge[row] = typeof e[row] == "object" ? e[row].value : e[row];
          dataMerge[row + "_ori"] = e[row];
        });
      }
      // console.log(dataMerge);
      setData({ ...dataval, ...dataMerge });
    } else if (b == "file") {
      setData({
        ...dataval,
        [name]: e,
      });
    }

    // setError("");
  };
  const changeHandlerSrc = (e: any, b?: boolean, name?: string) => {
    // console.log("widy", e);
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
      // console.log(name);
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
    if (GetQueryStr("body")) {
      router.query = { ...router.query, body: GetQueryStr("body") };
      router.query = { ...router.query, src: GetQueryStr("src") };
    }
    router.query = { ...router.query, search_value: valsrc };
  };
  const submitFilter = () => {
    setIsloading(true);
    router.push({
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
      setlaodbtn(true);
      let urisave = uri + "?group=" + Lastpath + (queryString ? "&" + queryString : "");
      let mth = "POST";

      const raw = JSON.stringify(FinalPOstDat());

      if (id != 0) {
        let baseUri = uri.split('?')[0];
        let uriQuery = uri.split('?')[1] ? "&" + uri.split('?')[1] : "";
        urisave = baseUri + "/" + id + "?group=" + Lastpath + uriQuery + (queryString ? "&" + queryString : "");
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
        setoverflow(false);
        setlaodbtn(false);
      } else {
        setloadingin(false);
        setlaodbtn(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloadingin(false);
    }
  };
  const onSavPopUp = async (arrdat) => {
    // console.log("sets", FinalPOstDat());
    try {
      // setlaodbtn(true);
      let urisave = arrdat?.endpoint;
      let mth = "POST";
      var varBdy: any = {};
      varBdy = arrdat;
      varBdy.form = dataFrmPopUp;

      const raw = JSON.stringify(varBdy);

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
        setSheaderPopUpDblclick(-1);
        setheaderPopUpDblclick(-1);
        setdataFrmPopUp({});
        setloadingin(false);
        GetDataTable();
        setlaodbtn(false);
      } else {
        setloadingin(false);
        setlaodbtn(false);
      }
    } catch (error) {
      // console.log("erro", error);
      // setloadingin(false);
    }
  };
  const onSaveMulti = async (id: number) => {
    try {
      if (uriSave != "") {
        let urisave = uriSave + "?group=" + Lastpath + (queryString ? "&" + queryString : "");
        let mth = "POST";

        const transformeddatavalMulti = Object.entries(datavalMulti).filter(
          ([key, value]) => value === true
        );
        const raw = JSON.stringify({
          idx: transformeddatavalMulti.map(([key, value]) => key),
        });

        if (id != 0) {
          let baseUri = uri.split('?')[0];
          let uriQuery = uri.split('?')[1] ? "&" + uri.split('?')[1] : "";
          urisave = baseUri + "/" + id + "?group=" + Lastpath + uriQuery + (queryString ? "&" + queryString : "");
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
          setoverflow(false);
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
      let baseUri = GLOBALURI.split('?')[0];
      let uriQuery = GLOBALURI.split('?')[1] ? "&" + GLOBALURI.split('?')[1] : "";
      let getuuri = baseUri + "/" + id + "?q=1" + uriQuery + (queryString ? "&" + queryString : "");

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
      //GetDataTable();
    } else if ("-" + sort == "-" + row.key) {
      query = { ...query, sort: row.key };
      router.replace({
        pathname: window.location.pathname,
        query: query,
      });
      //GetDataTable();
    } else {
      query = { ...query, sort: row.key };
      router.replace({
        pathname: window.location.pathname,
        query: query,
      });
      // GetDataTable();
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
        "",
        isNotToast
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

        setIsloading(false);
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
        datajson?.table?.map((rw) => {
          if (rw?.is_search) {
            setbtnsearchs(true);
          }
          if (rw?.key == "company_id") {
            GetCompany();
          }
        });

        setisview(datajson?.permission?.view);
        setisedit(isEditForce ? false : datajson?.permission?.edit);
        setisDeleted(datajson?.permission?.delete);
        setpath2(window.location.pathname.split("/")[2]);
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
    setPageDat(datatable?.pagging?.prev);
  };
  const nextin = () => {
    if (datatable?.pagging?.next) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.next);
    }
    // alert(2);
    setPageDat(datatable?.pagging?.next);
  };
  const prevJumpin = () => {
    if (datatable?.pagging?.prev_jump) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.prev_jump);
    }
    setPageDat(datatable?.pagging?.prev_jump);
  };
  const nextJumpin = () => {
    if (datatable?.pagging?.next_jump) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagging?.next_jump);
    }
    setPageDat(datatable?.pagging?.next_jump);
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
    const elPopup =
      GetQueryStr("card") && GetQueryStr("card") != "0"
        ? el("." + GetQueryStr("card") + "cls")
        : el(".popuponly");
    const elBtn = evt.currentTarget;

    // Object.assign(elPopup.style, {
    //   left: `${evt.pageX}px`,
    //   top: `${evt.pageY - 180}px`,
    // });

    if (isNAudit) {
      // if (left == "0") {
      // setleft(evt.nativeEvent.offsetY + 20);
      // // }
      // // if (top == "0") {
      // settop(evt.nativeEvent.offsetX + 100);
      // }
      // setleft(evt.offsetLeft);
      // settop(evt.offsetTop);
      // console.log(evt.nativeEvent.offsetX + "_" + e.pageY);
    } else {
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const getidparent = urlParams.get("parent");
    setidparent(getidparent);

    if (add) {
      seteditActive(-1);
    }
    if (GetQueryStr("pageload") != "0") {
      GetDataTable(datavalsrc?.status?.value, Number(GetQueryStr("pageload")));
      setPageDat(GetQueryStr("pageload"));
    } else {
      GetDataTable();
    }
    // console.log("dbg", window.location.pathname);
    // }, [router.query, router.pathname, add]);
  }, [window.location.search, window.location.pathname, add]);

  useEffect(() => {
    if (ishide) {
      setishide(false);
    }
  }, [queryString]);
  useEffect(() => {
    if (checked) {
      GetDataTableMulti();
    }
  }, []);
  useEffect(() => {
    const handleOutSideClick = (event) => {
      // console.log("wdy", ref.current.className + ";" + event.target.className);
      if ("mt-2 w-full cursor-pointer" != event.target.className) {
        // console.log("wdy12");
        setIsPopUp(false);
        // setoverflow(false);
        if (editActive === -1 && !add) {
          setoverflow(false);
        }
        // setoverflow(true);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref, editActive, add]);

  return (
    <>
      <div
        key={titlePopupTbl}
        className={(popupIntbl ? "block" : "hidden") + " overlay "}
      >
        <div className="flex justify-center mt-20 ">
          <div className="bg-white w-[600px] p-4">
            <div>
              <h4>Information {titlePopupTbl}</h4>
            </div>
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: contentPopupTbl }}
            ></div>
            <div className="mt-4">
              <ButtonSubmit
                onCreate={() => {
                  setpopupIntbl(false);
                }}
                label="Close"
              />
            </div>
          </div>
        </div>
      </div>

      {datatable?.code == "200" ? (
        <>
          {isAdvance ? (
            <>
              <TabMenuIcon
                actMenu={actMenu?.actions}
                id={isidSelected}
                foliodat={datadet}
                isNAudit={isNAudit}
                NAuditCode={NAuditCode}
                isTitle={false}
                isTabIcon={isTabIcon}
              />
            </>
          ) : (
            <></>
          )}
          {filter}
          {filterProps && filterProps(datavalMulti)}
          <div className="flex justify-end gap-2">
            {datatable?.permission?.add == 1 ? (
              <>
                {isBtnAdd && (
                  <>
                    <ButtonAddList
                      label="+ Add"
                      title={
                        isTitle
                          ? title != ""
                            ? title
                            : GetCapitalFirst(
                                GLOBALURI.replaceAll("/cms/", " ")
                                  .replaceAll("-", " ")
                                  .replaceAll("/", " ")
                              )
                          : ""
                      }
                      isBtnadd={
                        datatable?.permission?.add == 1 ? true : isBtnAdd
                      }
                      onAdd={() => {
                        if (isEditTable) {
                          dataval.status = true;

                          setaddform(true);
                          let datatype = {};
                          (datatable?.table ?? []).map((row) => {
                            if (row?.type == "number") {
                              datatype = { ...datatype, [row?.key]: 0 };
                            } else if (row?.type == "checkbox") {
                              datatype = { ...datatype, [row?.key]: true };
                            } else if (row?.type == "hide") {
                            } else {
                              if (row?.value) {
                                datatype = {
                                  ...datatype,
                                  [row?.key]: row?.value,
                                };
                              }
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
                  </>
                )}
              </>
            ) : (
              <></>
            )}
            <>{btnCustome && btnCustome()}</>
          </div>
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
                        } else if (row?.type == "autocomplete") {
                          types = "text";
                          typesmain = "base";
                        } else if (row?.type == "hide") {
                          types = row?.type_search ?? 'text'
                          typesmain = "base";
                        } else {
                          types =
                            row?.type != "none" ? row?.type : row?.type_search;
                          typesmain = "base";
                        }

                        return row?.is_search ? (
                          // <div className=" w-full">
                          <div key={row.key} className="w-full">
                            <InputMain
                              typeInput={typesmain}
                              error={false}
                              label={row?.label}
                              required={false}
                              options={optionsd}
                              rest={{
                                name: row?.key,
                                placeholder: row?.label,
                                value: datavalsrc[row?.key] ?? row?.value ?? "",
                                type: types,
                                onChange: (e) => {
                                  changeHandlerSrc(e, false, row?.key);
                                },
                                min: row?.min,
                              }}
                              onChangeSel={(e: any) => {
                                changeHandlerSrc(e, true, row?.key);
                                //GetDataTable(e.value);
                              }}
                              valueSel={
                                datavalsrc[row?.key]
                                  ? datavalsrc[row?.key]
                                  : row?.key == "status"
                                  ? {
                                      value: "1",
                                      label: "Active",
                                    }
                                  : {
                                      value: "-1",
                                      label: "ALL",
                                    }
                              }
                              isMulti={false}
                              placeholder={row?.label}
                            />
                          </div>
                        ) : <React.Fragment key={row.key}></React.Fragment>;
                      })}
                      <div className="flex items-end">
                        <div className=" flex ml-2 h-[38px] mt-4 gap-4">
                          <ButtonSubmit
                            label="Reset"
                            onCreate={() => {
                              // console.log("src", datavalsrc);
                              setDatasrc({
                                status: { value: "-1", label: "ALL" },
                              });
                              if (GetQueryStr("data")) {
                                router.push({
                                  pathname: window.location.pathname,
                                  query: {
                                    parent: idparent,
                                    module: GetQueryStr("module"),
                                    search: "",
                                    data: GetQueryStr("data"),
                                  },
                                });
                              } else {
                                router.push({
                                  pathname: window.location.pathname,
                                  query: {
                                    parent: idparent,
                                    module: GetQueryStr("module"),
                                    search: "",
                                    // time: new Date().getTime(),
                                  },
                                });
                              }
                            }}
                            isprimary={false}
                          ></ButtonSubmit>
                          <ButtonSubmit
                            label="Search"
                            onCreate={() => {
                              submitFilter();
                            }}
                            isprimary={true}
                          ></ButtonSubmit>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex w-full justify-center pt-4 lg:pt-0 pb-4 px-2">
                    <div className="text-sm md:text-base text-center break-words">Please Click Search To Find The Data</div>
                  </div>
                )}
              </fieldset>
            </div>
          ) : (
            <div className="mt-4"></div>
          )}

          {/* <pre style={{fontSize: 14}}>{JSON.stringify(datatable?.permission, null, 2)}</pre> */}

          {datatable?.table ? (
            <>
              <>{insertHTML && insertHTML()}</>
              <div
                className={
                  "rounded-xl overflow-hidden shadow-md " +
                  (overflow == true
                    ? " w-full overflow-auto min-h-screen"
                    : editActive != -1
                    ? " h-screen table-responsive "
                    : add
                    ? " h-screen table-responsive "
                    : " table-responsive ")
                }
              >
                <table
                  className={
                    "table-auto border-separate border-spacing-0 rounded-lg min-w-full whitespace-nowrap" +
                    (editActive != -1 ? " w-full " : " w-full ")
                  }
                >
                  <thead>
                    <tr className="bg-[#232020]">
                      {/* #323A50 */}
                      {checked && !checkedRadio ? (
                        <td className="bg-[#232020] text-white px-2 py-1 font-bold cursor-pointer rounded-tl-lg">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type={checkedRadio ? "radio" : "checkbox"}
                              name=""
                              value={"all"}
                              id={"all"}
                              onChange={(e) => { onCheckAll(e); }}
                            />
                            <label className="form-check-label" htmlFor={"all"}></label>
                          </div>
                        </td>
                      ) : (
                        <>
                          {checkedRadio ? (
                            <td className="bg-[#232020] w-[50px] px-2 py-1 font-bold rounded-tl-lg">{""}</td>
                          ) : (
                            <></>
                          )}
                        </>
                      )}

                      {(actionCol && isdeleted) ||
                      (actionCol && isview) ||
                      (actionCol && isAdvance) ||
                      (actionCol && isedit) ? (
                        // kalau ada checked, action col sudah tidak di posisi pertama, jadi tidak perlu rounded-tl-lg
                        <td className={
                          "bg-[#232020] px-2 py-1 font-bold w-[50px] " +
                          (!checked && !checkedRadio ? "rounded-tl-lg" : "")
                        }>{""}</td>
                      ) : (
                        <></>
                      )}
                      {datatable?.table?.map((row: any, i: any) =>
                        !row?.row || row?.row == 1 ? (
                          <td
                            title={"Sort By " + row.label}
                            key={i}
                            className={
                              (headRow == 2 && row?.colspan ? " text-center " : "") +
                              " text-white px-2 py-1 font-medium text-xs cursor-pointer hover:bg-[#3a3535] transition-colors" +
                              (i === 0 && !checked && !checkedRadio && !((actionCol && isdeleted) || (actionCol && isview) || (actionCol && isAdvance) || (actionCol && isedit)) ? " rounded-tl-lg" : "") +
                              (i === (datatable?.table?.filter((r: any) => !r?.row || r?.row == 1).length - 1) ? " rounded-tr-lg" : "")
                            }
                            onClick={() => {
                              if (!row?.is_header_double_click) {
                                clickSort(row);
                              }
                            }}
                            // rowSpan={row?.rowspan ?? false}
                            // colSpan={row?.colspan ?? false}
                            rowSpan={row?.rowspan ?? undefined}
                            colSpan={row?.colspan ?? undefined}
                            onContextMenu={() => {
                              if (row?.is_header_double_click) {
                                // alert("ses");
                                setbodyPopUpDblclick(-1);
                                setheaderPopUpDblclick(i);
                              }
                            }}
                          >
                            {row?.is_header_double_click &&
                              headerPopUpDblclick == i && (
                                <>
                                  <div
                                    className={
                                      " p-2 text-black absolute w-min-[150px] z-20 bg-white"
                                    }
                                  >
                                    <div className="font-bold">{row.label}</div>
                                    <div className="border-[1px] mt-2">
                                      {typeof row?.double_click_action ==
                                        "object" &&
                                        row?.double_click_action?.map(
                                          (rwa, ia) => (
                                            <>
                                              <div
                                                className="p-2 cursor-pointer border-[2px] "
                                                onClick={() => {
                                                  setbodyPopUpDblclick(-1);
                                                  if (
                                                    SheaderPopUpDblclick == ia
                                                  ) {
                                                    setSheaderPopUpDblclick(-1);
                                                    setdataFrmPopUp({});
                                                  } else {
                                                    setSheaderPopUpDblclick(ia);
                                                    setdataFrmPopUp({});
                                                  }
                                                }}
                                              >
                                                {rwa?.label}
                                              </div>
                                              {SheaderPopUpDblclick == ia && (
                                                <>
                                                  <div className="p-2 border-[1px]">
                                                    <div className="flex ">
                                                      {typeof rwa?.form ==
                                                        "object" &&
                                                        rwa?.form?.map(
                                                          (rws, is) => (
                                                            <>
                                                              <InputMain
                                                                label={
                                                                  rws?.label
                                                                }
                                                                error={true}
                                                                typeInput={
                                                                  rws?.type
                                                                }
                                                                rest={{
                                                                  onChange: (
                                                                    e
                                                                  ) => {
                                                                    setdataFrmPopUp(
                                                                      {
                                                                        ...dataFrmPopUp,
                                                                        [rws?.key]:
                                                                          e
                                                                            .target
                                                                            .value,
                                                                      }
                                                                    );
                                                                  },
                                                                  type: rws?.type_input,
                                                                  name: rws?.key,
                                                                  value:
                                                                    dataFrmPopUp[
                                                                      rws?.key
                                                                    ],
                                                                }}
                                                                restArea={{
                                                                  onChange: (
                                                                    e
                                                                  ) => {
                                                                    setdataFrmPopUp(
                                                                      {
                                                                        ...dataFrmPopUp,
                                                                        [rws?.key]:
                                                                          e
                                                                            .target
                                                                            .value,
                                                                      }
                                                                    );
                                                                  },
                                                                }}
                                                              />
                                                            </>
                                                          )
                                                        )}
                                                    </div>
                                                    <div className="flex mt-2 gap-2 mb-4 ">
                                                      <ButtonSubmit
                                                        onCreate={() => {
                                                          setSheaderPopUpDblclick(
                                                            -1
                                                          );
                                                        }}
                                                        label="Cancel"
                                                        isprimary={false}
                                                      />
                                                      <ButtonSubmit
                                                        onCreate={() => {
                                                          setSheaderPopUpDblclick(
                                                            -1
                                                          );
                                                          setheaderPopUpDblclick(
                                                            -1
                                                          );
                                                          // setdataFrmPopUp({});
                                                          setTimeout(() => {
                                                            onSavPopUp(rwa);
                                                          }, 600);
                                                        }}
                                                        label="Submit"
                                                      />
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          )
                                        )}
                                    </div>
                                    <div className="mt-4">
                                      <ButtonSubmit
                                        onCreate={() => {
                                          setheaderPopUpDblclick(-1);
                                        }}
                                        label="Cancel"
                                        isprimary={false}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            {row.label}
                          </td>
                        ) : (
                          <></>
                        )
                      )}
                    </tr>
                    {headRow == 2 ? (
                      <tr className="bg-[#232020]">
                        {checked ? (
                          <td className="text-white px-2 py-1 font-bold cursor-pointer"></td>
                        ) : (
                          <></>
                        )}
                        {(actionCol && isdeleted) ||
                        (actionCol && isview) ||
                        (actionCol && isAdvance) ||
                        (actionCol && isedit) ? (
                          // row 2 — TIDAK perlu rounded, sudah di row 1
                          <td className="bg-[#232020] px-2 py-1 font-bold w-[50px]">{""}</td>
                        ) : (
                          <></>
                        )}

                        {datatable?.table?.map((row: any, i: any) =>
                          row?.row == 2 ? (
                            <td
                              title={"Sort By " + row.label}
                              key={i}
                              className="text-white px-2 py-1 font-medium text-xs cursor-pointer hover:bg-[#3a3535] transition-colors"
                              onClick={() => { clickSort(row); }}
                              rowSpan={row?.rowspan ?? false}
                              colSpan={row?.colspan ?? false}
                            >
                              {row.label}
                            </td>
                          ) : (
                            <></>
                          )
                        )}
                      </tr>
                    ) : (
                      <></>
                    )}
                  </thead>
                  <tbody>
                    {add ? (
                      <tr
                        key={"Add-"}
                        className="focus:!bg-[#ead6b4] hover:!bg-[#ead6b4]"
                      >
                        <td
                          className={
                            (path2 == "git" ? " " : "bg-gray-300") +
                            ` p-2 focus:!bg-[#ead6b4] hover:!bg-[#ead6b4]`
                          }
                        >
                          <div className="flex gap-1">
                            <ButtonSubmit
                              label="Close"
                              isprimary={false}
                              onCreate={() => {
                                setaddform(false);
                                setData({});
                                setoverflow(false);
                              }}
                              ClassCustome="px-2 my-2"
                            />
                            {datatable?.permission?.add == 1 || datatable?.permission?.edit == 1 ? (
                              <>
                                <ButtonSubmit
                                  ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                                  ClassCustome="px-2 my-2"
                                  label="Save"
                                  isBtnAdd={
                                    datatable?.permission?.add == 1 ? true : isBtnAdd
                                  }
                                  onCreate={() => {
                                    if (!loadbtn) {
                                      setlaodbtn(true);
                                      onSave(0);
                                    }
                                  }}
                                  loading={loadbtn}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                            {/* <ButtonSubmit
                              ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                              ClassCustome="px-2 my-2"
                              label="Save"
                              onCreate={() => {
                                if (!loadbtn) {
                                  setlaodbtn(true);
                                  onSave(0);
                                }
                              }}
                              loading={loadbtn}
                            /> */}
                          </div>
                        </td>

                        {(datatable?.table ?? []).map((item: any, a: any) => {

                          if (item.type == "hide") {
                            return <></>
                          }
                          return (
                            <td
                              className={
                                (path2 == "git" ? " " : "bg-gray-300") +
                                "  p-2 "
                              }
                              key={item.key + "-" + a}
                            >
                              {item.type != "none" ? (
                                item.type == "text" ||
                                item.type == "number" ||
                                item.type == "date" ||
                                item.type == "time" ||
                                item.type == "autocomplete" ? (
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
                                        item.type == "number"
                                          ? dataval[item.key] ?? 0
                                          : dataval[item.key] ?? item.value,
                                      min: item.min,
                                      onChange: (e) => {
                                        changeHandler(e, item.type);
                                      },
                                      disabled: dataval[item.key + "_disabled"],
                                      onKeyUp: (e) => {
                                        if (
                                          e.key === "Enter" ||
                                          e.keyCode === 13
                                        ) {
                                          if (!loadbtn) {
                                            setlaodbtn(true);
                                            onSave(0);
                                          }
                                        }
                                      },
                                    }}
                                    uriAutoComp={item?.url_autocomplete}
                                    onChangeSel={(e) => {
                                      // console.log("wdy", e);
                                      changeHandler(
                                        e,
                                        "select",
                                        item.key,
                                        false,
                                        item.options,
                                        item?.related
                                      );
                                    }}
                                    valueSel={
                                      dataval[item.key + "_ori"] ??
                                      dataval[item.key]
                                    }
                                  />
                                ) : item.type == "select" ||
                                  item.type == "select_multiple" ? (
                                  <InputMain
                                    typeInput="select-multi"
                                    label={""}
                                    error={false}
                                    required={false}
                                    valueSel={
                                      dataval[item.key + "_ori"] ??
                                      dataval[item.key]
                                    }
                                    isMulti={
                                      item.type == "select" ? false : true
                                    }
                                    // onMenuCloseSell={onClose}
                                    // onMenuOpenSell={onOpen}
                                    onChangeSel={(e) => {
                                      changeHandler(
                                        e,
                                        "select",
                                        item.key,
                                        item.type == "select" ? false : true,
                                        item.options,
                                        item?.related
                                      );
                                    }}
                                    placeholder={"Select " + item?.label}
                                    options={
                                      item.key == "company_id"
                                        ? datacompany == 0
                                          ? []
                                          : datacompany
                                        : item.options
                                    } //opti widy
                                    disabled={dataval[item.key + "_disabled"]}
                                  />
                                ) : item.type == "checkbox" ||
                                  item.type == "checkbox_multi" ? (
                                  <InputMain
                                    disabled={dataval[item.key + "_disabled"]}
                                    typeInput={item.type}
                                    label={""}
                                    error={false}
                                    required={false}
                                    valueSel={dataval[item.key] ?? true}
                                    isMulti={
                                      item.type == "checkbox" ? false : true
                                    }
                                    onChangeSel={(e) => {
                                      changeHandler(
                                        e,
                                        "checkbox",
                                        item.key,
                                        item.type == "checkbox" ? false : true,
                                        item.options
                                      );
                                    }}
                                    options={item?.options}
                                    valuename={item?.key}
                                    // onMenuCloseSell={onClose}
                                    // onMenuOpenSell={onOpen}
                                  />
                                ) : // date
                                item.type == "date" ? (
                                  <InputMain
                                    typeInput="base"
                                    label={"-"}
                                    error={false}
                                    required={false}
                                    rest={{
                                      name: item.key,
                                      type: item.type,
                                      value:
                                        typeof dataval[item.key] == "string" ||
                                        typeof dataval[item.key] == "number"
                                          ? dataval[item.key] ??
                                            dataval[item.key]
                                          : dataval[item.key] ??
                                            dataval[item.key]?.en,
                                      onChange: (e) => {
                                        changeHandler(e, "text");
                                      },
                                    }}
                                  />
                                ) : item.type == "fileimage" ? (
                                  <InputMain
                                    typeInput="base"
                                    label={"-"}
                                    error={false}
                                    required={false}
                                    rest={{
                                      name: item.key,
                                      type: "file",
                                      value:
                                        typeof dataval[item.key] == "string" ||
                                        typeof dataval[item.key] == "number"
                                          ? dataval[item.key] ??
                                            dataval[item.key]
                                          : dataval[item.key] ??
                                            dataval[item.key]?.en,
                                      onChange: async (e: any) => {
                                        const base64Files = await Promise.all(
                                          e.map((file) => {
                                            return new Promise<string>(
                                              (resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.readAsDataURL(file);
                                                reader.onload = () =>
                                                  resolve(
                                                    reader.result as string
                                                  );
                                                reader.onerror = (error) =>
                                                  reject(error);
                                              }
                                            );
                                          })
                                        );
                                        changeHandler(
                                          base64Files[0],
                                          "file",
                                          item.key
                                        );
                                      },
                                    }}
                                  />
                                ) : (
                                  <></>
                                )
                              ) : (
                                <></>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ) : (
                      <></>
                    )}
                    {datatable?.data?.map((row: any, index) =>
                      editActive != index ? (
                        <tr
                          key={row?.id + "-" + index}
                          className={
                            "focus:!bg-[#ead6b4] hover:!bg-[#ead6b4] " +
                            (isAdvance ? " cursor-pointer " : "") +
                            (path2 == "git" && row?.is_parent
                              ? " !bg-[#d4e4fc] "
                              : "")
                          }
                          onDoubleClick={() => {
                            if (isAdvance) {
                              // alert("test");
                              router.push({
                                pathname:
                                  "/reservation/" +
                                  row?.type_reservation.toLowerCase()  +
                                  "/reservation",
                                query: {
                                  parent: GetQueryStr("parent"),
                                  data: row?.id,
                                  body: GetQueryStr("body") ?? null,
                                  src: GetQueryStr("src") ?? null,
                                  search_v:
                                    GetQueryStr("search_value") ??
                                    GetQueryStr("search_v"),
                                  search_field_v:
                                    GetQueryStr("search_field") ??
                                    GetQueryStr("search_field_v"),
                                  path_v: GetQueryStr("path_v"),
                                },
                              });
                            } else if (isEditTable && isedit) {
                              seteditActive(index);
                              setData({});
                              setaddform(false);
                              setDataEdits(index);
                              ValueSetEdit(row);
                              setoverflow(true);
                            }
                          }}
                          onClick={() => {
                            setTimeout(() => {
                              if (isAdvance && isClickAbled) {
                                setisSelected(index);
                                setisidSelected(row?.id);
                                setdatadet(row);

                                setActMenu(row);
                                if (!GetQueryStr("key")) {
                                  router.replace({
                                    pathname: window.location.pathname,
                                    query: {
                                      parent: GetQueryStr("parent"),
                                      data: row?.id,
                                      time: new Date().getTime(),
                                      card: NAuditCode,
                                      pageload: pageDat,
                                      group: Lastpath,
                                      body: GetQueryStr("body") ?? null,
                                      src: GetQueryStr("src") ?? null,
                                      search_value:
                                        GetQueryStr("search_value") ??
                                        GetQueryStr("search_v"),
                                      search_field:
                                        GetQueryStr("search_field") ??
                                        GetQueryStr("search_field_v"),
                                      search: GetQueryStr("search"),
                                      path_v: window.location.pathname,
                                    },
                                  });
                                }
                              }
                            }, 400);
                          }}
                        >
                          {checked ? (
                            <td
                              className={`${
                                index % 2 == 0
                                  ? isAdvance && isSelected == index
                                    ? "bg-[#DAF7A6]"
                                    : path2 == "git"
                                    ? " "
                                    : "bg-gray-300"
                                  : isAdvance && isSelected == index
                                  ? "bg-[#DAF7A6]"
                                  : ""
                              } p-2 focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border-r-2 !border-r-[#000000]`}
                            >
                              <div className="form-check">
                                <input
                                  className="form-check-input allcheck"
                                  type={checkedRadio ? "radio" : "checkbox"}
                                  name="radio"
                                  onChange={() =>
                                    !checkedRadio
                                      ? setDataMulti({
                                          ...datavalMulti,
                                          [row?.id]: !datavalMulti[row?.id],
                                        })
                                      : setDataMulti({
                                          [row?.id]: true,
                                        })
                                  }
                                  checked={datavalMulti[row?.id]}
                                  value={row?.id}
                                  id={row?.id}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={row?.id}
                                ></label>
                              </div>
                            </td>
                          ) : (
                            <></>
                          )}
                          {(actionCol && isdeleted) ||
                          (actionCol && isview) ||
                          (actionCol && isAdvance) ||
                          (actionCol && isedit) ? (
                            <td
                              className={`${
                                index % 2 == 0
                                  ? isAdvance && isSelected == index
                                    ? "bg-[#DAF7A6]"
                                    : path2 == "git"
                                    ? " "
                                    : "bg-gray-300"
                                  : isAdvance && isSelected == index
                                  ? "bg-[#DAF7A6]"
                                  : ""
                              } px-1 py-0.5 focus:!bg-[#ead6b4] hover:!bg-[#ead6b4] border-r-2 !border-r-[#000000]`}
                            >
                              <div className="flex gap-1">
                                {isdeleted ? (
                                  <>
                                    <ModalConfirmationComponent
                                      onCheck={(e) => {
                                        if (e) {
                                          onDeleted(row?.id);
                                        }
                                      }}
                                    />
                                  </>
                                ) : (
                                  <></>
                                )}

                                {isview ? (
                                  <>
                                    {isBtnView && (
                                      <button
                                        className="ml-[2px] w-[20px] "
                                        onClick={() => {
                                          router.replace({
                                            pathname: window.location.pathname,
                                            query: {
                                              parent: idparent,
                                              view: 1,
                                              data: row?.id,
                                              module: new URLSearchParams(
                                                window.location.search
                                              ).get("module"),
                                            },
                                          });
                                        }}
                                      >
                                        <img
                                          src="/assets/images/apps/research.png"
                                          className="w-[19px]"
                                        />
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}

                                {isedit ? (
                                  <>
                                    {isBtnEdit && (
                                      <button
                                        className="w-[22px]"
                                        onClick={() => {
                                          if (isEditTable) {
                                            seteditActive(index);
                                            setData({});
                                            setaddform(false);
                                            setDataEdits(index);
                                            ValueSetEdit(row);
                                            setoverflow(true);
                                          } else {
                                            router.replace({
                                              pathname:
                                                window.location.pathname,
                                              query: {
                                                parent: idparent,
                                                add: 1,
                                                data: row?.id,
                                                module: GetQueryStr("module"),
                                              },
                                            });
                                          }
                                        }}
                                      >
                                        <img
                                          src="/assets/images/apps/edit.png"
                                          className="w-[22px]"
                                        />
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                                {isAdvance ? (
                                  <>
                                    <div
                                      className="popup w-[21px] cursor-pointer"
                                      onClick={(e) => {
                                        setisSelected(index);
                                        setisidSelected(row?.id);
                                        setActMenu(row);
                                        setIsPopUp(true);
                                        showPopup(e);
                                        setcolact(0);
                                        setoverflow(true);
                                      }}
                                    >
                                      <img
                                        src="/assets/images/apps/lines.png"
                                        className="w-[21px]"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </td>
                          ) : (
                            <></>
                          )}
                          {(datatable?.table ?? []).map((item: any, a: any) => {
                            if (item.type == "hide") {
                              return <></>
                            }
                            return item.row != 1 && row[item.key] != "skip_" ? (
                              <td
                                colSpan={row[item.key + "_colspan"] ?? false}
                                className={`${
                                  index % 2 == 0
                                    ? isAdvance && isSelected == index
                                      ? "bg-[#DAF7A6]"
                                      : path2 == "git"
                                      ? " "
                                      : "bg-gray-300"
                                    : isAdvance && isSelected == index
                                    ? "bg-[#DAF7A6]"
                                    : ""
                                } px-2 py-0.5 text-xs ${
                                  item?.is_link
                                    ? " cursor-pointer underline text-[rgba(0,0,255,1)]"
                                    : ""
                                } ${
                                  item?.customClass == "w-nowwarp"
                                    ? "whitespace-nowrap"
                                    : ""
                                } relative`}
                                key={item.key + "-" + a}
                                onClick={() => {
                                  if (item?.is_link) {
                                    if (item?.uri) {
                                      router.push({
                                        pathname: item?.uri,
                                        query: {
                                          parent: idparent,
                                          add: 1,
                                          data: row?.id,
                                          datetbl: row?.id,
                                        },
                                      });
                                    } else {
                                      router.replace({
                                        pathname: window.location.pathname,
                                        query: {
                                          parent: idparent,
                                          add: 1,
                                          data: row?.id,
                                          datetbl: row?.id,
                                        },
                                      });
                                    }
                                  } else if (item?.is_popup) {
                                    if (row[item.key] != "") {
                                      setpopupIntbl(true);
                                      settitlePopupTbl(item?.label);
                                      var content = "";
                                      if (item?.key == "sharer") {
                                        row[item.key]?.split(",").map((rw) => {
                                          content += "<div>" + rw + "</div>";
                                        });
                                      } else {
                                        content =
                                          "<div>" + row[item.key] + "</div>";
                                      }
                                      setcontentPopupTbl(content);
                                    }
                                  }
                                }}
                                onContextMenu={(e) => {
                                  if (isAdvance) {
                                    setisSelected(index);
                                    setisidSelected(row?.id);
                                    setActMenu(row);
                                    setIsPopUp(true);
                                    showPopup(e);
                                    setcolact(a);
                                    setoverflow(true);
                                  }
                                  if (item.is_body_double_click) {
                                    setheaderPopUpDblclick(-1);
                                    setbodyPopUpDblclick(index + "-" + a);
                                  }
                                }}
                              >
                                <div
                                  className={
                                    " popuponly min-w-max min-h-max " +
                                    (isPopup &&
                                    isidSelected == row?.id &&
                                    colact == a
                                      ? "block"
                                      : "hidden")
                                  }
                                  ref={ref}
                                  style={{
                                    top: isNAudit
                                      ? "0px"
                                      : index < 4
                                      ? "0px"
                                      : "-250px",
                                  }}
                                >
                                  {/* {actMenu?.actions?.map((row) => ( */}
                                  {actMenu?.actions?.filter((row) => hasActionAccess(row?.key))?.map((row) => (
                                    <>
                                      <div
                                        className="mt-2 w-full cursor-pointer"
                                        onClick={() => {
                                          // console.log("wdy", actMenu);

                                          var uri =
                                            window.location.pathname !=
                                              "reservation/fit" &&
                                            window.location.pathname !=
                                              "reservation/git"
                                              ? "/reservation/" +
                                                actMenu.type_reservation.toLowerCase() +
                                                "/reservation"
                                              : window.location.pathname;
                                          router.push({
                                            pathname:
                                              row?.key.toLowerCase() == "edit"
                                                ? uri
                                                : window.location.pathname,
                                            query: {
                                              parent: idparent,
                                              key: row?.key,
                                              data: isidSelected,
                                              time: new Date().getTime(),
                                            },
                                          });
                                        }}
                                      >
                                        {row?.label}
                                      </div>
                                      {row?.line ? <hr /> : <></>}
                                    </>
                                  ))}
                                </div>
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
                                  ) : item?.is_popup ? (
                                    <>
                                      <div className="underline text-[rgba(0,0,255,1)]">
                                        {" "}
                                        {row[item.key] != "" &&
                                          row[item.key].split(",")?.length}
                                      </div>
                                    </>
                                  ) : item?.type == "date" ? (
                                    GFormatDate(row[item.key])
                                  ) : item?.type == "none_date" ? (
                                    GFormatDate(row[item.key])
                                  ) : (
                                    row[item.key]
                                  )
                                ) : Array.isArray(row[item.key]) ? (
                                  <>
                                    <div
                                      className={
                                        row[item.key].length != 1
                                          ? "grid grid-cols-5 gap-2"
                                          : " "
                                      }
                                    >
                                      {" "}
                                      {row[item.key]?.map((rw, i) => (
                                        <div
                                          className={
                                            rw?.is_color
                                              ? getColor(rw.color) +
                                                " px-1 py-1 text-white rounded-md mt-1 mb-1 text-center"
                                              : " bg-success px-1 py-1 text-white rounded-md text-center"
                                          }
                                          key={i}
                                          dangerouslySetInnerHTML={{
                                            __html: rw?.en ?? rw?.label,
                                          }}
                                        ></div>
                                      ))}{" "}
                                    </div>
                                  </>
                                ) : (
                                  // "sdds"+
                                  row[item.key]?.en ?? row[item.key]?.label
                                )}
                                {/* popup body dblclick */}
                                {item?.is_body_double_click &&
                                  bodyPopUpDblclick == index + "-" + a && (
                                    <>
                                      <div
                                        className={
                                          " p-2 text-black absolute min-w-[180px] z-20 bg-white"
                                        }
                                      >
                                        <div className="font-bold">
                                          {item.label}
                                        </div>
                                        <div className="border-[1px] mt-2">
                                          {typeof row?.double_click_action[
                                            item.key
                                          ] == "object" &&
                                            row?.double_click_action[
                                              item.key
                                            ]?.map((rwa, ia) => (
                                              <>
                                                <div
                                                  className="p-2 cursor-pointer border-[2px] "
                                                  onClick={() => {
                                                    setheaderPopUpDblclick(-1);
                                                    if (rwa?.type != "url") {
                                                      if (
                                                        SbodyPopUpDblclick == ia
                                                      ) {
                                                        setSbodyPopUpDblclick(
                                                          -1
                                                        );
                                                        setdataFrmPopUp({});
                                                      } else {
                                                        setSbodyPopUpDblclick(
                                                          ia
                                                        );
                                                        setdataFrmPopUp({});
                                                      }
                                                    } else {
                                                      window.open(
                                                        rwa?.url,
                                                        "_blank"
                                                      );
                                                    }
                                                  }}
                                                >
                                                  {rwa?.label}
                                                </div>
                                                {SbodyPopUpDblclick == ia && (
                                                  <>
                                                    <div className="p-2 border-[1px]">
                                                      {rwa?.type == "info" && (
                                                        <>
                                                          <div
                                                            className="p-2"
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                rwa?.description,
                                                            }}
                                                          ></div>
                                                        </>
                                                      )}
                                                      {rwa?.type == "form" && (
                                                        <>
                                                          <div className="flex ">
                                                            {typeof rwa?.form ==
                                                              "object" &&
                                                              rwa?.form?.map(
                                                                (rws, is) => (
                                                                  <>
                                                                    <InputMain
                                                                      label={
                                                                        rws?.label
                                                                      }
                                                                      error={
                                                                        true
                                                                      }
                                                                      typeInput={
                                                                        rws?.type
                                                                      }
                                                                      rest={{
                                                                        onChange:
                                                                          (
                                                                            e
                                                                          ) => {
                                                                            setdataFrmPopUp(
                                                                              {
                                                                                ...dataFrmPopUp,
                                                                                [rws?.key]:
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                              }
                                                                            );
                                                                          },
                                                                        type: rws?.type_input,
                                                                        name: rws?.key,
                                                                        value:
                                                                          dataFrmPopUp[
                                                                            rws
                                                                              ?.key
                                                                          ],
                                                                      }}
                                                                      restArea={{
                                                                        onChange:
                                                                          (
                                                                            e
                                                                          ) => {
                                                                            setdataFrmPopUp(
                                                                              {
                                                                                ...dataFrmPopUp,
                                                                                [rws?.key]:
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                              }
                                                                            );
                                                                          },
                                                                      }}
                                                                    />
                                                                  </>
                                                                )
                                                              )}
                                                          </div>
                                                          <div className="flex mt-2 gap-2 mb-4 ">
                                                            <ButtonSubmit
                                                              onCreate={() => {
                                                                setSbodyPopUpDblclick(
                                                                  -1
                                                                );
                                                              }}
                                                              label="Cancel"
                                                              isprimary={false}
                                                            />
                                                            <ButtonSubmit
                                                              onCreate={() => {
                                                                setSbodyPopUpDblclick(
                                                                  -1
                                                                );
                                                                setbodyPopUpDblclick(
                                                                  -1
                                                                );
                                                                // setdataFrmPopUp({});
                                                                setTimeout(
                                                                  () => {
                                                                    onSavPopUp(
                                                                      rwa
                                                                    );
                                                                  },
                                                                  600
                                                                );
                                                              }}
                                                              label="Submit"
                                                            />
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </>
                                                )}
                                              </>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                          <ButtonSubmit
                                            onCreate={() => {
                                              setbodyPopUpDblclick(-1);
                                            }}
                                            label="Cancel"
                                            isprimary={false}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  )}
                              </td>
                            ) : (
                              <></>
                            );
                          })}
                        </tr>
                      ) : (
                        <tr
                          key={row?.id + "-" + index}
                          className="focus:!bg-[#ead6b4] hover:!bg-[#ead6b4]"
                        >
                          {checked ? (
                            <td
                              className={`${
                                index % 2 == 0
                                  ? isAdvance && isSelected == index
                                    ? "bg-[#DAF7A6]"
                                    : path2 == "git"
                                    ? " "
                                    : "bg-gray-300"
                                  : isAdvance && isSelected == index
                                  ? "bg-[#DAF7A6]"
                                  : ""
                              } p-2 focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border-r-2 !border-r-[#000000]`}
                            >
                              <div className="form-check">
                                <input
                                  className="form-check-input allcheck"
                                  type={checkedRadio ? "radio" : "checkbox"}
                                  name="radio"
                                  onChange={() =>
                                    !checkedRadio
                                      ? setDataMulti({
                                          ...datavalMulti,
                                          [row?.id]: !datavalMulti[row?.id],
                                        })
                                      : setDataMulti({
                                          [row?.id]: true,
                                        })
                                  }
                                  checked={datavalMulti[row?.id]}
                                  value={row?.id}
                                  id={row?.id}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={row?.id}
                                ></label>
                              </div>
                            </td>
                          ) : (
                            <></>
                          )}
                          <td
                            className={`${
                              index % 2 == 0
                                ? isAdvance && isSelected == index
                                  ? "bg-[#DAF7A6]"
                                  : path2 == "git"
                                  ? " "
                                  : "bg-gray-300"
                                : isAdvance && isSelected == index
                                ? "bg-[#DAF7A6]"
                                : ""
                            } p-2 focus:!bg-[#ead6b4] hover:!bg-[#ead6b4]`}
                          >
                            <div className="flex gap-1">
                              <ButtonSubmit
                                label="Close"
                                isprimary={false}
                                onCreate={() => {
                                  seteditActive(-1);
                                  setData({});
                                }}
                                ClassCustome="px-2 my-2"
                              />
                              {datatable?.permission?.add == 1 || datatable?.permission?.edit == 1 ? (
                              <>
                                <ButtonSubmit
                                  ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                                  ClassCustome="px-2 my-2"
                                  label="Save"
                                  isBtnAdd={
                                    datatable?.permission?.add == 1 ? true : isBtnAdd ||
                                    datatable?.permission?.edit == 1 ? true : isBtnAdd
                                  }
                                  onCreate={() => {
                                    if (!loadbtn) {
                                      setlaodbtn(true);
                                      onSave(row?.id);
                                    }
                                  }}
                                  loading={loadbtn}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                              {/* <ButtonSubmit
                                ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                                ClassCustome="px-2 my-2"
                                label="Save"
                                onCreate={() => {
                                  if (!loadbtn) {
                                    setlaodbtn(true);
                                    onSave(row?.id);
                                  }
                                }}
                                loading={loadbtn}
                              /> */}
                            </div>
                          </td>

                          {(datatable?.table ?? []).map((item: any, a: any) => {
                            if (item.type == "hide") {
                              return <></>
                            }
                            return item.row != 1 ? (
                              <td
                                className={`${
                                  index % 2 == 0
                                    ? isAdvance && isSelected == index
                                      ? "bg-[#DAF7A6]"
                                      : path2 == "git"
                                      ? " "
                                      : "bg-gray-300"
                                    : isAdvance && isSelected == index
                                    ? "bg-[#DAF7A6]"
                                    : ""
                                } px-1 py-0.5 text-xs`}
                                key={item.key + "-" + a}
                              >
                                {item.type != "none" &&
                                item.type != "none_date" ? (
                                  item.type == "text" ||
                                  item.type == "date" ||
                                  item?.type == "number" ||
                                  item?.type == "time" ||
                                  item?.type == "autocomplete" ? (
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
                                            ? dataval[item.key] ?? row[item.key]
                                            : dataval[item.key] ??
                                              row[item.key]?.en,
                                        onChange: (e) => {
                                          changeHandler(e, item.type);
                                        },
                                        disabled:
                                          dataval[item.key + "_disabled"],
                                        onKeyUp: (e) => {
                                          if (
                                            e.key === "Enter" ||
                                            e.keyCode === 13
                                          ) {
                                            if (!loadbtn) {
                                              setlaodbtn(true);
                                              onSave(row?.id);
                                            }
                                          }
                                        },
                                      }}
                                      uriAutoComp={item?.url_autocomplete}
                                      onChangeSel={(e) => {
                                        // console.log("wdy", e);
                                        changeHandler(
                                          e,
                                          "select",
                                          item.key,
                                          false,
                                          item.options,
                                          item?.related
                                        );
                                      }}
                                      valueSel={
                                        dataval[item.key + "_ori"] ??
                                        dataval[item.key]
                                      }
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
                                        options={
                                          item.key == "company_id"
                                            ? datacompany == 0
                                              ? []
                                              : datacompany
                                            : item.options
                                        }
                                        // onMenuCloseSell={onClose}
                                        // onMenuOpenSell={onOpen}
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
                                        disabled={
                                          dataval[item.key + "_disabled"]
                                        }
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
                                      // onMenuCloseSell={onClose}
                                      // onMenuOpenSell={() => {
                                      //   onOpen;
                                      // }}
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
                                      disabled={dataval[item.key + "_disabled"]}
                                    />
                                  ) : item.type == "fileimage" ? (
                                    <>
                                      <div
                                        className="w-10"
                                        dangerouslySetInnerHTML={{
                                          __html: dataval[item.key].includes(
                                            "data:image"
                                          )
                                            ? "<img src='" +
                                              dataval[item.key] +
                                              "'/>"
                                            : dataval[item.key],
                                        }}
                                      ></div>
                                      <InputMain
                                        typeInput="base"
                                        label={"-"}
                                        error={false}
                                        required={false}
                                        rest={{
                                          name: item.key,
                                          type: "file",
                                          value:
                                            typeof dataval[item.key] ==
                                              "string" ||
                                            typeof dataval[item.key] == "number"
                                              ? dataval[item.key] ??
                                                dataval[item.key]
                                              : dataval[item.key] ??
                                                dataval[item.key]?.en,
                                          onChange: async (e: any) => {
                                            const base64Files =
                                              await Promise.all(
                                                e.map((file) => {
                                                  return new Promise<string>(
                                                    (resolve, reject) => {
                                                      const reader =
                                                        new FileReader();
                                                      reader.readAsDataURL(
                                                        file
                                                      );
                                                      reader.onload = () =>
                                                        resolve(
                                                          reader.result as string
                                                        );
                                                      reader.onerror = (
                                                        error
                                                      ) => reject(error);
                                                    }
                                                  );
                                                })
                                              );
                                            changeHandler(
                                              base64Files[0],
                                              "file",
                                              item.key
                                            );
                                          },
                                        }}
                                      />
                                    </>
                                  ) : typeof row[item.key] == "string" ||
                                    typeof row[item.key] == "number" ? (
                                    row[item.key]
                                  ) : (
                                    row[item.key]?.en ?? row[item.key]?.label
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
                                  ) : item?.type == "none_date" ? (
                                    GFormatDate(row[item.key])
                                  ) : (
                                    row[item.key]
                                  )
                                ) : (
                                  row[item.key]?.en ?? row[item.key]?.label
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
              ? "mt-2 w-full justify-center hidden"
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

      {checked && btnSave ? (
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
          {datatable?.permission?.add == 1 || datatable?.permission?.edit == 1 ? (
              <>
                <ButtonSubmit
                  label={lblBtnSave}
                  isBtnAdd={
                    datatable?.permission?.add == 1 ? true : isBtnAdd ||
                    datatable?.permission?.edit == 1 ? true : isBtnAdd
                  }
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
                />
              </>
            ) : (
              <></>
            )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TableView;
