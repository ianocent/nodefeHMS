import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "../../../../context/LayoutContext";
import Seo from "../../../common/seo";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  GetSelisihDay,
  RouteChange,
  removeItem,
  GetNextDay,
} from "../../../helper";
import { useSelector } from "react-redux";
import InputMain from "../../../common/input/InputMain";
import TableView from "../../../common/table-edit";
import TabMenuIcon from "../../../common/tabIcon/tab";
import ModalConfirmationComponent from "../../../common/modal/ModalConfirmation";

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
  const [dataguest, setdataguest] = useState<any>([]);
  const [actAuto, setactAuto] = useState("-1");
  const [load, setisload] = useState(false);
  const [datadetail, setdatadetail] = useState<any>({});
  const [datprice, setdatprice] = useState<any>({});
  const [dataval, setData] = useState<any>({ type_reservation: "fit" });
  const [isParentGit, setIsParentGIT] = useState(false);
  const [IsOpenModal, setIsOpenModal] = useState(false);
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
          uri: "/cms/profile/guest",
          disable: false,
          AdduRi: "profile/guest/main?parent=83&add=1",
          value: "",
          valueid: "",
        },
        {
          label: "KTP",
          name: "card_number",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
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
        },
        {
          label: "Email",
          name: "email",
          type: "text",
          cols: "col-span-8",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
        },
        {
          label: "Gender",
          name: "gender",
          type: "select-multi",
          cols: "col-span-4",
          options: [{}],
          dataopt: "genders",
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
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
        },
        {
          label: "Nationality",
          name: "nationality_id",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "countries",
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
        },
        {
          label: "Status",
          name: "status_profile",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          dataopt: "status_guests",
          ismulti: false,
          value: {},
          valueori: {},
          sugestdata: "a",
          parent: 0,
        },
        {
          label: "Phone",
          name: "telp",
          type: "number",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
        },
        {
          label: "Mobile Phone",
          name: "mobile_phone",
          type: "number",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
        },
        {
          label: "Guest Stay",
          name: "guest_stay",
          type: "number",
          cols: "col-span-6",
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
        },
        {
          label: "Postal Code",
          name: "postal_code",
          type: "number",
          cols: "col-span-6",
          options: [{}],
          value: "",
          sugestdata: "a",
          parent: 0,
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
          uri: "/cms/profile/company",
          disable: false,
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
        },
        {
          label: "Guaranted",
          name: "guaranted",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
        },
        {
          label: "Print Rate",
          name: "print_status",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
        },
        {
          label: "Use Allotment",
          name: "use_allotment",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
        },
        {
          label: "Do Not Distrub",
          name: "is_do_not_disturb",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
        },
        {
          label: "Incognito",
          name: "is_incognito",
          type: "checkbox",
          cols: "col-span-4",
          options: [{}],
          ismulti: false,
          value: false,
        },
        {
          label: "Long Stay",
          name: "is_long_stay",
          type: "checkbox",
          cols: "col-span-12",
          options: [{}],
          ismulti: false,
          value: false,
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
          name: "name-contact_person",
          type: "text",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
          isAutoComp: true,
          placeholder: "Search Contact person Here.",
          idpost: "contact_person_id",
          relate: "11",
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
              type: "hidden",
              cols: "col-span-3",
              options: [{}],
              value: "",
              idpost: "room_type_id",
              valueid: "",
              disable: true,
              isHideParentGIT: true,
            },
            {
              label: "Room",
              name: "room_id",
              type: "hidden",
              cols: "col-span-3",
              options: [{}],
              value: "",
              idpost: "room_id",
              valueid: "",
              disable: true,
              isHideParentGIT: true,
            },
            {
              label: "Change Room",
              name: "change_room",
              type: "hidden",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: false,
              isHideParentGIT: true,
            },
            {
              label: "Immediately",
              name: "immediately",
              type: "hidden",
              cols: "col-span-3",
              options: [{}],
              ismulti: false,
              value: false,
              ishide: true,
              isHideParentGIT: true,
            },
            {
              label: "Room Type",
              name: "name-room_type",
              type: "text",
              cols: "col-span-4",
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
            },
            {
              label: "Room Configuration",
              name: "room_conf",
              type: "hidden",
              cols: "col-span-4",
              options: [{}],
              isAll: false,
              ismulti: true,
              sugestdata: "a",
              value: [],
              ishide: true,
              isHideParentGIT: true,
            },
            {
              label: "Room",
              name: "name-room",
              type: "hidden",
              cols: "col-span-4",
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
            },
            {
              label: "Check In",
              name: "check_in_date",
              type: "date",
              cols: "col-span-4",
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
              isHideParentGIT: true,
              value: "",
            },
            {
              label: "Check Out",
              name: "check_out_date",
              type: "date",
              cols: "col-span-4",
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
              isHideParentGIT: true,
              value: "",
            },
            {
              label: "ATA",
              name: "ata",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              isHideParentGIT: true,
              value: "12:00",
            },
            {
              label: "ATD",
              name: "atd",
              type: "time",
              cols: "col-span-2",
              options: [{}],
              ismulti: false,
              isHideParentGIT: true,
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
              value: "",
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
              value: "",
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
              value: "",
              isHideParentGIT: true,
            },
            {
              label: "Rate Code",
              name: "name-rate",
              type: "hidden",
              cols: "col-span-12",
              options: [{}],
              ismulti: false,
              isAutoComp: true,
              placeholder: "Search Rate Here.",
              idpost: "rate_id",
              relate: "7;9;company_profile_id",
              uri: "/cms/reservation/rate-by-company-id?check_in_date=[0]&check_out_date=[1]&company_profile_id=[2]",
              value: "",
              valueid: "",
            },
          ],
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
      if (e.target.name == "check_out_date") {
        dataInput[form].items[index].data[11].value = GetSelisihDay(
          dataInput[form].items[index].data[7].value,
          e.target.value
        );
      }
      if (e.target.name == "night") {
        dataInput[form].items[index].data[9].value = GetNextDay(
          dataInput[form].items[index].data[7].value,
          e.target.value
        );
      }
      if (ia) {
        dataInput[form].items[index].data[ia].value = e.target.value;
      } else {
        dataInput[form].data[index].value = e.target.value;
      }
    } else if (b == "select-multi" || b == true) {
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
      console.log(e.target.value);
      if (e.target.value.split("-")[0] == "change_room") {
        if (e.target.checked) {
          dataInput[form].items[index].data[3].ishide = false;
          dataInput[form].items[index].data[4].ishide = false;
          dataInput[form].items[index].data[5].ishide = false;
          dataInput[form].items[index].data[6].ishide = false;
        } else {
          dataInput[form].items[index].data[3].ishide = true;
          dataInput[form].items[index].data[4].ishide = true;
          dataInput[form].items[index].data[5].ishide = true;
          dataInput[form].items[index].data[6].ishide = true;
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
          dataInput[form].items[index].data[ia].value = e.target.checked;
        } else {
          console.log("test", form);

          dataInput[form].data[index].value = e.target.checked;
        }
      }
    }
    setdataform([...dataInput]);
    console.log(dataInput);
    // setError("");
  };
  const GetDataDetail = async () => {
    try {
      console.log("wdypm", "weswes");
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
        setdatadetail(data?.data);
        //rate
        setdatprice(data?.data?.revenue);
        //guest
        dataform[0].data?.map((rw, i) => {
          if (rw?.name == "first_name-guest") {
            dataInput[0].data[i].value = data?.data?.guest?.guest_name;
          } else {
            if (rw?.dataopt) {
              dataInput[0].data[i].value = data?.data?.guest[rw?.name]?.value;
              dataInput[0].data[i].valueori = data?.data?.guest[rw?.name];
            } else {
              dataInput[0].data[i].value = data?.data?.guest[rw?.name];
            }
          }
          if (rw?.idpost && data?.data?.guest[rw?.idpost]) {
            // console.log("tersrre", data?.data?.guest[rw?.idpost]);
            dataInput[0].data[i].valueid = data?.data?.guest[rw?.idpost];
          }
          if (rw?.dataopt) {
            dataInput[0].data[i].options = data?.master[rw?.dataopt];
          }
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
            }
          }
          if (rw?.dataopt) {
            dataInput[1].data[i].options = data?.master[rw?.dataopt];
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
          dataform[2].items[index]?.data?.map((rw, i) => {
            if (rw?.name == "name-room_type") {
              dataInput[2].items[index].data[i].valueOri =
                data?.data?.reservation_items[index]?.room_type_id_next;
              dataInput[2].items[index].data[i].value =
                data?.data?.reservation_items[index]?.room_type_id_next?.label;
              dataInput[2].items[index].data[i].valueid =
                data?.data?.reservation_items[index]?.room_type_id_next?.value;
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
            } else {
              //
              dataInput[2].items[index].data[i].value = rws[rw?.name];
            }
            console.log("wdypm", dataInput[2].items[index].data[i]);
            if (rw?.name == "check_in_date") {
              // row?.disablecon
              console.log("wdypm", dataInput[2].items[index].data[i]);
              dataInput[2].items[index].data[i].disable = false;
            }

            if (rw?.name == "change_room") {
              if (rws?.change_room) {
                dataInput[2].items[index].data[3].ishide = false;
                dataInput[2].items[index].data[4].ishide = false;
                dataInput[2].items[index].data[5].ishide = false;
                dataInput[2].items[index].data[6].ishide = false;
              } else {
                dataInput[2].items[index].data[3].ishide = true;
                dataInput[2].items[index].data[4].ishide = true;
                dataInput[2].items[index].data[5].ishide = true;
                dataInput[2].items[index].data[6].ishide = true;
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

        // check is parent git
        setIsParentGIT(data?.data?.is_parent_git);

        setdataform([...dataInput]);
      }
      // console.log(dataform);
      // console.log(data);
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
          cols: "col-span-4",
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
          cols: "col-span-4",
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
          cols: "col-span-4",
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
          value: GetNextDay(dataInput[2].items[index - 1].data[9].value, 1),
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
          value: GetNextDay(dataInput[2].items[index - 1].data[9].value, 2),
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
          value: "12:00",
        },
        {
          label: "ATD",
          name: "atd",
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
          value: dataInput[2].items[index - 1].data[17].value,
          valueid: dataInput[2].items[index - 1].data[17].valueid,
        },
      ],
    });
    setdataform([...dataInput]);
  };
  const GetDataAutoComp = async (word, uri, relate: any, ix, ia, frm) => {
    try {
      let getuuri = "";
      console.log("uri1", uri);

      if (relate) {
        var relatestr = "" + relate;
        var relatearr = relatestr.split(";");
        console.log("relatearr", relatearr);

        relatearr?.map((rw, index) => {
          console.log("index ke", ia);
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
      console.log("uri2", uri);
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
      console.log("error", error);
      return;
    }
  };
  const GetRate = async () => {
    try {
      if (isParentGit) {
        return;
      }

      setisload(false);
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
        setisload(true);
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
    return objpost;
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
          console.log("sukses", ia);
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
    console.log(dataval);
    dataform[idat]?.data?.map((row: any, index) => {
      var obj = {
        [row?.name]: rw[row?.name] ?? "",
      };

      if (row?.sugestdata == n && rw[row?.name]) {
        if (ix == row?.parent) {
          // console.log("buz", frm + "-" + ix + "-" + row?.name);

          dataInput[frm].data[index].value = rw[row?.name];
        }
        // console.log("buz", name + ";" + row?.name + ";" + rw[names[1]]);
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
    // Auto-fill market segments from company sync_mkt_segment_* when selecting from autocomplete
    if (name == "name-company" && rw) {
      setData((prev: any) => {
        const master = prev?.masterdata;
        if (!master) return prev;
        const updates: any = {};
        for (let i = 1; i <= 4; i++) {
          const syncVal = rw[`sync_mkt_segment_${i}`];
          if (syncVal) {
            const matchOpt = (master[`market_segment_${i}`] || []).find(
              (o: any) => String(o.label).toLowerCase() === String(syncVal).toLowerCase()
            );
            if (matchOpt) {
              updates[`market_segment_${i}`] = matchOpt;
              updates[`market_segment_${i}_ori`] = matchOpt;
              const idx = dataInput[frm]?.data?.findIndex((d: any) => d.name === `market_segment_${i}`);
              if (idx >= 0 && dataInput[frm]?.data?.[idx]) dataInput[frm].data[idx].value = matchOpt;
            }
          }
        }
        if (rw.source) {
          const srcMatch = (master.source || []).find(
            (o: any) => String(o.label).toLowerCase() === String(rw.source).toLowerCase()
          );
          if (srcMatch) {
            updates.source = srcMatch;
            updates.source_ori = srcMatch;
            const idx = dataInput[frm]?.data?.findIndex((d: any) => d.name === 'source');
            if (idx >= 0 && dataInput[frm]?.data?.[idx]) dataInput[frm].data[idx].value = srcMatch;
          }
        }
        return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
      });
    }
    if (ia != -1) {
      dataInput[frm].items[ia].data[ix].valueid = rw?.id;
      dataInput[frm].items[ia].data[ix].value = rw[names[0]];
    } else {
      dataInput[frm].data[ix].valueid = rw?.id;
      dataInput[frm].data[ix].value = rw[names[0]];
    }
    setdataform([...dataInput]);
    setTimeout(() => {
      if (name == "name-rate") {
        GetRate();
      }
      if (name == "name-room_type") {
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
                                // console.log("wid" + ix);
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
                    <ButtonSubmit label="Add" onCreate={() => {}} />
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
  const OnSave = async (cal?: number) => {
    try {
      let urisave = "/cms/reservation/" + GetQueryStr("data");
      let mth = "PUT";

      var objpost: any = FinalPOstDat();
      objpost.is_calculate = cal ?? 1;
      const raw = JSON.stringify(objpost);
      const aesraw = GetEncrypt(raw);

      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        window.location.search
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
  useEffect(() => {
    GetDataDetail();
  }, [window.location.search]);
  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <div className="flex flex-col gap-4">
        {popup ? (
          <div className="overlay">
            <div className="w-[50%] relative h-[300px] bg-white z-20 top-[200px] left-[28%]"></div>
          </div>
        ) : (
          <></>
        )}
        <TabMenuIcon actMenu={""} id={GetQueryStr("data")} foliodat={""} />
        <div className="sm:grid grid-cols-12 gap-2 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold capitalize">{ModuleName}</h2>
          </div>
          <div className="col-span-8 h-fit"></div>
          <div className="col-span-3 ">
            <fieldset>
              <legend>Guest</legend>
              <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
                {dataform[0]?.data?.map((row: any, index) => (
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
                                "0",
                                false,
                                {},
                                index
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
                                    1
                                  );
                                  changeHandlera(
                                    e,
                                    row?.type,
                                    "0",
                                    false,
                                    {},
                                    index
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
                                  1
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
                                index
                              );
                            },
                          }}
                          onChangeSel={(e) => {
                            changeHandlera(
                              e,
                              row?.type,
                              "0",
                              row?.ismulti,
                              row?.options,
                              index
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
                              0,
                              "a"
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
            <div className="mt-2">
              {datadetail?.guest?.guest_profile_id ? (
                <>
                  <TableView
                    uri="/cms/profile/guest-preference"
                    queryString={
                      "&guest_id=" + datadetail?.guest?.guest_profile_id
                    }
                    groups=""
                    isEditTable={true}
                    isTitle={true}
                    isDeleted={false}
                    isBtnAdd={true}
                    isPageing={false}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="mt-2 mb-2">
              {datadetail?.guest?.guest_profile_id ? (
                <>
                  <TableView
                    uri="/cms/profile/guest-notes"
                    queryString={
                      "&guest_id=" + datadetail?.guest?.guest_profile_id
                    }
                    groups=""
                    isEditTable={true}
                    isTitle={true}
                    isDeleted={false}
                    isBtnAdd={true}
                    isPageing={false}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="mt-2 mb-2">
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
            </div>
            <div className="mt-2 mb-2 ">
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
            </div>
          </div>
          <div className="col-span-6">
            <fieldset>
              <legend>Reservation</legend>
              <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
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
                                "1",
                                false,
                                {},
                                index
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
                                    1
                                  );
                                  changeHandlera(
                                    e,
                                    row?.type,
                                    "1",
                                    false,
                                    {},
                                    index
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
                                  1
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
                                index
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
                              index
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
                              "b"
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
            {!isParentGit ? (
              <div className="w-full flex mt-2 justify-end">
                <ButtonSubmit
                  label="Add Data Reservation"
                  onCreate={() => {
                    AddReservation();
                  }}
                />
              </div>
            ) : (
              <></>
            )}
            {dataform[2].items?.map((rw: any, i) => (
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
                            dataInput[2].items = removeItem(
                              dataInput[2].items,
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
                        {!row?.ishide ? (
                          isParentGit == false ||
                          (isParentGit == true &&
                            row?.isHideParentGIT != true) ? (
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
                                  disabled: row?.disable,
                                  autoComplete: row?.isAutoComp ? "off" : "on",
                                  name: row?.name,
                                  placeholder: row?.placeholder ?? row?.label,
                                  value: row?.value,
                                  type: row?.type,
                                  min:
                                    row?.name == "check_out_date"
                                      ? dataform[2].items[i].data[4].value
                                      : i > 0 && row?.name == "check_in_date"
                                      ? dataform[2].items[i - 1].data[6].value
                                      : row?.type == "number" &&
                                        row?.name == "night"
                                      ? 1
                                      : row?.type == "number" &&
                                        row?.name == "adult"
                                      ? 1
                                      : row?.type == "number" &&
                                        row?.name != "adult"
                                      ? 1
                                      : "",
                                  onChange: (e) => {
                                    changeHandlera(
                                      e,
                                      row?.type,
                                      "2",
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
                                          i,
                                          2
                                        );
                                        changeHandlera(
                                          e,
                                          row?.type,
                                          "1",
                                          false,
                                          {},
                                          index
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
                                      2
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
                                      index
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
                                    index
                                  );
                                }}
                                valueSel={row?.value}
                                options={row?.options}
                                isMulti={row?.ismulti}
                                isAll={row?.isAll}
                                valuename={row?.name + "-" + index + "-" + i}
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
                                    "c"
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
                        )}
                      </>
                    ))}
                  </div>
                </fieldset>
              </>
            ))}
            <fieldset>
              <legend>Special Instruction</legend>
              <div className="grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-4 mr-2">
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
                                index
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
                                    1
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
                                  1
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
                                index
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
                              index
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
                              "d"
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
          <div className="col-span-3">
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
                    <div className="col-span-5">{row?.charge.toFixed(2)}</div>
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
            <div className="mt-2 mb-2">
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
            </div>
            <div className="mt-2 mb-2">
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
            </div>
          </div>
        </div>
      </div>
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

      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              router.replace({
                pathname: "/reservation/" + dataval?.type_reservation,
                query: {
                  parent: GetQueryStr("parent"),
                },
              });
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />

          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              setIsOpenModal(true);
            }}
            loading={loading}
            label="Save Change"
          />
        </div>
      </div>
    </>
  );
};
export default EditView;
