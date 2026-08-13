// end of day
import React, { useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import {
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  FetchData,
  Logout,
} from "../../helper";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import ModalPinComponent from "../../common/modal/ModalPin";
import { setLogin } from "../../../redux/auth/authSlice";

const ListView = () => {
  let URL = "/cms/shift/detail";
  const groups = "";
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const CallLogout = () => {
    Logout("", "POST", "", datalocal?.data?.access_token, router, dispatch);
  };

  const onSave = async () => {
    try {
      let urisave =
        "/cms/night-audit/post-audit?date=" + datalocal?.data?.bussinesDate;
      let mth = "POST";

      const response = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (response?.code == "200" && response?.status !== "error") {
        setLoading(false);
        localStorage.setItem("data", GetEncrypt(JSON.stringify(response)));
        dispatch(setLogin(GetEncrypt(JSON.stringify(response))));
        setTimeout(() => {
          router.push("/night-audit?parent=1027");
        }, 2000);
        return;
      }

      const rawMessage = response?.message || "An error occurred";
      const mainMsg =
        typeof rawMessage === "string"
          ? rawMessage.split("\n")[0].trim()
          : rawMessage;

      let details: string[] = [];
      if (Array.isArray(response?.details) && response.details.length > 0) {
        details = response.details.map((d: any) => String(d).trim());
      } else {
        const matches = rawMessage.match(/Type\s+[^\n\r]+/g);
        if (matches && matches.length > 0) {
          details = matches.map((m) => m.trim());
        }
      }

      setErrorMessage(mainMsg);
      setErrorDetails(details);
      setAlertOpen(true);
      setLoading(false);
    } catch (error) {
      console.error("Save error:", error);
      setErrorMessage("Unexpected error occurred.");
      setErrorDetails([]);
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const onCheck = async (e) => {
    try {
      let urisave = "/cms/check-value?key=pin_endshift&value=" + e;
      let mth = "GET";

      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setIsOpen(1);
        router.replace({
          pathname: window.location.pathname,
          query: {
            parent: new URLSearchParams(window.location.search).get("parent"),
            data: new URLSearchParams(window.location.search).get("data"),
            time: new Date().getTime(),
          },
        });
        setLoading(false);
      } else {
        setLoading(false);
        console.log("error", saveprocess);
      }
    } catch (error) {
      setLoading(false);
      console.log("erro", error);
    }
  };

  function RouteInit() {
    return (
      <>
        <div className="mt-2 min-w-full table-auto">
          <div className="flex justify-end px-4 gap-4 ">
            <ModalPinComponent
              label="Insert Pin"
              onCheck={(e: any) => {
                onCheck(e);
              }}
            />
          </div>

          <TableView
            groups={groups}
            uri={URL}
            isEditTable={true}
            isBtnAdd={false}
            isBtnDelete={false}
            isBtnView={false}
            queryString={
              "&user_id=" + GetQueryStr("data") + "&is_open=" + isOpen
            }
          />
        </div>

        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
            {GetQueryStr("data") && (
              <ButtonSubmit
                onCreate={() => {
                  setLoading(true);
                  router.replace({
                    pathname: "/night-audit",
                  });
                }}
                loading={loading}
                isprimary={false}
                label="Back to Audit"
              />
            )}
            <ButtonSubmit
              onCreate={() => {
                setLoading(true);
                onSave();
              }}
              loading={loading}
              label={"Submit"}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title={
          "Management " + URL.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {RouteInit()}

      {alertOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setAlertOpen(false)}
        >
          <div
            className="bg-[#292F46] text-white rounded-md p-6 w-[90%] max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="text-sm text-[#A8B0D3] font-semibold border-b border-white/20 pb-2 mb-3">
              Unbalanced Types
            </h5>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {errorDetails && errorDetails.length > 0 ? (
                errorDetails.map((item, i) => (
                  <div
                    key={i}
                    className="py-2 border-b border-white/10 last:border-none"
                  >
                    <h5 className="text-sm text-[#A8B0D3]">{item}</h5>
                  </div>
                ))
              ) : (
                <p className="italic text-gray-300">No details available</p>
              )}
            </div>

            <div className="flex justify-end mt-5">
              <button
                className="text-red font-semibold hover:underline"
                onClick={() => setAlertOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListView;
