import React, { useEffect, useState } from "react";
import {
  FetchData,
  GetDecrypt,
  GetQueryParam,
  GetQueryStr,
} from "../../helper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
interface tabsProps {
  active: string;
  idparent: any;
  ischildren?: any;
  isreservation?: boolean;
}
const Tabs = (props: tabsProps) => {
  const { active, idparent, ischildren = 1, isreservation = false } = props;
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [datatable, setdatatable] = useState<any>({});
  const [childs, setchilds] = useState<any>([]);
  const [indexactive, setindex] = useState<number>(-1);
  const [uiddata, setiddata] = useState<string>("0");
  const [showMenu, setshowMenuu] = useState(false);
  const [place, setplace] = useState<string>("0");
  const [isReservation, setisreservation] = useState(false);
  const [view, setview] = useState("0");

  const routers = useRouter();
  const getDataTab = async () => {
    // console.log("masuk aja");
    const urlParams = new URLSearchParams(window.location.search);
    const iddata = urlParams.get("data");
    const path = window.location.pathname;
    const getParent = urlParams.get("parent");
    try {
      const datajson = await FetchData(
        "/cms/menu/get-parent-by-id-children/" +
          GetQueryStr("parent") +
          "?ischildren=" +
          ischildren +
          "&path=" +
          path,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        "",
        ""
      );
      var palcedat = "0";

      if (datajson?.code == "200") {
        setdatatable(datajson);

        datajson?.data?.map((row: any, index: number) => {
          //console.log(row?.alias_url + "==" + window.location.pathname);
          if (row?.alias_url == window.location.pathname) {
            // console.log(row?.alias_url + "==" + window.location.pathname);
            // console.log(row);
            setchilds(row?.relation?.children);
          }

          if (getParent == row?.id) {
            palcedat = row?.place;
          }
          row?.relation?.children?.map((col: any, i: number) => {
            // console.log(col?.alias_url + "=child=" + window.location.pathname);
            if (col?.alias_url == window.location.pathname) {
              setchilds(row?.relation?.children);
            }
          });
        });

        if (palcedat == "table") {
          setshowMenuu(true);
        } else if (palcedat == "form") {
          if (iddata != null) {
            setshowMenuu(true);
          } else {
            // console.log("debug->>", palcedat);
            setshowMenuu(false);
          }
        }

        let Lastpath = window.location.pathname.split("/").pop();
        const num = 48;
        if (getParent == num.toString()) {
          if (iddata === null) {
            setshowMenuu(false);
          } else {
            setshowMenuu(true);
          }
        }

        if (Lastpath == "fit" || Lastpath == "git" || Lastpath == "vr") {
          setisreservation(true);
        } else {
          setisreservation(false);
        }
      } else {
      }
      return;
    } catch (error) {
      // console.log("sss", error);
      return;
    }
  };

  // console.log(showMenu, "<< cek show menu");

  useEffect(() => {
    //console.log("WEWEWE");
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view");
    setview(view);
    getDataTab();
  }, [window.location.search, window.location.pathname]);

  return (
    <>
      {childs?.length > 0 && showMenu && !isReservation && view != "1" ? (
        <div className="mt-2 grid grid-flow-col auto-cols-max mb-2 overflow-x-auto min-w-full rounded-lg">
          {childs?.map((row: any, index: number) => (
            <div
              onClick={() => {
                if (row?.place == "form") {
                  if (new URLSearchParams(window.location.search).get("data")) {
                    let parameter = {};
                    row?.url.split("?").map((item: any, index: number) => {
                      if (index == 0) {
                      } else {
                        item.split("&").map((item: any) => {
                          parameter = {
                            ...parameter,
                            [item.split("=")[0]]: item.split("=")[1],
                          };
                        });
                      }
                    });
                    if (
                      new URLSearchParams(window.location.search).get("data")
                    ) {
                      parameter = {
                        ...parameter,
                        data: new URLSearchParams(window.location.search).get(
                          "data"
                        ),
                      };
                    }
                    if (GetQueryParam(0) == "module") {
                      window.location.assign(row?.url);
                    } else {
                      routers.replace({
                        pathname: row?.url.split("?")[0],
                        query: parameter,
                      });
                    }
                  }
                } else {
                  let parameter = {};
                  row?.url.split("?").map((item: any, index: number) => {
                    if (index == 0) {
                    } else {
                      item.split("&").map((item: any) => {
                        parameter = {
                          ...parameter,
                          [item.split("=")[0]]: item.split("=")[1],
                        };
                      });
                    }
                  });

                  if (new URLSearchParams(window.location.search).get("data")) {
                    parameter = {
                      ...parameter,
                      data: new URLSearchParams(window.location.search).get(
                        "data"
                      ),
                    };
                  }
                  if (GetQueryParam(0) == "module") {
                    window.location.assign(row?.url);
                  } else {
                    routers.replace({
                      pathname: row?.url.split("?")[0],
                      query: parameter,
                    });
                  }
                }

                setindex(row?.parent_id);
              }}
              className={
                row?.alias_url != window.location.pathname
                  ? " flex gap-2 px-2 py-2 mr-2 rounded-lg cursor-pointer bg-[#E0E7FF] font-bold"
                  : " flex gap-2 px-2 py-2 mr-2 rounded-lg bg-[#242020] text-white font-bold"
              }
            >
              {/* <div>
                <img src={row?.media?.image?.icon} />
              </div> */}
              <div>{row?.name?.en}</div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Tabs;
