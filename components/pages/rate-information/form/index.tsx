import React, { useContext, useEffect, useState } from "react";
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
import LayoutComponent from "../../../common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import { useFormPermission } from "../../../../hooks/useFormPermission";
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const GLOBALURI = "/cms/rate";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const [isapplyrate, setIsapplayrate] = useState(false);
  const [isrestriction, setisrestriction] = useState(false);
  const { canUpdate, canCreate } = useFormPermission(86);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavalsrc, setDatasrc] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataId, setDataId] = useState<number>(0);
  const [dataEffect, setDataEffect] = useState<number>(0);
  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Trem & Condition",
          name: "term_condition",
          type: "rich-editor",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Cancellation Policy",
          name: "cancellation_policy",
          type: "rich-editor",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Notes",
          name: "notes",
          type: "rich-editor",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
        },
      ],
    },
  ]);
  const [dataforma, setdataforma] = useState([
    {
      name: "main",
      data: [
        {
          label: "Date From",
          name: "start_date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Date To",
          name: "end_date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },

        {
          label: "Day",
          name: "days",
          type: "checkbox",
          cols: "col-span-6",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Type",
          name: "room_type",
          type: "checkbox",
          cols: "col-span-6",
          options: [{}],
          ismulti: true,
          isAll: false,
        },
        {
          label: "Fields",
          name: "fields",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
          isOneColumn: true,
        },
        {
          isgroup: true,
          group: [
            // {
            //   label: "Date From",
            //   name: "start_date",
            //   type: "date",
            //   cols: "col-span-4",
            //   options: [{}],
            //   ismulti: false,
            // },
          ],
          cols: "col-span-6",
          name: "text",
        },
      ],
    },
  ]);

  const [idusr, setidusr] = useState("0");

  const changeHandlerSrc = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      setDatasrc({ ...datavalsrc, [e.target.name]: e.target.value });
    } else if (b == "rich-editor") {
      setDatasrc({ ...datavalsrc, [name]: e });
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      setDatasrc({
        ...datavalsrc,
        [name + "_ori"]: e,
        [name]: ismulti ? valarr : e?.value,
      });
    } else if (b == "checkbox") {
      // console.log("datalog", e.target.value);
      if (ismulti) {
        setDatasrc({
          ...datavalsrc,
          [name + "_" + e.target.value]: e.target.checked,
        });
      } else {
        setDatasrc({ ...datavalsrc, [name]: e.target.checked });
      }
    }
    // setError("");
  };
  const GetDetailUser = async (i: any) => {
    //setuiddata(i);
    try {
      console.log(
        "logbody",
        GLOBALURI +
          "/" +
          new URLSearchParams(window.location.search).get("data")
      );
      let getuuri =
        GLOBALURI +
        "/" +
        new URLSearchParams(window.location.search).get("data");

      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      setDataEd(datauser?.data);
      setDataId(datauser?.data?.id);
      return;
    } catch (error) {
      console.log("datalog", error);
      return;
    }
  };

  const [parent, setparent] = useState("0");

  const onSave = async () => {
    setloading(true);
    console.log("datalog", dataval);
    try {
      let urisave = GLOBALURI + "/" + dataId;
      let mth = "PUT";
      const raw = JSON.stringify(datavalsrc);
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        window.location.href
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
  //testgit
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    // const body = urlParams.get("body");
    setData({ rate_id: idreq });
    // setDatasrc({ rate_id: idreq });
    setparent(idparent);

    if (dataEffect == 0) {
      GetDetailUser(0);
    }
    setDataEffect(1);

    if (idreq) {
      setidusr(idreq);
    } else {
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

        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold capitalize">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") +
                " " +
                GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-12 grid grid-cols-12 gap-2  ">
              <div className="col-span-12">
                <fieldset className="border">
                  <legend className="ml-2">Content</legend>
                  <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                    {dataform[0].data?.map((row: any) => (
                      <div
                        className={
                          row?.cols +
                          (row?.type == "checkbox"
                            ? " border  border-dashed !border-blue rounded-md p-2 "
                            : "")
                        }
                      >
                        <InputMain
                          typeInput={
                            row?.type == "text" ||
                            row?.type == "number" ||
                            row?.type == "date"
                              ? "base"
                              : row?.type
                          }
                          error={false}
                          required={true}
                          label={row?.label}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: datavalsrc[row?.name],
                            type: row?.type,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: datavaled[row?.name],
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          options={row?.options}
                          isMulti={row?.ismulti}
                          valMulti={datavalsrc[row?.name]}
                          valuename={row?.name}
                          colspan={row?.isOneColumn ? "col-span-12" : "0"}
                          onChangeRichEditor={(e) => {
                            changeHandlerSrc(
                              e,
                              row?.type,
                              row?.name,
                              row?.ismulti,
                              row?.options
                            );
                          }}
                          valueRichEditor={
                            datavalsrc[row?.name] ?? datavaled[row?.name]
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 mb-4 ml-2"></div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              window.location.assign(
                "/rate-management/bar?parent=" + parent + "&module=null"
              );
              // router.replace({
              //   pathname: window.location.pathname,
              //   query: { parent: parent },
              // });
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />
          <ButtonSubmit
            isBtnAdd={canCreate || canUpdate}
            label="Save Changes"
            loading={loading}
            onCreate={onSave}
          />
          {isview ? <></> : <></>}
        </div>
      </div>
    </>
  );
};

export default AddView;
