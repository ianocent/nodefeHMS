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
  const GLOBALURI = "/cms/room-reservation";
  const [loading, setloading] = useState(false);
  const [dataval, setData] = useState<any>([]);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  useEffect(() => {
    getData();
  }, []);

  const getData = async (mth?: string, page?: number) => {
    setloading(true);
    try {
      let uri = "/cms/statistic";
      let aesraw = "";
      const datajson = await FetchData(
        uri + (page ? "?page=" + page : ""),
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (datajson?.code == "200") {
        setData(datajson?.data);
        setloading(false);
      } else {
        setloading(false);
        return;
      }
      return;
    } catch (error) {
      console.log("err", error);
      setloading(false);
      return;
    }
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
        <div className=" grid grid-cols-12 h-fit gap-4 ml-2 mb-2 mt-2 mr-2">
          {dataval.map((row: any, index: number) => (
            <div className="row-span-3 col-span-3 h-full">
              <CardRoom data={row} />
            </div>
          ))}
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
