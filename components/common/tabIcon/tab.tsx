import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFormPermission, useTransactionPermission } from "../../../hooks/useFormPermission";
import {
  FetchData,
  FetchDataKey,
  GetCapitalFirst,
  GetDecrypt,
  GetEncrypt,
  GetPathUri,
  GetQueryStr,
} from "../../helper";
import TrxPageView from "../../pages/reservation-fit/transaction";
import ButtonSubmit from "../button/ButtonSubmit";
import InputMain from "../input/InputMain";
import ModalConfirmationComponent from "../modal/ModalConfirmation";
import ModalNotedComponent from "../modal/ModalNoted";
import MoveRsv from "../tabIcon/move-rsv";
import TableView from "../table-edit";

interface DatatabProps {
  actMenu: any;
  id: any;
  foliodat: any;
  isNAudit?: boolean;
  NAuditCode?: string;
  isTitle?: boolean;
  isTabIcon?: boolean;
}
const TabMenuIcon = (props: DatatabProps) => {
  const GLOBALURI = "/cms/reservation";
  const lastpath = window.location.pathname.split("/").pop();
  const {
    actMenu,
    id,
    foliodat,
    isNAudit = false,
    NAuditCode,
    isTitle = true,
    isTabIcon = true,
  } = props;
  const [popup, setpopup] = useState(false);
  const [IsDataID, setDataID] = useState(false);
  const [dataval2, setData2] = useState<any>({});
  const ref = useRef(null);
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [datavala, setDataa] = useState<any>({});
  const [datamessage, setDataMessage] = useState<any>('Success');
  const [IsOpenModal, setIsOpenModal] = useState(false);
  const [isPay, setisPay] = useState(false);
  const [amountPay, setamountPay] = useState(0);
  const [reloadPay, setreloadPay] = useState(true);
  const { canCreate, canUpdate } = useFormPermission();
  const canCreateRsvFIT = useTransactionPermission("fit");
  const canCreateRsvGIT = useTransactionPermission("git");
  const canCreateRsvVR = useTransactionPermission("vr");
  const canCreateRsvDayUse = useTransactionPermission("day-use");
  const canCheckIn = useTransactionPermission("check_in");
  const canCheckOut = useTransactionPermission("check_out");
  const canCancelRsv = useTransactionPermission("cancel_reservation");
  const canCopyRsv = useTransactionPermission("copy_reservation");
  const canConfirmRsv = useTransactionPermission("confirm_reservation");
  const canAssignRoom = useTransactionPermission("assign_room");
  const canUnAssignRoom = useTransactionPermission("un_assign_room");
  const canConfirmChangeRoom = useTransactionPermission("confirm_change_room");
  const canCancelChangeRoom = useTransactionPermission("cancel_change_room");
  const canUnCheckOut = useTransactionPermission("un_check_out");
  const canUnCheckIn = useTransactionPermission("un_check_in");
  const canMoveRsv = useTransactionPermission("move_reservation");

  var objIco = {
    label: "New FIT",
    key: "new",
    line: false,
    icon: "https://cms.anyaman.id/theme/cms/images/reservation/icon/New_Reservation.svg",
  };
  const [dataIcon, setdataIcon] = useState<any>([isNAudit ? {} : objIco]);
  const [dataIconAll, setdataIconAll] = useState<any>({});
  const [remarkval, setRemark] = useState<any>("");
  const [valReason, setvalReason] = useState<any>({});
  const [valRoom, setvalRoom] = useState<any>([]);
  const [dataReason, setDataReason] = useState<any>({});
  const [dataRoom, setDataRoom] = useState<any>([]);
  const [dataBulk, setBulkData] = useState<any>([]);
  const [loading, setloading] = useState(false);
  const [toVirtual, settoVirtual] = useState(false);
  const [dataval, setData] = useState<any>([]);
  const [datatitle, setdatatitle] = useState("");
  const [IsOpenModalIns, setIsOpenModalIns] = useState(false);
  const [SelectTrue, setSelectTrue] = useState(false);

  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Message",
          name: "message",
          type: "textarea",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Remark",
          name: "remark",
          type: "textarea",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
      ],
    },
  ]);
  const OnSaveMsgRmk = async (key) => {
    // console.log("widylog", dataval);
    setloading(true);
    try {
      setreloadPay(false);
      let urisave = "";
      let mth = "POST";
      var datapost = datavala;
      if (
        key == "check_in" ||
        key == "check_out" ||
        key == "cancel_reservation" ||
        key == "un_assign_room" ||
        key == "un_check_in" ||
        key == "un_check_out" ||
        key == "un_cancel_reservation" ||
        key == "copy_reservation" ||
        key == "confirm_change_room" ||
        key == "cancel_change_room" ||
        key == "confirm_reservation"
      ) {
        mth = "POST";
        urisave = "/cms/reservation/update-status/" + GetQueryStr("data") + "";

        if (key == "un_check_in" && dataIconAll?.is_parent_git) {
          urisave = "/cms/reservation/update-bulk";
          datapost = {
            status_reservation: key,
            remark: remarkval,
            folio_ids: dataBulk,
          };
        } else if (key == "un_check_out" && dataIconAll?.is_parent_git) {
          urisave = "/cms/reservation/update-bulk";
          datapost = {
            status_reservation: key,
            remark: remarkval,
            folio_ids: dataBulk,
          };
        } else if (key == "un_check_in") {
          datapost = { status_reservation: key, remark: remarkval };
        } else if (key == "un_check_out") {
          datapost = {
            status_reservation: key,
            remark: remarkval,
            to_virtual: toVirtual,
          };
        } else if (key == "cancel_reservation") {
          datapost = {
            status_reservation: key,
            remark: remarkval,
            reason: valReason.value,
          };
        } else if (key == "un_assign_room") {
          urisave = "/cms/reservation/un-assign-room/" + GetQueryStr("data");
          datapost = {
            status_reservation: key,
            remark: remarkval,
          };
        } else if (key == "check_in" && dataIconAll?.is_parent_git) {
          urisave = "/cms/reservation/update-bulk";
          datapost = {
            status_reservation: key,
            remark: remarkval,
            folio_ids: dataBulk,
            parent_folio_id: dataIconAll?.id,
          };
        } else if (key == "check_out" && dataIconAll?.is_parent_git) {
          urisave = "/cms/reservation/update-bulk";
          datapost = {
            status_reservation: key,
            remark: remarkval,
            folio_ids: dataBulk,
            parent_folio_id: dataIconAll?.id,
          };
        } else if (
          key == "copy_reservation" ||
          key == "un_cancel_reservation"
        ) {
          datapost = {
            status_reservation: key,
            remark: remarkval,
          };
        } else {
          datapost = { status_reservation: key, remark: remarkval };
        }
      } else {
        urisave = GLOBALURI + "/data/" + GetQueryStr("data") + "";
        mth = "PUT";
        datapost = datavala;
      }

      const raw = JSON.stringify(datapost);

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
        //
        setreloadPay(true);
        setpopup(false);
        if (saveprocess?.data?.door_lock?.ip_doorlock) {
          OnSaveSugestionsss("/cms/new-key", false);
        }
        // window.location.reload();
        ResetPath();
      } else {
        if (dataIconAll?.is_has_folio_auto_transfer) {
          // window.location.reload();
          setreloadPay(true);
        }
        setreloadPay(true);
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      // console.log("erro", error);
    }
  };
  const changeHandlera = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    // setIsload(false);
    // console.log("widylog", b + "-" + name + "-" + e?.target?.value + "-");
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      setDataa({ ...datavala, [e.target.name]: e.target.value });
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
      if (ismulti) {
        if (e.target.checked == true) {
          setDataa({ ...datavala, [e.target.value]: e.target.checked });
        }
        let valarr = [];
        options?.map((row) => {
          if (dataval[row?.value]) {
            valarr.push(row?.value);
          }
        });
        setDataa({ ...datavala, [name]: valarr });
      } else {
        setDataa({ ...datavala, [name]: e.target.checked });
      }
    }
    // setError("");
  };
  const ShowRemark = (type) => {
    return (
      <>
        {dataIconAll?.special_instruction?.remark ||
        dataIconAll?.special_instruction?.check_in_instruction ||
        dataIconAll?.special_instruction?.check_out_instruction ||
        dataIconAll?.special_instruction?.posting_instruction ? (
          <div className="mt-2 flex gap-4 auto-cols-max overflow-x-auto min-w-full uppercase">
            {dataIconAll?.special_instruction?.remark && (
              <div className="border rounded-md border-dotted min-w-[250px] border-black p-2">
                <div className="border border-b-black font-bold">Remark</div>
                <div>{dataIconAll?.special_instruction?.remark}</div>
              </div>
            )}

            {type == "in" && (
              <>
                {dataIconAll?.special_instruction?.check_in_instruction && (
                  <div className=" border rounded-md border-dotted min-w-[250px] p-2 border-black">
                    <div className="border border-b-black font-bold">
                      Check In Remark
                    </div>
                    <div>
                      {dataIconAll?.special_instruction?.check_in_instruction}
                    </div>
                  </div>
                )}
              </>
            )}
            {type == "out" && (
              <>
                {dataIconAll?.special_instruction?.check_out_instruction && (
                  <div className="border rounded-md border-dotted min-w-[250px] p-2 border-black">
                    <div className="border border-b-black font-bold">
                      Check Out Remark
                    </div>
                    <div>
                      {dataIconAll?.special_instruction?.check_out_instruction}
                    </div>
                  </div>
                )}
              </>
            )}
            {dataIconAll?.special_instruction?.posting_instruction && (
              <div className="border rounded-md border-dotted min-w-[250px] p-2 border-black">
                <div className="border border-b-black font-bold">
                  Posting Instruction
                </div>
                <div>
                  {dataIconAll?.special_instruction?.posting_instruction}
                </div>
              </div>
            )}

            {/* {dataIconAll?.special_instruction?.remark_ins && (
                <div className="border rounded-md border-dotted min-w-[250px] p-2 border-black">
                  <div className="border border-b-black font-bold">
                    Remark Instruction
                  </div>
                  <div>{dataIconAll?.special_instruction?.remark_ins}</div>
                </div>
              )} */}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };
  const ResetPath = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("key");
    params.set("call", String(Math.floor(Math.random() * 100)));
    router.replace({
      pathname: window.location.pathname,
      query: Object.fromEntries(params),
    });
  };
  const move_rsvView = (ed) => {
    return (
      <>
        <MoveRsv
          uri={
            "/cms/assign-room?folio_id=" +
            GetQueryStr("data") +
            "&type=" +
            GetQueryStr("key")
          }
          isType={dataIconAll?.type_reservation}
          keys={GetQueryStr("key")}
          editData={ed}
        />
      </>
    );
  };
  const OnSaveSugestionsss = async (uri, mail) => {
    setloading(true);
    try {
      let urisave = uri + "?folio_id=" + GetQueryStr("data") + "";
      let mth = "GET";
      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
          setloading(false);
          setIsOpenModalIns(true);

          if (
            uri == "/cms/new-key" ||
            uri == "/cms/duplicate-key" ||
            uri == "/cms/erase-key"
          ) {
            // console.log("saveprocess", saveprocess);
            var dataObj = {
              checkin: saveprocess?.data?.checkin,
              checkout: saveprocess?.data?.checkout,
              roomcode: saveprocess?.data?.roomcode,
              roomtypecode: saveprocess?.data?.roomtypecode,
              floorcode: saveprocess?.data?.floorcode,
              holder: saveprocess?.data?.holder,
              idno: saveprocess?.data?.idno,
              port: saveprocess?.data?.port,
              breakfast: saveprocess?.data?.breakfast,
              overite: saveprocess?.data?.overite,
              guestidx: saveprocess?.data?.guestidx,
            };
            const KeySave = await FetchDataKey(
              saveprocess?.data?.ip_doorlock + saveprocess?.data?.path,
              "POST",
              dataObj,
              true,
              datalocal?.data?.access_token,
              router,
              ""
            );
            if (KeySave?.status?.code == "200") {
              if (KeySave?.status?.description) {
                setDataMessage(KeySave?.status?.description);
              } else if (KeySave?.status?.message) {
                setDataMessage(KeySave?.status?.message);
              }else{
                setDataMessage("SUCCESS");
              }
              setDataMessage("Success");
              return;
            } else {
              setDataMessage("Card not detected");
            }
            return;
          } else {
            router.replace({
              pathname: window.location.pathname,
              query: {
                parent: GetQueryStr("parent"),
                data: GetQueryStr("data"),
              },
            });
          }
      } else {
        setloading(false);
        if (!mail) {
          setDataMessage("Card not detected");
        } else {
          setDataMessage("Failed Send Mail");
        }
        setIsOpenModalIns(true);
        router.replace({
          pathname: window.location.pathname,
          query: {
            parent: GetQueryStr("parent"),
            data: GetQueryStr("data"),
          },
        });
      }
    } catch (error) {
      setloading(false);
      setDataMessage("Card not detected");
      setIsOpenModalIns(true);
      router.replace({
        pathname: window.location.pathname,
        query: {
          parent: GetQueryStr("parent"),
          data: GetQueryStr("data"),
        },
      });
    }
  };

  useEffect(() => {
    if (GetQueryStr("key") == "new_key") {
      OnSaveSugestionsss("/cms/new-key", false);
    }
    if (GetQueryStr("key") == "duplicate_key") {
      OnSaveSugestionsss("/cms/duplicate-key", false);
    }
    if (GetQueryStr("key") == "erase_key") {
      OnSaveSugestionsss("/cms/erase-key", false);
    }
    if (GetQueryStr("key") == "confirmation_letter") {
      OnSaveSugestionsss(
        "/cms/email/send-mail-template/confirmation-letter",
        true
      );
    }
    if (GetQueryStr("key") == "guest_invoice_all_billing") {
      OnSaveSugestionsss(
        "/cms/email/send-mail-template/guest-invoice-all-billing",
        true
      );
    }
    if (GetQueryStr("key") == "guest_invoice_ledger") {
      OnSaveSugestionsss(
        "/cms/email/send-mail-template/guest-invoice-ledger",
        true
      );
    }
    if (GetQueryStr("key") == "assign_room") {
      setloading(true);
      dataIconAll?.reservation_items?.map((rw, i) =>
        GetDataRoom(
          rw?.room_type_id_origin?.value,
          rw?.check_in_date,
          rw?.check_out_date,
          i
        )
      );
      setloading(false);
    }
  }, [window.location.search]);

  const ContentPopUp = (key) => {
    let title = "";
    if (key == "un_check_out") {
      title = "Re-Check In";
    } else {
      title = key;
    }
    const txPermMap: Record<string, boolean> = {
      assign_room: canAssignRoom,
      move_reservation: canMoveRsv,
      copy_reservation: canCopyRsv,
      cancel_reservation: canCancelRsv,
      confirm_reservation: canConfirmRsv,
      un_assign_room: canUnAssignRoom,
      check_in: canCheckIn,
      check_out: canCheckOut,
      un_check_in: canUnCheckIn,
      un_check_out: canUnCheckOut,
      confirm_change_room: canConfirmChangeRoom,
      cancel_change_room: canCancelChangeRoom,
      un_cancel_reservation: canConfirmRsv,
      add_remark: canUpdate,
      view_remark: canUpdate,
      add_message: canUpdate,
      view_message: canUpdate,
    };
    const canPerformTx = txPermMap[key] ?? (canCreate || canUpdate);
    return (
      <>
        <div>
          <div
            className={
              (SelectTrue ? "min-h-screen" : "max-h-[calc(100vh-190px)]") +
              " overflow-y-auto"
            }
          >
            <div className="p-2 font-bold mb-4 w-full border-8">
              <h1
                className={
                  (key == "check_out" || key == "check_out" ? "" : "") +
                  "capitalize"
                }
              >
                {GetCapitalFirst(title?.replaceAll("_", " ") ?? "")} -{" "}
                {dataIconAll?.reservation?.folio}{" "}
                {dataIconAll?.guest?.guest_name}
              </h1>
              {/* <table>
            {dataIconAll?.reservation_items?.map((rw, i) => (
              <>
                <tr>
                  <td className="p-2">#{i + 1} Check In/out</td>
                  <td className="p-2">
                    {rw?.check_in_date} - {rw?.check_out_date}
                  </td>
                </tr>
              </>
            ))}
          </table> */}
            </div>
            <div className="grid  grid-cols-12 gap-4 w-full pl-4 pr-4 mt-2 mb-4">
              <div className="col-span-12 min-h-[100px]">
                {GetQueryStr("key") == "cancel_reservation" ||
                GetQueryStr("key") == "un_assign_room" ||
                GetQueryStr("key") == "un_cancel_reservation" ||
                GetQueryStr("key") == "copy_reservation" ||
                GetQueryStr("key") == "confirm_reservation" ? (
                  <>
                    <div className="w-full">
                      <TableView
                        uri="/cms/assign-room"
                        queryString={
                          "&folio_id=" +
                          GetQueryStr("data") +
                          "&type=" +
                          GetQueryStr("key")
                        }
                        groups=""
                        isEditTable={true}
                        isTitle={false}
                        isDeleted={false}
                        isBtnAdd={false}
                        isBtnEdit={false}
                        isPageing={false}
                      />
                    </div>
                    {GetQueryStr("key") == "cancel_reservation" ? (
                      <>
                        <InputMain
                          label="Reason"
                          error={false}
                          onChangeSel={(e) => {
                            setvalReason(e);
                            // changeHandlera(e, "custome", "folio_ids", false, {}, 0, 0);
                          }}
                          valueSel={valReason}
                          options={dataReason}
                          typeInput="select-multi"
                          isMulti={false}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    {GetQueryStr("key") == "cancel_reservation" ||
                    GetQueryStr("key") == "un_assign_room" ||
                    GetQueryStr("key") == "un_cancel_reservation" ||
                    GetQueryStr("key") == "copy_reservation" ? (
                      <>
                        {}
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark"
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    {dataform[0].data?.map((row: any, index) => (
                      <>
                        {row?.type != "hidden" ? (
                          <div className={row?.cols + " relative "}>
                            {(GetQueryStr("key") == "add_message" &&
                              row?.name == "message") ||
                            (GetQueryStr("key") == "view_message" &&
                              row?.name == "message") ? (
                              <TableView
                                uri="/cms/message"
                                queryString={"&folio_id=" + GetQueryStr("data")}
                                groups=""
                                isEditTable={true}
                                isTitle={true}
                                isDeleted={false}
                                isBtnAdd={true}
                                isPageing={false}
                              />
                            ) : (
                              <></>
                            )}
                            {(GetQueryStr("key") == "add_remark" &&
                              row?.name == "remark") ||
                            (GetQueryStr("key") == "view_remark" &&
                              row?.name == "remark") ? (
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
                                  placeholder: row?.placeholder ?? row?.label,
                                  value:
                                    datavala[row?.name] ??
                                    row?.name == "message"
                                      ? dataIconAll?.message
                                      : dataIconAll?.remark,
                                  type: row?.type,
                                  onChange: (e) => {
                                    changeHandlera(e, row?.type, row?.name);
                                  },
                                }}
                                restArea={{
                                  placeholder: row?.label,
                                  name: row?.name,
                                  value:
                                    datavala[row?.name] ?? dataIconAll?.remark,
                                  onChange: (e) => {
                                    changeHandlera(e, row?.type, row?.name);
                                  },
                                  disabled:
                                    key == "add_message" ||
                                    key == "add_remark" ||
                                    key == "un_check_in"
                                      ? false
                                      : true,
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
                                valueSel={{}}
                                options={row?.options}
                                isMulti={row?.ismulti}
                                valuename={row?.name}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </>
                )}
                {GetQueryStr("key") == "confirm_change_room" ||
                GetQueryStr("key") == "cancel_change_room" ||
                GetQueryStr("key") == "assign_room" ? (
                  <>
                    {!loading ? (
                      <>
                        {GetQueryStr("key") == "assign_room" && (
                          <>
                            <div>
                              <MoveRsv
                                uri={
                                  "/cms/assign-room?folio_id=" +
                                  GetQueryStr("data") +
                                  "&type=check_in&type_reservation=" +
                                  dataIconAll?.type_reservation
                                }
                                editData={true}
                                // isMaster={true}
                                dataRsv={dataIconAll}
                                isType={dataIconAll?.type_reservation}
                                keys={GetQueryStr("key")}
                              />
                            </div>
                          </>
                        )}
                        {GetQueryStr("key") != "assign_room" && (
                          <>
                            <div className="grid grid-cols-12 w-full p-2">
                              <div className="col-span-3 border font-bold">
                                Check In{" "}
                              </div>
                              <div className="col-span-3 border font-bold">
                                Check Out
                              </div>

                              <>
                                <div className="col-span-3 border font-bold">
                                  From Room
                                </div>
                                <div className="col-span-3 border font-bold">
                                  To Room
                                </div>
                              </>

                              <>
                                {dataIconAll?.reservation_confirm?.map(
                                  (rw, i) => (
                                    <>
                                      <div className="col-span-3 border align-middle">
                                        {rw?.check_in_date}{" "}
                                      </div>
                                      <div className="col-span-3 border align-middle">
                                        {rw?.check_out_date}
                                      </div>
                                      <div className="col-span-3 border align-middle">
                                        {rw?.room_id_origin?.label}
                                      </div>
                                      <div className="col-span-3 border align-middle">
                                        {rw?.room_id_next?.label}
                                      </div>
                                    </>
                                  )
                                )}
                              </>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {GetQueryStr("key") == "move_reservation" ? (
                  <>
                    {dataIconAll?.is_parent_git ? (
                      <>
                        <div>
                          <MoveRsv
                            uri={
                              "/cms/assign-room?folio_id=" +
                              GetQueryStr("data") +
                              "&type=" +
                              GetQueryStr("key")
                            }
                            isType={dataIconAll?.type_reservation}
                            isListParentGIT={dataIconAll?.is_parent_git ? 1 : 0}
                            editData={true}
                            isMaster={true}
                            dataRsv={dataIconAll}
                            keys={GetQueryStr("key")}
                          />
                        </div>
                        <div>
                          <MoveRsv
                            uri={
                              "/cms/assign-room?folio_id=" +
                              GetQueryStr("data") +
                              "&type=" +
                              GetQueryStr("key")
                            }
                            isType={dataIconAll?.type_reservation}
                            editData={true}
                            isFolio={true}
                            keys={GetQueryStr("key")}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <MoveRsv
                            uri={
                              "/cms/assign-room?folio_id=" +
                              GetQueryStr("data") +
                              "&type=" +
                              GetQueryStr("key")
                            }
                            isType={dataIconAll?.type_reservation}
                            editData={true}
                            key={GetQueryStr("key")}
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {GetQueryStr("key") == "check_in" && (
                  <>
                    {dataIconAll?.is_parent_git ? (
                      <>
                        <div>
                          <MoveRsv
                            uri={
                              "/cms/assign-room?folio_id=" +
                              GetQueryStr("data") +
                              "&type=" +
                              GetQueryStr("key")
                            }
                            isType={dataIconAll?.type_reservation}
                            isListParentGIT={dataIconAll?.is_parent_git ? 1 : 0}
                            keys={GetQueryStr("key")}
                            editData={true}
                            isCheckBox={true}
                            isFolio={true}
                            isCalculate={false}
                            saveBulk={(idx) => setBulkData(idx)}
                          />
                        </div>
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark Check In"
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>{move_rsvView(true)}</div>
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark Check In"
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    )}
                    <div className="border-2 border-t-black border-double "></div>
                    <div className="mt-2 ">{ShowRemark("in")}</div>
                    <div className="mt-4 ">
                      <TrxPageView
                        isbtnIcon={false}
                        isbtnPrint={true}
                        isIns={false}
                        isPayment={isPay}
                        amountPay={amountPay}
                        clickCancel={(v) => {
                          setpopup(false);
                          OnSaveMsgRmk(key);
                          // console.log("test checin");
                        }}
                        clickSave={(v) => {
                          setpopup(false);
                          OnSaveMsgRmk(key);
                        }}
                      />
                    </div>
                  </>
                )}
                {(GetQueryStr("key") == "check_out" ||
                  GetQueryStr("key") == "check_out_view") && (
                  <>
                    {dataIconAll?.is_parent_git ? (
                      <>
                        <ModalConfirmationComponent
                          label="Do you want to Check Out?"
                          title="Check Out Folio"
                          isShowIcon={false}
                          IsOpenModel={IsOpenModal}
                          ChangeonClose={(e) => {
                            setIsOpenModal(e);
                          }}
                          onCheck={(e) => {
                            if (e) {
                              setIsOpenModal(false);
                              // OnSave(1);
                              OnSaveMsgRmk(key);
                            } else {
                              setIsOpenModal(false);
                              // OnSave(0);
                              // OnSaveMsgRmk(key);
                            }
                          }}
                        />
                        <div>
                          {GetQueryStr("key") != "check_out_view" && (
                            <MoveRsv
                              uri={
                                "/cms/assign-room?folio_id=" +
                                GetQueryStr("data") +
                                "&type=" +
                                GetQueryStr("key")
                              }
                              isType={dataIconAll?.type_reservation}
                              isListParentGIT={
                                dataIconAll?.is_parent_git ? 1 : 0
                              }
                              keys={GetQueryStr("key")}
                              editData={true}
                              isCheckBox={true}
                              isFolio={true}
                              isCalculate={false}
                              saveBulk={(idx) => setBulkData(idx)}
                            />
                          )}
                        </div>
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark"
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <ModalConfirmationComponent
                          label={
                            dataIconAll?.is_early_checkout
                              ? dataIconAll?.is_has_auto_transfer ||
                                dataIconAll?.is_has_folio_auto_transfer
                                ? 'This folio has "Auto Transfer" And Early check out, are you sure to check out this Folio?'
                                : "Do you want to Early check out this Folio?"
                              : dataIconAll?.is_has_auto_transfer ||
                                dataIconAll?.is_has_folio_auto_transfer
                              ? 'This folio has "Auto Transfer", are you sure to check out this Folio?'
                              : "Do you want to check out this Folio?"
                          }
                          title="Check Out"
                          isShowIcon={false}
                          IsOpenModel={IsOpenModal}
                          ChangeonClose={(e) => {
                            setIsOpenModal(e);
                            setloading(false);
                          }}
                          onCheck={(e) => {
                            if (e) {
                              setIsOpenModal(false);
                              // OnSave(1);
                              OnSaveMsgRmk(key);
                            } else {
                              setIsOpenModal(false);
                              setloading(false);
                              // OnSave(0);
                              // OnSaveMsgRmk(key);
                            }
                          }}
                        />
                        {GetQueryStr("key") != "check_out_view" && (
                          <>
                            <div>{move_rsvView(true)}</div>
                            <div className="w-full mt-2">
                              <InputMain
                                label="Remark "
                                error={false}
                                restArea={{
                                  placeholder: "Remarks Input Here",
                                  name: "remark",
                                  value: remarkval,
                                  onChange: (e) => {
                                    setRemark(e.target.value);
                                  },
                                }}
                                typeInput="textarea"
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div className="mt-2">{ShowRemark("out")}</div>
                    {reloadPay && (
                      <div className="mt-4">
                        <TrxPageView
                          isbtnIcon={false}
                          isbtnPrint={true}
                          isIns={false}
                        />
                      </div>
                    )}
                  </>
                )}
                {GetQueryStr("key") == "un_check_in" && (
                  <>
                    {dataIconAll?.is_parent_git ? (
                      <>
                        <div>
                          <MoveRsv
                            uri={
                              "/cms/assign-room?folio_id=" +
                              GetQueryStr("data") +
                              "&type=" +
                              GetQueryStr("key")
                            }
                            isType={dataIconAll?.type_reservation}
                            isListParentGIT={dataIconAll?.is_parent_git ? 1 : 0}
                            keys={GetQueryStr("key")}
                            editData={true}
                            isCheckBox={true}
                            isFolio={true}
                            isCalculate={false}
                            saveBulk={(idx) => setBulkData(idx)}
                          />
                        </div>
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark "
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>{move_rsvView(true)}</div>
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark "
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    )}
                    <div className="border-2 border-t-black border-double "></div>
                    <div className="mt-2 ">{ShowRemark("in")}</div>
                    <div className="mt-4 ">
                      <TrxPageView
                        isbtnIcon={false}
                        isbtnPrint={true}
                        isIns={false}
                      />
                    </div>
                  </>
                )}
                {GetQueryStr("key") == "un_check_out" && (
                  <>
                    {dataIconAll?.is_parent_git ? (
                      <>
                        <div>
                          <MoveRsv
                            uri={
                              "/cms/assign-room?folio_id=" +
                              GetQueryStr("data") +
                              "&type=" +
                              GetQueryStr("key")
                            }
                            isType={dataIconAll?.type_reservation}
                            isListParentGIT={dataIconAll?.is_parent_git ? 1 : 0}
                            keys={GetQueryStr("key")}
                            editData={true}
                            isCheckBox={true}
                            isFolio={true}
                            isCalculate={false}
                            saveBulk={(idx) => setBulkData(idx)}
                          />
                        </div>
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark Check In"
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="min-h-min">{move_rsvView(true)}</div>
                        <div className="w-full mt-2">
                          <InputMain
                            label="Remark Check In"
                            error={false}
                            restArea={{
                              placeholder: "Remarks Input Here",
                              name: "remark",
                              value: remarkval,
                              onChange: (e) => {
                                setRemark(e.target.value);
                              },
                            }}
                            typeInput="textarea"
                          />
                        </div>
                      </>
                    )}
                    <div className="mt-2">{ShowRemark("out")}</div>
                    <div className="mt-4">
                      <TrxPageView
                        isbtnIcon={false}
                        isbtnPrint={true}
                        isIns={false}
                      />
                    </div>
                  </>
                )}
                {GetQueryStr("key") == "un_check_out" && (
                  <>
                    {!dataIconAll?.is_parent_git && (
                      <>
                        <div className="w-full mt-2">
                          <InputMain
                            typeInput="checkbox"
                            required={false}
                            label="To Virtual"
                            error={false}
                            valuename="to_virtual"
                            valueSel={toVirtual}
                            onChangeSel={(e) => {
                              settoVirtual(e.target.checked);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="  bottom-0 bg-white w-full p-2 col-span-12 flex gap-2 ">
            <ButtonSubmit
              label="Cancel"
              onCreate={() => {
                setpopup(false);
                ResetPath();
                setBulkData([]);
                setIsOpenModal(false);
              }}
              isprimary={false}
            />
            {key == "add_remark" ||
            key == "check_in" ||
            key == "check_out" ||
            key == "cancel_reservation" ||
            key == "un_assign_room" ||
            key == "un_check_in" ||
            key == "un_check_out" ||
            key == "un_cancel_reservation" ||
            key == "copy_reservation" ||
            key == "confirm_change_room" ||
            key == "cancel_change_room" ||
            key == "confirm_reservation" ||
            key == "assign_room" ||
            key == "move_reservation" ? (
              <ButtonSubmit
                isBtnAdd={canPerformTx}
                label={
                  key == "check_in" ||
                  key == "check_out" ||
                  key == "cancel_reservation" ||
                  key == "un_assign_room" ||
                  key == "un_check_in" ||
                  key == "un_check_out" ||
                  key == "un_cancel_reservation" ||
                  key == "copy_reservation" ||
                  key == "confirm_change_room" ||
                  key == "cancel_change_room" ||
                  key == "confirm_reservation" ||
                  key == "assign_room" ||
                  key == "move_reservation"
                    ? "Confirmation"
                    : "Save"
                }
                onCreate={() => {
                  setloading(true);
                  if (key == "check_out") {
                    setIsOpenModal(true);
                  } else if (key == "check_in") {
                    // setIsOpenModal(true);

                    if (dataIconAll?.reservation.cash_on_arrival == true) {
                      // console.log("paypopup", dataIconAll?.cash_on_arrival);
                      setisPay(true);
                      // OnSaveMsgRmk(key);
                      // setamountPay(0);
                    } else {
                      OnSaveMsgRmk(key);
                    }
                  } else {
                    OnSaveMsgRmk(key);
                  }
                }}
                loading={loading}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    );
  };
  const GetDataDetail = async () => {
    try {
      setloading(true);
      const Lastpath = window.location.pathname.split("/").pop();
      let getuuri =
        GLOBALURI +
        "/" +
        GetQueryStr("data") +
        "/update?type=" +
        Lastpath +
        "&group=" +
        Lastpath;

      if (isNAudit) {
        getuuri =
          GLOBALURI +
          "/" +
          GetQueryStr("data") +
          "/update?night_audit=1&audit_type=" +
          NAuditCode;
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
      if (data?.code == "200") {
        setdataIcon(data?.data?.actions);
        setdataIconAll(data?.data);
        data?.data?.reservation_items?.map((rw, i) => {
          var obj = {
            room_type_id: rw?.room_type_id_origin?.value,
            room_id: rw?.room_id_origin?.value,
            check_in_date: rw?.check_in_date,
            check_out_date: rw?.check_out_date,
            room_type_id_next: rw?.room_type_id_origin?.value,
            room_id_next: rw?.room_id_origin?.value,
            room_select: rw?.room_id_origin,
          };
          valRoom?.push(obj);
          setvalRoom(valRoom);
        });
      }
      setloading(false);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetDataMaster = async () => {
    try {
      let getuuri = GLOBALURI + "/master";
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
        setDataReason(data?.master?.reasons);
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetDataRoom = async (roomtypeid: any, ins: any, out: any, idx: any) => {
    // try {
    let getuuri =
      "/cms/room-type/get-room-v2/" +
      roomtypeid +
      "?check_in_date=" +
      ins +
      "&check_out_date=" +
      out;
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
      let obj = {
        ["idx_" + idx]: data?.data,
      };

      setDataRoom((dataRoom) => ({
        ...dataRoom,
        ...obj,
      }));
    }
    return;
    // } catch (error) {
    //   console.log(error);
    //   return;
    // }
  };
  useEffect(() => {
    if (GetQueryStr("data")) {
      GetDataDetail();
      GetDataMaster();
    }
    if (GetPathUri(2) == "fit") {
      if (!isNAudit) {
        let obj = dataIcon[0];
        // change label
        obj.label = "New FIT";
        setdataIcon([obj]);
      }
    } else if (GetPathUri(2) == "git") {
      if (!isNAudit) {
        let obj = dataIcon[0];
        // change label
        obj.label = "New GIT";
        setdataIcon([obj]);
      }
    }else if (GetPathUri(2) == "day-use") {
      let obj = dataIcon[0];
      // change label
      obj.label = "New Day Use";
      setdataIcon([obj]);
    } else if (GetPathUri(2) == "vr") {
      if (!isNAudit) {
        let obj = dataIcon[0];
        // change label
        obj.label = "New VR";
        setdataIcon([obj]);
      }
    } else if (GetPathUri(2) == "folio") {
      if (!isNAudit) {
        let obj = dataIcon[0];
        // change label
        obj.label = "New GIT";
        obj.key = "git";

        var objIco = {
          label: "New FIT",
          key: "fit",
          line: false,
          icon: "https://cms.anyaman.id/theme/cms/images/reservation/icon/New_Reservation.svg",
        };

        var objIcoDayuse = {
          label: "New Day Use",
          key: "day-use",
          line: false,
          icon: "https://cms.anyaman.id/theme/cms/images/reservation/icon/New_Reservation.svg",
        }

        setdataIcon([obj, objIco, objIcoDayuse]);
      }
    } else {
      setdataIcon([{}]);
    }
    setvalReason({});
    setRemark("");
    const urlParams = new URLSearchParams(window.location.search);
    const getkey = urlParams.get("key");
    if (getkey == "add_message") {
      setpopup(true);
      var objmsg = {
        ["type"]: "message",
      };
      setDataa((datavala) => ({
        ...datavala,
        ...objmsg,
      }));
    } else if (getkey == "add_remark") {
      setpopup(true);
      var objmsg = {
        ["type"]: "remark",
      };
      setDataa((datavala) => ({
        ...datavala,
        ...objmsg,
      }));
    } else if (getkey == "view_remark") {
      setpopup(true);
    } else if (getkey == "view_message") {
      setpopup(true);
    } else if (getkey == "check_in") {
      setpopup(true);
    } else if (getkey == "confirm_reservation") {
      setpopup(true);
    } else if (getkey == "cancel_reservation") {
      setpopup(true);
    } else if (getkey == "un_assign_room") {
      setpopup(true);
    } else if (getkey == "un_check_in") {
      setpopup(true);
    } else if (getkey == "un_check_out") {
      setpopup(true);
    } else if (getkey == "confirm_change_room") {
      setpopup(true);
    } else if (getkey == "cancel_change_room") {
      setpopup(true);
    } else if (getkey == "copy_reservation") {
      setpopup(true);
    } else if (getkey == "check_out") {
      setpopup(true);
    } else if (getkey == "check_out_view") {
      setpopup(true);
    } else if (getkey == "un_cancel_reservation" || getkey == "assign_room") {
      setpopup(true);
    } else if (getkey == "move_reservation") {
      setpopup(true);
    } else {
      setpopup(false);
      setDataa({});
    }
    console.log("wdy", window.location.search);
    console.log("wdy", window.location.pathname);
  }, [window.location.search]);

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let data = urlParams.get("data");
    if (data) {
      setDataID(true);
    } else {
      setDataID(false);
    }
  }, [window.location.pathname, window.location.search]);

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        if (popup) {
          setpopup(false);
        }

        // setoverflow(true);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);

  const hasAccess = (key: string) => {
    switch (key) {
      case "fit":                 return canCreateRsvFIT;
      case "git":                 return canCreateRsvGIT;
      case "vr":                  return canCreateRsvVR;
      case "day-use":             return canCreateRsvDayUse;
      case "check_in":            return canCheckIn;
      case "check_out":           return canCheckOut;
      case "cancel_reservation":  return canCancelRsv;
      case "copy_reservation":    return canCopyRsv;
      case "confirm_reservation": return canConfirmRsv;
      case "assign_room":         return canAssignRoom;
      case "un_assign_room":      return canUnAssignRoom;
      case "un_check_out":        return canUnCheckOut;
      case "confirm_change_room": return canConfirmChangeRoom;
      case "cancel_change_room":  return canCancelChangeRoom;
      case "move_reservation":    return canMoveRsv;
      case "un_check_in":         return canUnCheckIn;
      default: return true;
    }
  };

  return (
    <>
      {popup ? (
        <div className="overlay">
          <div
            ref={ref}
            className={
              "w-[77%] relative max-h-[calc(100vh-140px)] bg-white z-20 top-[95px] left-[19%] "
            }
          >
            <div className=" overflow-y-auto">
              {ContentPopUp(
                new URLSearchParams(window.location.search).get("key")
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {(dataIcon && GetQueryStr("card") == "0") ||
      (dataIcon && !GetQueryStr("card")) ||
      (dataIcon && GetQueryStr("card") == NAuditCode) ? (
        <>
          {isTabIcon ? (
            <div className="flex gap-4 auto-cols-max overflow-x-auto min-w-full ">
              {dataIcon?.map((row, i) => (
                <>
                  {(GetQueryStr("data") &&
                    hasAccess(row?.key) &&
                    (row?.key != "new" || lastpath != "reservation") &&
                    GetQueryStr("data") &&
                    (row?.key != "fit" || lastpath != "reservation") &&
                    GetQueryStr("data") &&
                    (row?.key != "day-use" || lastpath != "reservation") &&
                    GetQueryStr("data") &&
                    (row?.key != "git" || lastpath != "reservation") &&
                    GetQueryStr("data") &&
                    (row?.key != "vr" || lastpath != "reservation") &&
                    GetQueryStr("data") &&
                    row?.key != "new_git" &&
                    GetQueryStr("data") &&
                    row?.key != "edit" &&
                    GetQueryStr("data")) ||
                  // !GetQueryStr("data") ? (
                  (!GetQueryStr("data") && hasAccess(row?.key)) ? (
                    <>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          if (
                            row?.key == "new" ||
                            row?.key == "git" ||
                            row?.key == "vr" ||
                            row?.key == "fit" || 
                            row?.key == "day-use" 
                          ) {
                            router.push({
                              pathname:
                                row?.key == "new"
                                  ? window.location.pathname
                                  : "/reservation/" + row?.key,
                              query: {
                                parent: GetQueryStr("parent"),
                                add: 1,
                                history: window.location.pathname,
                              },
                            });
                          } else {
                            router.replace({
                              pathname: window.location.pathname,
                              query: {
                                parent: GetQueryStr("parent"),
                                key: row?.key,
                                data: GetQueryStr("data"),
                              },
                            });
                          }
                        }}
                      >
                        <div className="flex justify-center w-[60px]">
                          <img src={row?.icon} className="w-[50px]" />
                        </div>
                        <div className="flex justify-center w-[60px]">
                          <div className="text-[8px] font-bold text-center mt-[3px]">
                            {row?.label}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </div>
          ) : (
            <></>
          )}
          {IsDataID && isTitle && !loading ? (
            <div
              className={
                (dataIconAll.reservation?.status_reservation?.value == 0
                  ? "!text-green"
                  : dataIconAll.reservation?.status_reservation?.value == 1
                  ? "!text-purple"
                  : dataIconAll.reservation?.status_reservation?.value == 2
                  ? "!text-red"
                  : dataIconAll.reservation?.status_reservation?.value == 3
                  ? "!text-orange"
                  : dataIconAll.reservation?.status_reservation?.value == 4
                  ? "!text-blue"
                  : dataIconAll.reservation?.status_reservation?.value == 5
                  ? "!text-yellow"
                  : "") +
                " flex gap-4 auto-cols-max overflow-x-auto min-w-full relative h-[45px]"
              }
            >
              <legend>
                <h4 className="font-bold text-xl !capitalize">
                  {dataIconAll.folio_number}{" "}
                  {dataIconAll.reservation?.status_reservation.label}
                </h4>
              </legend>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <ModalNotedComponent
        text={datamessage}
        isHtml={true}
        title={"Information"}
        IsOpenModel={IsOpenModalIns}
        ChangeonClose={(e) => {
          setIsOpenModalIns(e);
        }}
      />
    </>
  );
};
export default TabMenuIcon;
