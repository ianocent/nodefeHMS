import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import router from "next/router";
import { useFormPermission } from "../../../hooks/useFormPermission";

const ListView = () => {
  const GLOBALURI = "/cms/code-item";
  const GLOBALURIA = "/cms/rate/code-item";

  const GLOBALURIc = "/cms/promotion";
  const GLOBALURIca = "/cms/rate/promotion";

  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [popup, setpopup] = useState(false);
  const [popupb, setpopupb] = useState(false);
  const { canCreate, canUpdate } = useFormPermission(86);

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
            <div className="relative z-50">
              <div className="absolute w-full">
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
                      uri={GLOBALURIc}
                      uriSave={GLOBALURIca}
                      isEditTable={false}
                      queryString={
                        "&rate_id=" +
                        new URLSearchParams(window.location.search).get("data")
                      }
                      isTitle={false}
                      isBtnAdd={false}
                      checked={true}
                      onClosePopUp={() => {
                        setpopup(false);
                      }}
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
        {popupb ? (
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
                      uri={GLOBALURI}
                      uriSave={GLOBALURIA}
                      isEditTable={false}
                      queryString={
                        "&rate_id=" +
                        new URLSearchParams(window.location.search).get("data")
                      }
                      isTitle={false}
                      isBtnAdd={false}
                      checked={true}
                      onClosePopUp={() => {
                        setpopupb(false);
                      }}
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

        <fieldset className="border mb-4">
          <legend className="">Rate Promotion Type</legend>
          <div className="min-w-full table-auto ">
            {/* <!-- Overlay popup--> */}

            <div className=" justify-end flex w-full">
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
                      popup: popup ? "1" : "2",
                    },
                  });
                }}
                loading={false}
                label="Add"
              />
            </div>
            {!popup ? (
              <TableView
                groups={groups}
                uri={GLOBALURIca}
                isEditTable={false}
                queryString={
                  "&rate_id=" +
                  new URLSearchParams(window.location.search).get("data")
                }
                isTitle={false}
                isBtnAdd={false}
                isDeleted={true}
              />
            ) : (
              <></>
            )}
          </div>
        </fieldset>
        <fieldset className="border mb-4">
          <legend className="">Additional Item To Sell</legend>
          <div className="mt-2 min-w-full table-auto ">
            {/* <!-- Overlay popup--> */}

            <div className=" justify-end flex w-full">
              <ButtonSubmit
                isBtnAdd={canCreate || canUpdate}
                onCreate={() => {
                  // setloading(true);
                  //  OnSave();
                  setpopupb(true);
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
                loading={false}
                label="Add"
              />
            </div>
            {!popupb ? (
              <TableView
                groups={groups}
                uri={GLOBALURIA}
                isEditTable={true}
                queryString={
                  "&rate_id=" +
                  new URLSearchParams(window.location.search).get("data")
                }
                isTitle={false}
                isBtnAdd={false}
                isDeleted={true}
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
