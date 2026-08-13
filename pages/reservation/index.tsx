import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import CodeBilingPage from "../../components/pages/code-billing/index";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import ReservationFit from "../../components/pages/reservation-fit/index";

import { useRouter } from "next/router";

const MasterPage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [ischildren, setischildren] = useState("1");


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const barid = urlParams.get("bar_id");
    if (barid) {
      setischildren(barid);
    }
    setparentid(parent);
    setadd(add);
    setpath(window.location.pathname.split("/")[2]);
    setpathdua(window.location.pathname.split("/")[3]);
  }, []);

  function RouteInit() {
    if (path == "fit") {
      return <ReservationFit />;
    } else if (path == "vr") {
      return <ReservationFit />;
    }else{
      return <ReservationFit />;
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

export default MasterPage;
