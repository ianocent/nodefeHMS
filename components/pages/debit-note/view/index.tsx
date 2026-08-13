import React, { useEffect, useState } from "react";
import PaperBase from "../../../../components/common/paper/PaperBase";
import Seo from "../../../../components/common/seo";
import { useRouter } from "next/router";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
  GetQueryParam,
  GetQueryStr,
  GFormatDate,
  isStringJSON,
  GetEncrypt
} from "../../../../components/helper";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
import TableView from "../../../../components/common/table-edit";
import { useTransactionPermission } from "../../../../hooks/useFormPermission";

const InvoiceView = () => {
  const FOLDER = "accounting/debit-note";
  const FOLDERUPDATESTATUS = "/cms/accounting/debit-note/update-status";
  const routers = useRouter();
  const GLOBALURI = "/cms/allocation-history";
  const [loading, setloading] = useState(false);
  const [idusr, setidusr] = useState("0");
  const [statusAccounting, setstatusAccounting] = useState("2");
  const groups = "";
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [data, setData] = useState<any>({});
  const canProcess = useTransactionPermission("processed_debitNote");
  const canCancel = useTransactionPermission("cancel_debitNote");

  const GetDetailUser = async (i: any) => {
    try {
      const datauser = await FetchData(
        "/cms/" + FOLDER + "/" + i + "",
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        routers,
        ""
      );
      setData(datauser);
      setstatusAccounting(datauser?.data?.status_accounting?.value);
      return datauser;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const updateStatus = async (status: any) => {
    try {
      setloading(true);
      let urisave = FOLDERUPDATESTATUS;
      let mth = "POST";

      const raw = JSON.stringify({
        id: GetQueryStr("data"),
        status_accounting: status,
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
        setloading(false);
        GetDetailUser(GetQueryStr("data"));
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };

  useEffect(() => {
    const idreq = GetQueryParam(2);
    GetDetailUser(GetQueryStr("data"));

    // alert(routers.query.id);
  }, []);
  return (
    <>
      <Seo title="Management View Invoice" />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold">View Data</h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <ButtonSubmit
              isprimary={false}
              onCreate={() => {
                routers.replace({
                  pathname: window.location.pathname,
                  query: {
                    parent: GetQueryStr("parent"),
                    module: GetQueryStr("module"),
                  },
                });
              }}
              label="Close"
            />
          </div>
          <div className="flex gap-4">
            <ButtonSubmit
              isprimary={false}
              onCreate={() => {
                // routers.push(window.location.href, {});
              }}
              label="Print"
            />
          </div>
          {statusAccounting == "2" && (
            <>
            {canProcess && (
              <>
                <div className="flex gap-4">
                  <ButtonSubmit
                    isprimary={false}
                    onCreate={() => {
                      updateStatus("processed");
                    }}
                    label="Processed"
                  />
                </div>  
              </>
            )}
            {canCancel && (
              <>
                <div className="flex gap-4">
                  <ButtonSubmit
                    isprimary={false}
                    onCreate={() => {
                      updateStatus("canceled");
                    }}
                    label="Canceled"
                  />
                </div>
              </>
            )}
            </>
          )}
         
        
        </div>
        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2 mb-4">
            <div className="col-span-6">
              <fieldset>
                <legend>Status</legend>
                <div>
                  <div className="col-span-12 grid grid-cols-12 h-fit  gap-2 mt-4 p-2">
                    <div className="col-span-6 underline font-bold">
                      Invoice
                    </div>
                    <div className="col-span-6">{data?.data?.no_docs}</div>
                    <div className="col-span-6 underline font-bold">
                      Doc Date
                    </div>
                    <div className="col-span-6">
                      {GFormatDate(data?.data?.date)}
                    </div>
                    <div className="col-span-6 underline font-bold">Status</div>
                    <div className="col-span-6">
                      {data?.data?.status_accounting?.label}
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="col-span-6">
              <fieldset>
                <legend>Billing Address</legend>
                <div>
                  <div className="col-span-12 grid grid-cols-12 h-fit  gap-2 mt-4 p-2">
                    <div className="col-span-12">
                      <div className="underline font-bold">Address</div>
                      <div>{data?.data?.debtor?.billing_address}</div>
                    </div>
                    <div className="col-span-6">
                      <div className="underline font-bold">Region</div>
                      <div>{data?.data?.debtor?.billing_region?.label}</div>
                    </div>
                    <div className="col-span-6">
                      <div className="underline font-bold">Country</div>
                      <div>{data?.data?.debtor?.billing_country?.label}</div>
                    </div>
                    <div className="col-span-6">
                      <div className="underline font-bold">City</div>
                      <div>{data?.data?.debtor?.billing_city?.label}</div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="col-span-6">
              <fieldset>
                <legend>Company</legend>
                <div>
                  <div className="col-span-12 grid grid-cols-12 h-fit  gap-2 mt-4 p-2">
                    <div className="col-span-6 underline font-bold">Name</div>
                    <div className="col-span-6">{data?.data?.debtor?.name}</div>
                    <div className="col-span-6 underline font-bold">Amount</div>
                    <div className="col-span-6">{data?.data?.amount}</div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="col-span-6">
              <fieldset>
                <legend>Reference</legend>
                <div>
                  <div className="col-span-12 grid grid-cols-12 h-fit  gap-2 mt-4 p-2">
                    <div className="col-span-6">
                      <div className="col-span-6">
                        <div className="underline font-bold">Source</div>
                        <div>{data?.data?.source}</div>
                      </div>
                      <div className="col-span-6">
                        <div className="underline font-bold">Reference</div>
                        <div>{data?.data?.reference}</div>
                      </div>
                      <div className="col-span-6">
                        <div className="underline font-bold">Booking</div>
                        <div>{data?.data?.booking}</div>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="col-span-12">
                        <div className="underline font-bold">Description</div>
                        <div>{data?.data?.description_accounting}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="col-span-12">
              <fieldset>
                <legend>Allocation</legend>
                <div>
                    <div className="mt-2 min-w-full table-auto">
                      <TableView
                        groups={groups}
                        queryString={"&accounting_id=" + GetQueryStr("data")}
                        uri={GLOBALURI}
                        isEditTable={true}
                        isBtnAdd={true}
                      />
                    </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {/* <ButtonAddInput
          activeStep={0}
          next={nextStep}
          previous={previousStep}
          stepper={0}
        /> */}
    </>
  );
};

export default InvoiceView;
