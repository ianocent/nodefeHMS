import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import { useRouter } from "next/router";
import ListView from "../../components/pages/security-audit/index";
import HouseKeepingRoomStatus from "../../components/pages/housekeeping-room-status";
import WorkOrder from "../../components/pages/work-order";
import WorkOrderStock from "../../components/pages/work-order-stock";
import Stock from "../../components/pages/stock";
import SetupPage from "../../components/pages/setup/index";
import Rosters from "../../components/pages/rosters";
import ShiftRoster from "../../components/pages/shift-roster";
import ServiceScheduler from "../../components/pages/service-scheduler";

const HouseKeepingPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const [module, setmodule] = useState(urlParams.get("module"));
  const [lastPath, setlastPath] = useState("");

  useEffect(() => {
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
    setadd(add);
    setlastPath(Lastpath);
    setmodule(module);
    setpath(window.location.pathname.split("/")[2]);
    setpathdua(window.location.pathname.split("/")[3]);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });

  function RouteInit() {
    if (module == "room-status") {
      return <HouseKeepingRoomStatus />;
    } else if (module == "work-orders") {
      return <WorkOrder />;
    } else if (path == "shift") {
      return <ShiftRoster />;
    } else if (module == "master-setup") {
      return <SetupPage groups={lastPath} />;
    } else if (module == "stock") {
      return <Stock />;
    } else if (module == "work-orders-stock") {
      return <WorkOrderStock />;
    } else if (module == "roster") {
      return <Rosters />;
    } else if (module == "master-setup") {
      return <SetupPage groups={lastPath} />;
    } else if (module == "service-scheduler") {
      return <ServiceScheduler />;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      return <ListView module={module} id={urlParams.get("data")} />;
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

export default HouseKeepingPage;
