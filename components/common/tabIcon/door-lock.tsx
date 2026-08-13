import React, { useContext, useEffect, useRef, useState } from "react";
import InputMain from "../input/InputMain";
import Seo from "../seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetNextDay,
  GetPathUri,
  GetQueryParam,
  GetQueryStr,
  GetSelisihDay,
  NumberClear,
  RouteChange,
  formatAmount,
  removeItem,
} from "../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../button/ButtonSubmit";
import { LayoutContext } from "../../../context/LayoutContext";
import ModalNotedComponent  from "../modal/ModalNoted";
import { IconSpiner } from "../icon/CardIcon";

import { Value } from "sass";
import TabMenuIcon from "./tab";
interface AddviewProps {
  uri?: string;
  title?: string;
}
const DoorLock = (props: AddviewProps) => {
  const {
    uri,
    title,
  } = props;
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>([]);
  const [datatitle, setdatatitle] = useState(title);
  const [IsOpenModalIns, setIsOpenModalIns] = useState(false);
  const isMounted = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const OnSaveSugestionsss = async () => {
    setData(loadingIcon());
    setIsOpenModalIns(true);
    try {
      let urisave = uri + GetQueryStr("data") + "";
      let mth = "GET";

      // const saveprocess = await FetchData(
      //   urisave,
      //   mth,
      //   '',
      //   false,
      //   datalocal?.data?.access_token,
      //   router,
      //   ""
      // );

      // if (saveprocess?.code == "200") {
      //   setData(successIcon());
      //   setdatatitle("Success");
      // } else {
      //   setdatatitle("Something went wrong");
      //   setData(errorIcon());
      // }
     

    } catch (error) {
      setdatatitle("Something went wrong");
      setData(errorIcon());
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      console.log('mounting');
      OnSaveSugestionsss();
    } else {
      console.log('mounted');
    }
  }, [window.location.search]);

  const loadingIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <IconSpiner />
      </div>
    );
  }

  const successIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  }

  const errorIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
       <ModalNotedComponent 
        text={dataval}
        isHtml={true}
        title={datatitle}
        IsOpenModel={IsOpenModalIns}
        ChangeonClose={(e) => {
          setIsOpenModalIns(e);
        }}
      />
    </>
  );
};

export default DoorLock;
