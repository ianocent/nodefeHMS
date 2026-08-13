import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import AddPage from "./form";
import { FetchData, GetDecrypt } from "../../../components/helper";
import { useSelector } from "react-redux";

const ListView = () => {
  const GLOBALURI = "/cms/code-gls";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [load, setLoad] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const GetSycn = async () => {
    try {
      let urisave = "/sync/gl-code";
      setLoad(true);
      const saveprocess = await FetchData(
        urisave,
        "POST",
        "",
        false,
        datalocal?.data?.access_token,
        "",
        ""
      );  
      if (saveprocess?.code == "200") {
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (error) {
      console.log("erro", error);
    }
  };
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
    if (add == "1") {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <div className="flex items-end justify-end w-full">
            <div
              onClick={() => {
                if (!load) {
                  GetSycn();
                }
              }}
              className="p-2 bg-green text-white rounded-md flex w-12 shadow-lg cursor-pointer"
            >
              {load ? "..." : "Sync"}
            </div>
          </div>
          <TableView groups={groups} uri={GLOBALURI} isEditTable={true} title="GL Code" />
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
