import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";

const ListView = () => {
  const GLOBALURI = "/cms/holiday";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState<string | null>(null);
  const [data, setdata] = useState<string | null>(null);
  const [view, setview] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const data = urlParams.get("data");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setdata(data);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    // The in-row Edit button navigates to `?data=<id>` (table-edit/index.tsx), so
    // the form is selected by the PRESENCE of `add` or `data` — not by comparing
    // either to "1". `add`/`data` are initialised to null because "0" is truthy
    // in JS, which flashed <AddPage /> for one frame before this effect ran.
    if (add || (data && view != "1")) {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView groups={groups} uri={GLOBALURI} isEditTable={true} />
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
