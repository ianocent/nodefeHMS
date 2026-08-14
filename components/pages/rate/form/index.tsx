import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  GetQueryStr,
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
  const [isitem, setisitem] = useState(true);
  const [ispackage, setispackage] = useState(false);
  const [isdayuse, setisdayuse] = useState(false);
  const [popup, setpopup] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const { canUpdate, canCreate } = useFormPermission(86);
  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Active",
          name: "status",
          type: "checkbox",
          cols: "col-span-6  xl:col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Online",
          name: "online",
          type: "checkbox",
          cols: "col-span-6 xl:col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Channel Manager",
          name: "staah",
          type: "checkbox",
          cols: "col-span-6 xl:col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Day Use",
          name: "is_day_use",
          type: "checkbox",
          cols: "col-span-6 xl:col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Print Rate",
          name: "print_rate",
          type: "checkbox",
          cols: "col-span-12 xl:col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Sort",
          name: "sort",
          type: "number",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "Code",
          name: "code",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
        },
        // {
        //   label: "Common Code",
        //   name: "comm_code",
        //   type: "hidden",
        //   cols: "col-span-12 xl:col-span-6",
        //   options: [{}],
        //   ismulti: false,
        // },
        {
          label: "Post Code",
          name: "code_post_id",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "Grouping",
          name: "company_type",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Cancelation Rule",
          name: "cancellation_policy",
          type: "hidden", //select-multi
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "Post Code Extra Bed",
          name: "code_post_extra_bed_id",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
          required: false,
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
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date" ||
      b == "time"
    ) {
      setData({ ...dataval, [e.target.name]: e.target.value });
    } else if (b == "select-multi" || b == true) {
      // console.log(name);
      // console.log(e, "Cek ex");
      // setData({ ...dataval, [name]: e });
      let valarr = [];
      if (ismulti) {
        e.forEach((element: any) => {
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
        setData({
          ...dataval,
          [name + "_ori"]: e.target.checked,
          [name]: e.target.checked,
        });
      }
    }
    console.log("dataval", dataval);
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
      console.log(datauser, "<<< cek data user");
      dataInput[0].data[7].options = datauser?.master?.code_posts;
      dataInput[0].data[8].options = datauser?.master?.company_types;
      dataInput[0].data[9].options = datauser?.master?.cancelations;
      dataInput[0].data[11].options = datauser?.master?.code_posts;

      setdataform([...dataInput]);
      dataform[0].data?.map((row) => {
        var dataobj = { [row?.name]: datauser?.data[row?.name] };
        setData((dataval) => ({ ...dataval, ...dataobj }));
      });
      console.log("dataval", dataval);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const OnSave = async () => {
    try {
      let urisave = GLOBALURI;
      let mth = "POST";

      dataval.cancellation_policy = JSON.stringify(dataval.cancellation_policy);

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
        ""
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        router.replace({
          pathname: window.location.pathname,
          query: {
            parent: parent,
            module: GetQueryStr("module"),
          },
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
      {popup ? (
        <>
          <div
            className="absolute min-h-full w-full inset-0 
                    bg-gray-800 opacity-50 
                    z-10"
          ></div>

          <div
            className="absolute right-[10%] flex 
                    items-center justify-center
                   z-20 "
          >
            <div
              className="bg-white p-4 
                        rounded-lg shadow-lg "
            >
              <TableView
                groups={""}
                uri={"/cms/package"}
                uriSave={"/cms/rate/package"}
                isEditTable={false}
                queryString={
                  "rate_id=" +
                  new URLSearchParams(window.location.search).get("data")
                }
                isTitle={false}
                isBtnAdd={false}
                checked={true}
                onClosePopUp={() => {
                  setpopup(false);
                  setispackage(true);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
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
            <div className="col-span-12 lg:col-span-4 ">
              <fieldset className="border">
                <legend className="ml-2">Detail</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any) =>
                    row?.type != "hidden" ? (
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
                            row?.ismulti
                              ? dataval[row?.name + "_ori"] ??
                                datavaled[row?.name]
                              : dataval[row?.name + "_ori"] ??
                                datavaled[row?.name]
                          }
                          options={row?.options}
                          isMulti={row?.ismulti}
                          valuename={row?.name}
                        />
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                </div>
              </fieldset>
            </div>
            <div className="col-span-12 lg:col-span-8 ">
              <fieldset className="border min-w-full table-auto">
                <legend className="ml-2 ">Inclusive</legend>
                <div className="grid grid-flow-col auto-cols-max mt-4 gap-2">
                  <div
                    className={
                      !isitem
                        ? " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#E0E7FF] font-bold"
                        : " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#3730a3] text-white font-bold"
                    }
                    onClick={() => {
                      if (isitem) {
                        setisitem(false);
                        setispackage(false);
                        setisdayuse(false);
                        // setData({
                        //   rate_id: new URLSearchParams(
                        //     window.location.search
                        //   ).get("data"),
                        // });
                      } else {
                        setisitem(true);
                        setispackage(false);
                        setisdayuse(false);
                      }
                    }}
                  >
                    <div>Item</div>
                  </div>
                  <div
                    className={
                      !ispackage
                        ? " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#E0E7FF] font-bold "
                        : " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#3730a3] text-white font-bold "
                    }
                    onClick={() => {
                      if (ispackage) {
                        setisitem(false);
                        setispackage(false);
                        setisdayuse(false);
                        // setData({
                        //   rate_id: new URLSearchParams(
                        //     window.location.search
                        //   ).get("data"),
                        // });
                      } else {
                        setisitem(false);
                        setispackage(true);
                        setisdayuse(false);
                      }
                    }}
                  >
                    <div>Extra Bed</div>
                  </div>
                  <div
                    className={
                      !isdayuse
                        ? " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#E0E7FF] font-bold "
                        : " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#3730a3] text-white font-bold "
                    }
                    onClick={() => {
                      if (isdayuse) {
                        setisitem(false);
                        setispackage(false);
                        setisdayuse(false);
                      } else {
                        setisitem(false);
                        setispackage(false);
                        setisdayuse(true);
                      }
                    }}
                  >
                    <div>Day Use</div>
                  </div>
                </div>
                {ispackage ? (
                  <div className="m-2 ">
                    {/* <div className=" justify-end flex w-full">
                      <ButtonSubmit
                        onCreate={() => {
                          // setloading(true);
                          //  OnSave();
                          setispackage(false);
                          setpopup(true);
                          router.replace({
                            pathname: window.location.pathname,
                            query: {
                              parent: new URLSearchParams(
                                window.location.search
                              ).get("parent"),
                              data: new URLSearchParams(
                                window.location.search
                              ).get("data"),
                              popup: popup ? "1" : "2",
                            },
                          });
                        }}
                        loading={false}
                        label="Add"
                      />
                    </div> */}
                    {new URLSearchParams(window.location.search).get("data") !=
                    null ? (
                      <TableView
                        groups={""}
                        uri={"/cms/rate/extra-bed/inclusives"}
                        queryString={
                          "&rate_id=" +
                          new URLSearchParams(window.location.search).get(
                            "data"
                          )
                        }
                        isEditTable={true}
                        isTitle={false}
                        isDeleted={true}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}

                {isitem ? (
                  <div className="m-2 ">
                    {new URLSearchParams(window.location.search).get("data") !=
                    null ? (
                      <TableView
                        uri="/cms/rate/inclusives"
                        queryString={
                          "&rate_id=" +
                          new URLSearchParams(window.location.search).get(
                            "data"
                          )
                        }
                        groups=""
                        isEditTable={true}
                        isTitle={false}
                        isDeleted={true}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}

                {isdayuse ? (
                  <div className="m-2 ">
                    {new URLSearchParams(window.location.search).get("data") !=
                    null ? (
                      <TableView
                        uri="/cms/day-use-rate"
                        queryString={
                          "&rate_id=" +
                          new URLSearchParams(window.location.search).get(
                            "data"
                          )
                        }
                        groups=""
                        isEditTable={true}
                        isTitle={false}
                        isDeleted={true}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
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
              isBtnAdd={canCreate || canUpdate}
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
