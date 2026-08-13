import ButtonAddList from "../../../common/button/ButtonAddList";
import PaperBase from "../../../common/paper/PaperBase";
import React, { useContext, useEffect, useRef, useState } from "react";
import Seo from "../../../common/seo";
import TableView from "../../../common/table-edit";
import InputMain from "../../../common/input/InputMain";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { useSelector } from "react-redux";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
} from "../../../helper";
import { useRouter } from "next/router";
import TabMenuIcon from "../../../common/tabIcon/tab";
interface ReservationFitprp {
  type?: string;
}
const ListBatchCheckoutView = (props: ReservationFitprp) => {
  const { type = "check_in" } = props;
  const GLOBALURI = "/cms/front-desk";
  const GLOBALURISAVE = "/cms/front-desk/batch-check-out";
  const groups = "";
  const [queryStr, setqueryStr] = useState("");
  const [isLoad, setIsload] = useState(true);

  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
  }, []);
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      <div className="mt-2 min-w-full table-auto">
        {isLoad ? (
          <TableView
            groups={groups}
            uri={GLOBALURI}
            uriSave={GLOBALURISAVE}
            isEditTable={false}
            isTitle={false}
            queryString={"&type=" + type + queryStr}
            isAdvance={false}
            checked={true}
            onClosePopUp={() => {}}
            lblBtnSave="Confirm"
            isBtnAdd={false}
            isBtnView={false}
            isBtnEdit={false}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ListBatchCheckoutView;
