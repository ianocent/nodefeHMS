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
  formatAmountNoDecimals,
  GFormatDate,
} from "../../helper";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import InputMain from "../input/InputMain";
import ButtonSubmit from "../button/ButtonSubmit";
import { useSelector } from "react-redux";
import ButtonAddList from "../button/ButtonAddList";
import TabMenuIcon from "../../common/tabIcon/tab";
import ModalConfirmationComponent from "../../common/modal/ModalConfirmation";

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
  btnSave?: boolean;
  actionCol?: boolean;
  lblBtnSave?: string;
  isDrag?: boolean;
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
    isBtnAdd = true,
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
    isBtnView = true,
    isBtnEdit = true,
    isBtnDelete = true,
    isNotToast = false,
    numberNotdecimals = false,
    isClickAbled = true,
    isTabIcon = true,
    btnSave = true,
    filterProps,
    actionCol = true,
    lblBtnSave = "Save Change",
    isDrag = true,
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
  const dragItem: any = useRef();
  const dragOverItem: any = useRef();
  const sdragId: any = useRef();
  const sdragVis: any = useRef();
  const sdragParent: any = useRef();
  const edragId: any = useRef();
  const edragVis: any = useRef();
  const edragParent: any = useRef();

  const dragStart = (
    e: any,
    position: any,
    id: any,
    vis: any,
    parentid: any
  ) => {
    dragItem.current = position;
    sdragId.current = id;
    sdragParent.current = parentid;
    sdragVis.current = vis;
    // console.log("drag-start", e.target.innerHTML);
    // console.log("pos-start", id + "-" + vis + "-" + parentid + "-" + position);
  };

  const dragEnter = (
    e: any,
    position: any,
    id: any,
    vis: any,
    parentid: any
  ) => {
    dragOverItem.current = position;
    edragId.current = id;
    edragParent.current = parentid;
    edragVis.current = vis;
    // console.log("drag-enter", e.target.innerHTML);
    // console.log("pos-enter", id + "-" + vis + "-" + parentid + "-" + position);
  };

  const drop = (e: any) => {
    if (
      sdragParent.current == edragParent.current &&
      sdragVis.current == edragVis.current
    ) {
      UpdateSort(
        sdragId.current,
        dragItem.current,
        sdragParent.current,
        sdragVis.current,
        edragId.current,
        dragOverItem.current,
        edragParent.current,
        edragVis.current
      );
      console.log("wdylogItem", dragItem.current);
      // console.log("wdylogOverItem", dragOverItem.current);
      const tempTableBody = [...datatable.data];
      console.log("wdylog", tempTableBody[dragOverItem.current]);
      const dragItemContent = tempTableBody[dragItem.current];
      tempTableBody.splice(dragItem.current, 1);
      tempTableBody.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      // console.log("wdylogARR", tempTableBody);
      // setTableBody(tempTableBody);
      let objdata: any = {};
      objdata = { ...objdata, ...datatable };
      objdata.data = tempTableBody;
      // console.log("masuk", objdata);
      // setdatatable({});
      setdatatable(objdata);
    }
  };
  const UpdateSort = async (
    sid: any,
    ssort: any,
    sparent: any,
    svis: any,
    eid: any,
    esort: any,
    eparent: any,
    evis: any
  ) => {
    try {
      let urisave = uri.split("?")[1]
        ? uri.split("?")[0] + "/sort?" + uri.split("?")[1]
        : uri + "/sort";
      let mth = "PUT";

      const raw = JSON.stringify({
        order: [
          {
            id: sid,
            sort: esort + 1,
            parent_id: sparent,
            visibility: svis,
          },
          {
            id: eid,
            sort: ssort + 1,
            parent_id: eparent,
            visibility: evis,
          },
        ],
      });

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
        // setloading(false);
        // refresDat(true);
      } else {
        // setloading(false);
      }
      return;
    } catch (error) {
      return;
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
      b == "time" ||
      b == "rich-editor" ||
      b == "file-image"
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
      } else if (b == "rich-editor") {
        setData({ ...dataval, [name]: e });
      } else if (b == "file-image") {
        setData({ ...dataval, [name]: e });
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
      console.log(dataMerge);
      setData({ ...dataval, ...dataMerge });
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
      setlaodbtn(true);
      let urisave =
        (uri.split("?")[1] ? uri.split("?")[0] : uri) +
        "?group=" +
        Lastpath +
        "&" +
        queryString +
        (uri.split("?")[1] ? "&" + uri.split("?")[1] : "");
      let mth = "POST";

      const raw = JSON.stringify(FinalPOstDat());

      if (id != 0) {
        urisave =
          (uri.split("?")[1] ? uri.split("?")[0] : uri) +
          "/" +
          id +
          "?group=" +
          Lastpath +
          "&" +
          queryString +
          (uri.split("?")[1] ? "&" + uri.split("?")[1] : "");
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
      let getuuri =
        (GLOBALURI.split("?")[1] ? GLOBALURI.split("?")[0] : GLOBALURI) +
        "/" +
        id +
        "?q=1&" +
        (GetQueryStr("tblid")
          ? "tblid=" + GetQueryStr("tblid")
          : GetQueryStr("data")
          ? "tblid=" + GetQueryStr("data")
          : "") +
        (queryString ?? "");
      console.log(id);
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
          (GLOBALURI.split("?")[1] ? "&sort=" : "?sort=") +
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
          setdatatable({ ...datatable, ["pagination"]: datajson?.pagination });
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
    if (datatable?.pagination?.prev) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagination?.prev);
    }
    setPageDat(datatable?.pagination?.prev);
  };
  const nextin = () => {
    if (datatable?.pagination?.next) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagination?.next);
    }
    // alert(2);
    setPageDat(datatable?.pagination?.next);
  };
  const prevJumpin = () => {
    if (datatable?.pagination?.prev_jump) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagination?.prev_jump);
    }
    setPageDat(datatable?.pagination?.prev_jump);
  };
  const nextJumpin = () => {
    if (datatable?.pagination?.next_jump) {
      GetDataTable(datavalsrc?.status?.value, datatable?.pagination?.next_jump);
    }
    setPageDat(datatable?.pagination?.next_jump);
  };
  const onLoadmore = () => {
    if (datatable?.pagination?.next) {
      GetDataTable(
        datavalsrc?.status?.value,
        datatable?.pagination?.next,
        true
      );
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
        setoverflow(false);
        // setoverflow(true);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  useEffect(() => {
    console.log("us", datatable);
  }, [datatable]);

  return (
    <>
      <div className={(popupIntbl ? "block" : "hidden") + " overlay "}>
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
          {datatable?.permission?.add == 1 ? (
            <>
              {isBtnAdd && (
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
                  isBtnadd={datatable?.permission?.add == 1 ? true : isBtnAdd}
                  onAdd={() => {
                    if (isEditTable) {
                      setaddform(true);
                      let datatype = {};
                      datatable.table.map((row) => {
                        if (row?.type == "number") {
                          datatype = { ...datatype, [row?.key]: 0 };
                        } else if (row?.type == "checkbox") {
                          datatype = { ...datatype, [row?.key]: false };
                        } else {
                          if (row?.value) {
                            datatype = { ...datatype, [row?.key]: row?.value };
                          }
                        }
                      });
                      setData({ ...dataval, ...datatype });
                    } else {
                      router.replace({
                        pathname: window.location.pathname,
                        query: {
                          parent: idparent,
                          add: 1,
                          tblid: GetQueryStr("tblid"),
                        },
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
                        } else if (row?.type == "autocomplete") {
                          types = "text";
                          typesmain = "base";
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
                        ) : (
                          <></>
                        );
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
                  <div className="flex w-full justify-center mb-4">
                    <div>Please Click Search To Find The Data</div>
                  </div>
                )}
              </fieldset>
            </div>
          ) : (
            <div className="mt-4"></div>
          )}
          {datatable?.table ? (
            <>
              <div
                className={
                  "  " +
                  (overflow == true
                    ? " w-full overflow-auto min-h-screen"
                    : editActive != -1
                    ? " h-screen table-responsive "
                    : add
                    ? " h-screen table-responsive "
                    : " table-responsive ")
                }
                contextMenu="mymenu"
                onContextMenu={(e) => e.preventDefault()}
              >
                <table
                  className={
                    "shadow-lg table-auto m-2" +
                    (editActive != -1 ? " min-w-full " : " min-w-full ")
                  }
                >
                  <thead>
                    <tr className="bg-[#232020]">
                      {/* #323A50 */}
                      {checked && !checkedRadio ? (
                        <td className=" text-white p-2 font-bold cursor-pointer">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type={checkedRadio ? "radio" : "checkbox"}
                              name=""
                              value={"all"}
                              id={"all"}
                              onChange={(e) => {
                                onCheckAll(e);
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={"all"}
                            ></label>
                          </div>
                        </td>
                      ) : (
                        <>
                          {checkedRadio ? (
                            <td className=" w-[50px] p-2 font-bold">{""}</td>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                      {(actionCol && isdeleted) ||
                      (actionCol && isview) ||
                      (actionCol && isAdvance) ||
                      (actionCol && isedit) ? (
                        <td className=" p-2 font-bold">{""}</td>
                      ) : (
                        <></>
                      )}
                      {datatable?.table?.map((row: any, i: any) =>
                        !row?.row || row?.row == 1 ? (
                          <td
                            title={"Sort By " + row.label}
                            key={i}
                            className={
                              (headRow == 2 && row?.colspan
                                ? " text-center "
                                : "") +
                              " text-white p-2 font-bold cursor-pointer"
                            }
                            onClick={() => {
                              clickSort(row);
                            }}
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
                    {headRow == 2 ? (
                      <>
                        <tr className="">
                          {checked ? (
                            <td className="text-white p-2 font-bold cursor-pointer"></td>
                          ) : (
                            <></>
                          )}
                          {(actionCol && isdeleted) ||
                          (actionCol && isview) ||
                          (actionCol && isAdvance) ||
                          (actionCol && isedit) ? (
                            <td className=" p-2 font-bold">{""}</td>
                          ) : (
                            <></>
                          )}

                          {datatable?.table?.map((row: any, i: any) =>
                            row?.row == 2 ? (
                              <td
                                title={"Sort By " + row.label}
                                key={i}
                                className="text-white p-2 font-bold cursor-pointer"
                                onClick={() => {
                                  clickSort(row);
                                }}
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
                      </>
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
                          <div className="flex gap-2">
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
                            <ButtonSubmit
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
                            />
                          </div>
                        </td>

                        {datatable.table.map((item: any, a: any) => {
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
                                item.type == "autocomplete" ||
                                item.type == "color" ? (
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
                                      console.log("wdy", e);
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
                                ) : item.type == "textarea" ? (
                                  <>
                                    <InputMain
                                      typeInput="rich-editor"
                                      label={"-"}
                                      error={false}
                                      required={false}
                                      onChangeRichEditor={(e) => {
                                        changeHandler(
                                          e,
                                          "rich-editor",
                                          item.key
                                        );
                                      }}
                                      valueRichEditor={dataval[item.key]}
                                    />
                                  </>
                                ) : item.type == "fileimage" ? (
                                  <>
                                    <InputMain
                                      typeInput="file-image"
                                      label={"-"}
                                      error={false}
                                      required={false}
                                      onChangeFiles={(e) => {
                                        changeHandler(
                                          e[0].url,
                                          "file-image",
                                          item.key
                                        );
                                      }}
                                      valueSel={dataval[item.key]}
                                    />
                                  </>
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
                                  row?.type_reservation.toLowerCase() +
                                  "/reservation",
                                query: {
                                  parent: GetQueryStr("parent"),
                                  data: row?.id,
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
                                    },
                                  });
                                }
                              }
                            }, 400);
                          }}
                          onDragStart={(e) =>
                            dragStart(e, index, row?.id, row?.visibility, 0)
                          }
                          onDragEnter={(e) =>
                            dragEnter(e, index, row?.id, row?.visibility, 0)
                          }
                          onDragEnd={drop}
                          draggable={isDrag}
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
                              } p-2 focus:!bg-[#ead6b4] hover:!bg-[#ead6b4] border-r-2 !border-r-[#000000]`}
                            >
                              <div className="flex gap-2">
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
                                        className="w-[21px] "
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
                                          className="w-[21px]"
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
                                        className="w-[21px]"
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
                                              },
                                            });
                                          }
                                        }}
                                      >
                                        <img
                                          src="/assets/images/apps/edit.png"
                                          className="w-[21px]"
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
                          {datatable.table.map((item: any, a: any) => {
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
                                } p-2 ${
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
                                  {actMenu?.actions?.map((row) => (
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
                                  row[item.key]?.map((rw, i) => {
                                    return (
                                      <div
                                        className={
                                          "bg-success px-1 py-1 text-white rounded-md mt-1 text-center"
                                        }
                                        key={i}
                                        dangerouslySetInnerHTML={{
                                          __html: rw?.en ?? rw?.label,
                                        }}
                                      ></div>
                                    );
                                  })
                                ) : (
                                  // "sdds"+
                                  row[item.key]?.en ?? row[item.key]?.label
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
                                  if (!loadbtn) {
                                    setlaodbtn(true);
                                    onSave(row?.id);
                                  }
                                }}
                                loading={loadbtn}
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
                                      : path2 == "git"
                                      ? " "
                                      : "bg-gray-300"
                                    : isAdvance && isSelected == index
                                    ? "bg-[#DAF7A6]"
                                    : ""
                                } p-2 `}
                                key={item.key + "-" + a}
                              >
                                {item.type != "none" &&
                                item.type != "none_date" ? (
                                  item.type == "text" ||
                                  item.type == "date" ||
                                  item?.type == "number" ||
                                  item?.type == "time" ||
                                  item?.type == "autocomplete" ||
                                  item?.type == "color" ? (
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
                                  ) : item.type == "textarea" ? (
                                    <>
                                      <InputMain
                                        typeInput="rich-editor"
                                        label={"-"}
                                        error={false}
                                        required={false}
                                        onChangeRichEditor={(e) => {
                                          changeHandler(
                                            e,
                                            "rich-editor",
                                            item.key
                                          );
                                        }}
                                        valueRichEditor={dataval[item?.key]}
                                      />
                                    </>
                                  ) : item.type == "fileimage" ? (
                                    <>
                                      <InputMain
                                        typeInput="file-image"
                                        label={"-"}
                                        error={false}
                                        required={false}
                                        onChangeFiles={(e) => {
                                          changeHandler(
                                            e[0].url,
                                            "file-image",
                                            item.key
                                          );
                                        }}
                                        valueSel={dataval[item.key]}
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
            vnext={datatable?.pagination?.next}
            vprev={datatable?.pagination?.prev}
            vnextJump={datatable?.pagination?.next_jump}
            vprevjump={datatable?.pagination?.prev_jump}
            prev={previn}
            next={nextin}
            prevJump={prevJumpin}
            nextJump={nextJumpin}
            totalPage={datatable?.pagination?.end_paging}
            page={datatable?.pagination?.start_paging}
            totalData={datatable?.pagination?.total_data}
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
            label={lblBtnSave}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TableView;
