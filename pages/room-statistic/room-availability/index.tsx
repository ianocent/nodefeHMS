import ButtonAddList from "../../../components/common/button/ButtonAddList";
import React, { useContext, useEffect, useRef, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import CardRoom from "../../../components/common/card/card-statistic";
import { useSelector } from "react-redux";
import router from "next/router";
import InputMain from "../../../components/common/input/InputMain";
import ButtonSubmit from "../../../components/common/button/ButtonSubmit";
import Tabs from "../../../components/common/tab";
import PaperBase from "../../../components/common/paper/PaperBase";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  NumberClear,
  formatAmount,
} from "../../../components/helper";
import { useFormPermission, useTransactionPermission } from "../../../hooks/useFormPermission";
import DraggableTableView from "../../../components/common/table-edit/DraggableTableView";
import { toast } from "react-toastify";
import MoveReservationModal from "./move-reservation-modal";

const RoomStatistic = () => {
  const GLOBALURI = "/cms/statistic/room-availability";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [loading, setloading] = useState(false);
  const [dataDate, setdataDate] = useState("");
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dateform, setdateform] = useState("");
  const [fdataDateto, setfdataDateto] = useState("");
  const [fdateform, setfdateform] = useState("");
  const [optRoomType, setoptRoomType] = useState([]);
  const [optRoomTypeGrup, setoptRoomTypeGroup] = useState([]);
  const [optRoomConf, setoptRoomConf] = useState([]);
  const [RoomType, setRoomType] = useState([]);
  const [RoomTypeGroup, setRoomTypeGroup] = useState([]);
  const [RoomConf, setRoomConf] = useState([]);
  const [dateto, setdateto] = useState("");
  const [note, setnote] = useState("");
  const ref = useRef(null);
  const [popup, setpopup] = useState(false);
  const { canCreate, canUpdate } = useFormPermission(1141);
  const canBlockRoom = useTransactionPermission("blocked_room_access");
  const [roomsts, setroomsts] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

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
    setdataDate(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    if (GetQueryStr("date")) {
      setdateform(GetQueryStr("date"));
      setdateto(GetQueryStr("date"));
      // setpopup(true);
    }
    if (GetQueryStr("data")) {
      setpopup(true);
    } else {
      setpopup(false);
    }
  }, [window.location.href]);
  function GetList(date: any) {
    setdataDate(date);
    router.replace({
      pathname: window.location.pathname,
      query: { date: date },
    });
    setloading(false);
  }
  const onSave = async () => {
    // setloading(true);
    // console.log("datalog", dataval);
    try {
      const urisave =
        "/cms/statistic/room-availability-bulk/" + GetQueryStr("data");
      let mth = "POST";

      const raw = JSON.stringify({
        room_id: GetQueryStr("data"),
        start_date: dateform,
        end_date: dateto,
        room_status: roomsts,
        reason: note,
      });

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
  const getData = async () => {
    try {
      let uri = "/cms/room-statistic";
      let aesraw = "";

      var mth = "GET";
      aesraw = "";

      const datajson = await FetchData(
        uri + "?page=1",
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (datajson?.code == "200") {
        // let dataInput = [...dataform];
        //  datajson?.master?.room_statuses;
        setoptRoomType(datajson?.master?.room_types);
        setoptRoomTypeGroup(datajson?.master?.room_type_groups);
        console.log("datajson", datajson);
        // datajson?.master?.maid_statuses;
        setoptRoomConf(datajson?.master?.room_configurations);
        // datajson?.master?.buildings;
        // datajson?.master?.floors;
        // setdataform([...dataInput]);
        // setdatatable(datajson);
        // setdata(datajson?.data);
        setloading(false);
      } else {
        // setdatatable({ ...datatable, ["pagging"]: datajson?.pagging });
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
  const onSearch = () => {
    var arrRT = [];
    var arrRC = [];
    var arrRTG = [];
    RoomType.map((rw) => {
      arrRT.push(rw?.value);
    });
    RoomConf.map((rw) => {
      arrRC.push(rw?.value);
    });
    RoomTypeGroup.map((rw) => {
      arrRTG.push(rw?.value);
    });
    var obj = {
      date_from: fdateform,
      date_to: fdataDateto,
      room_type: arrRT.toString(),
      room_conf: arrRC.toString(),
      room_type_group: arrRTG.toString(),
      parent: GetQueryStr("parent"),
    };
    router.replace(window.location.pathname, { query: obj });
  };
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        if (popup) {
          router.replace({
            pathname: window.location.pathname,
            query: { parent: GetQueryStr("parent") },
          });
        }
      }
    };
    window.addEventListener("mousedown", handleOutSideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  useEffect(() => {
    getData();
    setdateform(datalocal?.data?.bussinesDate);
    setfdateform(datalocal?.data?.bussinesDate);
  }, []);
  useEffect(() => {
    if (!canBlockRoom && popup) {
      toast.error("You need permission to Blocked Room", {
        toastId: "no-access-block",
        autoClose: 4000,
      });

      router.replace({
        pathname: window.location.pathname,
        query: { parent: GetQueryStr("parent") },
      });
    }
  }, [canBlockRoom, popup]);
  const moveReservation = async () => {
    if (!movePreview) return;
    try {

      const payload = {
        // folioId: movePreview.folio_id,
        folioId: movePreview.folio_number,
        toRoom: movePreview.to_room,
        toDate: movePreview.new_check_in,
        checkInDate: movePreview.new_check_in,
        checkOutDate: movePreview.new_check_out,
      };

      const response = await FetchData(
        "/cms/statistic/drag-room-availability",
        "POST",
        GetEncrypt(JSON.stringify(payload)),
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (response?.code === 200) {

        toast.success("Reservation moved");

        setMoveModal(false);
        setMovePreview(null);
        setRefreshKey(prev => prev + 1);

        onSearch();

      } else {

        toast.error(response?.message || "Move failed");
      }

    } catch (err) {

      toast.error("Move failed");
    }
  };
  const [movePreview, setMovePreview] = useState<any>(null);
  const [moveModal, setMoveModal] = useState(false);
  const previewMoveReservation = async (payload: any) => {
    try {

      const response = await FetchData(
        "/cms/statistic/preview-drag-room-availability",
        "POST",
        GetEncrypt(JSON.stringify(payload)),
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (response?.code === 200) {

        setMovePreview(response.data);
        setMoveModal(true);

      } else {

        toast.error(response?.message || "Failed preview move");
      }

    } catch (err) {

      toast.error("Preview move failed");
    }
  };
  function RouteInit() {
    return (
      <>
        <Seo
          title={
            "Management " +
            GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
          }
        />
        <div className="relative w-full">
          <div className="flex flex-col lg:flex-row min-w-full gap-4 mt-2 p-2">
            <div className="w-full lg:w-auto">
              <InputMain
                typeInput="base"
                label="Date Form"
                error={false}
                rest={{
                  type: "date",
                  onChange: (e) => {
                    setfdateform(e.target.value);
                    setfdataDateto(e.target.value);
                  },
                  value: fdateform,
                  // min: fdateform,
                }}
              />
            </div>
            <div className="w-full lg:w-auto">
              <InputMain
                typeInput="base"
                label="Date to"
                error={false}
                rest={{
                  type: "date",
                  onChange: (e) => {
                    setfdataDateto(e.target.value);
                  },
                  value: fdataDateto,
                  min: fdateform,
                }}
              />
            </div>

            <div className="w-full lg:w-auto">
              <InputMain
                typeInput="select-multi"
                label="Room Configuration "
                error={false}
                onChangeSel={(e) => {
                  setRoomConf(e);
                }}
                options={optRoomConf}
                valueSel={RoomConf}
                isMulti={true}
              />
            </div>
            <div className="w-full lg:w-auto">
              <InputMain
                typeInput="select-multi"
                label="Room Type "
                error={false}
                onChangeSel={(e) => {
                  setRoomType(e);
                }}
                options={optRoomType}
                valueSel={RoomType}
                isMulti={true}
              />
            </div>
            <div className="w-full lg:w-auto">
              <InputMain
                typeInput="select-multi"
                label="Room Type Group"
                error={false}
                onChangeSel={(e) => {
                  setRoomTypeGroup(e);
                }}
                options={optRoomTypeGrup}
                valueSel={RoomTypeGroup}
                isMulti={true}
              />
            </div>
            <div className="w-full lg:w-auto flex items-end">
              <div className="h-8 flex gap-2 w-full lg:w-auto">
                <ButtonSubmit
                  label="Search"
                  onCreate={() => {
                    // onSave();
                    onSearch();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {canBlockRoom && (
          <>
          {popup && (
            <div className="overlay">
              <div
                ref={ref}
                className={
                  "w-full md:w-[90%] lg:w-[77%] relative max-h-[calc(100vh-140px)] bg-white z-50 top-0 md:top-[95px] left-0 md:left-[19%] rounded-xl "
                }
              >
                <fieldset className="mt-4">
                  <legend>Change Block Room</legend>
                  {/* <div className="flex flex-col lg:flex-row min-w-full gap-4 mt-2 p-2 overflow-y-auto"> */}
                  <div className="flex flex-col lg:flex-row min-w-full gap-4 mt-2 p-2 min-h-[80px]">
                    <div className="w-full lg:w-auto">
                      <InputMain
                        typeInput="base"
                        label="Date Form"
                        error={false}
                        rest={{
                          type: "date",
                          onChange: (e) => {
                            setdateform(e.target.value);
                          },
                          value: dateform,
                          min: dateform,
                        }}
                      />
                    </div>
                    <div className="w-full lg:w-auto">
                      <InputMain
                        typeInput="base"
                        label="Date to"
                        error={false}
                        rest={{
                          type: "date",
                          onChange: (e) => {
                            setdateto(e.target.value);
                          },
                          value: dateto,
                          min: dateform,
                        }}
                      />
                    </div>
                    <div className="w-full lg:w-auto">
                      <InputMain
                        typeInput="base"
                        label="Note"
                        error={false}
                        rest={{
                          type: "text",
                          onChange: (e) => {
                            setnote(e.target.value);
                          },
                          value: note,
                        }}
                      />
                    </div>
                    <div className="w-full lg:w-auto">
                      <InputMain
                        typeInput="select-multi"
                        label="Status Room "
                        error={false}
                        onChangeSel={(e) => {
                          setroomsts(e);
                        }}
                        options={[
                          { value: "vacant", label: "Vacant" },
                          { value: "blocked", label: "Blocked" },
                        ]}
                        valueSel={roomsts}
                        isMulti={false}
                      />
                    </div>
                    <div className="w-full lg:w-auto flex items-end">
                      <div className="h-8 flex gap-2 w-full lg:w-auto">
                        <ButtonSubmit
                          label="Close"
                          onCreate={() => {
                            router.replace({
                              pathname: window.location.pathname,
                              query: {
                                parent: GetQueryStr("parent"),
                              },
                            });
                          }}
                          isprimary={false}
                        />
                        <ButtonSubmit
                          isBtnAdd={canBlockRoom && (canCreate || canUpdate)}
                          label="Save"
                          onCreate={() => {
                            onSave();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          )}
          </>
        )}

        <div className="mt-2 min-w-full table-auto">
          {moveModal && (
            <MoveReservationModal
              data={movePreview}
              onClose={() => {
                setMoveModal(false);
                setMovePreview(null);
              }}
              onConfirm={moveReservation}
              onRevalidate={previewMoveReservation}
            />
          )}
          <DraggableTableView
            key={refreshKey}
            groups={groups}
            queryString={
              (GetQueryStr("date_from") &&
                "&date_from=" + GetQueryStr("date_from")) +
              "" +
              (GetQueryStr("date_to") && "&date_to=" + GetQueryStr("date_to")) +
              "" +
              (GetQueryStr("room_type") &&
                "&room_type=" + GetQueryStr("room_type")) +
              "" +
              (GetQueryStr("room_conf") &&
                "&room_conf=" + GetQueryStr("room_conf")) +
              "" +
              (GetQueryStr("room_type_group") &&
                "&room_type_group=" + GetQueryStr("room_type_group"))
            }
            uri={GLOBALURI}
            isEditTable={false}
            onMoveReservation={moveReservation}
            businessDate={datalocal?.data?.bussinesDate}
            accessToken={datalocal?.data?.access_token}
            onPreviewMoveReservation={previewMoveReservation}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <LayoutComponent>
        {/* <CrmView /> */}
        <PaperBase>{RouteInit()}</PaperBase>
      </LayoutComponent>
    </>
  );
};

export default RoomStatistic;
