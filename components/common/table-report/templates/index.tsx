import React from "react";
import BirthdayReportHTML from "./BirthdayReportHTML";
import DailyRevenueReportHTML from "./DailyRevenueReportHTML";
import TaxBreakdownDetailHTML from "./TaxBreakdownDetailHTML";
import TransactionReportHTML from "./TransactionReportHTML";

interface ReportTemplateProps {
  name: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  reportData: any;
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({
  name,
  date,
  startDate,
  endDate,
  reportData,
}) => {
  // 1. Birthday Report
  if (name === "birthday-report") {
    const dataArray = Array.isArray(reportData) ? reportData : [];
    return (
      <BirthdayReportHTML
        startDate={startDate || ""}
        endDate={endDate || ""}
        reportData={dataArray}
      />
    );
  }

  // 2. Daily Revenue Report
  if (name === "daily-revenue-report") {
    const data = reportData.reportData || {};

    return (
      <DailyRevenueReportHTML
        date={reportData.reportDate || date || new Date().toISOString().split("T")[0]}
        revenueDetail={data.revenueDetail || []}
        revenueTotal={data.revenueTotal || {}}
        paymentDetail={data.paymentDetail || []}
        paymentTotal={data.paymentTotal || {}}
        todayData={data.occupancy?.today || {}}
        mtdData={data.occupancy?.mtd || {}}
        ytdData={data.occupancy?.ytd || {}}
        roomActivities={data.roomActivities || {}}
        systemBalance={data.systemBalance}
      />
    );
  }

  // 3. Tax Breakdown Detail Report
  if (name === "tax-breakdown-detail-report") {
    const fullReport = reportData || {}; // response JSON lengkap
  
    return (
      <TaxBreakdownDetailHTML
        reportTitle={fullReport.reportTitle || "Tax Breakdown Detail"}
        startDate={fullReport.startDate || ""}
        endDate={fullReport.endDate || ""}
        reportData={fullReport.reportData || {}}
        totalTransactions={Number(fullReport.totalTransactions) || 0}
        grandTotalCharge={Number(fullReport.grandTotalCharge) || 0}
        grandTotalGovtTax={Number(fullReport.grandTotalGovtTax) || 0}
        grandTotalSvcCharge={Number(fullReport.grandTotalSvcCharge) || 0}
        grandTotalSurcharge={Number(fullReport.grandTotalSurcharge) || 0}
        grandTotal={Number(fullReport.grandTotal) || 0}
      />
    );
  }

  // 4. Account / Transaction Report (BARU)
  if (name === "account-transaction-report") {
    return (
      <TransactionReportHTML
        reportTitle="Account/Transaction Report"
        startDate={startDate || ""}
        endDate={endDate || ""}
        reportData={reportData?.reportData || []}
        totals={reportData?.totals || {
          grandTotal: 0,
          totalExclTax: 0,
          totalPB1: 0,
          totalSvc: 0,
          totalSurcharge: 0,
        }}
      />
    );
  }

  // Default fallback jika nama report tidak dikenali
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        textAlign: "center",
        color: "#666",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h3>Template Report Tidak Ditemukan</h3>
      <p>
        Template untuk report "<strong>{name}</strong>" belum tersedia.
      </p>
      <p>
        Silakan tambahkan komponen template di folder:
        <br />
        <code style={{ background: "#eee", padding: "4px 8px", borderRadius: "4px" }}>
          components/common/table-report/templates/
        </code>
      </p>
    </div>
  );
};

export default ReportTemplate;