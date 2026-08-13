import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  NumberClear,
} from "../../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import { usePathname } from "next/navigation";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, nm, market, source) => void;
  nameinit?: string;
}
const AddView = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/email/email-group";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const pathname = usePathname();
  const [dataform, setdataform] = useState([
    {
      name: "Email Group",
      data: [
        {
          label: "Group Name",
          name: "group_name",
          type: "text",
          cols: "col-span-12",
        },
        {
          label: "Group List",
          name: "group_list",
          type: "select-multi",
          cols: "col-span-12",
          options: [{}],
          ismulti: true,
        },
      ],
    },
  ]);

  const GetDetailUser = async (i: any) => {
    // setuiddata(i);
    try {
      let getuuri = GLOBALURI + "/" + i + "/update";
      if (i == 0) {
        getuuri = GLOBALURI + "/create";
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

      setDataEd({
        ...datauser?.data,
        group_list: datauser?.data?.group_list?.slice(1),
      });

      let dataInput = [...dataform];
      dataInput[0].data[1].options = datauser?.master?.users;
      setdataform([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else if (type === "rich-editor") {
      setData({ ...dataval, [name]: e });
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
    }
  };

  const transformData = (data) => {
    const newData = { ...data };
    const propertiesToTransform = ["template_name"];

    propertiesToTransform.forEach((property) => {
      if (property == "credit_limit" && newData[property]) {
        newData[property] = NumberClear(newData[property]);
      } else if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const OnSave = async () => {
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const transformedData = transformData(dataval);

      const { no, ...dataToPost } = transformedData;

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }

      const raw = JSON.stringify(dataToPost);
      const aesraw = GetEncrypt(raw);
      var redirects = isPopup ? "" : `${pathname}?parent=83`;
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        redirects
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        ActionSv(
          saveprocess?.data?.id,
          saveprocess?.data?.name,
          [
            saveprocess?.data?.market_segment_1,
            saveprocess?.data?.market_segment_2,
            saveprocess?.data?.market_segment_3,
            saveprocess?.data?.market_segment_4,
          ],
          [saveprocess?.data?.source]
        );
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const [parent, setparent] = useState("0");
  const [idusr, setidusr] = useState("0");

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

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
            <div className="col-span-12 ">
              <fieldset className="border">
                <legend className="ml-2">Email Group</legend>
                {datavaled?.account && (
                  <div className="mt-4 ml-2 font-bold ">
                    {datavaled?.account}
                  </div>
                )}

                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-2 mr-2">
                  {dataform[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;
                    // test

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else if (row?.type == "rich-editor") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else {
                      types = row?.type;
                      typesmain = "base";
                    }
                    return (
                      <div className={row?.cols}>
                        <InputMain
                          valuename={row?.name}
                          typeInput={typesmain}
                          error={false}
                          label={row?.label}
                          required={false}
                          options={row?.options}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          onChangeRichEditor={(e) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                          }}
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={row?.ismulti}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          isPopup
            ? " w-full bg-white py-2 px-4 "
            : "fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30"
        }
      >
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
