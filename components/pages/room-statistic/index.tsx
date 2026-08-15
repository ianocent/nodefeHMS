import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import CardRoom from "../../common/card/card-room";
import { useSelector } from "react-redux";
import router from "next/router";
import InputMain from "../../common/input/InputMain";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  NumberClear,
  formatAmount,
} from "../../helper";
import Svg5 from "./svg-5";
import Svg1 from "./svg-1";
import Svg2 from "./svg-2";
import Svg3 from "./svg-3";
import Svg4 from "./svg-4";
import IndexSVG from "./indexSVG";

const RoomStatistic = () => {
  const GLOBALURI = "/cms/room-reservation";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [ishide, setishide] = useState(false);
  const [data, setdata] = useState([]);
  const [building, setbuilding] = useState([]);
  const [loading, setloading] = useState(false);
  const [dataval, setData] = useState({});
  const [datatable, setdatatable] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [flooropt, setflooropt] = useState<any>([]);
  const [floorval, setfloorval] = useState<any>({});
  const [buildingval, setbuildingval] = useState<any>({});
  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Date",
          name: "date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          disable: true,
        },
        {
          label: "Building",
          name: "buildings",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
          disable: true,
        },
        {
          label: "Floor",
          name: "floors",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
          disable: true,
        },
        {
          label: "Room Status",
          name: "room_statuses",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Types",
          name: "room_types",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
        },

        {
          label: "Maid Status",
          name: "maid_statuses",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Configurations",
          name: "room_configurations",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
        },
      ],
    },
  ]);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // getData();
    // console.log("DATALOG", window.location.pathname.split("/"));
  }, [window.location.search]);

  useEffect(() => {
    getData();
  }, []);

  const onLoadmore = () => {
    if (datatable?.pagging?.next) {
      getData("POST", datatable?.pagging?.next);
    } else {
      setishide(true);
    }
  };

  const dataPOST = () => {
    var obj = {};
    for (var key in dataval) {
      obj[key] = dataval[key];
      dataform[0]?.data?.map((row: any, index: number) => {
        if (row?.key == key && row?.type == "number") {
          obj[key] = NumberClear("" + dataval[key] + "");
        }
      });
    }
    return obj;
  };

  const getData = async (mth?: string, page?: number) => {
    try {
      let uri = "/cms/room-statistic";
      let aesraw = "";
      if (!mth) {
        mth = "GET";
        aesraw = "";
      } else {
        const raw = JSON.stringify(dataPOST());
        aesraw = GetEncrypt(raw);
      }

      const datajson = await FetchData(
        uri + (page ? "?page=" + page : ""),
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (datajson?.code == "200") {
        let dataInput = [...dataform];
        dataInput[0].data[5].options = datajson?.master?.maid_statuses;
        dataInput[0].data[4].options = datajson?.master?.room_types;
        dataInput[0].data[3].options = datajson?.master?.room_statuses;
        dataInput[0].data[6].options = datajson?.master?.room_configurations;
        dataInput[0].data[1].options = datajson?.master?.buildings;
        dataInput[0].data[2].options = datajson?.master?.floors;
        setdataform([...dataInput]);
        setdatatable(datajson);
        setdata(datajson?.data);
        setbuilding(datajson?.building);
        setloading(false);
      } else {
        setdatatable({ ...datatable, ["pagging"]: datajson?.pagging });
        console.log("err", datajson);
        setloading(false);
        return;
      }
      return;
    } catch (error) {
      console.log("err", error);
      setloading(false);
      return;
    }
  };

  const changeHandler = (
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
    }

    // setError("");
  };
  useEffect(() => {
    setbuildingval(building?.[0]);
    setfloorval(building?.[0]?.floors?.[0]);
    setflooropt(building?.[0]?.floors);
  }, [building, data]);
  useEffect(() => {
    console.log("datalog", dataval);
    getData("POST");
  }, [dataval]);
  const reservationLegend = [
    { name: "Check In", color: "#10b981" },
    { name: "Check Out", color: "#8b5cf6" },
    { name: "Cancelled", color: "#ef4444" },
    { name: "Reservation", color: "#22d3ee" },
    { name: "In House", color: "#3b82f6" },
    { name: "Pending", color: "#f59e0b" },
  ];
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      <div className="mt-2">
        {/* Ganti grid-cols-12 jadi responsive */}
        <div className="grid grid-cols-1 md:grid-cols-12 h-fit gap-2 ml-2 mb-2 mt-2 mr-2">
          
          {/* Filter panel — full width di mobile, 4 cols di desktop */}
          <div className="col-span-1 md:col-span-4">
            <div className="">
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <div className="w-full sm:w-auto sm:min-w-[160px]">
                  <InputMain
                    required={false}
                    typeInput="select-multi"
                    label="Building"
                    options={building}
                    onChangeSel={(e) => {
                      setflooropt(e?.floors);
                      setbuildingval(e);
                    }}
                    error={false}
                    valueSel={buildingval}
                    isMulti={false}
                  />
                </div>
                <div className="w-full sm:w-auto sm:min-w-[160px]">
                  <InputMain
                    required={false}
                    typeInput="select-multi"
                    label="Floor"
                    options={flooropt}
                    onChangeSel={(e) => {
                      setfloorval(e);
                    }}
                    error={false}
                    valueSel={floorval}
                    isMulti={false}
                  />
                </div>
              </div>
              {dataform[0].data?.map((row: any) => (
                <>
                  {!row?.disable && (
                    <div
                      className={
                        row?.cols +
                        (row?.type == "checkbox" && row?.name != "fields"
                          ? " border border-dashed !border-blue rounded-md p-2 mb-2 "
                          : " mb-2 ")
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
                            value: dataval[row?.name],
                            type: row?.type == "number" ? "text" : row?.type,
                            onChange: (e) => {
                              changeHandler(e, row?.type, row?.name);
                            },
                            min: row?.mindate,
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
                            setTimeout(() => {
                              setloading(true);
                            }, 1000);
                          }}
                          valueSel={dataval[row?.name + "_ori"]}
                          options={row?.options}
                          isMulti={row?.ismulti}
                          valuename={"b" + row?.name}
                          colspan={row?.isOneColumn ? "col-span-12" : "0"}
                          isAll={row?.isAll}
                          valMulti={dataval}
                        />
                      ) : (
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
                              value: dataval[rowsa?.name],
                              type:
                                rowsa?.type == "number" ? "text" : rowsa?.type,
                              onChange: (e) => {
                                changeHandler(e, rowsa?.type, row?.name);
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
                  )}
                </>
              ))}
              <div className="flex flex-wrap gap-4 mb-4 px-2 mt-4">
                {reservationLegend.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="">
                <ButtonSubmit
                  label="Search"
                  onCreate={() => {
                    setloading(true);
                    getData("POST");
                  }}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* Map panel — full width di mobile, 8 cols di desktop */}
          <div className="col-span-1 md:col-span-8">
            <div className="">
              {/* Building & Floor selector — stack vertikal di mobile */}
              <IndexSVG
                data={data}
                building={building}
                floorval={floorval}
                buildingval={buildingval}
              />
            </div>
            <div className="justify-center text-center mt-5">
              {ishide ? <></> : <></>}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default RoomStatistic;
