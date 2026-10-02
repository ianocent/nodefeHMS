import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import SidebarModel from "./SidebarModel";
import { useRouter } from "next/router";
import LogoAdmin from "../../../../../public/logo-admin.png";
import {
  Logout,
  RouteChange,
  GetLocaData,
  GetDecrypt,
  FetchData,
  GetInitials,
} from "../../../../helper";
import { IconLogout } from "../../../icon/SidebarIcon";
import { tree } from "next/dist/build/templates/app-page";
import { LayoutContext } from "../../../../../context/LayoutContext";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../../../../redux/auth/authSlice";
import { IconHome } from "../../../icon/SidebarIcon";
interface sidebarprops {
  hide: boolean;
  btnabs: any;
}
const Sidebar = (props: sidebarprops) => {
  const { hide = false, btnabs } = props;
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const  imageProp = datalocal?.image || datalocal?.imgProperty;
  const [datamenus, setdatamenu] = useState<any>([]);
  // const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [menuLoaded, setMenuLoaded] = useState(false);
  const router = useRouter();
  const path = router.pathname;
  const GetMenus = async () => {
    if (!isDesktop || menuLoaded) return;
    const datamenu: any = await FetchData(
      "/cms/menu?page=1&limit=280&name=&trash=0",
      "GET",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    if (datamenu?.code == "200") {
      setdatamenu(datamenu?.data);
      var arr: any = [];
      datamenu?.data.map((row: any, index: any) => {
        var activech = false;
        var activechd = false;
        if (!row?.parent_id) {
          var arrch: any = [];
          activech = false;
          row?.relation?.children?.map((col: any, i: any) => {
            activechd = false;
            if (window.location.pathname == col.url) {
              activech = true;
              activechd = true;
            }
            arrch.push({
              label: col?.name?.en,
              link: col?.url,
              icon: col?.media?.image?.icon,
              parentid: col?.id,
              module: col?.module,
              active: activechd,
            });
          });
          arr.push({
            label: row?.name?.en,
            link: row?.url,
            module: row?.module,
            icon: row?.media?.image?.icon,
            children: arrch,
            active: activech,
          });
        }
      });
      setdatamenu(arr);
      setMenuLoaded(true);
    }
  };

  const checkScreenSize = () => {
    const desktop = window.innerWidth >= 1024;
    setIsDesktop(prev => (prev === desktop ? prev : desktop));
  };
  // useEffect(() => {
  //   checkScreenSize();
  //   const handleResize = () => checkScreenSize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);
  
  // useEffect(() => {
  //   if (isDesktop === true && isLogin && !menuLoaded) {
  //     GetMenus();
  //   }
  // }, [isDesktop, isLogin]);
  useEffect(() => {
    checkScreenSize();
    const handleResize = () => checkScreenSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevLoginRef = React.useRef(isLogin);
  useEffect(() => {
    if (prevLoginRef.current !== isLogin) {
      prevLoginRef.current = isLogin;
      sessionStorage.removeItem("sidebar_menus");
      setdatamenu([]);
      setMenuLoaded(false);
    }
  }, [isLogin]);

  // Kept as a separate effect on purpose. The reset above flips `menuLoaded` back to
  // false, and if the fetch lived in the same effect body it would read the stale
  // `true` from this render's closure and skip GetMenus() entirely. Since the
  // component no longer remounts on navigation (it lives in _app now), nothing else
  // would ever retry -- the menu would stay empty until the next token refresh.
  useEffect(() => {
    if (isDesktop === true && isLogin && !menuLoaded && datamenus.length === 0) {
      GetMenus();
    }
  }, [isLogin, isDesktop, menuLoaded, datamenus.length]);

  const CallLogout = () => {
    sessionStorage.removeItem("sidebar_menus");
    Logout("", "POST", "", datalocal?.data?.access_token, router, dispatch);
  };
  return (
    <aside
      className={
        // overflow-hidden keeps the faded-out labels clipped while collapsed (and during
        // the width transition) instead of bleeding past the 55px rail.
        "overflow-hidden " +
        (path != "/choose-property"
          ? (!hide ? " !w-[55px] " : "") + " app-sidebar sticky "
          : " !w-[55px] app-sidebar sticky")
      }
    >
      <div
        className={
          "main-sidebar-header mt-2 !p-2 " +
          (!hide
            ? " !p-2 !w-[55px] "
            : path != "/choose-property"
            ? ""
            : " !p-2 !w-[55px] ")
        }
      >
        <Link
          className={
            path != "/choose-property" ? (!hide ? "w-[25px]" : "") : "w-[25px]"
          }
          href={path != "/choose-property" ? "/dashboard" : "#"}
        >
          {!hide ? (
            <>
              <img
                width={40}
                height={41}
                alt="logo"
                src={"/Logo-HMS-icon.png"}
              />
            </>
          ) : (
            <>
              {path != "/choose-property" ? (
                <>
                  <img
                    className="w-full h-full scale-75 mb-1.5"
                    alt="logo"
                    src="/Logo-HMS.png"
                  />
                </>
              ) : (
                <>
                  <img
                    width={40}
                    height={41}
                    alt="logo"
                    src={"/Logo-HMS-icon.png"}
                  />
                </>
              )}
            </>
          )}
        </Link>
      </div>
      {path != "/choose-property" ? (
        <>
          {/* <SimpleBar className="main-sidebar " id="scroll"> */}
          {/* `.main-sidebar` in globals.scss clips overflow-x; long labels scroll
              themselves via `.sidebar-label` instead of widening the rail. */}
          <SimpleBar className="main-sidebar flex flex-col" id="scroll">
            <nav className="mt-2 flex-1">
              {datamenus.map((row: any, index: number) =>
                row?.children.length == 0 ? (
                  <Link
                    href={row?.link}
                    className={`sidebar-link flex gap-4 items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] ${
                      path.split("/")[1] == row?.link.replace("/", "")
                        ? " bg-[#4f4d4d] font-bold"
                        : ""
                    } text-white`}
                    key={row?.link + "-" + index}
                  >
                    <div className="shrink-0">
                      <img src={row?.icon} />
                    </div>
                    {/* Long titles ("Booking Engine Analytics") overflowed the 55px
                        rail. Clipping + overflow-x-auto means the rail itself never
                        grows a horizontal scrollbar, while the label becomes
                        scrollable on hover so the full text stays reachable. */}
                    <div
                      title={row?.label}
                      className={`sidebar-label capitalize transition-opacity ease-out ${
                        hide ? "opacity-100 delay-150 duration-200" : "opacity-0 delay-0 duration-100"
                      }`}
                    >
                      {row?.label}
                    </div>
                  </Link>
                ) : (
                  <div key={row?.link + "-" + index}>
                    <div
                      className={`sidebar-link cursor-pointer flex gap-4 items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] ${
                        path.split("/")[1] == row?.link.replace("/", "")
                          ? "bg-[#4f4d4d]"
                          : ""
                      } text-white`}
                      onClick={() => {
                        let tempSidebar = [...datamenus];
                        tempSidebar[index].active = !tempSidebar[index].active;
                        setdatamenu([...tempSidebar]);
                      }}
                    >
                      <div className="shrink-0">
                        <img src={row?.icon} />
                      </div>
                      {hide ? (
                        <>
                          <div className="sidebar-label capitalize">{row?.label}</div>
                          <i className="angle fe fe-chevron-right side-menu__angle"></i>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    {row?.active && (
                      <div className={!hide ? " ps-[5px] " : "ps-6"}>
                        {row?.children.map((col: any, i: number) => {
                          return (
                            <Link
                              // href={
                              //   (col?.link.split("?").length
                              //     ? col?.link.split("?")[0] +
                              //       "" +
                              //       col?.link.split("?")[1] +
                              //       "&"
                              //     : col?.link + "/?") +
                              //   "parent=" +
                              //   col?.parentid +
                              //   "&module=" +
                              //   col?.module
                              // }
                              href={col?.link}
                              // `sidebar-sub-link` (not `sidebar-link`): only the
                              // nested entries get the hover walk. Top-level menus
                              // like "Statistic" must stay put — their long children
                              // ("Room Type Grouping", "Booking Engine Analytics") are
                              // the ones that need to scroll, and sliding the parent
                              // too made the whole column look broken.
                              // Gap is set in globals.scss (`.sidebar-sub-link`) because
                              // it has to change to 0.25rem on hover, right after the icon
                              // collapses — a Tailwind `gap-*` utility of equal specificity
                              // would win or lose depending on stylesheet order.
                              className={`sidebar-sub-link flex items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] ${
                                col?.active ? " bg-[#4f4d4d] " : ""
                              } text-white transition-[width] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]${
                                !hide ? " w-[45px] " : " "
                              }`}
                              key={col?.link + "-" + i}
                            >
                              {/* Collapses to zero width on hover (not just faded)
                                  so the label can take the icon's place and walk the
                                  full width without being clipped on the left. */}
                              <div className="sidebar-sub-icon shrink-0 transition-all duration-200 ease-out overflow-hidden">
                                <div className="flex items-center gap-1 w-max">
                                  <img src={row?.icon} />
                                  <span className="text-[7px]">{GetInitials(col?.label)}</span>
                                </div>
                              </div>

                              {/* `title` gives the native tooltip as a backstop if a
                                  name is ever long enough to hit the ellipsis. */}
                              <div
                                title={col?.label}
                                className={`sidebar-sub-label capitalize transition-opacity ease-out ${
                                  // hide === true means the rail is expanded.
                                  hide ? "opacity-100 delay-150 duration-200" : "opacity-0 delay-0 duration-100"
                                }`}
                              >
                                {col?.label}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              )}
              <a
                href={"#"}
                className={`sidebar-link flex gap-4 items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] text-white`}
                key={"logout"}
                onClick={() => {
                  CallLogout();
                }}
              >
                <div className="w-[24px] h-[24px] shrink-0">
                  <IconLogout />
                </div>
                {/* Was rendered unconditionally, so "Logout" stayed visible on the
                    55px rail and was the widest label in the sidebar — it is what
                    actually forced the horizontal scrollbar. Now it fades with the
                    rest of the labels. */}
                <div
                  title="Logout"
                  className={`capitalize transition-opacity ease-out ${
                    hide ? "opacity-100 delay-150 duration-200" : "opacity-0 delay-0 duration-100"
                  }`}
                >
                  Logout
                </div>
              </a>
            </nav>
          </SimpleBar>
          {/* `hide` is inverted: true means expanded. The top border only reads as a
              deliberate separator at full width; collapsed to the 55px rail it was just
              a short white line under Logout, so it is dropped in that state. */}
          <div
            className={`sidebar-logo-footer p-2 ${
              hide ? "border-t border-white/10" : ""
            }`}
            style={{ width: !hide ? '55px' : '15rem' }}
          >
            <img
              src={`${process.env.uriApi || ""}${imageProp || ""}`}
              className="w-full h-16 object-contain bg-white/30 rounded-lg hover:bg-white/75"
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </aside>
  );
};

export default Sidebar;
