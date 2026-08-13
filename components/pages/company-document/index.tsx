import ButtonAddList from "../../../components/common/button/ButtonAddList";
import PaperBase from "../../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableViewDocument from "../../common/table-view-document";

const CompanyDocument = () => {
  const GLOBALURI = "/cms/profile/company-document";
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
    return (
      <div className="mt-2 min-w-full table-auto">
        <TableViewDocument
          groups={groups}
          uri={GLOBALURI}
          isEditTable={true}
          queryString={
            "&company_id=" +
            new URLSearchParams(window.location.search).get("data")
          }
          isBtnAdd={true}
          isDeleted={true}
          isBtnView={false}
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

      {RouteInit()}
    </>
  );
};

export default CompanyDocument;
