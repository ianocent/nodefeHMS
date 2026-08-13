import { Drawer } from "@material-tailwind/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { LayoutContext } from "../../../../../context/LayoutContext";
import Link from "next/link";
import SimpleBar from "simplebar-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FetchData, GetDecrypt, Logout } from "../../../../helper";
import SidebarModel from "./SidebarModel";
import { IconLogout } from "../../../icon/SidebarIcon";

const SidebarMobile = () => {
  const layout = useContext(LayoutContext);
  const { sidebar, setSidebar } = SidebarModel();
  const router = useRouter();
  const path = router.pathname;
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state?.auth);
  // const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  let datalocal: any = null;
  try {
    const decrypted = GetDecrypt(isLogin);
    datalocal = decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    datalocal = null;
  }

  const [datamenus, setdatamenu] = useState<any>([]);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [menuLoaded, setMenuLoaded] = useState(false);

  const checkScreenSize = () => {
    const mobile = window.innerWidth <= 1024;
    setIsMobile(prev => (prev === mobile ? prev : mobile));
  };

  const GetMenus = async () => {
    if (!isMobile || menuLoaded) return;
    
    // const datamenu: any = await FetchData(
    //   "/cms/menu?page=1&limit=280&name=&trash=0",
    //   "GET",
    //   "",
    //   false,
    //   datalocal?.data?.access_token,
    //   router,
    //   ""
    // );
    const token = datalocal?.data?.access_token;
    if (!token) return;

    const datamenu: any = await FetchData(
      "/cms/menu?page=1&limit=280&name=&trash=0",
      "GET",
      "",
      false,
      token,
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

  useEffect(() => {
    checkScreenSize();
    const handleResize = () => checkScreenSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile === true && isLogin && datalocal && !menuLoaded) {
      GetMenus();
    }
  }, [isMobile, isLogin, datalocal]);

  useEffect(() => {
    if (!datamenus.length) return;

    const updated = datamenus.map((row: any) => {
      if (row.children?.length > 0) {
        const hasActiveChild = row.children.some((col: any) =>
          path.includes(col.link)
        );
        return { ...row, active: hasActiveChild };
      }
      return row;
    });
    setdatamenu(updated);
  }, [path]);

  const CallLogout = () => {
    Logout("", "POST", "", datalocal?.data?.access_token, router, dispatch);
  };

  return (
    <>
      {layout.activeSideBarMobile && (
        <>
          <div
            onClick={() => layout.setActiveSideBarMobile(false)}
            className="fixed inset-0 bg-black bg-opacity-55 z-[999]"
          />

          <div className="fixed inset-y-0 h-[97%] left-0.5 top-0.5 bg-black rounded-xl w-64 z-[9999] flex flex-col">
            
            {/* Header + Logo */}
            <div className="px-4 py-5 border-b border-white/10 flex items-center gap-3">
              <Link href="/dashboard" onClick={() => layout.setActiveSideBarMobile(false)}>
                <img width={150} height={60} alt="logo" src="/Logo-HMS.png" />
              </Link>
            </div>

            {/* Menu items — SimpleBar dengan padding dikurangin */}
            <SimpleBar 
              className="flex-1 min-h-0 overflow-y-auto"
              style={{ maxHeight: 'calc(100dvh - 60px - 80px)' }} // 60px header, 80px logo footer
            >
              <nav className="px-2 py-1">
                {datamenus.map((row: any, index: number) =>
                  row.children?.length === 0 ? (
                    <Link
                      href={row.link}
                      key={row.link}
                      onClick={() => layout.setActiveSideBarMobile(false)}
                      className={`flex gap-3 items-center px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-sm ${
                        path.includes(row.link) ? "bg-white/15" : ""
                      } text-white`}
                    >
                      <img src={row.icon} alt="" className="w-4 h-4 shrink-0" />
                      <span className="capitalize">{row.label}</span>
                    </Link>
                  ) : (
                    <div key={row.link}>
                      <div
                        onClick={() => {
                          const temp = [...datamenus];
                          temp[index].active = !temp[index].active;
                          setdatamenu(temp);
                        }}
                        className={`flex gap-3 items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition text-sm ${
                          row.active || path.includes(row.link) ? "bg-white/15" : ""
                        } text-white`}
                      >
                        <div className="flex gap-3 items-center">
                          <img src={row.icon} alt="" className="w-4 h-4 shrink-0" />
                          <span className="capitalize">{row.label}</span>
                        </div>
                        <i className={`fe fe-chevron-right text-xs transition-transform ${row.active ? "rotate-90" : ""}`} />
                      </div>

                      {row.active && (
                        <div className="ml-7 mt-0.5 space-y-0.5">
                          {row.children.map((col: any) => (
                            <Link
                              href={col.link}
                              key={col.link}
                              onClick={() => layout.setActiveSideBarMobile(false)}
                              className={`flex gap-2 items-center px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-xs ${
                                path.includes(col.link) ? "bg-white/15 font-medium" : ""
                              } text-white`}
                            >
                              <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center text-[9px] font-bold shrink-0">
                                {col.label.charAt(0)}
                              </div>
                              <span>{col.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* Logout */}
                <a
                  href="javascript:void(0)"
                  className="flex gap-3 items-center px-2 py-1.5 rounded-lg hover:bg-white/10 transition text-sm text-white mt-1"
                  onClick={CallLogout}
                >
                  <div className="w-4 h-4 shrink-0">
                    <IconLogout />
                  </div>
                  <span className="capitalize">Logout</span>
                </a>
              </nav>
            </SimpleBar>

            <div className="p-3 border-t border-white/10 shrink-0">
              <img
                src={datalocal?.imgProperty || datalocal?.image}
                className="w-full h-12 object-contain bg-white/30 rounded-lg"
                alt="property logo"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SidebarMobile;