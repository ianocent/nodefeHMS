import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Tabs from "../../../components/common/tab";
import PaperBase from "../../../components/common/paper/PaperBase";
import { useRouter } from "next/router";
import RoomStatistic from "../../../components/pages/room-statistic";

const HouseKeepingPage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const [module, setmodule] = useState("");
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
  }, []);



  function RouteInit() {
    return <RoomStatistic />;
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
