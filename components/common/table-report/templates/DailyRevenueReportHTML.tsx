import React from "react";

interface RevenueDetail {
  billing_code: string;
  post_code: string;
  today_amt: number;
  today_bud: number;
  today_var: number;
  mtd_amt: number;
  mtd_bud: number;
  mtd_var: number;
  ytd_amt: number;
  ytd_bud: number;
  ytd_var: number;
}

interface RevenueTotal {
  [key: string]: {
    today_amt?: number;
    today_bud?: number;
    today_var?: number;
    mtd_amt?: number;
    mtd_bud?: number;
    mtd_var?: number;
    ytd_amt?: number;
    ytd_bud?: number;
    ytd_var?: number;
  };
}

interface PaymentDetail {
  billing_code: string;
  post_code: string;
  today_amt: number;
  mtd_amt: number;
  ytd_amt: number;
}

interface PaymentTotal {
  [key: string]: {
    today_amt?: number;
    today_var?: number;
    mtd_amt?: number;
    mtd_var?: number;
    ytd_amt?: number;
    ytd_var?: number;
  };
}

interface OccupancyData {
  totalAvailableRoom?: number;
  totalAvailableRoomBudget?: number;
  totalBlockedRoom?: number;
  totalBlockedRoomBudget?: number;
  totalRoomSold?: number;
  totalRoomSoldBudget?: number;
  roomTypeSales?: { [roomType: string]: number };
  totalComplimentary?: number;
  totalComplimentaryBudget?: number;
  totalHouseUse?: number;
  totalHouseUseBudget?: number;
  totalDayUse?: number;
  totalDayUseBudget?: number;
  totalInHouseGuests?: number;
  totalInHouseGuestsBudget?: number;
  roomSaleableOccupancy?: number;
  averageRoomRate?: number;
  revenuePerAvailableRoom?: number;
  doubleOccupancy?: number;
}

interface RoomActivities {
  today?: {
    roomArrivalsToday?: number;
    roomDepartureToday?: number;
    noShow?: number;
    noShowBudget?: number;
    cancellationReservation?: number;
    cancellationReservationBudget?: number;
    reservationMade?: number;
    reservationMadeBudget?: number;
  };
  mtd?: {
    noShow?: number;
    noShowBudget?: number;
    cancellationReservation?: number;
    cancellationReservationBudget?: number;
    reservationMade?: number;
    reservationMadeBudget?: number;
    roomArrivalsToday?: number;
    roomDepartureToday?: number;
  };
  ytd?: {
    noShow?: number;
    noShowBudget?: number;
    cancellationReservation?: number;
    cancellationReservationBudget?: number;
    reservationMade?: number;
    reservationMadeBudget?: number;
  };
}

interface SystemBalance {
  today?: { [key: string]: number };
  mtd?: { [key: string]: number };
  ytd?: { [key: string]: number };
  TOTAL_LEDGER_DEPOSIT?: {
    today?: number;
    mtd?: number;
    ytd?: number;
  };
}

interface DailyRevenueReportHTMLProps {
  date: string;
  revenueDetail?: RevenueDetail[];
  revenueTotal?: RevenueTotal;
  paymentDetail?: PaymentDetail[];
  paymentTotal?: PaymentTotal;
  todayData?: OccupancyData;
  mtdData?: OccupancyData;
  ytdData?: OccupancyData;
  roomActivities?: RoomActivities;
  systemBalance?: SystemBalance;
}

