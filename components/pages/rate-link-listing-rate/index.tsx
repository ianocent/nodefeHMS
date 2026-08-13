import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import router from "next/router";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt } from "../../helper";
import { useFormPermission } from "../../../hooks/useFormPermission";

const ListView = () => {
  const GLOBALURI = "/cms/rate/rate-link-listing";
  const ApplyURI = "/cms/rate/rate-link-listing/apply";
  const GLOBALURIA = "/cms/rate";

  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [popup, setpopup] = useState(false);
  const [isApply, setisApply] = useState(false);
  const { canCreate, canUpdate } = useFormPermission(86);
  const [loading, setloading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const onSaveApply = async () => {
    try {
      let urisave =
        ApplyURI +
        "?rate_id=" +
        new URLSearchParams(window.location.search).get("data");
      let mth = "POST";
      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        router.replace({
          pathname: window.location.pathname,
          query: {
            parent: new URLSearchParams(window.location.search).get("parent"),
            data: new URLSearchParams(window.location.search).get("data"),
            popup: popup ? "1" : "2",
          },
        });
        setisApply(false);
      } else {
        setisApply(false);
        setloading(false);
      }
    } catch (error) {
      setisApply(false);
      setloading(false);

      console.log("erro", error);
    }
  };

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
        {popup ? (
          <>
            <div className="relative ">
              <div className="absolute w-full z-20">
                <div
                  className=" flex 
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
                      isEditTable={false}
                      queryString={
                        "rate_id=" +
                        new URLSearchParams(window.location.search).get("data")
                      }
                      isTitle={false}
                      isBtnAdd={false}
                      checked={true}
                      checkedRadio={true}
                      onClosePopUp={() => {
                        setpopup(false);
                      }}
                      actionCol={false}
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
        <fieldset className="border">
          <legend className="ml-2">Rate Link Setup</legend>
          <div className="h-fit gap-4 pl-2 pr-2 mb-4 mt-4  min-w-full table-auto">
            {/* <!-- Overlay popup--> */}

            <div className="pl-2 pr-2 justify-end flex w-full gap-2">
              <ButtonSubmit
                onCreate={() => {
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
                      popup: popup ? "1" : "2",
                    },
                  });
                }}
                ClassPrimary="border p-2 rounded-md text-white font-bold cursor-pointer bg-primary"
                isprimary={true}
                loading={loading}
                label="Add"
                isBtnAdd={canCreate || canUpdate}
              />
              <ButtonSubmit
                isBtnAdd={canCreate || canUpdate}
                onCreate={() => {
                  setloading(true);
                  setisApply(true);
                  onSaveApply();
                }}
                ClassPrimary="border p-2 rounded-md text-white font-bold cursor-pointer bg-success"
                isprimary={true}
                label="Apply"
                loading={loading}
              />
            </div>
            {!popup && !isApply ? (
              <TableView
                groups={groups}
                uri={GLOBALURI}
                isEditTable={true}
                queryString={
                  "&rate_id=" +
                  new URLSearchParams(window.location.search).get("data")
                }
                isTitle={false}
                isBtnAdd={false}
                isDeleted={false}
              />
            ) : (
              <></>
            )}
          </div>
        </fieldset>
        <fieldset className="border">
          <legend className="ml-2">Rate Link Applied</legend>
          <div className="h-fit gap-4 pl-2 pr-2 mb-4 mt-4  min-w-full table-auto">
            {!popup && !isApply ? (
              <TableView
                groups={groups}
                uri={ApplyURI}
                isEditTable={false}
                queryString={
                  "&rate_id=" +
                  new URLSearchParams(window.location.search).get("data")
                }
                isTitle={false}
                isBtnAdd={false}
                isDeleted={false}
              />
            ) : (
              <></>
            )}
          </div>
        </fieldset>
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

      {RouteInit()}
    </>
  );
};

export default ListView;
