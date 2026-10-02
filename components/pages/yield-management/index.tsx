import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";

const YieldManagement = () => {
  const GLOBALURI = "/cms/yield";
  const groups = "";
  // No query-param state: this screen only ever renders the table (Laravel is the
  // same). It used to read `add` from the "data" param, which was misleading —
  // nothing consumed it, and the name invited the same "== 1" mistake that broke
  // bar/holiday edit navigation.
  function RouteInit() {
    return (
      <div className="mt-2 min-w-full table-auto">
        <TableView groups={groups} uri={GLOBALURI} isEditTable={true} />
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

export default YieldManagement;
