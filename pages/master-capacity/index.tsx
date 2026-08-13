// import ButtonAddList from "../../../components/common/button/ButtonAddList";
// import PaperBase from "../../../components/common/paper/PaperBase";
import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Seo from "../../components/common/seo";
import TableView from "../../components/common/table-edit";
import AddPage from "./form";

const ListView = () => {
  const GLOBALURI = "/cms/master-capacity";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
  }, []);
  function RouteInit() {
    let Lastpath = window.location.pathname.split("/").pop();
    if (add == "1") {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage />;
    } else if (Lastpath === "main") {
      return <AddPage />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView groups={groups} uri={GLOBALURI} isEditTable={true} title="Capacity" />
        </div>
      );
    }
  }
  return (
    <LayoutComponent>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      {RouteInit()}
    </LayoutComponent>
  );
};

export default ListView;