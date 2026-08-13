import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import { GetQueryStr } from "../../helper";
import { useFormPermission } from "../../../hooks/useFormPermission";

const RoomPax = () => {
  const GLOBALURI = "/cms/content/room/config-pax";
  const groups = "seo-room";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const { canCreate } = useFormPermission(1091);
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
        <TableView
          groups={groups}
          uri={GLOBALURI}
          queryString={"&content_room_id=" + GetQueryStr("data")}
          isEditTable={true}
          isBtnAdd={canCreate}
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

export default RoomPax;
