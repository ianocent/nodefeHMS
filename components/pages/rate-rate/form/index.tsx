import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LayoutContext } from "../../../../context/LayoutContext";
import { useFormPermission } from "../../../../hooks/useFormPermission";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import InputMain from "../../../common/input/InputMain";
import ModalConfirmationComponent from "../../../common/modal/ModalConfirmation";
import Seo from "../../../common/seo";
import TableView from "../../../common/table-edit";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  NumberClear,
  formatAmount
} from "../../../helper";
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const GLOBALURI = "/cms/rate/rate";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const [isapplyrate, setIsapplayrate] = useState(false);
  const [isrestriction, setisrestriction] = useState(false);
  const { canCreate, canUpdate } = useFormPermission(86);
  const [IsOpenModal, setIsOpenModal] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({ start_date: "2024-05-23" });
  const [datavala, setDataa] = useState<any>({});
  const [getdata, setgetdata] = useState(false);
  const [busdate, setbusdate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [datavalsrc, setDatasrc] = useState<any>({
    head_days: true,
    head_fields: true,
    head_room_type: true,
  });
  const [datavaled, setDataEd] = useState<any>({});
  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Date From",
          name: "start_date",
          type: "date",
          cols: "col-span-12 md:col-span-6 lg:col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Date To",
          name: "end_date",
          type: "date",
          cols: "col-span-12 md:col-span-6 lg:col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Display",
          name: "display",
          type: "hidden",
          cols: "col-span-12 xl:col-span-4",
          options: [
            { value: "portrait", label: "Portrait" },
            { value: "landscape", label: "Landscape" },
          ],
          ismulti: false,
        },
        {
          label: "Day",
          name: "days",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Columns",
          name: "fields",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Type",
          name: "room_type",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
        },
      ],
    },
  ]);
  const currentDate = new Date().toJSON().slice(0, 10);
  const [dataforma, setdataforma] = useState([
    {
      name: "main",
      data: [
        {
          label: "Date From",
          name: "start_date",
          type: "date",
          cols: "col-span-12 md:col-span-6 lg:col-span-4",
          options: [{}],
          ismulti: false,
          mindate: currentDate,
        },
        {
          label: "Date To",
          name: "end_date",
          type: "date",
          cols: "col-span-12 md:col-span-6 lg:col-span-4",
          options: [{}],
          ismulti: false,
          mindate: currentDate,
        },

        {
          label: "Day",
          name: "days",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Type",
          name: "room_type",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
          isAll: false,
        },
        {
          label: "Fields",
          name: "fields",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-4",
          options: [{}],
          ismulti: true,
          isOneColumn: true,
          isAll: false,
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
  const [dataformc, setdataformc] = useState([
    {
      name: "main",
      data: [
        {
          label: "Date From",
          name: "start_date",
          type: "date",
          cols: "col-span-12 md:col-span-6 lg:col-span-4",
          options: [{}],
          ismulti: false,
          mindate: currentDate,
        },
        {
          label: "Date To",
          name: "end_date",
          type: "date",
          cols: "col-span-12 md:col-span-6 lg:col-span-4",
          options: [{}],
          ismulti: false,
          mindate: currentDate,
        },

        {
          label: "Day",
          name: "days",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Type",
          name: "room_type",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
          isAll: false,
        },
        {
          label: "Restriction",
          name: "field_restrictions",
          type: "checkbox",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Min Los",
          name: "min_los",
          type: "number",
          cols: "col-span-12 md:col-span-6 lg:col-span-6",
          options: [{}],
          ismulti: true,
        },
      ],
    },
  ]);

  const [idusr, setidusr] = useState("0");

  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    // console.log("datalog", e.target.name);
    if (e.target.name.split("_")[0] == "head") {
      options?.map((row) => {
        var objb = {
          ["b" + name + "_" + row?.value]: e.target.checked,
        };
        var obj = {
          [name + "_" + row?.value]: e.target.checked,
        };
        setData((dataval) => ({
          ...dataval,
          ...obj,
        }));
        setData((dataval) => ({
          ...dataval,
          ...objb,
        }));
      });
      return;
    }
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      if (b == "number") {
        // console.log(formatAmount(e.target.value));
        setData({
          ...dataval,
          [e.target.name]: formatAmount(e.target.value),
        });
      } else {
        setData({ ...dataval, [e.target.name]: e.target.value });
      }
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
      console.log("datalog", "d_text_" + name + "" + e.target.value);
      if (ismulti) {
        if (name == "room_type") {
          // console.log("datalog", options);
          options.map((rw) => {
            setData((dataval) => ({
              ...dataval,
              ["b" + name + "_" + rw?.value]: false,
              [name + "_" + rw?.value]: false,
              ["d_text_" + name + "" + rw?.value]: true,
            }));
          });
          setData((dataval) => ({
            ...dataval,
            ["b" + name + "_" + e.target.value]: e.target.checked,
            [name + "_" + e.target.value]: e.target.checked,
            ["d_text_" + name + "" + e.target.value]: false,
          }));
        } else {
          setData({
            ...dataval,
            ["b" + name + "_" + e.target.value]: e.target.checked,
            [name + "_" + e.target.value]: e.target.checked,
          });
        }
      } else {
        setData({ ...dataval, [name]: e.target.checked });
      }
    }

    // setError("");
  };
  const changeHandlera = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    if (e.target.name.split("_")[0] == "head") {
      options?.map((row) => {
        var objb = {
          ["b" + name + "_" + row?.value]: e.target.checked,
        };
        var obj = {
          [name + "_" + row?.value]: e.target.checked,
        };
        setDataa((datavala) => ({
          ...datavala,
          ...obj,
        }));
        setDataa((datavala) => ({
          ...datavala,
          ...objb,
        }));
      });
      return;
    }
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      if (b == "number") {
        console.log(formatAmount(e.target.value));
        setDataa({
          ...datavala,
          [e.target.name]: formatAmount(e.target.value),
        });
      } else {
        setDataa({ ...datavala, [e.target.name]: e.target.value });
      }
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      setDataa({
        ...datavala,
        [name + "_ori"]: e,
        [name]: ismulti ? valarr : e?.value,
      });
    } else if (b == "checkbox") {
      // console.log("datalog", e.target.value);
      if (ismulti) {
        setDataa({
          ...datavala,
          ["b" + name + "_" + e.target.value]: e.target.checked,
          [name + "_" + e.target.value]: e.target.checked,
        });
      } else {
        setDataa({ ...datavala, [name]: e.target.checked });
      }
    }

    // setError("");
  };
  const changeHandlerSrc = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    // console.log("widylog", e.target.name.split("_")[0]);
    if (e.target.name.split("_")[0] == "head") {
      setDatasrc((datavalsrc) => ({
        ...datavalsrc,
        [e.target.name]: e.target.checked,
      }));
      options?.map((row) => {
        var obj = {
          [name + "_" + row?.value]: e.target.checked,
        };
        // console.log("widy", obj);
        setDatasrc((datavalsrc) => ({
          ...datavalsrc,
          ...obj,
        }));
      });
      return;
    }
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      if (b == "number") {
        setDatasrc({
          ...datavalsrc,
          [e.target.name]: formatAmount(e.target.value),
        });
      } else {
        setDatasrc({ ...datavalsrc, [e.target.name]: e.target.value });
      }
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
      // console.log("logbody", body);
      let getuuri = GLOBALURI + "/" + i + "/update";
      if (i == 0) {
        getuuri = GLOBALURI + "/create?id=" + GetQueryStr("data");
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
      var defdata = { start_date: "", end_date: "", display: [] };
      setbusdate(datauser?.master?.business_date);
      let dataInput = [...dataform];
      dataInput[0].data[3].options = datauser?.master?.days;
      dataInput[0].data[4].options = datauser?.master?.fields;
      dataInput[0].data[5].options = datauser?.master?.room_types;
      setdataform([...dataInput]);
      let dataInputa = [...dataforma];
      dataInputa[0].data[2].options = datauser?.master?.days;
      dataInputa[0].data[0].mindate = datauser?.data?.start_date;
      dataInputa[0].data[3].options = datauser?.master?.room_types;
      let arrGroupmain = [];
      var arrGroup = [];
      datauser?.master?.fields?.map((row) => {
        if (
          row?.value != "stop_departure" &&
          row?.value != "stop_arrival" &&
          row?.value != "stop_sell"
        ) {
          arrGroup.push({
            label: "-",
            labelgroup: "Input " + row?.label,
            name: "text_fields" + row?.value,
            type: "number",
            cols: "col-span-12 mt-2 ",
            options: [{}],
            ismulti: false,
            isOneColumn: true,
          });
          arrGroupmain.push(row);
        }
      });
      dataInputa[0].data[4].options = arrGroupmain;
      dataInputa[0].data[5].group = arrGroup;
      setdataforma([...dataInputa]);

      let dataInputc = [...dataformc];
      dataInputc[0].data[2].options = datauser?.master?.days;
      dataInputc[0].data[3].options = datauser?.master?.room_types;
      dataInputc[0].data[4].options = datauser?.master?.field_restrictions;
      setdataformc([...dataInputc]);

      var objAlldays = {
        days: true,
        // start_date: datauser?.master?.business_date,
        start_date: datauser?.data?.start_date,
        // end_date: GetNextDay(datauser?.master?.business_date, 7),
        end_date: datauser?.data?.end_date,
      };
      setStartDate(datauser?.data?.start_date);
      setEndDate(datauser?.data?.end_date);
      setDatasrc((datavalsrc) => ({ ...datavalsrc, ...objAlldays }));
      datauser?.master?.days?.map((row) => {
        var objdays = { ["days_" + row?.value]: true };
        setDatasrc((datavalsrc) => ({ ...datavalsrc, ...objdays }));
      });

      var objAllfields = { fields: true };
      setDatasrc((datavalsrc) => ({ ...datavalsrc, ...objAllfields }));
      datauser?.master?.fields?.map((row) => {
        if (row?.value == "one_adult") {
          var objdays = { ["fields_" + row?.value]: true };
          setDatasrc((datavalsrc) => ({ ...datavalsrc, ...objdays }));
        }
      });

      var objAllroom_type = { room_type: true };
      setDatasrc((datavalsrc) => ({ ...datavalsrc, ...objAllroom_type }));
      datauser?.master?.room_types?.map((row) => {
        var objdays = { ["room_type_" + row?.value]: true };
        setDatasrc((datavalsrc) => ({ ...datavalsrc, ...objdays }));
      });
      setgetdata(true);

      var obj1 = { ["text_fieldsmax_night"]: 99 };
      setData((dataval) => ({ ...dataval, ...obj1 }));
      var obj2 = { ["text_fieldsmin_night"]: 1 };
      setData((dataval) => ({ ...dataval, ...obj2 }));
      return;
    } catch (error) {
      console.log("datalog", error);
      return;
    }
  };
  const [parent, setparent] = useState("0");
  const searchOn = () => {
    router.replace({
      pathname: window.location.pathname,
      query: {
        parent: parent,
        data: new URLSearchParams(window.location.search).get("data"),
        time: new Date().getTime(),
      },
    });
    setgetdata(true);
  };
  const FinalPOstDat = () => {
    var obj = {};

    for (var key in dataval) {
      obj[key] = dataval[key];
      dataforma[0]?.data[5]?.group?.map((row: any, index: number) => {
        if (row?.name == key && row?.type == "number") {
          obj[key] = NumberClear("" + dataval[key] + "");
        }
      });
    }
    return obj;
  };
  const FinalPOstData = () => {
    var obj = {};
    for (var key in datavala) {
      obj[key] = datavala[key];
      dataformc[0]?.data?.map((row: any, index: number) => {
        if (row?.key == key && row?.type == "number") {
          obj[key] = NumberClear("" + datavala[key] + "");
        }
      });
    }
    return obj;
  };
  const onSave = async (save: string) => {
    // setloading(true);
    // console.log("datalog", dataval);
    try {
      const urisave =
        save == "1"
          ? GLOBALURI + "/store"
          : "/cms/rate/restriction?rate_id=" +
            new URLSearchParams(window.location.search).get("data");
      let mth = "POST";

      const raw = JSON.stringify(
        save == "1" ? FinalPOstDat() : FinalPOstData()
      );

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
    if (idreq) {
      GetDetailUser(0);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);
  useEffect(() => {
    console.log("dataval", dataval);
  }, [dataval]);

  const [syncLoading, setSyncLoading] = useState(false);

  const onSyncStaah = async () => {
    try {
      setSyncLoading(true);
      const saveprocess = await FetchData(
        "/cms/rate/" + idusr + "/sync-staah",
        "POST",
        GetEncrypt(JSON.stringify({})),
        false,
        datalocal?.data?.access_token,
        router,
        window.location.href
      );
      setSyncLoading(false);
    } catch (error) {
      console.log("sync error", error);
      setSyncLoading(false);
    }
  };

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <ModalConfirmationComponent
        label="Do you want to Setup rate 0 ?"
        title="Rate 0"
        isShowIcon={false}
        IsOpenModel={IsOpenModal}
        ChangeonClose={(e) => {
          setIsOpenModal(e);
        }}
        onCheck={(e) => {
          if (e) {
            setIsOpenModal(false);
            setloading(true);
            onSave("1");
          } else {
            setIsOpenModal(false);
            // OnSave(0);
          }
        }}
      />
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
              <div className="col-span-12 lg:col-span-6">
                <fieldset className="border">
                  <legend className="ml-2">Filter</legend>
                  <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                    {dataform[0].data?.map((row: any) => (
                      <>
                        {row?.type != "hidden" && (
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
                                value:
                                  datavalsrc[row?.name] ?? datavaled[row?.name],
                                type: row?.type,
                                onChange: (e) => {
                                  changeHandlerSrc(e, row?.type, row?.name);
                                },
                                min: startDate,
                              }}
                              restArea={{
                                placeholder: row?.label,
                                name: row?.name,
                                value:
                                  datavalsrc[row?.name] ?? datavaled[row?.name],
                                onChange: (e) => {
                                  changeHandlerSrc(e, row?.type, row?.name);
                                },
                              }}
                              onChangeSel={(e) => {
                                changeHandlerSrc(
                                  e,
                                  row?.type,
                                  row?.name,
                                  row?.ismulti,
                                  row?.options
                                );
                              }}
                              valueSel={
                                datavalsrc[row?.name + "_ori"] ??
                                datavaled[row?.name]
                              }
                              options={row?.options}
                              isMulti={row?.ismulti}
                              valMulti={datavalsrc}
                              valuename={row?.name}
                              colspan={row?.isOneColumn ? "col-span-12" : "0"}
                            />
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                  <div className="mt-4 mb-4 ml-2 flex gap-2">
                    <ButtonSubmit
                      label="Search"
                      onCreate={() => {
                        setgetdata(false);
                        searchOn();
                      }}
                      loading={loading}
                    />
                    {idusr != "0" && (
                      <ButtonSubmit
                        label="Sync to Channel Manager"
                        onCreate={onSyncStaah}
                        loading={syncLoading}
                      />
                    )}
                  </div>
                  {/* <div className="col-span-8 h-fit flex justify-end">
                    {idusr != "0" && (
                      <ButtonSubmit
                        label="Sync to Channel Manager"
                        onCreate={onSyncStaah}
                        loading={syncLoading}
                      />
                    )}
                  </div> */}
                </fieldset>
              </div>
              <div className="col-span-12 lg:col-span-6">
                {canCreate || canUpdate ? (
                  <div className="grid grid-flow-col auto-cols-max gap-2">
                    <div
                      className={
                        !isapplyrate
                          ? " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#E0E7FF] font-bold"
                          : " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#3730a3] text-white font-bold"
                      }
                      onClick={() => {
                        setData((dataval) => ({
                          ...dataval,
                          // start_date: busdate,
                          start_date: startDate,
                          end_date: endDate,
                        }));
                        if (isapplyrate) {
                          setIsapplayrate(false);
                          setisrestriction(false);
                          setData({
                            rate_id: new URLSearchParams(
                              window.location.search
                            ).get("data"),
                          });
                        } else {
                          setIsapplayrate(true);
                          setisrestriction(false);
                        }
                      }}
                    >
                      <div>Apply Rate</div>
                    </div>
                    <div
                      className={
                        !isrestriction
                          ? " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#E0E7FF] font-bold"
                          : " w-[150px] flex gap-2 px-2 py-2 rounded-lg cursor-pointer bg-[#3730a3] text-white font-bold"
                      }
                      onClick={() => {
                        setDataa((datavala) => ({
                          ...datavala,
                          start_date: busdate,
                        }));
                        if (isrestriction) {
                          setisrestriction(false);
                          setIsapplayrate(false);
                        } else {
                          setisrestriction(true);
                          setIsapplayrate(false);
                        }
                      }}
                    >
                      <div>Set Restriction</div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {isapplyrate ? (
                  <div className="mt-2">
                    <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-2 mt-2 mr-2">
                      {dataforma[0].data?.map((row: any) => (
                        <div
                          className={
                            row?.cols +
                            (row?.type == "checkbox" && row?.name != "fields"
                              ? " border  border-dashed !border-blue rounded-md p-2 "
                              : "")
                          }
                        >
                          {!row?.isgroup ? (
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
                                value:
                                  dataval[row?.name] ?? datavaled[row?.name],
                                type:
                                  row?.type == "number" ? "text" : row?.type,
                                onChange: (e) => {
                                  changeHandler(e, row?.type, row?.name);
                                },
                                min: startDate,
                              }}
                              restArea={{
                                placeholder: row?.label,
                                name: row?.name,
                                value:
                                  dataval[row?.name] ?? datavaled[row?.name],
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
                                dataval[row?.name + "_ori"] ??
                                datavaled[row?.name]
                              }
                              options={row?.options}
                              isMulti={row?.ismulti}
                              valuename={"b" + row?.name}
                              colspan={row?.isOneColumn ? "col-span-12" : "0"}
                              isAll={row?.isAll}
                              valMulti={dataval}
                            />
                          ) : (
                            // JSON.stringify(row?.group)

                            row?.group?.map(
                              (rowsa, index) => (
                                <InputMain
                                  typeInput={
                                    rowsa?.type == "text" ||
                                    rowsa?.type == "number" ||
                                    rowsa?.type == "date"
                                      ? "base"
                                      : rowsa?.type
                                  }
                                  error={false}
                                  required={true}
                                  label={rowsa?.label}
                                  rest={{
                                    disabled:
                                      dataval["d_" + rowsa?.name] == undefined
                                        ? false
                                        : dataval["d_" + rowsa?.name],
                                    name: rowsa?.name,
                                    placeholder: rowsa?.labelgroup,
                                    value:
                                      dataval[rowsa?.name] ??
                                      datavaled[rowsa?.name],
                                    type:
                                      rowsa?.type == "number"
                                        ? "text"
                                        : rowsa?.type,
                                    // pattern: rowsa?.type == "number" ? "" : "",
                                    onChange: (e) => {
                                      changeHandler(e, rowsa?.type, row?.name);
                                    },
                                  }}
                                  colspan={
                                    rowsa?.isOneColumn
                                      ? "col-span-12 mt-2 "
                                      : "0"
                                  }
                                  clasCus={
                                    " h-[25px] " +
                                    (index == 0 ? " mt-[15px] " : " mt-[2px] ")
                                  }
                                />
                              )
                              // JSON.stringify(rows)
                            )
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 mb-4 ml-2">
                      <ButtonSubmit
                        isBtnAdd={canCreate || canUpdate}
                        label="Save"
                        onCreate={() => {
                          if (
                            (dataval["text_fieldsone_adult"] == "0" &&
                              dataval["fields_one_adult"] == true) ||
                            (dataval["text_fieldstwo_adult"] == "0" &&
                              dataval["fields_two_adult"] == true) ||
                            (dataval["text_fieldsextra_adult"] == "0" &&
                              dataval["fields_extra_adult"] == true) ||
                            (dataval["text_fieldsextra_child"] == "0" &&
                              dataval["fields_extra_child"] == true) ||
                            (dataval["text_fieldsmax_night"] == "0" &&
                              dataval["fields_max_night"] == true)
                          ) {
                            setIsOpenModal(true);
                          } else {
                            setloading(true);
                            onSave("1");
                          }
                        }}
                        loading={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {isrestriction ? (
                  <div className="mt-2">
                    <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-2 mt-2 mr-2">
                      {dataformc[0].data?.map((row: any) => (
                        <div
                          className={
                            row?.cols +
                            (row?.type == "checkbox" && row?.name != "fields"
                              ? " border  border-dashed !border-blue rounded-md p-2 "
                              : "")
                          }
                        >
                          {!row?.isgroup ? (
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
                                value:
                                  datavala[row?.name] ?? datavaled[row?.name],
                                type:
                                  row?.type == "number" ? "text" : row?.type,
                                onChange: (e) => {
                                  changeHandlera(e, row?.type, row?.name);
                                },
                                min: busdate,
                              }}
                              restArea={{
                                placeholder: row?.label,
                                name: row?.name,
                                value:
                                  datavala[row?.name] ?? datavaled[row?.name],
                                onChange: (e) => {
                                  changeHandlera(e, row?.type, row?.name);
                                },
                              }}
                              onChangeSel={(e) => {
                                changeHandlera(
                                  e,
                                  row?.type,
                                  row?.name,
                                  row?.ismulti,
                                  row?.options
                                );
                              }}
                              valueSel={
                                datavala[row?.name + "_ori"] ??
                                datavaled[row?.name]
                              }
                              options={row?.options}
                              isMulti={row?.ismulti}
                              valuename={"b" + row?.name}
                              colspan={row?.isOneColumn ? "col-span-12" : "0"}
                              isAll={row?.isAll}
                              valMulti={dataval}
                            />
                          ) : (
                            // JSON.stringify(row?.group)

                            row?.group?.map((rowsa, index) => (
                              <InputMain
                                typeInput={
                                  rowsa?.type == "text" ||
                                  rowsa?.type == "number" ||
                                  rowsa?.type == "date"
                                    ? "base"
                                    : rowsa?.type
                                }
                                error={false}
                                required={true}
                                label={rowsa?.label}
                                rest={{
                                  name: rowsa?.name,
                                  placeholder: rowsa?.labelgroup,
                                  value:
                                    datavala[rowsa?.name] ??
                                    datavaled[rowsa?.name],
                                  type: rowsa?.type,
                                  onChange: (e) => {
                                    changeHandlera(e, rowsa?.type, row?.name);
                                  },
                                }}
                                colspan={
                                  rowsa?.isOneColumn ? "col-span-12 mt-2 " : "0"
                                }
                                clasCus={
                                  " h-[25px] " +
                                  (index == 0 ? " mt-[15px] " : " mt-[2px] ")
                                }
                              />
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 mb-4 ml-2">
                      <ButtonSubmit
                        label="Save"
                        onCreate={() => {
                          setloading(true);
                          onSave("2");
                        }}
                        loading={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="col-span-12">
              <div className="mt-2 min-w-full table-auto">
                {getdata ? (
                  <>
                    <TableView
                      groups={""}
                      uri={GLOBALURI}
                      isEditTable={true}
                      isBtnAdd={false}
                      methodFetch={"POST"}
                      isNotToast={true}
                      bodyFetch={datavalsrc}
                      queryString={
                        "&rate_id=" +
                        new URLSearchParams(window.location.search).get(
                          "data"
                        ) +
                        "&req=" +
                        (new URLSearchParams(window.location.search).get(
                          "req"
                        ) ?? "")
                      }
                      headRow={2}
                      isTitle={false}
                    />
                  </>
                ) : (
                  <></>
                )}
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
                "/rate-management/rate?parent=" + parent + "&module=null"
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
          {isview ? <></> : <></>}
        </div>
      </div>
    </>
  );
};

export default AddView;
