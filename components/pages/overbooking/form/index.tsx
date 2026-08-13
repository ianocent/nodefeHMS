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
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const GLOBALURI = "/cms/allotment";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Active",
          name: "status",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },

        {
          label: "Start Date",
          name: "start_date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "End Date",
          name: "end_date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Company",
          name: "profiles",
          type: "select-multi",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          cols: "col-span-8",
          options: [{}],
          ismulti: false,
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    // console.log("widylog", b + "-" + name + "-" + e.target.name + "-");
    if (b == "text" || b == false || b == "number" || b == "textarea") {
      setData({ ...dataval, [e.target.name]: e.target.value });
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      setData({
        ...dataval,
        [name + "_ori"]: e,
        [name]: ismulti ? valarr : e?.value,
      });
    } else if (b == "checkbox") {
      if (ismulti) {
        if (e.target.checked == true) {
          setData({ ...dataval, [e.target.value]: e.target.checked });
        }
        let valarr = [];
        options?.map((row) => {
          if (dataval[row?.value]) {
            valarr.push(row?.value);
          }
        });
        setData({ ...dataval, [name]: valarr });
      } else {
        setData({ ...dataval, [name]: e.target.checked });
      }
    }
    // setError("");
  };
  const GetDetailUser = async (i: any) => {
    setuiddata(i);
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

      setData(datauser?.data);
      let dataInput = [...dataform];
      dataInput[0].data[3].options = datauser?.master?.comm_codes;

      setdataform([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const OnSave = async () => {
    console.log("widylog", dataval);
    try {
      let urisave = GLOBALURI;
      let mth = "POST";

      const raw = JSON.stringify(dataval);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }
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

  const [parent, setparent] = useState("0");
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

        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold uppercase">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") +
                " " +
                GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-12 ">
              <fieldset className="border">
                <legend className="ml-2">Detail</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any) => (
                    <div className={row?.cols}>
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
                          value: dataval[row?.name],
                          type: row?.type,
                          onChange: (e) => {
                            changeHandler(e, row?.type, row?.name);
                          },
                        }}
                        restArea={{
                          placeholder: row?.label,
                          name: row?.name,
                          value: dataval[row?.name],
                          onChange: (e) => {
                            changeHandler(e, row?.type, row?.name);
                          },
                        }}
                        onChangeSel={(e) => {
                          changeHandler(
                            e,
                            row?.type,
                            row?.name,
                            row?.ismulti,
                            row?.options
                          );
                        }}
                        valueSel={
                          row?.ismulti
                            ? dataval[row?.name + "_ori"]
                            : dataval[row?.name]
                        }
                        options={row?.options}
                        isMulti={row?.ismulti}
                        valuename={row?.name}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset className="border mt-4">
                <legend className="ml-2">Room</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  <div className="col-span-12">
                    <TableView
                      groups={""}
                      uri={"/cms/allotment/room"}
                      queryString={
                        "&allotment_id=" +
                        new URLSearchParams(window.location.search).get("data")
                      }
                      isEditTable={true}
                      isBtnAdd={false}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
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
