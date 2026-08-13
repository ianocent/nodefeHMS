import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../components/common/paper/PaperBase";
import InputMain from "../../../components/common/input/InputMain";
import Seo from "../../../components/common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  GetCurrentDate
} from "../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../context/LayoutContext";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";

const AddView = () => {
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    name: "",
    email: "",
    contract_expired: "",
    join_date: GetCurrentDate(),
    permission_ids: [],
    code: "",
    status: [],
    no_tlp: "",
    expired: "",
    npwp: "",
    pic_name: "",
  });

  const [idusr, setidusr] = useState("0");

  const { code, name, permission_ids, status, no_tlp, expired, npwp, pic_name, ip , email, contract_expired , join_date} =
    data;
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
      let getuuri = "/cms/company/" + i + "/update";
      if (i == 0) {
        getuuri = "/cms/company/create";
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
        code: datauser?.data?.code,
        name: datauser?.data?.name,
        status: datauser?.data?.status,
        no_tlp: datauser?.data?.no_tlp,
        contract_expired: datauser?.data?.contract_expired,
        join_date: datauser?.data?.join_date,
        npwp: datauser?.data?.npwp,
        pic_name: datauser?.data?.pic_name,
        email: datauser?.data?.email,
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
      let urisave = "/cms/company";
      let mth = "POST";

      const raw = JSON.stringify({
        name: name,
        email: email,
        code: code,
        status: status?.value,
        no_tlp: no_tlp,
        contract_expired: expired,
        join_date: join_date,
        npwp: npwp,
        pic_name: pic_name,
      });

      if (idusr != "0") {
        urisave = "/cms/company/" + idusr;
      }
      if (idusr != "0") {
        urisave = "/cms/company/" + idusr;
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
        "/company"
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

  useEffect(() => {
    const idreq = GetQueryParam(2);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);

  return (
    <LayoutComponent>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">
                {(idusr == "0" ? "Create" : "Edit") + " " + layout?.title}
              </h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>

          <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-8 grid grid-cols-12 h-fit  gap-2">
              <div className={"col-span-12"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Name Company Member"}
                  required={true}
                  rest={{
                    name: "name",
                    placeholder: "Input Company Name",
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
                  label={"PIC Name"}
                  required={true}
                  rest={{
                    name: "pic_name",
                    placeholder: "Input PIC Name",
                    value: pic_name,
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
                  label={"Email"}
                  required={true}
                  rest={{
                    name: "email",
                    placeholder: "Input Email",
                    value: email,
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
                  label={"Expired Date"}
                  required={true}
                  rest={{
                    name: "contract_expired",
                    placeholder: "Input Expired Date",
                    value: contract_expired,
                    type: "date",
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
                  label={"Join Date"}
                  required={true}
                  rest={{
                    name: "join_date",
                    placeholder: "Input Join Date",
                    value: join_date,
                    type: "date",
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
                  label={"Phone"}
                  required={true}
                  rest={{
                    name: "no_tlp",
                    placeholder: "Input Your Phone",
                    value: no_tlp,
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
                  label={"NPWP"}
                  required={true}
                  rest={{
                    name: "npwp",
                    placeholder: "Input NPWP Name",
                    value: npwp,
                    type: "text",
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
        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                router.replace({
                  pathname: '/client',
                  query: { parent: 15 },
                });
              }}
              loading={loading}
              label="Cancel"
              isprimary={false}
            />
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          </div>
        </div>
      </PaperBase>
    </LayoutComponent>
  );
};

export default AddView;
