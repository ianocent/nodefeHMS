import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { LayoutContext } from "../../../../context/LayoutContext";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";
import { env } from "../../../../next.config";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { IconSpiner } from "../../../common/icon/CardIcon";
import InputMain from "../../../common/input/InputMain";
import MultiSelectBAse from "../../../common/input/MultiSelectBase";
import ModalConfirmationComponent from "../../../common/modal/ModalConfirmation";
import ModalNotedComponent from "../../../common/modal/ModalNoted";
import Seo from "../../../common/seo";
import MoveRsv from "../../../common/tabIcon/move-rsv";
import TabMenuIcon from "../../../common/tabIcon/tab";
import TableView from "../../../common/table-edit";
import {
  FetchData,
  GetCurrentDate,
  GetDecrypt,
  GetEncrypt,
  GetNextDay,
  GetQueryParam,
  GetQueryStr,
  GetSelisihDay,
  removeItem
} from "../../../helper";
import CompanyAdd from "../../company-profile/form/index";
import GuestAdd from "../../guest/form/index";

const EditView = () => {
  const ModuleName = "Edit Reservation";
  const GLOBALURI = "/cms/reservation";
  const router = useRouter();
  const ref = useRef(null);
  const layout = useContext(LayoutContext);
  const [popup, setpopup] = useState(false);
  const [loading, setloading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  console.log("datalocal", datalocal);
  const [dataguest, setdataguest] = useState<any>([]);
  const [actAuto, setactAuto] = useState("-1");
  const [load, setisload] = useState(false);
  const [datadetail, setdatadetail] = useState<any>({});
  const [datadetailmaster, setdatadetailmaster] = useState<any>({});
  const [propertyId, setpropertyId] = useState<any>(null);
  const { canCreate, canUpdate } = useFormPermission(63);
  const [datprice, setdatprice] = useState<any>({});
  const [dataval, setData] = useState<any>({ type_reservation: "fit" });
  const [isParentGit, setIsParentGIT] = useState(false);
  const [isVr, setisVr] = useState(false);
  const [isSubGit, setIsisSubGit] = useState(false);
  const [IsOpenModal, setIsOpenModal] = useState(false);
  const [IsOpenModalIns, setIsOpenModalIns] = useState(false);
  const [isChangeCharge, setisChangeCharge] = useState(false);
  const [isISCancel, setIsCancel] = useState(false);
  const [ispopupChange, setIspopupChange] = useState(false);
  const [bulkData, setBulkData] = useState<any>([]);
  const [namePopUp, setnamePopup] = useState("");
  const [remarkModalShown, setRemarkModalShown] = useState(false);
  const canChangeGuest = useTransactionPermission("change_guest");
  const canChangeCompany = useTransactionPermission("change_company");
  const canChangeRateCode = useTransactionPermission("change_rate_code");
  const canChangeRoom = useTransactionPermission("change_room");

  const [dataform, setdataform] = useState<any>([
    {
      name: "Guest",
      data: [
        {
          label: "Guest",
          name: "first_name-guest",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Guest Here.",
          idpost: "guest_profile_id",
          uri: "/cms/profile/guest?reservation=1",
          // disable: false,
          disable: !canChangeGuest,
          AdduRi: "profile/guest/main?parent=83&add=1",
          value: "",
          valueid: "",
          // required: true,
        },
        {
          label: "Card Type",
          name: "card_type",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "cardtypes",
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          readOnly: !canChangeGuest,
          // required: true,
        },
        {
          label: "Card Number",
          name: "card_number",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          // required: true,
        },
        {
          label: "ID Expaired",
          name: "card_expiry",
          type: "date",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          // required: true,
        },
        {
          label: "Email",
          name: "email",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          // required: true,
        },
        {
          label: "Gender",
          name: "gender",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "genders",
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          // required: true,
        },
        {
          label: "BOD",
          name: "birth_of_date",
          type: "date",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          // required: true,
        },
        {
          label: "Nationality",
          name: "nationality_id",
          type: "select-multi",
          cols: "col-span-6",
          options: [],
          dataopt: "countries",
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          // required: true,
        },
        {
          label: "Status",
          name: "guest_status",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "status_guests",
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          // required: true,
        },
        {
          label: "Phone",
          name: "telp",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
        },
        {
          label: "Mobile Phone",
          name: "mobile_phone",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
        },
        {
          label: "Guest Stay",
          name: "guest_stay",
          type: "number",
          cols: "col-span-12",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: true,
        },
        {
          label: "Subscribe",
          name: "is_subscribe",
          type: "checkbox",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          value: false,
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
        },
        {
          label: "Don't contact",
          name: "is_do_not_contact",
          type: "checkbox",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          value: false,
          sugestdata: "a",
          parent: 0,
        },
        {
          label: "Address",
          name: "address",
          type: "textarea",
          cols: "col-span-12",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
        },
        {
          label: "City",
          name: "city_id",
          type: "select-multi",
          valueori: {},
          cols: "col-span-6",
          options: [{}],
          dataopt: "cities",
          ismulti: false,
          value: {},
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
        },
        {
          label: "Country",
          name: "country_id",
          type: "select-multi",
          dataopt: "countries",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
        },
        {
          label: "Postal Code",
          name: "postal_code",
          type: "number",
          cols: "col-span-12",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
        },
        {
          label: "Upload Identity",
          name: "image",
          type: "image",
          cols: "col-span-12",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
          disable: !canChangeGuest,
          ishide: !canChangeGuest
        },
      ],
    },
    {
      name: "Reservation",
      data: [
        {
          label: "Folio",
          name: "folio",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          value: "",
          disable: true,
        },
        {
          label: "Status",
          name: "status_reservation",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          value: "",
          valueOri: "",
          disable: true,
          isColor: true,
        },
        {
          label: "Room Status",
          name: "room_status",
          type: "text",
          cols: "col-span-4",
          options: [{}],
          value: "",
          valueOri: "",
          disable: true,
          isColor: true,
        },
        {
          label: "Rsv Date",
          name: "res_date",
          type: "text",
          cols: "col-span-3",
          options: [{}],
          value: "",
          disable: true,
        },
        {
          label: "Time",
          name: "res_time",
          type: "text",
          cols: "col-span-2",
          options: [{}],
          value: "",
          disable: true,
        },
        {
          label: "Company",
          name: "name-company",
          type: "text",
          cols: "col-span-7",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Company Here.",
          idpost: "company_profile_id",
          uri: "/cms/profile/company?reservation=1",
          // disable: false,
          disable: !canChangeCompany,
          AdduRi: "profile/company/main?parent=83&add=1",
          value: "",
          valueid: "",
        },
        {
          label: "Cash On Arrival",
          name: "cash_on_arrival",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Guaranteed",
          name: "guaranted",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Print Rate",
          name: "print_status",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Use Allotment",
          name: "use_allotment",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Do Not Distrub",
          name: "is_do_not_disturb",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Incognito",
          name: "is_incognito",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Long Stay",
          name: "is_long_stay",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Pending",
          name: "is_pending",
          type: "hidden",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          value: false,
          valueori: false,
        },
        {
          label: "Flight / Car",
          name: "flight_or_car",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          value: "",
          disable: false,
        },
        {
          label: "Loyalty",
          name: "loyalty_card_number",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          value: "",
          disable: false,
        },
        {
          label: "Booking Agent",
          name: "name-booking_agent",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Booking Agen Here.",
          idpost: "booking_agent_id",
          uri: "/cms/profile/company",
          disable: false,
          value: "",
          valueid: "",
        },

        {
          label: "Contact Person",
          name: "contact_person_id",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Contact person Here.",
          idpost: "contact_person_id",
          relate: "16",
          uri: "/cms/profile/company-contact?company_id=[0]",
          disable: false,
          value: "",
          valueid: "",
        },
        {
          label: "Market Segment 1",
          name: "market_segment_1",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "market_segment_1",
          ismulti: false,
          value: "",
          valueori: {},
        },
        {
          label: "Market Segment 2",
          name: "market_segment_2",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "market_segment_2",
          ismulti: false,
          value: "",
          valueori: {},
        },
        {
          label: "Market Segment 3",
          name: "market_segment_3",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "market_segment_3",
          ismulti: false,
          value: "",
          valueori: {},
        },
        {
          label: "Market Segment 4",
          name: "market_segment_4",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "market_segment_4",
          ismulti: false,
          value: "",
          valueori: {},
        },
        {
          label: "Source",
          name: "source",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "source",
          ismulti: false,
          value: "",
          valueori: {},
        },
        {
          label: "Booking No",
          name: "booking_no",
          type: "text",
          cols: "col-span-6",
          value: "",
        },
        {
          label: "Promo Code",
          name: "promo_code",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          required: false,
        },
        {
          label: "Compliment Group Leader",
          name: "is_compliment_tour_leader",
          type: "checkbox",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          value: false,
        },
      ],
    },
    {
      name: "item reservation",
      items: [
        {
          data: [
            {
              label: "Room Type",
              name: "room_type_id",
              type: "text",
              cols: "col-span-3",
              options: [{}],
              value: "",
              idpost: "room_type_id",
              valueid: "",
              disable: true,
              isHideParentGIT: true,
              isHideVR: true,
            },
            {
              label: "Room",
              name: "room_id",
              type: "text",
              cols: "col-span-3",
              options: [{}],
              value: "",
              idpost: "room_id",
              valueid: "",
              disable: true,
              isHideParentGIT: true,
              isHideVR: true,
            },
            {
              label: "Change Room",
              name: "change_room",
              type: "checkbox",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: false,
              isHideParentGIT: true,
              isHideVR: true,
              ishide: !canChangeRoom,
            },
            {
              label: "Immediately",
              name: "immediately",
              type: "checkbox",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: false,
              ishide: true,
              isHideParentGIT: true,
              isHideVR: true,
            },
            {
              label: "Room Type",
              name: "name-room_type",
              type: "text",
              cols: "col-span-6",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Type Here.",
              idpost: "room_type_id_next",
              relate: "7;9",
              uri: "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]",
              sugestdata: "a",
              value: "",
              valueid: "",
              ishide: true,
              isHideParentGIT: true,
              isHideVR: true,
            },
            {
              label: "Room Configuration",
              name: "room_conf",
              type: "checkbox",
              cols: "col-span-6",
              options: [{}],
              isAll: false,
              ismulti: true,
              sugestdata: "a",
              value: [],
              ishide: true,
              isHideParentGIT: true,
              isHideVR: true,
            },
            {
              label: "Room",
              name: "name-room",
              type: "text",
              cols: "col-span-12",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Room Here.",
              idpost: "room_id_next",
              relate: "4",
              uri: "/cms/room-type/get-room",
              value: "",
              valueid: "",
              ishide: true,
              isHideParentGIT: true,
              isHideVR: true,
            },
            {
              label: "Check In",
              name: "check_in_date",
              type: "date",
              cols: "col-span-4",
              options: [{}],
              ismulti: false,
              value: GetCurrentDate(),
            },
            {
              label: "ETA",
              name: "eta",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              isHideParentGIT: true,
              value: "12:00",
            },
            {
              label: "Check Out",
              name: "check_out_date",
              type: "date",
              cols: "col-span-4",
              options: [{}],
              ismulti: false,
              value: GetNextDay(GetCurrentDate(), 1),
            },
            {
              label: "ETD",
              name: "etd",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              isHideParentGIT: true,
              value: "12:00",
            },
            {
              label: "ATA",
              name: "ata",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              isHideParentGIT: true,
              value: "",
              disable: true,
            },
            {
              label: "ATD",
              name: "atd",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              isHideParentGIT: true,
              value: "",
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
            },

            {
              label: "Adult",
              name: "adult",
              type: "number",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "1",
              isHideParentGIT: true,
            },
            {
              label: "Child",
              name: "child",
              type: "number",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              sugestdata: "a",
              value: "0",
              isHideParentGIT: true,
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
              isHideParentGIT: true,
            },
            {
              label: "Rate Code",
              name: "name-rate",
              type: "text",
              cols: "col-span-12",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Rate Here.",
              idpost: "rate_id",
              relate: "company_profile_id;7;9",
              uri: "/cms/reservation/rate-by-company-id?company_profile_id=[0]&check_in_date=[1]&check_out_date=[2]",
              value: "",
              valueid: "",
              // disable: false,
              disable: !canChangeRateCode,
              isHideVR: true,
            },
            {
              label: "Is 24 Hours",
              name: "is_24_hour",
              type: "checkbox",
              cols: "col-span-3",
              options: [{ label: "Is 24 Hours", value: "1" }],
              ismulti: false,
              value: false,
              isHideParentGIT: true,
              isHideVR: true,
            },
          ],
          is_posting: 0,
        },
      ],
    },
    {
      name: "special ins",
      data: [
        {
          label: "Remark",
          name: "remark",
          type: "textarea",
          cols: "col-span-9",
          options: [{}],
          value: "",
          disable: true,
        },
        {
          label: "GH",
          name: "is_gh",
          type: "checkbox",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: false,
        },
        {
          label: "Check In Instruction",
          name: "check_in_instruction",
          type: "textarea",
          cols: "col-span-4",
          options: [{}],
          value: "",
          disable: true,
        },
        {
          label: "Check Out Instruction",
          name: "check_out_instruction",
          type: "textarea",
          cols: "col-span-4",
          options: [{}],
          value: "",
          disable: true,
        },
        {
          label: "Posting Instruction",
          name: "posting_instruction",
          type: "textarea",
          cols: "col-span-4",
          options: [{}],
          value: "",
          disable: true,
        },
      ],
    },
  ]);
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
          // console.log(resp.data);
          let tempOpt = [...dataform];
          tempOpt[0].data[7].options = resp.data;
          tempOpt[0].data[16].options = resp.data;
          setdataform(tempOpt);
        } else if (tbl == "country_id") {
          let tempOpt = [...dataform];
          tempOpt[0].data[15].options = resp.data;
          setdataform(tempOpt);
        }
      }
    } catch (error) {}
  };
  const changeHandlera = (
    e: any,
    b?: any,
    form?: string,
    ismulti?: boolean,
    options?: any,
    index?: number,
    ia?: number
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
      // console.log(e.target.value);

      if (e.target.name == "check_in_date") {
        if (dataform[form].items[index].data[7].value != e.target.value) {
          if (isParentGit) {
            setIspopupChange(true);
          }
        }
        setisChangeCharge(true);
        dataInput[form].items[index].data[13].value = GetSelisihDay(
          e.target.value,
          dataInput[form].items[index].data[9].value
        );
        const businessDate = datalocal?.data?.bussinesDate;
        const isnotbusinessdate = businessDate && e.target.value == businessDate;
        dataInput[form].items[index].data[3].ishide = !isnotbusinessdate;
        if(!isnotbusinessdate){
          dataInput[form].items[index].data[3].value = false;
        }
      }
      if (e.target.name == "check_out_date") {
        if (dataform[form].items[index].data[9].value != e.target.value) {
          if (isParentGit) {
            setIspopupChange(true);
          }
        }
        setisChangeCharge(true);
        dataInput[form].items[index].data[13].value = GetSelisihDay(
          dataInput[form].items[index].data[7].value,
          e.target.value
        );
        const businessDate = datalocal?.data?.bussinesDate;
        const isnotbusinessdate = businessDate && e.target.value == businessDate;
        dataInput[form].items[index].data[3].ishide = !isnotbusinessdate;
        if(!isnotbusinessdate){
          dataInput[form].items[index].data[3].value = false;
        }
      }
      if (e.target.name == "night") {
        setisChangeCharge(true);
        dataInput[form].items[index].data[9].value = GetNextDay(
          dataInput[form].items[index].data[7].value,
          e.target.value
        );
      }
      if (e?.target?.name == "promo_code") {
        setisChangeCharge(true);
      }

      if (
        e.target.name == "adult" ||
        e.target.name == "child" ||
        e.target.name == "add_bed"
      ) {
        setisChangeCharge(true);
      }
      if (ia) {
        dataInput[form].items[index].data[ia].value = e.target.value;
      } else {
        dataInput[form].data[index].value = e.target.value;
      }
    } else if (b == "select-multi" || b == true) {
      // alert(index);
      if (form == "0" && index == 16) {
        GetDataRelation(e.value, "country_id");
      }
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      if (ia) {
        dataInput[form].items[index].data[ia].valueori = e;
        dataInput[form].items[index].data[ia].value = ismulti
          ? valarr
          : e?.value;
      } else {
        dataInput[form].data[index].value = ismulti ? valarr : e.value;
        dataInput[form].data[index].valueori = e;
      }
    } else if (b == "checkbox") {
      // if (e.target.value.split("-")[0] == "change_room") {
      //   if (e.target.checked) {
      //     dataInput[form].items[index].data[3].ishide = false;
      //     dataInput[form].items[index].data[4].ishide = false;
      //     dataInput[form].items[index].data[5].ishide = false;
      //     dataInput[form].items[index].data[6].ishide = false;
      //   } else {
      //     dataInput[form].items[index].data[3].ishide = true;
      //     dataInput[form].items[index].data[4].ishide = true;
      //     dataInput[form].items[index].data[5].ishide = true;
      //     dataInput[form].items[index].data[6].ishide = true;
      //   }
      // }
      if (e.target.value.split("-")[0] == "change_room") {
        if (e.target.checked) {
          const businessDate = datalocal?.data?.bussinesDate;
          const checkInDate = dataInput[form].items[index].data[7]?.value;
          const checkOutDate = dataInput[form].items[index].data[9]?.value;

          const isInRange =
            businessDate &&
            checkInDate &&
            new Date(checkInDate) <= new Date(businessDate) &&
            new Date(businessDate) <= new Date(checkOutDate);

          dataInput[form].items[index].data[3].ishide = !isInRange; // Immediately
          dataInput[form].items[index].data[4].ishide = false;
          dataInput[form].items[index].data[4].disable = false;
          dataInput[form].items[index].data[5].ishide = false;
          dataInput[form].items[index].data[6].ishide = false;
          dataInput[form].items[index].data[6].disable = false;
        } else {
          dataInput[form].items[index].data[3].ishide = true;
          dataInput[form].items[index].data[4].ishide = true;
          dataInput[form].items[index].data[4].disable = true;
          dataInput[form].items[index].data[5].ishide = true;
          dataInput[form].items[index].data[6].ishide = true;
          dataInput[form].items[index].data[6].disable = true;
        }
      }
      if (ismulti) {
        let valarr = [];
        valarr.push({
          name: e.target.value,
          value: e.target.checked,
        });

        if (ia) {
          dataInput[form].items[index].data[ia].value?.map((row) => {
            valarr.push({
              name: row?.name,
              value: row?.value,
            });
          });
          dataInput[form].items[index].data[ia].value = valarr;
        } else {
          dataInput[form].data[index].value?.map((row) => {
            valarr.push({
              name: row?.name,
              value: row?.value,
            });
          });
          dataInput[form].data[index].value = valarr;
        }
      } else {
        if (ia) {
          if (
            dataInput[form].items[index].data[ia].name == "immediately" &&
            e.target.checked == true
          ) {
            setisChangeCharge(true);
          }
          dataInput[form].items[index].data[ia].value = e.target.checked;
        } else {
          dataInput[form].data[index].value = e.target.checked;
          dataInput[form].data[index].valueori = e.target.checked;
        }
      }
    } else if (b == "image") {
      dataInput[form].data[index].value = e;
    }
    setdataform([...dataInput]);
    // console.log(dataInput);
    // setError("");
  };
  const GetDataDetail = async () => {
    try {
      setisload(true);
      let getuuri = GLOBALURI + "/" + GetQueryStr("data") + "/update";
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
        // console.log("data arr", data?.master);
        setdatadetailmaster(data?.master);
        setdatadetail(data?.data);
        //rate
        setdatprice(data?.data?.revenue);
        //guest
        GetDataRelation(data?.data?.guest?.country_id?.value, "country_id");
        const mandatoryFields = data?.data?.mandatory_check_in?.fields || [];
        const missingMandatoryFields = data?.data?.mandatory_check_in?.missing_fields || [];
        dataform[0].data?.map((rw, i) => {
          if (rw?.name == "first_name-guest") {
            dataInput[0].data[i].value = data?.data?.guest?.guest_name;
          } else if (rw?.name == "telp") {
            dataInput[0].data[i].value = data?.data?.guest?.telp
              ?.replaceAll("-", "")
              ?.replaceAll("+", "");
          } else if (rw?.name == "mobile_phone") {
            dataInput[0].data[i].value = data?.data?.guest?.mobile_phone
              ?.replaceAll("-", "")
              ?.replaceAll("+", "");
          } else {
            if (rw?.dataopt) {
              dataInput[0].data[i].value = data?.data?.guest[rw?.name]?.value;
              dataInput[0].data[i].valueori = data?.data?.guest[rw?.name];
            } else {
              // console.log("wewewe" + rw?.name, data?.data?.guest[rw?.name]);
              dataInput[0].data[i].value = data?.data?.guest[rw?.name];
              if (rw?.name == "image") {
                dataInput[0].data[i].valueori = data?.data?.guest[rw?.name];
              }
            }
          }
          if (rw?.idpost && data?.data?.guest[rw?.idpost]) {
            // console.log("tersrre", data?.data?.guest[rw?.idpost]);
            dataInput[0].data[i].valueid = data?.data?.guest[rw?.idpost];
          }

          if (rw?.dataopt) {
            if (i != 16 && i != 7) {
              dataInput[0].data[i].options = data?.master[rw?.dataopt];
            }
          }
          dataInput[0].data[i].isMandatory = mandatoryFields.includes(rw?.name);
          dataInput[0].data[i].isMissingMandatory = missingMandatoryFields.includes(rw?.name);
        });
        //reservation
        dataform[1].data?.map((rw, i) => {
          if (rw?.name == "room_status") {
            dataInput[1].data[i].valueOri = data?.data?.reservation[rw?.name];
            dataInput[1].data[i].value =
              data?.data?.reservation[rw?.name]?.label;
          } else if (rw?.name == "status_reservation") {
            dataInput[1].data[i].valueOri = data?.data?.reservation[rw?.name];
            dataInput[1].data[i].value =
              data?.data?.reservation[rw?.name]?.label;
          } else if (rw?.name == "name-company") {
            dataInput[1].data[i].valueOri = data?.data?.reservation?.company_id;
            dataInput[1].data[i].value =
              data?.data?.reservation?.company_id?.label;
            dataInput[1].data[i].valueid =
              data?.data?.reservation?.company_id?.value;
          } else if (rw?.name == "name-booking_agent") {
            dataInput[1].data[i].valueOri =
              data?.data?.reservation?.booking_agent_id;
            dataInput[1].data[i].value =
              data?.data?.reservation?.booking_agent_id?.label;
            dataInput[1].data[i].valueid =
              data?.data?.reservation?.booking_agent_id?.value;
            if (data?.data?.reservation?.booking_agent_id?.value) {
              GetCp(data?.data?.reservation?.booking_agent_id?.value);
            }
          } else if (rw?.name == "name-contact_person") {
            dataInput[1].data[i].valueOri =
              data?.data?.reservation?.contact_person_id;
            dataInput[1].data[i].value =
              data?.data?.reservation?.contact_person_id?.label;
            dataInput[1].data[i].valueid =
              data?.data?.reservation?.contact_person_id?.value;
          } else {
            if (rw?.dataopt) {
              dataInput[1].data[i].value =
                data?.data?.reservation[rw?.name]?.value;
              dataInput[1].data[i].valueori = data?.data?.reservation[rw?.name];
            } else {
              dataInput[1].data[i].value = data?.data?.reservation[rw?.name];
              dataInput[1].data[i].valueori = data?.data?.reservation[rw?.name];
            }
          } ////cms/room-type
          if (rw?.dataopt) {
            dataInput[1].data[i].options = data?.master[rw?.dataopt];
            if (
              rw?.name == "market_segment_1" ||
              rw?.name == "market_segment_2" ||
              rw?.name == "market_segment_3" ||
              rw?.name == "market_segment_4" ||
              rw?.name == "source"
            ) {
              if (rw?.name == "market_segment_1") {
                dataInput[1].data[i].type =
                  data?.master?.markets?.is_market_segment_1 != true
                    ? "hidden"
                    : dataInput[1].data[i].type;
              }
              if (rw?.name == "market_segment_2") {
                dataInput[1].data[i].type =
                  data?.master?.markets?.is_market_segment_2 != true
                    ? "hidden"
                    : dataInput[1].data[i].type;
              }
              if (rw?.name == "market_segment_3") {
                dataInput[1].data[i].type =
                  data?.master?.markets?.is_market_segment_3 != true
                    ? "hidden"
                    : dataInput[1].data[i].type;
              }
              if (rw?.name == "market_segment_4") {
                dataInput[1].data[i].type =
                  data?.master?.markets?.is_market_segment_4 != true
                    ? "hidden"
                    : dataInput[1].data[i].type;
              }
              if (rw?.name == "source") {
                dataInput[1].data[i].type =
                  data?.master?.markets?.is_source != true
                    ? "hidden"
                    : dataInput[1].data[i].type;
              }
            }
          }
          if (rw?.name == "is_compliment_tour_leader") {
            // alert("woi");
            if (!data?.data?.is_parent_git) {
              dataInput[1].data[i].type = "hidden";
            }
          }
        });
        //reservation items
        data?.data?.reservation_items?.map((rws, index) => {
          // console.log("sss", dataform[2].items[index].data);
          if (
            index == 0 &&
            data?.data?.reservation_items?.length != dataform[2]?.items?.length
          ) {
            for (
              let index = 0;
              index < data?.data?.reservation_items?.length;
              index++
            ) {
              if (index != 0) {
                AddReservation();
              }
            }
          }
          dataInput[2].items[index].is_posting =
            data?.data?.reservation_items[index]?.is_posting;
          dataform[2].items[index]?.data?.map((rw, i) => {
            if (rw?.name == "name-room_type") {
              if (
                data?.data?.reservation_items[index]?.room_id_origin?.value == 0
              ) {
                dataInput[2].items[index].data[4].value =
                  data?.data?.reservation_items[
                    index
                  ]?.room_type_id_origin?.label;

                dataInput[2].items[index].data[4].valueid =
                  data?.data?.reservation_items[
                    index
                  ]?.room_type_id_origin?.value;
              } else {
                dataInput[2].items[index].data[i].valueOri =
                  data?.data?.reservation_items[index]?.room_type_id_next;
                dataInput[2].items[index].data[i].value =
                  data?.data?.reservation_items[
                    index
                  ]?.room_type_id_next?.label;
                dataInput[2].items[index].data[i].valueid =
                  data?.data?.reservation_items[
                    index
                  ]?.room_type_id_next?.value;
                dataInput[2].items[index].data[i].uri =
                  "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]&rate_id=" +
                  data?.data?.reservation_items[index]?.rate_id?.value;
              }
            } else if (rw?.name == "name-room") {
              dataInput[2].items[index].data[i].valueOri =
                data?.data?.reservation_items[index]?.room_id_next;
              dataInput[2].items[index].data[i].value =
                data?.data?.reservation_items[index]?.room_id_next?.label;
              dataInput[2].items[index].data[i].valueid =
                data?.data?.reservation_items[index]?.room_id_next?.value;
            } else if (rw?.name == "room_type_id") {
              dataInput[2].items[index].data[i].value =
                data?.data?.reservation_items[
                  index
                ]?.room_type_id_origin?.label;
              dataInput[2].items[index].data[i].valueid =
                data?.data?.reservation_items[
                  index
                ]?.room_type_id_origin?.value;
            } else if (rw?.name == "room_id") {
              dataInput[2].items[index].data[i].value =
                data?.data?.reservation_items[index]?.room_id_origin?.label;
              dataInput[2].items[index].data[i].valueid =
                data?.data?.reservation_items[index]?.room_id_origin?.value;
            } else if (rw?.name == "name-rate") {
              dataInput[2].items[index].data[i].valueOri =
                data?.data?.reservation_items[index]?.rate_id;
              dataInput[2].items[index].data[i].value =
                data?.data?.reservation_items[index]?.rate_id?.label;
              dataInput[2].items[index].data[i].valueid =
                data?.data?.reservation_items[index]?.rate_id?.value;
              if (data?.data?.is_sub_git) {
                dataInput[2].items[index].data[i].disable = true;
              }
            } else if (rw?.name == "check_in_date") {
              if (data?.data?.is_checkin) {
                dataInput[2].items[index].data[i].disable = true;
              } else {
                // console.log("wdypm", data?.data?.reservation);
                if (
                  data?.data?.reservation?.status_reservation?.value == 3 &&
                  data?.data?.is_vr
                ) {
                  // console.log("wdypm", dataInput[2].items[index].data[i]);

                  dataInput[2].items[index].data[i].disable = false;
                }
              }
              dataInput[2].items[index].data[i].value = rws[rw?.name];
            } else {
              // console.log("wdya", i);
              if (dataInput[2].items[index].data[i].type == "number") {
                dataInput[2].items[index].data[i].value =
                  rws[rw?.name] ??
                  (dataInput[2].items[index].data[i].name == "adult" ? 1 : 0);
              } else {
                dataInput[2].items[index].data[i].value = rws[rw?.name];
              }
            }

            if (rw?.name == "change_room") {
              if (rws?.change_room) {
                const businessDate = datalocal?.data?.bussinesDate;
                const checkInDate =
                  data?.data?.reservation_items[index]?.check_in_date;
                const checkOutDate =
                  data?.data?.reservation_items[index]?.check_out_date;
                  console.log("businessDate raw:", businessDate);
                  console.log("checkInDate raw:", checkInDate);
                  console.log("checkOutDate raw:", checkOutDate);

                const isInRange =
                  businessDate &&
                  checkInDate &&
                  new Date(checkInDate) <= new Date(businessDate) &&
                  new Date(businessDate) <= new Date(checkOutDate);

                dataInput[2].items[index].data[3].ishide = !isInRange; // Immediately
                dataInput[2].items[index].data[4].ishide = false;
                dataInput[2].items[index].data[4].disable = false;
                dataInput[2].items[index].data[5].ishide = false;
                dataInput[2].items[index].data[6].ishide = false;
                dataInput[2].items[index].data[6].disable = false;
              } else {
                dataInput[2].items[index].data[3].ishide = true;
                dataInput[2].items[index].data[4].ishide = true;
                dataInput[2].items[index].data[4].disable = true;
                dataInput[2].items[index].data[5].ishide = true;
                dataInput[2].items[index].data[6].ishide = true;
                dataInput[2].items[index].data[6].disable = true;
                if (
                  data?.data?.reservation_items[index]?.room_id_origin?.value ==
                  0
                ) {
                  dataInput[2].items[index].data[3].ishide = false;
                  dataInput[2].items[index].data[4].ishide = false;
                  dataInput[2].items[index].data[4].disable = false;
                  dataInput[2].items[index].data[5].ishide = false;
                  dataInput[2].items[index].data[6].ishide = false;
                  dataInput[2].items[index].data[6].disable = false;
                }
              }
            }

            if (rw?.dataopt) {
              dataInput[2].items[index].data[i].options =
                data?.master[rw?.dataopt];
            }
          });
        });
        //special ins
        dataform[3].data?.map((rw, i) => {
          dataInput[3].data[i].value =
            data?.data?.special_instruction[rw?.name];

          if (rw?.dataopt) {
            dataInput[1].data[i].options = data?.master[rw?.dataopt];
          }
        });

        if (data?.data?.special_instruction?.remark_ins && !remarkModalShown) {
          setIsOpenModalIns(true);
          setRemarkModalShown(true);
        }
        if (data?.data?.is_sub_git) {
          dataInput[1].data[5].disable = true;
        }
        if (GetQueryParam(1) == "git") {
          dataInput[1].data[6].type = "hidden";
        }
        //console.log("wdy", GetQueryParam(1));
        setIsCancel(data?.data?.is_cancel);

        // check is parent git
        setIsParentGIT(data?.data?.is_parent_git);
        setisVr(data?.data?.is_vr);
        setIsisSubGit(data?.data?.is_sub_git);
        setdataform([...dataInput]);
      }
      setisload(false);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const AddReservation = () => {
    let dataInput = [...dataform];
    let index = dataInput[2].items.length;
    dataInput[2].items?.push({
      data: [
        {
          label: "Room Type",
          name: "room_type_id",
          idpost: "room_type_id",
          type: "text",
          cols: "col-span-3",
          options: [{}],
          value: dataInput[2].items[index - 1].data[0].value,
          valueid: dataInput[2].items[index - 1].data[0].valueid,
          disable: true,
        },
        {
          label: "Room",
          name: "room_id",
          idpost: "room_id",
          type: "text",
          cols: "col-span-3",
          options: [{}],
          value: dataInput[2].items[index - 1].data[1].value,
          valueid: dataInput[2].items[index - 1].data[1].valueid,
          disable: true,
        },
        {
          label: "Change Room",
          name: "change_room",
          type: "checkbox",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          ishide: !canChangeRoom,
          value: dataInput[2].items[index - 1].data[2].value,
        },
        {
          label: "Immediately",
          name: "immediately",
          type: "checkbox",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
          value: dataInput[2].items[index - 1].data[3].value,
          ishide: true,
        },
        {
          label: "Room Type",
          name: "name-room_type",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Room Type Here.",
          idpost: "room_type_id_next",
          uri: "/cms/room-type",
          sugestdata: "a",
          value: dataInput[2].items[index - 1].data[4].value,
          valueid: dataInput[2].items[index - 1].data[4].valueid,
          ishide: true,
        },
        {
          label: "Room Configuration",
          name: "room_conf",
          type: "checkbox",
          cols: "col-span-6",
          options: [{}],
          isAll: false,
          ismulti: true,
          sugestdata: "a",
          value: [],
          ishide: true,
        },
        {
          label: "Room",
          name: "name-room",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Room Here.",
          idpost: "room_id_next",
          relate: "4",
          uri: "/cms/room-type/get-room",
          value: dataInput[2].items[index - 1].data[6].value,
          valueid: dataInput[2].items[index - 1].data[6].valueid,
          ishide: true,
        },
        {
          label: "Check In",
          name: "check_in_date",
          type: "date",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: GetNextDay(dataInput[2].items[index - 1].data[9].value, 0),
          disable: true,
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
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: GetNextDay(dataInput[2].items[index - 1].data[9].value, 1),
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
          label: "ATA",
          name: "ata",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "",
          disable: true,
        },
        {
          label: "ATD",
          name: "atd",
          type: "time",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          value: "",
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
          value: "1",
        },
        {
          label: "Adult",
          name: "adult",
          type: "number",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "1",
        },
        {
          label: "Child",
          name: "child",
          type: "number",
          cols: "col-span-2",
          options: [{}],
          ismulti: false,
          sugestdata: "a",
          value: "0",
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
        },
        {
          label: "Rate",
          name: "name-rate",
          type: "text",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Rate Here.",
          idpost: "rate_id",
          relate: "7;9;company_profile_id",
          uri: "/cms/reservation/rate-by-company-id?check_in_date=[0]&check_out_date=[1]&company_profile_id=[2]",
          // value: dataInput[2].items[index - 1].data[17].value,
          value: dataInput[2].items[index - 1].data.find(d => d.name === "name-rate")?.value,
          // valueid: dataInput[2].items[index - 1].data[17].valueid,
          valueid: dataInput[2].items[index - 1].data.find(d => d.name === "name-rate")?.valueid,
          disable: isSubGit ? true : false,
        },
      ],
    });
    setdataform([...dataInput]);
  };
  const GetDataAutoComp = async (word, uri, relate: any, ix, ia, frm) => {
    try {
      setloading(true);
      let getuuri = "";
      // name-rate
      if (relate) {
        var relatestr = "" + relate;
        var relatearr = relatestr.split(";");

        relatearr?.map((rw, index) => {
          var repstr = "[" + index + "]";

          uri = uri.replace(
            repstr,
            datadetail[relatearr[index]] ??
              dataform[frm].items[ia]?.data[relatearr[index]]?.valueid ??
              dataform[frm].items[ia]?.data[relatearr[index]]?.value ??
              ""
          );
        });
      }
      // console.log("uri2", uri);
      getuuri =
        uri.indexOf("?") == -1
          ? (relate
              ? uri + "/" + (dataform[frm].items[ia].data[relate]?.valueid ?? 0)
              : uri) +
            "?search=" +
            word
          : uri + "&search=" + word;

      if (uri == "/cms/room-type/get-room") {
        var prmsrc = "";
        dataform[frm].items[ia].data[5].value?.map((rw) => {
          prmsrc =
            "&idx_" + rw?.name + "=" + (rw?.value ? "1" : "0") + "" + prmsrc;
        });
        getuuri =
          getuuri +
          "" +
          prmsrc +
          "&check_in_date=" +
          dataform[frm].items[ia].data[7]?.value +
          "&check_out_date=" +
          dataform[frm].items[ia].data[9]?.value +
          "&reservation=1&folio_id=" +
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
      setloading(false);

      // console.log(data?.data?.length);
      return;
    } catch (error) {
      console.log("error", error);
      setloading(false);

      return;
    }
  };
  const GetRate = async () => {
    try {
      if (isParentGit) {
        return;
      }

      let urisave = "/cms/reservation/charge";
      let mth = "POST";
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
        setdatprice(saveprocess?.data);
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const FinalPOstDat = () => {
    var objpost: any = {};
    // objpost = dataval;
    var arrCOl = [];
    var obj = {};

    dataform[0]?.data?.map((rw, i) => {
      objpost[rw?.name] = rw?.value;
      if (rw?.idpost) {
        objpost[rw?.idpost] = rw?.valueid;
      }
    });

    dataform[1]?.data?.map((rw, i) => {
      objpost[rw?.name] = rw?.value;
      if (rw?.idpost) {
        objpost[rw?.idpost] = rw?.valueid;
      }
    });
    dataform[3]?.data?.map((rw, i) => {
      objpost[rw?.name] = rw?.value;
      if (rw?.idpost) {
        objpost[rw?.idpost] = rw?.valueid;
      }
    });

    dataform[2].items?.map((row: any, i) => {
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
    objpost.check_in_date = dataform[2].items[0].data[7].value;
    objpost.check_out_date = dataform[2].items[dataform[2].items.length - 1].data[9].value;
    objpost.sub_folio_selected = bulkData;
    return objpost;
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
        let datain = [...dataform];
        datain[1].data[17].options = saveprocess?.data;
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
          // console.log("sukses", ia);
          let dataInput = [...dataform];
          dataInput[2].items[ia].data[5].options = data?.data;
          setdataform([...dataInput]);
        }

        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }
  };
  const onSelecteda = (
    rw: any,
    n: any,
    id: any,
    idat: any,
    name,
    ix,
    ia,
    frm
  ) => {
    let dataInput: any = [...dataform];
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
    // console.log("arr", dataform[idat]);
    // console.log("sugestdat", rw);
    dataform[idat]?.data?.map((row: any, index) => {
      var obj = {
        [row?.name]: rw[row?.name] ?? "",
      };

      if (row?.sugestdata == n && rw[row?.name]) {
        if (ix == row?.parent) {
          if (typeof rw[row?.name] == "object") {
            dataInput[frm].data[index].value = rw[row?.name]?.value;
          } else {
            dataInput[frm].data[index].value = rw[row?.name];
          }
          dataInput[frm].data[index].valueori = rw[row?.name];
        }
        // console.log("buza", name + ";" + row?.name + ";" + rw[names[1]]);
      }
      if (name == row?.name) {
        // console.log("buz", name + ";" + row?.name + ";" + rw[names[0]]);
        dataInput[frm].data[index].value = rw[names[0]];
      }
      if (id == row?.name) {
        // console.log("buz", name + ";" + row?.name + ";" + rw[names[0]]);
        dataInput[frm].data[index].valueid = rw?.id ?? "";
      }
    });
    if (ia != -1) {
      dataInput[frm].items[ia].data[ix].valueid = rw?.id;
      dataInput[frm].items[ia].data[ix].value = rw[names[0]];
    } else {
      dataInput[frm].data[ix].valueid = rw?.id;
      dataInput[frm].data[ix].value = rw[names[0]];
    }
    if (name == "name-rate") {
      dataInput[frm].items[ia].data[4].uri =
        "/cms/room-type?reservation=1&check_in_date=[0]&check_out_date=[1]&rate_id=" +
        rw?.id;
    }
    setdataform([...dataInput]);
    setTimeout(() => {
      if (name == "name-rate") {
        setisChangeCharge(true);
        GetRate();
      }
      if (name == "name-room_type") {
        setisChangeCharge(true);
        GetRoomConfig(ix, ia, rw?.id);
      }
    }, 700);
  };
  const ListTblGuest = (id, datI, name, ix, ia, isAdd, form, sugesdat) => {
    return (
      <>
        <div
          ref={ref}
          className="p-2 rounded-md w-full z-50 border-black border-b-[1px] border-r-[1px] border-l-[1px] absolute bg-white"
        >
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
                  {dataguest?.data?.map((row: any, index: number) => (
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
                              onSelecteda(
                                row,
                                sugesdat,
                                id,
                                datI,
                                name,
                                ix,
                                ia,
                                form
                              );
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
                                  alt="Check"
                                />
                              ) : row[item.key] == false &&
                                typeof row[item.key] == "boolean" ? (
                                <img
                                  src="/assets/images/apps/cross.png"
                                  className="w-[20px]"
                                  alt="Cross"
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
                              row[item.key]?.map((rw: any, i: number) => {
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
                        ) : null;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Jika Data Kosong, Tampilkan Teks Data Not Found */}
              {(!dataguest?.data || dataguest.data.length === 0) && (
                <div className="text-center py-3 text-sm text-gray-500 font-medium">
                  Data Not Found
                </div>
              )}

              {/* Tombol Add Selalu Tampil Jika isAdd True */}
              {isAdd && (
                <div className="flex w-full justify-center mt-2 border-t pt-2">
                  <ButtonSubmit
                    isBtnAdd={canCreate || canUpdate}
                    label="Add"
                    onCreate={() => {
                      setpopup(true);
                      setnamePopup(name);
                      setactAuto("-1");
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 flex justify-center">
              <IconSpiner />
            </div>
          )}
        </div>
      </>
    );
  };
  const OnSave = async (cal?: number) => {
    try {
      let urisave = "/cms/reservation/" + GetQueryStr("data");
      let mth = "PUT";

      var objpost: any = FinalPOstDat();
      objpost.is_calculate = cal ?? 1;
      if (bulkData && bulkData.length > 0) {
        objpost.sub_folio_selected = bulkData;
      }
      const raw = JSON.stringify(objpost);
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
        // router.replace({
        //   pathname: "/reservation/" + GetPathUri(2),
        //   query: {
        //     parent: GetQueryStr("parent"),
        //     module: GetQueryStr("module"),
        //     data: GetQueryStr("data"),
        //   },
        // });
        history.back();
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const CheckButtonSave = () => {
    if (isChangeCharge) {
      setIsOpenModal(true);
    } else {
      OnSave(0);
    }

    return;
  };
  const ContentPopUp = (key) => {
    return (
      <>
        <div className=" m-4">
          <div className="p-2 font-bold">
            <h1 className="capitalize">
              {namePopUp == "first_name-guest" ? "Guest Profile" : "Company"}
            </h1>
          </div>
          {namePopUp == "first_name-guest" ? (
            <>
              <GuestAdd
                isPopup={true}
                nameinit={dataval["first_name-guest"] ?? ""}
                ActionSv={(id, fn, ln, ti, pn, em, gs, all) => {
                  // console.log("bbbbb", all);
                  ActSv(id, fn, ln, ti, pn, em, "guest", gs, [], all);
                }}
              />
            </>
          ) : (
            <>
              <CompanyAdd
                isPopup={true}
                nameinit={dataval["name-company"] ?? ""}
                ActionSv={(id, nm, market, source) =>
                  ActSv(id, nm, "", "", "", "", "company", market, source, {})
                }
              />
            </>
          )}
        </div>
      </>
    );
  };
  const ActSv = (
    id,
    fn,
    ln,
    ti,
    pn,
    em,
    type,
    market = [],
    source = [],
    rw: any
  ) => {
    setpopup(false);

    if (type == "guest") {
      var objcus = {
        ["guest_profile_id"]: id,
        ["title"]: ti,
        ["first_name"]: fn,
        ["last_name"]: ln,
        ["email"]: em,
        ["telp"]: pn,
        ["first_name-guest_profile"]: fn + " " + ln,
        ["guest_status"]: market,
        ["guest_status_ori"]: market,
      };

      setData((dataval) => ({
        ...dataval,
        ...objcus,
      }));
      // console.log("sss", rw);
      let dataInput: any = [...dataform];
      dataform[0]?.data?.map((row: any, index) => {
        if (typeof rw[row?.name] == "object") {
          if (row?.dataopt) {
            dataInput[0].data[index].valueori = rw[row?.name];
            dataInput[0].data[index].value = rw[row?.name]?.value;
          } else {
            dataInput[0].data[index].value = rw[row?.name]?.value;
          }
        } else {
          if (row?.name == "first_name-guest") {
            dataInput[0].data[index].valueid = rw?.id;
            dataInput[0].data[index].value = fn + " " + ln;
          } else {
            // console.log("FS", rw[row?.name] + "" + row?.dataopt);

            dataInput[0].data[index].value = rw[row?.name];
          }
        }
      });
      setdataform(dataInput);
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
        // console.log("coba,", event.target.className);
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
  const folioId = GetQueryStr("data");
  const hasFetched = useRef(false);
  // useEffect(() => {
  //   if (!folioId) return;
  //   GetDataRelation("all", "region");
  //   GetDataDetail();
  // }, [folioId, window.location.search]);
  useEffect(() => {
      if (!folioId || hasFetched.current) return;
      hasFetched.current = true;
      
      GetDataRelation("all", "region");
      GetDataDetail();
  }, [folioId]);

  const handleDownload = async (item: any) => {
    try {
      const response = await fetch(env.uriApi + item.value, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${datalocal?.data?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = item.label + `-${GetQueryStr("data")}` + ".pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the report. Please try again.");
    }
  };

  const [showSections, setShowSections] = useState({
    guestPreference: false,
    guestNotes: false,
    messages: false,
    wakeUpCall: false,
    depositPayment: false,
    billingTo: false,
    autoTransfer: false,
  });
  const toggleSection = (key: keyof typeof showSections) => {
    setShowSections(prev => ({ ...prev, [key]: !prev[key] }));
  };
  // console.log("datalocalku nih:",datalocal);

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <div className={(ispopupChange ? "block" : "hidden") + " overlay "}>
        <div className="flex justify-center mt-20 ">
          <div className="bg-white w-[600px] p-4">
            <div>
              <h4>Selected Change Folio </h4>
            </div>
            <div>
              {/* isi popup */}
              <MoveRsv
                uri={
                  "/cms/assign-room?folio_id=" +
                  GetQueryStr("data") +
                  "&type=all"
                }
                editData={false}
                isCheckBox={true}
                isFolio={true}
                isCalculate={false}
                saveBulk={(idx) => setBulkData(idx)}
              />
            </div>
            <div className="flex gap-4">
              <ButtonSubmit
                onCreate={() => {
                  setIspopupChange(false);
                }}
                isprimary={false}
                label="Close"
              />
              <ButtonSubmit
                onCreate={() => {
                  setIspopupChange(false);
                  if (bulkData && bulkData.length > 0) {
                    console.log(
                      "Sub-folio selected for date change:",
                      bulkData,
                    );
                  } else {
                    console.log("No sub-folio selected");
                  }
                }}
                label="Apply"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {popup ? (
          <>
            <div className="overlay">
              <div
                ref={ref}
                className="w-[75%] overflow-auto relative h-[650px] rounded-lg bg-gray-200 z-20 top-2 xl:top-[110px] left-[20%]"
              >
                {ContentPopUp(
                  new URLSearchParams(window.location.search).get("key"),
                )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <TabMenuIcon actMenu={""} id={GetQueryStr("data")} foliodat={""} />

        {/* <div className="absolute right-10 top-1"> */}
        <div className="flex justify-end mb-2 lg:absolute lg:right-10 lg:max-w-none z-10">
          <MultiSelectBAse
            disabled={false}
            error={null}
            label="Print Form"
            required={false}
            options={[
              {
                label: "Pre Registration",
                value: `/cms/report/batch/folio/${GetQueryStr(
                  "data",
                )}/pre-registration`,
              },
              {
                label: "Registration Form",
                value: `/cms/report/batch/folio/${GetQueryStr(
                  "data",
                )}/registration-form`,
              },
              {
                label: "Confirmation Reservation",
                value: `/cms/report/batch/folio/${GetQueryStr(
                  "data",
                )}/confirmation`,
              },

              // hide kalo di datalocal.nameproperty nya bukan "KURETAKESO"
              ...(datalocal?.NameProperty !== "KURETAKESO"
                ? []
                : [
                    {
                      label: "Letter of aggrement",
                      value: `/cms/report/batch/folio/${GetQueryStr(
                        "data",
                      )}/letter-of-aggrement`,
                    },
                  ]),
              {
                label: "Proforma Invoice",
                value: `/cms/report/batch/folio/${GetQueryStr(
                  "data",
                )}/proforma-invoice`,
              },

              {
                label: "Company Invoice",
                value: `/cms/report/batch/folio/${GetQueryStr(
                  "data",
                )}/company-invoice`,
              },
            ]}
            onChange={(e) => handleDownload(e)}
            // value={valueSel}
            ismulti={false}
            placeholder="Print"
          />
        </div>

        {!load ? (
          // <div className="sm:grid grid-cols-12 gap-2 h-fit border-b border-dashed">
          <div className="lg:grid grid-cols-12 gap-2 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold capitalize">{ModuleName}</h2>
            </div>
            <div className="col-span-8 h-fit"></div>
            {/* <div className="col-span-3 "> */}
            <div className="col-span-12 lg:col-span-3">
              <fieldset>
                <legend>Guest</legend>
                {/* <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2"> */}
                <div className="form-grid-responsive grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0]?.data?.map((row: any, index) => {
                    if (row?.type === "hidden") return null;

                    return (
                      // <div key={index} className={row?.cols + " relative"}>
                      <div
                        key={index}
                        className={`
                          ${row?.cols}
                          relative
                          ${
                            row?.isMissingMandatory
                              ? "mandatory-missing"
                              : row?.isMandatory
                              ? "mandatory-field"
                              : ""
                          }
                        `}
                      >
                        <InputMain
                          typeInput={
                            row?.type === "text" ||
                            row?.type === "number" ||
                            row?.type === "date" ||
                            row?.type === "time"
                              ? "base"
                              : row?.type
                          }
                          error={false}
                          required={row?.required ?? false}
                          // label={row?.label}
                          label={
                            row?.isMandatory ? `${row?.label} *` : row?.label
                          }
                          disabled={row?.disable}
                          rest={{
                            disabled: row?.disable, // base & textarea
                            readOnly: row?.readOnly ?? row?.disable,
                            autoComplete: row?.isAutoComp ? "off" : "on",
                            name: row?.name,
                            placeholder: row?.placeholder ?? row?.label,
                            value: row?.value,
                            type: row?.type,
                            onChange: (e) =>
                              changeHandlera(
                                e,
                                row?.type,
                                "0",
                                false,
                                {},
                                index,
                              ),
                            onKeyUp: (e: any) => {
                              if (row?.isAutoComp) {
                                if (e.target?.value?.length > 1) {
                                  setactAuto("0" + index);
                                  GetDataAutoComp(
                                    e.target?.value,
                                    row?.uri,
                                    row?.relate,
                                    index,
                                    -1,
                                    1,
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
                                  -1,
                                  1,
                                );
                              }
                            },
                          }}
                          restArea={{
                            disabled: row?.disable, // textarea
                            readOnly: row?.readOnly ?? row?.disable,
                            placeholder: row?.label,
                            name: row?.name,
                            value: row?.value,
                            onChange: (e) =>
                              changeHandlera(
                                e,
                                row?.type,
                                "0",
                                false,
                                {},
                                index,
                              ),
                          }}
                          onChangeSel={(e) => {
                            changeHandlera(
                              e,
                              row?.type,
                              "0",
                              row?.ismulti,
                              row?.options,
                              index,
                            );
                          }}
                          valueSel={row?.valueori}
                          options={row?.options}
                          isMulti={row?.ismulti}
                          isAll={row?.isAll}
                          valuename={row?.name}
                          colspan={row?.colcheckbox}
                          // image
                          onChangeFiles={(e) => {
                            changeHandlera(e, row?.type, "0", false, {}, index);
                          }}
                        />
                        {row?.isAutoComp && actAuto == "0" + index ? (
                          <>
                            {ListTblGuest(
                              row?.idpost,
                              0,
                              row?.name,
                              index,
                              -1,
                              row?.AdduRi ?? false,
                              0,
                              "a",
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <div className="mt-2 pb-2 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("guestPreference")}
                  className="mb-2 w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      showSections.guestPreference ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                  Guest Preference
                </button>

                {datadetail?.guest?.guest_profile_id &&
                  showSections.guestPreference && (
                    <TableView
                      uri="/cms/profile/guest-preference"
                      queryString={
                        "&guest_id=" + datadetail.guest.guest_profile_id
                      }
                      groups=""
                      isEditTable={true}
                      isTitle={true}
                      isDeleted={false}
                      isBtnAdd={true}
                      isPageing={false}
                    />
                  )}
              </div>

              <div className="mt-2 mb-2 pb-2 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("guestNotes")}
                  className="mb-2 w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      showSections.guestNotes ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                  Guest Notes
                </button>

                {datadetail?.guest?.guest_profile_id &&
                  showSections.guestNotes && (
                    <TableView
                      uri="/cms/profile/guest-notes"
                      queryString={
                        "&guest_id=" + datadetail.guest.guest_profile_id
                      }
                      groups=""
                      isEditTable={true}
                      isTitle={true}
                      isDeleted={false}
                      isBtnAdd={true}
                      isPageing={false}
                    />
                  )}
              </div>

              <div className="mt-2 mb-2 pb-2 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("messages")}
                  className="mb-2 w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      showSections.messages ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                  Messages
                </button>

                {showSections.messages && (
                  <TableView
                    uri="/cms/message"
                    queryString={"&folio_id=" + GetQueryStr("data")}
                    groups=""
                    isEditTable={true}
                    isTitle={true}
                    isDeleted={true}
                    isBtnAdd={true}
                    isPageing={false}
                  />
                )}
              </div>

              <div className="mt-2 mb-2 pb-2 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("wakeUpCall")}
                  className="mb-2 w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      showSections.wakeUpCall ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                  Wake-Up Call
                </button>
                {showSections.wakeUpCall && (
                  <TableView
                    uri="/cms/wake-up-call"
                    queryString={"&folio_id=" + GetQueryStr("data")}
                    groups=""
                    isEditTable={true}
                    isTitle={true}
                    isDeleted={true}
                    isBtnAdd={true}
                    isPageing={false}
                  />
                )}
              </div>
            </div>
            {/* <div className="col-span-6"> */}
            <div className="col-span-12 lg:col-span-6">
              <fieldset>
                <legend>Reservation</legend>
                {/* <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2"> */}
                <div className="form-grid-responsive grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
                  {dataform[1]?.data?.map((row: any, index) => (
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
                            clasCus={
                              row?.name == "room_status" &&
                              row?.valueOri?.value == 0
                                ? "!bg-cyan"
                                : row?.name == "room_status" &&
                                  row?.valueOri?.value == 1
                                ? "!bg-green"
                                : row?.name == "room_status" &&
                                  row?.valueOri?.value == 2
                                ? "!bg-purple"
                                : row?.name == "room_status" &&
                                  row?.valueOri?.value == 3
                                ? "!bg-red"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 0
                                ? "!bg-green"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 1
                                ? "!bg-purple"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 2
                                ? "!bg-red"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 3
                                ? "!bg-cyan"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 4
                                ? "!bg-blue"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 5
                                ? "!bg-yellow"
                                : ""
                            }
                            label={row?.label}
                            rest={{
                              disabled: row?.disable,
                              autoComplete: row?.isAutoComp ? "off" : "on",
                              name: row?.name,
                              placeholder: row?.placeholder ?? row?.label,
                              value: row?.value,
                              type: row?.type,

                              onChange: (e) => {
                                changeHandlera(
                                  e,
                                  row?.type,
                                  "1",
                                  false,
                                  {},
                                  index,
                                );
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
                                      -1,
                                      1,
                                    );
                                    changeHandlera(
                                      e,
                                      row?.type,
                                      "1",
                                      false,
                                      {},
                                      index,
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
                                    -1,
                                    1,
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
                                  "1",
                                  false,
                                  {},
                                  index,
                                );
                              },
                            }}
                            onChangeSel={(e) => {
                              changeHandlera(
                                e,
                                row?.type,
                                "1",
                                row?.ismulti,
                                row?.options,
                                index,
                              );
                            }}
                            valueSel={row?.valueori}
                            options={row?.options}
                            isMulti={row?.ismulti}
                            isAll={row?.isAll}
                            valuename={row?.name}
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
                                row?.AdduRi ?? false,
                                1,
                                "b",
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
              {!isVr ? (
                !isSubGit ? (
                  !isParentGit ? (
                    dataform[1]?.data[1].valueOri.value != 5 &&
                    dataform[1]?.data[1].valueOri.value != 2 &&
                    dataform[1]?.data[1].valueOri.value != 1 ? (
                      <div className="w-full flex mt-2 mb-2 justify-end">
                        <ButtonSubmit
                          isBtnAdd={canCreate || canUpdate}
                          label={"Add Data Reservation"}
                          onCreate={() => {
                            AddReservation();
                          }}
                        />
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {dataform[2].items?.map((rw: any, i) => (
                <>
                  <fieldset className="border min-w-full table-auto">
                    <legend className="">Data Reservation #{i + 1}</legend>
                    <div className="w-full flex justify-end">
                      {i > 0 && rw?.is_posting == 0 ? (
                        <>
                          <div
                            className="text-red font-bold cursor-pointer"
                            onClick={() => {
                              let dataInput = [...dataform];
                              dataInput[2].items = removeItem(
                                dataInput[2].items,
                                i,
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
                    {/* <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-2 mr-2"> */}
                    <div className="form-grid-responsive grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-2 mr-2">
                      {rw?.is_posting == 1 ? (
                        <div className="absolute h-full z-20 w-full"></div>
                      ) : (
                        <></>
                      )}

                      {rw?.data?.map((row: any, index) => (
                        <>
                          {!row?.ishide ? (
                            isParentGit == false ||
                            (isParentGit == true &&
                              row?.isHideParentGIT != true) ? (
                              isVr == false ||
                              (isVr == true && row?.isHideVR != true) ? (
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
                                    disabled={row?.disable}
                                    label={row?.label}
                                    rest={{
                                      // disabled:
                                      //   rw?.is_posting == -1
                                      //     ? row?.name == "check_out_date"
                                      //       ? false
                                      //       : datadetail?.is_vr &&
                                      //         row?.name == "check_in_date" &&
                                      //         datadetail?.reservation
                                      //           ?.status_reservation?.value == 3
                                      //       ? false
                                      //       : true
                                      //     : row?.disable,
                                      disabled:
                                        datadetail?.reservation?.room_status
                                          ?.value == 3 // DUE OUT, belum checkout
                                          ? row?.name == "name-room_type" &&
                                            !row?.ishide
                                            ? false
                                            : row?.name == "name-room" &&
                                              !row?.ishide
                                            ? false
                                            : rw?.is_posting == 1
                                            ? row?.name == "check_out_date"
                                              ? false
                                              : true
                                            : row?.disable
                                          : rw?.is_posting == 1 // bukan DUE OUT, pakai logic lama
                                          ? row?.name == "check_out_date"
                                            ? false
                                            : true
                                          : row?.disable,
                                      autoComplete: row?.isAutoComp
                                        ? "off"
                                        : "on",
                                      name: row?.name,
                                      placeholder:
                                        row?.placeholder ?? row?.label,
                                      value: row?.value,
                                      type: row?.type,
                                      min:
                                        row?.name == "check_out_date"
                                          ? dataform[2].items[i].data[7].value
                                          : i > 0 &&
                                            row?.name == "check_in_date"
                                          ? dataform[2].items[i - 1].data[9]
                                              .value
                                          : row?.type == "number" &&
                                            row?.name == "night"
                                          ? 1
                                          : row?.type == "number" &&
                                            row?.name == "adult"
                                          ? 1
                                          : row?.type == "number" &&
                                            row?.name != "adult"
                                          ? 1
                                          : isSubGit &&
                                            i == 0 &&
                                            row?.name == "check_in_date"
                                          ? dataform[2].items[0].data[7].value
                                          : "",
                                      onChange: (e) => {
                                        changeHandlera(
                                          e,
                                          row?.type,
                                          "2",
                                          false,
                                          {},
                                          i,
                                          index,
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
                                              i,
                                              2,
                                            );
                                            changeHandlera(
                                              e,
                                              row?.type,
                                              "1",
                                              false,
                                              {},
                                              index,
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
                                          i,
                                          2,
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
                                          "2",
                                          false,
                                          {},
                                          i,
                                          index,
                                        );
                                      },
                                    }}
                                    onChangeSel={(e) => {
                                      changeHandlera(
                                        e,
                                        row?.type,
                                        "2",
                                        row?.ismulti,
                                        row?.options,
                                        i,
                                        index,
                                      );
                                    }}
                                    valueSel={row?.value}
                                    options={row?.options}
                                    isMulti={row?.ismulti}
                                    isAll={row?.isAll}
                                    valuename={
                                      row?.name + "-" + index + "-" + i
                                    }
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
                                        row?.AdduRi ?? false,
                                        2,
                                        "c",
                                      )}
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              ) : (
                                <></>
                              )
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </div>
                  </fieldset>
                </>
              ))}
              <div className="flex gap-2 overflow-auto mb-2">
                {datadetailmaster?.legend?.map((rw) => (
                  <>
                    <div className={rw?.color + " p-2"}>{rw?.label}</div>
                  </>
                ))}
              </div>
              <fieldset>
                <legend>Special Instruction</legend>
                {/* <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2"> */}
                <div className="form-grid-responsive grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
                  {dataform[3]?.data?.map((row: any, index) => (
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
                            clasCus={
                              row?.name == "room_status" &&
                              row?.valueOri?.value == 0
                                ? "!bg-green"
                                : row?.name == "room_status" &&
                                  row?.valueOri?.value == 1
                                ? "!bg-yellow"
                                : row?.name == "room_status" &&
                                  row?.valueOri?.value == 2
                                ? "!bg-purple"
                                : row?.name == "room_status" &&
                                  row?.valueOri?.value == 3
                                ? "!bg-red"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 0
                                ? "!bg-green"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 1
                                ? "!bg-purple"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 2
                                ? "!bg-red"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 3
                                ? "!bg-orange"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 4
                                ? "!bg-blue"
                                : row?.name == "status_reservation" &&
                                  row?.valueOri?.value == 5
                                ? "!bg-yellow"
                                : ""
                            }
                            label={row?.label}
                            rest={{
                              disabled: row?.disable,
                              autoComplete: row?.isAutoComp ? "off" : "on",
                              name: row?.name,
                              placeholder: row?.placeholder ?? row?.label,
                              value: row?.value,
                              type: row?.type,

                              onChange: (e) => {
                                changeHandlera(
                                  e,
                                  row?.type,
                                  "3",
                                  false,
                                  {},
                                  index,
                                );
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
                                      -1,
                                      1,
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
                                    -1,
                                    1,
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
                                  "3",
                                  false,
                                  {},
                                  index,
                                );
                              },
                            }}
                            onChangeSel={(e) => {
                              changeHandlera(
                                e,
                                row?.type,
                                "3",
                                row?.ismulti,
                                row?.options,
                                index,
                              );
                            }}
                            valueSel={row?.value}
                            options={row?.options}
                            isMulti={row?.ismulti}
                            isAll={row?.isAll}
                            valuename={row?.name}
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
                                row?.AdduRi ?? false,
                                1,
                                "d",
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
            {/* <div className="col-span-3"> */}
            <div className="col-span-12 lg:col-span-3">
              <fieldset>
                <legend>Finance</legend>
                <div className="grid grid-cols-12 gap-2 ml-2 mb-4 mt-4 mr-2">
                  <div className="col-span-2 font-bold">#</div>
                  <div className="col-span-5 font-bold">Dates</div>
                  <div className="col-span-5 font-bold">Rate</div>
                  {datprice?.date?.map((row, index) => (
                    <>
                      <div className="col-span-2">{index + 1}</div>
                      <div className="col-span-5">{row?.date}</div>
                      <div className="col-span-5">{row?.charge}</div>
                    </>
                  ))}

                  <div className="col-span-12 border-b-2"></div>

                  {datprice?.charge?.map((row, index) => (
                    <>
                      <div className="col-span-2"></div>
                      <div className="col-span-5">{row?.label}</div>
                      <div className="col-span-5">{row?.value}</div>
                    </>
                  ))}
                </div>
              </fieldset>
              <div className="mt-2 mb-2 pb-2 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("depositPayment")}
                  className="mb-2 w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      showSections.depositPayment ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                  Deposit & Payment
                </button>

                {showSections.depositPayment && (
                  <TableView
                    uri="/cms/deposit-payment"
                    queryString={"&folio_id=" + GetQueryStr("data")}
                    groups=""
                    isEditTable={true}
                    isTitle={true}
                    isDeleted={true}
                    isBtnAdd={true}
                    isPageing={false}
                  />
                )}
              </div>

              <div className="mt-2 mb-2 pb-2 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("billingTo")}
                  className="mb-2 w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      showSections.billingTo ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                  Billing To
                </button>

                {showSections.billingTo && (
                  <TableView
                    uri="/cms/billing-to"
                    queryString={"&folio_id=" + GetQueryStr("data")}
                    groups=""
                    isEditTable={true}
                    isTitle={true}
                    isDeleted={false}
                    isBtnAdd={false}
                    isPageing={false}
                  />
                )}
              </div>

              <div className="mt-2 mb-2 pb-2 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("autoTransfer")}
                  className="mb-2 w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      showSections.autoTransfer ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                  Auto Transfer
                </button>

                {showSections.autoTransfer && (
                  <TableView
                    uri="/cms/auto-transfer"
                    queryString={"&folio_id=" + GetQueryStr("data")}
                    groups=""
                    isEditTable={true}
                    isTitle={true}
                    isPageing={false}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex justify-center">
            <IconSpiner />
          </div>
        )}
      </div>
      {
        <ModalConfirmationComponent
          label="Do you want to recalculate rate?"
          title="Recalculate Rate"
          isShowIcon={false}
          IsOpenModel={IsOpenModal}
          ChangeonClose={(e) => {
            setIsOpenModal(e);
          }}
          onCheck={(e) => {
            if (e) {
              setIsOpenModal(false);
              OnSave(1);
            } else {
              setIsOpenModal(false);
              OnSave(0);
            }
          }}
        />
      }

      <ModalNotedComponent
        text={dataform[3].data[0].value}
        title="Remark"
        IsOpenModel={IsOpenModalIns}
        ChangeonClose={(e) => {
          setIsOpenModalIns(e);
        }}
      />

      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              // console.log("Path->", GetQueryStr("path_v"));
              // if (GetQueryStr("path_v")) {
              //   router.replace({
              //     pathname: GetQueryStr("path_v"),
              //     query: {
              //       parent: GetQueryStr("parent"),
              //       module: GetQueryStr("module"),
              //       data: GetQueryStr("data"),
              //       body: GetQueryStr("body") ?? null,
              //       src: GetQueryStr("src") ?? null,
              //       search_value: GetQueryStr("search_v"),
              //       search_field: GetQueryStr("search_field_v"),
              //     },
              //   });
              // } else {
              // }
              history.back();

              // console.log("history url", window.history);
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />
          {!isISCancel ? (
            <ButtonSubmit
              isBtnAdd={canCreate || canUpdate}
              onCreate={() => {
                setloading(true);
                CheckButtonSave();
              }}
              loading={loading}
              label="Save Change"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
export default EditView;
