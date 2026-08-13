import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import {
  FetchData,
  FetchDataDocument,
  GetCapitalFirst,
  GetCurrentDate,
  GetDecrypt,
  GetEncrypt,
} from "../../helper";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import InputMain from "../input/InputMain";
import ButtonSubmit from "../button/ButtonSubmit";
import { useSelector } from "react-redux";
import ButtonAddList from "../button/ButtonAddList";
import { env } from "../../../next.config";
interface TableViewProps {
  uri: string;
  uriSave?: string;
  groups: string;
  isEditTable?: boolean;
  queryString?: string;
  isTitle?: boolean;
  isDeleted?: boolean;
  isBtnAdd?: boolean;
  methodFetch?: string;
  bodyFetch?: {};
  headRow?: number;
  checked?: boolean;
  onClosePopUp?: () => void;
  isEditForce?: boolean;
  btnSearch?: boolean;
  isWhatsapp?: boolean;
  message?: string;
  isBtnView?: boolean;
  dataId?: any;
  dataVal?: any;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TableRosters = (props: TableViewProps) => {
  const {
    uri,
    uriSave = "",
    groups,
    isEditTable = true,
    queryString,
    isTitle = true,
    isDeleted = false,
    isBtnAdd = true,
    methodFetch = "GET",
    bodyFetch = {},
    headRow = 1,
    checked = false,
    onClosePopUp,
    isEditForce = false,
    btnSearch = true,
    isWhatsapp,
    message,
    dataId,
    dataVal,
    isBtnView = true,
  } = props;
  const GLOBALURI = uri;
  const [isview, setisview] = useState(false);
  const [isedit, setisedit] = useState(false);
  const router = useRouter();
  const path = router.pathname;
  const [loadingin, setloadingin] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [editActive, seteditActive] = useState(-1);
  const [dataval, setData] = useState<any>({ roster_list_id: dataId });
  const [datavalMulti, setDataMulti] = useState<any>({});
  const [overflow, setoverflow] = useState(true);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [datavalsrc, setDatasrc] = useState<any>({
    status: { value: "-1", label: "ALL" },
  });
  const [datatable, setdatatable] = useState<any>({});
  const [add, setaddform] = useState<boolean>(false);
  const [idparent, setidparent] = useState("");
  const [loading, setloading] = useState<boolean>(false);
  const [ishide, setishide] = useState<boolean>(false);
  const [popup, setpopup] = useState<boolean>(false);
  const [searchActive, setsearchActive] = useState<boolean>(false);
  const [btnsearchs, setbtnsearchs] = useState<boolean>(false);
  const [dataCheck, setDataCheck] = useState<any>();
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 6);
  const [startDate, setStartDate] = useState<any>(formatDate(today));
  const [endDate, setEndDate] = useState<any>(formatDate(sevenDaysFromNow));
  const [weekDates, setWeekDates] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState<string>("");
  const [reloadHelper, setReloadHelper] = useState<number>(0);
  const [dataShift, setDataShift] = useState<any>();

