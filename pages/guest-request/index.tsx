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
  const GLOBALURI = "/cms/guest-request";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [loading, setloading] = useState(false);
  const [dataDate, setdataDate] = useState('');
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

  function RouteInit() {
    return (
      <>
        <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
        <div className="mt-2 min-w-full table-auto">
          <TableView 
            groups={groups} 
            uri={GLOBALURI} 
            isEditTable={false} />
        </div>
      </>
    );
  }


  return (
    <>
      <LayoutComponent>
        {/* <CrmView /> */}
        <PaperBase>
          {RouteInit()}
        </PaperBase>
      </LayoutComponent>
    </>
  );
};

export default RoomStatistic;
