import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import { useRouter } from "next/router";

const ListView = () => {
  const GLOBALURI = "/cms/profile/guest";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [data, setData] = useState("");
  // See components/pages/company-profile — the first render used to evaluate the
  // RouteInit guard against the useState default "" where `"" !== null` is true,
  // so <AddPage /> flashed for a frame and fired GET /cms/profile/guest/create
  // before the list table appeared.
  const router = useRouter();
  const qParent = router.query.parent;
  const qAdd = router.query.add;
  const qView = router.query.view;
  const qData = router.query.data;
  const [paramsReady, setParamsReady] = useState(false);

  useEffect(() => {
    setparentid(typeof qParent === "string" ? qParent : "0");
    setadd(typeof qAdd === "string" ? qAdd : "0");
    setData(typeof qData === "string" ? qData : "");
    setview(typeof qView === "string" ? qView : "0");
    setParamsReady(true);
  }, [qParent, qAdd, qView, qData]);

  function RouteInit() {
    if (!router.isReady || !paramsReady) {
      return null;
    }
    // `view` before `data`: table-edit links to view as `?view=1&data=..`, which
    // the `data` branch would otherwise capture and open as an editable form.
    if (view === "1") {
      return <AddPage isview={true} />;
    } else if (add === "1") {
      return <AddPage />;
    } else if (data) {
      return <AddPage />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            queryString={"&trash=0&status=1"}
            isBtnView={true}
          />
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
