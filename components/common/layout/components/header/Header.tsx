import { LayoutContext } from "../../../../../context/LayoutContext";
import { Breadcrumbs } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import Notification from "../menu/Notification";
import StaahWebhookNotification from "../menu/StaahWebhookNotification";
import Languange from "../menu/Languange";
import BussinesDate from "../menu/BusinessDate";
import SearchHeader from "../menu/SearchHeader";
import Email from "../menu/Email";
import Profile from "../menu/Profile";
import { IconMenu } from "../../../icon/SidebarIcon";
import {
  FetchData,
  GetDecrypt,
} from "../../../../helper";
import { buildBreadcrumbs, resolvePageTitle } from "./breadcrumbLabels";
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
  // next.config.js rewrites each module's sub-routes onto a single page
  // ("/rate-management/:path*" -> "/rate-management"), so router.pathname is
  // constant while the user moves between tabs. asPath carries the real route,
  // and the effect below keys on it -- keying on `path` meant the crumbs froze on
  // whichever route happened to be visited first.
  const asPath = router.asPath;
  const [notifSum, setnotif] = useState(0);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  useEffect(() => {
    GetNotif();
    const routePath = asPath.split("?")[0];
    layout?.setTitle(resolvePageTitle(routePath));
    // Recomputed from the live path on every navigation, and replaced outright,
    // so a shorter route can no longer inherit the previous route's crumbs.
    layout?.setBreadcumbs(buildBreadcrumbs(routePath));
    // Header is persistent now (mounted from _app), so this effect re-runs on every
    // route change. The polling interval has to be torn down on cleanup, otherwise
    // each navigation leaves another live 2-minute timer behind.
    const timer = setInterval(() => {
      GetNotif();
    }, 120000);
    return () => clearInterval(timer);
  }, [asPath]);

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
        // Padding transition lives in .app-header (globals.scss) so it matches the
        // sidebar timing and cannot be out-ranked by stylesheet order.
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
                {layout?.title}
              </h4>
              <div>
                <Breadcrumbs placeholder={""} className="bg-white p-0">
                  {layout?.breadcumbs.map((row: any, index: number) => (
                    <div
                      key={row.label + "-" + index}
                      className={`${
                        index < layout.breadcumbs.length - 1 ? "opacity-60" : ""
                      }`}
                    >
                      {row.label}
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
