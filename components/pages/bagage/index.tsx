import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import TableViewDocument from "../../common/table-view-document";

const Baggage = () => {
  const GLOBALURI = "/cms/concierge/baggage";
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
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      <div className="mt-2 min-w-full table-auto">
        <TableViewDocument
          groups={groups}
          uri={GLOBALURI}
          isEditTable={true}
          queryString={"&trash=0"}
          isDeleted={true}
          isWhatsapp={true}
          message="Thankyou"
        />
      </div>
    </>
  );
};

export default Baggage;
