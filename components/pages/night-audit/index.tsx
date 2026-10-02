import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import TableErrorState from "../../common/table/TableErrorState";
import {
    GetDecrypt,
    GetQueryStr,
    GFormatDate
} from "../../../components/helper";
import { useFormPermission } from "../../../hooks/useFormPermission";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import LoadInPage from "../../common/loader/LoadInpage";
import { FetchData } from "../../helper";

const ListView = () => {
  const GLOBALURI = "/cms/shift-confirmation";
  const groups = "";
  const { isLogin } = useSelector((state: any) => state?.auth);
  const dispatch = useDispatch();
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [loading, setloading] = useState(false);
  const [dataDate, setdataDate] = useState("-1");
  // Audit date is fetched client side; keep the page in a loading state so the
  // "-1" placeholder never renders as a real empty result.
  const [detailLoading, setdetailLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { canCreate, canUpdate } = useFormPermission(1027);
  const router = useRouter();
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
    if (GetQueryStr("add") == "1") {
      router.push({
        pathname: "/endshift",
        query: { data: GetQueryStr("data") },
      });
    }
  }, [window.location.search]);

  const onSave = async () => {
    try {
      let urisave = "/cms/night-audit/check-audit?date=" + dataDate;
      let mth = "POST";

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
        // localStorage.setItem("data", GetEncrypt(JSON.stringify(saveprocess)));
        // dispatch(setLogin(GetEncrypt(JSON.stringify(saveprocess))));
        setTimeout(() => {
          Router.push("/end-of-day");
        }, 2000);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
    }
  };
  const GetDataDetail = async () => {
    try {
      let getuuri = "/cms/night-audit/audit";
      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data === false || data?.code != "200" || !data?.data?.date) {
        // `dataDate` feeds `&date=` on all five grids below. Leaving it at the
        // "-1" placeholder makes every grid query a non-existent business date,
        // which renders as "Not Data" — indistinguishable from "zero overstays".
        setLoadError(
          "Gagal memuat tanggal audit. Kelima tabel di bawah tidak dapat querying tanggal yang benar."
        );
        return;
      }
      setLoadError(null);
      setdataDate(data?.data?.date);

      return;
    } catch (error) {
      setLoadError("Gagal memuat tanggal audit. Kelima tabel di bawah tidak dapat querying tanggal yang benar.");
      console.log(error);
      return;
    } finally {
      // Gate the empty-state behind the request, otherwise `dataDate` still
      // holds its "-1" placeholder and "No Data Available" flashes first.
      setdetailLoading(false);
    }
  };
  function RouteInit() {
    return (
      <>
        {GetQueryStr("add") != "1" ? (
          loadError ? (
            <TableErrorState message={loadError} onRetry={GetDataDetail} />
          ) : (
            <>
            <div className="mt-2 min-w-full table-auto">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 xl:col-span-6 overflow-auto max-h-[400px]">
                  <fieldset>
                    <legend>Shift - {GFormatDate(dataDate)}</legend>
                    <div className="mt-4">
                    <TableView
                      groups={groups}
                      uri={"/cms/night-audit/shift"}
                      queryString={"&date=" + dataDate}
                      isEditTable={true}
                      isBtnView={false}
                      isBtnAdd={false}
                      isBtnDelete={false}
                      isBtnEdit={false}
                    />
                    </div>
                  </fieldset>
                </div>
                <div className="col-span-12 xl:col-span-6 overflow-auto max-h-[400px]">
                  <fieldset>
                    <legend>Room Change - {GFormatDate(dataDate)}</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/night-audit/room-change"}
                        queryString={
                          "&date=" +
                          dataDate +
                          "&audit_type=room-change&night_audit=1"
                        }
                        isEditTable={true}
                        isAdvance={true}
                        isNAudit={true}
                        NAuditCode="room-change"
                      />
                    </div>
                  </fieldset>
                </div>
                <div className="col-span-12 xl:col-span-6 overflow-auto max-h-[400px]">
                  <fieldset>
                    <legend>No Show - {GFormatDate(dataDate)}</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/night-audit/no-show"}
                        queryString={
                          "&date=" +
                          dataDate +
                          "&audit_type=no-show&night_audit=1"
                        }
                        isEditTable={true}
                        isAdvance={true}
                        isNAudit={true}
                        NAuditCode="no-show"
                      />
                    </div>
                  </fieldset>
                </div>
                <div className="col-span-12 xl:col-span-6 overflow-auto max-h-[400px] ">
                  <fieldset>
                    <legend>Over Stay - {GFormatDate(dataDate)}</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/night-audit/over-stay"}
                        queryString={
                          "&date=" +
                          dataDate +
                          "&audit_type=over-stay&night_audit=1"
                        }
                        isEditTable={true}
                        isAdvance={true}
                        isNAudit={true}
                        NAuditCode="over-stay"
                      />
                    </div>
                  </fieldset>
                </div>
                <div className="col-span-12 xl:col-span-12 overflow-auto max-h-[400px] ">
                  <fieldset>
                    <legend>User Online- {GFormatDate(dataDate)}</legend>
                    <div className="mt-4">
                      <TableView
                        groups={groups}
                        uri={"/cms/user/online"}
                        queryString={
                          "&date=" +
                          dataDate +
                          "&audit_type=over-stay&night_audit=1"
                        }
                        isEditTable={false}
                        isAdvance={false}
                        isNAudit={false}
                        NAuditCode="over-stay"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
              <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
                {/* <ButtonSubmit
              onCreate={() => {
                setloading(true);
                router.replace({
                  pathname: "",
                  query: {
                    parent: GetQueryStr("parent"),
                  },
                });
              }}
              loading={loading}
              label="Cancel"
              isprimary={false}
            /> */}

                <ButtonSubmit
                  isBtnAdd={canCreate || canUpdate}
                  onCreate={() => {
                    setloading(true);
                    onSave();
                  }}
                  loading={loading}
                  label="Submit"
                />
              </div>
            </div>
            </>
          )
        ) : (
          <></>
        )}
      </>
    );
  }
  useEffect(() => {
    GetDataDetail();
  }, []);
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {detailLoading ? (
        <LoadInPage variant="block" />
      ) : dataDate != "-1" ? (
        RouteInit()
      ) : (
        "No Data Available"
      )}
    </>
  );
};

export default ListView;
