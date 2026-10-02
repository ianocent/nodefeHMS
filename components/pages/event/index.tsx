import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetQueryStr } from "../../helper";
import { useRouter } from "next/router";
import PaperBase from "../../common/paper/PaperBase";
import Seo from "../../common/seo";
import { LayoutContext } from "../../../context/LayoutContext";
import InputMain from "../../common/input/InputMain";
import TableView from "../../common/table-edit";
import TableErrorState from "../../common/table/TableErrorState";
import TableDrag from "../../common/table-drag";
import DragTblView from "./drag";
import ModuleAdd from "./form";
import Tabs from "../../common/tab";

const ModulePage = () => {
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const router = useRouter();
  const GLOBALURILIST = "/cms/list";
  const GLOBALURICREATEUPDATE = "/cms";
  const [path, setpath] = useState("");
  const [parentid, setparentid] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const layout = useContext(LayoutContext);

  const [initList, setInitList] = useState<any>({});
  const [initCreateUpdate, setInitCreateUpdate] = useState<any>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  const GetInitList = async (uri: any) => {
    try {
      setLoadError(null);
      let uris = uri.split("/");
      let tblid = GetQueryStr("tblid") ? "?tblid=" + GetQueryStr("tblid") : "";
      let getuuri =
        GLOBALURILIST +
        "/" +
        uris[uris.length - 1] +
        tblid +
        (window.location.search ? window.location.search : "");
      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data?.code == "200") {
        setInitList(data);
        // console.log(data);
        layout.setBreadcumbs(data?.breadcrumbs);
      } else {
        // `uriTable` decides which table renders. Without it the page below
        // renders nothing at all — blank, with no error and no retry.
        setLoadError(
          "Gagal memuat konfigurasi daftar. Tabel tidak dapat ditampilkan."
        );
      }
      return;
    } catch (error) {
      setLoadError(
        "Gagal memuat konfigurasi daftar. Tabel tidak dapat ditampilkan."
      );
      console.log(error);
      return;
    }
  };
  const GetInitCreateUpdate = async (uri: any, id: any) => {
    try {
      let uris = uri.split("/");
      let reqapi = GetQueryStr("reqapi")
        ? "?reqapi=" + GetQueryStr("reqapi")
        : "";
      let tblid = GetQueryStr("tblid") ? "?tblid=" + GetQueryStr("tblid") : "";

      let getuuri =
        GLOBALURICREATEUPDATE +
        "/" +
        uris[uris.length - 1] +
        "/create" +
        reqapi +
        tblid;
      if (id) {
        getuuri =
          GLOBALURICREATEUPDATE +
          "/" +
          uris[uris.length - 1] +
          "/" +
          id +
          "/edit" +
          reqapi +
          tblid;
      }
      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data?.code == "200") {
        setInitCreateUpdate(data);
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    if (GetQueryStr("data")) {
      // console.log("ed");
      GetInitCreateUpdate(window.location.pathname, GetQueryStr("data"));
    } else if (GetQueryStr("add")) {
      // console.log("add");
      GetInitCreateUpdate(window.location.pathname, false);
    } else {
      // console.log("list");
      GetInitList(window.location.pathname);
    }
  }, [window.location.search, window.location.pathname]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const guestId = urlParams.get("data");
    if (guestId) {
      setischildren(guestId);
    }
    setparentid(parent);
    setpath(window.location.pathname.split("/")[2]);
  });

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <Tabs active={path} idparent={parentid} ischildren={ischildren} />
      {(GetQueryStr("data") || GetQueryStr("add")) && (
        <>
          {initCreateUpdate?.form && (
            <>
              <ModuleAdd data={initCreateUpdate} />
            </>
          )}
        </>
      )}
      {!GetQueryStr("data") && !GetQueryStr("add") && loadError && (
        <TableErrorState
          message={loadError}
          onRetry={() => GetInitList(window.location.pathname)}
        />
      )}
      {!GetQueryStr("data") && !GetQueryStr("add") && !loadError && initList?.uriTable && (
        <>
          <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
              <div className="col-span-12">
                <fieldset className="border">
                  {/* <legend className="ml-2">{""}</legend> */}
                  <div
                    key={window.location.pathname}
                    className="mt-2 w-full table-auto"
                  >
                    {(initList?.typeTable == "table" ||
                      initList?.typeTable == "tableedit") && (
                      <>
                        <TableView
                          groups={""}
                          uri={initList?.uriTable ?? ""}
                          isEditTable={
                            initList?.typeTable == "tabledrag"
                              ? false
                              : initList?.typeTable == "table"
                              ? false
                              : true
                          }
                          // isDrag={initList?.isDrag ?? false}
                        />
                      </>
                    )}
                    {initList?.typeTable == "tabledrag" && (
                      <>
                        <DragTblView uri={initList?.uriTable ?? ""} />
                      </>
                    )}
                    {/* {initCreateUpdate?.} */}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ModulePage;
