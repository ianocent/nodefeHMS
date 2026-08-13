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
  const GLOBALURI = "/cms/promotion";
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
          label: "Promotion Type",
          name: "promotion_type",
          type: "select-multi",
          cols: "col-span-4",
          options: [
            { value: "percentage", label: "Percentage" },
            { value: "amount", label: "Amount" },
          ],
          ismulti: false,
          required: true,
        },
        {
          label: "Promotion Code",
          name: "promotion_code",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "From Stay Date",
          name: "from_stay_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "To Stay Date",
          name: "to_stay_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "From Validity Date",
          name: "from_validity_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "To Validity Date",
          name: "to_validity_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "Discount Percentage Amount (%)",
          name: "discount_percentage",
          type: "number",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Discount Flat Amount",
          name: "discount_flat",
          type: "number",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Min Night",
          name: "min_night",
          type: "number",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "No Of Night Discount",
          name: "no_of_night_discount",
          type: "number",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Active",
          name: "status",
          type: "select-multi",
          cols: "col-span-3",
          options: [
            { value: true, label: "Active" },
            { value: false, label: "Inactive" },
          ],
          ismulti: false,
        },
        {
          label: "Apply to Every Min Night",
          name: "apply_to_every_min_night",
          type: "select-multi",
          cols: "col-span-3",
          options: [
            { value: 1, label: "Yes" },
            { value: 0, label: "No" },
          ],
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
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
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
      // console.log("datalog", e.target.value);
      if (ismulti) {
        setData({
          ...dataval,
          ["b" + name + "_" + e.target.value]: e.target.checked,
          [name + "_" + e.target.value]: e.target.checked,
        });
      } else {
        setData({ ...dataval, [name]: e.target.checked });
      }
    } else if (b == "select") {
      if (e.target.value == "true" || e.target.value == "false") {
        setData({
          ...dataval,
          [name]: e.target.value == "true" ? true : false,
        });
      } else {
        setData({ ...dataval, [name]: e.target.value });
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

      setDataEd(datauser?.data);
      let dataInput = [...dataform];
      dataInput[0].data[5].options = datauser?.master?.comm_codes;
      dataInput[0].data[6].options = datauser?.master?.code_posts;
      dataInput[0].data[7].options = datauser?.master?.groupings;
      dataInput[0].data[8].options = datauser?.master?.cancelations;

      setdataform([...dataInput]);
      dataform[0].data?.map((row, index) => {
        if (index == 0) {
          var dataobj = {
            [row?.name]: datauser?.data[row?.name],
            [row?.name + "_ori"]: {
              value: datauser?.data[row?.name],
              label: datauser?.data[row?.name],
            },
          };
        } else {
          var dataobj = {
            [row?.name]: datauser?.data[row?.name],
            [row?.name + "_ori"]: datauser?.data[row?.name],
          };
        }

        setData((dataval) => ({ ...dataval, ...dataobj }));
      });

      if (i == 0) {
        var dataobj = {
          ["promotion_code"]: datauser?.master?.code,
          ["promotion_code" + "_ori"]: datauser?.master?.code,
        };

        setData((dataval) => ({ ...dataval, ...dataobj }));
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    console.log("dataval", dataval);
    console.log("datavaled", datavaled);
  }, [dataval, datavaled]);
  const OnSave = async () => {
    // console.log("widylog", dataval);
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const raw = JSON.stringify(dataval);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      setloading(false);

      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        const urlParams = new URLSearchParams(window.location.search);
        router.replace({
          pathname: window.location.pathname,
          query: { parent: urlParams.get("parent") },
        });
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
                <legend className="ml-2">Room Promotion Type Detail</legend>
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
                        required={row?.required ?? false}
                        label={row?.label}
                        rest={{
                          name: row?.name,
                          placeholder: row?.label,
                          value: dataval[row?.name] ?? datavaled[row?.name],
                          type: row?.type,
                          onChange: (e) => {
                            changeHandler(e, row?.type, row?.name);
                          },
                        }}
                        restArea={{
                          placeholder: row?.label,
                          name: row?.name,
                          value: dataval[row?.name] ?? datavaled[row?.name],
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
                          datavaled[row?.name + "_ori"] ??
                          dataval[row?.name + "_ori"]
                        }
                        options={row?.options}
                        isMulti={row?.ismulti}
                        valMulti={dataval}
                        valuename={row?.name}
                        colspan={row?.isOneColumn ? "col-span-12" : "0"}
                      />
                    </div>
                  ))}
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
