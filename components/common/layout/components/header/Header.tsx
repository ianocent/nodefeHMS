import { LayoutContext } from "../../../../../context/LayoutContext";
import { Breadcrumbs } from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import Notification from "../menu/Notification";
import StaahWebhookNotification from "../menu/StaahWebhookNotification";
import Languange from "../menu/Languange";
import BussinesDate from "../menu/BusinessDate";
import SearchHeader from "../menu/SearchHeader";
import Email from "../menu/Email";
import Profile from "../menu/Profile";
import Link from "next/link";
import { IconMenu } from "../../../icon/SidebarIcon";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetPathUri,
  GetQueryParam,
} from "../../../../helper";
import router from "next/router";
import { useSelector } from "react-redux";
interface HeaderProps {
  btnNav: any;
  hide: boolean;
}
const Header = (props: HeaderProps) => {
  const { btnNav, hide } = props;
  const layout = useContext(LayoutContext);
  const path = router.pathname;
  const [breadcrumb, setbreadcrumb] = useState(false);
  const [pathleng, setpathleng] = useState(0);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [notifSum, setnotif] = useState(0);

  useEffect(() => {
    GetNotif();
    const title = GetQueryParam(0);
    layout?.setTitle(GetCapitalFirst(title).replaceAll("-", " "));
    // set url param to breadcrumbs
    let breadcumbs = [];
    let path = window.location.pathname;
    let paths = path.split("/");
    paths.map((row, index) => {
      if (index > 0) {
        breadcumbs.push({
          label: GetCapitalFirst(row.replaceAll("-", " ")),
          href: "",
        });
      }
    });
    layout?.setBreadcumbs(breadcumbs);
    setpathleng(window.location.pathname.split("/").length);
    setInterval(() => {
      GetNotif();
    }, 120000);
  }, [router.pathname]);

  const GetNotif = async () => {
    try {
      let urisave = "/cms/helper/total-cancel-booking-engine";

      const saveprocess = await FetchData(
        urisave,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setnotif(saveprocess?.data?.total);
      }
    } catch (error) {
      console.log("erro", error);
    }
  };

  return (
    <div
      className={
        "app-header" +
        (!hide
          ? " lg:!ps-[50px] "
          : path != "/choose-property"
          ? ""
          : " lg:!ps-[50px] ")
      }
    >
      <nav className="main-header !h-[3.75rem] md:!h-[3.75rem]">
        <div className="main-header-container ps-[0.725rem] pe-[1rem] flex items-center justify-between w-full min-w-0">
          <div className="header-content-left pt-0 flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            {path != "/choose-property" ? (
              <>
                {btnNav}
                <button
                  className="block lg:hidden"
                  onClick={() => {
                    layout.setActiveSideBarMobile(!layout.activeSideBarMobile);
                  }}
                >
                  {" "}
                  <IconMenu />
                </button>
              </>
            ) : (
              <></>
            )}
            
            <div className="flex flex-col justify-center !capitalize min-w-0 overflow-hidden">
              <h4 className="hidden md:block font-bold text-sm md:text-xl !capitalize truncate">
                <>
                  {window.location.pathname
                    .split("/")
                    .filter(
                      (value, index, array) => array.indexOf(value) === index
                    )
                    .map((row, index) => (
                      // <>
                        <React.Fragment key={row + "-" + index}>
                          {index == 2 &&
                            pathleng <= 4 &&
                            (row.toLocaleUpperCase() == "TYPE-PAYMENT"
                              ? "PAYMENT TYPE"
                              : row.toLocaleUpperCase() == "RATE"
                              ? "RATE SETUP"
                              : row.toLocaleUpperCase() == "BAR"
                              ? "BAR SETUP"
                              : row.toLocaleUpperCase() == "FIT"
                              ? "RESERVATION FIT"
                              : row.toLocaleUpperCase() == "GIT"
                              ? "RESERVATION GIT"
                              : row.toLocaleUpperCase() == "VR"
                              ? "RESERVATION VIRTUAL"
                              : row.toLocaleUpperCase() == "CODE-ITEM"
                              ? "ITEM CODE"
                              : row.toLocaleUpperCase() == "CODE-POST"
                              ? "POST CODE"
                              : row.toLocaleUpperCase() == "CODE-GLS"
                              ? "GL CODE"
                              : row.replaceAll("-", " ").toLocaleUpperCase())}
                          {index == 1 &&
                            pathleng <= 2 &&
                            row.replaceAll("-", " ").toLocaleUpperCase()}
                        </React.Fragment>
                      // </>
                    ))}
                </>
              </h4>
              <div>
                <Breadcrumbs placeholder={""} className="bg-white p-0">
                  {layout?.breadcumbs.map((row, index) => (
                    <div
                      key={row.label}
                      className={`${
                        index < layout.breadcumbs.length - 1 ? "opacity-60" : ""
                      }`}
                    >
                      {row.label.toString().toLowerCase() == "type payment"
                        ? "Payment Type"
                        : row.label.toString().toLowerCase() == "code post"
                        ? "Post Code"
                        : row.label.toString().toLowerCase() == "code item"
                        ? "Item Code"
                        : row.label.toString().toLowerCase() == "code gls"
                        ? "GL Code"
                        : row.label}
                    </div>
                  ))}
                </Breadcrumbs>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-2">
            {/* <SearchHeader />
            <Notification />
            <Email /> */}
            {/* <BussinesDate /> */}
            {/* <StaahWebhookNotification /> */}
            <Notification notif={notifSum} />
            <Profile />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
