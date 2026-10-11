import ButtonAddList from "../../../components/common/button/ButtonAddList";
import PaperBase from "../../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import AddPage from "./form";
import { GetQueryStr } from "../../helper";
import { useRouter } from "next/router";

const ListView = () => {
  const GLOBALURI = "/cms/room-type";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const router = useRouter();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const addParam = urlParams.get("add");
    const viewParam = urlParams.get("view");
    const dataParam = urlParams.get("data");

    if (addParam === "1" && dataParam && parent !== "48") {
      router.replace(`/master-setup/room-type/main?parent=48&add=1&data=${dataParam}&module=room-type-main`);
    }

    setparentid(parent);
    setadd(addParam);
    setview(viewParam);
  }, [router.asPath]);

  function RouteInit() {
    let Lastpath = window.location.pathname.split("/").pop();
    if (GetQueryStr("add") == "1") {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else if (Lastpath === "main") {
      return <AddPage />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView groups={groups} uri={GLOBALURI} isEditTable={false} isBtnView={false} isBtnAdd={true} isBtnDelete={false} />
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
