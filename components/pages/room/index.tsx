import ButtonAddList from "../../../components/common/button/ButtonAddList";
import PaperBase from "../../../components/common/paper/PaperBase";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import ViewPage from "./view";
import AddPage from "./form";

const ListView = () => {
  const GLOBALURI = "/cms/room";
  const groups = "";
  // `data` used to be seeded with "0", a truthy string, so `add == "1" || data && view != "1"`
  // matched on the first render and mounted the form before the dependency-less effect
  // corrected the value. Derived from the URL instead, so there is no wrong render.
  const [, queryString] = useRouter().asPath.split("?");
  const q = new URLSearchParams(queryString ?? "");
  const add = q.get("add") ?? "0";
  const view = q.get("view") ?? "0";
  const data = q.get("data");
  function RouteInit() {
    if (add == "1" || (data && view != "1")) {
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
