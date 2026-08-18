import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-balance";
import {
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
} from "../../helper";
import { IconSpiner } from "../../common/icon/CardIcon";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData } from "../../helper";
import ButtonSubmit from "../../common/button/ButtonSubmit";
const ListView = () => {
  const GLOBALURI = "/cms/system-balance/payment";
  const groups = "";
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [loading, setloading] = useState(false);
  const [dataDate, setdataDate] = useState("-1");

  const router = useRouter();
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
    if (GetQueryStr("add") == "1") {
      router.push({
        pathname: "/endshift",
        query: { data: GetQueryStr("data") },
      });
    }
  }, [window.location.search]);

  function GetList(date: string) {
    setdataDate(date);
    router.replace({
      pathname: window.location.pathname,
      query: { date: date },
    });
    setloading(false);
  }

  function RouteInit() {
    return (
      <>

        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <input type="date" 
          onChange={( function(e) {
            setloading(true);
            GetList(e.target.value)
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"/>
        </div>
        <legend>{dataDate}</legend>
        {loading ? (
           <div className="mt-8 flex justify-center">
           <IconSpiner />
          </div>
         ) : (
        dataDate != "-1" ? (
          <>
            <div className="mt-2 min-w-full table-auto">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <fieldset>
                    <legend>Payment</legend>
                    <TableView
                      groups={groups}
                      uri={"/cms/system-balance/payment"}
                      queryString={"&date=" + dataDate}
                      isEditTable={false}
                      isPageing={false}
                    />
                  </fieldset>
                </div>
                <div className="col-span-12">
                  <fieldset>
                    <legend>Posting</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/system-balance/posting"}
                        queryString={
                          "&date=" +
                          dataDate 
                        }
                        isEditTable={false}
                        isPageing={false}
                        isHeader={false}
                      />
                    </div>
                  </fieldset>
                </div>
                <div className="col-span-12">
                  <fieldset>
                    <legend>Tax</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/system-balance/tax"}
                        queryString={
                          "&date=" +
                          dataDate 
                        }
                        isEditTable={false}
                        isPageing={false}
                        isHeader={false}

                      />
                    </div>
                  </fieldset>
                </div>
                <div className="col-span-12">
                  <fieldset>
                    <legend>Advance Deposit Movement</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/system-balance/advanceDepositMovement"}
                        queryString={
                          "&date=" +
                          dataDate 
                        }
                        isEditTable={false}
                        isPageing={false}
                        isHeader={false}

                      />
                    </div>
                  </fieldset>
                </div>
                <div className="col-span-12">
                  <fieldset>
                    <legend>Guest Ledger Movement</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/system-balance/guestLedgerMovement"}
                        queryString={
                          "&date=" +
                          dataDate 
                        }
                        isEditTable={false}
                        isPageing={false}
                        isHeader={false}
                        isResult={true}

                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
           
          </>
        ) : (
          <>
          </>
        )
        )}
      </>
    );
  }
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {RouteInit()}
    </>
  );
};

export default ListView;
