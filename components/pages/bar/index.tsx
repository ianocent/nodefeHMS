import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";

const ListView = () => {
  const GLOBALURI = "/cms/bar";
  const GLOBALURIA = "/cms/bar/minimum-rate";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [isMinRate, setMinRate] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("data");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    if (add) {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          <div>
            {isMinRate == "0" && (
              <TableView
                groups={groups}
                uri={GLOBALURI}
                isEditTable={true}
                btnCustome={() => (
                  <ButtonAddList
                    label="Minimum Rate"
                    title={""}
                    isBtnadd={true}
                    onAdd={() => {
                      setMinRate("1");
                    }}
                  />
                )}
              />
            )}
            {isMinRate == "1" && (
              <TableView
                groups={groups}
                uri={GLOBALURIA}
                isEditTable={true}
                btnCustome={() => (
                  <ButtonAddList
                    label="Bar"
                    title={""}
                    isBtnadd={true}
                    onAdd={() => {
                      setMinRate("0");
                    }}
                  />
                )}
              />
            )}
          </div>
        </div>
      );
    }
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
