import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import EditPage from "./form/edit";

import ListPage from "./list";
import ListBatchCheckoutView from "./list-batch-check-out";
import ListBatchPostingView from "./list-batch-posting";

import { GetPathUri, GetQueryStr } from "../../helper";
import { useRouter } from "next/router";
interface FrontDeskProps {
  type?: string;
}
const FrontDesk = (props: FrontDeskProps) => {
  const { type = "check_in" } = props;
  const GLOBALURI = "/cms/front-desk";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const routers = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");

    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("eedd", window.location.pathname);
    if (GetQueryStr("key") == "edit") {
      var uri = "";

      if (window.location.pathname == "/reservation/fit/reservation") {
        uri = window.location.pathname;
      } else {
        uri = window.location.pathname + "/reservation";
      }
      routers.replace({
        pathname: uri,
        query: {
          parent: GetQueryStr("parent"),
          data: GetQueryStr("data"),
        },
      });
    }

    // console.log("DATALOG", window.location.pathname.split("/"));
  }, [window.location.search]);
  function RouteInit() {
    if (type == "batch_check_out") {
      return <ListBatchCheckoutView type="check_out" />;
    } else if (type == "batch_posting") {
      return <ListBatchPostingView />;
    } else {
      return <ListPage type={type} />;
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

export default FrontDesk;
