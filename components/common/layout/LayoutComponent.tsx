import React, { ReactNode, useEffect, useState, useContext } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import LayoutProvider, { LayoutContext } from "../../../context/LayoutContext";
import LoginPage from "./components/login/login";
import SidebarMobile from "./components/sidebar/SidebarMobile";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import LoadInPage from "../loader/LoadInpage";

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
  const [Token, SetToken] = useState<any>(dataAuth);
  const [menuact, setmenuAct] = useState(true);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : false;
  const routers = useRouter();

  const router = useRouter();
  const path = router.pathname;
  useEffect(() => {
    SetToken(dataAuth);
    setmenuAct(localStorage.getItem("menu") == "0" ? false : true);
    // console.log("wdy temp", GetQueryParam(0));
    if (GetQueryParam(0) != "reservation" && isLogin) {
      ReleaseSaveRsv();
    }
  }, []);
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
      {Token ? (
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
                  path != "/choose-property"
                    ? (!menuact ? "!ps-[50px]" : "content") +
                      " !mt-[70px] !mb-[10px] pr-2 pb-16"
                    : "mt-20 pr-4 ps-4 lg:ps-16 pb-16"
                }
              >
                <Suspense fallback={<LoadInPage />}>{children}</Suspense>
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
