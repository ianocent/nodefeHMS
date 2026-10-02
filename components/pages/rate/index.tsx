import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";

const ListView = () => {
  const GLOBALURI = "/cms/rate";
  const groups = "";
  // Derived from the URL instead of copied into state by a dependency-less effect:
  // the state version rendered one frame with the previous query, so returning to a
  // rate code detail briefly rendered the list (add still "0") before the effect ran.
  const [, queryString] = useRouter().asPath.split("?");
  const q = new URLSearchParams(queryString ?? "");
  const add = q.get("add") ?? "0";
  const view = q.get("view") ?? "0";
  function RouteInit() {
    if (add == "1") {
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
