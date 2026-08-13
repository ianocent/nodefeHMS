import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import {
  FetchData,
  FetchDataDocument,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  GFormatDate,
} from "../../helper";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import InputMain from "../input/InputMain";
import ButtonSubmit from "../button/ButtonSubmit";
import { useSelector } from "react-redux";
import ButtonAddList from "../button/ButtonAddList";
import { env } from "../../../next.config";

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
  btnSearch?: boolean;
  isWhatsapp?: boolean;
  message?: string;
  isBtnView?: boolean;
  config?: boolean;
}
const TableViewDocument = (props: TableViewProps) => {
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
    btnSearch = true,
    isWhatsapp,
    message,
    isBtnView = true,
    config = false,
  } = props;
  const GLOBALURI = uri;
  const [isview, setisview] = useState(false);
  const [isedit, setisedit] = useState(false);
  const router = useRouter();
  const path = router.pathname;
  const [loadingin, setloadingin] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [editActive, seteditActive] = useState(-1);
  const [dataval, setData] = useState<any>({});
  const [datavalMulti, setDataMulti] = useState<any>({});
  const [overflow, setoverflow] = useState(true);
  const [isloading, setIsloading] = useState<boolean>(false);
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
  const [pageDat, setPageDat] = useState<any>("0");

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
    if (b == "text" || b == false || b == "textarea" || b == "number") {
      setData({ ...dataval, [e.target.name]: e.target.value });
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
    } else if (b == "file_document") {
      const file = e[0];
      setData({ ...dataval, file });
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

    router.replace({
      pathname: window.location.pathname,
      query: router.query,
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

  const onSave = async (id: number) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      let urisave = uri + "?group=" + groups + "&" + queryString;
      let mth = "POST";

      const formData = new FormData();
      for (const key in dataval) {
        formData.append(key, dataval[key]);
      }

      if (id != 0) {
        if (config === true) {
          urisave =
            uri +
            "/" +
            id +
            "/update-file" +
            "?group=" +
            groups +
            "&" +
            queryString;
          const saveprocess = await FetchDataDocument(
            urisave,
            mth,
            formData,
            false,
            datalocal?.data?.access_token,
            router,
            ""
          );
          seteditActive(-1);
          setaddform(false);
          setData({});
          setloadingin(false);
          GetDataTable();
          return;
        } else {
          urisave = uri + "/" + id + "?group=" + groups + "&" + queryString;
          mth = "PUT";
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
          seteditActive(-1);
          setaddform(false);
          setData({});
          setloadingin(false);
          GetDataTable();
          return;
        }
      }
      const saveprocess = await FetchDataDocument(
        urisave,
        mth,
        formData,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      seteditActive(-1);
      setaddform(false);
      setData({});
      setloadingin(false);
      GetDataTable();
    } catch (error) {
      console.log("erro", error);
      setloadingin(false);
    }
  };

  const onSaveMulti = async (id: number) => {
    try {
      if (uriSave != "") {
        const urlParams = new URLSearchParams(window.location.search);
        const group = urlParams.get("group");

        let urisave = uriSave + "?group=" + group + "&" + queryString;
        let mth = "POST";

        const transformeddatavalMulti = Object.entries(datavalMulti).filter(
          ([key, value]) => value === true
        );
        const raw = JSON.stringify({
          idx: transformeddatavalMulti.map(([key, value]) => key),
        });

        if (id != 0) {
          urisave = uri + "/" + id + "?group=" + group + "&" + queryString;
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
      let getuuri = GLOBALURI + "/" + id;

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

    if (sort == row.key) {
      router.replace({
        pathname: window.location.pathname,
        query: { parent: idparent, sort: "-" + row.key },
      });
      GetDataTable();
    } else if ("-" + sort == "-" + row.key) {
      router.replace({
        pathname: window.location.pathname,
        query: { parent: idparent, sort: row.key },
      });
      GetDataTable();
    } else {
      router.replace({
        pathname: window.location.pathname,
        query: { parent: idparent, sort: row.key },
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
      let status = i ?? datavalsrc["status"]?.value;

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
          groups +
          "&page=" +
          pages +
          "&search=" +
          (datavalsrc["search"] ?? (search == null ? "" : search)) +
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
      if (datajson?.code == "200") {
        setIsloading(false);
        if (!isloadmore) {
          setdatatable(datajson);
        } else {
          datajson?.data?.map((row: any) => {
            datatable?.data?.push(row);
          });
          setdatatable({ ...datatable, ["pagging"]: datajson?.pagging });
        }
        setisview(datajson?.permission?.view);
        setDatasrc(datajson?.search_data);
        setisedit(isEditForce ? false : datajson?.permission?.edit);
        datajson?.table?.map((rw) => {
          if (rw?.is_search) {
            setbtnsearchs(true);
          }
        });
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
          groups +
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
      GetDataTable(
        datavalsrc["status"][0].value,
        datatable?.pagging?.next,
        true
      );
    } else {
      setishide(true);
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
    GetDataTable();
    if (checked) {
      GetDataTableMulti();
    }
  }, []);
  return (
    <>
      {datatable?.code == "200" ? (
        <>
          {datatable?.permission?.add == 1 ? (
            <>
              <ButtonAddList
                label="+ Add"
                title={
                  ""
                  // isTitle
                  //   ? "List " +
                  //     (groups == ""
                  //       ? GetCapitalFirst(
                  //           GLOBALURI.replaceAll("/cms/", " ").replaceAll(
                  //             "-",
                  //             " "
                  //           )
                  //         )
                  //       : GetCapitalFirst(groups.replaceAll("-", " ")))
                  //   : ""
                }
                onAdd={() => {
                  //router.push("/setup/form?group=" + group);
                  if (isEditTable) {
                    setaddform(true);
                  } else {
                    router.replace({
                      pathname: window.location.pathname,
                      query: { parent: idparent, add: 1 },
                    });
                  }
                }}
                isBtnadd={isBtnAdd}
              />
            </>
          ) : (
            <></>
          )}
          {btnsearchs ? (
            <div className="w-full flex mb-2 mt-2">
              <fieldset className="border w-full">
                <legend
                  className="ml-2 border p-2 rounded-md text-[#845ADF] font-bold cursor-pointer"
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
                  <div className="sm:grid grid-cols-4 gap-2 mt-4 mb-2 justify-end m-2 ">
                    <div className="input-group w-full ">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold capitalize text-[14px] leading-[19px]">
                          Keyword
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            name="search"
                            className="form-control form-control-lg  !rounded-md"
                            id="search"
                            onChange={changeHandlerSrc}
                            onKeyUp={(e: any) => {
                              changeHandlerSrc(e);
                              if (e.target?.value.length > 3) {
                                // GetDataTable();
                              }
                            }}
                            value={datavalsrc["search"]}
                          />
                          <button
                            onClick={() => {
                              GetDataTable();
                            }}
                            aria-label="button"
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                            type="button"
                            id="button-addon2"
                          >
                            <i className="ri-search-eye-line"></i>
                          </button>
                        </div>
                      </div>
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
                              value: datavalsrc[row?.key],
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
                  </div>
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
                    <tr className="">
                      {checked ? (
                        <td className="bg-[#323A50] text-white p-2 font-bold cursor-pointer">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
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
                        <></>
                      )}
                      <td className="bg-[#323A50] w-[50px] p-2 font-bold">
                        {""}
                      </td>
                      {datatable?.table?.map((row: any, i: any) =>
                        !row?.row || row?.row == 1 ? (
                          <td
                            title={"Sort By " + row.label}
                            key={i}
                            className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
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
                            <td className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"></td>
                          ) : (
                            <></>
                          )}
                          <td className="bg-[#323A50] w-[50px] p-2 font-bold">
                            {""}
                          </td>
                          {datatable?.table?.map((row: any, i: any) =>
                            row?.row == 2 ? (
                              <td
                                title={"Sort By " + row.label}
                                key={i}
                                className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
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
                        className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]"
                      >
                        <td
                          className={`bg-gray-300 p-2 focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]`}
                        >
                          <div className="flex gap-2">
                            <ButtonSubmit
                              label="Close"
                              isprimary={false}
                              onCreate={() => {
                                setaddform(false);
                                setData({});
                              }}
                              ClassCustome="px-2 my-2"
                            />
                            <ButtonSubmit
                              ClassPrimary=" bg-[#8844dd] !text-white rounded-md"
                              ClassCustome="px-2 my-2"
                              label="Save"
                              onCreate={() => {
                                onSave(0);
                              }}
                              loading={loadingin}
                            />
                          </div>
                        </td>

                        {datatable.table.map((item: any, a: any) => {
                          return (
                            <td
                              className={` bg-gray-300 p-2 `}
                              key={item.key + "-" + a}
                            >
                              {item.type != "none" ? (
                                item.type == "text" || item.type == "number" ? (
                                  <InputMain
                                    typeInput="base"
                                    label={"-"}
                                    error={false}
                                    required={false}
                                    rest={{
                                      name: item.key,
                                      type: item.type,
                                      value: dataval[item.key],
                                      onChange: (e) => {
                                        changeHandler(e, "text");
                                      },
                                    }}
                                  />
                                ) : item.type == "file_document" ? ( // nambahin type data
                                  <InputMain
                                    typeInput="base"
                                    label={"-"}
                                    error={false}
                                    required={false}
                                    rest={{
                                      name: item.key,
                                      type: item.type,
                                      value: dataval[item.key],
                                      onChange: (e) => {
                                        changeHandler(e, item.type);
                                      },
                                    }}
                                  />
                                ) : item.type == "select" ||
                                  item.type == "select_multiple" ? (
                                  <InputMain
                                    typeInput="select-multi"
                                    label={""}
                                    error={false}
                                    required={false}
                                    valueSel={dataval[item.key + "_ori"]}
                                    isMulti={
                                      item.type == "select" ? false : true
                                    }
                                    onMenuCloseSell={onClose}
                                    onMenuOpenSell={onOpen}
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
                                    options={item.options}
                                  />
                                ) : item.type == "checkbox" ||
                                  item.type == "checkbox_multi" ? (
                                  <InputMain
                                    typeInput={item.type}
                                    label={""}
                                    error={false}
                                    required={false}
                                    valueSel={dataval[item.key]}
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
                                    onMenuCloseSell={onClose}
                                    onMenuOpenSell={onOpen}
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
                      index == 0 && add ? <></> : <></>
                    )}
                    {datatable?.data?.map((row: any, index) =>
                      editActive != index ? (
                        <tr
                          key={row?.id + "-" + index}
                          className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]"
                        >
                          {checked ? (
                            <td
                              className={`${
                                index % 2 == 0 ? "bg-gray-300" : ""
                              } p-2 focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border-r-2 !border-r-[#000000]`}
                            >
                              <div className="form-check">
                                <input
                                  className="form-check-input allcheck"
                                  type="checkbox"
                                  name=""
                                  onChange={() =>
                                    setDataMulti({
                                      ...datavalMulti,
                                      [row?.id]: !datavalMulti[row?.id],
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
                              index % 2 == 0 ? "bg-gray-300" : ""
                            } p-2 focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border-r-2 !border-r-[#000000]`}
                          >
                            <div className="flex gap-2">

                              {isDeleted && datatable?.permission?.delete == 1 ? (
                                <>
                                  <button
                                    className="w-[21px] "
                                    onClick={() => {
                                      onDeleted(row?.id);
                                    }}
                                  >
                                    <img
                                      src="/assets/images/apps/delete.png"
                                      className="w-[21px]"
                                    />
                                  </button>
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
                                  <button
                                    className="w-[21px]"
                                    onClick={() => {
                                      if (isEditTable) {
                                        seteditActive(index);
                                        setData({});
                                        setaddform(false);
                                        setDataEdits(index);
                                      } else {
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
                                    <img
                                      src="/assets/images/apps/edit.png"
                                      className="w-[21px]"
                                    />
                                  </button>
                                </>
                              ) : (
                                <></>
                              )}

                              {isWhatsapp && (
                                <a
                                  href={`https://wa.me/62${
                                    row.phone_number
                                  }?text=${`${message}, Your tag number: ${row.tag_no}`}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <button>
                                    <img
                                      width={16}
                                      height={16}
                                      alt=""
                                      src={
                                        "/assets/iconfonts/bootstrap-icons/icons/icons/whatsapp.svg"
                                      }
                                    />
                                  </button>
                                </a>
                              )}
                            </div>
                          </td>

                          {datatable.table.map((item: any, a: any) => {
                            return item.row != 1 ? (
                              <td
                                className={`${
                                  index % 2 == 0 ? "bg-gray-300" : ""
                                } p-2 ${
                                  item?.is_link ||
                                  item?.type === "file_document"
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
                                  } else if (item?.type === "file_document") {
                                    // const link = document.createElement("a");
                                    const fileUrl = `${env.uriApi}/storage/${
                                      row[config ? "image" : "file_path"]
                                    }`; // Ensure this path is correct
                                    if (fileUrl) {
                                      window.open(fileUrl, "_blank");
                                    }
                                  }
                                }}
                              >
                                {typeof row[item.key] == "string" ||
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
                                  ) : item?.is_html ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: row[item.key],
                                      }}
                                    />
                                  ) : item?.type == "date" ? (
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
                      ) : (
                        <tr
                          key={row?.id + "-" + index}
                          className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]"
                        >
                          <td
                            className={`${
                              index % 2 == 0 ? "bg-gray-300" : ""
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
                                  index % 2 == 0 ? "bg-gray-300" : ""
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
                                        type: item.type,
                                        value:
                                          typeof row[item.key] == "string" ||
                                          typeof row[item.key] == "number"
                                            ? dataval[item.key] ?? row[item.key]
                                            : dataval[item.key] ??
                                              row[item.key]?.en,
                                        onChange: (e) => {
                                          changeHandler(e, "text");
                                        },
                                      }}
                                    />
                                  ) : item.type == "file_document" ? (
                                    <InputMain
                                      typeInput="base"
                                      label={"-"}
                                      error={false}
                                      required={false}
                                      rest={{
                                        name: item.key,
                                        type: item.type,
                                        value: dataval[item.key],
                                        onChange: (e) => {
                                          changeHandler(e, item.type);
                                        },
                                      }}
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
                                        row[item.key]
                                      }
                                      isMulti={
                                        item.type == "select" ? false : true
                                      }
                                      options={item?.options}
                                      onMenuCloseSell={onClose}
                                      onMenuOpenSell={() => {
                                        onOpen;
                                      }}
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
                                  ) : item.type == "checkbox" ||
                                    item.type == "checkbox_multiple" ? (
                                    <InputMain
                                      typeInput={item.type}
                                      key={item?.key}
                                      label={""}
                                      error={false}
                                      required={false}
                                      valueSel={
                                        dataval[item.key] ?? row[item?.key]
                                      }
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
      ) : (
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

export default TableViewDocument;
