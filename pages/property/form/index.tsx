import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../components/common/paper/PaperBase";
import InputMain from "../../../components/common/input/InputMain";
import Seo from "../../../components/common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  getImgBase64,
} from "../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../context/LayoutContext";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import { TagsInput } from "react-tag-input-component";

const AddView = () => {
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const [selected, setSelected] = useState([]);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [optRegion, setoptRegion] = useState<any>([]);
  const [optCountry, setoptCountry] = useState<any>([]);
  const [optCity, setoptCity] = useState<any>([]);

  const [data, setData] = useState<any>({
    name: "",
    telp: "",
    whatsapp: "",
    email: "",
    permission_ids: [],
    code: "",
    status: [],
    company_id: [],
    subscribe_type: [],
    city_id: {},
    region_id: {},
    country_id: {},
    room_count: "0",
    is_tax: {},
    logo: "",
    ip_doorlock: "",
    contract_expired: "",
    join_date: "",
    market_segment_1: {},
    market_segment_2: {},
    market_segment_3: {},
    market_segment_4: {},
    pb1_account_uid: {},
    service_charge_account_uid: {},
    tax_account_uid: {},
    advance_deposit_current_day_account_uid: {},
    advance_deposit_previous_day_account_uid: {},
    guest_ledger_current_day_account_uid: {},
    guest_ledger_previous_day_account_uid: {},
    surcharge_account_uid: {},
    source: {},
    ip_whitelist: "",
    lat: "",
    long: "",
    // day_use_item_code: "",
    day_use_item_code: {},
    mandatory_check_in: [],
    mandatory_check_in_ori: [],
  });

  const mandatoryCheckInOptions = [
    { value: "card_type", label: "Card Type" },
    { value: "card_number", label: "Card Number" },
    { value: "id_expired", label: "ID Expired Date" },
    { value: "email", label: "Email" },
    { value: "gender", label: "Gender" },
    { value: "birth_date", label: "Birth Date" },
    { value: "nationality", label: "Nationality" },
    { value: "status", label: "Status" },
    { value: "phone", label: "Phone" },
    { value: "mobile_phone", label: "Mobile Phone" },
    { value: "address", label: "Address" },
    { value: "city", label: "City" },
    { value: "country", label: "Country" },
    { value: "postal_code", label: "Postal Code" },
  ];

  const [idusr, setidusr] = useState("0");

  const {
    code,
    telp,
    whatsapp,
    email,
    name,
    permission_ids,
    room_count,
    status,
    company_id,
    subscribe_type,
    city_id,
    region_id,
    country_id,
    logo,
    is_tax,
    ip_doorlock,
    contract_expired,
    join_date,
    market_segment_1,
    market_segment_2,
    market_segment_3,
    market_segment_4,
    source,
    ip_whitelist,
    lat,
    long,
    pb1_account_uid,
    service_charge_account_uid,
    tax_account_uid,
    advance_deposit_current_day_account_uid,
    advance_deposit_previous_day_account_uid,
    guest_ledger_current_day_account_uid,
    guest_ledger_previous_day_account_uid,
    surcharge_account_uid,
    day_use_item_code,
    mandatory_check_in,
    mandatory_check_in_ori,
    external_ar
  } = data;
  const changeHandler = (e: any, b?: boolean, name?: string) => {
    if (!b) {
      setData({ ...data, [e.target.name]: e.target.value });
    } else if (name === "mandatory_check_in" && b === true) {
      let valarr: string[] = [];
      e.forEach((element: any) => {
        valarr.push(element?.value);
      });
      setData({
        ...data,
        mandatory_check_in_ori: e,       
        mandatory_check_in: valarr,
      });
    } else {
      setData({ ...data, [name]: e });
    }
  };
  const changeHandlerFile = (e: any, b?: boolean, name?: string) => {
    setData({ ...data, [name]: e });
    // setError("");
  };
  const GetDetailUser = async (i: any) => {
    try {
      let getuuri = "/cms/property/" + i + "/update";
      if (i == 0) {
        getuuri = "/cms/property/create";
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
      const selectedMandatory = datauser?.data?.mandatory_check_in || [];
      const mandatoryOri = selectedMandatory.map((val: string) => {
        return mandatoryCheckInOptions.find(opt => opt.value === val) || { value: val, label: val };
      });

      let dataobj = {
        room_count: datauser?.data?.room_count,
        code: datauser?.data?.code,
        telp: datauser?.data?.telp,
        whatsapp: datauser?.data?.whatsapp,
        email: datauser?.data?.email,
        name: datauser?.data?.name,
        lat: datauser?.data?.latitude,
        long: datauser?.data?.longitude,
        status: datauser?.data?.status,
        company_id: datauser?.data?.relation?.companies,
        subscribe_type: datauser?.data?.relation?.subscribe_types,
        city_id: datauser?.data?.relation?.cities,
        region_id: datauser?.data?.relation?.regions,
        country_id: datauser?.data?.relation?.countries,
        is_tax: datauser?.data?.is_tax,
        logo: datauser?.data?.image,
        ip_doorlock: datauser?.data?.ip_doorlock,
        market_segment_1: datauser?.data?.market_segment_1,
        market_segment_2: datauser?.data?.market_segment_2,
        market_segment_3: datauser?.data?.market_segment_3,
        market_segment_4: datauser?.data?.market_segment_4,
        source: datauser?.data?.source,
        ip_whitelist: datauser?.data?.ip_whitelist,
        contract_expired: datauser?.data?.contract_expired,
        join_date: datauser?.data?.join_date,
        pb1_account_uid: datauser?.data?.pb1_account_uid,
        service_charge_account_uid: datauser?.data?.service_charge_account_uid,
        tax_account_uid: datauser?.data?.tax_account_uid,
        advance_deposit_current_day_account_uid:
          datauser?.data?.advance_deposit_current_day_account_uid,
        advance_deposit_previous_day_account_uid:
          datauser?.data?.advance_deposit_previous_day_account_uid,
        guest_ledger_current_day_account_uid:
          datauser?.data?.guest_ledger_current_day_account_uid,
        guest_ledger_previous_day_account_uid:
          datauser?.data?.guest_ledger_previous_day_account_uid,
        surcharge_account_uid: datauser?.data?.surcharge_account_uid,
        day_use_item_code: datauser?.data?.day_use_item_code,
        mandatory_check_in: selectedMandatory,
        mandatory_check_in_ori: mandatoryOri,
        external_ar: datauser?.data?.external_ar,
      };
      setSelected(datauser?.data?.ip_whitelist ?? []);
      setData(dataobj);
      setdataoption(datauser);
      setloading(false);
      return;
    } catch (error) {
      setloading(false);
      console.log(error);
      return;
    }
  };
  const OnSave = async () => {
    try {
      let urisave = "/cms/property";
      let mth = "POST";

      const raw = JSON.stringify({
        name: name,
        telp: telp,
        whatsapp: whatsapp,
        email: email,
        status: status?.value,
        company_id: company_id?.value,
        subscribe_type: subscribe_type?.value,
        city_id: city_id?.value,
        region: region_id?.value,
        country_id: country_id?.value,
        is_tax: is_tax?.value,
        logo: logo,
        ip_doorlock: ip_doorlock,
        market_segment_1: market_segment_1?.value,
        market_segment_2: market_segment_2?.value,
        market_segment_3: market_segment_3?.value,
        market_segment_4: market_segment_4?.value,
        pb1_account_uid: pb1_account_uid?.value,
        service_charge_account_uid: service_charge_account_uid?.value,
        tax_account_uid: tax_account_uid?.value,
        advance_deposit_current_day_account_uid:
          advance_deposit_current_day_account_uid?.value,
        advance_deposit_previous_day_account_uid:
          advance_deposit_previous_day_account_uid?.value,
        guest_ledger_current_day_account_uid:
          guest_ledger_current_day_account_uid?.value,
        guest_ledger_previous_day_account_uid:
          guest_ledger_previous_day_account_uid?.value,
        surcharge_account_uid: surcharge_account_uid?.value,
        source: source?.value,
        ip_whitelist: selected,
        contract_expired: contract_expired,
        join_date: join_date,
        latitude: lat,
        longitude: long,
        // day_use_item_code: day_use_item_code.value,
        day_use_item_code: day_use_item_code?.value ?? null,
        mandatory_check_in: mandatory_check_in,
        external_ar: external_ar?.value || "0",
      });

      if (idusr != "0") {
        urisave = "/cms/property/" + idusr;
      }
      if (idusr != "0") {
        urisave = "/cms/property/" + idusr;
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
        "/property"
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
          setoptCountry(resp.data);
        } else if (tbl == "country_id") {
          setoptCity(resp.data);
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
    setloading(true);
    const idreq = GetQueryParam(2);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);

  return (
    <LayoutComponent>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">
                {idusr == "0" ? "Create" : "Edit"}
              </h2>
            </div>
            <div className="col-span-8 h-fit"></div>
          </div>
          {!loading && dataoption?.master && (
           
            <div className="grid grid-cols-12 h-fit gap-4 ">
              <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"property Name"}
                    required={true}
                    rest={{
                      name: "name",
                      placeholder: "Input property Name",
                      value: name,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Total Room"}
                    required={false}
                    rest={{
                      disabled: true,
                      name: "room_count",
                      placeholder: "0",
                      value: room_count,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Email"}
                    required={true}
                    rest={{
                      name: "email",
                      placeholder: "Input property Email",
                      value: email,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"property Telp"}
                    required={true}
                    rest={{
                      name: "telp",
                      placeholder: "Input property telp",
                      value: telp,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"property Whatsapp"}
                    required={true}
                    rest={{
                      name: "whatsapp",
                      placeholder: "Input property Whatsapp",
                      value: whatsapp,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Subscribe Type"}
                    required={true}
                    options={dataoption?.master?.subscribe_types}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "subscribe_type");
                    }}
                    restSelect={{}}
                    valueSel={subscribe_type}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Expired Date"}
                    required={true}
                    rest={{
                      name: "contract_expired",
                      placeholder: "Input Expired Date",
                      value: contract_expired,
                      type: "date",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Join Date"}
                    required={true}
                    rest={{
                      name: "join_date",
                      placeholder: "Input Join Date",
                      value: join_date,
                      type: "date",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>

                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Company"}
                    required={true}
                    options={dataoption?.master?.companies}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "company_id");
                    }}
                    restSelect={{}}
                    valueSel={company_id}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Region"}
                    required={true}
                    options={dataoption?.master?.regions}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "region_id");
                      GetDataRelation(e?.value, "region");
                    }}
                    restSelect={{}}
                    valueSel={region_id}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Country"}
                    required={true}
                    options={optCountry}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "country_id");
                      GetDataRelation(e?.value, "country_id");
                    }}
                    restSelect={{}}
                    valueSel={country_id}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"City"}
                    required={true}
                    options={optCity}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "city_id");
                    }}
                    restSelect={{}}
                    valueSel={city_id}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Latitude"}
                    required={true}
                    rest={{
                      name: "lat",
                      placeholder: "Input property Name",
                      value: lat,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Longitude"}
                    required={true}
                    rest={{
                      name: "long",
                      placeholder: "Input property Name",
                      value: long,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Logo"}
                    required={true}
                    rest={{
                      name: "code",
                      placeholder: "Upload Logo",
                      value: logo,
                      type: "file",
                      onChange: async (e) => {
                        var val: any = "";

                        try {
                          val = await getImgBase64(e[0]);
                        } catch (error) {}

                        changeHandlerFile(val, true, "logo");
                      },
                    }}
                  />
                </div>

                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Status"}
                    required={true}
                    options={dataoption?.master?.statuses}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "status");
                    }}
                    restSelect={{}}
                    valueSel={status}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Include Tax"}
                    required={true}
                    options={dataoption?.master?.is_taxs}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "is_tax");
                    }}
                    restSelect={{}}
                    valueSel={is_tax}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"IP Doorlock"}
                    required={true}
                    rest={{
                      name: "ip_doorlock",
                      placeholder: "Input IP Doorlock",
                      value: ip_doorlock,
                      type: "text",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Market Segment 1"}
                    required={true}
                    options={dataoption?.master?.market_segments}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "market_segment_1");
                    }}
                    restSelect={{}}
                    valueSel={market_segment_1}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Market Segment 2"}
                    required={true}
                    options={dataoption?.master?.market_segments}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "market_segment_2");
                    }}
                    restSelect={{}}
                    valueSel={market_segment_2}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Market Segment 3"}
                    required={true}
                    options={dataoption?.master?.market_segments}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "market_segment_3");
                    }}
                    restSelect={{}}
                    valueSel={market_segment_3}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Market Segment 4"}
                    required={true}
                    options={dataoption?.master?.market_segments}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "market_segment_4");
                    }}
                    restSelect={{}}
                    valueSel={market_segment_4}
                    isMulti={false}
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"select-multi"}
                    error={false}
                    label={"Source"}
                    required={true}
                    options={dataoption?.master?.market_segments}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "source");
                    }}
                    restSelect={{}}
                    valueSel={source}
                    isMulti={false}
                  />
                </div>

                <div className={"col-span-6"}>
                  <label className="font-bold text-[14px] leading-[19px]">
                    Whitelist Ip Address
                    <span className="text-red normal-case"></span>
                  </label>
                  <TagsInput
                    value={selected}
                    onChange={setSelected}
                    name="ip_whitelist"
                    placeHolder="Enter IP Address"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"PB 1"}
                    required={true}
                    rest={{
                      name: "pb1_account_uid",
                      placeholder: "",
                      value: pb1_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={pb1_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "pb1_account_uid");
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Service Charge"}
                    required={true}
                    rest={{
                      name: "service_charge_account_uid",
                      placeholder: "",
                      value: service_charge_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={service_charge_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "service_charge_account_uid");
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Tax"}
                    required={true}
                    rest={{
                      name: "tax_account_uid",
                      placeholder: "",
                      value: tax_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={tax_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(e, true, "tax_account_uid");
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Advance Deposit Current"}
                    required={true}
                    rest={{
                      name: "advance_deposit_current_day_account_uid",
                      placeholder: "",
                      value: advance_deposit_current_day_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={advance_deposit_current_day_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(
                        e,
                        true,
                        "advance_deposit_current_day_account_uid"
                      );
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Advance Deposit Previous"}
                    required={true}
                    rest={{
                      name: "advance_deposit_previous_day_account_uid",
                      placeholder: "",
                      value: advance_deposit_previous_day_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={advance_deposit_previous_day_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(
                        e,
                        true,
                        "advance_deposit_previous_day_account_uid"
                      );
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Guest Ledger Current"}
                    required={true}
                    rest={{
                      name: "guest_ledger_current_day_account_uid",
                      placeholder: "",
                      value: guest_ledger_current_day_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={guest_ledger_current_day_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(
                        e,
                        true,
                        "guest_ledger_current_day_account_uid"
                      );
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Guest Ledger Previous"}
                    required={true}
                    rest={{
                      name: "guest_ledger_previous_day_account_uid",
                      placeholder: "",
                      value: guest_ledger_previous_day_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={guest_ledger_previous_day_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(
                        e,
                        true,
                        "guest_ledger_previous_day_account_uid"
                      );
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>
                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Surcharge"}
                    required={true}
                    rest={{
                      name: "surcharge_account_uid",
                      placeholder: "",
                      value: surcharge_account_uid,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={surcharge_account_uid}
                    onChangeSel={(e) => {
                      changeHandler(
                        e,
                        true,
                        "surcharge_account_uid"
                      );
                    }}
                    uriAutoComp="/cms/code-gls/get-gl"
                  />
                </div>

                <div className="col-span-6">
                  <InputMain
                    typeInput="select-multi"
                    label="External AR"
                    error={false}
                    required={false}
                    options={dataoption?.master?.statuses} 
                    valueSel={external_ar}
                    onChangeSel={(e) =>
                      changeHandler(e, true, "external_ar")}
                    isMulti={false}
                  />
                </div>

                <div className={"col-span-6"}>
                  <InputMain
                  typeInput="select-multi"
                  label={"Mandatory Check-in"}
                  error={false}
                  required={false}
                  valueSel={mandatory_check_in_ori}
                  isMulti={true}
                  options={mandatoryCheckInOptions}
                  onChangeSel={(e) => {
                    changeHandler(e, true, "mandatory_check_in");
                  }}
                />
                </div>

                <div className={"col-span-6"}>
                  <InputMain
                    typeInput={"base"}
                    error={false}
                    label={"Day Use (Extra Per 30 Minutes Rate)"}
                    required={false}
                    rest={{
                      name: "day_use_item_code",
                      placeholder: "Search Item Here.",
                      value: day_use_item_code,
                      type: "autocomplete",
                      onChange: (e) => {
                        changeHandler(e);
                      },
                    }}
                    valueSel={day_use_item_code}
                    onChangeSel={(e) => {
                      changeHandler(
                        e,
                        true,
                        "day_use_item_code"
                      );
                    }}
                    uriAutoComp="/cms/code-item"
                  />
                </div>

              </div>
            </div>
          )}
        </div>
        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                router.replace({
                  pathname: "/property",
                  query: { parent: 14 },
                });
              }}
              loading={loading}
              label="Cancel"
              isprimary={false}
            />
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          </div>
        </div>
      </PaperBase>
    </LayoutComponent>
  );
};

export default AddView;
