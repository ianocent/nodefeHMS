import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import { useRouter } from "next/router";

const EmailBuilder = () => {
  const GLOBALURI = "/cms/email/email-builder";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [data, setData] = useState("");
  // Query params arrive in an effect; without this flag the first render
  // guesses with default state and flashes the form before the real params.
  //
  // Keyed on router.query, not `[]`: table-edit navigates to `?parent=..&add=1` /
  // `?..&view=1&data=..` on the SAME pathname, so Next keeps this component mounted.
  // An empty dep array latched the first read and add/edit/view stopped working.
  const router = useRouter();
  const qParent = router.query.parent;
  const qAdd = router.query.add;
  const qView = router.query.view;
  const qData = router.query.data;
  const [paramsReady, setParamsReady] = useState(false);
  useEffect(() => {
    setparentid(typeof qParent === "string" ? qParent : "0");
    setadd(typeof qAdd === "string" ? qAdd : "0");
    setview(typeof qView === "string" ? qView : "0");
    setData(typeof qData === "string" ? qData : "");
    setParamsReady(true);
  }, [qParent, qAdd, qView, qData]);
  function RouteInit() {
    if (!router.isReady || !paramsReady) {
      return null;
    }
    // `view` before `data`: a view link carries both, and the `data` branch would
    // otherwise open the editable form instead of the read-only one.
    if (view === "1") {
      return <AddPage isview={true} />;
    } else if (add === "1" || Boolean(data)) {
      return <AddPage />;
    } else {

      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            isDeleted={true}
            isBtnAdd={true}
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

export default EmailBuilder;
