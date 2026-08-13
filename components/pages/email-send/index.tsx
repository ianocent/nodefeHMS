import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../common/paper/PaperBase";
import InputMain from "../../common/input/InputMain";
import Seo from "../../common/seo";
import { FetchData, GetDecrypt, GetEncrypt, NumberClear } from "../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../context/LayoutContext";
import { usePathname } from "next/navigation";
import { useFormPermission } from "../../../hooks/useFormPermission";
interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, nm, market, source) => void;
  nameinit?: string;
}
const EmailSend = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, nameinit } = props;
  const GLOBALURI = "/cms/email/email-builder";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const { canCreate, canUpdate } = useFormPermission(1089);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const pathname = usePathname();
  const [dataform, setdataform] = useState([
    {
      name: "Status",
      data: [
        {
          label: "Template Email",
          name: "template_name",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Group Email",
          name: "group_email",
          type: "select-multi",
          cols: "col-span-6",
          options: [{}],
          ismulti: false,
        },
        {
          label: "To:",
          name: "to",
          type: "text",
          cols: "col-span-12",
        },
        {
          label: "Subject:",
          name: "subject",
          type: "text",
          cols: "col-span-12",
        },
        {
          label: "Body",
          name: "body",
          type: "rich-editor",
          cols: "col-span-12",
        },
      ],
    },
  ]);

  const GetDetailUser = async (i: any) => {
    // setuiddata(i);
    try {
      let getuuri = "/cms/email/email-send/master";
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
      dataInput[0].data[0].options = datauser?.master?.allTemplate;
      dataInput[0].data[1].options = datauser?.master?.allGroups;
      setdataform([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select-multi") {
      setData({ ...dataval, [name]: e });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else if (type === "rich-editor") {
      setData({ ...dataval, [name]: e });
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
    }
  };

  const transformData = (data) => {
    const newData = { ...data };
    const propertiesToTransform = ["template_name"];

    propertiesToTransform.forEach((property) => {
      if (property == "credit_limit" && newData[property]) {
        newData[property] = NumberClear(newData[property]);
      } else if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const OnSave = async () => {
    try {
      let urisave = "/cms/email/send-mail";
      let mth = "POST";
      const transformedData = transformData(dataval);

      const { no, ...dataToPost } = transformedData;

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
        mth = "PUT";
      }

      const raw = JSON.stringify(dataToPost);
      const aesraw = GetEncrypt(raw);
      var redirects = isPopup ? "" : `${pathname}?parent=83`;
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
        setloading(false);
        ActionSv(
          saveprocess?.data?.id,
          saveprocess?.data?.name,
          [
            saveprocess?.data?.market_segment_1,
            saveprocess?.data?.market_segment_2,
            saveprocess?.data?.market_segment_3,
            saveprocess?.data?.market_segment_4,
          ],
          [saveprocess?.data?.source]
        );
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const [parent, setparent] = useState("0");
  const [idusr, setidusr] = useState("0");

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

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      subject: dataval.template_name?.subject || prev.subject,
      body: dataval.template_name?.body || prev.body,
      to: dataval.group_email?.list || prev.to,
    }));
  }, [dataval.template_name, dataval.group_email]);

  return (
    <>
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
            <div className="col-span-12 ">
              <fieldset className="border">
                <legend className="ml-2">Send Email</legend>
                {datavaled?.account && (
                  <div className="mt-4 ml-2 font-bold ">
                    {datavaled?.account}
                  </div>
                )}

                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-6 mr-2">
                  {dataform[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;
                    // test

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else if (row?.type == "rich-editor") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else {
                      types = row?.type;
                      typesmain = "base";
                    }
                    return (
                      <div className={row?.cols}>
                        <InputMain
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
                          onChangeRichEditor={(e) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                          }}
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                          valueRichEditor={
                            dataval[row?.name] ?? datavaled[row?.name]
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
              <div className="col-span-12 ">
                <fieldset className="border">
                  <legend className="ml-2">Short Code Email</legend>
                  <div className="h-fit gap-4 ml-2 mb-4 mt-6 mr-2">
                    {/*  */}
                    <ul className="list-disc list-inside">
                        <li>[[guestName]]: Shortcode for Guest Name</li>
                        <li>[[companyName]]: Shortcode for Company Name</li>
                        <li>[[reservationStaff]]: Shortcode for Reservation Staff</li>
                        <li>[[folioNumber]]: Shortcode for Folio Number</li>
                        <li>[[roomId]]: Shortcode for Room ID</li>
                        <li>[[checkInDate]]: Shortcode for Check In Date</li>
                        <li>[[checkOutDate]]: Shortcode for Check Out Date</li>
                        <li>[[roomType]]: Shortcode for Room Type</li>
                        <li>[[numberOfGuests]]: Shortcode for Number of Guests</li>
                        <li>[[checkInTime]]: Shortcode for Check-in Time</li>
                        <li>[[hotelAddress]]: Shortcode for Hotel Address</li>
                        <li>[[phoneNumberHotel]]: Shortcode for Phone Number Hotel</li>
                        <li>[[emailHotel]]: Shortcode for Email Hotel</li>
                        <li>[[hotelName]]: Shortcode for Hotel Name</li>
                        <li>[[roomRate]]: Shortcode for Room Rate</li>
                        <li>[[totalAmountBilled]]: Shortcode for Total Amount Billed</li>
                        <li>[[paymentMethod]]: Shortcode for Payment Method</li>
                    </ul>
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
          {/* <ButtonSubmit
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
          /> */}
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
              label="Send Email"
            />
          )}
        </div>

      </div>
    </>
  );
};

export default EmailSend;
