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
    const cached = sessionStorage.getItem("sidebar_menus");
    if (cached) {
      setdatamenu(JSON.parse(cached));
      setMenuLoaded(true);
      return;
    }
    
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
      sessionStorage.setItem("sidebar_menus", JSON.stringify(arr));
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

    if (isDesktop === true && isLogin && !menuLoaded && datamenus.length === 0) {
      GetMenus();
    }
  }, [isLogin, isDesktop]);

  const CallLogout = () => {
    sessionStorage.removeItem("sidebar_menus");
    Logout("", "POST", "", datalocal?.data?.access_token, router, dispatch);
  };
  return (
    <aside
      className={
        path != "/choose-property"
          ? (!hide ? " !w-[55px] " : "") + " app-sidebar sticky "
          : " !w-[55px] app-sidebar sticky"
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
          <SimpleBar className="main-sidebar flex flex-col" id="scroll">
            <nav className="mt-2 flex-1">
              {datamenus.map((row: any, index: number) =>
                row?.children.length == 0 ? (
                  <a
                    href={row?.link}
                    className={`flex gap-4 items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] ${
                      path.split("/")[1] == row?.link.replace("/", "")
                        ? " bg-[#4f4d4d] font-bold"
                        : ""
                    } text-white`}
                    key={row?.link + "-" + index}
                  >
                    <div>
                      <img src={row?.icon} />
                    </div>
                    {hide ? (
                      <>
                        <div className="capitalize">{row?.label}</div>
                      </>
                    ) : (
                      <></>
                    )}
                  </a>
                ) : (
                  <div key={row?.link + "-" + index}>
                    <div
                      className={`cursor-pointer flex gap-4 items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] ${
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
                      <div>
                        <img src={row?.icon} />
                      </div>
                      {hide ? (
                        <>
                          <div className="capitalize">{row?.label}</div>
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
                            <a
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
                              className={`flex gap-4 items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] ${
                                col?.active ? " bg-[#4f4d4d] " : ""
                              } text-white${!hide ? " w-[45px] " : " "}`}
                              key={col?.link + "-" + i}
                            >
                              <div>
                                <img src={row?.icon} />
                                <span className="text-[7px]">
                                  {GetInitials(col?.label)}
                                </span>
                              </div>

                              {hide ? (
                                <>
                                  <div className="capitalize">{col?.label}</div>
                                </>
                              ) : (
                                <></>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              )}
              <a
                href={"#"}
                className={`flex gap-4 items-center px-4 py-2 hover:font-bold hover:bg-[#4f4d4d] text-white`}
                key={"logout"}
                onClick={() => {
                  CallLogout();
                }}
              >
                <div className="w-[24px] h-[24px]">
                  <IconLogout />
                </div>
                <div className="capitalize">Logout</div>
              </a>
            </nav>
          </SimpleBar>
          {/* <div className="sidebar-logo-footer p-3 border-t border-white/10"> */}
          <div 
            className="sidebar-logo-footer p-3 border-t border-white/10"
            style={{ width: !hide ? '55px' : '15rem' }}
          >
            <img
              src={imageProp}
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
