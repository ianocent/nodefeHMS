import ButtonAddList from "../../components/common/button/ButtonAddList";
import PaperBase from "../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../components/common/seo";
import TableView from "../../components/common/table-drag";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt, GetEncrypt, GetQueryStr } from "../../components/helper";
import { useDispatch, useSelector } from "react-redux";
import { LayoutContext } from "../../context/LayoutContext";
import InputMain from "../../components/common/input/InputMain";
import ButtonSubmit from "../../components/common/button/ButtonSubmit";
import { IconSpiner } from "../../components/common/icon/CardIcon";
interface DragProps {
  uri: any;
}
const DragTblView = (props: DragProps) => {
  const { uri } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const layout = useContext(LayoutContext);
  const pageKey = router.pathname;
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
  };
  const changeHandlerSrc = (e: any, b?: boolean, name?: string) => {
    var fieldsrc = "";
    var valsrc = "";
    var namecur = "";
    if (!b) {
      setDatasrc({ ...datavalsrc, [e.target.name]: e.target.value });
      if (e.target.name != "search") {
        fieldsrc = e.target.name + ";";
        valsrc = e.target.value + ";";
      } else {
        router.replace({
          pathname: router.pathname,
          query: {
            ...router.query,
            _page: pageKey,
            search: e.target.value,
          },
        }, undefined, { shallow: true });
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
            router.replace({
              pathname: router.pathname,
              query: {
                ...router.query,
                _page: pageKey,
                search: datavalsrc[rw]
              },
            }, undefined, { shallow: true });
          }
        }
      }
    });
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        _page: pageKey,
        search_field: fieldsrc
      },
    }, undefined, { shallow: true });
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        _page: pageKey,
        search_value: valsrc
      },
    }, undefined, { shallow: true });
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
          new URLSearchParams(router.query as any).toString(),
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
  }, [router.query, uri]);
  useEffect(() => {
    setDatasrc({
      status: { value: "-1", label: "ALL" },
    });
  }, [uri]);

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
                    "?add=1" +
                    (GetQueryStr("tblid")
                      ? "&tblid=" + GetQueryStr("tblid")
                      : "")
                );
              }}
            />
          </>
        ) : (
          <></>
        )}
        <>
          {/* CHANGED: w-full flex flex-col → keeps full width on mobile */}
          <div className="order-3 w-full flex mb-2 mt-2">
            <fieldset className="border w-full">
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
                  {/* CHANGED: grid responsive - 1 col mobile, 2 col sm, 4 col md+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-[20px] mb-2 justify-end m-2">
                    <div className="w-full">
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
                        <div className="w-full">
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
                    {/* CHANGED: items-end kept, flex wraps naturally in grid */}
                    <div className="flex items-end">
                      <div className="flex ml-2 h-[38px] mt-4 gap-4">
                        <ButtonSubmit
                          label="Reset"
                          onCreate={() => {
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
        {/* CHANGED: overflow-x-auto for table horizontal scroll on mobile */}
        <div className="mt-2 w-full table-auto overflow-x-auto">
          {!isloading ? (
            <TableView
              prev={prev}
              next={next}
              prevJump={prevJump}
              nextJump={nextJump}
              data={datatable}
              loading={isloading}
              uri={uri}
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
