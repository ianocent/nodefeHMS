import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const FOLDER = "code-post";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    name: "",
    room_type_grouping: [],
    pay_commission: "",
    status: [],
    country: [],
    expired: "",
    description: "",
    pic: "",
    ip: "",
    code_billing_id: [],
    code_gl_id: [],
    local_tax: "",
    local_tax_percentage: "",
    service_charge: "",
    service_charge_percentage: "",
    service_charge_include_local_tax: "",
    tax: "",
    tax_percentage: "",
    tax_include_local_tax: "",
  });

  const [idusr, setidusr] = useState("0");

  const {
    room_type_grouping,
    name,
    status,
    country,
    code_billing_id,
    description,
    code_gl_id,
    pay_commission,
    local_tax,
    local_tax_percentage,
    service_charge,
    service_charge_percentage,
    service_charge_include_local_tax,
    tax,
    tax_percentage,
    tax_include_local_tax,
  } = data;
  const changeHandler = (e: any, b?: boolean, name?: string) => {
    if (!b) {
      setData({ ...data, [e.target.name]: e.target.value });
    } else {
      setData({ ...data, [name]: e });
    }
    // setError("");
  };
  const GetDetailUser = async (i: any) => {
    try {
      let getuuri = "/cms/" + FOLDER + "/" + i + "";
      if (i == 0) {
        getuuri = "/cms/" + FOLDER + "/create";
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
      let dataobj = {
        name: datauser?.data?.name,
        status: datauser?.data?.status,
        local_tax: datauser?.data?.local_tax,
        local_tax_percentage: datauser?.data?.local_tax_percentage,
        code_billing_id: [
          {
            value: datauser?.data?.relation?.code_billing?.id,
            label: datauser?.data?.relation?.code_billing?.name,
          },
        ],
        description: datauser?.data?.description,
        code_gl_id: [
          {
            value: datauser?.data?.relation?.code_gl?.id,
            label: datauser?.data?.relation?.code_gl?.name,
          },
        ],
        pay_commission: datauser?.data?.pay_commission,
        service_charge: datauser?.data?.service_charge,
        service_charge_include_local_tax:
          datauser?.data?.service_charge_include_local_tax,
        tax: datauser?.data?.tax,
        tax_percentage: datauser?.data?.tax_percentage,
        tax_include_local_tax: datauser?.data?.tax_include_local_tax,
      };
      setData(dataobj);
      setdataoption(datauser);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const OnSave = async () => {
    try {
      let urisave = "/cms/" + FOLDER;
      let mth = "POST";

      const raw = JSON.stringify({
        code_billing_id: code_billing_id?.value,
        code_gl_id: code_gl_id?.value,
        pay_commission: pay_commission,
        local_tax: local_tax,
        local_tax_percentage: local_tax_percentage,
        service_charge: service_charge,
        service_charge_percentage: service_charge_percentage,
        service_charge_include_local_tax: service_charge_include_local_tax,
        tax: tax,
        tax_percentage: tax_percentage,
        tax_include_local_tax: tax_include_local_tax,
        name: name,
        room_type_grouping: room_type_grouping?.value,
        status: status?.value,
        country_id: country?.value,
        description: description,
      });

      if (idusr != "0") {
        urisave = "/cms/" + FOLDER + "/" + idusr + "";
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
        "/" + FOLDER
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

        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") + " Room"}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-8 grid grid-cols-12 h-fit  gap-2">
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Code Billing"}
                required={true}
                options={dataoption?.master?.code_billings}
                onChangeSel={(e) => {
                  changeHandler(e, true, "code_billing_id");
                }}
                restSelect={{}}
                valueSel={code_billing_id}
                isMulti={false}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Code GLS"}
                required={true}
                options={dataoption?.master?.code_gls}
                onChangeSel={(e) => {
                  changeHandler(e, true, "code_gl_id");
                }}
                restSelect={{}}
                valueSel={code_gl_id}
                isMulti={false}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Name "}
                required={true}
                rest={{
                  name: "name",
                  placeholder: "Input Name",
                  value: name,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Description"}
                required={true}
                rest={{
                  name: "description",
                  placeholder: "Input Description",
                  value: description,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Pay Commission "}
                required={true}
                rest={{
                  name: "pay_commission",
                  placeholder: "Input Pay Commission",
                  value: pay_commission,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Local Tax "}
                required={true}
                rest={{
                  name: "local_tax",
                  placeholder: "Input Local Tax ",
                  value: local_tax,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Local Tax Percentage "}
                required={true}
                rest={{
                  name: "local_tax_percentage",
                  placeholder: "Input Tax percentage",
                  value: local_tax_percentage,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Service Charge "}
                required={true}
                rest={{
                  name: "service_charge",
                  placeholder: "Input Service Charge",
                  value: service_charge,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Service Charge Percentage"}
                required={true}
                rest={{
                  name: "service_charge_percentage",
                  placeholder: "Input Service Charge Percentage",
                  value: service_charge_percentage,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Service Charge Include Local Tax"}
                required={true}
                rest={{
                  name: "service_charge_include_local_tax",
                  placeholder: "Input Service Charge Include Local Tax",
                  value: service_charge_include_local_tax,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Tax"}
                required={true}
                rest={{
                  name: "tax",
                  placeholder: "Input Tax",
                  value: tax,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Tax Percentage"}
                required={true}
                rest={{
                  name: "tax_percentage",
                  placeholder: "Input Tax Percentage",
                  value: tax_percentage,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Tax Include Local Tax"}
                required={true}
                rest={{
                  name: "tax_include_local_tax",
                  placeholder: "Input Tax Inc Local Tax",
                  value: tax_include_local_tax,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>

            <div className={"col-span-12"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Status"}
                required={true}
                options={dataoption?.master?.statuses}
                onChangeSel={(e) => {
                  changeHandler(e, true, "status");
                }}
                restSelect={{}}
                valueSel={status}
                isMulti={false}
              />
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
                pathname: window.location.pathname,
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

export default AddView;
