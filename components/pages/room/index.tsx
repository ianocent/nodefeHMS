import ButtonAddList from "../../../components/common/button/ButtonAddList";
import PaperBase from "../../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import ViewPage from "./view";
import AddPage from "./form";

const ListView = () => {
  const GLOBALURI = "/cms/room";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [data, setdata] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const data = urlParams.get("data");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    setdata(data);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    if (add == "1" || data && view != "1") {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView groups={groups} uri={GLOBALURI} isEditTable={false} isBtnDelete={false} />
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
