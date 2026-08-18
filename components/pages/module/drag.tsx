import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-drag";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt, GetEncrypt, GetQueryStr } from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { LayoutContext } from "../../../context/LayoutContext";
import InputMain from "../../common/input/InputMain";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { IconSpiner } from "../../common/icon/CardIcon";
interface DragProps {
  uri: any;
}
const DragTblView = (props: DragProps) => {
  const { uri } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const layout = useContext(LayoutContext);

  const [datatable, setdatatable] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [isloading, setIsloading] = useState<boolean>(false);

  const [dataval, setData] = useState<any>({
    search: "",
    statuses: [],
  });
  const [searchActive, setsearchActive] = useState<boolean>(false);
  const [datavalsrc, setDatasrc] = useState<any>({
    status: { value: "-1", label: "ALL" },
  });
  const { search, statuses } = dataval;
  const changeHandler = (e: any, b?: boolean, name?: string) => {
    if (!b) {
      setData({ ...dataval, [e.target.name]: e.target.value });
    } else {
      setData({ ...dataval, [name]: e });
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
    router.replace({
      pathname: window.location.pathname,
      query: router.query,
    });
  };
  const GetDataTable = async (i?: any, page?: number) => {
    try {
      setIsloading(true);
      let status = 0;
      if (i == 1) {
        status = 1;
      } else if (i == 2) {
        status = -1;
      }
      let pages = 1;
      if (page) {
        pages = page;
      }

      const datajson = await FetchData(
        uri +
          "?page=" +
          pages +
          "&limit=100&name=" +
          search +
          "&trash=" +
          status +
          "&" +
          window.location.search.replace("?", ""),
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      setdatatable(datajson);
      if (datajson?.code == "200") {
        setIsloading(false);
        if (datajson?.search_data) {
          setDatasrc(datajson?.search_data);
        }
      } else {
        setIsloading(false);
      }
      return;
    } catch (error) {
      setIsloading(false);
      // console.log("err", error);
      return;
    }
  };
  const onDeleted = async (id: any) => {
    try {
      let getuuri = uri + "/" + id + "?q=1";

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
  const prev = () => {
    // alert(1);
    if (datatable?.pagination?.prev) {
      GetDataTable(statuses?.value, datatable?.pagination?.prev);
    }
  };
  const next = () => {
    if (datatable?.pagination?.next) {
      GetDataTable(statuses?.value, datatable?.pagination?.next);
    }
  };
  const prevJump = () => {
    if (datatable?.pagination?.prev_jump) {
      GetDataTable(statuses?.value, datatable?.pagination?.prev_jump);
    }
  };
  const nextJump = () => {
    if (datatable?.pagination?.next_jump) {
      GetDataTable(statuses?.value, datatable?.pagination?.next_jump);
    }
  };
  useEffect(() => {
    GetDataTable();
    console.log(window.location.search);
  }, [window.location.search]);

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        {datatable?.permission?.add == 1 ? (
          <>
            <ButtonAddList
              label="+ Add"
              title={"List " + layout?.title}
              onAdd={() => {
                window.location.assign(
                  window.location.pathname +
                    (window.location.search
                      ? window.location.search + "&"
                      : "?") +
                    "add=1"
                );
              }}
            />
          </>
        ) : (
          <></>
        )}
        <>
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
                                  data: GetQueryStr("data"),
                                },
                              });
                            } else {
                              router.push({
                                pathname: window.location.pathname,
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
                <>
                  <div className="flex w-full justify-center mb-4">
                    <div>Please Click Search To Find The Data</div>
                  </div>
                </>
              )}
            </fieldset>
          </div>
        </>
        <div className="mt-2 w-full table-auto">
          {!isloading ? (
            <TableView
              prev={prev}
              next={next}
              prevJump={prevJump}
              nextJump={nextJump}
              data={datatable}
              loading={isloading}
              uri={uri}
              // refresDat={(drag) => {
              //   if (drag) {
              //     GetDataTable();
              //   }
              // }}
              // del={(id) => {
              //   onDeleted(id);
              // }}
            />
          ) : (
            <>
              <div className="mt-8 flex justify-center">
                <IconSpiner />
              </div>
            </>
          )}
        </div>
      </PaperBase>
    </>
  );
};

export default DragTblView;
