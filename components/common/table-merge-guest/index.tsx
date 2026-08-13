import React, { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt, GetEncrypt } from "../../helper";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import { useSelector } from "react-redux";

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
  setDataSelected?: React.Dispatch<SetStateAction<any>>;
  setDataMultiSelected?: React.Dispatch<SetStateAction<any[]>>;
  toggleGetTable?: boolean;
  multi?: boolean;
  dataSelected?: any;
}

const TableMergeGuest = (props: TableViewProps) => {
  const {
    uri,
    groups,
    queryString,
    methodFetch = "GET",
    bodyFetch = {},
    headRow = 1,
    checked = false,
    isEditForce = false,
    setDataSelected,
    toggleGetTable,
    multi,
    setDataMultiSelected,
    dataSelected,
  } = props;

  const GLOBALURI = uri;
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [editActive, seteditActive] = useState(-1);
  const [datavalMulti, setDataMulti] = useState<any>({});
  const [overflow, setoverflow] = useState(true);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [datavalsrc, setDatasrc] = useState<any>({
    status: { value: "-1", label: "ALL" },
  });
  const [datatable, setdatatable] = useState<any>({});
  const [add, setaddform] = useState<boolean>(false);
  const [idparent, setidparent] = useState("");
  const [btnsearchs, setbtnsearchs] = useState<boolean>(false);
  const [isview, setisview] = useState(false);
  const [isedit, setisedit] = useState(false);

  const onCheckAll = (e: any) => {
    // Ensure only one row is checked at a time
    if (e.target.checked) {
      let firstRow = datatable?.data?.[0]?.id;
      setDataMulti({ [firstRow]: true });
      setDataSelected(datatable?.data?.[0]);
    } else {
      setDataMulti({});
      setDataSelected(null);
    }
  };

  const handleRowCheck = (row: any) => {
    if (multi) {
      setDataMultiSelected((prevSelected: any[]) => {
        if (prevSelected.includes(row)) {
          return prevSelected.filter((item) => item !== row);
        } else {
          return [...prevSelected, row];
        }
      });

      setDataMulti((prevDataMulti: { [key: string]: boolean }) => {
        const newState = { ...prevDataMulti };
        if (newState[row?.id]) {
          delete newState[row?.id];
        } else {
          newState[row?.id] = true;
        }
        return newState;
      });
    } else {
      setDataMulti({ [row?.id]: true });
      setDataSelected(row);
    }
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

  const previn = () => {
    if (datatable?.pagging?.prev) {
      GetDataTable(datavalsrc["status"][0].value, datatable?.pagging?.prev);
    }
  };

  const nextin = () => {
    if (datatable?.pagging?.next) {
      GetDataTable(datavalsrc["status"][0].value, datatable?.pagging?.next);
    }
  };

  const prevJumpin = () => {
    if (datatable?.pagging?.prev_jump) {
      GetDataTable(
        datavalsrc["status"][0].value,
        datatable?.pagging?.prev_jump
      );
    }
  };

  const nextJumpin = () => {
    if (datatable?.pagging?.next_jump) {
      GetDataTable(
        datavalsrc["status"][0].value,
        datatable?.pagging?.next_jump
      );
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const getidparent = urlParams.get("parent");
    setidparent(getidparent);
    if (add) {
      seteditActive(-1);
    }

    if (
      Object.keys(bodyFetch).length === 0 &&
      bodyFetch.constructor === Object
    ) {
      console.log("tada", bodyFetch);
      GetDataTable();
    } else {
      console.log("tada1", bodyFetch);
      GetDataTable();
    }
  }, [window.location.search]);

  useEffect(() => {
    GetDataTable();
  }, [toggleGetTable]);

  return (
    <>
      {datatable?.code == "200" ? (
        <>
          {datatable?.table ? (
            <>
              <div
                className={
                  "table-responsive " +
                  (overflow == true ? " overflow-x-auto" : "")
                }
              >
                <table
                  className={
                    "shadow-lg table-auto" +
                    (editActive != -1 ? " min-w-max " : " min-w-full ")
                  }
                >
                  <thead>
                    <tr className="">
                      <td className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"></td>

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
                    {datatable?.data?.map((row: any, index) => {
                      return (
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
                                  onChange={() => handleRowCheck(row)}
                                  checked={datavalMulti[row?.id] || false}
                                  value={row?.id}
                                  id={row?.id}
                                  disabled={row.id === dataSelected?.id}
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

                          {datatable.table.map((item: any, a: any) => {
                            return item.row != 1 ? (
                              <td
                                className={`${
                                  index % 2 == 0 ? "bg-gray-300" : ""
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
                                  typeof row[item.key] != "number" ? (
                                    <img
                                      src="/assets/images/apps/checklist.png"
                                      className="w-[20px]"
                                    />
                                  ) : row[item.key] == false &&
                                    typeof row[item.key] != "number" ? (
                                    "-"
                                  ) : item?.is_html ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: row[item.key],
                                      }}
                                    />
                                  ) : (
                                    row[item.key]
                                  )
                                ) : row[item.key]?.en ||
                                  row[item.key]?.label ? (
                                  row[item.key]?.en ?? row[item.key]?.label
                                ) : (
                                  "-"
                                )}
                              </td>
                            ) : (
                              <></>
                            );
                          })}
                        </tr>
                      );
                    })}
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
    </>
  );
};

export default TableMergeGuest;
