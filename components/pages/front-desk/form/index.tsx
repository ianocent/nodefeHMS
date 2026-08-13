import React, { useContext, useEffect, useRef, useState } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetNextDay,
  GetPathUri,
  GetQueryParam,
  GetQueryStr,
  GetSelisihDay,
  RouteChange,
  removeItem,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import GuestAdd from "../../guest/form/index";
import CompanyAdd from "../../company-profile/form/index";
import { Value } from "sass";
interface AddviewProps {
  isview?: boolean;
  isType?: string;
}
const AddView = (props: AddviewProps) => {
  const { isview = false, isType = "fit" } = props;
  const GLOBALURI = "/cms/reservation";
  const router = useRouter();
  const ref = useRef(null);
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const [actAuto, setactAuto] = useState("-1");
  const [ispackage, setispackage] = useState(false);
  const [popup, setpopup] = useState(false);
  const [dataguest, setdataguest] = useState<any>([]);
  const [datprice, setdatprice] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const [load, setisload] = useState(false);
  const [namePopUp, setnamePopup] = useState("");

  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({ type_reservation: isType });
  const [datavaled, setDataEd] = useState<any>({});
  const [dataform, setdataform] = useState<any>([
    {
      name: "main",
      data: [
        {
          label: "Guest Search",
          name: "first_name-guest_profile",
          type: "text",
          cols: "col-span-8",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Guest Here.",
          idpost: "guest_profile_id",
          uri: "/cms/profile/guest",
          disable: false,
          AdduRi: "profile/guest/main?parent=82&add=1",
        },
        {
          label: "Type",
          name: "checkbokmulti",
          type: "select-multi",
          cols: "col-span-4",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Walk In", value: "is_walk_in" },
            { label: "House Use", value: "is_house_use" },
            { label: "Complimentary", value: "complimentary" },
          ],
          isAll: false,
          ismulti: false,
          colcheckbox: "col-span-6",
          disable: false,
          value: "",
          valueori: "",
        },
        {
          label: "Company Search",
          name: "name-company",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Company Here.",
          idpost: "company_profile_id",
          uri: "/cms/profile/company",
          disable: false,
          AdduRi: "profile/company/main?parent=83&add=1",
        },
        {
          label: "Title",
          name: "title",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 0,
          disable: false,
        },
        {
          label: "First Name",
          name: "first_name",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 0,
          disable: false,
        },
        {
          label: "Last Name",
          name: "last_name",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          disable: false,
          parent: 0,
        },
        {
          label: "Phone",
          name: "telp",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 0,
          disable: false,
        },
        {
          label: "Email",
          name: "email",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 0,
          disable: false,
        },
        {
          label: "Company",
          name: "name",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 2,
          disable: false,
        },
        {
          label: "",
          name: "checkbokmulti",
          type: "checkbox",
          cols: "col-span-12",
          options: [
            { label: "Pending", value: "is_pending" },
            { label: "Cash On Arrival", value: "cash_on_arrival" },
            { label: "Guaranted", value: "guaranted" },
            { label: "Print", value: "print_status" },
            { label: "Use Allotment", value: "use_allotment" },
          ],
          isAll: false,
          ismulti: true,
          sugestdata: "a",
          colcheckbox: "col-span-2",
          disable: false,
        },
      ],
    },
    {
      name: "main",
      items: [
        {
          data: [
            {
              label: "Room Type",
              name: "name-room_type",
              type: "text",
              cols: "col-span-4",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Type Here.",
              idpost: "room_type_id",
              uri: "/cms/room-type",
              sugestdata: "a",
              value: "",
              valueid: "",
            },
            {
              label: "Room Configuration",
              name: "room_conf",
              type: "checkbox",
              cols: "col-span-4",
              options: [{}],
              isAll: false,
              ismulti: true,
              sugestdata: "a",
              value: [],
            },
            {
              label: "Room",
              name: "name-room",
              type: "text",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Here.",
              idpost: "room_id",
              relate: "0",
              uri: "/cms/room-type/get-room",
              value: "",
              valueid: "",
            },
            {
              label: "",
              name: "checkbokmulti",
              type: "checkbox",
              cols: "col-span-2",
              options: [{ label: "Auto Assign", value: "is_auto_assign_room" }],
              isAll: false,
              ismulti: true,
              sugestdata: "a",
              colcheckbox: "col-span-12",
              value: [{}],
            },
            {
              label: "Check In",
              name: "check_in_date",
              type: "date",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: "",
            },
            {
              label: "ETA",
              name: "eta",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              value: "",
            },
            {
              label: "Check Out",
              name: "check_out_date",
              type: "date",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: "",
            },
            {
              label: "ETD",
              name: "etd",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              value: "",
            },
            {
              label: "Night",
              name: "night",
              type: "number",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "",
            },
            {
              label: "Adult",
              name: "adult",
              type: "number",
              cols: "col-span-1",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "",
            },
            {
              label: "Child",
              name: "child",
              type: "number",
              cols: "col-span-1",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "",
            },
            {
              label: "Extra Bed",
              name: "add_bed",
              type: "number",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "",
            },
            {
              label: "Rate",
              name: "name-rate",
              type: "text",
              cols: "col-span-8",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Rate Here.",
              idpost: "rate_id",
              relate: "0;4;6",
              uri: "/cms/reservation/rate?room_type_id=[0]&check_in_date=[1]&check_out_date=[2]",
              value: "",
              valueid: "",
            },
            {
              label: "QTY",
              name: "qty",
              type: "number",
              cols: "col-span-1",
              options: [{}],
              ismulti: false,
              value: "",
            },
          ],
        },
      ],
    },
    {
      name: "main",
      data: [
        {
          label: "Booking Agent",
          name: "name-booking_agent",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Booking Agent Here.",
          idpost: "booking_agent_id",
          uri: "/cms/profile/company",
          value: "",
          valueid: "",
        },
        {
          label: "Contact Person",
          name: "name-cp",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Booking Agent Here.",
          idpost: "contact_person_id",
          relate: "0",
          uri: "/cms/profile/company-contact?company_id=[0]",
        },
        {
          label: "Market Segment 1",
          name: "market_segment_1",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Market Segment 2",
          name: "market_segment_2",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Market Segment 3",
          name: "market_segment_3",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Market Segment 4",
          name: "market_segment_4",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Source",
          name: "source",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");
  const AddReservation = () => {
    let dataInput = [...dataform];
    dataInput[1].items?.push({
      data: [
        {
          label: "Room Type",
          name: "name-room_type",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Room Type Here.",
          idpost: "room_type_id",
          uri: "/cms/room-type",
          sugestdata: "a",
          value: "",
          valueid: "",
        },
        {
          label: "Room Configuration",
          name: "room_conf",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          isAll: false,
          ismulti: true,
          sugestdata: "a",
          value: [],
        },
        {
          label: "Room",
          name: "name-room",
          type: "text",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Room Here.",
          idpost: "room_id",
          relate: "0",
          uri: "/cms/room-type/get-room",
          value: "",
          valueid: "",
        },
        {
          label: "",
          name: "checkbokmulti",
          type: "checkbox",
          cols: "col-span-2",
          options: [{ label: "Auto Assign", value: "is_auto_assign_room" }],
          isAll: false,
          ismulti: true,
          sugestdata: "a",
          colcheckbox: "col-span-12",
          value: [{}],
        },
        {
          label: "Check In",
          name: "check_in_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: "",
        },
        {
          label: "ETA",
          name: "eta",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "",
        },
        {
          label: "Check Out",
          name: "check_out_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: "",
        },
        {
          label: "ETD",
          name: "etd",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "",
        },
        {
          label: "Night",
          name: "night",
          type: "number",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "",
        },
        {
          label: "Adult",
          name: "adult",
          type: "number",
          cols: "col-span-1",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "",
        },
        {
          label: "Child",
          name: "child",
          type: "number",
          cols: "col-span-1",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "",
        },
        {
          label: "Extra Bed",
          name: "add_bed",
          type: "number",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "",
        },

        {
          label: "Rate",
          name: "name-rate",
          type: "text",
          cols: "col-span-8",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Rate Here.",
          idpost: "rate_id",
          relate: "0;4;6",
          uri: "/cms/reservation/rate?room_type_id=[0]&check_in_date=[1]&check_out_date=[2]",
          value: "",
          valueid: "",
        },
        {
          label: "QTY",
          name: "qty",
          type: GetPathUri(2) == "git" ? "number" : "hidden",
          cols: "col-span-1",
          options: [{}],
          ismulti: false,
          value: "",
        },
      ],
    });

    setdataform([...dataInput]);
  };
  const ActSv = (id, fn, ln, ti, pn, em, type) => {
    setpopup(false);
    // console.log("widy", id + "-" + pn + "-" + ln + "-" + ti + "-" + em);

    if (type == "guest") {
      var objcus = {
        ["guest_profile_id"]: id,
        ["title"]: ti,
        ["first_name"]: fn,
        ["last_name"]: ln,
        ["email"]: em,
        ["telp"]: pn,
        ["first_name-guest_profile"]: fn + " " + ln,
      };
      setData((dataval) => ({
        ...dataval,
        ...objcus,
      }));
    } else {
      var objcompany = {
        ["company_profile_id"]: id,
        ["name"]: fn,
        ["name-company"]: fn + " " + ln,
      };
      setData((dataval) => ({
        ...dataval,
        ...objcompany,
      }));
    }
  };
  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any,
    isArray?: boolean
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
      if (e.target.name == "check_out_date") {
        var objinames = {
          ["night"]: GetSelisihDay(dataval?.check_in_date, e.target.value),
        };
        setData((dataval) => ({
          ...dataval,
          ...objinames,
        }));
      }
      if (e.target.name == "night") {
        var obji = {
          ["check_out_date"]: GetNextDay(
            dataval?.check_in_date,
            e.target.value
          ),
        };
        setData((dataval) => ({
          ...dataval,
          ...obji,
        }));
      }
      if (isArray) {
        // setData({ ...dataval, ["items"]: [e.target.value] });
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
        [name]: e,
      });
      if (e.value == "is_walk_in") {
        let dataInput: any = [...dataform];
        dataInput[0].data[2].disable = !dataInput[0].data[2].disable
          ? true
          : false;
        dataInput[0].data[8].disable = !dataInput[0].data[8].disable
          ? true
          : false;

        setdataform([...dataInput]);
      } else {
        let dataInput: any = [...dataform];
        dataInput[0].data[2].disable = false;
        dataInput[0].data[8].disable = false;
        setdataform([...dataInput]);
      }
      var objselect = {};
      dataform[0].data[1].options?.map((rw) => {
        objselect[rw?.value] = e.value == rw?.value ? true : false;
      });
      setData({ ...dataval, objselect });
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
        if (e.target.value == "is_walk_in") {
          let dataInput: any = [...dataform];
          dataInput[0].data[2].disable = e.target.checked;
          dataInput[0].data[8].disable = e.target.checked;

          setdataform([...dataInput]);
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
    options?: any,
    index?: number,
    datai?: number
  ) => {
    let dataInput: any = [...dataform];
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date" ||
      b == "time"
    ) {
      // console.log("wes", dataInput[1].items[index].data[8].value);
      if (e.target.name == "check_out_date") {
        dataInput[1].items[index].data[8].value = GetSelisihDay(
          dataInput[1].items[index].data[4].value,
          e.target.value
        );
      }
      if (e.target.name == "night") {
        dataInput[1].items[index].data[6].value = GetSelisihDay(
          dataInput[1].items[index].data[4].value,
          e.target.value
        );
      }

      dataInput[1].items[index].data[datai].value = e.target.value;
      if (index == 0 && e.target.name == "check_in_date") {
        setData({ ...dataval, [e.target.name]: e.target.value });
        if (load) {
          setisload(false);
        } else {
          setisload(true);
        }
      }
      if (e.target.name == "check_out_date") {
        setData({ ...dataval, [e.target.name]: e.target.value });
        if (load) {
          setisload(false);
        } else {
          setisload(true);
        }
      }
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }

      dataInput[1].items[index].data[datai].value = e?.value;
    } else if (b == "checkbox") {
      if (ismulti) {
        let valarr = [];
        valarr.push({
          name: e.target.value,
          value: e.target.checked,
        });
        dataform[1].items[index].data[datai].value?.map((row) => {
          valarr.push({
            name: row?.name,
            value: row?.value,
          });
        });
        dataInput[1].items[index].data[datai].value = valarr;
      } else {
        dataInput[1].items[index].data[datai].value = e.target.checked;
      }
    }
    setdataform([...dataInput]);
    // setError("");
  };
  const FinalPOstDat = () => {
    var objpost: any = {};
    objpost = dataval;
    var arrCOl = [];

    dataform[1].items?.map((row: any, i) => {
      var obj = {};
      // console.log("awal", row);
      row?.data?.map((rw, index) => {
        if (rw?.idpost) {
          obj[rw?.name] = rw?.value;
          obj[rw?.idpost] = rw?.valueid;
        } else {
          obj[rw?.name] = rw?.value;
        }
      });
      arrCOl.push(obj);
    });
    objpost.reservation_list = arrCOl;
    return objpost;
  };
  const GetDataAutoComp = async (word, uri, relate: any, ix, ia) => {
    try {
      let getuuri = "";
      if (relate) {
        var relatestr = "" + relate;
        var relatearr = relatestr.split(";");
        relatearr?.map((rw, index) => {
          var repstr = "[" + index + "]";
          uri = uri.replace(
            repstr,
            dataform[1].items[ia].data[relatearr[index]].valueid ??
              dataform[1].items[ia].data[relatearr[index]].value
          );
        });
      }

      getuuri =
        uri.indexOf("?") == -1
          ? (relate
              ? uri + "/" + (dataform[1].items[ia].data[relate].valueid ?? 0)
              : uri) +
            "?search=" +
            word
          : uri + "" + uri + "&search=" + word;

      if (uri == "/cms/room-type/get-room") {
        var prmsrc = "";
        dataform[1].items[ia].data[1].value?.map((rw) => {
          prmsrc =
            "&idx_" + rw?.name + "=" + (rw?.value ? "1" : "0") + "" + prmsrc;
        });
        getuuri =
          getuuri +
          "" +
          prmsrc +
          "&check_in_date=" +
          dataform[1].items[ia].data[4].value +
          "&check_out_date=" +
          dataform[1].items[ia].data[6].value +
          "&folio_id=" +
          GetQueryStr("data");
      }

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
      // console.log(data?.data?.length);
      return;
    } catch (error) {
      //console.log("debug",error);
      return;
    }
  };
  const GetRate = async () => {
    // console.log("data", FinalPOstDat());
    try {
      setisload(false);
      let urisave = "/cms/reservation/charge";
      let mth = "POST";
      const raw = JSON.stringify(FinalPOstDat());
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
        setisload(true);
        setdatprice(saveprocess);
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      // console.log("erro", error);
      setloading(false);
    }
  };
  const GetRoomConfig = async (ix, ia, id) => {
    if (id) {
      try {
        // console.log(dataval);

        let getuuri = "/cms/room-type/get-configuration/" + id;

        const data: any = await FetchData(
          getuuri,
          "GET",
          "",
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );
        if (data?.code == "200") {
          // console.log("sukses", dataform[1].items[ia].data[1].name);
          let dataInput = [...dataform];
          dataInput[1].items[ia].data[1].options = data?.data;
          setdataform([...dataInput]);
        }

        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }
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
    dataform[idat]?.data?.map((row: any, index) => {
      var obj = {
        [row?.name]: rw[row?.name] ?? "",
      };
      if (row?.name == "title") {
        obj = {
          [row?.name]: rw[row?.name]?.label ?? "",
        };
      }
      if (row?.sugestdata == n && rw[row?.name]) {
        // console.log("wid" + ix + "-" + index + "-" + row?.name);
        if (ix == row?.parent) {
          setData((dataval) => ({
            ...dataval,
            ...obj,
          }));
        }
      }
    });
    if (ia != -1) {
      let dataInput: any = [...dataform];
      dataInput[1].items[ia].data[ix].valueid = rw?.id;
      dataInput[1].items[ia].data[ix].value = rw[names[0]];
      setdataform([...dataInput]);
    }
    setTimeout(() => {
      if (name == "name-rate") {
        GetRate();
      }
      if (name == "name-room_type") {
        GetRoomConfig(ix, ia, rw?.id);
      }
    }, 800);
  };
  const OnSave = async () => {
    // console.log("widylog", FinalPOstDat());
    setloading(true);
    try {
      let urisave = GLOBALURI + "/create";
      let mth = "POST";
      const raw = JSON.stringify(FinalPOstDat());
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
        router.replace({
          pathname: window.location.pathname,
          query: { parent: GetQueryStr("parent") },
        });
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
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
                    <ButtonSubmit
                      label="Add"
                      onCreate={() => {
                        setpopup(true);
                        setnamePopup(name);
                        setactAuto("-1");
                      }}
                    />
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
  const ContentPopUp = (key) => {
    return (
      <>
        <div className=" m-4">
          <div className="p-2 font-bold">
            <h1 className="capitalize">
              {namePopUp == "first_name-guest_profile"
                ? "Guest Profil"
                : "Company"}
            </h1>
          </div>
          {namePopUp == "first_name-guest_profile" ? (
            <>
              <GuestAdd
                isPopup={true}
                nameinit={dataval["first_name-guest_profile"] ?? ""}
                ActionSv={(id, fn, ln, ti, pn, em) =>
                  ActSv(id, fn, ln, ti, pn, em, "guest")
                }
              />
            </>
          ) : (
            <>
              <CompanyAdd
                isPopup={true}
                nameinit={dataval["name-company"] ?? ""}
                ActionSv={(id, nm) => ActSv(id, nm, "", "", "", "", "company")}
              />
            </>
          )}
        </div>
      </>
    );
  };
  const GetDataDetail = async () => {
    try {
      let getuuri = GLOBALURI + "/create";
      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data?.code == "200") {
        let dataInput = [...dataform];
        dataInput[2].data[2].options = data?.master?.market_segment_1;
        dataInput[2].data[3].options = data?.master?.market_segment_2;
        dataInput[2].data[4].options = data?.master?.market_segment_3;
        dataInput[2].data[5].options = data?.master?.market_segment_4;
        setdataform([...dataInput]);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const [parent, setparent] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    // console.log(GetPathUri(2));
    if (GetPathUri(2) == "fit") {
      let dataForms: any = [...dataform];
      dataForms[1].items[0].data[13].type = "hidden";
      setdataform([...dataForms]);
    } else {
      let dataForms: any = [...dataform];
      dataForms[1].items[0].data[13].type = "number";
      setdataform([...dataForms]);
    }
    setparent(idparent);
    GetDataDetail();
    if (idreq) {
      // GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      // GetDetailUser(0);
      setidusr("0");
    }
  }, []);
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        setactAuto("-1");
        setpopup(false);
        // setoverflow(true);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  return (
    <>
      <Seo title={"Management " + layout?.title} />
      {popup ? (
        <div className="overlay">
          <div
            ref={ref}
            className="w-[75%] overflow-auto relative h-[650px] bg-gray-200 z-20 top-2 xl:top-[110px] left-[20%]"
          >
            {ContentPopUp(
              new URLSearchParams(window.location.search).get("key")
            )}
          </div>
        </div>
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
            <div className="col-span-8 ">
              <fieldset className="border">
                <legend className="">Guest Profile</legend>
                <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any, index) => (
                    <>
                      {row?.type != "hidden" ? (
                        <div className={row?.cols + " relative "}>
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
                              disabled: row?.disable,
                              autoComplete: row?.isAutoComp ? "off" : "on",
                              name: row?.name,
                              placeholder: row?.placeholder ?? row?.label,
                              value: dataval[row?.name],
                              type: row?.type,
                              onChange: (e) => {
                                changeHandler(e, row?.type, row?.name);
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
                              onFocus: () => {
                                if (row?.relate) {
                                  setactAuto("1" + index);
                                  GetDataAutoComp(
                                    "",
                                    row?.uri,
                                    row?.relate,
                                    index,
                                    -1
                                  );
                                }
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
                              dataval[row?.name] ?? datavaled[row?.name]
                            }
                            options={row?.options}
                            isMulti={row?.ismulti}
                            valuename={row?.name}
                            isAll={row?.isAll}
                            colspan={row?.colcheckbox}
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
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </div>
              </fieldset>
              <div className="w-full flex mt-2 mb-2 justify-end">
                <ButtonSubmit
                  label="Add Data Reservation"
                  onCreate={() => {
                    AddReservation();
                  }}
                />
              </div>
              {dataform[1].items?.map((rw: any, i) => (
                <>
                  <fieldset className="border min-w-full table-auto">
                    <legend className="">Data Reservation #{i + 1}</legend>
                    <div className="w-full flex justify-end">
                      {i > -1 ? (
                        <>
                          <div
                            className="text-red font-bold cursor-pointer"
                            onClick={() => {
                              let dataInput = [...dataform];
                              dataInput[1].items = removeItem(
                                dataInput[1].items,
                                i
                              );
                              // console.log(removeItem(dataform[1].items, i));
                              setdataform([...dataInput]);
                            }}
                          >
                            Delete
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-2 mr-2">
                      {rw?.data?.map((row: any, index) => (
                        <>
                          {row?.type != "hidden" ? (
                            <div className={row?.cols + " relative "}>
                              <InputMain
                                typeInput={
                                  row?.type == "text" ||
                                  row?.type == "number" ||
                                  row?.type == "date" ||
                                  row?.type == "time"
                                    ? "base"
                                    : row?.type
                                }
                                error={false}
                                required={true}
                                label={row?.label}
                                rest={{
                                  autoComplete: row?.isAutoComp ? "off" : "on",
                                  name: row?.name,
                                  placeholder: row?.placeholder ?? row?.label,
                                  value: row?.value,
                                  type: row?.type,
                                  min:
                                    row?.name == "check_out_date"
                                      ? dataform[1].items[i].data[4].value
                                      : i > 0 && row?.name == "check_in_date"
                                      ? dataform[1].items[i - 1].data[6].value
                                      : "",
                                  onChange: (e) => {
                                    changeHandlera(
                                      e,
                                      row?.type,
                                      row?.name,
                                      false,
                                      {},
                                      i,
                                      index
                                    );
                                  },
                                  onKeyUp: (e: any) => {
                                    if (row?.isAutoComp) {
                                      if (e.target?.value?.length > 3) {
                                        setactAuto("1" + index + "-" + i);
                                        GetDataAutoComp(
                                          e.target?.value,
                                          row?.uri,
                                          row?.relate,
                                          index,
                                          i
                                        );
                                      } else {
                                        setactAuto("-1");
                                      }
                                    }
                                  },
                                  onFocus: () => {
                                    setactAuto("1" + index + "-" + i);
                                    GetDataAutoComp(
                                      "",
                                      row?.uri,
                                      row?.relate,
                                      index,
                                      i
                                    );
                                  },
                                }}
                                restArea={{
                                  placeholder: row?.label,
                                  name: row?.name,
                                  value: row?.value,
                                  onChange: (e) => {
                                    changeHandlera(
                                      e,
                                      row?.type,
                                      row?.name,
                                      false,
                                      {},
                                      i,
                                      index
                                    );
                                  },
                                }}
                                onChangeSel={(e) => {
                                  changeHandlera(
                                    e,
                                    row?.type,
                                    row?.name,
                                    row?.ismulti,
                                    row?.options,
                                    i,
                                    index
                                  );
                                }}
                                valueSel={
                                  row?.ismulti
                                    ? dataval[row?.name + "_ori"] ??
                                      datavaled[row?.name]
                                    : dataval[row?.name] ?? datavaled[row?.name]
                                }
                                options={row?.options}
                                isMulti={row?.ismulti}
                                isAll={row?.isAll}
                                valuename={row?.name}
                                colspan={row?.colcheckbox}
                              />
                              {row?.isAutoComp &&
                              actAuto == "1" + index + "-" + i ? (
                                <>
                                  {ListTblGuest(
                                    row?.idpost,
                                    1,
                                    row?.name,
                                    index,
                                    i,
                                    row?.AdduRi ?? false
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </div>
                  </fieldset>
                </>
              ))}
            </div>
            <div className="col-span-4 ">
              <div>
                <div className="mb-2">
                  {dataval?.check_in_date && dataval?.check_out_date && load ? (
                    <>
                      <TableView
                        uri="/cms/reservation/available-room"
                        queryString={
                          "&check_in_date=" +
                          dataval?.check_in_date +
                          "&check_out_date=" +
                          dataval?.check_out_date
                        }
                        groups=""
                        isEditTable={false}
                        isTitle={false}
                        isDeleted={false}
                        isBtnAdd={false}
                        isPageing={false}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <fieldset className="border min-w-full table-auto">
                  <legend className="">Price</legend>

                  <div className="grid grid-cols-12 gap-2 ml-2 mb-4 mt-4 mr-2">
                    <div className="col-span-4 font-bold">#</div>
                    <div className="col-span-4 font-bold">Dates</div>
                    <div className="col-span-4 font-bold">Rate</div>
                    {datprice?.data?.date?.map((row, index) => (
                      <>
                        <div className="col-span-4">{index + 1}</div>
                        <div className="col-span-4">{row?.date}</div>
                        <div className="col-span-4">{row?.charge}</div>
                      </>
                    ))}

                    <div className="col-span-12 border-b-2"></div>

                    {datprice?.data?.charge?.map((row, index) => (
                      <>
                        <div className="col-span-4"></div>
                        <div className="col-span-4">{row?.label}</div>
                        <div className="col-span-4">{row?.value}</div>
                      </>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="border min-w-full table-auto">
                  <legend className="">Data Others</legend>
                  <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                    {dataform[2]?.data?.map((row: any, index) => (
                      <>
                        {row?.type != "hidden" ? (
                          <div className={row?.cols + " relative "}>
                            <InputMain
                              typeInput={
                                row?.type == "text" ||
                                row?.type == "number" ||
                                row?.type == "date" ||
                                row?.type == "time"
                                  ? "base"
                                  : row?.type
                              }
                              error={false}
                              required={true}
                              label={row?.label}
                              rest={{
                                name: row?.name,
                                placeholder: row?.placeholder ?? row?.label,
                                value:
                                  dataval[row?.name] ?? datavaled[row?.name],
                                type: row?.type,
                                onChange: (e) => {
                                  changeHandler(e, row?.type, row?.name);
                                },
                                onKeyUp: (e: any) => {
                                  if (row?.isAutoComp) {
                                    if (e.target?.value?.length > 3) {
                                      setactAuto("2" + index);
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
                              isAll={row?.isAll}
                              valuename={row?.name}
                            />
                            {row?.isAutoComp && actAuto == "2" + index ? (
                              <>
                                {ListTblGuest(
                                  row?.idpost,
                                  2,
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
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"fixed w-full bg-white py-2 px-4 bottom-0 left-0 "}>
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
