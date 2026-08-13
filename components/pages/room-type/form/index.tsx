import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import {
  FetchData,
  formatAmount,
  GetCurrentDate,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  GetQueryStr,
} from "../../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import { redirect, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import TableRosters from "../../../common/table-rosters";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, fn, ln, ti, pn, em) => void;
  nameinit?: string;
}
const AddPage = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/room-type";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataMaster, setDataMaster] = useState<any>();
  const pathname = usePathname();
  const [dataform, setdataform] = useState([
    {
      name: "Room Type",
      data: [
        {
          label: "Status",
          name: "status",
          type: "checkbox",
          cols: "col-span-12",
        },
        {
          label: "Name",
          name: "name",
          type: "text",
          cols: "col-span-12",
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          cols: "col-span-12",
        },
        {
          label: "Specification",
          name: "specification",
          type: "textarea",
          cols: "col-span-12",
        },
        {
          label: "Rate",
          name: "rate",
          type: "number",
          cols: "col-span-6",
        },
        {
          label: "Minimum Rate",
          name: "min_rate",
          type: "number",
          cols: "col-span-6",
        },
        {
          label: "Room Type Grouping",
          name: "room_type_grouping",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
        },
        {
          label: "Order",
          name: "sort",
          type: "number",
          cols: "col-span-6",
          placeholder: "Urutan tampil (angka kecil = lebih atas)",
        },
      ],
    },
  ]);

  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else {
      if (type == "number") {
        console.log(formatAmount(e.target.value));
        setData({
          ...dataval,
          [e.target.name]: formatAmount(e.target.value),
        });
      } else {
        setData({ ...dataval, [e.target.name]: e.target.value });
      }
    }
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

      setDataEd(datauser?.data);
      setData(datauser?.data);
      setDataMaster(datauser?.master);
      let dataInput = [...dataform];

      dataInput[0].data[6].options = datauser?.master?.roomTypeGroupings;

      setdataform([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const transformData = (data) => {
    const newData = { ...data };
    const propertiesToTransform = ["room_type_grouping"];

    propertiesToTransform.forEach((property) => {
      if (Array.isArray(newData[property]) && newData[property].length > 0) {
        newData[property] = newData[property][0].value;
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

      const raw = JSON.stringify(transformedData);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      var redirects = isPopup ? "" : `${pathname}?parent=158`;
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        redirects
      );
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    } finally {
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

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
            <div className="col-span-12">
              <fieldset className="border">
                <legend className="ml-2">
                  {new URLSearchParams(window.location.search).get("data") ===
                  null
                    ? "Create "
                    : ""}
                  Room Type
                </legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "textarea") {
                      types = "textarea";
                      typesmain = "textarea";
                    } else if (row?.type == "checkbox") {
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
                            type: types == "number" ? "text" : types,
                            disabled: row?.disable,
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
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
          <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
            <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
              <ButtonSubmit
                onCreate={() => {
                  setloading(true);
                  router.replace({
                    pathname: "master-setup/room-type/",
                    query: { parent: parent },
                    //module: { module: GetQueryStr("") },
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
        </div>
      </div>
    </>
  );
};

export default AddPage;
