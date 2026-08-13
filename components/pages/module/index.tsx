import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt, GetQueryStr } from "../../helper";
import { useRouter } from "next/router";
import PaperBase from "../../common/paper/PaperBase";
import Seo from "../../common/seo";
import { LayoutContext } from "../../../context/LayoutContext";
import InputMain from "../../common/input/InputMain";
import TableView from "../../common/table-edit";
import TableDrag from "../../common/table-drag";
import DragTblView from "./drag";
import ModuleAdd from "./form";
import Tabs from "../../common/tab";

const ModulePage = () => {
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const router = useRouter();
  const GLOBALURILIST = "/cms/list";
  const GLOBALURICREATEUPDATE = "/cms";
  const [path, setpath] = useState("");
  const [parentid, setparentid] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const layout = useContext(LayoutContext);

  const [initList, setInitList] = useState<any>({});
  const [initCreateUpdate, setInitCreateUpdate] = useState<any>({});

  // Pull from Staah state
  const [pullLoading, setPullLoading] = useState(false);
  const [testConnectionLoading, setTestConnectionLoading] = useState(false);
  const [ariSyncLoading, setAriSyncLoading] = useState(false);
  const [reservationPullLoading, setReservationPullLoading] = useState(false);
  const [reservationImportLoading, setReservationImportLoading] = useState(false);
  const [reservationAckLoading, setReservationAckLoading] = useState(false);
  const [ariDateFrom, setAriDateFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [ariDateTo, setAriDateTo] = useState(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
const [showPullModal, setShowPullModal] = useState(false);
  const [pullData, setPullData] = useState<any>(null);

  // Rates Calendar state
  const [showRatesCalendar, setShowRatesCalendar] = useState(false);
  const [ratesCalendarData, setRatesCalendarData] = useState<any>(null);
  const [ratesCalendarLoading, setRatesCalendarLoading] = useState(false);
  const [rcDateFrom, setRcDateFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [rcDateTo, setRcDateTo] = useState(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [rcRoomTypeId, setRcRoomTypeId] = useState("");
  const [rcRateId, setRcRateId] = useState("");
  const [rcViewMode, setRcViewMode] = useState<"matrix" | "table">("matrix");

  const GetInitList = async (uri: any) => {
    try {
      let uris = uri.split("/");
      let tblid = GetQueryStr("tblid") ? "?tblid=" + GetQueryStr("tblid") : "";
      let getuuri =
        GLOBALURILIST +
        "/" +
        uris[uris.length - 1] +
        tblid +
        (window.location.search ? window.location.search : "");
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
        setInitList(data);
        // console.log(data);
        layout.setBreadcumbs(data?.breadcrumbs);
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const GetInitCreateUpdate = async (uri: any, id: any) => {
    try {
      let uris = uri.split("/");
      let reqapi = GetQueryStr("reqapi")
        ? "?reqapi=" + GetQueryStr("reqapi")
        : "";
      let tblid = GetQueryStr("tblid") ? "?tblid=" + GetQueryStr("tblid") : "";

      let getuuri =
        GLOBALURICREATEUPDATE +
        "/" +
        uris[uris.length - 1] +
        "/create" +
        reqapi +
        tblid;
      if (id) {
        getuuri =
          GLOBALURICREATEUPDATE +
          "/" +
          uris[uris.length - 1] +
          "/" +
          id +
          "/edit" +
          reqapi +
          tblid;
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
        setInitCreateUpdate(data);
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {

    if (GetQueryStr("module") == "tableedit") {
      // console.log("list");
      GetInitList(window.location.pathname);
    } else {
      if (GetQueryStr("data")) {
        // console.log("ed");
        GetInitCreateUpdate(window.location.pathname, GetQueryStr("data"));
      } else if (GetQueryStr("add")) {
        // console.log("add");
        GetInitCreateUpdate(window.location.pathname, false);
      } else {
        // console.log("list");
        GetInitList(window.location.pathname);
      }
    }
    }, [window.location.search, window.location.pathname]);

  // Global window handler for Staah Confirm/Cancel buttons inside raw HTML
  useEffect(() => {
    (window as any).handleStaahConfirm = async (id: number) => {
      try {
        if (!confirm("Confirm this reservation? It will be created in your local HMS folios.")) return;
        
        const raw = JSON.stringify({});
        const aesraw = GetEncrypt(raw);
        const data: any = await FetchData(
          `/cms/staah-reservation/${id}/confirm`,
          "POST",
          aesraw,
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );

        if (data?.code == "200") {
          window.location.reload();
        }
      } catch (e) {
        console.error("Confirm error", e);
      }
    };

    (window as any).handleStaahCancel = async (id: number) => {
      try {
        if (!confirm("Cancel this reservation in Staah?")) return;
        
        const raw = JSON.stringify({});
        const aesraw = GetEncrypt(raw);
        const data: any = await FetchData(
          `/cms/staah-reservation/${id}/cancel`,
          "POST",
          aesraw,
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );

        if (data?.code == "200") {
          window.location.reload();
        }
      } catch (e) {
        console.error("Cancel error", e);
      }
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const guestId = urlParams.get("data");
    if (guestId) {
      setischildren(guestId);
    }
    setparentid(parent);
    setpath(window.location.pathname.split("/")[2]);
  });

  const handlePullFromStaah = async () => {
    setPullLoading(true);
    try {
      const raw = JSON.stringify({});
      const aesraw = GetEncrypt(raw);
      const data: any = await FetchData(
        "/cms/staah-manager/pull",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data?.code == "200") {
        setPullData(data?.data);
        setShowPullModal(true);
        if (data?.warnings && Object.keys(data.warnings).length > 0) {
          const warningMsg = Object.entries(data.warnings)
            .map(([key, msg]) => `${key}: ${msg}`)
            .join('\n');
          alert('Beberapa endpoint Staah gagal:\n' + warningMsg);
        }
      } else {
        alert(data?.message || 'Failed to pull data');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPullLoading(false);
    }
};

  const handleViewRatesCalendar = async () => {
    const staahInterfaceId = GetQueryStr("data");
    if (!staahInterfaceId) {
      alert("Open Staah Manager detail first");
      return;
    }

    setRatesCalendarLoading(true);
    try {
      const raw = JSON.stringify({
        staah_interface_id: staahInterfaceId,
        date_from: rcDateFrom,
        date_to: rcDateTo,
        ...(rcRoomTypeId ? { room_type_id: rcRoomTypeId } : {}),
        ...(rcRateId ? { rate_id: rcRateId } : {}),
      });
      const aesraw = GetEncrypt(raw);
      const data: any = await FetchData(
        "/cms/staah-manager/rates-calendar",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (data?.code == "200") {
        setRatesCalendarData(data?.data);
        setShowRatesCalendar(true);
      } else {
        alert(data?.message || "Failed to fetch rates calendar");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch rates calendar");
    } finally {
      setRatesCalendarLoading(false);
    }
  };

  // Auto-refetch when filters change (only when modal is open)
  useEffect(() => {
    if (!showRatesCalendar) return;
    handleViewRatesCalendar();
  }, [showRatesCalendar, rcDateFrom, rcDateTo, rcRoomTypeId, rcRateId]);

  const handleTestStaahConnection = async () => {
    setTestConnectionLoading(true);
    try {
      const raw = JSON.stringify({});
      const aesraw = GetEncrypt(raw);
      const data: any = await FetchData(
        "/cms/staah-manager/test-connection",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (data?.code == "200") {
        console.log("✅ Staah connection successful", data);
      } else {
        const message = data?.data?.message || data?.message || "Staah connection failed";
        console.error("❌ Staah connection failed:", message);
      }
    } catch (error) {
      console.error("❌ Staah connection error:", error);
    } finally {
      setTestConnectionLoading(false);
    }
  };

  const handleForceSyncFromStaah = async () => {
    const staahInterfaceId = GetQueryStr("data");
    if (!staahInterfaceId) {
      alert("Open Staah Manager detail first");
      return;
    }

    if (!confirm("This will FORCE DELETE existing local room & rate mappings and re-pull them fresh from Staah. Continue?")) {
      return;
    }

    setPullLoading(true);
    try {
      const raw = JSON.stringify({ staah_interface_id: staahInterfaceId });
      const aesraw = GetEncrypt(raw);
      const data: any = await FetchData(
        "/cms/staah-manager/sync-from-staah",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (data?.code == "200") {
        alert(data?.message || "Sync from Staah dispatched successfully. Mappings will be refreshed.");
        window.location.reload();
      } else {
        alert(data?.message || "Failed to dispatch Sync from Staah");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to dispatch Sync from Staah");
    } finally {
      setPullLoading(false);
    }
  };

  const handleSyncStaahAvailability = async () => {
    const staahInterfaceId = GetQueryStr("data");
    if (!staahInterfaceId) {
      alert("Open Staah Manager detail first");
      return;
    }

    if (!ariDateFrom || !ariDateTo || ariDateTo < ariDateFrom) {
      alert("Invalid ARI date range");
      return;
    }

    setAriSyncLoading(true);
    try {
      const raw = JSON.stringify({
        staah_interface_id: staahInterfaceId,
        date_from: ariDateFrom,
        date_to: ariDateTo,
      });
      const aesraw = GetEncrypt(raw);
      const data: any = await FetchData(
        "/cms/staah-manager/sync-availability",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (data?.code == "200") {
        alert("Staah ARI sync dispatched");
      } else {
        alert(data?.message || "Failed to dispatch Staah ARI sync");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to dispatch Staah ARI sync");
    } finally {
      setAriSyncLoading(false);
    }
  };

  const handlePullStaahReservations = async () => {
    const staahInterfaceId = GetQueryStr("data");
    if (!staahInterfaceId) {
      alert("Open Staah Manager detail first");
      return;
    }

    setReservationPullLoading(true);
    try {
      const raw = JSON.stringify({ staah_interface_id: staahInterfaceId });
      const aesraw = GetEncrypt(raw);
      const data: any = await FetchData(
        "/cms/staah-manager/pull-reservations",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (data?.code == "200") {
        alert("Staah reservation pull dispatched");
      } else {
        alert(data?.message || "Failed to dispatch Staah reservation pull");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to dispatch Staah reservation pull");
    } finally {
      setReservationPullLoading(false);
    }
  };

  const postStaahReservationBulkAction = async (endpoint: string, successMessage: string, setLoading: (value: boolean) => void) => {
    const staahInterfaceId = GetQueryStr("data");
    if (!staahInterfaceId) {
      alert("Open Staah Manager detail first");
      return;
    }

    setLoading(true);
    try {
      const raw = JSON.stringify({ staah_interface_id: staahInterfaceId });
      const aesraw = GetEncrypt(raw);
      const data: any = await FetchData(
        endpoint,
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (data?.code == "200") {
        alert(successMessage);
      } else {
        alert(data?.message || successMessage + " failed");
      }
    } catch (error) {
      console.log(error);
      alert(successMessage + " failed");
    } finally {
      setLoading(false);
    }
  };

  const renderMappingTable = (title: string, items: any[], summary: any) => {
    if (!items || items.length === 0) return null;
    const matched = items.filter((item: any) => item.status === "matched");
    const unmatched = items.filter((item: any) => item.status === "unmatched");

    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <div className="flex gap-4 mb-3 text-sm">
          <span className="text-green-600 font-semibold">✓ Matched: {summary?.matched || 0}</span>
          <span className="text-red-600 font-semibold">✗ Unmatched: {summary?.unmatched || 0}</span>
          <span className="text-gray-600">Total: {summary?.total || 0}</span>
        </div>
        
        {unmatched.length > 0 && (
          <div className="mb-3">
            <h4 className="font-semibold text-red-600 mb-2">Unmatched (Perlu Mapping Manual)</h4>
            <table className="w-full border-collapse border border-red-300 text-sm">
              <thead>
                <tr className="bg-red-100">
                  <th className="border border-red-300 px-3 py-2 text-left">Staah ID</th>
                  <th className="border border-red-300 px-3 py-2 text-left">Staah Name</th>
                  <th className="border border-red-300 px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {unmatched.map((item: any, idx: number) => (
                  <tr key={idx} className="bg-red-50">
                    <td className="border border-red-200 px-3 py-2">{item.staah_id}</td>
                    <td className="border border-red-200 px-3 py-2">{item.staah_name}</td>
                    <td className="border border-red-200 px-3 py-2 text-red-600 font-semibold">Unmatched</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {matched.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-600 mb-2">Matched (Auto-Mapped)</h4>
            <table className="w-full border-collapse border border-green-300 text-sm">
              <thead>
                <tr className="bg-green-100">
                  <th className="border border-green-300 px-3 py-2 text-left">Staah ID</th>
                  <th className="border border-green-300 px-3 py-2 text-left">Staah Name</th>
                  <th className="border border-green-300 px-3 py-2 text-left">Local ID</th>
                  <th className="border border-green-300 px-3 py-2 text-left">Local Name</th>
                  <th className="border border-green-300 px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {matched.map((item: any, idx: number) => (
                  <tr key={idx} className="bg-green-50">
                    <td className="border border-green-200 px-3 py-2">{item.staah_id}</td>
                    <td className="border border-green-200 px-3 py-2">{item.staah_name}</td>
                    <td className="border border-green-200 px-3 py-2">{item.local_id}</td>
                    <td className="border border-green-200 px-3 py-2">{item.local_name}</td>
                    <td className="border border-green-200 px-3 py-2 text-green-600 font-semibold">Matched</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <Tabs active={path} idparent={parentid} ischildren={ischildren} />
      {(GetQueryStr("data") || GetQueryStr("add")) && GetQueryStr("module") != "tableedit" && (
        <>
          {window.location.pathname.includes("staah-manager") && GetQueryStr("data") && (
            <div className="flex justify-end items-end gap-2 mb-3">
              {/* <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">ARI From</label>
                <input
                  type="date"
                  value={ariDateFrom}
                  onChange={(e) => setAriDateFrom(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">ARI To</label>
                <input
                  type="date"
                  value={ariDateTo}
                  onChange={(e) => setAriDateTo(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div> */}
              {/* <button
                onClick={handleSyncStaahAvailability}
                disabled={ariSyncLoading}
                style={{
                  backgroundColor: ariSyncLoading ? '#9CA3AF' : '#7C3AED',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '2px solid #6D28D9',
                }}
              >
                {ariSyncLoading ? "Syncing ARI..." : "Sync ARI to Staah"}
              </button> */}
              {/* <button
                onClick={handlePullStaahReservations}
                disabled={reservationPullLoading}
                style={{
                  backgroundColor: reservationPullLoading ? '#9CA3AF' : '#EA580C',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '2px solid #C2410C',
                }}
              >
                {reservationPullLoading ? "Pulling Reservations..." : "Pull Reservations"}
              </button> */}
              {/* <button
                onClick={handleForceSyncFromStaah}
                disabled={pullLoading}
                style={{
                  backgroundColor: pullLoading ? '#9CA3AF' : '#EAB308',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '2px solid #CA8A04',
                }}
              >
                {pullLoading ? "Syncing..." : "Force Sync from Staah"}
              </button> */}
              {/* <button
                onClick={() => postStaahReservationBulkAction("/cms/staah-reservation/import-ready", "Ready reservations import dispatched", setReservationImportLoading)}
                disabled={reservationImportLoading}
                style={{
                  backgroundColor: reservationImportLoading ? '#9CA3AF' : '#0F766E',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  border: '2px solid #0F766E',
                }}
              >
                {reservationImportLoading ? "Importing Ready..." : "Import Ready"}
              </button> */}
              {/* <button
                onClick={() => postStaahReservationBulkAction("/cms/staah-reservation/acknowledge-ready", "Reservation notifications acknowledged", setReservationAckLoading)}
                disabled={reservationAckLoading}
                style={{
                  backgroundColor: reservationAckLoading ? '#9CA3AF' : '#4F46E5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  border: '2px solid #4338CA',
                }}
>
                {reservationAckLoading ? "Acknowledging..." : "Ack Notifications"}
              </button> */}
              <button
                onClick={handleViewRatesCalendar}
                disabled={ratesCalendarLoading}
                style={{
                  backgroundColor: ratesCalendarLoading ? '#9CA3AF' : '#0D9488',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  border: '2px solid #0F766E',
                }}
              >
                {ratesCalendarLoading ? "Loading..." : "View Rates Calendar"}
              </button>
            </div>
          )}
          {initCreateUpdate?.form && (
            <>
              <ModuleAdd data={initCreateUpdate} />
            </>
          )}
        </>
      )}
      {GetQueryStr("module") == "tableedit" || (!GetQueryStr("data") && !GetQueryStr("add") && initList?.uriTable ) ? (
        <>
          <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-12 grid grid-cols-12 h-fit  gap-4">
              <div className="col-span-12">
                <fieldset className="border">
                  {/* <legend className="ml-2">{""}</legend> */}
                  <div
                    key={window.location.pathname}
                    className="mt-2 w-full table-auto"
                  >
                    {(initList?.typeTable == "table" ||
                      initList?.typeTable == "tableedit") && (
                      <>
                        {/* Pull from Staah button - inside card for staah-manager */}
                        {window.location.pathname.includes("staah-manager") && (
                          <div className="flex justify-end gap-2 mb-3">
                            <button
                              onClick={handleTestStaahConnection}
                              disabled={testConnectionLoading || pullLoading}
                              style={{
                                backgroundColor: testConnectionLoading ? '#9CA3AF' : '#2563EB',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '2px solid #1D4ED8',
                              }}
                              onMouseEnter={(e) => {
                                if (!testConnectionLoading && !pullLoading) e.currentTarget.style.backgroundColor = '#1D4ED8';
                              }}
                              onMouseLeave={(e) => {
                                if (!testConnectionLoading && !pullLoading) e.currentTarget.style.backgroundColor = '#2563EB';
                              }}
                            >
                              {testConnectionLoading ? (
                                <>
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Testing...
                                </>
                              ) : (
                                "Test Connection"
                              )}
                            </button>
                            <button
                              onClick={handlePullFromStaah}
                              disabled={pullLoading || testConnectionLoading}
                              style={{
                                backgroundColor: pullLoading ? '#9CA3AF' : '#16A34A',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '2px solid #15803D',
                              }}
                              onMouseEnter={(e) => {
                                if (!pullLoading) e.currentTarget.style.backgroundColor = '#15803D';
                              }}
                              onMouseLeave={(e) => {
                                if (!pullLoading) e.currentTarget.style.backgroundColor = '#16A34A';
                              }}
                            >
                              {pullLoading ? (
                                <>
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Pulling...
                                </>
                              ) : (
                                "Pull from Staah"
                              )}
                            </button>
                            <button
                              onClick={handleViewRatesCalendar}
                              disabled={pullLoading || testConnectionLoading}
                              style={{
                                backgroundColor: '#0D9488',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '2px solid #0F766E',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#0F766E';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#0D9488';
                              }}
                            >
                              View Rates
                            </button>
                          </div>
                        )}
                        <TableView
                          groups={""}
                          uri={initList?.uriTable ?? ""}
                          isEditTable={
                            initList?.typeTable == "tabledrag"
                              ? false
                              : initList?.typeTable == "table"
                              ? false
                              : true
                          }
                          // isDrag={initList?.isDrag ?? false}
                        />
                      </>
                    )}
                    {initList?.typeTable == "tabledrag" && (
                      <>
                        <DragTblView uri={initList?.uriTable ?? ""} />
                      </>
                    )}
                    {/* {initCreateUpdate?.} */}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-12 h-fit gap-4 ">
          </div>
        </>
      )}

      {/* Pull from Staah Modal */}
      {window.location.pathname.includes("staah-manager") && showPullModal && pullData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">Staah Sync Results</h2>
              <button
                onClick={() => setShowPullModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {renderMappingTable("Properties", pullData.properties, pullData.summary?.properties)}
              {renderMappingTable("Room Types", pullData.rooms, pullData.summary?.rooms)}
              {renderMappingTable("Rate Plans", pullData.rates, pullData.summary?.rates)}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPullModal(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rates Calendar Modal */}
      {window.location.pathname.includes("staah-manager") && showRatesCalendar && ratesCalendarData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold">Rates Calendar</h2>
                {ratesCalendarData.last_sync && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last ARI Sync: {ratesCalendarData.last_sync.synced_at} ({ratesCalendarData.last_sync.status})
                    {ratesCalendarData.last_sync.date_from && ` — ${ratesCalendarData.last_sync.date_from} to ${ratesCalendarData.last_sync.date_to}`}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowRatesCalendar(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Filters */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1">Date From</label>
                    <input
                      type="date"
                      value={rcDateFrom}
                      onChange={(e) => setRcDateFrom(e.target.value)}
                      className="border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1">Date To</label>
                    <input
                      type="date"
                      value={rcDateTo}
                      onChange={(e) => setRcDateTo(e.target.value)}
                      className="border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1">Room Type</label>
                    <select
                      value={rcRoomTypeId}
                      onChange={(e) => setRcRoomTypeId(e.target.value)}
                      className="border rounded px-3 py-2 text-sm"
                    >
                      <option value="">All Room Types</option>
                      {ratesCalendarData.room_types.map((rt: any) => (
                        <option key={rt.id} value={rt.id}>{rt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1">Rate Plan</label>
                    <select
                      value={rcRateId}
                      onChange={(e) => setRcRateId(e.target.value)}
                      className="border rounded px-3 py-2 text-sm"
                    >
                      <option value="">All Rates</option>
                      {ratesCalendarData.rates.map((r: any) => (
                        <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleViewRatesCalendar}
                    disabled={ratesCalendarLoading}
                    className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 disabled:bg-gray-400"
                  >
                    {ratesCalendarLoading ? "Loading..." : "Refresh"}
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs font-semibold">View:</span>
                    <button
                      onClick={() => setRcViewMode("matrix")}
                      className={`px-3 py-1 text-xs rounded ${rcViewMode === "matrix" ? "bg-teal-600 text-white" : "bg-gray-200"}`}
                    >
                      Matrix
                    </button>
                    <button
                      onClick={() => setRcViewMode("table")}
                      className={`px-3 py-1 text-xs rounded ${rcViewMode === "table" ? "bg-teal-600 text-white" : "bg-gray-200"}`}
                    >
                      Table
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">{ratesCalendarData.summary.total_dates}</div>
                  <div className="text-xs text-blue-600">Dates</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{ratesCalendarData.summary.total_room_types}</div>
                  <div className="text-xs text-green-600">Room Types</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">{ratesCalendarData.summary.total_rates}</div>
                  <div className="text-xs text-purple-600">Rate Plans</div>
                </div>
                <div className={`border rounded p-3 text-center ${ratesCalendarData.summary.empty_cells > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                  <div className={`text-2xl font-bold ${ratesCalendarData.summary.empty_cells > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                    {ratesCalendarData.summary.filled_cells} / {ratesCalendarData.summary.filled_cells + ratesCalendarData.summary.empty_cells}
                  </div>
                  <div className={`text-xs ${ratesCalendarData.summary.empty_cells > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    Filled ({ratesCalendarData.summary.empty_cells > 0 ? `${ratesCalendarData.summary.empty_cells} empty` : 'Complete'})
                  </div>
                </div>
              </div>

              {rcViewMode === "matrix" ? (
                /* MATRIX VIEW - per room type */
                <div className="space-y-6">
                  {Object.entries(ratesCalendarData.grid).map(([roomTypeId, roomData]: [string, any]) => (
                    <div key={roomTypeId} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 font-bold text-sm flex justify-between items-center">
                        <span>{roomData.room_type.name}</span>
                        {roomData.room_type.staah_room_id && (
                          <span className="text-xs text-gray-500">Staah ID: {roomData.room_type.staah_room_id}</span>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border px-2 py-2 text-left sticky left-0 bg-gray-50 z-10 min-w-[120px]">Rate Plan</th>
                              {ratesCalendarData.dates.map((date: string) => (
                                <th key={date} className="border px-2 py-2 text-center min-w-[80px]">
                                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(roomData.rates).map(([rateId, rateData]: [string, any]) => (
                              <tr key={rateId}>
                                <td className="border px-2 py-2 font-medium sticky left-0 bg-white z-10">
                                  <div>{rateData.rate.name}</div>
                                  {rateData.rate.staah_rate_plan_id && (
                                    <div className="text-gray-400">{rateData.rate.staah_rate_plan_id}</div>
                                  )}
                                </td>
                                {ratesCalendarData.dates.map((date: string) => {
                                  const cell = rateData.dates[date];
                                  if (!cell || !cell.has_data) {
                                    return (
                                      <td key={date} className="border px-2 py-2 text-center bg-gray-50 text-gray-300">
                                        —
                                      </td>
                                    );
                                  }
                                  if (cell.stop_sell) {
                                    return (
                                      <td key={date} className="border px-2 py-2 text-center bg-red-100">
                                        <span className="text-red-700 font-bold">Closed</span>
                                      </td>
                                    );
                                  }
                                  const restrictions: string[] = [];
                                  if (cell.stop_arrival) restrictions.push('✗ Arr');
                                  if (cell.stop_departure) restrictions.push('✗ Dep');
                                  if (cell.min_night > 1) restrictions.push(`Min ${cell.min_night}n`);
                                  if (cell.max_night < 14) restrictions.push(`Max ${cell.max_night}n`);

                                  return (
                                    <td key={date} className="border px-1 py-0.5 text-center bg-green-50">
                                      <div className="font-bold text-green-800">
                                        {cell.two_adult > 0 ? cell.two_adult.toLocaleString() : cell.one_adult.toLocaleString()}
                                      </div>
                                      {restrictions.length > 0 && (
                                        <div className="text-[10px] text-gray-500">{restrictions.join(' · ')}</div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* TABLE VIEW - flat list of all rate entries */
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-3 py-2 text-left">Date</th>
                          <th className="border px-3 py-2 text-left">Room Type</th>
                          <th className="border px-3 py-2 text-left">Rate</th>
                          <th className="border px-3 py-2 text-right">1 Adult</th>
                          <th className="border px-3 py-2 text-right">2 Adult</th>
                          <th className="border px-3 py-2 text-right">Extra Adult</th>
                          <th className="border px-3 py-2 text-right">Extra Child</th>
                          <th className="border px-3 py-2 text-center">Min N</th>
                          <th className="border px-3 py-2 text-center">Max N</th>
                          <th className="border px-3 py-2 text-center">Stop Sell</th>
                          <th className="border px-3 py-2 text-center">Stop Arr</th>
                          <th className="border px-3 py-2 text-center">Stop Dep</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const rows: any[] = [];
                          Object.entries(ratesCalendarData.grid).forEach(([roomTypeId, roomData]: [string, any]) => {
                            Object.entries(roomData.rates).forEach(([rateId, rateData]: [string, any]) => {
                              ratesCalendarData.dates.forEach((date: string) => {
                                const cell = rateData.dates[date];
                                if (cell && cell.has_data) {
                                  rows.push({
                                    date,
                                    roomType: roomData.room_type.name,
                                    rate: rateData.rate.name,
                                    staah_room_id: roomData.room_type.staah_room_id,
                                    staah_rate_plan_id: rateData.rate.staah_rate_plan_id,
                                    ...cell,
                                  });
                                }
                              });
                            });
                          });
                          return rows.map((row, idx) => (
                            <tr key={idx} className={row.stop_sell ? 'bg-red-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="border px-3 py-2 font-medium">{row.date}</td>
                              <td className="border px-3 py-2">{row.roomType}</td>
                              <td className="border px-3 py-2">
                                <div>{row.rate}</div>
                                {row.staah_rate_plan_id && (
                                  <span className="text-gray-400">{row.staah_rate_plan_id}</span>
                                )}
                              </td>
                              <td className="border px-3 py-2 text-right font-mono">{row.one_adult.toLocaleString()}</td>
                              <td className="border px-3 py-2 text-right font-mono font-bold">{row.two_adult.toLocaleString()}</td>
                              <td className="border px-3 py-2 text-right font-mono">{row.extra_adult.toLocaleString()}</td>
                              <td className="border px-3 py-2 text-right font-mono">{row.extra_child.toLocaleString()}</td>
                              <td className="border px-3 py-2 text-center">{row.min_night}</td>
                              <td className="border px-3 py-2 text-center">{row.max_night}</td>
                              <td className="border px-3 py-2 text-center">
                                {row.stop_sell ? <span className="text-red-600 font-bold">YES</span> : '—'}
                              </td>
                              <td className="border px-3 py-2 text-center">
                                {row.stop_arrival ? <span className="text-orange-600 font-bold">YES</span> : '—'}
                              </td>
                              <td className="border px-3 py-2 text-center">
                                {row.stop_departure ? <span className="text-orange-600 font-bold">YES</span> : '—'}
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-xs font-bold mb-2">Legend</h4>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-green-50 border border-green-300 rounded"></span>
                    <span>Available with price</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-100 border border-red-300 rounded"></span>
                    <span>Stop Sell / Closed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></span>
                    <span>No data (empty)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">✗ Arr</span>
                    <span>Closed on Arrival</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">✗ Dep</span>
                    <span>Closed on Departure</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleViewRatesCalendar}
                  disabled={ratesCalendarLoading}
                  className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 disabled:bg-gray-400"
                >
                  {ratesCalendarLoading ? "Refreshing..." : "Refresh Data"}
                </button>
                <button
                  onClick={() => setShowRatesCalendar(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModulePage;
