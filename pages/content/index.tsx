import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import { useRouter } from "next/router";
import Banner from "../../components/pages/banner";
import SeoHome from "../../components/pages/seo-home";
import SeoRoom from "../../components/pages/seo-room";
import RoomPax from "../../components/pages/room-pax";
import Cancellationrule from "../../components/pages/cancellation-rule";
import CancellationruleDate from "../../components/pages/cancellation-rule-date";

const ContentPage = () => {
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
    if (path == "banner") {
      return <Banner />;
    } else if (path == "seo-home") {
      return <SeoHome />;
    } else if (path == "room") {
      return <SeoRoom />;
    } else if (path == "config-pax") {
      return <RoomPax />;
    } else if (path == "cancelation-rule-date") {
      return <CancellationruleDate />;
    } else if (path == "cancelation-rule") {
      return <Cancellationrule />;
    } else {
      return <div></div>;
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

export default ContentPage;
