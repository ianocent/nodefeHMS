import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import { useRouter } from "next/router";
import TableReport from "../../components/common/table-report";
import ReportPermission from "../../components/pages/report-permision";
import { useSelector } from "react-redux";
import {
  FetchData,
  GetDecrypt,
  GetQueryParam,
  GetQueryStr,
} from "../../components/helper";

const Reporting = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const [module, setmodule] = useState("");
  const [data, setData] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const result = await FetchData(
        `/cms/report-permission/permission`,
        "GET",
        null,
        false,
        datalocal?.data?.access_token,
        "",
        ""
      );

      if (result && result.data) {
        var datas: [] = result.data ?? [];
        setDataAll(datas);
        console.log("param", GetQueryParam(1));
        const findData = datas.filter(
          (arr: any) => arr?.group === GetQueryParam(1)
        );
        console.log("dataparam", findData);
        setData(findData);
      }
    } catch (error) {
      console.error("Error fetching batch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dataAfterNight = [
    { batch_name: "daily-statistic", url: "/cms/report/batch/after-night-audit/daily-statistic" },
    { batch_name: "in-house-folio-balance", url: "/cms/report/batch/after-night-audit/in-house-foliobal" },
    { batch_name: "vacant-rooms", url: "/cms/report/batch/after-night-audit/vacant-rooms" },
    { batch_name: "no-show", url: "/cms/report/batch/after-night-audit/no-show" },
    { batch_name: "reservations-with-deposit-balances", url: "/cms/report/batch/after-night-audit/on-resbal" },
    { batch_name: "room-division", url: "/cms/report/batch/after-night-audit/room-division" },
    { batch_name: "nationality-statistic", url: "/cms/report/batch/after-night-audit/nationality-statistic" },
    { batch_name: "roomtype-utilization", url: "/cms/report/batch/after-night-audit/roomtype-utilization" },
    { batch_name: "daily-room-forecast", url: "/cms/report/batch/after-night-audit/daily-room-forecast" },
    { batch_name: "inclusive-items", url: "/cms/report/batch/after-night-audit/inclusive-items" },
  ];

  const dataBeforeNight = [
    { batch_name: "expected-arrival-summary", url: "/cms/report/batch/before-night-audit/expected-arrival-summary" },
    { batch_name: "expected-departure-summary", url: "/cms/report/batch/before-night-audit/expected-departure-summary" },
    { batch_name: "before-in-house-folio-balances", url: "/cms/report/batch/before-night-audit/before-in-house-foliobal" },
    { batch_name: "rate-code-analysis", url: "/cms/report/batch/before-night-audit/rate-code-analysis" },
    { batch_name: "transaction-report", url: "/cms/report/account/transaction-report" },
    { batch_name: "breakfast-report", url: "/cms/report/batch/before-night-audit/breakfast-report" },
    { batch_name: "room-revenue-breakdown-report", url: "/cms/report/batch/before-night-audit/room-revenue-breakdown" },
    { batch_name: "before-night-vacant-and-dirty-rooms", url: "/cms/report/batch/before-night-audit/vacant-and-dirty-rooms" },
  ];

  const account = [
    { batch_name: "cash-detailed", url: "/cms/report/account/cash-detailed" },
    { batch_name: "cash-summary", url: "/cms/report/account/cash-summary" },
    { batch_name: "on-reservation-balance", url: "/cms/report/account/on-resv-bal" },
    { batch_name: "comission-for-agent", url: "/cms/report/account/comission-for-booking" },
    { batch_name: "comission-for-agent-by-company", url: "/cms/report/account/comission-for-booking-company" },
    { batch_name: "account-transaction-report", url: "/cms/report/account/transaction-report" },
    { batch_name: "account-tax-breakdown-summary", url: "/cms/report/account/tax-breakdown-summary" },
    { batch_name: "account-tax-breakdown", url: "/cms/report/account/tax-breakdown-detail" },
    { batch_name: "in-house-folio-balance-history", url: "/cms/report/account/in-house-folio-bal-history" },
    { batch_name: "transaction-by-staff", url: "/cms/report/account/transaction-report-by-staff" },
    { batch_name: "daily-sales-report", url: "/cms/report/account/daily-sales-report" },
    { batch_name: "daily-revenue-report", url: "/cms/report/account/daily-revenue-report" },
    { batch_name: "daily-statistic-report", url: "/cms/report/account/daily-statistic-report" },
  ];

  const frontOffice = [
    { batch_name: "cancellation-listing", url: "/cms/report/batch/frontoffice/cancellation-listing" },
    { batch_name: "free-of-charge-detail-report", url: "/cms/report/batch/frontoffice/free-of-charge-detail-report" },
    { batch_name: "reservations-by-staff", url: "/cms/report/batch/frontoffice/reservations-by-staff" },
    { batch_name: "room-type-detailed-report", url: "/cms/report/batch/frontoffice/room-type-detailed-report" },
    { batch_name: "in-house-guest-listing", url: "/cms/report/batch/frontoffice/in-house-guest-listing" },
    { batch_name: "room-type-monthly-report", url: "/cms/report/batch/frontoffice/room-type-monthly-report" },
    { batch_name: "same-day-check-out-check-in-report", url: "/cms/report/batch/frontoffice/same-day-check-out-check-in-report" },
    { batch_name: "transaction-by-staff-report", url: "/cms/report/batch/frontoffice/transaction-by-staff-report" },
    { batch_name: "birthday-report", url: "/cms/report/batch/frontoffice/birthday-report" },
  ];

  const housekeeping = [
    { batch_name: "room-status-report", url: "/cms/report/batch/housekeeping/room-status-report" },
    { batch_name: "block-rooms-report", url: "/cms/report/batch/housekeeping/block-rooms-report" },
    { batch_name: "room-change-history", url: "/cms/report/batch/housekeeping/room-change-history" },
  ];

  const salesMarketing = [
    { batch_name: "all-companies-room-revenue", url: "/cms/report/batch/sales-marketing/all-companies-room-revenue" },
    { batch_name: "market-segmentation-report", url: "/cms/report/batch/sales-marketing/market-segmentation-report" },
    { batch_name: "nationality-statistics-detailed", url: "/cms/report/batch/sales-marketing/nationality-statistics-detailed" },
    { batch_name: "staff-sales-summary", url: "/cms/report/batch/sales-marketing/staff-sales-summary" },
    { batch_name: "room-occupancy-chart", url: "/cms/report/batch/sales-marketing/room-occupancy-chart" },
  ];

  const dataBatchZip = dataAll;

  const dataBatch = [
    { batch_name: "Batch", url: "/cms/report/batch/download-reports-batch" },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const guestId = urlParams.get("data");
    const module = urlParams.get("module");
    setmodule(module);
    if (guestId) {
      setischildren(guestId);
    }
    setparentid(parent);
    setadd(add);
    setpath(window.location.pathname.split("/")[2]);
    setpathdua(window.location.pathname.split("/")[3]);
    fetchReportData();
  }, []);
  function RouteInit() {
    if (path == "report-permission") {
      return <ReportPermission />;
    } else if (path == "batch") {
      return (
        <TableReport reportData={data} isBatch={true} dataZip={dataBatchZip} />
      );
    } else {
      if (data.length >= 0) {
        return (
          <>
            <TableReport reportData={data} />
          </>
        );
      } else {
        return <div>{data.length + " Data "}</div>;
      }
    }
  }
  return (
    <LayoutComponent>
      <PaperBase>
        <div className="overflow-x-auto">
          <Tabs active={path} idparent={parentid} ischildren={ischildren} />
        </div>

        {data.length >= 0 && RouteInit()}
      </PaperBase>
    </LayoutComponent>
  );
};

export default Reporting;
