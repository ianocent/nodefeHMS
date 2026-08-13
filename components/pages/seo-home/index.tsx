import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";

const SeoHome = () => {
  const GLOBALURI = "/cms/content/seo-home";
  const groups = "seo-home";
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
    if (add == "1") {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView groups={groups} uri={GLOBALURI} isEditTable={false} />
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

export default SeoHome;
