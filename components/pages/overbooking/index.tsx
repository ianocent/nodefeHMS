import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import AddPage from "./form";
import { useSelector } from "react-redux";
import InputMain from "../../common/input/InputMain";
import { useRouter } from "next/router";
import LoadInPage from "../../common/loader/LoadInpage";
import {
  FetchData,
  GetCurrentDate,
  GetDecrypt,
  GetNextDay,
  GetQueryStr,
} from "../../helper";

const ListView = () => {
  const router = useRouter();

  const GLOBALURI = "/cms/overbooking";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [dataval, setData] = useState<any>({});
  const [load, setload] = useState(true);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [datasrc, setDatasrc] = useState<any>({});

  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Start Date",
          name: "start_date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "End Date",
          name: "end_date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Room Type",
          name: "room_type",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: true,
          isAll: false,
        },
      ],
    },
  ]);
  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    setload(false);
    // console.log("widylog", b + "-" + name + "-" + e.target.name + "-");
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
      setData({ ...dataval, [e.target.name]: e.target.value });
      router.query = { ...router.query, [e.target.name]: e.target.value };
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
        let valarr = [];
        var val;
        if (e.target.checked == true) {
          val = e.target.value;
          setData({ ...dataval, [e.target.value]: e.target.checked });
          valarr.push(e.target.value);
        } else {
          val = e.target.value;
        }

        setDatasrc({
          ...datasrc,
          [e.target.value]: e.target.checked,
        });

        options?.map((row) => {
          if (
            val == row?.value &&
            e.target.checked &&
            dataval[name + "_" + row?.value]
          ) {
            valarr.push(row?.value);
          }
          if (dataval[name + "_" + row?.value] && val != row?.value) {
            valarr.push(row?.value);
          }
        });
        setData({ ...dataval, [name]: valarr });
        setData({
          ...dataval,
          [name + "_" + e.target.value]: e.target.checked,
        });
        router.query = { ...router.query, [name]: valarr.toString() };
      } else {
        setData({ ...dataval, [name]: e.target.checked });
        router.query = { ...router.query, [name]: e.target.checked };
      }
    }

    router.replace({
      pathname: window.location.pathname,
      query: router.query,
    });
    // setError("");
    setTimeout(() => {
      setload(true);
    }, 1000);
  };

  useEffect(() => {
    // console.log(datasrc);
  }, [datasrc]);

  const GetDetailUser = async (i: any) => {
    //setuiddata(i);
    try {
      // console.log("logbody", body);
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
      let dataInput = [...dataform];
      dataInput[0].data[2].options = datauser?.master?.room_types;
      var obj = {};
      var arr = [];
      datauser?.master?.room_types.map((rw: any) => {
        obj = { ...obj, ...{ ["room_type_" + rw?.value]: true } };
        // arr.push(obj);
      });
      // console.log("wdy", obj);
      let datavalroom_types = [];
      datauser?.master?.room_types.map((rw: any) => {
        datavalroom_types.push(rw?.value);
      });
      setdataform([...dataInput]);
      router.query = { ...router.query, ['start_date']: datauser.business_date, ['end_date']: GetNextDay(datauser.business_date, 7), ['room_type']: datavalroom_types.toString() };
      setData({ ...dataval, ...obj, ['start_date']: datauser.business_date, ['end_date']: GetNextDay(datauser.business_date, 7), ['room_type']: datavalroom_types.toString() });
      router.replace({
        pathname: window.location.pathname,
        query: router.query,
      });
      return;
    } catch (error) {
      console.log("datalog", error);
      return;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
  }, []);

  useEffect(() => {
    GetDetailUser(0);
  }, []);
  useEffect(() => {
    // GetDetailUser(0);
    console.log("wdy", dataval);
  }, [dataval]);

  function RouteInit() {
    if (add == "1") {
      return <AddPage />;
    } else if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <>
          <fieldset className="border">
            <legend className="ml-2">Search</legend>
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
                    required={true}
                    label={row?.label}
                    rest={{
                      name: row?.name,
                      placeholder: row?.label,
                      value: dataval[row?.name],
                      type: row?.type,
                      onChange: (e) => {
                        changeHandler(e, row?.type, row?.name);
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
                    isAll={row?.isAll}
                    valMulti={dataval}
                  />
                </div>
              ))}
            </div>
          </fieldset>
          <div className="mt-2 min-w-full table-auto">
            {load ? (
              <TableView
                isTitle={false}
                groups={groups}
                uri={GLOBALURI}
                isEditTable={true}
                isBtnAdd={false}
                isBtnView={false}
                queryString={
                  "&start_date=" +
                  (dataval?.start_date ?? "") +
                  "&end_date=" +
                  (dataval?.end_date ?? "") +
                  "&room_type=" +
                  (GetQueryStr("room_type") ?? "")
                }
                numberNotdecimals={true}
              />
            ) : (
              <>
                <LoadInPage />
              </>
            )}
          </div>
        </>
      );
    }
  }
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {RouteInit()}
    </>
  );
};

export default ListView;
