import React, { useEffect, useState } from "react";
import AddPostViewModel from "../form/AddPostViewModel";
import ButtonAddInput from "../../../common/button/ButtonAddInput";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt } from "../../../helper";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";

const UserView = () => {
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

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [data, setData] = useState({
    email: "",
    phone: "",
    role: "",
    password: "",
    password2: "",
    name: "",
    username: "",
  });

  const { email, password, name, username, password2, phone, role } = data;
  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // setError("");
  };
  const GetDetailUser = async (i: any) => {
    try {
      const datauser = await FetchData(
        "/cms/user/" + i + "/update",
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      return datauser;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    const datausr: any = GetDetailUser(routers.query.id);
    setData(datausr);
    // alert(routers.query.id);
  }, []);
  return (
    <>
      <Seo title="Management View User" />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">View User</h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>

          <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-8 grid grid-cols-12 h-fit  gap-2">
              <div className={"col-span-12"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Name"}
                  required={false}
                  rest={{
                    disabled: true,
                    name: "name",
                    placeholder: "Input Your Name",
                    value: name,
                    type: "text",
                    onChange: (e) => {},
                  }}
                />
              </div>
              <div className={"col-span-12"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Username"}
                  required={false}
                  rest={{
                    disabled: true,
                    name: "username",
                    placeholder: "Input Your Username",
                    value: username,
                    type: "text",
                    onChange: (e) => {},
                  }}
                />
              </div>
              <div className={"col-span-12"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Email"}
                  required={false}
                  rest={{
                    disabled: true,
                    name: "email",
                    placeholder: "Input Your Email",
                    value: email,
                    type: "text",
                    onChange: (e) => {},
                  }}
                />
              </div>
              <div className={"col-span-12"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Phone"}
                  required={false}
                  rest={{
                    disabled: true,
                    name: "phone",
                    placeholder: "Input Your Email",
                    value: phone,
                    type: "number",
                    onChange: (e) => {},
                  }}
                />
              </div>
              <div className={"col-span-12"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  {"last"}{" "}
                </label>
              </div>
              <div className={"col-span-12"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  {"last"}{" "}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* <ButtonAddInput
          activeStep={0}
          next={nextStep}
          previous={previousStep}
          stepper={0}
        /> */}
        <ButtonSubmit isprimary={false} onCreate={() => {}} label="Cancel" />
      </PaperBase>
    </>
  );
};

export default UserView;
