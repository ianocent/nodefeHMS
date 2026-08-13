import React from "react";

interface TransactionItem {
  folio: string;
  unit: string;
  guest: string;
  company: string;
  charge_date: string;
  staff: string;
  item_code: string;
  description: string;
  excl_tax: number;
  pb1: number;
  svc: number;
  surcharge: number;
  total: number;
  payment_type: string;
}

interface PostCodeData {
  code: string;
  transactions: TransactionItem[];
  total: number;
  excl_tax_total: number;
  pb1_total: number;
  svc_total: number;
  surcharge_total: number;
}

interface BillingData {
  name: string;
  postCodes: PostCodeData[];
}

interface TransactionReportProps {
  reportTitle?: string;
  reportData: BillingData[];
  totals: {
    grandTotal: number;
    totalExclTax: number;
    totalPB1: number;
    totalSvc: number;
    totalSurcharge: number;
  };
  startDate: string | Date;
  endDate: string | Date;
}

const TransactionReportHTML: React.FC<TransactionReportProps> = ({
    reportTitle = "Account/Transaction Report",
    reportData,
    totals,
    startDate,
    endDate,
  }) => {
    const formatDate = (date: string | Date): string => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    // PERBAIKAN UTAMA: Tangani nilai yang bukan number
    const formatCurrency = (value: number | null | undefined | string): string => {
      const num = parseFloat(String(value)) || 0;
      return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
  
    const printedDate = formatDate(new Date());

  return (
    <div id="transaction-report">
      <style>{`
        #transaction-report {
          font-family: Arial, sans-serif;
          font-size: 9px;
          text-transform: uppercase;
        }
        #transaction-report table {
          table-layout: fixed;
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
          page-break-inside: avoid;
        }
        #transaction-report thead { display: table-header-group; }
        #transaction-report tfoot { display: table-footer-group; }
        #transaction-report tr { page-break-inside: avoid; }
        #transaction-report th, #transaction-report td {
          border: 1px solid #000;
          padding: 3px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        #transaction-report th {
          background-color: #f2f2f2;
          font-weight: bold;
        }

        /* Lebar kolom tetap */
        .col-folio { width: 9%; }
        .col-unit { width: 5%; }
        .col-guest { width: 12%; }
        .col-company { width: 15%; }
        .col-date { width: 8%; }
        .col-staff { width: 8%; }
        .col-item { width: 8%; }
        .col-desc { width: 14%; }
        .col-number {
          width: 6%;
          text-align: right;
          padding-right: 5px;
          font-family: "Courier New", Courier, monospace;
          white-space: nowrap;
        }

        .billing-header {
          background-color: #d9d9d9;
          font-weight: bold;
          padding: 5px;
          margin-top: 15px;
          page-break-after: avoid;
        }

        .post-code-header {
          background-color: #f2f2f2;
          padding: 3px;
          margin-top: 10px;
          page-break-after: avoid;
        }

        .payment-group-header {
          background-color: #f9f9f9;
          font-weight: bold;
        }

        .subtotal {
          font-weight: bold;
          background-color: #f2f2f2;
        }

        .grand-total {
          margin-top: 20px;
          text-align: right;
          font-size: 11px;
        }

        .grand-total h3 {
          margin: 8px 0;
        }
      `}</style>
      <div style={{ padding: '20px', maxWidth: '100%', boxSizing: 'border-box' }}>

      <header style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
          {reportTitle}
        </h2>
        <p style={{ margin: "5px 0" }}>
          Period: {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </header>

      <main>
        {reportData.map((billing, billingIdx) => (
          <div key={billingIdx} className="billing-section">
            <div className="billing-header">{billing.name}</div>

            {billing.postCodes.map((postCode, postIdx) => {
              // Group transaksi berdasarkan payment_type
              const grouped = postCode.transactions.reduce((acc, trx) => {
                const key = trx.payment_type || "No Payment Type";
                if (!acc[key]) acc[key] = [];
                acc[key].push(trx);
                return acc;
              }, {} as Record<string, TransactionItem[]>);

              return (
                <div key={postIdx} className="post-code-section">
                  <div className="post-code-header">{postCode.code}</div>

                  <table>
                    <thead>
                      <tr>
                        <th className="col-folio">Folio</th>
                        <th className="col-unit">Unit</th>
                        <th className="col-guest">Guest</th>
                        <th className="col-company">Company</th>
                        <th className="col-date">Charge Date</th>
                        <th className="col-staff">Staff</th>
                        <th className="col-item">Item Code</th>
                        <th className="col-desc">Description</th>
                        <th className="col-number">Excl Tax</th>
                        <th className="col-number">PB1</th>
                        <th className="col-number">Svc</th>
                        <th className="col-number">Surcharge</th>
                        <th className="col-number">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(grouped).map(([paymentType, transactions]) => (
                        <React.Fragment key={paymentType}>
                          <tr className="payment-group-header">
                            <td colSpan={13}>
                              <strong>{paymentType}</strong>
                            </td>
                          </tr>

                          {transactions.map((trx, idx) => (
                            <tr key={idx}>
                              <td className="col-folio">{trx.folio}</td>
                              <td className="col-unit">{trx.unit}</td>
                              <td className="col-guest">{trx.guest}</td>
                              <td className="col-company">{trx.company}</td>
                              <td className="col-date">{trx.charge_date}</td>
                              <td className="col-staff">{trx.staff}</td>
                              <td className="col-item">{trx.item_code}</td>
                              <td className="col-desc">{trx.description}</td>
                              <td className="col-number">{formatCurrency(trx.excl_tax)}</td>
                              <td className="col-number">{formatCurrency(trx.pb1)}</td>
                              <td className="col-number">{formatCurrency(trx.svc)}</td>
                              <td className="col-number">{formatCurrency(trx.surcharge)}</td>
                              <td className="col-number">{formatCurrency(trx.total)}</td>
                            </tr>
                          ))}

                          {/* Subtotal per payment type */}
                          <tr className="subtotal">
                            <td colSpan={8} style={{ textAlign: "right" }}>
                              Subtotal for {paymentType}
                            </td>
                            <td className="col-number">
                              {formatCurrency(
                                transactions.reduce((sum, t) => sum + t.excl_tax, 0)
                              )}
                            </td>
                            <td className="col-number">
                              {formatCurrency(
                                transactions.reduce((sum, t) => sum + t.pb1, 0)
                              )}
                            </td>
                            <td className="col-number">
                              {formatCurrency(
                                transactions.reduce((sum, t) => sum + t.svc, 0)
                              )}
                            </td>
                            <td className="col-number">
                              {formatCurrency(
                                transactions.reduce((sum, t) => sum + t.surcharge, 0)
                              )}
                            </td>
                            <td className="col-number">
                              {formatCurrency(
                                transactions.reduce((sum, t) => sum + t.total, 0)
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="subtotal">
                        <td colSpan={8} style={{ textAlign: "right" }}>
                          Total for {postCode.code}
                        </td>
                        <td className="col-number">{formatCurrency(postCode.excl_tax_total)}</td>
                        <td className="col-number">{formatCurrency(postCode.pb1_total)}</td>
                        <td className="col-number">{formatCurrency(postCode.svc_total)}</td>
                        <td className="col-number">{formatCurrency(postCode.surcharge_total)}</td>
                        <td className="col-number">{formatCurrency(postCode.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}
          </div>
        ))}

        {/* Grand Total */}
        <div className="grand-total">
          <h3>Grand Total Details:</h3>
          <p>Total Excluding Tax: {formatCurrency(totals.totalExclTax)}</p>
          <p>Total PB1: {formatCurrency(totals.totalPB1)}</p>
          <p>Total Service Charges: {formatCurrency(totals.totalSvc)}</p>
          <p>Total Surcharges: {formatCurrency(totals.totalSurcharge)}</p>
          <h3>Grand Total: {formatCurrency(totals.grandTotal)}</h3>
        </div>
      </main>

      <footer style={{ marginTop: "30px", textAlign: "right", fontSize: "9px" }}>
        <p>
          <strong>Printed On:</strong> {printedDate}
        </p>
      </footer>
      </div>
    </div>
  );
};

export default TransactionReportHTML;