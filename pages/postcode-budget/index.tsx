import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import CodeBilingPage from "../../components/pages/code-billing/index";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import StatisticBudget from "../../components/pages/statistic-budget/index";
import ListView from "../../components/pages/security-audit/index";

import { useRouter } from "next/router";
import { GetPathUri } from "../../components/helper";

const MasterPage = () => {
  const [parentid, setparentid] = useState("0");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    setparentid(parent);
  }, [window.location.search, window.location.pathname]);
  function RouteInit() {
    return <StatisticBudget type="static" />;
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
