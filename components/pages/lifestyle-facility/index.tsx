import React, { useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";

const LifestyleFacility = () => {
  const GLOBALURI = "/cms/content/lifestyle-facility";
  const groups = "lifestyle-facility";
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setadd(urlParams.get("add") ?? "0");
    setview(urlParams.get("view") ?? "0");
  });

  function RouteInit() {
    if (add == "1") return <AddPage />;
    if (view == "1") return <AddPage isview={true} />;
    return (
      <div className="mt-2 min-w-full table-auto">
        <TableView groups={groups} uri={GLOBALURI} isEditTable={false} />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={
          "Management " + GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      {RouteInit()}
    </>
  );
};

export default LifestyleFacility;