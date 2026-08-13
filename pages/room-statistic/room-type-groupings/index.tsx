import ButtonAddList from "../../../components/common/button/ButtonAddList";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import CardRoom from "../../../components/common/card/card-statistic";
import { useSelector } from "react-redux";
import router from "next/router";
import InputMain from "../../../components/common/input/InputMain";
import ButtonSubmit from "../../../components/common/button/ButtonSubmit";
import Tabs from "../../../components/common/tab";
import PaperBase from "../../../components/common/paper/PaperBase";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  NumberClear,
  formatAmount,
} from "../../../components/helper";

const RoomStatistic = () => {
  const GLOBALURI = "/cms/statistic/statistic-room-type-grouping";
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [loading, setloading] = useState(false);
  const bussinesDate = datalocal?.data?.bussinesDate;
  const date = new Date(bussinesDate);
  date.setDate(date.getDate() + 7);

  const [dataDate, setdataDate] = useState(bussinesDate);
  const [dataDateto, setdataDateto] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);

    // console.log("DATALOG", window.location.pathname.split("/"));
  }, []);

  function GetList(date: any) {
    setdataDateto(date);
    router.replace({
      pathname: window.location.pathname,
      query: { date: dataDate, dateto: date },
    });
    setloading(false);
  }

  function RouteInit() {
    return (
      <>
        <Seo
          title={
            "Management " +
            GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
          }
        />
        <div className="relative max-w-sm flex gap-2">
          <div className="flex">
            <input
              type="date"
              onChange={function (e) {
                setloading(true);
                // GetList(e.target.value);
                setdataDate(e.target.value);
              }}
              value={dataDate}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date"
              // min={dataDate}
            />
          </div>

          <div className="flex">
            <input
              type="date"
              onChange={function (e) {
                setloading(true);
                GetList(e.target.value);
                // setdataDateto(e.target.value)
              }}
              value={dataDateto}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date"
              min={dataDate}
            />
          </div>
        </div>
        {/* <legend>{dataDate}</legend> */}
        <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            queryString={"&start=" + dataDate + "&end=" + dataDateto}
            uri={GLOBALURI}
            isEditTable={true}
            isBtnAdd={true}
            isBtnEdit={true}
            isBtnDelete={false}
            isBtnView={false}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <LayoutComponent>
        {/* <CrmView /> */}
        <PaperBase>{RouteInit()}</PaperBase>
      </LayoutComponent>
    </>
  );
};

export default RoomStatistic;
