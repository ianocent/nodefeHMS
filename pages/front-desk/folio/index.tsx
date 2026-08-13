import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Tabs from "../../../components/common/tab";
import PaperBase from "../../../components/common/paper/PaperBase";
import { useRouter } from "next/router";
import ListView from "../../../components/pages/security-audit/index";
import FrontDesk from "../../../components/pages/front-desk/index";
import SetupPage from "../../../components/pages/setup/index";
import { GetDecrypt, GetQueryStr } from "../../../components/helper";

const FrontDeskPage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [parentid, setparentid] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const [module, setmodule] = useState("");

  useEffect(() => {
    // console.log("body", GetDecrypt(GetQueryStr("body")));
    const urlParams = new URLSearchParams(window.location.search);
    let module = urlParams.get("module");
    const Lastpath = window.location.pathname.split("/").pop();
    if (!module) {
      module = Lastpath;
    }
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const guestId = urlParams.get("data");
    if (guestId) {
      setischildren(guestId);
    }
    setparentid(parent);
    setmodule(module);
    setpath(window.location.pathname.split("/")[2]);
    // console.log("DATALOG", window.location.pathname.split("/"));
  }, []);

  function RouteInit() {
    return <FrontDesk type="folio" />;
  }
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
      <PaperBase>
        {/* <Tabs active={path} idparent={parentid} ischildren={ischildren} /> */}

        {RouteInit()}
      </PaperBase>
    </LayoutComponent>
  );
};

export default FrontDeskPage;
