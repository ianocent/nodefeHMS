import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";

const EmailGroup = () => {
  const GLOBALURI = "/cms/email/email-group";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [data, setData] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const data = urlParams.get("data");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    setData(data);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    if (add == "1" || data !== null) {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            isDeleted={true}
            isBtnAdd={true}
          />
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

export default EmailGroup;
