import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import Seo from "../../../../../components/common/seo";
import ButtonSubmit from "../../../button/ButtonSubmit";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setDatas, setPermissions, setRoles } from "../../../../../redux/auth/authSlice";
import { UseDispatch } from "react-redux";
import { mapPermissions } from "../../../../../redux/auth/permissionHelper";

import {
  FetchData,
  GetEncrypt,
  GetDecrypt,
  RouteChange,
  GetQueryParam,
} from "../../../../helper";
const LoginPage = () => {
  const { isLogin } = useSelector((state: any) => state?.auth);
  const dispatch = useDispatch();
  let navigate = useRouter();
  const [passwordshow1, setpasswordshow1] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setloading] = useState(false);
  const [isforgot, setforgot] = useState(false);
  const [forgotSucces, setForgotSucces] = useState(false);
  const [alert, setalert] = useState(false);
  const [msgalert, setmsgalert] = useState("");
  useEffect(() => {
    setReady(true);
    // console.log(macAddr);
  }, []);
  const [err, setError] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = data;
  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };
  const Login = async () => {
    setalert(false);
    setmsgalert("");
    const raw = JSON.stringify({
      email: email,
      password: password,
    });
    // console.log("debug", raw);
    var uripost = "/cms/login";
    if (isforgot) {
      uripost = "/cms/forget-password";
    }
    const aesraw = GetEncrypt(raw);
    const data = FetchData(uripost, "POST", aesraw, false, "", navigate, "");
    const datajson = await data;
    const parsed = datajson;
    const mapped = mapPermissions(parsed?.data?.permissions || []);
    dispatch(setPermissions(mapped));
    if (datajson?.code == "200") {
      if (isforgot) {
        setForgotSucces(true);
      } else {
        const mapped = mapPermissions(parsed?.data?.permissions || []);
        const rolesData = parsed?.data?.role || parsed?.data?.roles || [];
        const roleNames = Array.isArray(rolesData)
          ? rolesData.map((r: any) => r?.name || r?.label || String(r)).filter(Boolean)
          : typeof rolesData === "string" ? [rolesData] : [];

        dispatch(setLogin(GetEncrypt(JSON.stringify(parsed))));
        dispatch(setDatas(parsed?.data));
        dispatch(setPermissions(mapped));
        dispatch(setRoles(roleNames));

        setTimeout(() => {
          window.location.assign("/choose-property");
        }, 600);
      }
    } else {
      setloading(false);
    }
  };
  useEffect(() => {
    if (GetQueryParam(0) != "dashboard") {
      window.location.assign("/dashboard");
    }
  }, []);

  return (
    <Fragment>
      <Seo title={"Content Management System"} />
      {ready ? (
        <>
          <div className="container">
            <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
              <div className="grid grid-cols-12">
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
                  <div className="my-[2.5rem] flex justify-center">
                    <a href="/">
                      <img
                        src={"/Logo_login.svg"}
                        alt="logo"
                        className="desktop-logo"
                      />
                    </a>
                  </div>

                  <div className="box !p-[3rem]">
                    <div
                      className="box-body"
                      role="tabpanel"
                      id="pills-with-brand-color-01"
                      aria-labelledby="pills-with-brand-color-item-1"
                    >
                      <p className="h5 font-semibold mb-2 text-center">
                        {isforgot
                          ? forgotSucces
                            ? "Send Email"
                            : "Forgot Password"
                          : "Sign In"}
                      </p>

                      <div className="grid grid-cols-12 gap-y-4">
                        <div className="xl:col-span-12 col-span-12">
                          {forgotSucces ? (
                            <>
                              <p>
                                Check your inbox! We’ve sent an email to help
                                you reset your password.
                              </p>
                            </>
                          ) : (
                            <>
                              <label
                                htmlFor="signin-email"
                                className="form-label text-default"
                              >
                                {isforgot ? "Email" : "Username"}
                              </label>
                              <input
                                type="text"
                                name="email"
                                className="form-control form-control-lg w-full !rounded-md"
                                id="email"
                                onChange={changeHandler}
                                value={email}
                              />
                            </>
                          )}
                        </div>
                        {isforgot ? (
                          <></>
                        ) : (
                          <>
                            {" "}
                            <div className="xl:col-span-12 col-span-12 mb-2">
                              <label
                                htmlFor="signin-password"
                                className="form-label text-default block"
                              >
                                Password
                                {/* <Link href="#!" className="float-right text-danger">
                          Forget password ?
                        </Link> */}
                              </label>
                              <div className="input-group">
                                <input
                                  name="password"
                                  type={passwordshow1 ? "text" : "password"}
                                  value={password}
                                  onChange={changeHandler}
                                  className="form-control form-control-lg !rounded-s-md"
                                  id="signin-password"
                                  placeholder="password"
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      setloading(true);
                                      Login();
                                      return;
                                    }
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    setpasswordshow1(!passwordshow1)
                                  }
                                  aria-label="button"
                                  className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                                  type="button"
                                  id="button-addon2"
                                >
                                  <i
                                    className={`${
                                      passwordshow1
                                        ? "ri-eye-line"
                                        : "ri-eye-off-line"
                                    } align-middle`}
                                  ></i>
                                </button>
                              </div>
                              <div className="mt-2">
                                {/* <div className="form-check !ps-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="defaultCheck1"
                              />
                              <label
                                className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                                htmlFor="defaultCheck1"
                              >
                                Remember password ?
                              </label>
                            </div> */}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="xl:col-span-12 col-span-12 grid mt-2">
                          {!forgotSucces && (
                            <>
                              <ButtonSubmit
                                onCreate={() => {
                                  Login();
                                  setloading(true);
                                }}
                                loading={loading}
                                label={isforgot ? "Submit" : "Login"}
                                alert={alert}
                                msgalert={msgalert}
                              />
                            </>
                          )}

                          <span
                            onClick={() => {
                              if (isforgot) {
                                setforgot(false);
                                setForgotSucces(false);
                              } else {
                                setforgot(true);
                              }
                            }}
                            className="italic underline text-center mt-2 cursor-pointer"
                          >
                            {isforgot ? "Login" : "Forgot Password"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </Fragment>
  );
};

export default LoginPage;
