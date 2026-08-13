import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-allocation";
import InputMain from "../../../components/common/input/InputMain";
import { useRouter } from "next/router";
import InvoiceView from "./view";
import {
  formatAmount,
  NumberClear,
  GetEncrypt,
  FetchData,
  GetDecrypt,
  GetQueryStr,
  formatAmountNoDecimals,
  IntlNumberFormat
} from "../../../components/helper";
import { useSelector } from "react-redux";
import ButtonAddList from "../../../components/common/button/ButtonAddList";
import { IconSpiner } from "../../../components/common/icon/CardIcon";


import { user } from "@nextui-org/theme";
import { useFormPermission } from "../../../hooks/useFormPermission";
const ListView = () => {
  const GLOBALURI = "/cms/allocation-accounting";
  const GLOBALURISAVE = "/cms/allocation-accounting/store";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDoc, setSearchDoc] = useState('');
  const [dataval, setData] =  useState<any>({});
  const [dataAllocation, setDataAllocation] = useState([]);
  const { canCreate, canUpdate } = useFormPermission(1045); 
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataform, setdataform] = useState([
    {
      name: "Filter",
      data: [
        {
          label: "Company",
          name: "company",
          type: "autocomplete",
          cols: "col-span-6",
          options: [{}],
          uriaotucom: "/cms/allocation-accounting/get-doc",
        },
        {
          label: "Balance",
          name: "balance",
          type: "number",
          cols: "col-span-6",
          disable: true,
          options: [{}],
        },
        {
          label: "All Transactions",
          name: "all_transactions",
          type: "checkbox",
          cols: "col-span-3",
          options: [{}],
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
  

  useEffect(() => {
    let sum: number = 0;
    dataAllocation.map((row: any) => {
      console.log('formatAmountNoDecimals',parseFloat(NumberClear(row?.allocated_amount + "")));
      sum += parseFloat(NumberClear(row?.allocated_amount + ""));
    });
    let sumFormat = IntlNumberFormat(sum);
    setData({ ...dataval, balance: sumFormat });

  }, [dataAllocation]);

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

  const FinalPOstDat = () => {
    var objpost: any = {};
    var data: any = {};
    console.log('dataAllocation',dataAllocation);
    dataAllocation.map((rw, i) => {
      objpost[i] = rw;
      objpost[i]['allocated_amount'] = parseFloat(NumberClear(rw?.allocated_amount +""));
      return rw;
    });
    data.data = objpost;
    return data;
  };

  const OnSave = async () => {
    try {
      setloading(true);
      let urisave = GLOBALURISAVE;
      let mth = "POST";

      const raw = JSON.stringify(FinalPOstDat());
      
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        router.push({
          pathname: window.location.pathname,
          query: { parent: GetQueryStr("parent") },
        });
      } else {
        setloading(false);
      }
      setData({ ...dataval, ['balance']: 0 });
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };

  function RouteInit() {

  

    if (add == "1") {
      return "";
    } else if (view == "1") {
      return <InvoiceView />;
    } else {
      return (
        <>
        
        <fieldset className="border p-2">
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
                    } else if (row?.type == "number") {
                      types = 'text';
                      typesmain = "base";
                    }else {
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
                            value: dataval[row?.name],
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: dataval[row?.name],
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          valueSel={dataval[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* button submit */}
                <ButtonAddList
                  label="Submit"
                  title=""
                  isBtnadd={canCreate}
                  onAdd={() => {
                    OnSave();
                  }}
                />
              </fieldset>
      <div className="mt-2 min-w-full table-auto">
        {loading ? (
           <>
           <div className="mt-8 flex justify-center">
             <IconSpiner />
            </div>
          </>
        ) : (
          <TableView
            groups={groups}
            queryString={"&search=" + searchTerm + "&doc=" + searchDoc + "&isall=" + dataval.all_transactions}
            uri={GLOBALURI}
            isEditTable={true}
            isBtnAdd={true}
            onDataval={(e: any) => {
              setDataAllocation(Object.values(e));
              console.log('dataAllocation',e);
              
            }}
          />
        )}
      
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
