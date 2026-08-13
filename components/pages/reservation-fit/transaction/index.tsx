// transaction
import React, { use, useContext, useEffect, useRef, useState } from "react";
import Seo from "../../../../components/common/seo";
import TableView from "../../../../components/common/table-edit";
import {
  FetchData,
  GetCurrentDate,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  NumberClear,
  RouteChange,
  formatAmount,
} from "../../../helper";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import InputMain from "../../../common/input/InputMain";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import TabMenuIcon from "../../../common/tabIcon/tab";
import { parse } from "next/dist/build/swc";
import { env } from "../../../../next.config";
import ModalNotedComponent from "../../../common/modal/ModalNoted";
import { useFormPermission, useTransactionPermission } from "../../../../hooks/useFormPermission";
import ModalPinComponent from "../../../common/modal/ModalPin";
interface TrxProps {
  isbtnIcon?: boolean;
  isbtnPrint?: boolean;
  isIns?: boolean;
  isPayment?: boolean;
  amountPay?: any;
  clickCancel?: (v) => void;
  clickSave?: (v) => void;
}
const TrxPageView = (props: TrxProps) => {
  const {
    isbtnIcon = true,
    isbtnPrint = true,
    isIns = true,
    isPayment = false,
    clickSave = (v) => {},
    clickCancel = (v) => {},
  } = props;
  const GLOBALURI = "/cms/transaction";
  const groups = "";
  const ref = useRef(null);
  const [popup, setpopup] = useState(false);

  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const [touchStart, setTouchStart] = useState(false);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [typeadd, settypeadd] = useState("");
  const [titleadd, settitleadd] = useState("");
  const [dataval, setData] = useState<any>([]);
  const [datapush, setDatapush] = useState<any>({});
  const [dataposting, setDataposting] = useState<any>([]);
  const [dataLedger, setDataLedger] = useState<any>([]);
  const [dataTrxLedger, setDataTrxLedger] = useState<any>([
    { a: 1 },
    { a: 2 },
    { a: 3 },
    { a: 4 },
  ]);
  const [dataitem, setDataitem] = useState<any>({});
  const [loading, setloading] = useState(false);
  const [datadetail, setDataDetail] = useState<any>({});
  const [datarate, setdatarate] = useState<any>({});
  const [datatbl, setdatatbl] = useState<any>({});
  const [dataFolio, setdataFolio] = useState<any>({});
  const [subfolio, setsubfolio] = useState<any>([]);
  const [idSubfolio, setidSubfolio] = useState("0");
  const [isPrint, setIsPrint] = useState(false);
  const [IsOpenModalIns, setIsOpenModalIns] = useState(false);
  const [dataTotal, setdataTotal] = useState("0");
  const [IsOpenModalInsOnce, setIsOpenModalInsOnce] = useState(false);
  const [IsCancel, setIsCancel] = useState(false);
  const [datavalPrint, setDataPrint] = useState<any>({});
  const [tblguestA, settblguestA] = useState<any>({});
  const [tblguestB, settblguestB] = useState<any>({});
  const [tblguestC, settblguestC] = useState<any>({});
  const [tblguestD, settblguestD] = useState<any>({});
  const [modalPaymentPrint, setModalPaymentPrint] = useState<boolean>(false);
  const [idTrx, setIdTrx] = useState<string>("");
  const canPayment = useTransactionPermission("payment");
  const canPaidOut = useTransactionPermission("paidout");
  const canRefund = useTransactionPermission("refund");
  const canManualPosting = useTransactionPermission("manual_posting");
  const canTransfer = useTransactionPermission("transfer");
  const canSplit = useTransactionPermission("split");
  const canConsolidate = useTransactionPermission("consolidate");
  const canVoid = useTransactionPermission("void");
  const collectPerm = [canConsolidate, canManualPosting, canPaidOut, canPayment, canRefund,  canSplit, canTransfer, canVoid];
  const [isVoidPinOpen, setIsVoidPinOpen] = useState(false);
  const onCheckVoidPin = async (pin: string) => {
    try {
      const saveprocess = await FetchData(
        `/cms/check-value?key=pin_endshift&value=${pin}`,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        setIsVoidPinOpen(false);
        showPopup("void", "Void");
      } else {
        // PIN salah — ModalPinComponent handle error-nya sendiri
        console.log("PIN void salah", saveprocess);
      }
    } catch (error) {
      console.log("error check void pin", error);
    }
  };

  const [dataform, setdataform] = useState<any>([
    {
      name: "form",
      data: [
        {
          label: "type",
          name: "type",
          type: "hidden",
          value: "",
          cols: "col-span-6",
          disabled: true,
        },
        {
          label: "folioid",
          name: "folio_id",
          type: "hidden",
          value: "",
          cols: "col-span-6",
          disable: true,
        },
        {
          label: "folion No",
          name: "folio_no",
          type: "text",
          value: "",
          cols: "col-span-6",
          disable: true,
        },
        {
          label: "Date Transaction",
          name: "date",
          cols: "col-span-6",
          type: "text",
          value: "",
          disable: true,
        },
        {
          label: "Payment Type",
          name: "code",
          cols: "col-span-6",
          type: "select-multi",
          options: [{}],
          value: {},
          valueid: "",
          ismulti: false,
        },
        {
          label: "Item Code",
          name: "code_item_id",
          cols: "col-span-6",
          type: "hidden",
          options: [{}],
          value: {},
          valueid: "",
          ismulti: false,
        },

        {
          label: "Amount",
          name: "amount",
          cols: "col-span-6",
          type: "price",
          value: "0",
        },
        {
          label: "",
          name: "html",
          cols: "col-span-12",
          type: "html",
          value: "",
        },

        {
          label: "Card Name",
          name: "card_name",
          cols: "col-span-6",
          type: "text",
          value: "",
        },
        {
          label: "4 Last digit card",
          name: "last_digit_card",
          cols: "col-span-6",
          type: "number",
          value: "",
          length: "",
        },

        {
          label: "Billing to",
          name: "bill_to",
          cols: "col-span-6",
          type: "select-multi",
          value: "",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Voucher",
          name: "voucher",
          cols: "col-span-6",
          type: "text",
          value: "",
        },
        {
          label: "Remark",
          name: "remark",
          cols: "col-span-6",
          type: "textarea",
          value: "",
          length: "",
        },
        {
          label: "Complimentary",
          name: "complimentary",
          cols: "col-span-6",
          type: "checkbox",
          value: false,
          ismulti: false,
          length: "",
        },
        {
          label: "Guaranteed",
          name: "guaranted",
          cols: "col-span-6",
          type: "checkbox",
          value: false,
          ismulti: false,
          length: "",
        },
        {
          label: "Deposit Event Management",
          name: "is_event_deposit",
          cols: "col-span-6",
          type: "checkbox",
          value: false,
          ismulti: false,
          length: "",
        },
        {
          label: "Deposit POS",
          name: "is_pos_deposit",
          cols: "col-span-6",
          type: "checkbox",
          value: false,
          ismulti: false,
          length: "",
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
      b == "time" ||
      b == "price"
    ) {
      var values;
      if (b == "price") {
        values = formatAmount(e.target.value);
        // console.log("1", values);
        if (e.target.name == "amount") {
          GetCharge(values);
          if (dataInput[0].data[13].value) {
            values = 0;
            GetCharge(dataInput[0].data[6].value);
          }
        }
      } else {
        values = e.target.value;
      }
      // console.log("2", values);
      if (ia) {
        dataInput[form].items[index].data[ia].value = values;
      } else {
        dataInput[form].data[index].value = values;
      }
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e.target.value.forEach((element: any) => {
          valarr.push(element?.value);
        });
      } else {
        if (dataInput[form].data[index].label == "Post Code") {
          GetItemcode(e.value, "0");
        } else if (dataInput[form].data[index].label == "Item Code") {
          GetItemcode("0", e.value);
        }
      }
      if (ia) {
        dataInput[form].items[index].data[ia].value = e;
      } else {
        dataInput[form].data[index].value = e;
        if (dataInput[form].data[index].name == "code") {
          GetCharge(dataInput[form].data[6].value);
        }
      }
    } else if (b == "checkbox") {
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
      if (e.target.value == "complimentary") {
        if (e.target.checked) {
          dataInput[form].data[6].value = 0;
          GetCharge(0);
        }
      }
      if (ismulti) {
        let valarr = [];
        valarr.push({
          name: e.target.value,
          value: e.target.checked,
        });
        dataInput[form].data[index].value?.map((row) => {
          valarr.push({
            name: row?.name,
            value: row?.value,
          });
        });
        if (ia) {
          dataInput[form].items[index].data[ia].value = valarr;
        } else {
          dataInput[form].data[index].value = valarr;
        }
      } else {
        if (ia) {
          dataInput[form].items[index].data[ia].value = e.target.checked;
        } else {
          dataInput[form].data[index].value = e.target.checked;
        }
      }
    } else if (b == "custome") {
      if (form == "folio_ids") {
        setDatapush((vals) => {
          return { ...vals, ...{ ["folio_id"]: e.value, [form]: e } };
        });
      } else if (form == "codes") {
        setDatapush((vals) => {
          return { ...vals, ...{ ["code"]: e.value, [form]: e } };
        });
      } else if (form == "radio") {
        if (e.target.checked) {
          if (options?.rate) {
            setDatapush((vals) => {
              return {
                ...vals,
                ...{
                  ["rate_value"]: NumberClear(options.rate),
                  ["remaining_amount"]: formatAmount(
                    (
                      parseInt(NumberClear(options.rate)) - datapush?.amount
                    ).toString()
                  ),
                },
              };
            });
          }

          setData((dataval) => [...dataval, e.target.value]);
        } else {
          // remove
          var pos = dataval.findIndex((val) => val == e.target.value);
          if (pos >= 0) {
            dataval.splice(pos, 1);
          }
        }
      } else {
        if (e.target.name == "remark") {
          setDatapush({
            ...datapush,
            [e.target.name]: e.target.value,
          });
        } else if (e.target.name == "amount") {
          values = formatAmount(e.target.value);
          let valuesClear = parseFloat(NumberClear(values));
          // console.log("amount", valuesClear);
          // console.log("rem", datapush?.rate_value);
          setDatapush((vals) => {
            return {
              ...vals,
              ...{
                ["amount"]: NumberClear(values),
                ["amounts"]: values,
                ["remaining_amount"]: formatAmount(
                  (datapush?.rate_value - valuesClear)
                    .toFixed(2)
                    .toString()
                    .replace(".", ",")
                ),
              },
            };
          });
        } else {
          if (e.target.checked) {
            var pos = dataval.findIndex((val) => val == e.target.value);
            if (pos < 0) {
              setData((dataval) => [...dataval, e.target.value]);
            }
          } else {
            var pos = dataval.findIndex((val) => val == e.target.value);
            if (pos >= 0) {
              dataval.splice(pos, 1);
            }
            setData([...dataval]);
          }
        }
      }
    }
    setdataform([...dataInput]);
    // setError("");
  };
  function showPopup(type, title) {
    if (
      type == "consolidate" ||
      type == "void" ||
      type == "transfer" ||
      type == "split" ||
      type == "consolidate"
    ) {
      // console.log("test");
      GetDatattbl(type);
      if (type == "transfer") {
        GetDataFolio();
      }
    }
    setDatapush({});
    setData([]);

    let folioID = GetQueryStr("sub_data")
      ? GetQueryStr("sub_data") != ""
        ? GetQueryStr("sub_data")
        : GetQueryStr("data")
      : GetQueryStr("data");

    let dataInput = [...dataform];
    dataInput[0].data[4].value = {};
    dataInput[0].data[0].value = type;
    dataInput[0].data[1].value = folioID;
    dataInput[0].data[5].value = {};
    dataInput[0].data[6].value = "0";
    dataInput[0].data[8].value = "";
    dataInput[0].data[9].value = "";
    dataInput[0].data[10].value = {};
    dataInput[0].data[11].value = "";
    dataInput[0].data[12].value = "";
    if (type == "manual_posting") {
      dataInput[0].data[4].label = "Post Code";
      dataInput[0].data[5].type = "select-multi";
      dataInput[0].data[6].value = "0";
      dataInput[0].data[8].type = "hidden";
      dataInput[0].data[9].type = "hidden";
    } else {
      dataInput[0].data[4].label = "Payment Type";
      dataInput[0].data[5].type = "hidden";
      dataInput[0].data[8].type = "text";
      dataInput[0].data[9].type = "text";
    }
    setdataform([...dataInput]);
    setdatarate({});
    GetDataDetail(type);
    settitleadd(title);
    settypeadd(type);
    setpopup(true);
    // console.log(dataInput);
  }
  const GetDataDetail = async (type) => {
    try {
      let folioID = GetQueryStr("sub_data")
        ? GetQueryStr("sub_data") != ""
          ? GetQueryStr("sub_data")
          : GetQueryStr("data")
        : GetQueryStr("data");
      let getuuri =
        "/cms/transaction/create?folio_id=" + folioID + "&type_button=" + type;
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
        setDataDetail(data);
        let dataInput = [...dataform];
        dataInput[0].data[10].options = data?.master?.ledgers;
        dataInput[0].data[10].value =
          data?.master?.ledgers.length > 0 ? data?.master?.ledgers[0] : {};
        dataInput[0].data[2].value = data?.data?.reservation?.folio;
        dataInput[0].data[3].value = data?.master?.bussiness_date;
        if (type == "manual_posting") {
          dataInput[0].data[4].options = data?.master?.postCodeManual;
        } else {
          dataInput[0].data[4].options = data?.master?.code_posts;
        }
        if (type == "payment") {
          dataInput[0].data[6].value = data?.master?.payment;
        }
        if (type == "paidout") {
          dataInput[0].data[6].value = data?.master?.paid_out;
        }

        setDataposting(data?.master?.postCodeManual);
        setdataform([...dataInput]);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetDatattbl = async (uri?) => {
    try {
      let folioID = GetQueryStr("sub_data")
        ? GetQueryStr("sub_data") != ""
          ? GetQueryStr("sub_data")
          : GetQueryStr("data")
        : GetQueryStr("data");

      let getuuri = "";
      if (uri) {
        getuuri = "/cms/transaction?folio_id=" + folioID + "&filter=" + uri;
      } else {
        getuuri = "/cms/transaction?folio_id=" + folioID;
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
        setdatatbl(data);
        if (!IsOpenModalInsOnce) {
          setIsOpenModalInsOnce(true);
          if (data?.folio?.special_instruction?.posting_instruction != "") {
            if (isIns) {
              setIsOpenModalIns(true);
            }
          }
        }
        setdataTotal(data?.total_transaction);
        setIsCancel(data?.folio?.is_cancel);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetCharge = async (amount) => {
    try {
      if (
        dataform[0].data[4].value?.value == undefined ||
        dataform[0].data[4].value?.value == ""
      ) {
        return;
      }

      let getuuri =
        "/cms/code-post/get-charge?code_post_id=" +
        dataform[0].data[4].value?.value +
        "&amount=" +
        NumberClear("" + amount + "") +
        "&type=" +
        typeadd +
        "&folio_id=" +
        GetQueryStr("data");

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
        setdatarate(data);
        let dataInput: any = [...dataform];
        dataInput[0].data[10].value = data?.ledger;
        setdataform(dataInput);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetItemcode = async (id, val) => {
    try {
      let getuuri = "/cms/code-post/get-code-items?code_post_id=" + id;
      if (val == "0") {
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
          var arr = [];
          setDataitem(data?.data);
          data?.data?.map((rw, i) => {
            var obj = { value: rw?.value, label: rw?.label };
            arr.push(obj);
          });
          dataInput[0].data[5].options = arr;
          setdataform([...dataInput]);
        }
      } else {
        let dataInput = [...dataform];
        var amount = 0;
        dataitem?.map((rw) => {
          if (val == rw?.value) {
            amount = rw?.amount;
            GetCharge(amount);
          }
        });

        dataInput[0].data[6].value = amount;
        setdataform([...dataInput]);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetDetailData = async (i: any) => {
    try {
      let getuuri = "/cms/reservation/subfolio/" + i + "?is_transaction=1";

      if (i == "0") {
        return;
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

      if (datauser?.code == "200") {
        setsubfolio(datauser?.data);
      }

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    const isGIT = window.location.pathname.split("/")[2];

    if (isGIT == "git") {
      GetDetailData(new URLSearchParams(window.location.search).get("data"));
    }
    if (isPayment) {
      showPopup("payment", "Payment");
    }
  }, []);
  useEffect(() => {
    // console.log("paypopup", isPayment);
    if (isPayment) {
      showPopup("payment", "Payment");
    }
  }, [isPayment]);
  function BtnCustome() {
    return (
      <>
        {!IsCancel ? (
          <div
            className={
              subfolio.length == 0
                ? " flex w-full justify-end gap-4"
                : " flex w-full justify-between items-center mb-2 gap-4"
            }
          >
            {subfolio.length > 0 ? (
              <select
                className="border border-gray-300 p-2 rounded-lg w-1/4"
                name="parent"
                onChange={(e) => {
                  setidSubfolio(e.target.value);
                  router.replace({
                    pathname: window.location.pathname,
                    query: {
                      parent: new URLSearchParams(window.location.search).get(
                        "parent"
                      ),
                      module: new URLSearchParams(window.location.search).get(
                        "module"
                      ),
                      sub_data: e.target.value,
                      data: new URLSearchParams(window.location.search).get(
                        "data"
                      ),
                      key: new URLSearchParams(window.location.search).get(
                        "key"
                      ),
                    },
                  });
                }}
                value={idSubfolio}
              >
                <option value="">Select Subfolio</option>
                {subfolio.map((item: any, i: any) => (
                  <option value={item.value} key={i}>
                    {item.label}
                  </option>
                ))}
              </select>
            ) : (
              <></>
            )}

            <div className="flex justify-end gap-4">
              {datalocal?.data?.is_shift && (
                <>
                  <ButtonSubmit
                    isBtnAdd={canPayment}
                    label="Payment"
                    onCreate={() => {
                      showPopup("payment", "Payment");
                    }}
                  />
                  <ButtonSubmit
                    isBtnAdd={canPaidOut}
                    label="Paid Out"
                    onCreate={() => {
                      showPopup("paidout", "Paid Out");
                    }}
                  />
                  {/* <ButtonSubmit
                    isBtnAdd={canVoid}
                    label="Void"
                    onCreate={() => {
                      showPopup("void", "Void");
                    }}
                  /> */}
                  <ButtonSubmit
                    isBtnAdd={canVoid}
                    label="Void"
                    onCreate={() => {
                      if (!canVoid) return;
                      setIsVoidPinOpen(true);
                    }}
                  />
                  <ButtonSubmit
                    isBtnAdd={canRefund}
                    label="Refund"
                    onCreate={() => {
                      showPopup("refund", "Refund");
                    }}
                  />
                  <ButtonSubmit
                    isBtnAdd={canTransfer}
                    label="Transfer"
                    onCreate={() => {
                      showPopup("transfer", "Transfer");
                    }}
                  />
                  <ButtonSubmit
                    isBtnAdd={canManualPosting}
                    label="Manual Posting"
                    onCreate={() => {
                      showPopup("manual_posting", "Manual Posting");
                    }}
                  />
                  <ButtonSubmit
                    isBtnAdd={canSplit}
                    label="Split"
                    onCreate={() => {
                      showPopup("split", "Split");
                    }}
                  />
                  <ButtonSubmit
                    isBtnAdd={canConsolidate}
                    label="Consolidate"
                    onCreate={() => {
                      showPopup("consolidate", "Consolidate");
                    }}
                  />
                </>
              )}

              {isbtnPrint && (
                <ButtonSubmit
                  label="Print"
                  onCreate={() => {
                    setIsPrint(true);
                    GetLedger(0, 0);
                    // setDataTrxLedger([]);
                  }}
                  isprimary={false}
                />
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              subfolio.length == 0
                ? " flex w-full justify-end gap-4"
                : " flex w-full justify-between items-center mb-2 gap-4"
            }
          >
            {/* {subfolio.length > 0 ? (
              <select
                className="border border-gray-300 p-2 rounded-lg w-1/4"
                name="parent"
                onChange={(e) => {
                  setidSubfolio(e.target.value);
                  router.replace({
                    pathname: window.location.pathname,
                    query: {
                      parent: new URLSearchParams(window.location.search).get(
                        "parent"
                      ),
                      module: new URLSearchParams(window.location.search).get(
                        "module"
                      ),
                      sub_data: e.target.value,
                      data: new URLSearchParams(window.location.search).get(
                        "data"
                      ),
                      key: new URLSearchParams(window.location.search).get(
                        "key"
                      ),
                    },
                  });
                }}
                value={idSubfolio}
              >
                <option value="">Select Subfolio</option>
                {subfolio.map((item: any, i: any) => (
                  <option value={item.value} key={i}>
                    {item.label}
                  </option>
                ))}
              </select>
            ) : (
              <></>
            )} */}

            <div className="flex justify-end gap-4">
              {datalocal?.data?.is_shift && <></>}

              {isbtnPrint && (
                <ButtonSubmit
                  label="Print"
                  onCreate={() => {
                    setIsPrint(true);
                    GetLedger(0, 0);
                    // setDataTrxLedger([]);
                  }}
                  isprimary={false}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
  function tblView() {
    return (
      <>
        <div className="mt-2 bg-white table-responsive w-full table-auto">
          {typeadd == "transfer" ? (
            <>
              <div className="mt-2">
                <InputMain
                  label="Folio"
                  error={false}
                  onChangeSel={(e) => {
                    changeHandlera(e, "custome", "folio_ids", false, {}, 0, 0);
                  }}
                  valueSel={datapush?.folio_ids}
                  options={dataFolio}
                  typeInput="select-multi"
                  isMulti={false}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          {typeadd == "consolidate" ? (
            <>
              <div className="mt-2">
                <InputMain
                  label="Code"
                  error={false}
                  onChangeSel={(e) => {
                    changeHandlera(e, "custome", "codes", false, {}, 0, 0);
                  }}
                  valueSel={datapush?.codes}
                  options={dataposting}
                  typeInput="select-multi"
                  isMulti={false}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          {typeadd == "split" ? (
            <>
              <div className="mt-2">
                <InputMain
                  label="Code"
                  error={false}
                  onChangeSel={(e) => {
                    changeHandlera(e, "custome", "codes", false, {}, 0, 0);
                  }}
                  valueSel={datapush?.codes}
                  options={dataposting}
                  typeInput="select-multi"
                  isMulti={false}
                />
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <InputMain
                    label="Amount"
                    error={false}
                    rest={{
                      type: "text",
                      placeholder: "Amount Input Here",
                      name: "amount",
                      value: datapush?.amounts,
                      onChange: (e) => {
                        changeHandlera(e, "custome", "amount", false, {}, 0, 0);
                      },
                    }}
                    typeInput="base"
                  />
                </div>
                <div className="col-span-6">
                  <InputMain
                    label="Remaining Amount"
                    error={false}
                    rest={{
                      disabled: true,
                      type: "text",
                      placeholder: "Remaining Amount",
                      name: "remaining_amount",
                      value: datapush?.remaining_amount,
                    }}
                    typeInput="base"
                  />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <table className={"shadow-lg table-auto w-full"}>
            <thead>
              <tr className="">
                <td className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"></td>
                {datatbl?.table?.map((row: any, i: any) => (
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
              {datatbl?.data?.map((row: any, index) => (
                <>
                  <tr
                    key={row?.id + "-" + index}
                    className={`${
                      index % 2 == 0 ? " bg-gray-300 " : ""
                    } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] `}
                  >
                    <td className="p-2">
                      <input
                        type={typeadd == "split" ? "radio" : "checkbox"}
                        id={row?.id}
                        name={"nm_id"}
                        value={row?.id}
                        onChange={(e) => {
                          changeHandlera(
                            e,
                            "custome",
                            "radio",
                            false,
                            { rate: row?.total },
                            index
                          );
                        }}
                      />
                    </td>
                    {datatbl?.table?.map((item: any, a: any) => {
                      return item.row != 1 ? (
                        <td key={item.key + "-" + a}>
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

          <div className="mt-2">
            <InputMain
              label="Remark"
              error={false}
              restArea={{
                placeholder: "Remarks Input Here",
                name: "remark",
                value: datapush?.remark,
                onChange: (e) => {
                  changeHandlera(e, "custome", "remark", false, {}, 0, 0);
                },
              }}
              typeInput="textarea"
            />
          </div>
        </div>
      </>
    );
  }
  function RouteInit() {
    return (
      <>
        {BtnCustome()}
        <div className="mt-2 table-responsive rounded-lg">
          <table className={"shadow-lg min-w-full rounded-lg"}>
            <thead>
              <tr className="">
                {datatbl?.table?.map((row: any, i: any) => {
                  const isFirst = i === 0;
                  const isLast = i === datatbl?.table?.length - 1;

                  return (
                    <td
                      title={"Sort By " + row.label}
                      key={i}
                      className={`
                        bg-[#323A50] text-white p-2 font-bold cursor-pointer
                        ${isFirst ? 'rounded-tl-lg ' : ''}
                        ${isLast ? 'rounded-tr-lg' : ''}
                      `}
                    >
                      {row.label}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {datatbl?.data?.map((row: any, index) => (
                <>
                  <tr
                    key={row?.id + "-" + index}
                    className={`${
                      index % 2 == 0
                        ? row?.type == "void"
                          ? " bg-[#ffabb3] "
                          : row?.is_void == true
                          ? " bg-[#ffabb3] "
                          : row?.is_split == true
                          ? " bg-[#ffabb3] "
                          : row?.type == "refund"
                          ? " bg-[#feffa8] "
                          : row?.type == "transfer"
                          ? " bg-[#ffeac2] "
                          : row?.is_transfer
                          ? " bg-[#ffeac2] "
                          : row?.type == "from_transfer"
                          ? " bg-[#ffeac2] "
                          : ""
                        : row?.type == "void"
                        ? " bg-[#ffabb3] "
                        : row?.is_void == true
                        ? " bg-[#ffabb3] "
                        : row?.is_split == true
                        ? " bg-[#ffabb3] "
                        : row?.type == "refund"
                        ? " bg-[#feffa8] "
                        : row?.type == "transfer"
                        ? " bg-[#ffeac2] "
                        : row?.type == "from_transfer"
                        ? " bg-[#ffeac2] "
                        : row?.is_transfer
                        ? " bg-[#ffeac2] "
                        : ""
                    } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border `}
                  >
                    {/* 'is_void' => (bool) $this->is_void,
            'is_transfer' => (bool) $this->is_transfer,
            'is_consolidate' => (bool) $this->is_consolidate,
            'is_split' => (bool) $this->is_split, */}

                    {datatbl?.table?.map((item: any, a: any) => {
                      return item.row != 1 ? (
                        <td key={item.key + "-" + a} className="p-2">
                          {typeof row[item.key] == "string" ||
                          typeof row[item.key] == "number" ||
                          typeof row[item.key] == "boolean" ? (
                            row[item.key] == true &&
                            typeof row[item.key] == "boolean" ? (
                              <img
                                src="/assets/images/apps/checklist.png"
                                className="w-[20px] "
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
        </div>
      </>
    );
  }
  async function GetLedger(val, i) {
    // setDataTrxLedger([]);
    try {
      let getuuri = "/cms/reservation/ledger/" + GetQueryStr("data");
      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      var objData = [];
      if (data?.code == "200") {
        var dataLoop: any;

        var arr = [];
        data?.data?.map((rw) => {
          var obj = {};
          if (!datavalPrint?.guest_a) {
            setDataPrint({
              guest_a: data?.data[0],
              guest_b: data?.data[1],
              guest_c: data?.data[2],
              guest_d: data?.data[3],
            });
            GetLedgerTrx(data?.data[0], 0);
            GetLedgerTrx(data?.data[1], 1);
            GetLedgerTrx(data?.data[2], 2);
            GetLedgerTrx(data?.data[3], 3);
            if (
              data?.data[0]?.value != rw?.value &&
              data?.data[1]?.value != rw?.value &&
              data?.data[2]?.value != rw?.value &&
              data?.data[3]?.value != rw?.value
            ) {
              obj = {
                value: rw?.value,
                label: rw?.label,
              };
              arr.push(obj);
            }
          } else {
            var val_a = i == 0 ? val?.value : datavalPrint?.guest_a?.value;
            var val_b = i == 1 ? val?.value : datavalPrint?.guest_b?.value;
            var val_c = i == 2 ? val?.value : datavalPrint?.guest_c?.value;
            var val_d = i == 3 ? val?.value : datavalPrint?.guest_d?.value;

            if (
              val_a != rw?.value &&
              val_b != rw?.value &&
              val_c != rw?.value &&
              val_d != rw?.value
            ) {
              obj = {
                value: rw?.value,
                label: rw?.label,
              };
              arr.push(obj);
            }
          }
        });
        setDataLedger(arr);
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
  async function GetLedgerTrx(val: any, loop) {
    // setDataTrxLedger([]);
    try {
      var dataLoop: any;
      var objData = [];
      var uriLoop =
        "/cms/transaction?folio_id=" +
        GetQueryStr("data") +
        "&ledger_id=" +
        val?.value +
        "&loop=" +
        loop;

      dataLoop = await FetchData(
        uriLoop,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (dataLoop?.code == "200") {
        dataLoop.ledgerLabel = val?.label;
        dataLoop.ledgerValue = val?.value;
        // objData.push(dataLoop);
        // setDataTrxLedger((dataTrxLedger) => [...dataTrxLedger, dataLoop]);
        if (loop == 0) {

          settblguestA(dataLoop);
        } else if (loop == 1) {
          settblguestB(dataLoop);
        } else if (loop == 2) {
          settblguestC(dataLoop);
        } else if (loop == 3) {
          settblguestD(dataLoop);
        }
      }

      // console.log(data?.data);
      // setDataLedger(data?.data);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
  function allowDrop(ev) {
    ev.preventDefault();
  }
  function drag(ev) {
    ev.dataTransfer.setData("elem", ev.target.id);
    ev.dataTransfer.setData("data", JSON.stringify(ev.target.dataset));
  }
  function drop(ev) {
    ev.preventDefault();
    // console.log("wdydrop", ev.currentTarget.attributes["id"].value);
    // console.log("wdy", JSON.parse(ev.dataTransfer.getData("data")));
    OnMoveTrx(
      JSON.parse(ev.dataTransfer.getData("data"))?.idtrx,
      ev.currentTarget.attributes["id"].value
    );

    // var element = ev.dataTransfer.getData("elem");
    // ev.target.appendChild(document.getElementById(element));
  }

  function SortTrxLedger(a, b) {
    if (a.ledger_id < b.ledger_id) {
      return -1;
    }
    if (a.ledger_id > b.ledger_id) {
      return 1;
    }
    return 0;
  }

  const handlePrint = async (urlItem: string) => {
    try {
      const url = env.uriApi + urlItem;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${datalocal?.data?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);

      const newWindow = window.open(pdfUrl, "_blank");

      if (newWindow) {
        newWindow.addEventListener("load", () => {
          newWindow.print();
          URL.revokeObjectURL(pdfUrl);
        });
      } else {
        throw new Error("Unable to open new window");
      }
    } catch (error) {
      console.error("Print setup failed:", error);
      alert("Failed to set up printing. Please try again.");
    }
  };

  function GuestTrx(folio) {
    return (
      <>
        <div
          id="currentDragNme"
          className="fixed bg-[#ffffff] p-4 hidden"
        ></div>
        <div className="grid grid-cols-12 gap-4 ">
          <div className="col-span-12">
            <div className="flex gap-2">
              {" "}
              <ButtonSubmit
                label="Cancel"
                onCreate={() => {
                  setIsPrint(false);
                  // setDataTrxLedger([]);
                  GetDatattbl();
                  clickCancel(true);
                }}
                isprimary={false}
              />
              <ButtonSubmit
                label="Print All"
                onCreate={() => {
                  handlePrint(`/cms/report/batch/folio/${folio}/guest-invoice`);
                }}
              />
            </div>
          </div>
          {dataTrxLedger?.map((rw, index) => (
            <>
              {index < 4 && (
                <div className="col-span-12 xl:col-span-6">
                  <div className="ml-2">
                    <InputMain
                      typeInput={"select-multi"}
                      label=""
                      error={false}
                      valueSel={
                        index == 0
                          ? datavalPrint?.guest_a
                          : index == 1
                          ? datavalPrint?.guest_b
                          : index == 2
                          ? datavalPrint?.guest_c
                          : index == 3
                          ? datavalPrint?.guest_d
                          : ""
                      }
                      onChangeSel={(e) => {
                        GetLedgerTrx(e, index);
                        if (index == 0) {
                          setDataPrint({
                            ...datavalPrint,
                            guest_a: e,
                          });
                        }
                        if (index == 1) {
                          setDataPrint({
                            ...datavalPrint,
                            guest_b: e,
                          });
                        }
                        if (index == 2) {
                          setDataPrint({
                            ...datavalPrint,
                            guest_c: e,
                          });
                        }
                        if (index == 3) {
                          setDataPrint({
                            ...datavalPrint,
                            guest_d: e,
                          });
                        }
                        GetLedger(e, index);
                      }}
                      options={dataLedger}
                      isMulti={false}
                    />
                  </div>
                  <div
                    className={
                      "mt-2 table-responsive w-full table-auto min-h-[300px]" +
                      (touchStart ? "!overflow-hidden" : "")
                    }
                  >
                    {index == 0 ? (
                      <>
                        <table
                          className={"shadow-lg table-auto w-full"}
                          id={datavalPrint?.guest_a?.value}
                          onDrop={(e) => drop(e)}
                          onDragOver={(e) => {
                            allowDrop(e);
                          }}
                        >
                          <thead>
                            <tr className="">
                              {tblguestA?.table?.map((row: any, i: any) => (
                                <td
                                  title={"Sort By " + row.label}
                                  data-id={
                                    index == 0
                                      ? datavalPrint?.guest_a?.value
                                      : index == 1
                                      ? datavalPrint?.guest_b?.value
                                      : index == 2
                                      ? datavalPrint?.guest_c?.value
                                      : index == 3
                                      ? datavalPrint?.guest_d?.value
                                      : ""
                                  }
                                  key={i}
                                  className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                                >
                                  {row.label}
                                </td>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tblguestA?.data?.map((row: any, indexa) => (
                              <tr
                                key={row?.id}
                                data-idtrx={row?.id}
                                data-idval={
                                  index == 0
                                    ? datavalPrint?.guest_a?.value
                                    : index == 1
                                    ? datavalPrint?.guest_b?.value
                                    : index == 2
                                    ? datavalPrint?.guest_c?.value
                                    : index == 3
                                    ? datavalPrint?.guest_d?.value
                                    : ""
                                }
                                className={`${
                                  index % 2 == 0
                                    ? row?.type == "void"
                                      ? " bg-[#ffabb3] "
                                      : row?.type == "refund"
                                      ? " bg-[#feffa8] "
                                      : row?.type == "transfer"
                                      ? " bg-[#ffeac2] "
                                      : row?.type == "from_transfer"
                                      ? " bg-[#ffeac2] "
                                      : ""
                                    : row?.type == "void"
                                    ? " bg-[#ffabb3] "
                                    : row?.type == "refund"
                                    ? " bg-[#feffa8] "
                                    : row?.type == "transfer"
                                    ? " bg-[#ffeac2] "
                                    : row?.type == "from_transfer"
                                    ? " bg-[#ffeac2] "
                                    : ""
                                } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border `}
                                onDragStart={(e: any) => {
                                  drag(e);
                                }}
                                onTouchStartCapture={(e) => {
                                  if (e.touches.length > 1) {
                                    e.currentTarget.classList.add(
                                      "bg-[#d4e4fc]"
                                    );
                                    document.getElementById(
                                      "currentDragNme"
                                    ).style.display = "block";
                                    document.getElementById(
                                      "currentDragNme"
                                    ).innerHTML =
                                      row?.date +
                                      " | " +
                                      row?.code +
                                      " | " +
                                      row?.description;
                                    document.getElementById(
                                      "currentDragNme"
                                    ).style.top =
                                      (e.changedTouches[0].clientY - 50)
                                        .toFixed(0)
                                        .toString() + "px";
                                    document.getElementById(
                                      "currentDragNme"
                                    ).style.left =
                                      e.changedTouches[0].clientX
                                        .toFixed(0)
                                        .toString() + "px";

                                    document.getElementById(
                                      "currentDragNme"
                                    ).style.zIndex = "9990";
                                    setTouchStart(true);
                                  }
                                }}
                                onTouchEndCapture={(e) => {
                                  if (touchStart) {
                                    e.currentTarget.classList.remove(
                                      "bg-[#d4e4fc]"
                                    );
                                    document.getElementById(
                                      "currentDragNme"
                                    ).style.display = "none";

                                    if (
                                      document
                                        .elementFromPoint(
                                          e.changedTouches[0].clientX,
                                          e.changedTouches[0].clientY
                                        )
                                        .getAttribute("data-id") !==
                                      e.currentTarget.getAttribute("data-idval")
                                    ) {
                                      OnMoveTrx(
                                        e.currentTarget.getAttribute(
                                          "data-idtrx"
                                        ),
                                        document
                                          .elementFromPoint(
                                            e.changedTouches[0].clientX,
                                            e.changedTouches[0].clientY
                                          )
                                          .getAttribute("data-id")
                                      );
                                    }
                                    setTouchStart(false);
                                  }
                                }}
                                onTouchMove={(e) => {
                                  if (touchStart) {
                                    document.getElementById(
                                      "currentDragNme"
                                    ).style.top =
                                      (e.changedTouches[0].clientY - 50)
                                        .toFixed(0)
                                        .toString() + "px";
                                    document.getElementById(
                                      "currentDragNme"
                                    ).style.left =
                                      e.changedTouches[0].clientX
                                        .toFixed(0)
                                        .toString() + "px";
                                  }
                                }}
                                draggable
                              >
                                {tblguestA?.table?.map((item: any, a: any) => {
                                  return item.row != 1 ? (
                                    <td
                                      key={item.key + "-" + a}
                                      className="p-2"
                                      data-id={rw?.ledgerValue}
                                    >
                                      {typeof row[item.key] == "string" ||
                                      typeof row[item.key] == "number" ||
                                      typeof row[item.key] == "boolean" ? (
                                        row[item.key] == true &&
                                        typeof row[item.key] == "boolean" ? (
                                          <img
                                            src="/assets/images/apps/checklist.png"
                                            className="w-[20px] "
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
                                        row[item.key]?.en ??
                                        row[item.key]?.label
                                      )}
                                    </td>
                                  ) : (
                                    <></>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : index == 1 ? (
                      <>
                        <table
                          className={"shadow-lg table-auto w-full"}
                          id={datavalPrint?.guest_b?.value}
                          onDrop={(e) => drop(e)}
                          onDragOver={(e) => {
                            allowDrop(e);
                          }}
                        >
                          <thead>
                            <tr className="">
                              {tblguestB?.table?.map((row: any, i: any) => (
                                <td
                                  title={"Sort By " + row.label}
                                  data-id={
                                    index == 0
                                      ? datavalPrint?.guest_a?.value
                                      : index == 1
                                      ? datavalPrint?.guest_b?.value
                                      : index == 2
                                      ? datavalPrint?.guest_c?.value
                                      : index == 3
                                      ? datavalPrint?.guest_d?.value
                                      : ""
                                  }
                                  key={i}
                                  className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                                >
                                  {row.label}
                                </td>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tblguestB?.data?.map((row: any, indexa) => (
                              <>
                                <tr
                                  key={row?.id}
                                  data-idtrx={row?.id}
                                  data-idval={
                                    index == 0
                                      ? datavalPrint?.guest_a?.value
                                      : index == 1
                                      ? datavalPrint?.guest_b?.value
                                      : index == 2
                                      ? datavalPrint?.guest_c?.value
                                      : index == 3
                                      ? datavalPrint?.guest_d?.value
                                      : ""
                                  }
                                  className={`${
                                    index % 2 == 0
                                      ? row?.type == "void"
                                        ? " bg-[#ffabb3] "
                                        : row?.type == "refund"
                                        ? " bg-[#feffa8] "
                                        : row?.type == "transfer"
                                        ? " bg-[#ffeac2] "
                                        : row?.type == "from_transfer"
                                        ? " bg-[#ffeac2] "
                                        : ""
                                      : row?.type == "void"
                                      ? " bg-[#ffabb3] "
                                      : row?.type == "refund"
                                      ? " bg-[#feffa8] "
                                      : row?.type == "transfer"
                                      ? " bg-[#ffeac2] "
                                      : row?.type == "from_transfer"
                                      ? " bg-[#ffeac2] "
                                      : ""
                                  } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border `}
                                  onDragStart={(e: any) => {
                                    drag(e);
                                  }}
                                  onTouchStartCapture={(e) => {
                                    if (e.touches.length > 1) {
                                      e.currentTarget.classList.add(
                                        "bg-[#d4e4fc]"
                                      );
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.display = "block";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).innerHTML =
                                        row?.date +
                                        " | " +
                                        row?.code +
                                        " | " +
                                        row?.description;
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.top =
                                        (e.changedTouches[0].clientY - 50)
                                          .toFixed(0)
                                          .toString() + "px";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.left =
                                        e.changedTouches[0].clientX
                                          .toFixed(0)
                                          .toString() + "px";

                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.zIndex = "9990";
                                      setTouchStart(true);
                                    }
                                  }}
                                  onTouchEndCapture={(e) => {
                                    if (touchStart) {
                                      e.currentTarget.classList.remove(
                                        "bg-[#d4e4fc]"
                                      );
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.display = "none";

                                      if (
                                        document
                                          .elementFromPoint(
                                            e.changedTouches[0].clientX,
                                            e.changedTouches[0].clientY
                                          )
                                          .getAttribute("data-id") !==
                                        e.currentTarget.getAttribute(
                                          "data-idval"
                                        )
                                      ) {
                                        OnMoveTrx(
                                          e.currentTarget.getAttribute(
                                            "data-idtrx"
                                          ),
                                          document
                                            .elementFromPoint(
                                              e.changedTouches[0].clientX,
                                              e.changedTouches[0].clientY
                                            )
                                            .getAttribute("data-id")
                                        );
                                      }
                                      setTouchStart(false);
                                    }
                                  }}
                                  onTouchMove={(e) => {
                                    if (touchStart) {
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.top =
                                        (e.changedTouches[0].clientY - 50)
                                          .toFixed(0)
                                          .toString() + "px";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.left =
                                        e.changedTouches[0].clientX
                                          .toFixed(0)
                                          .toString() + "px";
                                    }
                                  }}
                                  draggable
                                >
                                  {tblguestB?.table?.map(
                                    (item: any, a: any) => {
                                      return item.row != 1 ? (
                                        <td
                                          key={item.key + "-" + a}
                                          className="p-2"
                                          data-id={rw?.ledgerValue}
                                        >
                                          {typeof row[item.key] == "string" ||
                                          typeof row[item.key] == "number" ||
                                          typeof row[item.key] == "boolean" ? (
                                            row[item.key] == true &&
                                            typeof row[item.key] ==
                                              "boolean" ? (
                                              <img
                                                src="/assets/images/apps/checklist.png"
                                                className="w-[20px] "
                                              />
                                            ) : row[item.key] == false &&
                                              typeof row[item.key] ==
                                                "boolean" ? (
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
                                            row[item.key]?.en ??
                                            row[item.key]?.label
                                          )}
                                        </td>
                                      ) : (
                                        <></>
                                      );
                                    }
                                  )}
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : index == 2 ? (
                      <>
                        <table
                          className={"shadow-lg table-auto w-full"}
                          id={datavalPrint?.guest_c?.value}
                          onDrop={(e) => drop(e)}
                          onDragOver={(e) => {
                            allowDrop(e);
                          }}
                        >
                          <thead>
                            <tr className="">
                              {tblguestC?.table?.map((row: any, i: any) => (
                                <td
                                  title={"Sort By " + row.label}
                                  data-id={
                                    index == 0
                                      ? datavalPrint?.guest_a?.value
                                      : index == 1
                                      ? datavalPrint?.guest_b?.value
                                      : index == 2
                                      ? datavalPrint?.guest_c?.value
                                      : index == 3
                                      ? datavalPrint?.guest_d?.value
                                      : ""
                                  }
                                  key={i}
                                  className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                                >
                                  {row.label}
                                </td>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tblguestC?.data?.map((row: any, indexa) => (
                              <>
                                <tr
                                  key={row?.id}
                                  data-idtrx={row?.id}
                                  data-idval={
                                    index == 0
                                      ? datavalPrint?.guest_a?.value
                                      : index == 1
                                      ? datavalPrint?.guest_b?.value
                                      : index == 2
                                      ? datavalPrint?.guest_c?.value
                                      : index == 3
                                      ? datavalPrint?.guest_d?.value
                                      : ""
                                  }
                                  className={`${
                                    index % 2 == 0
                                      ? row?.type == "void"
                                        ? " bg-[#ffabb3] "
                                        : row?.type == "refund"
                                        ? " bg-[#feffa8] "
                                        : row?.type == "transfer"
                                        ? " bg-[#ffeac2] "
                                        : row?.type == "from_transfer"
                                        ? " bg-[#ffeac2] "
                                        : ""
                                      : row?.type == "void"
                                      ? " bg-[#ffabb3] "
                                      : row?.type == "refund"
                                      ? " bg-[#feffa8] "
                                      : row?.type == "transfer"
                                      ? " bg-[#ffeac2] "
                                      : row?.type == "from_transfer"
                                      ? " bg-[#ffeac2] "
                                      : ""
                                  } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border `}
                                  onDragStart={(e: any) => {
                                    drag(e);
                                  }}
                                  onTouchStartCapture={(e) => {
                                    if (e.touches.length > 1) {
                                      e.currentTarget.classList.add(
                                        "bg-[#d4e4fc]"
                                      );
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.display = "block";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).innerHTML =
                                        row?.date +
                                        " | " +
                                        row?.code +
                                        " | " +
                                        row?.description;
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.top =
                                        (e.changedTouches[0].clientY - 50)
                                          .toFixed(0)
                                          .toString() + "px";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.left =
                                        e.changedTouches[0].clientX
                                          .toFixed(0)
                                          .toString() + "px";

                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.zIndex = "9990";
                                      setTouchStart(true);
                                    }
                                  }}
                                  onTouchEndCapture={(e) => {
                                    if (touchStart) {
                                      e.currentTarget.classList.remove(
                                        "bg-[#d4e4fc]"
                                      );
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.display = "none";

                                      if (
                                        document
                                          .elementFromPoint(
                                            e.changedTouches[0].clientX,
                                            e.changedTouches[0].clientY
                                          )
                                          .getAttribute("data-id") !==
                                        e.currentTarget.getAttribute(
                                          "data-idval"
                                        )
                                      ) {
                                        OnMoveTrx(
                                          e.currentTarget.getAttribute(
                                            "data-idtrx"
                                          ),
                                          document
                                            .elementFromPoint(
                                              e.changedTouches[0].clientX,
                                              e.changedTouches[0].clientY
                                            )
                                            .getAttribute("data-id")
                                        );
                                      }
                                      setTouchStart(false);
                                    }
                                  }}
                                  onTouchMove={(e) => {
                                    if (touchStart) {
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.top =
                                        (e.changedTouches[0].clientY - 50)
                                          .toFixed(0)
                                          .toString() + "px";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.left =
                                        e.changedTouches[0].clientX
                                          .toFixed(0)
                                          .toString() + "px";
                                    }
                                  }}
                                  draggable
                                >
                                  {tblguestC?.table?.map(
                                    (item: any, a: any) => {
                                      return item.row != 1 ? (
                                        <td
                                          key={item.key + "-" + a}
                                          className="p-2"
                                          data-id={rw?.ledgerValue}
                                        >
                                          {typeof row[item.key] == "string" ||
                                          typeof row[item.key] == "number" ||
                                          typeof row[item.key] == "boolean" ? (
                                            row[item.key] == true &&
                                            typeof row[item.key] ==
                                              "boolean" ? (
                                              <img
                                                src="/assets/images/apps/checklist.png"
                                                className="w-[20px] "
                                              />
                                            ) : row[item.key] == false &&
                                              typeof row[item.key] ==
                                                "boolean" ? (
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
                                            row[item.key]?.en ??
                                            row[item.key]?.label
                                          )}
                                        </td>
                                      ) : (
                                        <></>
                                      );
                                    }
                                  )}
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : index == 3 ? (
                      <>
                        <table
                          className={"shadow-lg table-auto w-full"}
                          id={datavalPrint?.guest_d?.value}
                          onDrop={(e) => drop(e)}
                          onDragOver={(e) => {
                            allowDrop(e);
                          }}
                        >
                          <thead>
                            <tr className="">
                              {tblguestD?.table?.map((row: any, i: any) => (
                                <td
                                  title={"Sort By " + row.label}
                                  data-id={
                                    index == 0
                                      ? datavalPrint?.guest_a?.value
                                      : index == 1
                                      ? datavalPrint?.guest_b?.value
                                      : index == 2
                                      ? datavalPrint?.guest_c?.value
                                      : index == 3
                                      ? datavalPrint?.guest_d?.value
                                      : ""
                                  }
                                  key={i}
                                  className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                                >
                                  {row.label}
                                </td>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tblguestD?.data?.map((row: any, indexa) => (
                              <>
                                <tr
                                  key={row?.id}
                                  data-idtrx={row?.id}
                                  data-idval={
                                    index == 0
                                      ? datavalPrint?.guest_a?.value
                                      : index == 1
                                      ? datavalPrint?.guest_b?.value
                                      : index == 2
                                      ? datavalPrint?.guest_c?.value
                                      : index == 3
                                      ? datavalPrint?.guest_d?.value
                                      : ""
                                  }
                                  className={`${
                                    index % 2 == 0
                                      ? row?.type == "void"
                                        ? " bg-[#ffabb3] "
                                        : row?.type == "refund"
                                        ? " bg-[#feffa8] "
                                        : row?.type == "transfer"
                                        ? " bg-[#ffeac2] "
                                        : row?.type == "from_transfer"
                                        ? " bg-[#ffeac2] "
                                        : ""
                                      : row?.type == "void"
                                      ? " bg-[#ffabb3] "
                                      : row?.type == "refund"
                                      ? " bg-[#feffa8] "
                                      : row?.type == "transfer"
                                      ? " bg-[#ffeac2] "
                                      : row?.type == "from_transfer"
                                      ? " bg-[#ffeac2] "
                                      : ""
                                  } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] border `}
                                  onDragStart={(e: any) => {
                                    drag(e);
                                  }}
                                  onTouchStartCapture={(e) => {
                                    if (e.touches.length > 1) {
                                      e.currentTarget.classList.add(
                                        "bg-[#d4e4fc]"
                                      );
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.display = "block";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).innerHTML =
                                        row?.date +
                                        " | " +
                                        row?.code +
                                        " | " +
                                        row?.description;
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.top =
                                        (e.changedTouches[0].clientY - 50)
                                          .toFixed(0)
                                          .toString() + "px";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.left =
                                        e.changedTouches[0].clientX
                                          .toFixed(0)
                                          .toString() + "px";

                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.zIndex = "9990";
                                      setTouchStart(true);
                                    }
                                  }}
                                  onTouchEndCapture={(e) => {
                                    if (touchStart) {
                                      e.currentTarget.classList.remove(
                                        "bg-[#d4e4fc]"
                                      );
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.display = "none";

                                      if (
                                        document
                                          .elementFromPoint(
                                            e.changedTouches[0].clientX,
                                            e.changedTouches[0].clientY
                                          )
                                          .getAttribute("data-id") !==
                                        e.currentTarget.getAttribute(
                                          "data-idval"
                                        )
                                      ) {
                                        OnMoveTrx(
                                          e.currentTarget.getAttribute(
                                            "data-idtrx"
                                          ),
                                          document
                                            .elementFromPoint(
                                              e.changedTouches[0].clientX,
                                              e.changedTouches[0].clientY
                                            )
                                            .getAttribute("data-id")
                                        );
                                      }
                                      setTouchStart(false);
                                    }
                                  }}
                                  onTouchMove={(e) => {
                                    if (touchStart) {
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.top =
                                        (e.changedTouches[0].clientY - 50)
                                          .toFixed(0)
                                          .toString() + "px";
                                      document.getElementById(
                                        "currentDragNme"
                                      ).style.left =
                                        e.changedTouches[0].clientX
                                          .toFixed(0)
                                          .toString() + "px";
                                    }
                                  }}
                                  draggable
                                >
                                  {tblguestD?.table?.map(
                                    (item: any, a: any) => {
                                      return item.row != 1 ? (
                                        <td
                                          key={item.key + "-" + a}
                                          className="p-2"
                                          data-id={rw?.ledgerValue}
                                        >
                                          {typeof row[item.key] == "string" ||
                                          typeof row[item.key] == "number" ||
                                          typeof row[item.key] == "boolean" ? (
                                            row[item.key] == true &&
                                            typeof row[item.key] ==
                                              "boolean" ? (
                                              <img
                                                src="/assets/images/apps/checklist.png"
                                                className="w-[20px] "
                                              />
                                            ) : row[item.key] == false &&
                                              typeof row[item.key] ==
                                                "boolean" ? (
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
                                            row[item.key]?.en ??
                                            row[item.key]?.label
                                          )}
                                        </td>
                                      ) : (
                                        <></>
                                      );
                                    }
                                  )}
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex mt-2 ml-2">
                    <ButtonSubmit
                      label="Print"
                      onCreate={() => {
                        handlePrint(
                          `/cms/report/batch/folio/${folio}/guest-folio?ledger_id=${
                            index == 0
                              ? datavalPrint?.guest_a?.value
                              : index == 1
                              ? datavalPrint?.guest_b?.value
                              : index == 2
                              ? datavalPrint?.guest_c?.value
                              : index == 3
                              ? datavalPrint?.guest_d?.value
                              : ""
                          }`
                        );
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          ))}
          <></>
        </div>
      </>
    );
  }
  useEffect(() => {
    setModalPaymentPrint(false);
  }, [typeadd]);
  const ContentPopUp = (key) => {
    return (
      <>
        <div className="bg-white">
          <div className="p-2 font-bold">
            <h1>{titleadd}</h1>
          </div>
          <div className="flex justify-center pl-2 pr-2 w-full">
            <div className="w-full grid grid-cols-12 h-fit gap-2 ml-2 mb-4 mt-2 mr-2">
              {typeadd != "consolidate" &&
              typeadd != "void" &&
              typeadd != "transfer" &&
              typeadd != "split" ? (
                <>
                  {dataform[0]?.data?.map((row: any, index) => (
                    <>
                      {row?.type != "hidden" ? (
                        <div className={row?.cols + " relative "}>
                          {row?.type != "html" ? (
                            <>
                              {(typeadd == "payment" &&
                                row?.label != "Complimentary") ||
                              (typeadd == "paidout" &&
                                row?.label != "Complimentary" &&
                                row?.label != "Guaranteed" &&
                                row?.label != "Deposit") ||
                              (typeadd == "refund" &&
                                row?.label != "Complimentary" &&
                                row?.label != "Guaranteed" &&
                                row?.label != "Deposit") ||
                              (typeadd == "manual_posting" &&
                                row?.label != "Guaranteed" &&
                                row?.label != "Deposit POS") ||
                              (typeadd == "payment" &&
                                row?.label == "Guaranteed" &&
                                datatbl?.data?.length == 0) ? (
                                <InputMain
                                  typeInput={
                                    row?.type == "text" ||
                                    row?.type == "number" ||
                                    row?.type == "date" ||
                                    row?.type == "time" ||
                                    row?.type == "price"
                                      ? "base"
                                      : row?.type
                                  }
                                  placeholder=""
                                  error={false}
                                  label={row?.label}
                                  rest={{
                                    disabled: row?.disable,
                                    autoComplete: row?.isAutoComp
                                      ? "off"
                                      : "on",
                                    name: row?.name,
                                    placeholder:
                                      row?.name != "bill_to"
                                        ? row?.placeholder ?? row?.label
                                        : "",
                                    value: row?.value,
                                    type:
                                      row?.type == "price" ? "text" : row?.type,

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
                                  }}
                                  restArea={{
                                    placeholder: row?.label,
                                    name: row?.name,
                                    value: row?.value,
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
                                  valueSel={row?.value}
                                  options={row?.options}
                                  isMulti={row?.ismulti}
                                  isAll={row?.isAll}
                                  valuename={row?.name}
                                  colspan={row?.colcheckbox}
                                />
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="grid grid-cols-12">
                                <div className="col-span-6"></div>
                                <div className="col-span-6">
                                  <div className="grid grid-cols-12">
                                    {datarate?.data?.amount ? (
                                      <>
                                        <div className="col-span-6">Amount</div>
                                        <div className="col-span-6">
                                          {datarate?.data?.amount ?? 0}
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {datarate?.data?.pb1 ? (
                                      <>
                                        <div className="col-span-6">PB1</div>
                                        <div className="col-span-6">
                                          {datarate?.data?.pb1 ?? 0}
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {datarate?.data?.svr_chrg ? (
                                      <>
                                        <div className="col-span-6">
                                          Service Charge
                                        </div>
                                        <div className="col-span-6">
                                          {datarate?.data?.svr_chrg ?? 0}
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {datarate?.data?.tax3 ? (
                                      <>
                                        <div className="col-span-6">Tax3</div>
                                        <div className="col-span-6">
                                          {datarate?.data?.tax3 ?? 0}
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {datarate?.data?.surcharge ? (
                                      <>
                                        <div className="col-span-6">
                                          Surcharge
                                        </div>
                                        <div className="col-span-6">
                                          {datarate?.data?.surcharge ?? 0}
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {datarate?.data?.total ? (
                                      <>
                                        {/* line */}
                                        <hr className="col-span-12 mt-2 mb-2" />
                                        <div className="col-span-6">Total</div>
                                        <div className="col-span-6">
                                          {datarate?.data?.total ?? 0}
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <>
                  <div className="col-span-12">{tblView()}</div>
                </>
              )}

              <div className="col-span-12 flex gap-2">
                <ButtonSubmit
                  label="Cancel"
                  onCreate={() => {
                    setpopup(false);
                    GetDatattbl("trx");
                    clickCancel(true);
                    // ResetPath();
                  }}
                  isprimary={false}
                />

                <ButtonSubmit
                  label="Save"
                  onCreate={() => {
                    // OnSaveMsgRmk();
                    // setloading(true);
                    // onSavePopup();
                    OnSave();
                    clickSave(true);
                  }}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const ModalPaymentPrintComp = (key) => {
    return (
      <>
        <div className="bg-white h-fit z-20">
          <div className="p-2 font-bold">{/* <h1>Payment</h1> */}</div>
          <div className="flex flex-col items-center justify-center pl-2 pr-2 w-full gap-5">
            <p>Are you want to print payment receipt?</p>
            <div className="col-span-12 flex gap-2">
              <ButtonSubmit
                label="No"
                onCreate={() => {
                  setModalPaymentPrint(false);
                  // ResetPath();
                }}
                isprimary={false}
              />

              <ButtonSubmit
                label="Print"
                onCreate={() => {
                  // OnSaveMsgRmk();
                  // setloading(true);
                  // onSavePopup();
                  // OnSave();
                  // clickSave(true);
                  handlePrint(
                    `/cms/report/batch/folio/${GetQueryStr(
                      "data"
                    )}/official-receipt?transaction_id=${idTrx}`
                  );
                  setModalPaymentPrint(false);
                }}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const FinalPOstDat = () => {
    var objpost: any = {};
    if (
      typeadd != "void" &&
      typeadd != "transfer" &&
      typeadd != "consolidate" &&
      typeadd != "split"
    ) {
      dataform[0]?.data?.map((rw, i) => {
        if (rw?.type == "select-multi") {
          objpost[rw?.name] = rw?.value?.value;
        } else if (rw?.type == "price") {
          objpost[rw?.name] = NumberClear(rw?.value + "");
        } else {
          objpost[rw?.name] = rw?.value;
        }
      });
    } else {
      //console.log("consol", datapush);
      objpost = datapush;
      objpost.idx = dataval;
    }
    return objpost;
  };
  const OnMoveTrx = async (trxid, ledgerTo) => {
    setloading(true);
    try {
      let urisave = "/cms/reservation/ledger/move/" + trxid;
      let mth = "PUT";
      const raw = JSON.stringify({
        ledger_to: ledgerTo,
      });

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
        // ResetPath();
        setloading(false);
        setpopup(false);
        // GetLedger(0, 0);
        GetLedgerTrx(datavalPrint?.guest_a, 0);
        GetLedgerTrx(datavalPrint?.guest_b, 1);
        GetLedgerTrx(datavalPrint?.guest_c, 2);
        GetLedgerTrx(datavalPrint?.guest_a, 4);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const OnSave = async () => {
    setloading(true);
    try {
      var params = "";
      if (typeadd == "void") {
        params = "/void";
      } else if (typeadd == "transfer") {
        params = "/transfer";
      } else if (typeadd == "consolidate") {
        params = "/consolidate";
      } else if (typeadd == "split") {
        params = "/split";
      }

      let folioID = GetQueryStr("sub_data")
        ? GetQueryStr("sub_data") != ""
          ? GetQueryStr("sub_data")
          : GetQueryStr("data")
        : GetQueryStr("data");
      let urisave = "/cms/transaction" + params + "?folio_id=" + folioID;
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
        ResetPath();
        setloading(false);
        setpopup(false);
      } else {
        setloading(false);
      }
      setIdTrx(saveprocess?.data?.id);
      // setModalPaymentPrint(true);
      if (typeadd !== "manual_posting" && typeadd !== "void") {
        setModalPaymentPrint(true);
      } else {
        setModalPaymentPrint(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const GetDataFolio = async () => {
    try {
      let folioID = GetQueryStr("sub_data")
        ? GetQueryStr("sub_data") != ""
          ? GetQueryStr("sub_data")
          : GetQueryStr("data")
        : GetQueryStr("data");

      let getuuri = GLOBALURI + "/folio?folio_id=" + folioID + "";
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
        setdataFolio(data?.data);
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const ResetPath = () => {
    router.replace({
      pathname: window.location.pathname,
      query: {
        parent: new URLSearchParams(window.location.search).get("parent"),
        data: GetQueryStr("data"),
        module: GetQueryStr("module"),
        sub_data: GetQueryStr("sub_data"),
        call: Math.floor(Math.random() * 100),
      },
    });
  };

  useEffect(() => {
    GetDatattbl();

    // });
    // console.log("DATALOG", window.location.pathname.split("/"));
  }, [window.location.search]);

  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {isbtnIcon && (
        <TabMenuIcon actMenu={""} id={GetQueryStr("data")} foliodat={""} />
      )}
      <div className="mt-2 mb-2 flex justify-end gap-4">
        <label className="font-bold self-center">Total Transaction = </label>
        <div
          className="bg-cyan text-white rounded-md mt-1 text-center p-2 w-[100px] font-bold
        "
        >
          {dataTotal}
        </div>
      </div>
      {popup ? (
        <div className="overlay">
          <div
            ref={ref}
            className="w-[60%] overflow-auto relative h-[600px] bg-white rounded-lg z-20 top-[100px] left-[25%]"
          >
            {ContentPopUp(
              new URLSearchParams(window.location.search).get("key")
            )}
          </div>
        </div>
      ) : (
        <>{isPrint ? <>{GuestTrx(GetQueryStr("data"))}</> : RouteInit()}</>
      )}

      {isVoidPinOpen && (
        <div className="overlay">
          <div className="w-[20%] overflow-auto relative bg-white rounded-lg z-20 p-2 items-center justify-center left-[40%] top-[40%]">
            <div className="p-2 font-bold border-b mb-4">
              <h1>Void Authorization</h1>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Insert PIN to Continue Void Transaction
              </p>
            </div>
            <ModalPinComponent
              label="Insert PIN"
              onCheck={(pin: string) => {
                onCheckVoidPin(pin);
              }}
            />
            <div className="flex justify-end mt-4">
              <ButtonSubmit
                label="Cancel"
                isprimary={false}
                onCreate={() => setIsVoidPinOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      {modalPaymentPrint && (
        <div
          ref={ref}
          className="w-[60%] overflow-auto absolute bg-white z-20 top-[100px] left-[25%] p-4 rounded-lg"
        >
          {ModalPaymentPrintComp("")}
        </div>
      )}
      <ModalNotedComponent
        text={datatbl?.folio?.special_instruction?.posting_instruction}
        title="Special Instruction"
        IsOpenModel={IsOpenModalIns}
        ChangeonClose={(e) => {
          setIsOpenModalIns(e);
        }}
      />
    </>
  );
};

export default TrxPageView;
