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
const ListBatchPostingView = () => {
  const GLOBALURI = "/cms/batch-posting";
  const GLOBALSAVE = "/cms/batch-posting/batch-posting";
  const groups = "";
  const [queryStr, setqueryStr] = useState("");
  const [isLoad, setIsload] = useState(true);
  const [loading, setloading] = useState<boolean>(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const router = useRouter();

  const onSave = async () => {
    try {
      let urisave = GLOBALSAVE;
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
        setIsload(false);
      } else {
        setIsload(false);
      }
    } catch (error) {
      console.log("erro", error);
      setIsload(false);
    }
  };

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
      <div className="flex justify-end">
        {datalocal?.data?.is_shift && (
          <ButtonAddList
            onAdd={() => {
              setIsload(true);
              onSave();
            }}
            label="Submit Posting"
            title=""
          />
        )}
      </div>
      <div className="mt-2 min-w-full table-auto">
        {isLoad ? (
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={true}
            isAdvance={false}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ListBatchPostingView;
