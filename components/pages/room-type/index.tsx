import ButtonAddList from "../../../components/common/button/ButtonAddList";
import PaperBase from "../../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import AddPage from "./form";
import { GetQueryStr } from "../../helper";

const ListView = () => {
  const GLOBALURI = "/cms/room-type";
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
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    let Lastpath = window.location.pathname.split("/").pop();
    if (GetQueryStr("add") == "1") {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else if (Lastpath === "main") {
      return <AddPage />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView groups={groups} uri={GLOBALURI} isEditTable={false} isBtnView={false} isBtnAdd={true} isBtnDelete={false} />
        </div>
      );
    }
  }
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {RouteInit()}
    </>
  );
};

export default ListView;
