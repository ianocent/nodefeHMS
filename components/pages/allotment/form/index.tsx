import React, { useContext, useEffect, useRef, useState } from "react";
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
  const GLOBALURI = "/cms/allotment";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const ref = useRef(null);
  const {canUpdate, canCreate} = useFormPermission(90);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [namePopUp, setnamePopup] = useState("");

  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Active",
          name: "status",
          type: "checkbox",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          required: false,
        },
        {
          label: "Company/Guest Search",
          name: "name-company",
          type: "text",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Company/Guest Here.",
          idpost: "company_guest",
          uri: "/cms/allotment/get-guest-and-company",
          disable: false,
          AdduRi: "profile/company/main?parent=83&add=1",
          required: true,
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: false,
        },

        {
          label: "Start Date",
          name: "start_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "End Date",
          name: "end_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          required: true,
        },
        {
          label: "Release Allotment Before (Days)",
          name: "release_allotment",
          type: "number",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: false,
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");
  const [actAuto, setactAuto] = useState("-1");
  const [popup, setpopup] = useState(false);
  const [idusr, setidusr] = useState("0");
  const [dataguest, setdataguest] = useState<any>([]);

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
    } else if (b == "select") {
      setData({ ...dataval, [name]: e?.target.value });
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

      let obj = {};
      obj = {
        release_allotment: 0,
        ["name-company"]: datauser?.data?.name,
        company_guest: datauser?.data?.company_guest,
      };
      setData({ ...datauser?.data, ...obj });
      console.log("dataval", dataval);
      let dataInput = [...dataform];
      dataInput[0].data[1].options = datauser?.master?.company_guest;
      setdataform([...dataInput]);

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
        setidusr(saveprocess?.data?.id);
        const urlParams = new URLSearchParams(window.location.search);
        if (idusr != "0") {
          router.push({
            pathname: window.location.pathname,
            query: { parent: urlParams.get("parent") },
          });
        } else {
          router.push({
            pathname: window.location.pathname,
            query: {
              parent: urlParams.get("parent"),
              data: saveprocess?.data?.id,
              add: "1",
            },
          });
        }
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
  useEffect(() => {
    const handleOutSideClick = (event) => {
      // console.log("coba,", event.target.className);
      if (event.target.className.split(" ")[0] == "close-btn") {
        setactAuto("-1");
        setpopup(false);
      }
      if (!ref.current?.contains(event.target)) {
        // console.log("coba,", event.target.className);
        if (
          event.target.className?.split(" ")[0] != "Select2__input-container" &&
          event.target.className?.split(" ")[0] != "Select2__value-container" &&
          event.target.className?.split(" ")[0] != "Select2__indicator"
        ) {
          setactAuto("-1");
          setpopup(false);
        }
        // setactAuto("-1");
        // setpopup(false);
        // setoverflow(true);
        // console.log("coba", event.target.className?.split(" ")[0]);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  const GetDataAutoComp = async (word, uri, relate: any, ix, ia) => {
    try {
      let getuuri = "";
      if (relate) {
        var relatestr = "" + relate;
        var relatearr = relatestr.split(";");
        relatearr?.map((rw, index) => {
          var repstr = "[" + index + "]";
          uri = uri.replace(repstr, dataval[relatearr[index]]);
        });
      }

      getuuri =
        uri.indexOf("?") == -1
          ? uri + "?search=" + word
          : uri + "&search=" + word;

      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      setdataguest(data);
      return;
    } catch (error) {
      console.log("debug", error);
      return;
    }
  };
  const ListTblGuest = (id, datI, name, ix, ia, isAdd) => {
    return (
      <>
        <div
          ref={ref}
          className="p-2 rounded-md w-full z-50 border-black border-b-[1px] border-r-[1px] border-l-[1px] absolute bg-white"
        >
          <>
            <div className="table-responsive w-full">
              <table className={"shadow-lg table-auto w-full"}>
                <thead>
                  <tr className="">
                    {dataguest?.table?.map((row: any, i: any) => (
                      <td
                        title={"Sort By " + row.label}
                        key={i}
                        className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                      >
                        {row.label}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataguest?.data?.map((row: any, index) => (
                    <>
                      <tr
                        key={row?.id + "-" + index}
                        className={`${
                          index % 2 == 0 ? "bg-gray-300" : ""
                        } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] `}
                      >
                        {dataguest?.table?.map((item: any, a: any) => {
                          return item.row != 1 ? (
                            <td
                              key={item.key + "-" + a}
                              onClick={() => {
                                onSelecteda(row, "a", id, datI, name, ix, ia);
                                setactAuto("-1");
                              }}
                            >
                              {typeof row[item.key] == "string" ||
                              typeof row[item.key] == "number" ||
                              typeof row[item.key] == "boolean" ? (
                                row[item.key] == true &&
                                typeof row[item.key] == "boolean" ? (
                                  <img
                                    src="/assets/images/apps/checklist.png"
                                    className="w-[20px]"
                                  />
                                ) : row[item.key] == false &&
                                  typeof row[item.key] == "boolean" ? (
                                  <img
                                    src="/assets/images/apps/cross.png"
                                    className="w-[20px]"
                                  />
                                ) : item?.is_html ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: row[item.key],
                                    }}
                                  />
                                ) : (
                                  row[item.key]
                                )
                              ) : Array.isArray(row[item.key]) ? (
                                row[item.key]?.map((rw, i) => {
                                  return (
                                    <div
                                      className={
                                        row?.is_color
                                          ? row.color +
                                            " px-1 py-1 text-white rounded-md mt-1 text-center"
                                          : "bg-success px-1 py-1 text-white rounded-md mt-1 text-center"
                                      }
                                      key={i}
                                    >
                                      {rw?.en ?? rw?.label}
                                    </div>
                                  );
                                })
                              ) : (
                                row[item.key]?.en ?? row[item.key]?.label
                              )}
                            </td>
                          ) : (
                            <></>
                          );
                        })}
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
              {dataguest?.data?.length <= 0 ? (
                isAdd ? (
                  <div className="flex w-full justify-center mt-2">
                    {/* <ButtonSubmit
                      label="Add"
                      onCreate={() => {
                        setpopup(true);
                        setnamePopup(name);
                        setactAuto("-1");
                      }}
                    /> */}
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
          </>
        </div>
      </>
    );
  };
  const onSelecteda = (rw: any, n: any, id: any, idat: any, name, ix, ia) => {
    var names = name.split("-");
    var objinames = {
      [name]: rw[names[0]] ?? "",
    };
    setData((dataval) => ({
      ...dataval,
      ...objinames,
    }));
    var objid = {
      [id]: rw?.id ?? "",
    };
    setData((dataval) => ({
      ...dataval,
      ...objid,
    }));
    dataform.map((rows: any, indexs) => {
      rows.data?.map((row: any, index) => {
        var obj = {
          [row?.name]: rw[row?.name] ?? "",
          [row?.name + "_ori"]: rw[row?.name] ?? "",
        };
        if (row?.name == "title") {
          obj = {
            [row?.name]: rw[row?.name]?.label ?? "",
          };
        }
        if (row?.sugestdata == n && rw[row?.name]) {
          if (ix == row?.parent) {
            setData((dataval) => ({
              ...dataval,
              ...obj,
            }));
          }
        }
      });
    });
    if (ia != -1) {
      let dataInput: any = [...dataform];
      dataInput[1].items[ia].data[ix].valueid = rw?.id;
      dataInput[1].items[ia].data[ix].value = rw[names[0]];
      setdataform([...dataInput]);
    }
  };
  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        <div className="sm:grid grid-cols-12 gap-4 h-fit border-b border-dashed">
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
          <div className="col-span-12 sm:grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-12 ">
              <fieldset className="border">
                <legend className="ml-2">Detail</legend>
                <div className="sm:grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any, index) => (
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
                        required={row?.required}
                        label={row?.label}
                        rest={{
                          name: row?.name,
                          autoComplete: row?.isAutoComp ? "off" : "on",

                          placeholder: row?.label,
                          value: dataval[row?.name],
                          type: row?.type,
                          min:
                            row?.name == "end_date" ? dataval?.start_date : "",
                          max:
                            row?.name == "start_date" ? dataval?.end_date : "",
                          onChange: (e) => {
                            changeHandler(e, "text");
                          },
                          onKeyUp: (e: any) => {
                            if (row?.isAutoComp) {
                              if (e.target?.value?.length > 1) {
                                setactAuto("0" + index);
                                GetDataAutoComp(
                                  e.target?.value,
                                  row?.uri,
                                  row?.relate,
                                  index,
                                  -1
                                );
                              } else {
                                setactAuto("-1");
                              }
                            }
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
                      {row?.isAutoComp && actAuto == "0" + index ? (
                        <>
                          {ListTblGuest(
                            row?.idpost,
                            0,
                            row?.name,
                            index,
                            -1,
                            row?.AdduRi ?? false
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset className="border mt-4">
                <legend className="ml-2">Room</legend>
                <div className="sm:grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  <div className="col-span-12">
                    {new URLSearchParams(window.location.search).get("data") ? (
                      <TableView
                        groups={""}
                        uri={"/cms/allotment/room"}
                        queryString={
                          "&allotment_id=" +
                          new URLSearchParams(window.location.search).get(
                            "data"
                          )
                        }
                        isEditTable={true}
                        isBtnAdd={false}
                        isBtnView={false}
                        isBtnEdit={canUpdate || canCreate}
                      />
                    ) : (
                      <></>
                    )}
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
              router.push({
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
