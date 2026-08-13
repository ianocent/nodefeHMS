import React, { useContext, useEffect, useState } from "react";
import AddPostViewModel from "./AddPostViewModel";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";

const AddView = () => {
  const {
    activeLanguage,
    activeStep,
    input,
    language,
    setActiveLanguage,
    stepper,
    nextStep,
    previousStep,
    onChangeBasicInput,
    router,
  } = AddPostViewModel();
  const routers = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    name: "",
    permission_ids: [],
    code: "",
    status: [],
  });

  const [idusr, setidusr] = useState("0");

  const { code, name, permission_ids, status } = data;
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
      let getuuri = "/cms/permission/" + i + "/update";
      if (i == 0) {
        getuuri = "/cms/permission/create";
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
      let urisave = "/cms/permission";
      let mth = "POST";

      const raw = JSON.stringify({
        name: name,
        code: code,
        status: status?.value,
      });

      if (idusr != "0") {
        urisave = "/cms/permission/" + idusr;
      }
      if (idusr != "0") {
        urisave = "/cms/permission/" + idusr;
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        routers,
        "/permission"
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
    <>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="sm:grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">
                {(idusr == "0" ? "Create" : "Edit") + " " + layout?.title}
              </h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>

          <div className="sm:grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-8 sm:grid grid-cols-12 h-fit  gap-2">
              <div className={"col-span-12"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Permission Name"}
                  required={true}
                  rest={{
                    name: "name",
                    placeholder: "Input Permission Name",
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
                  label={"Permission Code"}
                  required={true}
                  rest={{
                    name: "code",
                    placeholder: "Input Permission Code",
                    value: code,
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
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          </div>
        </div>
      </PaperBase>
    </>
  );
};

export default AddView;
