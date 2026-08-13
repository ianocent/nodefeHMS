import ButtonAddList from "../../../common/button/ButtonAddList";
import PaperBase from "../../../common/paper/PaperBase";
import React, { useContext, useEffect, useRef, useState } from "react";
import Seo from "../../../common/seo";
import TableView from "../../../common/table-edit";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import router from "next/router";
import TabMenuIcon from "../../../common/tabIcon/tab";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import GuestAdd from "../../guest/form/index";
import { useFormPermission } from "../../../../hooks/useFormPermission";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
} from "../../../helper";

const ListView = () => {
  const GLOBALURI = "/cms/other-guest";
  const GLOBALURIA = "/cms/profile/guest";
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [popup, setpopup] = useState(false);
  const [useradd, setuseradd] = useState(false);
  const [actAuto, setactAuto] = useState("-1");
  const { canCreate, canUpdate } = useFormPermission(62);
  const [IsCancel, setIsCancel] = useState(false);
  const [subfolio, setsubfolio] = useState<any>([]);
  const [idSubfolio, setidSubfolio] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (subfolio.length > 0) {
      router.replace({
        pathname: window.location.pathname,
        query: {
          parent: new URLSearchParams(window.location.search).get("parent"),
          data: new URLSearchParams(window.location.search).get("data"),
          module: new URLSearchParams(window.location.search).get("module"),
          sub_data: subfolio[0].value,
        },
      });
    }
  }, [subfolio]);
  const GetDetailData = async (i: any) => {
    try {
      let getuuri = "/cms/reservation/subfolio/" + i;

      if (i == "0") {
        return;
      }

      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (datauser?.code == "200") {
        setsubfolio(datauser?.data);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetDataDetailFolio = async () => {
    try {
      let getuuri = "/cms/reservation" + "/" + GetQueryStr("data") + "/update";
      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data?.code == "200") {
        setIsCancel(data?.data?.is_cancel);
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    const isGIT = window.location.pathname.split("/")[2];
    GetDataDetailFolio();
    if (isGIT == "git") {
      GetDetailData(new URLSearchParams(window.location.search).get("data"));
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    return (
      <>
        {useradd && (
          <>
            <div className="overlay">
              <div
                ref={ref}
                className="w-[75%] overflow-auto relative h-[650px] rounded-lg bg-gray-200 z-20 top-2 xl:top-[110px] left-[20%]"
              >
                {/* <div className="mt-2 mr-4 absolute z-20 right-0">
                <ButtonSubmit
                  onCreate={() => {
                    setpopup(false);
                    setactAuto("-1");
                  }}
                  label="Close"
                />
              </div> */}
                <GuestAdd
                  isPopup={true}
                  nameinit={""}
                  ActionSv={
                    (id, fn, ln, ti, pn, em, gs) => {}
                    // ActSv(id, fn, ln, ti, pn, em, "guest", gs)
                  }
                />
              </div>
            </div>
          </>
        )}
        {popup ? (
          <>
            <div className="relative z-50">
              <div className="absolute w-full">
                <div
                  className="flex 
                    items-center justify-center
                   z-20 "
                >
                  <div
                    className="bg-white p-4 
                        rounded-lg shadow-lg "
                  >
                    <TableView
                      groups={groups}
                      uri={GLOBALURIA}
                      uriSave={GLOBALURI}
                      isEditTable={true}
                      queryString={
                        "folio_id=" +
                        new URLSearchParams(window.location.search).get(
                          "data"
                        ) +
                        "&subfolio_id=" +
                        new URLSearchParams(window.location.search).get(
                          "sub_data"
                        )
                      }
                      isTitle={false}
                      isBtnAdd={false}
                      checked={true}
                      onClosePopUp={() => {
                        setpopup(false);
                        router.replace({
                          pathname: window.location.pathname,
                          query: {
                            parent: new URLSearchParams(
                              window.location.search
                            ).get("parent"),
                            data: new URLSearchParams(
                              window.location.search
                            ).get("data"),
                            module: new URLSearchParams(
                              window.location.search
                            ).get("module"),
                            sub_data: idSubfolio,
                            popup: popup ? "1" : "2",
                          },
                        });
                      }}
                      isDeleted={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute h-screen w-full inset-0 
                    bg-gray-800 opacity-50 
                    z-10"
            ></div>
          </>
        ) : (
          <></>
        )}
        <div className="mt-2 min-w-full table-auto">
          {/* <!-- Overlay popup--> */}

          <div
            className={
              subfolio.length == 0
                ? " flex w-full justify-end "
                : " flex w-full justify-between items-center mb-2"
            }
          >
            {/* input select */}
            {subfolio.length > 0 ? (
              <select
                className="border border-gray-300 p-2 rounded-lg w-1/4"
                name="parent"
                onChange={(e) => {
                  setidSubfolio(e.target.value);
                  router.replace({
                    pathname: window.location.pathname,
                    query: {
                      parent: new URLSearchParams(window.location.search).get(
                        "parent"
                      ),
                      module: new URLSearchParams(window.location.search).get(
                        "module"
                      ),
                      sub_data: e.target.value,
                      data: new URLSearchParams(window.location.search).get(
                        "data"
                      ),
                    },
                  });
                }}
              >
                {subfolio.map((item: any, i: any) => (
                  <option value={item.value} key={i}>
                    {item.label}
                  </option>
                ))}
              </select>
            ) : (
              <></>
            )}

            {!IsCancel ? (
              <div className="flex gap-2">
                <ButtonSubmit
                  isBtnAdd={canCreate || canUpdate}
                  onCreate={() => {
                    // setloading(true);
                    //  OnSave();
                    setuseradd(true);
                  }}
                  loading={false}
                  label="New Guest"
                />
                <ButtonSubmit
                  isBtnAdd={canCreate || canUpdate}
                  onCreate={() => {
                    // setloading(true);
                    //  OnSave();
                    setpopup(true);
                    router.replace({
                      pathname: window.location.pathname,
                      query: {
                        parent: new URLSearchParams(window.location.search).get(
                          "parent"
                        ),
                        data: new URLSearchParams(window.location.search).get(
                          "data"
                        ),
                        module: new URLSearchParams(window.location.search).get(
                          "module"
                        ),
                        sub_data: new URLSearchParams(
                          window.location.search
                        ).get("sub_data"),
                        popup: popup ? "1" : "2",
                      },
                    });
                  }}
                  loading={false}
                  label="Add"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          {!popup ? (
            <TableView
              groups={groups}
              isBtnAdd={IsCancel ? false : true}
              isBtnEdit={IsCancel ? false : true}
              uri={GLOBALURI}
              isEditTable={true}
              queryString={
                "&folio_id=" +
                new URLSearchParams(window.location.search).get("data") +
                "&subfolio_id=" +
                new URLSearchParams(window.location.search).get("sub_data")
              }
              isTitle={false}
              isDeleted={true}
            />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
  useEffect(() => {
    const handleOutSideClick = (event) => {
      // console.log("coba,", event.target.className);
      if (event?.target?.className.length) {
        if (event?.target?.className?.split(" ")[0] == "close-btn") {
          setactAuto("-1");
          setuseradd(false);
        }
      }

      if (!ref.current?.contains(event.target)) {
        console.log("coba,", event.target.className);
        if (event?.target?.className.length) {
          if (
            event?.target?.className?.split(" ")[0] !=
              "Select2__input-container" &&
            event?.target?.className?.split(" ")[0] !=
              "Select2__value-container" &&
            event?.target?.className?.split(" ")[0] != "Select2__indicator" &&
            event?.target?.className?.split(" ")[0] != "Select2__placeholder"
          ) {
            setactAuto("-1");
            setuseradd(false);
          }
        }

        // setactAuto("-1");
        // setpopup(false);
        // setoverflow(true);
        // console.log("coba", event.target.className?.split(" ")[0]);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      <TabMenuIcon actMenu={""} id={GetQueryStr("data")} foliodat={""} />
      {RouteInit()}
    </>
  );
};

export default ListView;