const DailyRevenueReportHTML: React.FC<DailyRevenueReportHTMLProps> = ({
  date = new Date().toISOString().split("T")[0],
  revenueDetail = [],
  revenueTotal = {},
  paymentDetail = [],
  paymentTotal = {},
  todayData = {},
  mtdData = {},
  ytdData = {},
  roomActivities = {},
  systemBalance,
}) => {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const printDate = new Date().toLocaleDateString("en-GB");

  const formatNumber = (num: number | undefined | null, decimals = 2) => {
    const value = num ?? 0;
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatInt = (num: number | undefined | null) => {
    const value = num ?? 0;
    return value.toLocaleString();
  };

  // Safe access untuk nested objects
  const todayAct = roomActivities.today ?? {};
  const mtdAct = roomActivities.mtd ?? {};
  const ytdAct = roomActivities.ytd ?? {};

  return (
    <div id="daily-revenue-report-pdf">
      <style>{`
        #daily-revenue-report-pdf {
          font-family: 'Calibri', 'Helvetica', sans-serif;
          font-size: 9pt;
          color: #000;
          padding: 15px;
        }
        h2 {
          text-align: center;
          font-size: 14pt;
          margin: 15px 0 25px 0;
          text-transform: uppercase;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        th, td {
          border: 1px solid #333;
          padding: 6px 8px;
          text-align: right;
          vertical-align: middle;
        }
        th {
          background-color: #e0e0e0;
          font-weight: bold;
          font-size: 8.5pt;
        }
        .left { text-align: left !important; }
        .total {
          font-weight: bold;
          background-color: #d0d0d0 !important;
        }
        .header-group {
          background-color: #b0b0b0;
          font-weight: bold;
          font-size: 9.5pt;
        }
        .subsection { padding-left: 30px; }
        .text-bold { font-weight: bold; }
        .page-break { page-break-before: always; margin-top: 30px; }
      `}</style>

      <h2>
        Daily Revenue Report
        <br />
        {formattedDate}
      </h2>

      {/* REVENUE SECTION */}
      <table>
        <thead>
          <tr>
            <th className="left" rowSpan={2} style={{ width: "22%" }}>Revenue Department</th>
            <th colSpan={3}>Today</th>
            <th colSpan={3}>Month to Date (MTD)</th>
            <th colSpan={3}>Year to Date (YTD)</th>
          </tr>
          <tr>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            let currentBilling = "";
            return revenueDetail.map((row, idx) => {
              const rows = [];
              if (currentBilling !== row.billing_code) {
                currentBilling = row.billing_code;
                rows.push(
                  <tr key={`header-${idx}`}>
                    <td colSpan={10} className="left header-group">
                      {row.billing_code.toUpperCase()}
                    </td>
                  </tr>
                );
              }
              rows.push(
                <tr key={idx}>
                  <td className="left subsection">- {row.post_code.toUpperCase()}</td>
                  <td>{formatNumber(row.today_amt)}</td>
                  <td>{formatNumber(row.today_bud)}</td>
                  <td>{formatNumber(row.today_var)}</td>
                  <td>{formatNumber(row.mtd_amt)}</td>
                  <td>{formatNumber(row.mtd_bud)}</td>
                  <td>{formatNumber(row.mtd_var)}</td>
                  <td>{formatNumber(row.ytd_amt)}</td>
                  <td>{formatNumber(row.ytd_bud)}</td>
                  <td>{formatNumber(row.ytd_var)}</td>
                </tr>
              );
              return rows;
            });
          })()}

          {["TOTAL NET REVENUE", "GOVERNMENT TAX", "SERVICE CHARGE", "TOTAL GROSS REVENUE"].map((key) => {
            const r = revenueTotal[key] || {};
            return (
              <tr key={key} className={key.includes("TOTAL") ? "total" : ""}>
                <td className="left text-bold">{key}</td>
                <td>{formatNumber(r.today_amt)}</td>
                <td>{formatNumber(r.today_bud)}</td>
                <td>{formatNumber(r.today_var)}</td>
                <td>{formatNumber(r.mtd_amt)}</td>
                <td>{formatNumber(r.mtd_bud)}</td>
                <td>{formatNumber(r.mtd_var)}</td>
                <td>{formatNumber(r.ytd_amt)}</td>
                <td>{formatNumber(r.ytd_bud)}</td>
                <td>{formatNumber(r.ytd_var)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PAYMENT SECTION */}
      <table>
        <thead>
          <tr>
            <th className="left" rowSpan={2} style={{ width: "25%" }}>Payment Method</th>
            <th colSpan={3}>Today</th>
            <th colSpan={3}>Month to Date (MTD)</th>
            <th colSpan={3}>Year to Date (YTD)</th>
          </tr>
          <tr>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            let currentPay = "";
            return paymentDetail.map((row, idx) => {
              const rows = [];
              if (currentPay !== row.billing_code) {
                currentPay = row.billing_code;
                rows.push(
                  <tr key={`pay-header-${idx}`}>
                    <td colSpan={10} className="left header-group">
                      {row.billing_code.toUpperCase()}
                    </td>
                  </tr>
                );
              }
              rows.push(
                <tr key={`pay-${idx}`}>
                  <td className="left subsection">- {row.post_code.toUpperCase()}</td>
                  <td>{formatNumber(row.today_amt)}</td>
                  <td>-</td>
                  <td>{formatNumber(row.today_amt)}</td>
                  <td>{formatNumber(row.mtd_amt)}</td>
                  <td>-</td>
                  <td>{formatNumber(row.mtd_amt)}</td>
                  <td>{formatNumber(row.ytd_amt)}</td>
                  <td>-</td>
                  <td>{formatNumber(row.ytd_amt)}</td>
                </tr>
              );
              return rows;
            });
          })()}

          {["HOTEL NET PAYMENT", "TOTAL SURCHARGE", "TOTAL GROSS PAYMENT"].map((key) => {
            const p = paymentTotal[key] || {};
            return (
              <tr key={key} className={key === "TOTAL GROSS PAYMENT" ? "total" : ""}>
                <td className="left text-bold">{key}</td>
                <td>{formatNumber(p.today_amt)}</td>
                <td>0.00</td>
                <td>{formatNumber(p.today_var ?? p.today_amt ?? 0)}</td>
                <td>{formatNumber(p.mtd_amt)}</td>
                <td>0.00</td>
                <td>{formatNumber(p.mtd_var ?? p.mtd_amt ?? 0)}</td>
                <td>{formatNumber(p.ytd_amt)}</td>
                <td>0.00</td>
                <td>{formatNumber(p.ytd_var ?? p.ytd_amt ?? 0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="page-break" />

      {/* ROOM STATISTICS */}
      <table>
        <thead>
          <tr>
            <th className="left" rowSpan={2} style={{ width: "35%" }}>Room Statistics</th>
            <th colSpan={3}>Today</th>
            <th colSpan={3}>Month to Date (MTD)</th>
            <th colSpan={3}>Year to Date (YTD)</th>
          </tr>
          <tr>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="left text-bold">Rooms Available</td>
            <td>{formatInt(todayData.totalAvailableRoom)}</td>
            <td>{formatInt(todayData.totalAvailableRoomBudget)}</td>
            <td>{formatInt((todayData.totalAvailableRoom ?? 0) - (todayData.totalAvailableRoomBudget ?? 0))}</td>
            <td>{formatInt(mtdData.totalAvailableRoom)}</td>
            <td>{formatInt(mtdData.totalAvailableRoomBudget)}</td>
            <td>{formatInt((mtdData.totalAvailableRoom ?? 0) - (mtdData.totalAvailableRoomBudget ?? 0))}</td>
            <td>{formatInt(ytdData.totalAvailableRoom)}</td>
            <td>{formatInt(ytdData.totalAvailableRoomBudget)}</td>
            <td>{formatInt((ytdData.totalAvailableRoom ?? 0) - (ytdData.totalAvailableRoomBudget ?? 0))}</td>
          </tr>

          <tr>
            <td className="left text-bold">Out of Order (OOO)</td>
            <td>{formatInt(todayData.totalBlockedRoom)}</td>
            <td>{formatInt(todayData.totalBlockedRoomBudget)}</td>
            <td>{formatInt((todayData.totalBlockedRoom ?? 0) - (todayData.totalBlockedRoomBudget ?? 0))}</td>
            <td>{formatInt(mtdData.totalBlockedRoom)}</td>
            <td>{formatInt(mtdData.totalBlockedRoomBudget)}</td>
            <td>{formatInt((mtdData.totalBlockedRoom ?? 0) - (mtdData.totalBlockedRoomBudget ?? 0))}</td>
            <td>-</td><td>-</td><td>-</td>
          </tr>

          <tr className="total">
            <td className="left text-bold">Rooms Sold</td>
            <td>{formatInt(todayData.totalRoomSold)}</td>
            <td>{formatInt(todayData.totalRoomSoldBudget)}</td>
            <td>{formatInt((todayData.totalRoomSold ?? 0) - (todayData.totalRoomSoldBudget ?? 0))}</td>
            <td>{formatInt(mtdData.totalRoomSold)}</td>
            <td>{formatInt(mtdData.totalRoomSoldBudget)}</td>
            <td>{formatInt((mtdData.totalRoomSold ?? 0) - (mtdData.totalRoomSoldBudget ?? 0))}</td>
            <td>{formatInt(ytdData.totalRoomSold)}</td>
            <td>{formatInt(ytdData.totalRoomSoldBudget)}</td>
            <td>{formatInt((ytdData.totalRoomSold ?? 0) - (ytdData.totalRoomSoldBudget ?? 0))}</td>
          </tr>

          {/* Room Type Sales - Aman dari undefined */}
          {(() => {
            const sales = todayData.roomTypeSales ?? {};
            if (Object.keys(sales).length === 0) return null;

            return Object.entries(sales).map(([typeName, todayCount = 0]) => {
              const mtdCount = (mtdData.roomTypeSales ?? {})[typeName] ?? 0;
              const ytdCount = (ytdData.roomTypeSales ?? {})[typeName] ?? 0;

              return (
                <tr key={typeName}>
                  <td className="left subsection">- {typeName.toUpperCase()}</td>
                  <td>{formatInt(todayCount)}</td>
                  <td>-</td>
                  <td>{formatInt(todayCount)}</td>
                  <td>{formatInt(mtdCount)}</td>
                  <td>-</td>
                  <td>{formatInt(mtdCount)}</td>
                  <td>{formatInt(ytdCount)}</td>
                  <td>-</td>
                  <td>{formatInt(ytdCount)}</td>
                </tr>
              );
            });
          })()}

          <tr>
            <td className="left">Complimentary Rooms</td>
            <td>{formatInt(todayData.totalComplimentary)}</td>
            <td>{formatInt(todayData.totalComplimentaryBudget)}</td>
            <td>{formatInt((todayData.totalComplimentary ?? 0) - (todayData.totalComplimentaryBudget ?? 0))}</td>
            <td>{formatInt(mtdData.totalComplimentary)}</td>
            <td>{formatInt(mtdData.totalComplimentaryBudget)}</td>
            <td>{formatInt((mtdData.totalComplimentary ?? 0) - (mtdData.totalComplimentaryBudget ?? 0))}</td>
            <td>{formatInt(ytdData.totalComplimentary)}</td>
            <td>{formatInt(ytdData.totalComplimentaryBudget)}</td>
            <td>{formatInt((ytdData.totalComplimentary ?? 0) - (ytdData.totalComplimentaryBudget ?? 0))}</td>
          </tr>

          <tr>
            <td className="left">House Use Rooms</td>
            <td>{formatInt(todayData.totalHouseUse)}</td>
            <td>{formatInt(todayData.totalHouseUseBudget)}</td>
            <td>{formatInt((todayData.totalHouseUse ?? 0) - (todayData.totalHouseUseBudget ?? 0))}</td>
            <td>{formatInt(mtdData.totalHouseUse)}</td>
            <td>{formatInt(mtdData.totalHouseUseBudget)}</td>
            <td>{formatInt((mtdData.totalHouseUse ?? 0) - (mtdData.totalHouseUseBudget ?? 0))}</td>
            <td>{formatInt(ytdData.totalHouseUse)}</td>
            <td>{formatInt(ytdData.totalHouseUseBudget)}</td>
            <td>{formatInt((ytdData.totalHouseUse ?? 0) - (ytdData.totalHouseUseBudget ?? 0))}</td>
          </tr>

          <tr>
            <td className="left">Day Use Rooms</td>
            <td>{formatInt(todayData.totalDayUse)}</td>
            <td>{formatInt(todayData.totalDayUseBudget)}</td>
            <td>{formatInt((todayData.totalDayUse ?? 0) - (todayData.totalDayUseBudget ?? 0))}</td>
            <td>{formatInt(mtdData.totalDayUse)}</td>
            <td>{formatInt(mtdData.totalDayUseBudget)}</td>
            <td>{formatInt((mtdData.totalDayUse ?? 0) - (mtdData.totalDayUseBudget ?? 0))}</td>
            <td>{formatInt(ytdData.totalDayUse)}</td>
            <td>{formatInt(ytdData.totalDayUseBudget)}</td>
            <td>{formatInt((ytdData.totalDayUse ?? 0) - (ytdData.totalDayUseBudget ?? 0))}</td>
          </tr>

          <tr className="total">
            <td className="left text-bold">Occupancy % (Saleable)</td>
            <td>{(todayData.roomSaleableOccupancy ?? 0).toFixed(2)}%</td>
            <td>-</td><td>-</td>
            <td>{(mtdData.roomSaleableOccupancy ?? 0).toFixed(2)}%</td>
            <td>-</td><td>-</td>
            <td>{(ytdData.roomSaleableOccupancy ?? 0).toFixed(2)}%</td>
            <td>-</td><td>-</td>
          </tr>

          <tr>
            <td className="left text-bold">Average Room Rate (ARR)</td>
            <td>{formatNumber(todayData.averageRoomRate)}</td>
            <td>-</td><td>-</td>
            <td>{formatNumber(mtdData.averageRoomRate)}</td>
            <td>-</td><td>-</td>
            <td>{formatNumber(ytdData.averageRoomRate)}</td>
            <td>-</td><td>-</td>
          </tr>

          <tr>
            <td className="left text-bold">RevPAR</td>
            <td>{formatNumber(todayData.revenuePerAvailableRoom)}</td>
            <td>-</td><td>-</td>
            <td>{formatNumber(mtdData.revenuePerAvailableRoom)}</td>
            <td>-</td><td>-</td>
            <td>{formatNumber(ytdData.revenuePerAvailableRoom)}</td>
            <td>-</td><td>-</td>
          </tr>

          <tr>
            <td className="left">Total Guests (Pax)</td>
            <td>{formatInt(todayData.totalInHouseGuests)}</td>
            <td>{formatInt(todayData.totalInHouseGuestsBudget)}</td>
            <td>{formatInt((todayData.totalInHouseGuests ?? 0) - (todayData.totalInHouseGuestsBudget ?? 0))}</td>
            <td>{formatInt(mtdData.totalInHouseGuests)}</td>
            <td>{formatInt(mtdData.totalInHouseGuestsBudget)}</td>
            <td>{formatInt((mtdData.totalInHouseGuests ?? 0) - (mtdData.totalInHouseGuestsBudget ?? 0))}</td>
            <td>{formatInt(ytdData.totalInHouseGuests)}</td>
            <td>{formatInt(ytdData.totalInHouseGuestsBudget)}</td>
            <td>{formatInt((ytdData.totalInHouseGuests ?? 0) - (ytdData.totalInHouseGuestsBudget ?? 0))}</td>
          </tr>

          <tr className="total">
            <td className="left text-bold">Double Occupancy Ratio</td>
            <td>{(todayData.doubleOccupancy ?? 0).toFixed(2)}</td>
            <td>-</td><td>-</td>
            <td>{(mtdData.doubleOccupancy ?? 0).toFixed(2)}</td>
            <td>-</td><td>-</td>
            <td>{(ytdData.doubleOccupancy ?? 0).toFixed(2)}</td>
            <td>-</td><td>-</td>
          </tr>
        </tbody>
      </table>

      {/* ROOM ACTIVITIES */}
      <table>
        <thead>
          <tr>
            <th className="left" rowSpan={2} style={{ width: "35%" }}>Room Activities</th>
            <th colSpan={3}>Today</th>
            <th colSpan={3}>Month to Date (MTD)</th>
            <th colSpan={3}>Year to Date (YTD)</th>
          </tr>
          <tr>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
            <th>Actual</th><th>Budget</th><th>Var</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="left">Arrival Rooms</td>
            <td>{formatInt(todayAct.roomArrivalsToday)}</td>
            <td>-</td><td>-</td>
            <td>{formatInt(mtdAct.roomArrivalsToday)}</td>
            <td>-</td><td>-</td>
            <td>-</td><td>-</td><td>-</td>
          </tr>
          <tr>
            <td className="left">Departure Rooms</td>
            <td>{formatInt(todayAct.roomDepartureToday)}</td>
            <td>-</td><td>-</td>
            <td>{formatInt(mtdAct.roomDepartureToday)}</td>
            <td>-</td><td>-</td>
            <td>-</td><td>-</td><td>-</td>
          </tr>
          <tr>
            <td className="left">No Show</td>
            <td>{formatInt(todayAct.noShow)}</td>
            <td>{formatInt(todayAct.noShowBudget)}</td>
            <td>{formatInt((todayAct.noShow ?? 0) - (todayAct.noShowBudget ?? 0))}</td>
            <td>{formatInt(mtdAct.noShow)}</td>
            <td>{formatInt(mtdAct.noShowBudget)}</td>
            <td>{formatInt((mtdAct.noShow ?? 0) - (mtdAct.noShowBudget ?? 0))}</td>
            <td>{formatInt(ytdAct.noShow)}</td>
            <td>{formatInt(ytdAct.noShowBudget)}</td>
            <td>{formatInt((ytdAct.noShow ?? 0) - (ytdAct.noShowBudget ?? 0))}</td>
          </tr>
          <tr>
            <td className="left">Cancellation</td>
            <td>{formatInt(todayAct.cancellationReservation)}</td>
            <td>{formatInt(todayAct.cancellationReservationBudget)}</td>
            <td>{formatInt((todayAct.cancellationReservation ?? 0) - (todayAct.cancellationReservationBudget ?? 0))}</td>
            <td>{formatInt(mtdAct.cancellationReservation)}</td>
            <td>{formatInt(mtdAct.cancellationReservationBudget)}</td>
            <td>{formatInt((mtdAct.cancellationReservation ?? 0) - (mtdAct.cancellationReservationBudget ?? 0))}</td>
            <td>{formatInt(ytdAct.cancellationReservation)}</td>
            <td>{formatInt(ytdAct.cancellationReservationBudget)}</td>
            <td>{formatInt((ytdAct.cancellationReservation ?? 0) - (ytdAct.cancellationReservationBudget ?? 0))}</td>
          </tr>
          <tr>
            <td className="left">Reservation Made</td>
            <td>{formatInt(todayAct.reservationMade)}</td>
            <td>{formatInt(todayAct.reservationMadeBudget)}</td>
            <td>{formatInt((todayAct.reservationMade ?? 0) - (todayAct.reservationMadeBudget ?? 0))}</td>
            <td>{formatInt(mtdAct.reservationMade)}</td>
            <td>{formatInt(mtdAct.reservationMadeBudget)}</td>
            <td>{formatInt((mtdAct.reservationMade ?? 0) - (mtdAct.reservationMadeBudget ?? 0))}</td>
            <td>{formatInt(ytdAct.reservationMade)}</td>
            <td>{formatInt(ytdAct.reservationMadeBudget)}</td>
            <td>{formatInt((ytdAct.reservationMade ?? 0) - (ytdAct.reservationMadeBudget ?? 0))}</td>
          </tr>
        </tbody>
      </table>

      {systemBalance && (
        <table>
          <thead>
            <tr>
              <th className="left" rowSpan={2}>System Balance</th>
              <th colSpan={3}>Today</th>
              <th colSpan={3}>Month to Date (MTD)</th>
              <th colSpan={3}>Year to Date (YTD)</th>
            </tr>
            <tr>
              <th>Actual</th><th>Budget</th><th>Var</th>
              <th>Actual</th><th>Budget</th><th>Var</th>
              <th>Actual</th><th>Budget</th><th>Var</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="left">Guest Ledger Current Day</td>
              <td>{formatNumber((systemBalance.today ?? {}).GUESTLEDGERCURRENT)}</td>
              <td>0.00</td>
              <td>{formatNumber((systemBalance.today ?? {}).GUESTLEDGERCURRENT)}</td>
              <td>{formatNumber((systemBalance.mtd ?? {}).GUESTLEDGERCURRENT)}</td>
              <td>0.00</td>
              <td>{formatNumber((systemBalance.mtd ?? {}).GUESTLEDGERCURRENT)}</td>
              <td>{formatNumber((systemBalance.ytd ?? {}).GUESTLEDGERCURRENT)}</td>
              <td>0.00</td>
              <td>{formatNumber((systemBalance.ytd ?? {}).GUESTLEDGERCURRENT)}</td>
            </tr>
            <tr>
              <td className="left">Advance Deposit Current Day</td>
              <td>{formatNumber((systemBalance.today ?? {}).ADVANCEDDEPOSITCURRENTDAY)}</td>
              <td>0.00</td>
              <td>{formatNumber((systemBalance.today ?? {}).ADVANCEDDEPOSITCURRENTDAY)}</td>
              <td>{formatNumber((systemBalance.mtd ?? {}).ADVANCEDDEPOSITCURRENTDAY)}</td>
              <td>0.00</td>
              <td>{formatNumber((systemBalance.mtd ?? {}).ADVANCEDDEPOSITCURRENTDAY)}</td>
              <td>{formatNumber((systemBalance.ytd ?? {}).ADVANCEDDEPOSITCURRENTDAY)}</td>
              <td>0.00</td>
              <td>{formatNumber((systemBalance.ytd ?? {}).ADVANCEDDEPOSITCURRENTDAY)}</td>
            </tr>
            <tr className="total">
              <td className="left text-bold">TOTAL LEDGER & DEPOSIT</td>
              <td>{formatNumber(systemBalance.TOTAL_LEDGER_DEPOSIT?.today)}</td>
              <td>0.00</td>
              <td>{formatNumber(systemBalance.TOTAL_LEDGER_DEPOSIT?.today)}</td>
              <td>{formatNumber(systemBalance.TOTAL_LEDGER_DEPOSIT?.mtd)}</td>
              <td>0.00</td>
              <td>{formatNumber(systemBalance.TOTAL_LEDGER_DEPOSIT?.mtd)}</td>
              <td>{formatNumber(systemBalance.TOTAL_LEDGER_DEPOSIT?.ytd)}</td>
              <td>0.00</td>
              <td>{formatNumber(systemBalance.TOTAL_LEDGER_DEPOSIT?.ytd)}</td>
            </tr>
          </tbody>
        </table>
      )}

      <footer style={{ marginTop: "30px", textAlign: "right", fontSize: "8pt" }}>
        <p>
          <strong>Printed On:</strong> {printDate}
        </p>
      </footer>
    </div>
  );
};

export default DailyRevenueReportHTML;