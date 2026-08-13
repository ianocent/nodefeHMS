import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../components/common/paper/PaperBase";
import InputMain from "../../../components/common/input/InputMain";
import Seo from "../../../components/common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../context/LayoutContext";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import TableView from "../../common/table-edit";
interface AddviewProps {
  isview?: boolean;
}
const CompanyOthers = (props: AddviewProps) => {
  const { isview = false } = props;
  const GLOBALURI = "/cms/profile/company";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataform, setdataform] = useState([
    {
      name: "Others",
      data: [
        {
          label: "Commission Rate (%)",
          name: "commission_rate",
          type: "number",
          cols: "col-span-12",
          placeholder: "%",
        },
        {
          label: "Pay Commission",
          name: "is_pay_commission",
          type: "checkbox",
          cols: "col-span-12",
          options: [{ label: "Pay Commission", value: "is_pay_commission" }],
        },
        {
          label: "Charge Back",
          name: "is_charge_back",
          type: "checkbox",
          cols: "col-span-12",
          options: [{ label: "Charge Back", value: "is_charge_back" }],
        },
        {
          label: "Surcharge Opt-Out",
          name: "is_surcharge_opt_out",
          type: "checkbox",
          cols: "col-span-12",
          options: [
            { label: "Surcharge Opt-Out", value: "is_surcharge_opt_out" },
          ],
        },
        {
          label: "Interface Commission (%)",
          name: "based_online_commission",
          type: "number",
          cols: "col-span-12",
          placeholder: "%",
        },
        {
          label: "Comm Payable",
          name: "comm_payable",
          type: "checkbox",
          cols: "col-span-12",
        },
        {
          label: "Comm Code",
          name: "comm_code",
          type: "select",
          cols: "col-span-12",
          options: [
            { value: "code1", label: "Code 1" },
            { value: "code2", label: "Code 2" },
            // Additional codes as necessary
          ],
          disable: true,
          placeholder: "Choose Comm Code",
        },
        {
          label: "Remarks",
          name: "remarks",
          type: "textarea",
          cols: "col-span-12",
          placeholder: "Enter remarks here",
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  useEffect(() => {
    if (dataval.comm_payable) {
      let dataInput = [...dataform];
      dataInput[0].data[6].disable = false;
      setdataform([...dataInput]);
    } else {
      let dataInput = [...dataform];
      dataInput[0].data[6].disable = true;
      setdataform([...dataInput]);
    }

    if (datavaled.comm_payable) {
      let dataInput = [...dataform];
      dataInput[0].data[6].disable = false;
      setdataform([...dataInput]);
    }
  }, [dataval.comm_payable, datavaled.comm_payable]);

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select") {
      setData({ ...dataval, [name]: e.target.value });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
    }
  };
  const GetDetailUser = async (i: any) => {
    setuiddata(i);
    try {
      let getuuri = GLOBALURI + "/" + i + "/update";
      if (i == 0) {
        getuuri = GLOBALURI + "/create";
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

      setDataEd(datauser?.data);
      let dataInput = [...dataform];
      dataInput[0].data[2].options = datauser?.master?.code_posts;
      setdataform([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const OnSave = async () => {
    // console.log("widylog", dataval);
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const raw = JSON.stringify(dataval);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "?type=commission";
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        window.location.href
      );
      if (saveprocess?.code == "200") {
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };

  const [parent, setparent] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    setparent(idparent);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);

  return (
    <>
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        {/* <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold capitalize">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") +
                " " +
                GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div> */}

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-4 ">
              <fieldset className="border">
                <legend className="ml-2">Others</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select_multiple") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else if (row?.type == "textarea") {
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
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                            disabled: row?.disable,
                          }}
                          restSelect={{ disabled: row?.disable }}
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
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              router.replace({
                pathname: "/profile/company/main",
                query: { parent: parent },
              });
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />
          {isview ? (
            <></>
          ) : (
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyOthers;
