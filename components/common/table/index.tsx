import React, { useEffect, useState } from "react";
import favicon from "../../../public/favicon.ico";
import ListViewModel from "../../pages/user/list/ListPostViewModel";
import { useRouter } from "next/router";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import InputMain from "../input/InputMain";
import { useSelector } from "react-redux";

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
interface TableViewProps {
  data?: any;
  descfield?: string;
  uri?: string;
  ascfield?: string;
  uriview?: string;
  uriedit?: string;
  uriisactive?: string;
  uriisdelete?: string;
  uriapprove?: string;
  urireject?: string;
  loading?: boolean;
  prevJump: () => void;
  prev: () => void;
  nextJump: () => void;
  next: () => void;
  idparent?: any;
  needReflesh?: (e: boolean) => void;
}
const TableView = (props: TableViewProps) => {
  const {
    data,
    loading = false,
    uri,
    prevJump,
    prev,
    nextJump,
    next,
    uriedit = "",
    uriview,
    idparent,
    needReflesh,
  } = props;
  const isview = data?.permission?.view;
  const isedit = data?.permission?.edit;
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const router = useRouter();
  const path = router.pathname;

  const forceLogout = async (email: string) => {
    let getuuri = "/cms/force-logout/" + email;
    const data: any = await FetchData(
      getuuri,
      "POST",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );

    needReflesh(true);

    return;
  };

  return (
    <>
      {data?.code == "200" ? (
        <>
          {data?.table ? (
            <>
              <div className="w-full overflow-x-auto shadow-lg rounded-xl">
                <table className="table-auto min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <td className="bg-[#323A50] w-[40px] px-2 py-1 font-bold rounded-tl-xl" />
                      {data?.table?.map((row: any, i: any) => (
                        <td
                          key={i}
                          className={
                            "bg-[#323A50] text-white px-2 py-1 font-medium text-xs " +
                            (i === (data?.table?.length ?? 0) - 1 ? "rounded-tr-xl" : "")
                          }
                        >
                          {row.label}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.map((row: any, index) => (
                      <tr
                        key={row?.id + "-" + index}
                        className="transition-colors hover:bg-blue-50 focus-within:bg-blue-50"
                      >
                        <td
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } px-1 py-0.5 border-b border-gray-100 text-xs`}
                        >
                          <div className="flex gap-1">
                            {isview ? (
                              <>
                                <button
                                  className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                  onClick={() => {
                                    router.push(
                                      path +
                                        "/view/" +
                                        row?.id +
                                        "" +
                                        (uriview ?? "")
                                    );
                                  }}
                                >
                                  <i className="ri-eye-line" title="View"></i>
                                </button>
                              </>
                            ) : (
                              <></>
                            )}

                            {isedit ? (
                              <>
                                <button
                                  className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                  onClick={() => {
                                    if (uriedit == "") {
                                      router.push(
                                        path +
                                          "/form/" +
                                          row?.id +
                                          "" +
                                          (uriedit ?? "")
                                      );
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
                                  <i
                                    className="ri-file-edit-line"
                                    title="Edit"
                                  ></i>
                                </button>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </td>

                        {data.table.map((item: any, a: any) => {
                          return (
                            <td
                              className={`${
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                } px-2 py-0.5 border-b border-gray-100 text-xs text-gray-700`}
                              key={item.key + "-" + a}
                            >
                              {typeof row[item.key] == "string" ||
                              typeof row[item.key] == "number"
                                ? item?.type == "date"
                                  ? GFormatDate(row[item.key])
                                  : (item?.is_button_logout 
                                    ? 
                                    <button
                                      className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                      onClick={() => {
                                        forceLogout(row?.email);
                                      }}
                                    >
                                      <i
                                        className="ri-logout-box-line"
                                        title="Logout"
                                      ></i>
                                    </button>
                                    : row[item.key])
                                :
                                typeof row[item.key] == "boolean" ? 
                                  row[item.key] == true &&
                                  typeof row[item.key] == "boolean" ? 
                                    <img
                                      src="/assets/images/apps/checklist.png"
                                      className="w-[20px]"
                                    />
                                 : row[item.key] == false &&
                                    typeof row[item.key] == "boolean" ? 
                                    <img
                                      src="/assets/images/apps/cross.png"
                                      className="w-[20px]"
                                    />
                                  :  <img
                                      src="/assets/images/apps/cross.png"
                                      className="w-[20px]"
                                    />
                                : row[item.key]?.en ?? row[item.key]?.label

                                }
                            </td>
                          );
                        })}
                      </tr>
                    ))}
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
          {loading ? (
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
        vnext={data?.pagging?.next}
        vprev={data?.pagging?.prev}
        vnextJump={data?.pagging?.next_jump}
        vprevjump={data?.pagging?.prev_jump}
        prev={prev}
        next={next}
        prevJump={prevJump}
        nextJump={nextJump}
        totalPage={data?.pagging?.end_paging}
        page={data?.pagging?.start_paging}
        totalData={data?.pagging?.total_data}
      />
    </>
  );
};

export default TableView;
