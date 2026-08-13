import React, { useContext, useEffect, useRef, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import { redirect, usePathname } from "next/navigation";
import { useFormPermission } from "../../../../hooks/useFormPermission";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, fn, ln, ti, pn, em, gs, all) => void;
  nameinit?: string;
}
const AddView = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/profile/guest";
  const ref = useRef(null);
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const {canCreate, canUpdate} = useFormPermission(62);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataMaster, setDataMaster] = useState<any>();
  const pathname = usePathname();
  const [idusr, setidusr] = useState("0");
  const isCreate = idusr === "0";
  const [view, setview] = useState("0");
  const [dataform, setdataform] = useState([
    {
      name: "Guest",
      data: [
        {
          label: "Active",
          name: "status",
          type: "checkbox",
          cols: "col-span-6 lg:col-span-3",
        },
        {
          label: "Blacklist",
          name: "blacklist",
          type: "checkbox",
          cols: "col-span-6 lg:col-span-3",
        },
        {
          label: "Short Code",
          name: "short_code",
          type: "text",
          cols: "col-span-12 lg:col-span-3",
        },
        {
          label: "Title",
          name: "guest_title",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-3",
          required: true,
          options: [{}],
        },
        {
          label: "First Name",
          name: "first_name",
          type: "text",
          cols: "col-span-12 lg:col-span-6",
          required: true,
        },
        {
          label: "Last Name",
          name: "last_name",
          type: "text",
          cols: "col-span-12 lg:col-span-6",
          required: true,
        },

        {
          label: "NRIC",
          name: "card_type",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-4",
          options: [{}],
        },
        {
          label: "Insert ID",
          name: "card_number",
          type: "text",
          cols: "col-span-12 lg:col-span-5",
        },
        {
          label: "ID Expiry",
          name: "card_expiry",
          type: "date",
          cols: "col-span-12 lg:col-span-3",
        },

        {
          label: "Email",
          name: "email",
          type: "email",
          cols: "col-span-12 lg:col-span-6",
        },
        {
          label: "Status",
          name: "guest_status",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-6",
          options: [{}],
        },

        {
          label: "Gender",
          name: "gender",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-4",
          options: [{}],
        },
        {
          label: "Nationality",
          name: "nationality_id",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-4",
          options: [{}],
        },
        {
          label: "DOB",
          name: "birth_of_date",
          type: "date",
          cols: "col-span-12 lg:col-span-4",
        },

        {
          label: "Subscribe",
          name: "is_subscribe",
          type: "checkbox",
          cols: "col-span-6",
        },
        {
          label: "Guest Stay",
          name: "stay",
          type: "text",
          cols: "col-span-6",
          disable: true,
        },

        {
          label: "Telephone",
          name: "telp",
          type: "text",
          cols: "col-span-12 lg:col-span-4",
        },
        {
          label: "Mobile Phone",
          name: "mobile_phone",
          type: "text",
          cols: "col-span-12 lg:col-span-4",
        },
        {
          label: "Fax",
          name: "fax",
          type: "text",
          cols: "col-span-12 lg:col-span-4",
        },

        {
          label: "Address",
          name: "address",
          type: "text",
          cols: "col-span-12",
        },

        {
          label: "Region",
          name: "region",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-4",
          options: [],
        },
        {
          label: "Country",
          name: "country_id",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-4",
          options: [],
        },
        {
          label: "City",
          name: "city_id",
          type: "select-multi",
          cols: "col-span-12 lg:col-span-4",
          options: [],
        },

        {
          label: "Postal Code",
          name: "postal_code",
          type: "text",
          cols: "col-span-12 lg:col-span-6",
        },
        {
          label: "Car Registration Number",
          name: "car_reg_number",
          type: "text",
          cols: "col-span-12 lg:col-span-6",
        },

        {
          label: "Upload Identity",
          name: "image",
          type: "image",
          cols: "col-span-12",
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  useEffect(() => {
    if (dataval?.country_id) {
      // let dataInput = [...dataform];
      // dataInput[0].data[22].options = dataMaster.cities
      //   .filter(
      //     (item: any) => item.country === parseInt(dataval.country_id.value)
      //   )
      //   .map((item: any) => {
      //     return {
      //       country: item.country,
      //       label: item.label,
      //       value: item.value,
      //     };
      //   });
      // setdataform([...dataInput]);
    }
  }, [dataval?.country_id?.value]);
  useEffect(() => {
    // console.log("log", nameinit);
    if (nameinit) {
      setData({ ...dataval, ["first_name"]: nameinit });
    }
  }, []);
  const GetDataRelation = async (data: any, tbl: string) => {
    try {
      let getuuri = "/cms/countryByRegion?region=" + data;
      if (tbl == "region") {
        getuuri = "/cms/countryByRegion?region=" + data;
      } else if (tbl == "country_id") {
        getuuri = "/cms/cityByCountry?country=" + data;
      }
      const resp: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (resp.code == 200) {
        if (tbl == "region") {
          let tempOpt = [...dataform];
          tempOpt[0].data[21].options = resp.data;
          tempOpt[0].data[12].options = resp.data;
          setdataform(tempOpt);
        } else if (tbl == "country_id") {
          let tempOpt = [...dataform];
          tempOpt[0].data[22].options = resp.data;
          setdataform(tempOpt);
        }
      }
    } catch (error) {}
  };
  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      if (name == "region") {
        GetDataRelation(e.value, name);
      } else if (name == "country_id") {
        GetDataRelation(e.value, name);
      }
      setData({ ...dataval, [name]: e });
    } else if (type == "image") {
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      // setData({ ...dataval, [name]: e.target.checked });
      if (name == "blacklist") {
        console.log(dataval?.statusBlacklist);
        if (e.target.checked) {
          setData({
            ...dataval,
            [name]: e.target.checked,
            guest_status: dataval?.statusBlacklist,
          });
        } else {
          setData({
            ...dataval,
            [name]: e.target.checked,
            guest_status: {},
          });
        }
      } else {
        setData({ ...dataval, [name]: e.target.checked });
      }
    } else {
      if (e.target.name == "first_name" || e.target.name == "last_name") {
        setData({ ...dataval, [e.target.name]: e.target.value.toUpperCase() });
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
      // setData(datauser?.data);
      setDataMaster(datauser?.master);
      let dataInput = [...dataform];
      dataInput[0].data[3].options = datauser?.master?.titles;
      dataInput[0].data[6].options = datauser?.master?.nrics;
      dataInput[0].data[10].options = datauser?.master?.statusGuest;

      dataInput[0].data[11].options = datauser?.master?.genders;
      dataInput[0].data[12].options = datauser?.master?.countries;
      dataInput[0].data[20].options = datauser?.master?.regions;
      // dataInput[0].data[21].options = datauser?.master?.countries;
      // dataInput[0].data[22].options = datauser?.master?.cities.map(
      //   (item: any) => {
      //     return {
      //       label: item.label,
      //       value: item.value,
      //     };
      //   }
      // );
      GetDataRelation(datauser?.data?.region?.value, "region");
      GetDataRelation(datauser?.data?.country_id?.value, "country_id");

      setdataform([...dataInput]);

      if (i == 0) {
        // console.log("testwdy", datauser?.master?.statusBlacklist);
        setData({
          ...dataval,
          ...datauser?.data,
          statusBlacklist: datauser?.master?.statusBlacklist,
          ["guest_status"]: datauser?.master?.statusGuest[0],
        });
        setDataEd({
          ...datavaled,
          ...datauser?.data,
          statusBlacklist: datauser?.master?.statusBlacklist,
          ["guest_status"]: datauser?.master?.statusGuest[0],
        });
      } else {
        setData({
          ...dataval,
          ...datauser?.data,
          statusBlacklist: datauser?.master?.statusBlacklist,
        });
      }

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
      "card_type",
      "status_profile",
      "gender",
      "nationality_id",
      "city_id",
      "country_id",
      "region",
    ];

    propertiesToTransform.forEach((property) => {
      if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const OnSave = async () => {
    console.log("datavalku:", dataval);
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const transformedData = transformData(dataval);
      console.log("dataku:", transformedData);
      const raw = JSON.stringify(transformedData);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      var redirects = isPopup ? "" : `${pathname}?parent=82`;
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
        ActionSv(
          saveprocess?.data?.id,
          saveprocess?.data?.first_name,
          saveprocess?.data?.last_name,
          saveprocess?.data?.guest_title?.label,
          saveprocess?.data?.mobile_phone,
          saveprocess?.data?.email,
          saveprocess?.data?.guest_status,
          saveprocess?.data
        );
        // console.log("save", saveprocess);
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
    const view = urlParams.get("view");
    setview(view);
    const idparent = urlParams.get("parent");
    if (!isPopup) {
      setparent(idparent);
      if (idreq) {
        GetDetailUser(idreq);
        setidusr(idreq);
      } else {
        GetDetailUser(0);
        setidusr("0");
      }
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);
  useEffect(() => {
    const handleOutSideClick = (event) => {
      try {
        // console.log(event.target.className.split(" ")[0]);
      } catch (error) {}
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);

  return (
    <>
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 h-fit gap-4">
            
            <div className={`col-span-12 ${new URLSearchParams(window.location.search).get("data") ? "lg:col-span-5" : ""}`}>
              <fieldset className="border">
                <legend className="ml-2">Main</legend>
                {datavaled?.account && (
                  <div className="mt-4 ml-2 font-bold ">
                    Guest Acc : {datavaled?.account}
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-2 mr-2">
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
                    } else if (row?.type == "image") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else {
                      types = row?.type;
                      typesmain = "base";
                    }
                    return (
                      <div key={row?.name} className={row?.cols}>
                        <InputMain
                          valuename={row?.name}
                          typeInput={typesmain}
                          error={false}
                          label={row?.label}
                          required={row?.required ?? false}
                          options={row?.options}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name] ?? "",
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
                          }}
                          onChangeFiles={(e) => {
                            changeHandlerSrc(e, row?.type, row?.name);
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

            {new URLSearchParams(window.location.search).get("data") !== null && (
              <div className="col-span-7 relative">
                {new URLSearchParams(window.location.search).get("data") ===
                  null && (
                  <div className="w-full h-full bg-gray-200 opacity-50 cursor-not-allowed absolute top-0 left-0 rounded-lg"></div>
                )}

                <fieldset className="border min-w-full table-auto">
                  <legend className="ml-2 ">Request Notes</legend>
                  <div className="m-2 ">
                    <TableView
                      uri="/cms/profile/guest-notes"
                      queryString={
                        "&guest_id=" +
                        new URLSearchParams(window.location.search).get("data")
                      }
                      groups=""
                      isEditTable={true}
                      isTitle={false}
                      isDeleted={true}
                      isBtnView={false}
                    />
                  </div>
                </fieldset>

                <fieldset className="border min-w-full table-auto p-5">
                  <legend className="ml-2 ">Personal/Preference</legend>
                  <fieldset className="border min-w-full table-auto mt-8">
                    <legend className="ml-2 ">Loyalty Card</legend>
                    <div className="m-2 ">
                      <TableView
                        uri="/cms/profile/guest-loyalty-card"
                        queryString={
                          "&guest_id=" +
                          new URLSearchParams(window.location.search).get("data")
                        }
                        groups=""
                        isEditTable={true}
                        isTitle={false}
                        isDeleted={true}
                        isBtnView={false}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="border min-w-full table-auto">
                    <legend className="ml-2 ">Family Member</legend>
                    <div className="m-2 ">
                      <TableView
                        uri="/cms/profile/guest-family-member"
                        queryString={
                          "&guest_id=" +
                          new URLSearchParams(window.location.search).get("data")
                        }
                        groups=""
                        isEditTable={true}
                        isTitle={false}
                        isDeleted={true}
                        isBtnView={false}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="border min-w-full table-auto">
                    <legend className="ml-2 ">Preference</legend>
                    <div className="m-2 ">
                      <TableView
                        uri="/cms/profile/guest-preference"
                        queryString={
                          "&guest_id=" +
                          new URLSearchParams(window.location.search).get("data")
                        }
                        groups=""
                        isEditTable={true}
                        isTitle={false}
                        isDeleted={true}
                        isBtnView={false}
                      />
                    </div>
                  </fieldset>
                </fieldset>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={
          isPopup
            ? " w-full bg-white py-2 px-4 rounded-lg "
            : "fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30 rounded-lg"
        }
      >
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4  ">
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

          {view !== "1" && (canCreate || canUpdate) && (
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
