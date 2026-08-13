import React, { useEffect, useState } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import Seo from "../../../common/seo";
import { useRouter } from "next/router";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetQueryParam,
  isStringJSON,
} from "../../../helper";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import LayoutComponent from "../../../common/layout/LayoutComponent";

const UserView = () => {
  const FOLDER = "code-billing";
  const routers = useRouter();
  const [loading, setloading] = useState(false);
  const [idusr, setidusr] = useState("0");

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [data, setData] = useState<any>({});

  const GetDetailUser = async (i: any) => {
    try {
      const datauser = await FetchData(
        "/cms/" + FOLDER + "/" + i + "",
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        routers,
        ""
      );
      setData(datauser);
      // console.log("consoledata", datauser);
      // console.log("consoledatastate", data);
      return datauser;
    } catch (error) {
      console.log(error);
      return;
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
    <LayoutComponent>
      <Seo title="Management View User" />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="sm:grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">View Data</h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>

          <div className="sm:grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-12 sm:grid grid-cols-12 h-fit  gap-2 mb-4">
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
              routers.push("/property", {});
            }}
            label="Cancel"
          />
        </div>
      </PaperBase>
    </LayoutComponent>
  );
};

export default UserView;
