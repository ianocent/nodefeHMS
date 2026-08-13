import React, { useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import { FetchData, GetDecrypt } from "../../helper";
import { useSelector } from "react-redux";

const StaahOtaMapping = () => {
  const API_URI = "/cms/staah-ota-mapping";
  const groups = "";
  const [load, setLoad] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const GetSync = async () => {
    try {
      let urisave = "/sync/staah-ota-mapping";
      setLoad(true);
      const saveprocess = await FetchData(
        urisave,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        "",
        "",
      );
      setLoad(false);
      return saveprocess;
    } catch (error) {
      console.log("error", error);
      setLoad(false);
    }
  };

  function RouteInit() {
    return (
      <>
        <div className="flex items-end justify-end w-full gap-2">
          <div
            onClick={() => {
              if (!load) {
                GetSync();
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
            uri={API_URI}
            isEditTable={true}
            isBtnAdd={true}
            title="Master Setup Staah OTA Mapping"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title={"Management Staah OTA Mapping"} />
      {RouteInit()}
    </>
  );
};

export default StaahOtaMapping;
