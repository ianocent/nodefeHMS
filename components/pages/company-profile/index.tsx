import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import { useSelector } from "react-redux";
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setparentid(urlParams.get("parent"));
    setadd(urlParams.get("add"));
    setview(urlParams.get("view"));
    setData(urlParams.get("data"));
  });

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
    if (add == "1" || data !== null) {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
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