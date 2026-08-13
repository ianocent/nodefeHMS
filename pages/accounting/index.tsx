import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import InvoicePage from "../../components/pages/invoice/index";
import CreditNotePage from "../../components/pages/credit-note/index";
import DebitNotePage from "../../components/pages/debit-note/index";
import Adjustment from "../../components/pages/adjustment/index";
import Payment from "../../components/pages/payment/index";
import Refund from "../../components/pages/refund/index";
import Allocation from "../../components/pages/allocation/index";


import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import CodeGlsPage from "../../components/pages/code-gls/index";
import SetupPage from "../../components/pages/setup/index";
import CodeItem from "../../components/pages/code-item/index";
import CodePost from "../../components/pages/code-post/index";
import Room from "../../components/pages/room/index";
import RoomAdd from "../../components/pages/room/form/index";
import RoomView from "../../components/pages/room/view/index";
import RoomType from "../../components/pages/room-type/index";
import City from "../../components/pages/city/index";
import Country from "../../components/pages/country/index";
import TypePayment from "../../components/pages/type-payment/index";
import ListView from "../../components/pages/security-audit/index";
import RoomResevation from "../../components/pages/room-reservation/index";
import RoomInventory from "../../components/pages/room-inventory/index";

import { useRouter } from "next/router";
import { GetPathUri, GetQueryParam } from "../../components/helper";

const MasterPage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [lastPath, setlastPath] = useState("");
  const [parentid, setparentid] = useState("0");
  const [module, setmodule] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // get last path
    const Lastpath = window.location.pathname.split("/").pop();
    const parent = urlParams.get("parent");
    let module = urlParams.get("module");
    if (!module) {
      module = Lastpath;
    }
    setparentid(parent);
    setlastPath(Lastpath);
    setmodule(module);
    console.log("module", module);
    // console.log("DATALOG", window.location.pathname.split("/"));
  }, [window.location.search, window.location.pathname]);
  function RouteInit() {
    if (GetQueryParam(1) == "invoice") {
      return <InvoicePage />;
    } else if (GetQueryParam(1) == "credit-note") {
      return <CreditNotePage />;
    } else if (GetQueryParam(1) == "debit-note") {
      return <DebitNotePage />;
    } else if (GetQueryParam(1) == "adjustment") {
      return <Adjustment />;
    } else if (GetQueryParam(1) == "payment") {
      return <Payment />;
    } else if (GetQueryParam(1) == "refund") {
      return <Refund />;
    } else if (GetQueryParam(1) == "allocation") {
      return <Allocation />;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      return <ListView module={module} id={urlParams.get("data")} />;
    }
  }
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
      <PaperBase>
        <Tabs active={GetPathUri(1)} idparent={parentid} />

        {RouteInit()}
      </PaperBase>
    </LayoutComponent>
  );
};

export default MasterPage;
