import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import { FetchData, GetDecrypt } from "../../helper";
import { useSelector } from "react-redux";

const WorkOrder = () => {
  const GLOBALURI = "/cms/housekeeping/work-order";
  const groups = "";
  // Derived from the URL rather than copied into state by a dependency-less effect.
  // `data` was seeded with "0", which is a truthy string, so the guard
  // `add == "1" || data` matched on the very first render and mounted <AddPage /> --
  // firing GET /work-order/create and flashing the form fields before the effect
  // corrected `data` to null and the table view took over.
  const [, queryString] = useRouter().asPath.split("?");
  const q = new URLSearchParams(queryString ?? "");
  const add = q.get("add") ?? "0";
  const view = q.get("view") ?? "0";
  const data = q.get("data");
  const [dataSumary, setdataSumary] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  function RouteInit() {
    if (add == "1" || data) {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            queryString={"&trash=0"}
            isBtnAdd={true}
            insertHTML={() => (
              <div className="flex gap-2 ">
                <div className="w-[108px] bg-[#da627d] rounded-md justify-center p-4">
                  <div className="text-center font-bold">ALL</div>
                  <div className="text-center">{dataSumary?.all}</div>
                </div>
                <div className="w-[108px] bg-[#98c1d9] rounded-md justify-center p-4">
                  <div className="text-center font-bold">Open</div>
                  <div className="text-center">{dataSumary?.open}</div>
                </div>

                <div className=" w-[108px] bg-[#ea8c55] rounded-md justify-center p-4">
                  <div className="text-center font-bold">On Process</div>
                  <div className="text-center">{dataSumary?.on_process}</div>
                </div>
                <div className="w-[108px] bg-[#97b1a6] rounded-md justify-center p-4">
                  <div className="text-center font-bold">Finish</div>
                  <div className="text-center">{dataSumary?.finish}</div>
                </div>
              </div>
            )}
          />
        </div>
      );
    }
  }
  const GetDataSummary = async (uri?) => {
    try {
      let getuuri = "/cms/housekeeping/work-order/summary";

      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        "",
        ""
      );
      if (data?.code == "200") {
        setdataSumary(data.data);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    // alert("test");
    GetDataSummary();
  }, []);
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

export default WorkOrder;
