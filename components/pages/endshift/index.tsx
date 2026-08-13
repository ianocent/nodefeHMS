// end shift
import React, { useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import {
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  FetchData,
  Logout,
} from "../../../components/helper";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import ModalPinComponent from "../../common/modal/ModalPin";
import { setLogin } from "../../../redux/auth/authSlice";
import { useFormPermission } from "../../../hooks/useFormPermission";

const ListView = () => {
  const URL = "/cms/shift-confirmation";
  const groups = "";
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const router = useRouter();
  const { canUpdate, canCreate } = useFormPermission(1027);
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
      let uri = "/cms/shift-confirmation/confirmation";
      const urlData = GetQueryStr("data");
      if (urlData) uri += `?user_id=${urlData}`;

      const response = await FetchData(
        uri,
        "POST",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (response?.code == "200" && response?.status !== "error") {
        if (response?.is_self) {
          CallLogout();
        } else {
          response.imgProperty = response.image;
          response.NameProperty = response.name;
          dispatch(setLogin(GetEncrypt(JSON.stringify(response))));
        }
        setLoading(false);
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
    } catch (err) {
      console.error("Save error:", err);
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
  const RouteInit = () => (
    <>
      <div className="mt-2 min-w-full table-auto">
        <div className="flex justify-end px-4 gap-4">
          <ModalPinComponent label="Insert Pin" onCheck={onCheck} />
        </div>

        <TableView
          groups={groups}
          uri={URL}
          isEditTable={true}
          queryString={`&user_id=${GetQueryStr("data")}&is_open=${isOpen}`}
          isBtnAdd={false}
          isBtnDelete={false}
          // isBtnEdit={false}
          isBtnView={false}
        />
      </div>

      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
          {GetQueryStr("data") && (
            <ButtonSubmit
              onCreate={() => {
                setLoading(true);
                router.replace({ pathname: "/night-audit" });
              }}
              loading={loading}
              isprimary={false}
              label="Back to Audit"
            />
          )}
          <ButtonSubmit
            isBtnAdd={canCreate || canUpdate}
            onCreate={() => {
              setLoading(true);
              onSave();
            }}
            loading={loading}
            label="Submit"
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <Seo title="Management Shift Confirmation" />
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
            Unbalanced Types!
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
