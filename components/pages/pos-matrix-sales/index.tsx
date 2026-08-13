import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import { FetchData, GetDecrypt } from "../../helper";
import { useSelector } from "react-redux";

const PosMatrixSales = () => {
  const GLOBALURI = "/cms/pos-matrix-sales";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [load, setLoad] = useState(false);

  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const GetSycn = async () => {
    try {
      let urisave = "/sync/matrix-sales";
      setLoad(true);
      const saveprocess = await FetchData(
        urisave,
        "GET",
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
    return (
      <>
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
        <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={true}
            isBtnAdd={true}
            title="Master Setup POS Matrix Sales"
          />
        </div>
      </>
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

export default PosMatrixSales;
