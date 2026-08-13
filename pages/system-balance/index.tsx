import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import ListView from "../../components/pages/system-balance";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";

import { useRouter } from "next/router";

const MasterPage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    // const add = urlParams.get("add");
    // const view = urlParams.get("view");
    setparentid(parent);
    // setadd(add);
    // setview(view);
    setpath(window.location.pathname.split("/")[2]);
    setpathdua(window.location.pathname.split("/")[3]);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    return <ListView />;
  }
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
      <PaperBase>
        <Tabs active={path} idparent={parentid} />

        {RouteInit()}
      </PaperBase>
    </LayoutComponent>
  );
};

export default MasterPage;
