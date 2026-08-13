import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import {
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
} from "../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FetchData } from "../../helper";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { dataForm } from "../administrator/permission/data";
import InputMain from "../../common/input/InputMain";

const ListView = () => {
  const GLOBALURI = "/cms/shift-confirmation";
  const groups = "";
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [loading, setloading] = useState(false);
  const [dataroom, setdataroom] = useState<any>([]);
  const [data, setdata] = useState<any>({});
  const [optbuilding, setdataoptbuilding] = useState<any>({});
  const [opt, setdataopt] = useState<any>({});

  const router = useRouter();
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
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
    if (GetQueryStr("add") == "1") {
      router.push({
        pathname: "/endshift",
        query: { data: GetQueryStr("data") },
      });
    }
  }, [window.location.search]);

  const onLoad = async () => {
    try {
      let urisave = "/cms/room-statistic";
      let mth = "POST";

      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        setdataroom(saveprocess);

        setdataopt(saveprocess?.master);
      } else {
        setloading(false);
        console.log("error", saveprocess);
      }
    } catch (error) {
      console.log("erro", error);
    }
  };

  function RouteInit() {
    return (
      <>
        <div className="mt-2 min-w-full table-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <fieldset>
                <legend>Filter</legend>
                <div className="sm:grid gap-2 grid-cols-12 mt-4">
                  <div className="p-2 col-span-12">
                    <InputMain
                      options={opt?.buildings ?? [{}]}
                      valuename={"building"}
                      error={false}
                      label={"Building"}
                      typeInput="checkbox"
                      isMulti={true}
                      isAll={true}
                      valMulti={data}
                      onChangeSel={(e) => {}}
                    />
                  </div>
                  <div className="p-2 col-span-12">
                    <InputMain
                      options={opt?.floors ?? [{}]}
                      valuename={"floor"}
                      error={false}
                      label={"Building"}
                      typeInput="checkbox"
                      isMulti={true}
                      isAll={true}
                      valMulti={data}
                      onChangeSel={(e) => {}}
                    />
                  </div>
                  <div className="p-2 col-span-12">
                    <InputMain
                      options={opt?.maid_statuses ?? [{}]}
                      valuename={"maid_statuses"}
                      error={false}
                      label={"Maid Status"}
                      typeInput="checkbox"
                      isMulti={true}
                      isAll={true}
                      valMulti={data}
                      onChangeSel={(e) => {}}
                    />
                  </div>
                  <div className="p-2 col-span-12">
                    <InputMain
                      options={opt?.room_statuses ?? [{}]}
                      valuename={"room_statuses"}
                      error={false}
                      label={"Room Status"}
                      typeInput="checkbox"
                      isMulti={true}
                      isAll={true}
                      valMulti={data}
                      onChangeSel={(e) => {}}
                    />
                  </div>
                  <div className="p-2 col-span-12">
                    <InputMain
                      options={opt?.room_types ?? [{}]}
                      valuename={"room_types"}
                      error={false}
                      label={"Room Type"}
                      typeInput="checkbox"
                      isMulti={true}
                      isAll={true}
                      valMulti={data}
                      onChangeSel={(e) => {}}
                    />
                  </div>
                  <div className="p-2 col-span-12">
                    <InputMain
                      options={opt?.room_types ?? [{}]}
                      valuename={"room_types"}
                      error={false}
                      label={"Room Type"}
                      typeInput="checkbox"
                      isMulti={true}
                      isAll={true}
                      valMulti={data}
                      onChangeSel={(e) => {}}
                    />
                  </div>
                  <div className="p-2 col-span-12">
                    <InputMain
                      options={opt?.room_configurations ?? [{}]}
                      valuename={"room_configurations"}
                      error={false}
                      label={"Room Config"}
                      typeInput="checkbox"
                      isMulti={true}
                      isAll={true}
                      valMulti={data}
                      onChangeSel={(e) => {}}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="col-span-9">
              <div className="sm:grid gap-4 grid-cols-12 ">
                {dataroom?.data?.map((rw: any, i) => (
                  <>
                    <div
                      className={
                        (rw?.room_status?.value == 0 ||
                        rw?.room_status?.label == 0
                          ? "bg-[#cafcc7]"
                          : rw?.room_status?.value == 1 ||
                            rw?.room_status?.label == 1
                          ? "bg-[#fa6b69]"
                          : "bg-white") + " col-span-2"
                      }
                    >
                      <div className="border-b-2 p-2 font-bold">
                        {rw?.room_status?.value}
                      </div>
                      <div className="p-4">
                        <div className="text-xl">{rw?.name}</div>
                        <div className="text-sm mt-2">
                          {rw?.room_type_id?.label}
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  useEffect(() => {
    onLoad();
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

export default ListView;
