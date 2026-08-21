import ButtonAddList from "../../../common/button/ButtonAddList";
import PaperBase from "../../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../common/seo";
import TableView from "../../../common/table-edit";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import router from "next/router";
import TabMenuIcon from "../../../common/tabIcon/tab";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { GetQueryStr, FetchData, GetDecrypt } from "../../../helper";
import { useFormPermission } from "../../../../hooks/useFormPermission";

const ListView = () => {
  const GLOBALURI = "/cms/reservation/code-item";
  const GLOBALURIA = "/cms/code-item";
  const GLOBALURIB = "/cms/reservation/inclusive";
  const GLOBALURIC = "/cms/reservation/masterInclusive";
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [actpop, setactpop] = useState("0");
  const [popup, setpopup] = useState(false);
  const [subfolio, setsubfolio] = useState<any>([]);
  const [idSubfolio, setidSubfolio] = useState("");
  const [isISCancel, setIsCancel] = useState(false);
  const { canCreate, canUpdate } = useFormPermission(62);  
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
      let getuuri = '/cms/reservation' + "/" + GetQueryStr("data") + "/update";
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
  function RouteInit() {
    return (
      <>
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
                      uri={actpop == "inclusive" ? GLOBALURIC : GLOBALURIA}
                      uriSave={actpop == "inclusive" ? GLOBALURIB : GLOBALURI}
                      isEditTable={true}
                      queryString={
                        "folio_id=" +
                        new URLSearchParams(window.location.search).get(
                          "data"
                        ) +
                        "&subfolio_id=" +
                        idSubfolio
                      }
                      isTitle={true}
                      isBtnAdd={false}
                      isBtnEdit={false}
                      checked={true}
                      onClosePopUp={() => {
                        setpopup(false);
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

          {!popup ? (
            <>
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
                  value={idSubfolio}
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
              <fieldset className="mt-2">
                <legend>Additional Item</legend>
                <div className=" justify-end flex w-full">
                  {!isISCancel ? (
                  <ButtonSubmit
                    onCreate={() => {
                      // setloading(true);
                      //  OnSave();
                      setpopup(true);
                      setactpop("additional");
                      router.replace({
                        pathname: window.location.pathname,
                        query: {
                          parent: new URLSearchParams(
                            window.location.search
                          ).get("parent"),
                          data: new URLSearchParams(window.location.search).get(
                            "data"
                          ),
                          sub_data: idSubfolio,
                          popup: popup ? "1" : "2",
                        },
                      });
                    }}
                    loading={false}
                    label="Add"
                    isBtnAdd={canCreate || canUpdate}
                  />
                  ) : (
                    <></>
                  )}
                </div>
                <TableView
                  groups={groups}
                  uri={GLOBALURI}
                  isEditTable={true}
                  queryString={
                    "&folio_id=" +
                    new URLSearchParams(window.location.search).get("data") +
                    "&subfolio_id=" +
                    idSubfolio
                  }
                  // isTitle={true}
                  isTitle={false}
                  // isBtnAdd={isISCancel ? false : true}
                  isBtnAdd={false}
                  isDeleted={isISCancel ? false : true}
                  isBtnEdit={isISCancel ? false : true}
                />
              </fieldset>
              <fieldset>
                <legend>Inclusive</legend>
                <TableView
                  groups={groups}
                  uri={GLOBALURIB}
                  isEditTable={true}
                  queryString={
                    "&folio_id=" +
                    new URLSearchParams(window.location.search).get("data") +
                    "&subfolio_id=" +
                    idSubfolio
                  }
                  isTitle={true}
                  isBtnAdd={false}
                  isDeleted={true}
                />
              </fieldset>
            </>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      <TabMenuIcon actMenu={""} id={GetQueryStr("data")} foliodat={""} isTabIcon={false} />

      {RouteInit()}
    </>
  );
};

export default ListView;
