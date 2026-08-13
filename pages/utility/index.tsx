import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import { useRouter } from "next/router";
import TableReport from "../../components/common/table-report";
import EmailBuilder from "../../components/pages/email-builder";
import EmailGroup from "../../components/pages/email-group";
import EmailSend from "../../components/pages/email-send";

const Utility = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const [module, setmodule] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const guestId = urlParams.get("data");
    const module = urlParams.get("module");
    setmodule(module);
    if (guestId) {
      setischildren(guestId);
    }
    setparentid(parent);
    setadd(add);
    setpath(window.location.pathname.split("/")[2]);
    setpathdua(window.location.pathname.split("/")[3]);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    if (path == "email-builder") {
      return <EmailBuilder />;
    }
    if (path == "email-group") {
      return <EmailGroup />;
    }
    if (path == "send-email") {
      return <EmailSend />;
    }
  }
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
      <PaperBase>
        <Tabs active={path} idparent={parentid} ischildren={ischildren} />

        {RouteInit()}
      </PaperBase>
    </LayoutComponent>
  );
};

export default Utility;
