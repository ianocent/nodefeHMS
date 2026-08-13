import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetQueryStr } from "../../components/helper";
import { useRouter } from "next/router";
import PaperBase from "../../components/common/paper/PaperBase";
import Seo from "../../components/common/seo";
import { LayoutContext } from "../../context/LayoutContext";
import InputMain from "../../components/common/input/InputMain";
import LayoutComponent from "../../components/common/layout/LayoutComponent";
import TableView from "../../components/common/table-edit";
import TableDrag from "../../components/common/table-drag";
import DragTblView from "./drag";
import ModuleAdd from "./form";
import Tabs from "../../components/common/tab";

const ModulePage = () => {
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal = React.useMemo(() => {
    try {
      const decrypted = GetDecrypt(isLogin);
      return decrypted ? JSON.parse(decrypted) : null;
    } catch (error) {
      return null;
    }
  }, [isLogin]);
  const router = useRouter();
  const GLOBALURILIST = "/cms/list";
  const GLOBALURICREATEUPDATE = "/cms";
  const [path, setpath] = useState("");
  const [parentid, setparentid] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const layout = useContext(LayoutContext);

  const [initList, setInitList] = useState<any>({});
  const [initCreateUpdate, setInitCreateUpdate] = useState<any>({});

  const GetInitList = async (uri: any) => {
    try {
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
      }
      return;
    } catch (error) {
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
      GetInitCreateUpdate(window.location.pathname, GetQueryStr("data"));
    } else if (GetQueryStr("add")) {
      GetInitCreateUpdate(window.location.pathname, false);
    } else {
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
      <LayoutComponent>
        <Seo title={"Management " + layout?.title} />
        {(GetQueryStr("data") || GetQueryStr("add")) && (
          <>
            {initCreateUpdate?.form && (
              <>
                <ModuleAdd data={initCreateUpdate} />
              </>
            )}
          </>
        )}
        {!GetQueryStr("data") && !GetQueryStr("add") && initList?.uriTable && (
          <>
            {/* CHANGED: grid responsive - 1 col mobile, 12 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-12 h-fit gap-4">
              <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-12 h-fit gap-4">
                <div className="col-span-1 md:col-span-12">
                  <fieldset className="border">
                    {/* CHANGED: overflow-x-auto added for table scroll on mobile */}
                    <div
                      key={window.location.pathname}
                      className="mt-2 w-full table-auto overflow-x-auto"
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
                          />
                        </>
                      )}
                      {initList?.typeTable == "tabledrag" && (
                        <>
                          <DragTblView uri={initList?.uriTable ?? ""} />
                        </>
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </>
        )}
      </LayoutComponent>
    </>
  );
};

export default ModulePage;
