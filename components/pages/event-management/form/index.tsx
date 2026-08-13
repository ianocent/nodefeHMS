import ButtonAddList from "../../../../components/common/button/ButtonAddList";
import PaperBase from "../../../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../../components/common/seo";
import TableView from "../../../../components/common/table-edit";
import { GetQueryStr } from "../../../helper";

const ListView = () => {
  const GLOBALURI = "/cms/event-management-item?event_id=";
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
    return (
      <div className="mt-2 min-w-full table-auto">
        <TableView
          groups={groups}
          uri={GLOBALURI + GetQueryStr("data")}
          isEditTable={true}
        />
      </div>
    );
  }
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      <div className="bg-white p-2 rounded-md">{RouteInit()}</div>
    </>
  );
};

export default ListView;
