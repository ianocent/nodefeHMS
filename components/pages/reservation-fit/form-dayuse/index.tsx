import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
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
  GetCurrentDate,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import GuestAdd from "../../guest/form/index";
import CompanyAdd from "../../company-profile/form/index";
import { IconSpiner } from "../../../common/icon/CardIcon";
import { Value } from "sass";
import { toast } from "react-toastify";
import { useFormPermission } from "../../../../hooks/useFormPermission";
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
  const [popup, setpopup] = useState(false);
  const [dataguest, setdataguest] = useState<any>([]);
  const [datprice, setdatprice] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const [load, setisload] = useState(true);
  const [namePopUp, setnamePopup] = useState("");
  const [checkbokmulti, setcheckbokmulti] = useState([]);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({ type_reservation: isType });
  const [businessDate, setbusinessDate] = useState("");
  const [dataWalkIn, setdataWalkIn] = useState<any>([]);
  const [dataInHouse, setdataInHouse] = useState<any>([]);
  const [printrate, setprintrate] = useState<any>({});
  const [openRoom, setOpenroom] = useState<any>(false);
  const { canCreate, canUpdate } = useFormPermission(63);
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
          uri: "/cms/profile/guest?reservation=1",
          disable: false,
          AdduRi: "profile/guest/main?parent=82&add=1",
          required: true,
        },
        {
          label: "Type",
          name: "typemulti",
          type: "select-multi",
          cols: "col-span-4",
          options: [{}],
          isAll: false,
          ismulti: false,
          colcheckbox: "col-span-6",
          disable: false,
          value: "",
          valueori: "",
          required: true,
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
          uri: "/cms/profile/company?reservation=1",
          disable: false,
          AdduRi: "profile/company/main?parent=83&add=1",
          required: true,
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
          disable: true,
          required: true,
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
          disable: true,
          required: true,
        },
        {
          label: "Last Name",
          name: "last_name",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          disable: true,
          parent: 0,
          required: true,
        },
        {
          label: "Phone",
          name: "mobile_phone",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 0,
          disable: true,
          required: true,
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
          disable: true,
          required: true,
        },
        {
          label: "Status Guest",
          name: "guest_status",
          type: "select-multi",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 0,
          disable: false,
          required: true,
        },
        {
          label: "Company",
          name: "name",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          parent: 2,
          disable: false,
          required: true,
        },
        {
          label: "Remark",
          name: "remark",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          parent: 2,
          disable: false,
          required: false,
        },
        {
          label: "",
          name: "checkbokmulti",
          type: "checkbox",
          cols: "col-span-12",
          options: [
            { label: "Pending", value: "is_pending" },
            { label: "Cash On Arrival", value: "cash_on_arrival" },
            { label: "Guaranteed", value: "guaranted" },
            { label: "Print Rate", value: "print_status" },
            { label: "Use Allotment", value: "use_allotment" },
            { label: "Incognito", value: "is_incognito" },
          ],
          isAll: false,
          ismulti: true,
          sugestdata: "a",
          colcheckbox: "col-span-2",
          disable: false,
          required: false,
        },
      ],
    },
    {
      name: "main",
      items: [
        {
          data: [
            {
              label: "Check In",
              name: "check_in_date",
              type: "date",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: businessDate,
              required: true,
            },
            {
              label: "ETA",
              name: "eta",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              value: "12:00",
              required: false,
            },
            {
              label: "Check Out",
              name: "check_out_date",
              type: "date",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: "",
              required: true,
            },
            {
              label: "ETD",
              name: "etd",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              value: "12:00",
              required: false,
              disable: true,
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
              required: true,
              disable: true,
            },
            {
              label: "Adult",
              name: "adult",
              type: "number",
              cols: "col-span-6 md:col-span-2 lg:col-span-1",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "1",
              required: true,
            },
            {
              label: "Child",
              name: "child",
              type: "number",
              cols: "col-span-6 md:col-span-2 lg:col-span-1",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "0",
              required: true,
            },
            {
              label: "Extra Bed",
              name: "add_bed",
              type: "number",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "0",
              required: false,
            },
            {
              label: "Rate Code",
              name: "name-rate",
              type: "text",
              cols: "col-span-8",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Rate Here.",
              idpost: "rate_id",
              relate: "company_profile_id;0;2",
              uri: "/cms/reservation/rate-by-company-id?company_profile_id=[0]&check_in_date=[1]&check_out_date=[2]&day_use=1",
              value: "",
              valueid: "",
              required: true,
            },
            {
              label: "Room Type",
              name: "name-room_type",
              type: "text",
              cols: "col-span-8",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Type Here.",
              idpost: "room_type_id",
              relate: "0;2;8",
              uri: "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]&rate_id=[2]",
              sugestdata: "a",
              value: "",
              valueid: "",
              required: true,
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
              required: false,
            },
            {
              label: "Room",
              name: "name-room",
              type: "text",
              cols: "col-span-8",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Here.",
              idpost: "room_id",
              relate: "9",
              uri: "/cms/room-type/get-room",
              value: "",
              valueid: "",
              required: false,
            },
            {
              label: "",
              name: "is_auto_assign_room",
              type: "checkbox",
              cols: "col-span-4",
              options: [{ label: "Auto Assign", value: "is_auto_assign_room" }],
              isAll: false,
              ismulti: true,
              sugestdata: "a",
              colcheckbox: "col-span-12",
              value: [{}],
              required: true,
            },
            {
              label: "Package",
              name: "name-package",
              type: "text",
              cols: "col-span-8",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Package Here.",
              idpost: "package_id",
              relate: "rate_id",
              uri: "/cms/reservation/package-by-rate-id?rate_id=[0]",
              value: "",
              valueid: "",
              disable: false,
              isHideVR: true,
            },
            {
              label: "Qty",
              name: "quantity",
              type: "number",
              cols: "col-span-4",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "0",
              required: true,
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
          required: false,
        },
        {
          label: "Contact Person",
          name: "contact_person_id",
          type: "select-multi",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Booking Agent Here.",
          idpost: "contact_person_id",
          relate: "booking_agent_id",
          uri: "/cms/profile/company-contact?company_id=[0]",
          required: false,
          value: "",
        },
        {
          label: "Market Segment 1",
          name: "market_segment_1",
          type: "select-multi",
          cols: "col-span-12 xl:col-span-6",
          sugestdata: "a",
          parent: 2,
          options: [{}],
          ismulti: false,
        },
        {
          label: "Market Segment 2",
          name: "market_segment_2",
          type: "select-multi",
          sugestdata: "a",
          parent: 2,
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Market Segment 3",
          name: "market_segment_3",
          type: "select-multi",
          sugestdata: "a",
          parent: 2,
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Market Segment 4",
          name: "market_segment_4",
          type: "select-multi",
          sugestdata: "a",
          parent: 2,
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Source",
          name: "source",
          type: "select-multi",
          sugestdata: "a",
          parent: 2,
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Booking No",
          name: "booking_no",
          type: "text",
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
          required: false,
        },
        {
          label: "Promo Code",
          name: "promo_code",
          type: "text",
          cols: "col-span-12 xl:col-span-6",
          options: [{}],
          ismulti: false,
          required: false,
        },
      ],
    },
  ]);

  const [idusr, setidusr] = useState("0");
  const AddReservation = () => {
    let dataInput = [...dataform];
    let lastdata = dataInput[1].items[dataInput[1].items.length - 1];
    // check if check in date in and check out date is not empty
    if (lastdata.data[0].value == "" || lastdata.data[2].value == "") {
      toast("Please fill in the check in date and check out date", {
        autoClose: 6000,
        type: "error",
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    dataInput[1].items?.push({
      data: [
        {
          label: "Check In",
          name: "check_in_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: lastdata.data[2].value,
          required: true,
        },
        {
          label: "ETA",
          name: "eta",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "12:00",
        },
        {
          label: "Check Out",
          name: "check_out_date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: GetNextDay(lastdata.data[2].value, 1),
          required: true,
        },
        {
          label: "ETD",
          name: "etd",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "12:00",
        },
        {
          label: "Night",
          name: "night",
          type: "number",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "1",
          disable: true,
          required: true,
        },
        {
          label: "Adult",
          name: "adult",
          type: "number",
          cols: "col-span-6 md:col-span-2 lg:col-span-1",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "1",
          required: true,
        },
        {
          label: "Child",
          name: "child",
          type: "number",
          cols: "col-span-6 md:col-span-2 lg:col-span-1",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "0",
          required: true,
        },
        {
          label: "Extra Bed",
          name: "add_bed",
          type: "number",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "0",
          required: true,
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
          relate: "company_profile_id;0;2",
          uri: "/cms/reservation/rate-by-company-id?company_profile_id=[0]&check_in_date=[1]&check_out_date=[2]&type=dayuse",
          value: "",
          valueid: "",
          required: true,
        },

        {
          label: "Room Type",
          name: "name-room_type",
          type: "text",
          cols: "col-span-8",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Room Type Here.",
          idpost: "room_type_id",
          relate: "0;2",
          uri: "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]",
          sugestdata: "a",
          value: "",
          valueid: "",
          required: true,
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
          cols: "col-span-8",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Room Here.",
          idpost: "room_id",
          relate: "9",
          uri: "/cms/room-type/get-room",
          value: "",
          valueid: "",
          required: true,
        },
        {
          label: "",
          name: "is_auto_assign_room",
          type: "checkbox",
          cols: "col-span-4",
          options: [{ label: "Auto Assign", value: "is_auto_assign_room" }],
          isAll: false,
          ismulti: true,
          sugestdata: "a",
          colcheckbox: "col-span-12",
          value: [{}],
        },
      ],
    });

    setdataform([...dataInput]);
  };
  const ActSv = (id, fn, ln, ti, pn, em, type, market = [], source = []) => {
    setpopup(false);

    if (type == "guest") {
      var objcus = {
        ["guest_profile_id"]: id,
        ["title"]: ti,
        ["first_name"]: fn,
        ["last_name"]: ln,
        ["email"]: em,
        ["mobile_phone"]: pn,
        ["first_name-guest_profile"]: fn + " " + ln,
        ["guest_status"]: market,
        ["guest_status_ori"]: market,
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
      market.map((rw, index) => {
        objcompany["market_segment_" + (index + 1)] = rw;
        objcompany["market_segment_" + (index + 1) + "_ori"] = rw;
      });
      source.map((rw, index) => {
        objcompany["source"] = rw;
        objcompany["source_ori"] = rw;
      });
      setData((dataval) => ({
        ...dataval,
        ...objcompany,
      }));
    }
  };

  const removeItemMulti = (item) => {
    setcheckbokmulti((prevState) =>
      prevState.filter((prevItem) => prevItem !== item)
    );
  };
  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any,
    isArray?: boolean
  ) => {
    // setprintrate({});
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date" ||
      b == "time"
    ) {
      let objinames = {};
      objinames = {
        [e.target.name]: e.target.value,
      };
      // console.log(e.target.value);
      setData((dataval) => ({
        ...dataval,
        ...objinames,
      }));
    } else if (b == "select-multi" || b == true) {
      if (name == "checkbokmulti") {
        dataform[0].data[1].options?.map((rw) => {
          removeItemMulti(rw?.value);
        });

        setcheckbokmulti([...checkbokmulti, e.value]);
      }
      setData({
        ...dataval,
        [name + "_ori"]: e,
        [name]: e,
      });
      // alert(e.value);
      if (
        e.value == "is_walk_in" ||
        e.value == "is_house_use" ||
        e.value == "complimentary"
      ) {
        // let dataInput: any = [...dataform];
        setTimeout(() => {
          GetDataAutoComp(
            "{selected}",
            dataform[1].items[0].data[8].uri,
            dataform[1].items[0].data[8].relate,
            8,
            0,
            e.value
          );
        }, 1000);

        if (e.value == "is_walk_in") {
          var objcompany = {
            ["company_profile_id"]: dataWalkIn?.id,
            ["name"]: dataWalkIn?.name,
            ["name-company"]: dataWalkIn?.name,
            ["market_segment_1"]: dataWalkIn?.market_segment_1,
            ["market_segment_1_ori"]: dataWalkIn?.market_segment_1,
            ["market_segment_2"]: dataWalkIn?.market_segment_2,
            ["market_segment_2_ori"]: dataWalkIn?.market_segment_2,
            ["market_segment_3"]: dataWalkIn?.market_segment_3,
            ["market_segment_3_ori"]: dataWalkIn?.market_segment_3,
            ["market_segment_4"]: dataWalkIn?.market_segment_4,
            ["market_segment_4_ori"]: dataWalkIn?.market_segment_4,
            ["source"]: dataWalkIn?.source,
            ["source_ori"]: dataWalkIn?.source,
          };
          setData((dataval) => ({
            ...dataval,
            ...objcompany,
          }));
          let dataInput: any = [...dataform];
          var sumdate = GetNextDay(datalocal?.data?.bussinesDate, 1);
          dataInput[1].items[0].data[0].value = datalocal?.data?.bussinesDate;
          dataInput[1].items[0].data[2].value = sumdate;
          dataInput[1].items[0].data[4].value = 1;
          dataInput[0].data[2].disable = true;
          dataInput[0].data[8].disable = true;

          setdataform([...dataInput]);
        } else if (e.value == "is_house_use") {
          var objcompany = {
            ["company_profile_id"]: dataInHouse?.id,
            ["name"]: dataInHouse?.name,
            ["name-company"]: dataInHouse?.name,
            ["market_segment_1"]: dataInHouse?.market_segment_1,
            ["market_segment_1_ori"]: dataInHouse?.market_segment_1,
            ["market_segment_2"]: dataInHouse?.market_segment_2,
            ["market_segment_2_ori"]: dataInHouse?.market_segment_2,
            ["market_segment_3"]: dataInHouse?.market_segment_3,
            ["market_segment_3_ori"]: dataInHouse?.market_segment_3,
            ["market_segment_4"]: dataInHouse?.market_segment_4,
            ["market_segment_4_ori"]: dataInHouse?.market_segment_4,
            ["source"]: dataInHouse?.source,
            ["source_ori"]: dataInHouse?.source,
          };
          setData((dataval) => ({
            ...dataval,
            ...objcompany,
          }));
          let dataInput: any = [...dataform];
          var sumdate = GetNextDay(datalocal?.data?.bussinesDate, 1);
          dataInput[1].items[0].data[0].value = datalocal?.data?.bussinesDate;
          dataInput[1].items[0].data[2].value = sumdate;
          dataInput[1].items[0].data[4].value = 1;
          dataInput[0].data[2].disable = true;
          dataInput[0].data[8].disable = true;
          setdataform([...dataInput]);
        } else if (e.value == "complimentary") {
          let dataInput: any = [...dataform];
          var sumdate = GetNextDay(datalocal?.data?.bussinesDate, 1);
          dataInput[1].items[0].data[0].value = datalocal?.data?.bussinesDate;
          dataInput[1].items[0].data[2].value = sumdate;
          dataInput[1].items[0].data[4].value = 1;
          dataInput[0].data[2].disable = false;
          dataInput[0].data[8].disable = false;
          setdataform([...dataInput]);
        } else {
        }

        // setdataform([...dataInput]);
      } else if (e.value == "normal") {
        let dataInput: any = [...dataform];
        dataInput[0].data[2].disable = false;
        dataInput[0].data[8].disable = false;
        dataInput[1].items[0].data[0].value = "";
        dataInput[1].items[0].data[2].value = "";
        dataInput[1].items[0].data[4].value = "";
        setdataform([...dataInput]);
      }
      // var objselect = {};
      // dataform[0].data[1].options?.map((rw) => {
      //   objselect[rw?.value] = e.value == rw?.value ? true : false;
      // });
      // setData({ ...dataval, objselect });
    } else if (b == "checkbox") {
      if (ismulti) {
        if (name == "checkbokmulti") {
          if (e.target.checked == true) {
            setcheckbokmulti([...checkbokmulti, e.target.value]);
          } else {
            removeItemMulti(e.target.value);
          }
          //console.log(e.target.value);
        } else {
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
          if (e.target.value == "is_house_use") {
            let dataInput: any = [...dataform];
            dataInput[0].data[2].disable = e.target.checked;
            dataInput[0].data[8].disable = e.target.checked;

            setdataform([...dataInput]);
          }
        }
      } else {
        setData({ ...dataval, [name]: e.target.checked });
      }
    }

    // setError("");
  };

  useEffect(() => {
    setData({ ...dataval, ["checkbokmulti"]: checkbokmulti });
    // console.log(checkbokmulti);
  }, [checkbokmulti]);

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
      let objinames: any = {};
      if (e.target.name == "check_out_date") {
        return;
        dataInput[1].items[index].data[4].value = GetSelisihDay(
          dataInput[1].items[index].data[0].value,
          e.target.value
        );
      }
      if (e.target.name == "night") {
        return;
        dataInput[1].items[index].data[2].value = GetNextDay(
          dataInput[1].items[index].data[0].value,
          e.target.value
        );
        objinames = {
          [e.target.name]: e.target.value,
          ["check_out_date"]: dataInput[1].items[index].data[0].value,
        };
      }

      if (e.target.name == "check_in_date") {
        if (
          dataInput[1].items[index].data[2].value == "" ||
          dataInput[1].items[index].data[2].value == null ||
          dataInput[1].items[index].data[2].value == 0
        ) {
          dataInput[1].items[index].data[2].value = e.target.value;
        }
        dataInput[1].items[index].data[4].value = 1;
        dataInput[1].items[index].data[2].value = e.target.value;
        objinames = {
          [e.target.name]: e.target.value,
          ["check_out_date"]: e.target.value,
        };
      }
      dataInput[1].items[index].data[datai].value = e.target.value;

      if (index == 0 && e.target.name == "check_in_date") {
        setData({ ...dataval, ...objinames });
        if (load) {
          setisload(false);
        } else {
          setisload(true);
        }
      } else if (e.target.name == "check_out_date") {
        setData({ ...dataval, ...objinames });
        if (load) {
          setisload(false);
        } else {
          setisload(true);
        }
      } else if (e.target.name == "night") {
        setData({ ...dataval, ...objinames });
        if (load) {
          setisload(false);
        } else {
          setisload(true);
        }
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

      dataInput[1].items[index].data[datai].value = e?.value;
    } else if (b == "checkbox") {
      if (ismulti) {
        if (e.target.checked == true) {
          let valarr = [];
          valarr.push({
            name: e.target.value,
            value: e.target.checked,
          });
          if (e.target.name != "room_conf") {
            dataform[1].items[index].data[datai].value?.map((row) => {
              valarr.push({
                name: row?.name,
                value: row?.value,
              });
            });
          }

          dataInput[1].items[index].data[datai].value = valarr;
        } else {
          let valarr = [];
          if (e.target.name == "room_conf") {
            dataform[1].items[index].data[datai].value?.map((row) => {
              if (row?.name != e.target.name) {
                valarr.push({
                  name: row?.name,
                  value: row?.value,
                });
              }
            });
          }
          dataInput[1].items[index].data[datai].value = valarr;
        }
      } else {
        dataInput[1].items[index].data[datai].value = e.target.checked;
      }
    }

    setdataform([...dataInput]);

    // setError("");
  };

  useEffect(() => {
    if (
      dataval?.quantity &&
      dataval?.check_in_date &&
      dataval?.check_out_date &&
      dataval["name-rate"] &&
      dataval.package_id &&
      dataval.room_type_id
    ) {
      GetRate();
    }

    if (dataval?.time_package && dataval?.quantity) {
      let dataInput = [...dataform];
      let etaValue = dataInput[1].items[0].data[1].value; // ETA value
      if (etaValue) {
        // Parse ETA time
        const etaTime = new Date(`2000-01-01T${etaValue}:00`);

        // Add duration in minutes to ETA
        etaTime.setMinutes(
          etaTime.getMinutes() + dataval?.time_package * dataval?.quantity
        );

        // Format as HH:mm
        const hours = String(etaTime.getHours()).padStart(2, "0");
        const minutes = String(etaTime.getMinutes()).padStart(2, "0");
        const etdValue = `${hours}:${minutes}`;

        // Update ETD value
        dataInput[1].items[0].data[3].value = etdValue;

        // Update dataval state
        setData({
          ...dataval,
          etd: etdValue,
        });
        setdataform(dataInput);
      }
    }
  }, [
    dataval?.quantity,
    dataval?.check_in_date,
    dataval?.check_out_date,
    dataval["name-rate"],
    dataval.package_id,
    dataval.room_type_id,
  ]);

  const FinalPOstDat = () => {
    var objpost: any = {};
    objpost = dataval;
    var arrCOl = [];

    dataform[1].items?.map((row: any, i) => {
      var obj = {};
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
    objpost.type_reservation = isType;
    return objpost;
  };
  const GetDataAutoComp = async (
    word,
    uri,
    relate: any,
    ix,
    ia,
    ftype?: string
  ) => {
    try {
      var words = word;
      if (word == "{selected}") {
        words = "";
      }
      setloading(true);
      let getuuri = "";
      if (relate) {
        var relatestr = "" + relate;
        var relatearr = relatestr.split(";");

        relatearr?.map((rw, index) => {
          var repstr = "[" + index + "]";
          uri = uri.replace(
            repstr,
            dataval[relatearr[index]] ??
              (rw != "8"
                ? dataform[1].items[ia].data[relatearr[index]]?.value ?? 0
                : dataform[1].items[ia].data[rw]?.valueid)
          );
        });
      }

      getuuri =
        uri.indexOf("?") == -1
          ? (relate
              ? uri + "/" + (dataform[1].items[ia].data[relate]?.valueid ?? 0)
              : uri) +
            "?search=" +
            words
          : uri +
            "&search=" +
            words +
            "&type_rsv=" +
            (ftype ?? dataval?.typemulti?.value);

      if (uri == "/cms/room-type/get-room") {
        var prmsrc = "";
        dataform[1].items[ia].data[10].value?.map((rw) => {
          prmsrc =
            "&idx_" + rw?.name + "=" + (rw?.value ? "1" : "0") + "" + prmsrc;
        });
        getuuri =
          getuuri +
          "" +
          prmsrc +
          "&check_in_date=" +
          dataform[1].items[ia].data[0].value +
          "&check_out_date=" +
          dataform[1].items[ia].data[2].value +
          "&reservation=1&folio_id=" +
          GetQueryStr("data");
      }
      if (uri == "/cms/profile/company?reservation=1") {
        getuuri =
          uri.indexOf("?") == -1
            ? (relate
                ? uri + "/" + (dataform[1].items[ia].data[relate]?.valueid ?? 0)
                : uri) +
              "?search=" +
              words
            : uri +
              "&search=" +
              words +
              "&guest_id=" +
              dataval?.guest_profile_id;
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
      if (data?.code == 200) {
        if (word == "{selected}") {
          onSelecteda(data?.data[0], "a", "rate_id", 0, "name-rate", 8, 0);
        }
        setdataguest(data);
        setloading(false);
      } else {
        //setdataguest(data);
        setloading(false);
      }

      return;
    } catch (error) {
      console.log("debug", error);
      return;
    }
  };
  const GetRate = async () => {
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
      console.log("erro", error);
      setloading(false);
    }
  };
  const GetCp = async (id) => {
    try {
      let urisave = "/cms/profile/company/contactPerson/" + id;
      let mth = "GET";
      const raw = JSON.stringify(FinalPOstDat());

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
        // console.log("wdy", saveprocess?.data[0]);
        let datain = [...dataform];
        datain[2].data[1].options = saveprocess?.data;
        datain[2].data[1].value = saveprocess?.data[0];
        setdataform(datain);

        setData((dataval) => ({
          ...dataval,
          contact_person_id_ori: saveprocess?.data[0],
        }));
      } else {
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const GetRoomConfig = async (ix, ia, id) => {
    if (id) {
      try {
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
          let dataInput = [...dataform];
          dataInput[1].items[ia].data[10].options = data?.data;
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
    // console.log(name);
    var names = name.split("-");
    if (name == "name-booking_agent") {
      GetCp(rw?.id);
    }
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
    if (name != "name-booking_agent") {
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
            // console.log(row?.sugestdata);
            if (ix == row?.parent) {
              setData((dataval) => ({
                ...dataval,
                ...obj,
              }));
            }
          }
        });
      });
    }

    if (ia != -1) {
      let dataInput: any = [...dataform];
      dataInput[1].items[ia].data[ix].valueid = rw?.id;
      dataInput[1].items[ia].data[ix].value = rw[names[0]];
      if (name == "name-rate") {
        // console.log(rw.print_rate);
        if (rw?.print_rate) {
          setcheckbokmulti([...checkbokmulti, "print_status"]);
          setprintrate({ checkbokmulti_print_status: true });
        }
      }
      setdataform([...dataInput]);
    }

    if (name == "name-package") {
      if (rw?.time?.value) {
        // the value is in minutes (30-480)
        // Calculate ETD by adding duration to ETA
        let dataInput = [...dataform];
        let etaValue = dataInput[1].items[ia].data[1].value; // ETA value
        if (etaValue) {
          // Parse ETA time
          const etaTime = new Date(`2000-01-01T${etaValue}:00`);

          // Add duration in minutes to ETA
          etaTime.setMinutes(etaTime.getMinutes() + rw.time.value);

          // Format as HH:mm
          const hours = String(etaTime.getHours()).padStart(2, "0");
          const minutes = String(etaTime.getMinutes()).padStart(2, "0");
          const etdValue = `${hours}:${minutes}`;

          // Update ETD value
          dataInput[1].items[ia].data[3].value = etdValue;

          // Update dataval state
          setData((dataval) => ({
            ...dataval,
            etd: etdValue,
            time_package: rw?.time?.value,
          }));
          setdataform([...dataInput]);
        }
      }
    }

    setTimeout(() => {
      if (name == "name-room_type") {
        GetRoomConfig(ix, ia, rw?.id);
      }
    }, 800);
  };
  const OnSave = async () => {
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
          pathname: "/reservation/day-use/reservation",
          query: {
            parent: GetQueryStr("parent"),
            data: saveprocess?.data?.id,
          },
        });
        // history.back();
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
            {!loading ? (
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
            ) : (
              <div className="flex w-full justify-center mt-2">
                <IconSpiner />
              </div>
            )}
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
                ActionSv={(id, fn, ln, ti, pn, em, gs) =>
                  ActSv(id, fn, ln, ti, pn, em, "guest", gs)
                }
              />
            </>
          ) : (
            <>
              <CompanyAdd
                isPopup={true}
                nameinit={dataval["name-company"] ?? ""}
                ActionSv={(id, nm, market, source) =>
                  ActSv(id, nm, "", "", "", "", "company", market, source)
                }
              />
            </>
          )}
        </div>
      </>
    );
  };
  const GetDataDetail = async () => {
    try {
      let getuuri = GLOBALURI + "/create?room_id=" + GetQueryStr("room_id");
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
        dataInput[0].data[1].options = data?.master?.typemulti;
        dataInput[0].data[9].value = data?.master?.is_walk_in?.name;
        dataInput[0].data[2].value = data?.master?.is_walk_in?.name;
        dataInput[0].data[2].valueid = data?.master?.is_walk_in?.id;

        dataInput[1].items[0].data[0].value = data?.master?.business_date;
        dataInput[1].items[0].data[2].value = data?.master?.business_date;
        dataInput[1].items[0].data[4].value = 1;
        //ratecode
        dataInput[1].items[0].data[8].valueid =
          data?.master?.data_room?.rate?.id;
        dataInput[1].items[0].data[8].value =
          data?.master?.data_room?.rate?.name;
        //roomtype
        dataInput[1].items[0].data[9].valueid =
          data?.master?.data_room?.room_type?.id;
        dataInput[1].items[0].data[9].value =
          data?.master?.data_room?.room_type?.name;
        //roomno
        dataInput[1].items[0].data[11].valueid =
          data?.master?.data_room?.room?.id;
        dataInput[1].items[0].data[11].value =
          data?.master?.data_room?.room?.name;

        dataInput[2].data[2].options = data?.master?.market_segment_1;
        dataInput[2].data[2].type =
          data?.master?.markets?.is_market_segment_1 != true
            ? "hidden"
            : dataInput[2].data[2].type;
        dataInput[2].data[3].options = data?.master?.market_segment_2;
        dataInput[2].data[3].type =
          data?.master?.markets?.is_market_segment_2 != true
            ? "hidden"
            : dataInput[2].data[3].type;
        dataInput[2].data[4].options = data?.master?.market_segment_3;
        dataInput[2].data[4].type =
          data?.master?.markets?.is_market_segment_3 != true
            ? "hidden"
            : dataInput[2].data[4].type;
        dataInput[2].data[5].options = data?.master?.market_segment_4;
        dataInput[2].data[5].type =
          data?.master?.markets?.is_market_segment_4 != true
            ? "hidden"
            : dataInput[2].data[5].type;
        dataInput[2].data[6].options = data?.master?.source;
        dataInput[2].data[6].type =
          data?.master?.markets?.is_source != true
            ? "hidden"
            : dataInput[2].data[6].type;
        dataInput[0].data[8].options = data?.master?.status_guests;

        let obj: any = {};
        obj.masterdata = data?.master;
        obj.typemulti = data?.master?.typemulti[0];
        obj["name-company"] = data?.master?.is_walk_in?.name;
        obj["company_profile_id"] = data?.master?.is_walk_in?.id;
        obj["name"] = data?.master?.is_walk_in?.name;
        obj["market_segment_1"] = data?.master?.is_walk_in?.market_segment_1;
        obj["market_segment_1_ori"] = data?.master?.is_walk_in?.market_segment_1;
        obj["market_segment_2"] = data?.master?.is_walk_in?.market_segment_2;
        obj["market_segment_2_ori"] = data?.master?.is_walk_in?.market_segment_2;
        obj["market_segment_3"] = data?.master?.is_walk_in?.market_segment_3;
        obj["market_segment_3_ori"] = data?.master?.is_walk_in?.market_segment_3;
        obj["market_segment_4"] = data?.master?.is_walk_in?.market_segment_4;
        obj["market_segment_4_ori"] = data?.master?.is_walk_in?.market_segment_4;
        obj["source"] = data?.master?.is_walk_in?.source;
        obj["source_ori"] = data?.master?.is_walk_in?.source;
        obj.guest_status = data?.master?.status_guests[0];
        obj.guest_status_ori = data?.master?.status_guests[0];
        obj.check_in_date = data?.master?.business_date;
        obj.check_out_date = data?.master?.business_date;
        setData({ ...dataval, ...obj });
        setdataform([...dataInput]);
        setbusinessDate(data?.master?.business_date);
        setdataWalkIn(data?.master?.is_walk_in);
        setdataInHouse(data?.master?.is_house_use);
        setTimeout(() => {
          if (GetQueryStr("room_id")) {
            GetRate();
          }
        }, 800);

        // set
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
    let dataForms: any = [...dataform];
    setdataform([...dataForms]);
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
      // console.log("coba,", event.target.className);
      if (event?.target?.className.length) {
        if (event?.target?.className?.split(" ")[0] == "close-btn") {
          setactAuto("-1");
          setpopup(false);
        }
      }

      if (!ref.current?.contains(event.target)) {
        console.log("coba,", event.target.className);
        if (event?.target?.className.length) {
          if (
            event?.target?.className?.split(" ")[0] !=
              "Select2__input-container" &&
            event?.target?.className?.split(" ")[0] !=
              "Select2__value-container" &&
            event?.target?.className?.split(" ")[0] != "Select2__indicator" &&
            event?.target?.className?.split(" ")[0] != "Select2__placeholder"
          ) {
            setactAuto("-1");
            setpopup(false);
          }
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
  return (
    <>
      <Seo title={"Management " + layout?.title} />
      {popup ? (
        <>
          <div className="overlay">
            <div
              ref={ref}
              className="w-full md:w-[75%] overflow-auto relative h-[650px] bg-gray-200 z-20 top-0 md:top-2 xl:top-[110px] left-0 md:left-[20%]"
            >
              {/* <div className="mt-2 mr-4 absolute z-20 right-0">
                <ButtonSubmit
                  onCreate={() => {
                    setpopup(false);
                    setactAuto("-1");
                  }}
                  label="Close"
                />
              </div> */}
              {ContentPopUp(
                new URLSearchParams(window.location.search).get("key")
              )}
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
            <div className="col-span-12 lg:col-span-8 ">
              <fieldset className="border">
                <legend className="">Guest Profile</legend>
                <div className="form-grid-responsive grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
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
                            required={row?.required ?? false}
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
                                  if (e.target?.value?.length >= 3) {
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
                              onClick: () => {
                                if (row?.isAutoComp) {
                                  if (row?.name == "name-company") {
                                    // console.log("ws", row?.name);
                                    setactAuto("0" + index);
                                    GetDataAutoComp(
                                      "A",
                                      row?.uri,
                                      row?.relate,
                                      index,
                                      -1
                                    );
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
                              value: dataval[row?.name],
                              onChange: (e) => {
                                changeHandler(e, row?.type, row?.name);
                              },
                            }}
                            onChangeSel={(e) => {
                              console.log(
                                e,
                                row?.type,
                                row?.name,
                                row?.ismulti,
                                row?.options
                              );
                              changeHandler(
                                e,
                                row?.type,
                                row?.name,
                                row?.ismulti,
                                row?.options
                              );
                            }}
                            valueSel={dataval[row?.name]}
                            options={row?.options}
                            isMulti={row?.ismulti}
                            valuename={row?.name}
                            isAll={row?.isAll}
                            colspan={row?.colcheckbox}
                            valMulti={printrate}
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
              {dataform[1].items?.map((rw: any, i) => (
                <>
                  <fieldset className="border min-w-full table-auto">
                    <legend className="">Data Reservation #{i + 1}</legend>
                    <div className="w-full flex justify-end">
                      {i > 0 ? (
                        <>
                          <div
                            className="text-red font-bold cursor-pointer"
                            onClick={() => {
                              let dataInput = [...dataform];
                              dataInput[1].items = removeItem(
                                dataInput[1].items,
                                i
                              );
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
                    <div className="form-grid-responsive grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-2 mr-2">
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
                                required={row?.required ?? false}
                                label={row?.label}
                                rest={{
                                  disabled: row?.disable,
                                  autoComplete: row?.isAutoComp ? "off" : "on",
                                  name: row?.name,
                                  placeholder: row?.placeholder ?? row?.label,
                                  value: row?.value,
                                  type: row?.type,
                                  min:
                                    row?.name == "check_out_date"
                                      ? dataform[1].items[i].data[0].value
                                      : i > 0 && row?.name == "check_in_date"
                                      ? dataform[1].items[i - 1].data[2].value
                                      : row?.name == "adult"
                                      ? 1
                                      : row?.type == "number"
                                      ? 0
                                      : i == 0 && row?.name == "check_in_date"
                                      ? businessDate
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
                                      if (e.target?.value?.length > 1) {
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
                                    if (row?.isAutoComp) {
                                      setactAuto("1" + index + "-" + i);
                                      GetDataAutoComp(
                                        "",
                                        row?.uri,
                                        row?.relate,
                                        index,
                                        i
                                      );
                                    }
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
                                    ? dataval[row?.name + "_ori"]
                                    : dataval[row?.name]
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
              <div className="flex gap-2 overflow-auto">
                {dataval?.masterdata?.legend.map((rw) => (
                  <>
                    <div className={rw?.color + " p-2"}>{rw?.label}</div>
                  </>
                ))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 ">
              <div>
                <div className="mb-2">
                  {dataval?.check_in_date &&
                  dataval?.check_out_date &&
                  load &&
                  openRoom ? (
                    <>
                      <TableView
                        uri="/cms/reservation/available-room"
                        queryString={
                          "&check_in_date=" +
                          dataval?.check_in_date +
                          "&check_out_date=" +
                          dataform[1]?.items[dataform[1]?.items?.length - 1]
                            ?.data[2].value
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
                  <div className="form-grid-responsive grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
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
                              required={row?.required ?? true}
                              label={row?.label}
                              rest={{
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
                                      setactAuto("2" + index);
                                      GetDataAutoComp(
                                        e.target?.value,
                                        row?.uri,
                                        row?.relate,
                                        index,
                                        0
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
                              valueSel={dataval[row?.name + "_ori"]}
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
              // setloading(true);
              // router.replace({
              //   pathname: window.location.pathname,
              //   query: { parent: parent },
              // });
              history.back();
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
