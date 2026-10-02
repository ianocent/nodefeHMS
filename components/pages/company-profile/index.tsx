import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { GetDecrypt } from "../../helper";
import { env } from "../../../next.config";

const CompanyProfile = () => {
  const GLOBALURI = "/cms/profile/company";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [data, setData] = useState("");
  const [loadingPrint, setLoadingPrint] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const accessToken = datalocal?.data?.access_token ?? "";

  // Query params only exist after the router is ready. Without this flag the first
  // render evaluated the RouteInit guard against the useState defaults, where
  // `data` was still "" — and `"" !== null` is true, so <AddPage /> mounted for a
  // frame and fired GET /cms/profile/company/create before the list table showed.
  //
  // router.query is the source of truth (not window.location.search) and the effect
  // is keyed on its values, so in-page navigation — table-edit pushes
  // `?parent=..&add=1`, `?..&view=1&data=..`, `?..&data=..` on the same pathname —
  // re-reads the params instead of latching the first read.
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

  const handlePrint = async () => {
    setLoadingPrint(true);
    try {
      const url = `${env.uriApi}/cms/report/company-profile`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = `Company-Profile-Report-${Date.now()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    } finally {
      setLoadingPrint(false);
    }
  };

  function RouteInit() {
    // `router.isReady` covers the pre-hydration frame on auto-statically-optimised
    // pages where router.query is still {}.
    if (!router.isReady || !paramsReady) {
      return null;
    }
    // Order matters. table-edit navigates with:
    //   add   -> ?parent=..&add=1                 (no data)
    //   add   -> ?parent=..&add=1&data=..&module= (data is the PARENT row id)
    //   view  -> ?parent=..&view=1&data=..&module=
    //   edit  -> ?parent=..&data=..&module=
    // `view` has to be tested before `data`, otherwise a view link matches the
    // `data` branch and opens the editable form instead of the read-only one.
    if (view === "1") {
      return <AddPage isview={true} />;
    } else if (add === "1") {
      return <AddPage />;
    } else if (data) {
      return <AddPage />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <div className="flex justify-end mb-2">
            <button
              onClick={handlePrint}
              disabled={loadingPrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50"
            >
              🖨️ {loadingPrint ? "Loading..." : "Print"}
            </button>
          </div>
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            isDeleted={true}
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

export default CompanyProfile;