import React, { useEffect, useState } from "react";
import AddPostViewModel from "../form/AddPostViewModel";
import ButtonAddInput from "../../../common/button/ButtonAddInput";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import { useRouter } from "next/router";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  isStringJSON,
} from "../../../helper";
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
  const [loading, setloading] = useState(false);
  const [idusr, setidusr] = useState("0");

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [data, setData] = useState<any>({});

  const GetDetailUser = async (i: any) => {
    try {
      const datauser = await FetchData(
        "/cms/approval/" + i + "",
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      setData(datauser);
      console.log("consoledata", datauser);
      console.log("consoledatastate", data);
      return datauser;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const onApproveReject = async (act: string) => {
    try {
      let urisave = "/cms/approval/" + idusr + "/" + act;
      let mth = "PATCH";

      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        routers,
        "/approval"
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

    // alert(routers.query.id);
  }, []);
  return (
    <>
      <Seo title="Management View User" />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">View Approve</h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>

          <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-12 grid grid-cols-12 h-fit  gap-2 mb-4">
              {data?.data &&
                Object.keys(data?.data).map((row: any, index: any) => {
                  var datas = data?.data;
                  if (datas[row] != null) {
                    return (
                      <>
                        <div className={"col-span-6"}>
                          <span className="border font-extrabold rounded-sm mr-4 ">
                            {GetCapitalFirst(row.replace("_", " "))}
                          </span>
                          {typeof datas[row] == "object" && datas[row] ? (
                            Object.keys(datas[row]).map((child) => {
                              var dataschild = datas[row];
                              return (
                                <>
                                  <div className="ml-4 ">
                                    <span className="border rounded-sm mr-4">
                                      {GetCapitalFirst(child.replace("_", " "))}
                                    </span>
                                    {isStringJSON(dataschild[child]) ? (
                                      Object.keys(
                                        JSON.parse(dataschild[child])
                                      ).map((childa) => {
                                        // console.log("3data", child);
                                        var dataschilda = JSON.parse(
                                          dataschild[child]
                                        );
                                        return (
                                          <>
                                            <div className="ml-8 ">
                                              <span className="border rounded-sm mr-4">
                                                {GetCapitalFirst(
                                                  childa.replace("_", " ")
                                                )}
                                              </span>
                                              <span>{dataschilda[childa]}</span>
                                            </div>
                                          </>
                                        );
                                      })
                                    ) : (
                                      <span>{dataschild[child]}</span>
                                    )}
                                  </div>
                                </>
                              );
                            })
                          ) : (
                            <span>{datas[row]} </span>
                          )}
                        </div>
                      </>
                    );
                  }
                })}
            </div>
          </div>
        </div>

        {/* <ButtonAddInput
          activeStep={0}
          next={nextStep}
          previous={previousStep}
          stepper={0}
        /> */}
        <div className="flex gap-4">
          <ButtonSubmit
            isprimary={false}
            onCreate={() => {
              router.push("/approval", {});
            }}
            label="Cancel"
          />
          <ButtonSubmit
            isprimary={true}
            onCreate={() => {
              onApproveReject("reject");
            }}
            loading={loading}
            label="Reject"
          />
          <ButtonSubmit
            isprimary={true}
            onCreate={() => {
              onApproveReject("approve");
            }}
            loading={loading}
            label="Approve"
          />
        </div>
      </PaperBase>
    </>
  );
};

export default UserView;
