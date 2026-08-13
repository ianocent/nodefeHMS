import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import router from "next/router";
import { useFormPermission } from "../../../hooks/useFormPermission";

const ListView = () => {
  const GLOBALURI = "/cms/rate/company-applicable";
  const GLOBALURIA = "/cms/profile/company";

  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [popup, setpopup] = useState(false);
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
            <div className="relative">
              <div className="absolute w-full z-20">
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
                      isEditTable={false}
                      queryString={
                        "rate_id=" +
                        new URLSearchParams(window.location.search).get("data")
                      }
                      isTitle={false}
                      isBtnAdd={false}
                      isBtnView={false}
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
        <div className="mt-2 min-w-full table-auto">
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
              uri={GLOBALURI}
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
