import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  formatAmount,
  NumberClear,
} from "../../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import { usePathname } from "next/navigation";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, nm, market, source) => void;
  nameinit?: string;
}
const AddView = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/profile/company";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const {canCreate, canUpdate} = useFormPermission(83);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataMaster, setDataMaster] = useState<any>();
  const pathname = usePathname();
  const canEditFinance = useTransactionPermission("finance_access_edit");
  const canViewFinance = useTransactionPermission("finance_access_view");
  const [view, setview] = useState("0");
  const [dataform, setdataform] = useState([
    {
      name: "Status",
      data: [
        {
          label: "Active",
          name: "status",
          type: "checkbox",
          cols: "col-span-6",
        },
        {
          label: "Blacklist",
          name: "blacklist",
          type: "checkbox",
          cols: "col-span-6",
        },
        {
          label: "Status",
          name: "guest_status",
          type: "select-multi",
          cols: "col-span-6",
          options: [],
        },
        {
          label: "Type",
          name: "company_type",
          type: "select-multi",
          cols: "col-span-6",
          options: [],
        },
      ],
    },
  ]);
  const [dataFormCompany, setDataFormCompany] = useState([
    {
      name: "CompanyInfo",
      data: [
        {
          label: "Shortcode",
          name: "short_code",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Code",
        },
        {
          label: "Name",
          name: "name",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Name",
          required: true,
        },
        {
          label: "Business Registration",
          name: "business_regional",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Regional",
        },
        {
          label: "IATA",
          name: "IATA",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Code",
        },
      ],
    },
  ]);
  const [dataFormContact, setDataFormContact] = useState([
    {
      name: "ContactInfo",
      data: [
        {
          label: "Phone Number",
          name: "mobile_phone",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Phone Number",
        },
        {
          label: "Email",
          name: "email",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Email",
        },
        {
          label: "Website",
          name: "website",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Website",
        },
        {
          label: "Fax",
          name: "fax",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Fax",
        },
      ],
    },
  ]);
  const [dataFormStaff, setDataFormStaff] = useState([
    {
      name: "StaffInfo",
      data: [
        {
          label: "Staff In Charge",
          name: "staff_in_charge",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [
            // More options as needed
          ],
          placeholder: "Insert Name",
          isShow: true,
        },
        {
          label: "Source",
          name: "source",
          type: "select-multi",
          required: true,
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Source",
          isShow: true,
        },
      ],
    },
  ]);
  const [dataFormBillingAddress, setDataFormBillingAddress] = useState([
    {
      name: "BillingAddress",
      data: [
        {
          label: "Address",
          name: "billing_address",
          type: "textarea",
          cols: "col-span-12",
          placeholder: "Insert Address",
        },
        {
          label: "Region",
          name: "billing_region",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Region",
        },
        {
          label: "Country",
          name: "billing_country",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Country",
        },
        {
          label: "City",
          name: "billing_city",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose City",
        },
        {
          label: "Postal Code",
          name: "billing_postal_code",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Postal Code",
        },
      ],
    },
  ]);
  const [dataFormMailingAddress, setDataFormMailingAddress] = useState([
    {
      name: "MailingAddress",
      data: [
        {
          label: "Address",
          name: "mailing_address",
          type: "textarea",
          cols: "col-span-12",
          placeholder: "Insert Address",
        },
        {
          label: "Region",
          name: "mailing_region",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Region",
        },
        {
          label: "Country",
          name: "mailing_country",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Country",
        },
        {
          label: "City",
          name: "mailing_city",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose City",
        },
        {
          label: "Postal Code",
          name: "mailing_postal_code",
          type: "text",
          cols: "col-span-6",
          placeholder: "Insert Postal Code",
        },
      ],
    },
  ]);
  const [dataFormFinance, setDataFormFinance] = useState([
    {
      name: "FinanceInfo",
      data: [
        {
          label: "Term",
          name: "term",
          type: "select-multi",
          cols: "col-span-12 order-1",
          options: [
            { value: "net30", label: "Net 30 Days" },
            { value: "net60", label: "Net 60 Days" },
            // More terms as applicable
          ],
          placeholder: "Choose Terms",
        },
        {
          label: "Credit Limit",
          name: "credit_limit",
          type: "number",
          cols: "col-span-12 order-2",
          placeholder: "Rp.",
        },

        {
          label: "Billing",
          name: "billing",
          type: "select-multi",
          cols: "col-span-12 order-4",
          options: [
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
            // More billing options as applicable
          ],
          placeholder: "Choose Billing",
        },
        {
          label: "Stop Credit",
          name: "is_stop_credit",
          type: "checkbox",
          cols: "col-span-6 order-5",
          options: [{ label: "Stop Credit", value: "stop_credit" }],
          ismulti: false,
        },
        {
          label: "GST",
          name: "gst",
          type: "checkbox",
          cols: "col-span-6 order-6",
          options: [{ label: "GST", value: "gst" }],
          ismulti: false,
        },
        {
          label: "Remaining",
          name: "remaining",
          type: "number",
          cols: "col-span-12 order-3",
          placeholder: "Rp.",
        },
      ],
    },
  ]);
  const [dataFormCompanyGrouping, setDataFormCompanyGrouping] = useState([
    {
      name: "CompanyGrouping",
      data: [
        {
          label: "Market Segment 1",
          name: "market_segment_1",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Data",
          isShow: true,
          required: true,
        },
        {
          label: "Market Segment 2",
          name: "market_segment_2",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Data",
          isShow: true,
          required: true,
        },
        {
          label: "Market Segment 3",
          name: "market_segment_3",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Data",
          isShow: true,
          required: true,
        },
        {
          label: "Market Segment 4",
          name: "market_segment_4",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          options: [],
          placeholder: "Choose Data",
          isShow: true,
          required: true,
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");
  const [idusr, setidusr] = useState("0");
  const GetDataRelation = async (data: any, tbl: string) => {
    try {
      let getuuri = "/cms/countryByRegion?region=" + data;
      if (tbl == "region") {
        getuuri = "/cms/countryByRegion?region=" + data;
      } else if (tbl == "country_id") {
        getuuri = "/cms/cityByCountry?country=" + data;
      } else if (tbl == "billing_region") {
        getuuri = "/cms/countryByRegion?region=" + data;
      } else if (tbl == "billing_country") {
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
          let tempOpt = [...dataFormMailingAddress];
          tempOpt[0].data[2].options = resp.data;
          setDataFormMailingAddress(tempOpt);
        } else if (tbl == "country_id") {
          let tempOpt = [...dataFormMailingAddress];
          tempOpt[0].data[3].options = resp.data;
          setDataFormMailingAddress(tempOpt);
        }
        if (tbl == "billing_region") {
          let tempOpt = [...dataFormBillingAddress];
          tempOpt[0].data[2].options = resp.data;
          setDataFormBillingAddress(tempOpt);
        } else if (tbl == "billing_country") {
          let tempOpt = [...dataFormBillingAddress];
          tempOpt[0].data[3].options = resp.data;
          setDataFormBillingAddress(tempOpt);
        }
      }
    } catch (error) {}
  };
  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      // alert(name);
      if (name == "mailing_region") {
        GetDataRelation(e.value, "region");
      } else if (name == "mailing_country") {
        GetDataRelation(e.value, "country_id");
      }
      if (name == "billing_region") {
        GetDataRelation(e.value, "billing_region");
      } else if (name == "billing_country") {
        GetDataRelation(e.value, "billing_country");
      }
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      // setData({ ...dataval, [name]: e.target.checked });
      // console.log(dataval);
      if (name == "blacklist") {
        if (e.target.checked) {
          setData({
            ...dataval,
            [name]: e.target.checked,
            guest_status: dataval?.statusBlacklist,
          });
          setDataEd({
            ...datavaled,
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
      if (e.target.name === "credit_limit") {
        setData({ ...dataval, [e.target.name]: formatAmount(e.target.value) });
      } else {
        setData({ ...dataval, [e.target.name]: e.target.value });
      }
    }
  };
  useEffect(() => {
    if (dataval?.billing_country) {
      // let dataInput = [...dataFormBillingAddress];
      // dataInput[0].data[3].options = dataMaster.cities
      //   .filter(
      //     (item: any) =>
      //       item.country === parseInt(dataval.billing_country.value)
      //   )
      //   .map((item: any) => {
      //     return {
      //       country: item.country,
      //       label: item.label,
      //       value: item.value,
      //     };
      //   });
      // setDataFormBillingAddress([...dataInput]);
    }
    if (dataval?.mailing_country) {
      // let dataInputMailing = [...dataFormMailingAddress];
      // dataInputMailing[0].data[3].options = dataMaster.cities
      //   .filter(
      //     (item: any) =>
      //       item.country === parseInt(dataval.mailing_country.value)
      //   )
      //   .map((item: any) => {
      //     return {
      //       country: item.country,
      //       label: item.label,
      //       value: item.value,
      //     };
      //   });
      // setDataFormMailingAddress([...dataInputMailing]);
    }
  }, [dataval?.mailing_country?.value, dataval?.billing_country?.value]);
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
      setDataMaster(datauser?.master);
      let dataInput = [...dataform];
      dataInput[0].data[2].options = datauser?.master?.statusGuest;
      dataInput[0].data[3].options = datauser?.master?.typeCompany;
      if (i == 0) {
        setData({
          ...dataval,
          ...datauser?.data,
          company_type: datauser?.master?.typeCompany[0],
          statusBlacklist: datauser?.master?.statusBlacklist,
        });
      } else {
        setData({
          ...dataval,
          ...datauser?.data,
          statusBlacklist: datauser?.master?.statusBlacklist,
        });
      }
      setdataform([...dataInput]);

      let dataInputBillingAddress = [...dataFormBillingAddress];
      dataInputBillingAddress[0].data[1].options = datauser?.master?.regions;
      // dataInputBillingAddress[0].data[2].options = datauser?.master?.countries;
      // dataInputBillingAddress[0].data[3].options = datauser?.master?.cities;
      GetDataRelation(datauser?.data?.billing_region?.value, "billing_region");
      GetDataRelation(
        datauser?.data?.billing_country?.value,
        "billing_country"
      );
      GetDataRelation(datauser?.data?.mailing_region?.value, "region");
      GetDataRelation(datauser?.data?.mailing_country?.value, "country_id");

      setDataFormBillingAddress([...dataInputBillingAddress]);

      let dataInputMailingAddress = [...dataFormMailingAddress];
      dataInputMailingAddress[0].data[1].options = datauser?.master?.regions;
      dataInputMailingAddress[0].data[2].options = datauser?.master?.countries;
      dataInputMailingAddress[0].data[3].options = datauser?.master?.cities;
      setDataFormMailingAddress([...dataInputMailingAddress]);

      let dataInputFinance = [...dataFormFinance];
      dataInputFinance[0].data[0].options = datauser?.master?.terms;
      dataInputFinance[0].data[2].options = datauser?.master?.billings;
      setDataFormFinance([...dataInputFinance]);
      if (i == 0) {
        try {
          var objinames = {
            ["billing"]: {
              value: datauser?.master?.billings[0].value,
              label: datauser?.master?.billings[0].label,
            },
            ["term"]: {
              value: datauser?.master?.terms[0].value,
              label: datauser?.master?.terms[0].label,
            },
            ["gst"]: true,
          };
          setData((dataval) => ({
            ...dataval,
            ...objinames,
          }));
        } catch (error) {}
      }

      let dataInputMkt = [...dataFormCompanyGrouping];
      dataInputMkt[0].data[0].options = datauser?.master?.market_segment_1;
      dataInputMkt[0].data[0].isShow =
        datauser?.master?.markets?.is_market_segment_1;
      dataInputMkt[0].data[1].options = datauser?.master?.market_segment_2;
      dataInputMkt[0].data[1].isShow =
        datauser?.master?.markets?.is_market_segment_2;
      dataInputMkt[0].data[2].options = datauser?.master?.market_segment_3;
      dataInputMkt[0].data[2].isShow =
        datauser?.master?.markets?.is_market_segment_3;
      dataInputMkt[0].data[3].options = datauser?.master?.market_segment_4;
      dataInputMkt[0].data[3].isShow =
        datauser?.master?.markets?.is_market_segment_4;
      setDataFormCompanyGrouping([...dataInputMkt]);

      let dataInputStaff = [...dataFormStaff];
      dataInputStaff[0].data[1].options = datauser?.master?.source;
      dataInputStaff[0].data[1].isShow = datauser?.master?.markets?.is_source;

      dataInputStaff[0].data[0].options = datauser?.master?.staff;

      setDataFormStaff([...dataInputStaff]);

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
      "guest_status",
      "company_type",
      "staff_in_charge",
      "source",
      "billing_region",
      "billing_country",
      "billing_city",
      "mailing_region",
      "mailing_country",
      "mailing_city",
      "term",
      "billing",
      "market_segment_1",
      "market_segment_2",
      "market_segment_3",
      "market_segment_4",
      "credit_limit",
    ];

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
    // console.log("widylog", dataval);
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const transformedData = transformData(dataval);

      const { no, ...dataToPost } = transformedData;

      const raw = JSON.stringify(dataToPost);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }
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
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // const idreq = urlParams.get("data");
    const idreq = isPopup ? null : urlParams.get("data");
    const view = urlParams.get("view");
    setview(view);
    const idparent = urlParams.get("parent");
    setparent(idparent);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
    console.log("log", nameinit);
    if (nameinit) {
      setData((dataval) => ({
        ...dataval,
        ["name"]: nameinit,
      }));
    }
  }, []);
  useEffect(() => {
    console.log(dataval);
  }, [dataval]);
  const handleCopyFromBilling = () => {
    setData({
      ...dataval,
      mailing_address: dataval.billing_address
        ? dataval.billing_address
        : datavaled.billing_address,
      mailing_region: dataval.billing_region
        ? dataval.billing_region
        : datavaled.billing_region,
      mailing_country: dataval.billing_country
        ? dataval.billing_country
        : datavaled.billing_country,
      mailing_city: dataval.billing_city
        ? dataval.billing_city
        : datavaled.billing_city,
      mailing_postal_code: dataval.billing_postal_code
        ? dataval.billing_postal_code
        : datavaled.billing_postal_code,
    });
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
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
            {/* <div className="col-span-4 "> */}
            <div className="col-span-12 lg:col-span-4">
              <fieldset className="border">
                <legend className="ml-2">Status</legend>
                {datavaled?.account && (
                  <div className="mt-4 ml-2 font-bold ">
                    Company Acc : {datavaled?.account}
                  </div>
                )}

                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-2 mr-2 form-grid-responsive">
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
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          // valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          valueSel=
                            {dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="border">
                <legend className="ml-2">Company</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2 form-grid-responsive">
                  {dataFormCompany[0].data?.map((row: any) => {
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
                          required={row?.required ?? false}
                          options={row?.options}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          // valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          valueSel=
                            {dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="border">
                <legend className="ml-2">Contact</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataFormContact[0].data?.map((row: any) => {
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
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          // valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          valueSel=
                            {dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="border">
                <legend className="ml-2">Staff</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataFormStaff[0].data?.map((row: any) => {
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
                      <>
                        {row?.isShow ? (
                          <div className={row?.cols}>
                            <InputMain
                              valuename={row?.name}
                              typeInput={typesmain}
                              error={false}
                              label={row?.label}
                              required={row.required}
                              options={row?.options}
                              rest={{
                                name: row?.name,
                                placeholder: row?.label,
                                // value: dataval[row?.name] ?? datavaled[row?.name],
                                value:dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                                type: types,
                                onChange: (e) => {
                                  changeHandlerSrc(e, row?.type, row?.name);
                                },
                              }}
                              restArea={{
                                placeholder: row?.label,
                                name: row?.name,
                                // value:dataval[row?.name] ?? datavaled[row?.name],
                                value:dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                                onChange: (e) => {
                                  changeHandlerSrc(e, row?.type, row?.name);
                                },
                              }}
                              onChangeSel={(e: any) => {
                                changeHandlerSrc(e, row?.type, row?.name);
                                //GetDataTable(e.value);
                              }}
                              // valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                              valueSel={dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null}
                              isMulti={false}
                              placeholder={row?.label}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}
                </div>
              </fieldset>
            </div>
            {/* <div className="col-span-4 "> */}
            <div className="col-span-12 lg:col-span-4">
              <fieldset className="border">
                <legend className="ml-2">Billing Address</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataFormBillingAddress[0].data?.map((row: any) => {
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
                    } else if (row?.type == "textarea") {
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
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          // valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          valueSel=
                            {dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="border">
                <legend className="ml-2">Mailing Address</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2 relative">
                  <div className="col-span-12">
                    <button
                      className="border rounded-md py-1 px-2 bg-[#845adf] text-[11px] text-white"
                      onClick={() => handleCopyFromBilling()}
                    >
                      Copy from billing address
                    </button>
                  </div>
                  {dataFormMailingAddress[0].data?.map((row: any) => {
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
                    } else if (row?.type == "textarea") {
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
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            // value: dataval[row?.name] ?? datavaled[row?.name],
                            value:
                            dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          // valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          valueSel=
                            {dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
            {/* <div className="col-span-4 "> */}
            <div className="col-span-12 lg:col-span-4">
              {/* {permission?.canCreate && permission?.canView && ( */}
                <fieldset className="border">
                  <legend className="ml-2">Finance</legend>
                  <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                    {dataFormFinance[0].data?.map((row: any) => {
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
                      } else if (row?.name == "credit_limit") {
                        types = row.type == "number" ? "text" : row.type;
                        typesmain = "base";
                      } else if (row?.name == "remaining") {
                        types = row.type == "number" ? "text" : row.type;
                        typesmain = "base";
                      } else {
                        types = row?.type;
                        typesmain = "base";
                      }

                      const isFinanceEdit = !canEditFinance;
                      const isFinanceRead = canViewFinance;
                      const isRemaining = row?.name === "remaining";
                      // const fieldDisabled = isRemaining ? true : isFinanceEdit && isFinanceRead;
                      const fieldDisabled = isRemaining 
                      ? true 
                      : !canEditFinance;

                      return (
                        <div className={row?.cols} key={row?.name}>
                          <InputMain
                            valuename={row?.name}
                            typeInput={typesmain}
                            error={false}
                            label={row?.label}
                            required={false}
                            options={row?.options}
                            disabled={fieldDisabled}
                            rest={{
                              name: row?.name,
                              placeholder: row?.label,
                              value:
                                dataval?.[row?.name] !== undefined
                                  ? dataval[row?.name]
                                  : datavaled?.[row?.name] ?? null,
                              type: types,
                              min: row?.type == "number" ? 0 : "",
                              onChange: (e) => {
                                if (fieldDisabled) return;
                                changeHandlerSrc(e, row?.type, row?.name);
                              },
                              disabled: fieldDisabled,
                              readOnly: fieldDisabled,
                            }}
                            restArea={{
                              placeholder: row?.label,
                              name: row?.name,
                              value:
                                dataval?.[row?.name] !== undefined
                                  ? dataval[row?.name]
                                  : datavaled?.[row?.name] ?? null,
                              onChange: (e) => {
                                if (fieldDisabled) return;
                                changeHandlerSrc(e, row?.type, row?.name);
                              },
                            }}
                            onChangeSel={(e: any) => {
                              if (fieldDisabled) return;
                              changeHandlerSrc(e, row?.type, row?.name);
                            }}
                            valueSel={
                              dataval?.[row?.name] !== undefined
                                ? dataval[row?.name]
                                : datavaled?.[row?.name] ?? null
                            }
                            isMulti={false}
                            placeholder={row?.label}
                          />
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              {/* )} */}
              <fieldset className="border">
                <legend className="ml-2">Company Grouping</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataFormCompanyGrouping[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;
                    var nameData = row?.name;

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
                      <>
                        {row?.isShow ? (
                          <div className={row?.cols}>
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
                                // value:dataval[row?.name] ?? datavaled[row?.name],
                                value:dataval?.[row?.name] !== undefined
                                ? dataval[row?.name]
                                : datavaled?.[row?.name] ?? null,
                                type: types,
                                onChange: (e) => {
                                  changeHandlerSrc(e, row?.type, row?.name);
                                },
                              }}
                              restArea={{
                                placeholder: row?.label,
                                name: row?.name,
                                // value:dataval[row?.name] ?? datavaled[row?.name],
                                value:dataval?.[row?.name] !== undefined
                                ? dataval[row?.name]
                                : datavaled?.[row?.name] ?? null,
                                onChange: (e) => {
                                  changeHandlerSrc(e, row?.type, row?.name);
                                },
                              }}
                              onChangeSel={(e: any) => {
                                changeHandlerSrc(e, row?.type, row?.name);
                                //GetDataTable(e.value);
                              }}
                              // valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                              valueSel={dataval?.[row?.name] !== undefined
                              ? dataval[row?.name]
                              : datavaled?.[row?.name] ?? null}
                              isMulti={false}
                              placeholder={row?.label}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
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
