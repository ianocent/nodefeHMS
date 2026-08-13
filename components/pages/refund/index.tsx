import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import InputMain from "../../../components/common/input/InputMain";
import { useRouter } from "next/router";
import InvoiceView from "./view";
const ListView = () => {
  const GLOBALURI = "/cms/accounting/refund";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDoc, setSearchDoc] = useState('');
  const [dataval, setData] = useState({});
  const [datavaled, setDataLedger] = useState({});
  const router = useRouter();
  const [dataform, setdataform] = useState([
    {
      name: "Filter",
      data: [
        {
          label: "Company",
          name: "company",
          type: "autocomplete",
          cols: "col-span-12",
          options: [{}],
          uriaotucom: "/cms/accounting/get/refund",
        },
      ],
    },
  ]);
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
  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      setData({ ...dataval, [name]: e });
    } else if (type === "autocomplete") {
      setData({ ...dataval, [name]: e });
      setSearchDoc(e.value);
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else if (type === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set preview state
        setData({ ...dataval, [name]: reader.result as string });
      };
      reader.readAsDataURL(e);
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
      setSearchTerm( e.target.value);
    }
    router.replace({
      pathname: window.location.pathname,
      query: { parent: parentid ,time: new Date().getTime()},
    });
  };
  function RouteInit() {

  

    if (add == "1") {
      return "";
    } else if (view == "1") {
      return <InvoiceView />;
    } else {
      return (
        <>
        
        <fieldset className="border P-2 hidden">
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else {
                      types = row?.type;
                      typesmain = "base";
                    }
                    return (
                      <div className={row?.cols}>
                        <InputMain
                          valuename={row?.name}
                          typeInput={typesmain}
                          error={false}
                          label={row?.label}
                          required={false}
                          options={row?.options}
                          uriAutoComp={row?.uriaotucom}
                          rest={{
                            name: row?.name,
                            disabled: row?.disable,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
      <div className="mt-2 min-w-full table-auto">
          <TableView
            groups={groups}
            queryString={"&search=" + searchTerm + "&doc=" + searchDoc}
            uri={GLOBALURI}
            isEditTable={true}
            isBtnAdd={true}
          />
        </div>
        </>
   
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