  const GetDataShift = async () => {
    try {
      const datajson = await FetchData(
        "/cms/housekeeping/shift-roster",
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (datajson?.code == "200") {
        setDataShift(datajson);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findDifferences = (arr1, arr2) => {
    const map = new Map(arr2.map((item) => [item.id, item]));
    return arr1.filter((item) => {
      const otherItem = map.get(item.id);
      if (!otherItem) return true;
      return JSON.stringify(item) !== JSON.stringify(otherItem);
    });
  };

  const onDeleted = async (id: any) => {
    try {
      let getuuri = GLOBALURI + "/" + id;

      const datauser: any = await FetchData(
        getuuri,
        "DELETE",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const OnSave = async () => {
    try {
      // Data yang di-set OFF dan sudah punya id - delete
      const toDelete = dataCheck?.filter(
        (item: any) => item.hasOwnProperty("id") && (!item.shift_id || item.shift_id === "")
      );

      // Data yang sudah punya id dan punya shift - update via PUT
      const toUpdate = dataCheck?.filter(
        (item: any) => item.hasOwnProperty("id") && item.shift_id && item.shift_id !== ""
      );

      // Data baru (belum punya id) dan punya shift - POST
      const toCreate = dataCheck?.filter(
        (item: any) => !item.hasOwnProperty("id") && item.shift_id && item.shift_id !== ""
      );

      // Delete yang di-OFF-kan
      if (toDelete?.length > 0) {
        await Promise.all(toDelete.map((item: any) => onDeleted(item.id)));
      }

      // Update yang sudah ada
      if (toUpdate?.length > 0) {
        await Promise.all(
          toUpdate.map((item: any) =>
            FetchData(
              `${GLOBALURI}/${item.id}`,
              "PUT",
              GetEncrypt(JSON.stringify({
                shift_id: item.shift_id,
                is_assigned: true,
                roster_list_id: dataId,
              })),
              false,
              datalocal?.data?.access_token,
              router,
              ""
            )
          )
        );
      }

      // Create yang baru
      if (toCreate?.length > 0) {
        const payload = toCreate.map((item: any) => ({
          ...item,
          roster_list_id: dataId,
        }));

        const saveprocess = await FetchData(
          GLOBALURI,
          "POST",
          GetEncrypt(JSON.stringify(payload)),
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );

        if (saveprocess?.code !== 200) {
          console.error("Save failed", saveprocess);
        }
      }

      setOnEdit(false);
      setReloadHelper((r) => r + 1);
      GetDataTable();
    } catch (error) {
      console.log("error", error);
      setloading(false);
    }
  };

  const GetDataTable = async (i?: any, page?: number, isloadmore?: boolean) => {
    setIsloading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sort = urlParams.get("sort") ?? "";
      var search = urlParams.get("search");
      var srcfield = urlParams.get("search_field")
        ? "&search_field=" + urlParams.get("search_field")
        : "";
      var srcval = urlParams.get("search_value")
        ? "&search_value=" + urlParams.get("search_value")
        : "";
      let status = i ?? datavalsrc["status"]?.value;

      let pages = 1;
      if (page) {
        pages = page;
      }
      const raw = JSON.stringify(bodyFetch);
      const aesraw = GetEncrypt(raw);
      const datajson = await FetchData(
        GLOBALURI +
          "?sort=" +
          sort +
          `&date_from=${startDate}&date_to=${endDate}` +
          `&roster_list_id=${dataId}` +
          "&group=" +
          groups +
          "&page=" +
          pages +
          "&search=" +
          (datavalsrc["search"] ?? (search == null ? "" : search)) +
          "&" +
          (queryString ?? "") +
          "" +
          srcfield +
          "" +
          srcval,
        methodFetch,
        methodFetch == "GET" ? "" : aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (datajson?.code == "200") {
        setIsloading(false);
        if (!isloadmore) {
          setdatatable(datajson);
          setDataCheck(datajson.data);
        } else {
          datajson?.data?.map((row: any) => {
            datatable?.data?.push(row);
          });
          setdatatable({ ...datatable, ["pagging"]: datajson?.pagging });
        }
        setisview(datajson?.permission?.view);
        setDatasrc(datajson?.search_data);
        setisedit(isEditForce ? false : datajson?.permission?.edit);
        datajson?.table?.map((rw) => {
          if (rw?.is_search) {
            setbtnsearchs(true);
          }
        });
      } else {
        setIsloading(false);
      }
      return;
    } catch (error) {
      setIsloading(false);
      console.log("err", error);
      return;
    }
  };

  const [dataUser, setDataUser] = useState<any>();

  const GetDataUsers = async (page?: number, isloadmore?: boolean) => {
    const urlUser = "/cms/housekeeping/shift-user-list?mode=users&type=cleaning";
    setIsloading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sort = urlParams.get("sort") ?? "";

      let pages = 1;
      if (page) {
        pages = page;
      }

      const datajson = await FetchData(
        urlUser +
          "&sort=" +
          sort +
          "&group=" +
          groups +
          "&page=" +
          pages +
          `&search=${searchUser}`,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (datajson?.code == "200") {
        setIsloading(false);
        if (!isloadmore) {
          setDataUser(datajson);
          console.log("test:",datajson);
        } else {
          datajson?.data?.map((row: any) => {
            dataUser?.data?.push(row);
          });
          setDataUser({ ...dataUser, ["pagging"]: datajson?.pagging });
        }
      } else {
        setIsloading(false);
      }
      return;
    } catch (error) {
      setIsloading(false);
      console.log("err", error);
      return;
    }
  };
  // useEffect(() => {
  //   GetDataShift();
  // }, []);
  const previn = () => {
    // alert(1);
    if (dataUser?.pagging?.prev) {
      GetDataUsers(dataUser?.pagging?.prev);
    }
  };
  const nextin = () => {
    if (dataUser?.pagging?.next) {
      GetDataUsers(dataUser?.pagging?.next);
    }
  };
  const prevJumpin = () => {
    if (dataUser?.pagging?.prev_jump) {
      GetDataUsers(dataUser?.pagging?.prev_jump);
    }
  };
  const nextJumpin = () => {
    if (dataUser?.pagging?.next_jump) {
      GetDataUsers(dataUser?.pagging?.next_jump);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const getidparent = urlParams.get("parent");
    setidparent(getidparent);
    if (add) {
      seteditActive(-1);
    }

    if (
      Object.keys(bodyFetch).length === 0 &&
      bodyFetch.constructor === Object
    ) {
      GetDataTable();
    }
    GetDataShift();
    GetDataUsers();
    getWeekDates();
  }, [window.location.search, startDate]);

  const handleShiftChange = (userId: number, date: string, shiftId: number) => {
    setOnEdit(true);

    setDataCheck((prev: any[]) => {
      const existing = prev.find(
        (x) => x.user_id === userId && x.date === date
      );

      if (existing) {
        // Kalau di-set OFF (shiftId = 0/""), tandai untuk dihapus
        if (!shiftId) {
          return prev.map((x) =>
            x.user_id === userId && x.date === date
              ? { ...x, shift_id: "" }
              : x
          );
        }
        return prev.map((x) =>
          x.user_id === userId && x.date === date
            ? { ...x, shift_id: shiftId, is_assigned: true }
            : x
        );
      }

      // Kalau OFF dan belum ada record, skip saja
      if (!shiftId) return prev;

      return [
        ...prev,
        {
          user_id: userId,
          shift_id: shiftId,
          date,
          roster_list_id: dataId,
          is_assigned: true,
        },
      ];
    });
  };

  // kalo mau bulanan
  // const getMonthDates = () => {
  //   const referenceDate = startDate ? new Date(startDate) : new Date();
    
  //   const year = referenceDate.getFullYear();
  //   const month = referenceDate.getMonth();

  //   // Tanggal awal dan akhir bulan
  //   const start = new Date(year, month, 1);
  //   const end = new Date(year, month + 1, 0); // Tanggal terakhir di bulan tersebut

  //   const dates = [];
  //   const options: any = { weekday: "long" };

  //   for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  //       const date = new Date(d);
        
  //       const day = date.toLocaleDateString("en-US", options);
  //       const dayNum = ("0" + date.getDate()).slice(-2);
  //       const monthNum = ("0" + (date.getMonth() + 1)).slice(-2);
  //       const yearNum = date.getFullYear();
        
  //       const formattedDate = `${yearNum}-${monthNum}-${dayNum}`;

  //       dates.push({ 
  //           date: formattedDate, 
  //           day 
  //       });
  //   }

  //   setOnEdit(false);
  //   setWeekDates(dates);
  // };

  const getWeekDates = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const week = [];
    const options: any = { weekday: "long" };

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const day = date.toLocaleDateString("en-US", options);
      const dayNum = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      const formattedDate = `${year}-${month}-${dayNum}`;
      week.push({ date: formattedDate, day });
    }
    setOnEdit(false);

    setWeekDates(week);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + 6);
    setStartDate(formatDate(newStartDate));
    setEndDate(formatDate(newEndDate));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    const newStartDate = new Date(newEndDate);
    newStartDate.setDate(newEndDate.getDate() - 6);
    setStartDate(formatDate(newStartDate));
    setEndDate(formatDate(newEndDate));
  };

  const [copyLoading, setCopyLoading] = useState(false);

  const handleCopyToNextWeek = async () => {
    setCopyLoading(true);
    try {
      // Ambil semua roster yang ada di minggu ini (yang punya shift, bukan OFF)
      const rostersThisWeek = dataCheck?.filter(
        (item: any) => item.shift_id && item.shift_id !== ""
      ) ?? [];

      if (rostersThisWeek.length === 0) {
        alert("Tidak ada shift untuk di-copy.");
        setCopyLoading(false);
        return;
      }

      // Shift tanggal +7 hari
      const nextWeekRosters = rostersThisWeek.map((item: any) => {
        const nextDate = new Date(item.date);
        nextDate.setDate(nextDate.getDate() + 7);
        return {
          user_id:        item.user_id,
          shift_id:       item.shift_id,
          date:           formatDate(nextDate),
          roster_list_id: dataId,
          is_assigned:    true,
        };
      });

      const res = await FetchData(
        GLOBALURI,
        "POST",
        GetEncrypt(JSON.stringify(nextWeekRosters)),
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (res?.code === 200) {
        // Geser range ke minggu depan otomatis
        const nextStart = new Date(startDate);
        nextStart.setDate(nextStart.getDate() + 7);
        const nextEnd = new Date(nextStart);
        nextEnd.setDate(nextStart.getDate() + 6);
        setStartDate(formatDate(nextStart));
        setEndDate(formatDate(nextEnd));

        // Tampilkan info kalau ada yang di-skip
        if (res?.skipped?.length > 0) {
          alert(`Copy selesai.\nDilewati (sudah ada):\n${res.skipped.join('\n')}`);
        }
      } else {
        alert(res?.message || "Gagal copy roster.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan.");
    } finally {
      setCopyLoading(false);
    }
  };


  return (
    <>
      {datatable?.code == "200" ? (
        <>
          <div className="flex gap-2 w-full justify-between mt-4">
            <div className="flex items-center gap-2 ml-3">
              <InputMain
                typeInput={"base"}
                error={false}
                label={"From"}
                rest={{
                  name: "From",
                  placeholder: "From date",
                  value: startDate,
                  type: "date",
                  onChange: handleStartDateChange,
                }}
              />

              <InputMain
                typeInput={"base"}
                error={false}
                label={"To"}
                rest={{
                  name: "To",
                  placeholder: "To date",
                  value: endDate,
                  type: "date",
                  onChange: handleEndDateChange,
                }}
              />
            </div>
            <div className="flex gap-2 items-end">
              <ButtonSubmit
                onCreate={handleCopyToNextWeek}
                loading={copyLoading}
                label="Copy to Next Week →"
                isprimary={false}
                ClassCustome="px-4 py-2 h-[36px] rounded-sm mb-1 font-semibold text-blue-600 border border-blue-300"
              />

              {onEdit && (
                <>
                  <ButtonSubmit
                    onCreate={() => {
                      GetDataTable();
                      setOnEdit(false);
                      setReloadHelper(reloadHelper + 1);
                    }}
                    loading={loading}
                    label="Reset"
                    isprimary={false}
                    ClassCustome="px-4 py-2 h-[36px] rounded-sm mb-1 font-semibold"
                  />
                  <ButtonSubmit
                    onCreate={OnSave}
                    loading={loading}
                    label="Save"
                    isprimary={true}
                    ClassCustome="max-h-[36px] px-4 py-2 bg-[#845adf]"
                  />
                </>
              )}
            </div>
          </div>

          {datatable?.table ? (
            <>
              <div
                className={
                  "table-responsive " +
                  (overflow == true ? " overflow-x-auto" : "")
                }
              >
                <table
                  className={
                    "shadow-lg table-auto rounded-md" +
                    (editActive != -1 ? " min-w-max " : " min-w-full ")
                  }
                >
                  <thead>
                    <tr className="">
                      {" "}
                      <td className="bg-[#323A50] text-white p-2 font-bold rounded-tl-lg">
                        Name
                      </td>
                      {weekDates.map((item, index) => (
                        <td
                          key={index}
                          className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                        >
                          {item.day}, {item.date}
                        </td>
                      ))}
                    </tr>
                  </thead>

                  <tbody key={reloadHelper}>
                    {dataUser?.data?.map((user: any) => (
                      <tr
                        key={user?.id}
                        className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]"
                      >
                        <td className="p-2 font-semibold bg-gray-200">
                          {user?.name}
                        </td>

                        {weekDates?.map((date: any) => {
                          const roster = dataCheck?.find(
                              (item: any) =>
                                  item.user_id === user?.id &&
                                  item.date === date.date
                          );

                          return (
                            <td
                              key={date.date}
                              className="p-2 text-center"
                            >
                              <select
                                className="form-control min-w-[140px] uppercase"
                                value={roster?.shift_id || ""}
                                onChange={(e) =>
                                  handleShiftChange(
                                    user?.id,
                                    date.date,
                                    Number(e.target.value)
                                  )
                                }
                              >
                                <option value="">
                                  OFF
                                </option>

                                {dataShift?.data?.map((shift: any) => (
                                  <option
                                    key={shift.id}
                                    value={shift.id}
                                  >
                                    {shift.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="mt-8 flex justify-center">Not Data</div>
            </>
          )}
        </>
      ) : (
        <>
          {isloading ? (
            <>
              <div className="mt-8 flex justify-center">
                <IconSpiner />
              </div>
            </>
          ) : (
            <>
              <div className="mt-8 flex justify-center">Not Data</div>
            </>
          )}
        </>
      )}

      <PaginationTable
        vnext={dataUser?.pagging?.next}
        vprev={dataUser?.pagging?.prev}
        vnextJump={dataUser?.pagging?.next_jump}
        vprevjump={dataUser?.pagging?.prev_jump}
        prev={previn}
        next={nextin}
        prevJump={prevJumpin}
        nextJump={nextJumpin}
        totalPage={dataUser?.pagging?.end_paging}
        page={dataUser?.pagging?.start_paging}
        totalData={dataUser?.pagging?.total_data}
      />
    </>
  );
};

export default TableRosters;
