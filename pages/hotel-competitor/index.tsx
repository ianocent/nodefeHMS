import ButtonAddList from "../../components/common/button/ButtonAddList";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../components/common/seo";
import TableView from "../../components/common/table-edit";
import CardRoom from "../../components/common/card/card-statistic";
import { useSelector } from "react-redux";
import router from "next/router";
import InputMain from "../../components/common/input/InputMain";
import ButtonSubmit from "../../components/common/button/ButtonSubmit";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import LayoutComponent from "../../components/common/layout/LayoutComponent";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  NumberClear,
  formatAmount,
} from "../../components/helper";

const RoomStatistic = () => {
  const GLOBALURI = "/cms/hotel-competitor";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [loading, setloading] = useState(false);
  const [dataDate, setdataDate] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });

  const GetList = (date: any) => {
    setdataDate(date);
    router.replace({
      pathname: window.location.pathname,
      query: { date: date },
    });
    setloading(false);
  };

  function RouteInit() {
    return (
      <>
        <Seo
          title={
            "Management " +
            GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
          }
        />
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </div>
          <input
            type="date"
            onChange={function (e) {
              setloading(true);
              GetList(e.target.value);
            }}
            value={dataDate}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Select date"
          />
        </div>
        <legend>{dataDate}</legend>
        <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            uri={GLOBALURI}
            queryString={"date=" + dataDate}
            isEditTable={true}
            headRow={2}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <LayoutComponent>
        {/* <CrmView /> */}
        <Tabs
          active={window.location.pathname}
          idparent={GetQueryStr("parent")}
          ischildren={true}
        />
        <PaperBase>{RouteInit()}</PaperBase>
      </LayoutComponent>
    </>
  );
};

export default RoomStatistic;
