import React from "react";

interface TransactionDetail {
  date: string;
  folio_no: string;
  room: string;
  guest_name: string;
  company_name: string;
  description: string;
  staff: string;
  post_datetime: string;
  charge: number;
  govt_tax: number;
  service_charge: number;
  surcharge: number;
  total: number;
}

interface GroupData {
  transactions: TransactionDetail[];
  totalCharge: number;
  totalGovtTax: number;
  totalSvcCharge: number;
  totalSurcharge: number;
  totalAmount: number;
  count: number;
}

interface TaxBreakdownReportData {
  [code: string]: GroupData;
}

interface TaxBreakdownReportHTMLProps {
  reportTitle?: string;
  startDate: string;
  endDate: string;
  reportData: TaxBreakdownReportData;
  totalTransactions: number;
  grandTotalCharge: number;
  grandTotalGovtTax: number;
  grandTotalSvcCharge: number;
  grandTotalSurcharge: number;
  grandTotal: number;
}

const TaxBreakdownDetailHTML: React.FC<TaxBreakdownReportHTMLProps> = ({
  reportTitle = "Tax Breakdown Detail",
  startDate,
  endDate,
  reportData = {},
  totalTransactions,
  grandTotalCharge,
  grandTotalGovtTax,
  grandTotalSvcCharge,
  grandTotalSurcharge,
  grandTotal,
}) => {
  // Format tanggal
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatFullDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Format angka dengan 2 desimal dan koma ribuan
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const printedDate = formatFullDate(new Date().toISOString());
  const groupCount = Object.keys(reportData).length;

  return (
    <div id="tax-breakdown-report-pdf">
      <style>{`
        #tax-breakdown-report-pdf {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
          line-height: 1.3;
          text-transform: uppercase;
          color: #000;
        }
        #tax-breakdown-report-pdf h1 {
          font-size: 14px;
          margin: 0 0 10px 0;
          text-align: center;
          font-weight: bold;
        }
        #tax-breakdown-report-pdf h2 {
          font-size: 12px;
          margin: 15px 0 5px 0;
          font-weight: bold;
          page-break-after: avoid;
        }
        #tax-breakdown-report-pdf table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        #tax-breakdown-report-pdf th,
        #tax-breakdown-report-pdf td {
          border: 1px solid #000;
          padding: 4px;
          text-align: left;
          vertical-align: top;
          word-wrap: break-word;
        }
        #tax-breakdown-report-pdf th {
          background-color: #f2f2f2 !important;
          font-weight: bold;
          text-align: center;
        }
        #tax-breakdown-report-pdf .col-number {
          text-align: right;
        }
        #tax-breakdown-report-pdf .subtotal-row,
        #tax-breakdown-report-pdf .grand-total-row {
          font-weight: bold;
          background-color: #f9f9f9 !important;
        }
        #tax-breakdown-report-pdf .grand-total-row td {
          font-size: 10px;
          font-weight: bold;
        }
        #tax-breakdown-report-pdf thead {
          display: table-header-group;
        }
        #tax-breakdown-report-pdf tr {
          page-break-inside: avoid;
        }
        #tax-breakdown-report-pdf .header-info {
          margin-bottom: 20px;
          text-align: center;
        }
        #tax-breakdown-report-pdf .footer {
          margin-top: 30px;
          border-top: 2px solid #000;
          padding-top: 10px;
          text-align: right;
          font-size: 9px;
        }
        #tax-breakdown-report-pdf .no-data {
          text-align: center;
          padding: 40px;
          color: red;
          font-weight: bold;
        }
      `}</style>

      <div className="header-info">
        <h1>{reportTitle}</h1>
        <p>
          Period: {formatFullDate(startDate)} - {formatFullDate(endDate)} | 
          Printed On: {printedDate} | 
          Groups: {groupCount} | 
          Total Transactions: {totalTransactions}
        </p>
      </div>

      {groupCount === 0 ? (
        <div className="no-data">
          <h2>NO DATA FOUND</h2>
          <p>Silakan periksa data yang dikirim ke report.</p>
          <pre style={{ fontSize: "8px", textAlign: "left" }}>
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      ) : (
        <main>
          {Object.entries(reportData).map(([code, group]) => (
            <div key={code}>
              <h2>{code} ({group.count} transactions)</h2>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "7%" }}>Date</th>
                    <th style={{ width: "9%" }}>Folio</th>
                    <th style={{ width: "5%" }}>Room</th>
                    <th style={{ width: "13%" }}>Guest</th>
                    <th style={{ width: "10%" }}>Company</th>
                    <th style={{ width: "22%" }}>Description</th>
                    <th style={{ width: "8%" }}>Staff</th>
                    <th style={{ width: "10%" }}>Post Date/Time</th>
                    <th style={{ width: "8%" }} className="col-number">Charge</th>
                    <th style={{ width: "8%" }} className="col-number">Govt Tax</th>
                    <th style={{ width: "8%" }} className="col-number">Svc Charge</th>
                    <th style={{ width: "8%" }} className="col-number">Surcharge</th>
                    <th style={{ width: "8%" }} className="col-number">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {group.transactions.map((trx, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(trx.date)}</td>
                      <td>{trx.folio_no || "-"}</td>
                      <td>{trx.room || "-"}</td>
                      <td>{trx.guest_name || "-"}</td>
                      <td>{trx.company_name || "-"}</td>
                      <td>{trx.description || "-"}</td>
                      <td>{trx.staff || "SYSTEM"}</td>
                      <td>{formatDateTime(trx.post_datetime)}</td>
                      <td className="col-number">{formatNumber(trx.charge)}</td>
                      <td className="col-number">{formatNumber(trx.govt_tax)}</td>
                      <td className="col-number">{formatNumber(trx.service_charge)}</td>
                      <td className="col-number">{formatNumber(trx.surcharge)}</td>
                      <td className="col-number">{formatNumber(trx.total)}</td>
                    </tr>
                  ))}
                  <tr className="subtotal-row">
                    <td colSpan={8}>Number Of Transactions: {group.count}</td>
                    <td className="col-number">{formatNumber(group.totalCharge)}</td>
                    <td className="col-number">{formatNumber(group.totalGovtTax)}</td>
                    <td className="col-number">{formatNumber(group.totalSvcCharge)}</td>
                    <td className="col-number">{formatNumber(group.totalSurcharge)}</td>
                    <td className="col-number">{formatNumber(group.totalAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}

          {/* Grand Total */}
          <table>
            <tbody>
              <tr className="grand-total-row">
                <td style={{ textAlign: "left", fontWeight: "bold" }}>
                  Grand Total (Number Of Transactions: {totalTransactions})
                </td>
                <td className="col-number">{formatNumber(grandTotalCharge)}</td>
                <td className="col-number">{formatNumber(grandTotalGovtTax)}</td>
                <td className="col-number">{formatNumber(grandTotalSvcCharge)}</td>
                <td className="col-number">{formatNumber(grandTotalSurcharge)}</td>
                <td className="col-number">{formatNumber(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </main>
      )}

      <div className="footer">
        <p>
          <strong>Tax Breakdown Detail Report</strong>
          <br />
          <strong>Printed On:</strong> {printedDate}
        </p>
      </div>
    </div>
  );
};

export default TaxBreakdownDetailHTML;