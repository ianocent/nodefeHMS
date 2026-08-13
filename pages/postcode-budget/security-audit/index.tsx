import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import CodeBilingPage from "../../../components/pages/code-billing/index";
import Tabs from "../../../components/common/tab";
import PaperBase from "../../../components/common/paper/PaperBase";
import StatisticBudget from "../../../components/pages/statistic-budget/index";
import ListView from "../../../components/pages/security-audit/index";

import { useRouter } from "next/router";
import { GetPathUri } from "../../../components/helper";

const MasterPage = () => {
  const [parentid, setparentid] = useState("0");
  const [module, setmodule] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const Lastpath = window.location.pathname.split("/").pop();
    const parent = urlParams.get("parent");
    let module = urlParams.get("module");
    if (!module) {
      module = Lastpath;
    }
    setparentid(parent);
    setmodule(module);
    // console.log("DATALOG", window.location.pathname.split("/"));
  }, [window.location.search, window.location.pathname]);
  function RouteInit() {
    const urlParams = new URLSearchParams(window.location.search);
      return <ListView module={module} id={urlParams.get("data")} />;
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
