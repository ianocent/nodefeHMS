import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";

const ListView = () => {
  const GLOBALURI = "/cms/promotion";
  const groups = "";
  // Same "0" is truthy trap as the room list: `data` seeded as "0" made
  // `add || (data && view != "1")` true on the first render. Derived from the URL.
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

export default ListView;
