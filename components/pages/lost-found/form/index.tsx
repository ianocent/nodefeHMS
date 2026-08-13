import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  FetchDataDocument,
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
import { usePathname } from "next/navigation";
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const GLOBALURI = "/cms/concierge/lostfound";
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
      name: "Lost item",
      data: [
        {
          label: "Status",
          name: "status_lost",
          type: "select-multi",
          cols: "col-span-12",
          options: [{}],
        },
        {
          label: "Ref No",
          name: "ref_no",
          type: "text",
          cols: "col-span-6",
          disable: true,
        },
        {
          label: "Report Date",
          name: "report_date",
          type: "date",
          cols: "col-span-6",
        },

        {
          label: "Item",
          name: "item",
          type: "text",
          cols: "col-span-6",
        },
        {
          label: "Item Status",
          name: "item_status",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
        },
        {
          label: "Hotel Location",
          name: "hotel_location",
          type: "text",
          cols: "col-span-12",
        },

        {
          label: "Folio",
          name: "folio",
          type: "autocomplete",
          cols: "col-span-6",
          options: [{}],
          uriaotucom: "/cms/reservation/folio",
        },
        {
          label: "Room",
          name: "room",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
        },
        {
          label: "Check in",
          name: "checkin",
          type: "date",
          cols: "col-span-6",
        },
        {
          label: "Check out",
          name: "checkout",
          type: "date",
          cols: "col-span-6",
        },

        {
          label: "Owner Item",
          name: "owner_item",
          type: "text",
          cols: "col-span-6",
        },
        {
          label: "Contact Number",
          name: "contact_number",
          type: "text",
          cols: "col-span-6",
        },
      ],
    },
  ]);

  const [dataFounder, setDataFounder] = useState([
    {
      name: "Founder Item",
      data: [
        {
          label: "Founder of Item",
          name: "founder_of_item",
          type: "text",
          cols: "col-span-6",
        },
        {
          label: "Contact Number Founder",
          name: "contact_number_founder",
          type: "text",
          cols: "col-span-6",
        },

        {
          label: "Item Description",
          name: "item_description",
          type: "text",
          cols: "col-span-12",
        },
        {
          label: "Instruction",
          name: "instruction",
          type: "text",
          cols: "col-span-6",
        },
        {
          label: "Additional Information",
          name: "additional_information",
          type: "text",
          cols: "col-span-6",
        },
      ],
    },
  ]);

  const [dataImage, setDataImage] = useState([
    {
      name: "Image Item",
      data: [
        {
          label: "Photo 1",
          name: "photo_1",
          type: "image",
          cols: "col-span-12",
        },
        {
          label: "Photo 2",
          name: "photo_2",
          type: "image",
          cols: "col-span-12",
        },
        {
          label: "Photo 3",
          name: "photo_3",
          type: "image",
          cols: "col-span-12",
        },
        {
          label: "Photo 4",
          name: "photo_4",
          type: "image",
          cols: "col-span-12",
        },
        {
          label: "Photo 5",
          name: "photo_5",
          type: "image",
          cols: "col-span-12",
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  // const changeHandler = (
  //   e: any,
  //   b?: any,
  //   name?: string,
  //   ismulti?: boolean,
  //   options?: any
  // ) => {
  //   console.log("masuk gak");
  //   if (b == "text" || b == false || b == "number" || b == "textarea") {
  //     setData({ ...dataval, [e.target.name]: e.target.value });
  //   } else if (b == "select-multi-multi" || ismulti) {
  //     let valarr = [];
  //     if (ismulti && e.target) {
  //       e.target.selectedOptions.forEach((element: any) => {
  //         valarr.push(element.value);
  //       });
  //     } else {
  //       valarr = e.map((option: any) => option.value);
  //     }
  //     setData({
  //       ...dataval,
  //       [name + "_ori"]: e,
  //       [name]: ismulti ? valarr : e.value,
  //     });
  //   } else if (b == "checkbox") {
  //     if (ismulti) {
  //       if (e.target.checked) {
  //         setData({ ...dataval, [e.target.value]: e.target.checked });
  //       }
  //       let valarr = [];
  //       options?.forEach((row: any) => {
  //         if (dataval[row.value]) {
  //           valarr.push(row.value);
  //         }
  //       });
  //       setData({ ...dataval, [name]: valarr });
  //     } else if (b == "select") {
  //       console.log("masuk gak");
  //       setData({ ...dataval, [name]: e });
  //     } else if (b == "select-multi" || ismulti) {
  //       let valarr = [];
  //       if (ismulti && e.target) {
  //         e.target.selectedOptions.forEach((element: any) => {
  //           valarr.push(element.value);
  //         });
  //       } else {
  //         valarr = e.map((option: any) => option.value);
  //       }
  //       setData({
  //         ...dataval,
  //         [name + "_ori"]: e,
  //         [name]: ismulti ? valarr : e.value,
  //       });
  //     } else {
  //       setData({ ...dataval, [name]: e.target.checked });
  //     }
  //   }
  //   // setError("");
  // };

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      setData({ ...dataval, [name]: e });
    } else if (type === "autocomplete") {
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else if (type === "image") {
      if (e instanceof File) {
        // Validasi tipe file
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
        ];
        if (!validTypes.includes(e.type)) {
          alert("Please upload a valid image file (JPEG, PNG, JPG, or GIF)");
          return;
        }

        // Validasi ukuran file (max 2MB)
        if (e.size > 2 * 1024 * 1024) {
          alert("Image size should not exceed 2MB");
          return;
        }

        setData({ ...dataval, [name]: e });
      } else if (typeof e === "string") {
        // Assuming e is a base64 string
        setData({ ...dataval, [name]: e });
      }
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
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

      setDataEd({
        ...datauser?.data,
        checkin: datauser?.reservation?.check_in_date,
        checkout: datauser?.reservation?.check_out_date,
      });
      let dataInput = [...dataform];
      dataInput[0].data[0].options = datauser?.master?.statusLost;
      dataInput[0].data[4].options = datauser?.master?.itemsStatus;
      dataInput[0].data[6].options = datauser?.master?.reservations;
      dataInput[0].data[7].options = datauser?.master?.rooms;
      setdataform([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const transformData = (data) => {
    const newData = { ...data };

    // Daftar properti yang perlu diubah
    const propertiesToTransform = [
      "status_lost",
      "item_status",
      "folio",
      "room",
    ];

    propertiesToTransform.forEach((property) => {
      if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const OnSave = async () => {
    // console.log("widylog", dataval);
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
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        `${pathname}?parent=79`
      );
      if (saveprocess?.code == "200") {
        setloading(false);
      } else {
        setloading(false);
      }

      // const formData = new FormData();
      // for (const key in dataval) {
      //   formData.append(key, dataval[key]);
      // }

      // if (idusr != "0") {
      //   urisave = GLOBALURI + "/" + idusr + "";
      //   mth = "PUT";
      // }
      // const saveprocess = await FetchDataDocument(
      //   urisave,
      //   mth,
      //   formData,
      //   true,
      //   datalocal?.data?.access_token,
      //   router,
      //   ""
      // );
    } catch (error) {
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

        {/* <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold capitalize">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") +
                " " +
                GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div> */}

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-6">
              <fieldset className="border">
                <legend className="ml-2">Main</legend>
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
                          uriAutoComp={row?.uriaotucom}
                          rest={{
                            name: row?.name,
                            disabled: row?.disable,
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
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="border">
                <legend className="ml-2">Report</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataFounder[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
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
                            type: types,
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
            <div className="col-span-6 ">
              <fieldset className="border">
                <legend className="ml-2">Image</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataImage[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else if (row?.type == "image") {
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
                          onChangeFiles={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
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
