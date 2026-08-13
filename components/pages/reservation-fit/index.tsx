import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import AddPageGit from "./form-git";
import AddPageVR from "./form-vr";
import AddDayUse from "./form-dayuse";
import EditPage from "./form/edit";
import EditDayUse from "./form-dayuse/edit";
import Guest from "./guest";
import Room from "./room";
import AdditionalItem from "./additional-item";
import Transaction from "./transaction";
import AddView from "./form-search";
import SecurityAuditListView from "../../pages/security-audit/index";
import ListPage from "./list";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetPathUri,
  GetQueryStr,
} from "../../helper";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import ModalConfirmationComponent from "../../common/modal/ModalConfirmation";

const ListView = () => {
  const GLOBALURI = "/cms/Reservation";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [module, setmodule] = useState("");
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const routers = useRouter();
  const [IsOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const Lastpath = window.location.pathname.split("/").pop();
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    let modules = GetQueryStr("module");
    if (!module) {
      modules = Lastpath;
    }
    setmodule(modules);
    setparentid(parent);
    setadd(add);
    setview(view);
    if (GetQueryStr("key") == "edit") {
      var uri = "";

      if (window.location.pathname == "/reservation/fit/reservation") {
        uri = window.location.pathname;
      } else {
        uri = window.location.pathname + "/reservation";
      }
      routers.replace({
        pathname: uri,
        query: {
          parent: GetQueryStr("parent"),
          data: GetQueryStr("data"),
        },
      });
    }
  }, [window.location.search]);
  const checkSaveReservation = async (key) => {
    // console.log("widylog", dataval);

    try {
      let urisave = "/cms/helper/check-last-user-folio";
      let mth = "POST";
      let datapost = {
        folio_id: key,
      };
      const raw = JSON.stringify(datapost);

      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        routers,
        "",
        true
      );
      if (saveprocess?.code == "200") {
        if (saveprocess?.data?.status == 1) {
          setIsOpenModal(true);
        }
      } else {
      }
    } catch (error) {
      // console.log("erro", error);
    }
  };
  const ReplaceReservation = async (key) => {
    // console.log("widylog", dataval);

    try {
      let urisave = "/cms/helper/replace-last-user-folio";
      let mth = "POST";
      let datapost = {
        folio_id: key,
      };
      const raw = JSON.stringify(datapost);

      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        routers,
        ""
      );
      if (saveprocess?.code == "200") {
        if (saveprocess?.data?.status == 1) {
          setIsOpenModal(true);
        }
      } else {
      }
    } catch (error) {
      // console.log("erro", error);
    }
  };
  useEffect(() => {
    if (GetQueryStr("data")) {
      checkSaveReservation(GetQueryStr("data"));
    }
  }, [GetQueryStr("data")]);
  function RouteInit() {
    if (add == "1") {
      if (GetQueryStr("key") == "edit") {
        return <EditPage />;
      } else {
        if (GetPathUri(2) == "git") {
          return <AddPageGit isType={GetPathUri(2)} />;
        } else if (GetPathUri(2) == "fit") {
          return <AddPage isType={GetPathUri(2)} />;
        } else if (GetPathUri(2) == "vr") {
          return <AddPageVR isType={GetPathUri(2)} />;
        } else if (GetPathUri(2) == "day-use") {
          return <AddDayUse isType={GetPathUri(2)} />;
        }
      }
    } else if (view == "1") {
      return <AddPage isType={GetPathUri(2)} isview={true} />;
    } else if (GetPathUri(3) == "reservation") {
      if (GetPathUri(2) == "day-use") {
        return <EditDayUse />;
      } else {
        return <EditPage />;
      }
    } else if (GetPathUri(3) == "other-guest") {
      return <Guest />;
    } else if (GetPathUri(3) == "room") {
      return <Room />;
    } else if (GetPathUri(3) == "transaction") {
      return <Transaction />;
    } else if (GetPathUri(3) == "additional-item") {
      return <AdditionalItem />;
    } else if (GetPathUri(3) == "security-audit") {
      const urlParams = new URLSearchParams(window.location.search);
      return (
        <SecurityAuditListView
          module={GetQueryStr("module")}
          id={urlParams.get("data")}
        />
      );
    } else {
      if (GetPathUri(2) == "git") {
        return <ListPage isType="git" />;
      } else if (GetPathUri(2) == "vr") {
        return <ListPage isType="vr" />;
      } else if (GetPathUri(2) == "fit") {
        return <ListPage isType="fit" />;
      } else if (GetPathUri(2) == "day-use") {
        return <ListPage isType="day-use" />;
      } else if (GetPathUri(2) == "search-rate") {
        return <AddView />;
      } 
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
      <ModalConfirmationComponent
        label="Do you want to override the previous session ?"
        title="Override Session"
        isShowIcon={false}
        IsOpenModel={IsOpenModal}
        ChangeonClose={(e) => {
          setIsOpenModal(e);
          window.history.back();
        }}
        onCheck={(e) => {
          if (e) {
            setIsOpenModal(false);
            // onSave(true);
            ReplaceReservation(GetQueryStr("data"));
          } else {
            setIsOpenModal(false);
            window.history.back();
          }
        }}
      />
      {RouteInit()}
    </>
  );
};

export default ListView;
