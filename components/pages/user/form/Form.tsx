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
import { Value } from "sass";

const AddUsertView = () => {
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
  const [role, setrole] = useState<[]>([]);
  const [data, setData] = useState<any>({
    email: "",
    phone: "",
    roles: [],
    password: "",
    password2: "",
    name: "",
    username: "",
    isChangePassword: "0",
    statuses: [],
    companies: {},
    propertiess: [],
    pin_enshift: "",
  });
  const [passwordshow1, setpasswordshow1] = useState(false);
  const [passwordshow2, setpasswordshow2] = useState(false);
  const [errnewpass, seterrnewpass] = useState("");
  const [errconfirmpass, seterrconfirmpass] = useState("");
  const [idusr, setidusr] = useState("0");

  const {
    email,
    password,
    name,
    username,
    password2,
    phone,
    roles,
    isChangePassword,
    statuses,
    companies = {},
    propertiess,
    pin_enshift,
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
      let getuuri = "/cms/user/" + i + "/update";
      if (i == 0) {
        getuuri = "/cms/user/create";
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
        email: datauser?.data?.email,
        phone: datauser?.data?.phone,
        roles: datauser?.data?.roles,
        password: "",
        password2: "",
        name: datauser?.data?.name,
        username: datauser?.data?.username,
        isChangePassword: datauser?.permission?.change_password,
        statuses: datauser?.data?.status,
        companies: datauser?.data?.relation?.companies,
        propertiess: datauser?.data?.properties,
        pin_enshift: datauser?.data?.pin_enshift,
      };
      // console.log("data", datauser?.data?.properties);
      setData(dataobj);
      setdataoption(datauser);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const OnSave = async () => {
    // try {
    let urisave = "/cms/user";
    let mth = "POST";
    let rolear = [];
    // roles.forEach((element: any) => {
    //   rolear.push(element?.value);
    // });
    let propertyar = [];
    if (idusr != "0") {
      propertiess.forEach((element: any) => {
        propertyar.push(element?.value);
      });
    }

    let valid = false;
    if (errconfirmpass == "" && errnewpass == "") {
      valid = true;
    }
    console.log("valid", valid);
    if (valid) {
      const raw = JSON.stringify({
        role_id: roles?.value,
        property_ids: propertyar,
        company_id: companies?.value,
        name: name,
        username: username,
        email: email,
        phone: phone,
        password: password,
        status: statuses?.value,
        pin_enshift: pin_enshift,
      });
      if (idusr != "0") {
        urisave = "/cms/user/" + idusr;
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
        "/user"
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        router.replace({ pathname: "/user", query: { parent: 1116 } });
      } else {
        setloading(false);
      }
    } else {
      setloading;
      seterrnewpass("Please check your password");
    }
    // } catch (error) {
    //   console.log("erro", error);
    //   setloading(false);
    // }
  };
  const validatePassword = () => {
    let num = 0;
    if (password.length >= 7) {
      num = num + 1;
      // console.log("7");
    }
    if (password.length < 14) {
      // console.log("14");
      num = num + 1;
    }
    if (/[A-Z]/.test(password)) {
      // console.log("A");
      num = num + 1;
    }

    if (/[a-z]/.test(password)) {
      // console.log("a");
      num = num + 1;
    }

    if (/[0-9]/.test(password)) {
      // console.log("9");
      num = num + 1;
    }

    if (/[.*+@#?^${}()|[\]\\]/.test(password)) {
      // console.log("@");
      num = num + 1;
    }
    // console.log(num);
    if (num != 6) {
      seterrnewpass(
        "⁠Minimal 7 character, Maximal 14 character,  The password should contain a combination of letters, numbers, and symbols"
      );
    } else {
      seterrnewpass("");
    }
  };
  const confirmPassword = () => {
    if (password != password2) {
      seterrconfirmpass("Password doesn't match");
      //setdisablebtn(false);
    } else {
      seterrconfirmpass("");
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
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">
                {(idusr == "0" ? "Create" : "Edit") + " " + layout?.title}
              </h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>

          <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Name"}
                required={true}
                rest={{
                  name: "name",
                  placeholder: "Input Your Name",
                  value: name,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Username"}
                required={true}
                rest={{
                  name: "username",
                  placeholder: "Input Your Username",
                  value: username,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Email"}
                required={true}
                rest={{
                  name: "email",
                  placeholder: "Input Your Email",
                  value: email,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Phone"}
                required={true}
                rest={{
                  name: "phone",
                  placeholder: "Input Your Phone",
                  value: phone,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Role"}
                required={true}
                options={dataoption?.master?.roles}
                onChangeSel={(e) => {
                  changeHandler(e, true, "roles");
                }}
                restSelect={{}}
                valueSel={roles}
                isMulti={false}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Company"}
                required={true}
                options={dataoption?.master?.companies}
                onChangeSel={(e) => {
                  changeHandler(e, true, "companies");
                }}
                restSelect={{}}
                valueSel={companies}
                isMulti={false}
              />
            </div>
            {idusr != "0" ? (
              <>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Property"}
                    required={true}
                    options={dataoption?.master?.properties}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "propertiess");
                    }}
                    restSelect={{}}
                    valueSel={propertiess}
                    isMulti={true}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Pin End Shift"}
                required={false}
                rest={{
                  name: "pin_enshift",
                  placeholder: "Input Your Pin Enshift",
                  value: pin_enshift,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            {isChangePassword == "1" || !GetQueryParam(2) ? (
              <>
                <div className={"col-span-6"}>
                  <label className="font-bold capitalize text-[14px] leading-[19px]">
                    {"Password"}{" "}
                    <span className="text-red normal-case">* required</span>
                  </label>
                  <div className="mt-1 input-group">
                    <input
                      name="password"
                      type={passwordshow1 ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        changeHandler(e);
                      }}
                      onKeyUp={() => {
                        validatePassword();
                      }}
                      className="form-control form-control-lg !rounded-s-md"
                      id="signin-password"
                      placeholder="Password"
                    />
                    <button
                      onClick={() => setpasswordshow1(!passwordshow1)}
                      aria-label="button"
                      className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                      type="button"
                      id="button-addon2"
                    >
                      <i
                        className={`${
                          passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"
                        } align-middle`}
                      ></i>
                    </button>
                  </div>
                  <p className="text-xs text-danger">{errnewpass}</p>
                </div>
                <div className={"col-span-6"}>
                  <label className="font-bold capitalize text-[14px] leading-[19px]">
                    {"Re Password"}{" "}
                    <span className="text-red normal-case">* required</span>
                  </label>
                  <div className="mt-1 input-group">
                    <input
                      name="password2"
                      type={passwordshow2 ? "text" : "password"}
                      value={password2}
                      onChange={changeHandler}
                      onKeyUp={() => {
                        confirmPassword();
                      }}
                      className="form-control form-control-lg !rounded-s-md"
                      id="signin-password"
                      placeholder="Re Password"
                    />
                    <button
                      onClick={() => setpasswordshow2(!passwordshow2)}
                      aria-label="button"
                      className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                      type="button"
                      id="button-addon2"
                    >
                      <i
                        className={`${
                          passwordshow2 ? "ri-eye-line" : "ri-eye-off-line"
                        } align-middle`}
                      ></i>
                    </button>
                  </div>
                  <p className="text-xs text-danger">{errconfirmpass}</p>
                </div>
              </>
            ) : (
              <>{!GetQueryParam(2) ? <></> : <></>}</>
            )}

            <div className={"col-span-6"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Status"}
                required={true}
                options={dataoption?.master?.statuses}
                onChangeSel={(e) => {
                  changeHandler(e, true, "statuses");
                }}
                restSelect={{}}
                valueSel={statuses}
                isMulti={false}
              />
            </div>
          </div>
        </div>
        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                router.replace({
                  pathname: "/user",
                  query: { parent: 1116 },
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
    </>
  );
};

export default AddUsertView;
