// housekeeping_roomstatus.tsx
import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import {
  FetchData,
  GetCurrentDate,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  GetQueryStr,
} from "../../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
import TableView from "../../../common/table-edit";
import { redirect, usePathname } from "next/navigation";
import { useTransactionPermission } from "../../../../hooks/useFormPermission";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, fn, ln, ti, pn, em) => void;
  nameinit?: string;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AddView = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/housekeeping/room-status";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() - 6);
  const [dataFilter, setDataFilter] = useState<any>({
    from_date: undefined,
    to_date: undefined,
  });
  const [datavaled, setDataEd] = useState<any>({});
  const [dataMaster, setDataMaster] = useState<any>();
  const [isStartCleanTime, setisStartCleanTime] = useState(false);
  const [isEndCleanTime, setisEndCleanTime] = useState(false);
  const [isDoneInspection, setisDoneInspection] = useState(false);
  const [isStillNeedCleaning, setisStillNeedCleaning] = useState(false);
  const performCleaning = useTransactionPermission("perform_cleaning");
  const performInspection = useTransactionPermission("perform_inspection");
  const isHK = performCleaning && !performInspection;
  const isHKSPV = performInspection;
  const [dates, setdates] = useState("");
  const pathname = usePathname();
  const markNotificationAsReadForRoom = async (roomId: string) => {
      setloading(true);
      try {
          const payload = {
              type: "inspection_required",
              room_id: roomId,
              date: dates || GetCurrentDate()
          };

          const aesraw = GetEncrypt(JSON.stringify(payload));

          const response = await FetchData(
              `/cms/task/mark-hk-read`,
              "POST",
              aesraw,
              false,
              datalocal?.data?.access_token,
              router,
              ""
          );

          if (String(response?.code) === "200") {
              router.replace({
                  pathname: window.location.pathname,
                  query: { ...router.query, time: Date.now() },
              });
          } else {
              alert(response?.message || "Gagal mark as read");
          }
      } catch (e) {
          console.error(e);
          alert("Terjadi kesalahan saat mark as read");
      } finally {
          setloading(false);
      }
  };
  const [dataform, setdataform] = useState([
    {
      name: "Guest",
      data: [
        {
          label: "With tv",
          name: "with_tv",
          type: "checkbox",
          cols: "col-span-6",
        },
        {
          label: "With shower",
          name: "with_shower",
          type: "checkbox",
          cols: "col-span-6",
        },
        {
          label: "Unit",
          name: "name",
          type: "text",
          cols: "col-span-4",
        },
        {
          label: "Cleaning time",
          name: "cleaning_time",
          type: "text",
          cols: "col-span-4",
        },
        {
          label: "Linen days",
          name: "linen_days",
          type: "text",
          cols: "col-span-4",
        },
        {
          label: "Clean Status",
          name: "maid_status",
          type: "select-multi",
          cols: "col-span-6",
        },
        {
          label: "Room Status",
          name: "room_status",
          type: "select-multi",
          cols: "col-span-6",
        },
        {
          label: "Floor",
          name: "floor",
          type: "select-multi",
          cols: "col-span-4",
        },
        {
          label: "Tower",
          name: "building",
          type: "select-multi",
          cols: "col-span-4",
        },
        {
          label: "Room type",
          name: "room_type_id",
          type: "select-multi",
          cols: "col-span-4",
        },
        {
          label: "Bed",
          name: "total_bed",
          type: "text",
          cols: "col-span-4",
        },
        {
          label: "Phone Ext",
          name: "phone_ext",
          type: "text",
          cols: "col-span-4",
        },
        {
          label: "Max pax",
          name: "max_pax",
          type: "text",
          cols: "col-span-4",
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          cols: "col-span-12",
        },
      ],
    },
  ]);

  const [dataformFilter, setDataFormFilter] = useState([
    {
      name: "main",
      data: [
        {
          label: "From",
          name: "from_date",
          type: "date",
          cols: "col-span-6",
        },
        {
          label: "To",
          name: "to_date",
          type: "date",
          cols: "col-span-6",
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    // setIsload(false);
    let qStr = "";
    // console.log("widylog", b + "-" + name + "-" + e?.target?.value + "-");
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      setDataFilter({ ...dataFilter, [e.target.name]: e.target.value });
      qStr = "&" + e.target.name + "=" + e?.target?.value;
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      setDataFilter({
        ...dataFilter,
        [name + "_ori"]: e,
        [name]: ismulti ? valarr : e?.value,
      });
      qStr = qStr + "&" + name + "=" + e?.value;
    } else if (b == "checkbox") {
      if (ismulti) {
        if (e.target.checked == true) {
          setDataFilter({ ...dataFilter, [e.target.value]: e.target.checked });
          qStr = "&" + e.target.value + "=" + e.target.checked;
        }
        let valarr = [];
        options?.map((row) => {
          if (dataFilter[row?.value]) {
            valarr.push(row?.value);
          }
        });
        setDataFilter({ ...dataFilter, [name]: valarr });
      } else {
        setDataFilter({ ...dataFilter, [name]: e.target.checked });
        qStr = "&" + name + "=" + e.target.checked;
      }
    }

    var objVal = Object.keys(dataval);
    objVal?.map((val) => {
      if (dataval[val]) {
        if (val != name && val != e?.target?.name && val != e?.target?.value) {
          console.log("bs", val + "-" + name);
          qStr = "&" + val + "=" + dataval[val] + qStr;
        }
      }
    });
  };

  function filterCom() {
    return (
      <>
        <fieldset className="">
          {/* <div className="sm:grid grid-cols-12 h-fit gap-4"> */}
          <div className="grid grid-cols-12 h-fit gap-4">
            <div className="col-span-12">
              {/* <div className="sm:grid grid-cols-12 h-fit gap-4 "> */}
                <div className="grid grid-cols-12 h-fit gap-4 ">
                {dataformFilter[0].data?.map((row: any) => (
                  <div
                    className={
                      row?.cols +
                      (row?.type == "checkbox" && row?.name != "fields"
                        ? " border  border-dashed !border-blue rounded-md p-2 "
                        : "")
                    }
                  >
                    <InputMain
                      disabled={true}
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
                        value: dataFilter[row?.name],
                        type: row?.type,
                        onChange: (e) => {
                          changeHandler(e, row?.type, row?.name);
                        },
                        min: row?.mindate,
                      }}
                      restArea={{
                        placeholder: row?.label,
                        name: row?.name,
                        value: dataFilter[row?.name],
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
                      valueSel={dataFilter[row?.name + "_ori"]}
                      options={row?.options}
                      isMulti={row?.ismulti}
                      valuename={"b" + row?.name}
                      colspan={row?.isOneColumn ? "col-span-12" : "0"}
                      isAll={row?.isAll}
                      valMulti={dataFilter}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </fieldset>
      </>
    );
  }

  useEffect(() => {
    console.log("log", nameinit);
    if (nameinit) {
      setData({ ...dataval, ["first_name"]: nameinit });
    }
  }, []);
  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
    }
  };
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showMarkAsRead, setShowMarkAsRead] = useState(false);

  const GetDetailUser = async (i: any) => {
    setuiddata(i);
    try {
        let getuuri = GLOBALURI + "/" + i + "/update";
        if (i == 0) getuuri = GLOBALURI + "/create";

        const datauser: any = await FetchData(
            getuuri, "GET", "", false, datalocal?.data?.access_token, router, ""
        );

        setDataEd(datauser?.data);
        setData(datauser?.data);
        setDataMaster(datauser?.master);
        setCurrentUserId(datauser?.master?.current_user_id);

        const history = datauser?.master?.houseKeeperHistory;

        const userRolesRaw = [
            ...(datalocal?.data?.role || []),
            ...(datalocal?.data?.roles || []),
        ];

        let isHK = false;
        let isHKSPV = false;

        userRolesRaw.forEach((r: any) => {
            let roleName = String(
                r?.name || 
                r?.NAME || 
                r?.pivot?.name || 
                r ||
                ''
            ).toLowerCase().trim();

            if (roleName === 'hk' || roleName.includes('hk')) isHK = true;
            if (roleName === 'hkspv' || roleName.includes('hkspv')) isHKSPV = true;
        });

        const currentUserIdFromMaster = datauser?.master?.current_user_id || datalocal?.data?.id;

        const assignedUsers = history?.users || [];
        const isMyRoom = assignedUsers.some((item: any) => 
            item?.user_id === currentUserIdFromMaster || 
            item?.userData?.id === currentUserIdFromMaster
        );

        // Reset dulu
        setisStartCleanTime(false);
        setisEndCleanTime(false);
        setisDoneInspection(false);

        if (performCleaning && history) {
            if (!history.start_clean_time) {
                setisStartCleanTime(true);
            } else if (history.start_clean_time && !history.end_clean_time) {
                setisEndCleanTime(true);
            }
        }

        if (performInspection && history) {
            if (history.end_clean_time && !history.done_inspection) {
              setisDoneInspection(true);
              setisStillNeedCleaning(true);
            } else if (!history.start_clean_time){
              setisStillNeedCleaning(false);
            } else if (history.start_clean_time){
              setisStillNeedCleaning(false);
            }
        }

        setdates(history?.date || "");

        // Set filter tanggal
        const currentDate = new Date(datauser?.master?.business_date || new Date());
        const sixDaysBefore = new Date(currentDate);
        sixDaysBefore.setDate(currentDate.getDate() - 6);

        const formatDateFn = (date: Date) => 
            `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

        setDataFilter({
            from_date: formatDateFn(sixDaysBefore),
            to_date: formatDateFn(currentDate),
        });

    } catch (error) {
        console.error("GetDetailUser error:", error);
    }
  };
  useEffect(() => {
      const userRoles = datalocal?.data?.roles || [];
      const isHKSPV = userRoles.some((r: any) => {
          const roleName = (r.name || r.NAME || '').toString().toLowerCase();
          return roleName === 'hkspv' || roleName.includes('hkspv');
      });

      // Jika ingin otomatis update showMarkAsRead ketika history berubah
      // (misalnya setelah klik Done Inspection)
      if (isHKSPV && dataMaster?.houseKeeperHistory?.done_inspection) {
          setShowMarkAsRead(true);
      }
  }, [dataMaster?.houseKeeperHistory, datalocal?.data?.roles]);

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
      "title",
      "region",
    ];

    propertiesToTransform.forEach((property) => {
      if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const updateHouseKeeperHistory = async (type: string) => {
    setloading(true);
    try {
      if (
        type === "end_clean_time" ||
        type === "done_inspection"
      ) {

        setCurrentActionType(type);
        await fetchChecklist(type);
        setShowChecklistPopup(true);

        return;
      }

      const raw = JSON.stringify({
        date: dates,
        type: type,
      });

      const urisave = `/cms/housekeeping/room-status/status/${idusr}`;

      const aesraw = GetEncrypt(raw);

      const saveprocess = await FetchData(
        urisave,
        "PUT",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (saveprocess?.code == "200") {

        router.replace({
          pathname: window.location.pathname,
          query: {
            parent: GetQueryStr("parent"),
            data: GetQueryStr("data"),
            view: 1,
            module: GetQueryStr("module"),
            time: new Date().getTime(),
          },
        });

        await GetDetailUser(idusr);

      } else {

        alert(saveprocess?.message || "Gagal memperbarui status");

      }

    } catch (error) {

      console.error("updateHouseKeeperHistory error:", error);

      alert("Terjadi kesalahan saat memperbarui status");

    } finally {

      setloading(false);

    }
  };

  const OnSave = async () => {
    // console.log("widylog", dataval);
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const transformedData = transformData(dataval);

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
        router;
        ActionSv(
          saveprocess?.data?.id,
          saveprocess?.data?.first_name,
          saveprocess?.data?.last_name,
          saveprocess?.data?.title?.label,
          saveprocess?.data?.telp,
          saveprocess?.data?.email
        );
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
    const idparent = urlParams.get("parent");
    setparent(idparent);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);

  const [showChecklistPopup, setShowChecklistPopup] = useState(false);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [currentActionType, setCurrentActionType] = useState("");
  const [showRecleanPopup, setShowRecleanPopup] = useState(false);
  const [recleanNotes, setRecleanNotes] = useState("");

  const fetchChecklist = async (actionType: string) => {
    try {
      const usedBy =
        actionType === "done_inspection"
          ? "hkspv"
          : "hk";

      const response = await FetchData(
        `/cms/housekeeping/room-status/checklist?used_by=${usedBy}&room_id=${idusr}`,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (String(response?.code) === "200") {
        const items = response?.data || [];
  
        setChecklistItems(items);
  
        const initialChecked: Record<number, boolean> = {};
        items.forEach((item: any) => {
          initialChecked[item.id] = false;   // ← was: true
        });
  
        setCheckedItems(initialChecked);
      }
    } catch (err) {
      console.error(err);
      alert("Failed load checklist");
    }
  };

  // === FUNGSI HANDLE CHECKBOX ===
  const handleChecklistChange = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const submitWithChecklist = async () => {
    setloading(true);
  
    try {
      const uncheckedRequired = checklistItems.filter(
        (item) => item.is_required && !checkedItems[item.id]
      );
  
      // ── HKSPV: kalau ada required yang belum dicentang → otomatis still_need_to_clean ──
      if (currentActionType === "done_inspection" && uncheckedRequired.length > 0) {
        const itemNames = uncheckedRequired.map((i) => `• ${i.item_name}`).join("\n");
        const confirm = window.confirm(
          `Item berikut belum sesuai standar:\n${itemNames}\n\nKamar akan otomatis dikembalikan untuk dibersihkan ulang. Lanjutkan?`
        );
        if (!confirm) {
          setloading(false);
          return;
        }
  
        // Kirim sebagai still_need_to_clean dengan data checklist
        const payload = {
          date: dates,
          type: "still_need_to_clean",
          reclean_notes: `Item belum sesuai: ${uncheckedRequired.map((i) => i.item_name).join(", ")}`,
          checklist: checklistItems.map((item: any) => ({
            housekeeping_setup_id: item.id,
            qty_required: item.qty || 1,
            qty_checked: checkedItems[item.id]
              ? (item.qty || 1)
              : 0,
            is_checked: checkedItems[item.id],
          }))
        };
  
        const aesraw = GetEncrypt(JSON.stringify(payload));
        const saveprocess = await FetchData(
          `/cms/housekeeping/room-status/status/${idusr}`,
          "PUT",
          aesraw,
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );
  
        if (String(saveprocess?.code) === "200") {
          setShowChecklistPopup(false);
          router.replace({
            pathname: window.location.pathname,
            query: {
              parent: GetQueryStr("parent"),
              data: GetQueryStr("data"),
              view: 1,
              module: GetQueryStr("module"),
              time: new Date().getTime(),
            },
          });
          await GetDetailUser(idusr);
        } else {
          alert(saveprocess?.message || "Gagal menyimpan checklist");
        }
  
        return;
      }
  
      // ── HK / HKSPV normal (semua required sudah dicentang) ──
      const payload = {
        date: dates,
        type: currentActionType,
        checklist: checklistItems.map((item: any) => ({
          housekeeping_setup_id: item.id,
          qty_required: item.qty || 1,
          qty_checked: checkedItems[item.id]
            ? (item.qty || 1)
            : 0,
          is_checked: checkedItems[item.id],
        }))
      };
  
      const aesraw = GetEncrypt(JSON.stringify(payload));
      const saveprocess = await FetchData(
        `/cms/housekeeping/room-status/status/${idusr}`,
        "PUT",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (String(saveprocess?.code) === "200") {
        setShowChecklistPopup(false);
        router.replace({
          pathname: window.location.pathname,
          query: {
            parent: GetQueryStr("parent"),
            data: GetQueryStr("data"),
            view: 1,
            module: GetQueryStr("module"),
            time: new Date().getTime(),
          },
        });
        await GetDetailUser(idusr);
      } else {
        alert(saveprocess?.message || "Gagal menyimpan checklist");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan checklist");
    } finally {
      setloading(false);
    }
  };
  const submitReclean = async () => {
    setloading(true);

    try {
      const payload = {
        date: dates,
        type: "still_need_to_clean",
        reclean_notes: recleanNotes,
      };

      const aesraw = GetEncrypt(JSON.stringify(payload));

      const saveprocess = await FetchData(
        `/cms/housekeeping/room-status/status/${idusr}`,
        "PUT",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (String(saveprocess?.code) === "200") {
        setShowRecleanPopup(false);

        router.replace({
          pathname: window.location.pathname,
          query: {
            ...router.query,
            time: Date.now(),
          },
        });

        await GetDetailUser(idusr);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
            {/* <div className="col-span-5"> */}
            <div className="col-span-12 lg:col-span-5">

              {isview ? (
                <div className="absolute h-full w-[35%] bg-[rgba(0,0,0,0)] z-20"></div>
              ) : (
                <></>
              )}
              <fieldset className="border">
                <legend className="ml-2">Main</legend>
                {/* <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2"> */}
                <div className="form-grid-responsive grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
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
                          disabled={true}
                          valuename={row?.name}
                          typeInput={typesmain}
                          error={false}
                          label={row?.label}
                          required={false}
                          options={row?.options}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name],
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
                            //GetDataTable(e.value);
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
            {/* <div className="col-span-7 relative"> */}
            <div className="col-span-12 lg:col-span-7 relative">
              {new URLSearchParams(window.location.search).get("data") ===
                null && (
                <div className="w-full h-full bg-gray-200 opacity-50 cursor-not-allowed absolute top-0 left-0"></div>
              )}

              <fieldset className="border min-w-full table-auto">
                <legend className="ml-2 ">Room Housekeeper History</legend>
                <div className="mt-2 form-grid-responsive">
                  {dataFilter.from_date && (
                    <TableView
                      uri="/cms/housekeeping/history"
                      queryString={
                        "&room_id=" +
                        new URLSearchParams(window.location.search).get(
                          "data"
                        ) +
                        `&from_date=${dataFilter.from_date}&to_date=${dataFilter.to_date}`
                      }
                      key={dataFilter.from_date + dataFilter.to_date}
                      groups=""
                      isEditTable={true}
                      isTitle={false}
                      isDeleted={false}
                      isBtnView={false}
                      isBtnEdit={false}
                      isBtnAdd={false}
                      filter={filterCom()}
                    />
                  )}
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
              // setloading(true);
              router.replace({
                pathname: window.location.pathname,
                query: { parent: parent },
              });
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />

          {isStartCleanTime && (
            <ButtonSubmit
              onCreate={() => {
                // setloading(true);
                updateHouseKeeperHistory("start_clean_time");
              }}
              loading={loading}
              label="Start Cleaning Time"
            />
          )}

          {isEndCleanTime && (
            <ButtonSubmit
              onCreate={() => {
                // setloading(true);
                updateHouseKeeperHistory("end_clean_time");
              }}
              loading={loading}
              label="End Cleaning Time"
            />
          )}
          {isStillNeedCleaning && (
              <ButtonSubmit
                onCreate={() => {
                  setShowRecleanPopup(true);
                }}
                loading={loading}
                label="Still needs cleaning"
              />
          )}
          {isDoneInspection && (
            <ButtonSubmit
              onCreate={() => {
                // setloading(true);
                updateHouseKeeperHistory("done_inspection");
              }}
              loading={loading}
              label="Done Inspection"
            />
          )}
          {showMarkAsRead && (
              <ButtonSubmit
                  onCreate={async () => {
                    await markNotificationAsReadForRoom(idusr);
                    history.back();
                  }}
                  loading={loading}
                  label="Mark as Read"
                  isprimary={true}
              />
          )}
          {isview ? (
            <></>
          ) : (
            <ButtonSubmit
              onCreate={() => {
                // setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          )}
        </div>
      </div>

      {showRecleanPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Re-Clean Notes
              </h2>
            </div>

            <div className="p-6">
              <textarea
                className="w-full border rounded p-3 min-h-[120px]"
                placeholder="Input re-clean reason..."
                value={recleanNotes}
                onChange={(e) => setRecleanNotes(e.target.value)}
              />
            </div>

            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <ButtonSubmit
                onCreate={() => setShowRecleanPopup(false)}
                loading={loading}
                label="Cancel"
                isprimary={false}
              />

              <ButtonSubmit
                onCreate={submitReclean}
                loading={loading}
                label="Submit"
                isprimary={true}
              />
            </div>
          </div>
        </div>
      )}
      {showChecklistPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Checklist
              </h2>
            </div>

            <div className="p-6 max-h-[70vh] overflow-auto">
              <div className="space-y-4">

                {checklistItems.length === 0 && (
                  <div className="text-center text-gray-500">
                    No checklist available
                  </div>
                )}

                {checklistItems.map((item: any) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[item.id] || false}
                      onChange={() => handleChecklistChange(item.id)}
                      className="mt-1"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium uppercase">
                          {item.item_name}
                        </div>

                        <span className="bg-warning text-white px-2 py-1 rounded-full">
                          Qty: {item.qty}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 uppercase">
                        {item.category}
                      </div>

                      {item.is_required == 1 && (
                        <div className="text-xs text-red-500 mt-1 uppercase">
                          Required
                        </div>
                      )}
                    </div>
                  </label>
                ))}

              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <ButtonSubmit
                onCreate={() => setShowChecklistPopup(false)}
                loading={loading}
                label="Cancel"
                isprimary={false}
              />

              <ButtonSubmit
                onCreate={submitWithChecklist}
                loading={loading}
                label="Submit"
                isprimary={true}
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AddView;
