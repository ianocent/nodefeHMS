import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import {
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  FetchData,
  GetCurrentDate
} from "../../../../helper";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const BussinesDate = () => {
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const router = useRouter();
  const [date, setdate] = useState(GetCurrentDate());

  const getBusinessDate = async () => {
    try {
      let urisave = "/cms/night-audit/audit";
      let mth = "GET";

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
        setdate(saveprocess?.data?.date);
      } 
    } catch (error) {
    }
  };

  // useEffect(() => {
  //   getBusinessDate();
  // }, [window.location.pathname, window.location.search]);

  return (
    <Menu>
      <></>
      {/* <MenuHandler>
        <div className="w-max h-[50px] flex items-center justify-center bg-[#111C43] rounded-lg text-white gap-2 px-2">
          <svg fill="#ffffff"  height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,19c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3v-8H2V19z M19,4h-2V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H9V3c0-0.6-0.4-1-1-1S7,2.4,7,3v1H5C3.3,4,2,5.3,2,7v2h20V7C22,5.3,20.7,4,19,4z"></path></g></svg>

          <div className="font-bold">Business Date : {date}</div>
        </div>
      </MenuHandler> */}
    </Menu>
  );
};

export default BussinesDate;
