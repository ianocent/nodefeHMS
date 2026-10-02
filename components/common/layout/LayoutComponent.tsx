import React, { ReactNode, useEffect, useState, useContext, useRef } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import LayoutProvider, { LayoutContext } from "../../../context/LayoutContext";
import LoginPage from "./components/login/login";
import SidebarMobile from "./components/sidebar/SidebarMobile";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import LoadInPage from "../loader/LoadInpage";
import FadeIn from "../animation/FadeIn";

// import { useAppSelector } from "../../../store/store";
import { FetchData, GetDecrypt, GetEncrypt, GetQueryParam } from "../../helper";
import { useRouter } from "next/router";
import { IconMenu } from "../icon/SidebarIcon";

interface LayoutComponentProps {
  children: ReactNode;
}

const LayoutComponent = (props: LayoutComponentProps) => {
  const { children } = props;
  const { isLogin } = useSelector((state: any) => state?.auth);
  const layout = useContext(LayoutContext);
  const dataAuth: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : false;
  const [menuact, setmenuAct] = useState(true);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : false;
  const routers = useRouter();

  const router = useRouter();
  const path = router.pathname;

  // Login dispatch happens while the login form is still on screen, and the form
  // then redirects to /choose-property. Swapping to the app shell on the auth
  // flip alone renders the dashboard chrome for a frame (empty sidebar, then a
  // jump), so hold the login screen until the route actually changes. Adjusted
  // during render on purpose: an effect would run after the shell already flashed.
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const authedRef = useRef(!!dataAuth);
  if (!!dataAuth !== authedRef.current) {
    authedRef.current = !!dataAuth;
    if (dataAuth) setPendingRoute(path);
  }
  if (pendingRoute && pendingRoute !== path) setPendingRoute(null);
  const showShell = !!dataAuth && pendingRoute === null;

  // LayoutComponent now lives in _app.tsx, so it mounts ONCE per session instead
  // of once per route. Two consequences this file has to respect:
  //
  // 1. The auth gate must read the live redux value, not a snapshot taken at
  //    mount. A `useState(dataAuth)` + `useEffect(..., [])` pair would latch
  //    `false` forever when redux-persist rehydrates after this component mounts,
  //    which would strand the user on the login screen.
  // 2. ReleaseSaveRsv() used to fire on every page mount because every page
  //    re-mounted the layout. With a single mount it must key off the route so
  //    it still fires when navigating away from the reservation module.
  useEffect(() => {
    setmenuAct(localStorage.getItem("menu") == "0" ? false : true);
  }, []);

  useEffect(() => {
    const module = path.split("/").filter(Boolean)[0];
    if (module !== "reservation" && isLogin) {
      ReleaseSaveRsv();
    }
  }, [path, isLogin]);
  const ReleaseSaveRsv = async () => {
    // console.log("widylog", dataval);

    try {
      let urisave = "/cms/helper/release-last-user-folio";
      let mth = "POST";
      let datapost = {
        folio_id: "",
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
      } else {
      }
    } catch (error) {
      // console.log("erro", error);
    }
  };
  function btnApps() {
    return (
      <>
        <button
          className="hidden lg:block"
          onClick={() => {
            if (menuact) {
              setmenuAct(false);
              localStorage.setItem("menu", "0");
            } else {
              localStorage.setItem("menu", "1");
              setmenuAct(true);
            }
          }}
        >
          {" "}
          <IconMenu />
        </button>
      </>
    );
  }
  return (
  <>
    <LayoutProvider>
      {showShell ? (
        <>
          <SidebarMobile />

          {/* Hapus wrapper w-full luar yang redundant */}
          <div className="flex min-h-screen">
            <Sidebar hide={menuact} btnabs={btnApps()} />

            {/* Content area — flex-1 + min-w-0 biar ga overflow */}
            <div className="flex-1 min-w-0">
              <Header btnNav={btnApps()} hide={menuact} />
              <div
                className={
                  // Padding is animated (not `all`) so the content slides in step with
                  // the sidebar when moving between /choose-property and the app routes;
                  // the widths and margins snapped instantly and made the handover look
                  // jarring. 220ms matches the sidebar/header-box transition in globals.scss.
                  "transition-[padding] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] " +
                  (path != "/choose-property"
                    ? (!menuact ? "!ps-[50px]" : "content") +
                      " !mt-[70px] !mb-[10px] pr-2 pb-16"
                    : "mt-20 pr-4 ps-4 lg:ps-16 pb-16")
                }
              >
                {/*
                  Route transition is opacity-only on purpose. Any `transform`
                  (or filter/will-change) on this wrapper turns it into the
                  containing block for every `position: fixed` descendant, which
                  breaks the `fixed bottom-0` Cancel/Save bars and the `.overlay`
                  modals across the app. `fade-in` animates opacity only, so
                  those stay anchored to the viewport.
                */}
                <Suspense fallback={<LoadInPage />}>
                  <FadeIn key={path} type="fade-in">
                    {children}
                  </FadeIn>
                </Suspense>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoginPage />
      )}
    </LayoutProvider>
    <ToastContainer />
  </>
);
};

export default LayoutComponent;
