import React from "react";

interface DailyFlashReportHTMLProps {
  data: {
    reportDate?: string;
    todayActual?: Record<string, any>;
    mtdActual?: Record<string, any>;
    mtdLastMonth?: Record<string, any>;
    mtdBudget?: Record<string, any>;
    mtdVariance?: Record<string, any>;
    ytdActual?: Record<string, any>;
    roomTypes?: { id: string | number; name: string }[];
    roomTypeSales?: Record<
      string | number,
      {
        todayActual?: number;
        mtdActual?: number;
        mtdLastMonth?: number;
        mtdBudget?: number;
        mtdVariance?: number;
        ytdActual?: number;
      }
    >;
  };
}

const DailyFlashReportHTML: React.FC<DailyFlashReportHTMLProps> = ({ data }) => {
  const {
    reportDate = new Date().toISOString().split("T")[0],
    todayActual = {},
    mtdActual = {},
    mtdLastMonth = {},
    mtdBudget = {},
    mtdVariance = {},
    ytdActual = {},
    roomTypes = [],
    roomTypeSales = {},
  } = data;

  const currentDate = new Date().toLocaleDateString("en-GB");
  const formattedReportDate = new Date(reportDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Format angka: integer tanpa desimal, rate/persentase dengan 2 desimal
  const formatInt = (value: any) => {
    const num = Number(value);
    return isNaN(num) ? "0" : num.toLocaleString("en-US");
  };

  const formatDecimal = (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Helper untuk ambil nilai dengan fallback 0
  const getValue = (obj: any, key: string) => obj[key] ?? 0;

  return (
    <div id="daily-flash-report-pdf">
      <style>{`
        #daily-flash-report-pdf {
          font-family: Arial, sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          padding: 15px;
        }
        #daily-flash-report-pdf table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        #daily-flash-report-pdf th,
        #daily-flash-report-pdf td {
          border: 1px solid #000;
          padding: 6px 8px;
          text-align: left;
          vertical-align: middle;
        }
        #daily-flash-report-pdf th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        #daily-flash-report-pdf .text-right {
          text-align: right !important;
        }
        #daily-flash-report-pdf .bg-gray-header {
          background-color: #d3d3d3;
          font-weight: bold;
          text-align: center;
        }
        #daily-flash-report-pdf .bg-gray-sub {
          background-color: #f0f0f0;
        }
        #daily-flash-report-pdf .indent {
          padding-left: 20px;
        }
        #daily-flash-report-pdf header {
          text-align: center;
          margin-bottom: 20px;
        }
        #daily-flash-report-pdf header h1 {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
        }
        #daily-flash-report-pdf header p {
          margin: 8px 0 0;
          font-size: 12px;
        }
        #daily-flash-report-pdf footer {
          margin-top: 30px;
          text-align: right;
          font-size: 9pt;
        }
      `}</style>

      <header>
        <h1>Daily Flash Report</h1>
        <p>Date: {formattedReportDate}</p>
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>Statistic</th>
              <th className="text-right">Today Actual</th>
              <th className="text-right">MTD Actual</th>
              <th className="text-right">MTD Last Month</th>
              <th className="text-right">MTD Budget</th>
              <th className="text-right">MTD Variance</th>
              <th className="text-right">YTD Actual</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-header">
              <td colSpan={7}>Rooms Statistics</td>
            </tr>

            <tr>
              <td>Total Available Room</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalAvailableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalAvailableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalAvailableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalAvailableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalAvailableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalAvailableRoom"))}</td>
            </tr>

            <tr>
              <td>Total Block / OOO Room</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalBlockedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalBlockedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalBlockedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalBlockedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalBlockedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalBlockedRoom"))}</td>
            </tr>

            <tr>
              <td>Total Occupied Room</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalOccupiedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalOccupiedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalOccupiedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalOccupiedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalOccupiedRoom"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalOccupiedRoom"))}</td>
            </tr>

            <tr>
              <td>Total Room Sold (Excl. HSE & COM)</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalRoomSold"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalRoomSold"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalRoomSold"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalRoomSold"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalRoomSold"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalRoomSold"))}</td>
            </tr>

            {/* Room Type Breakdown */}
            {roomTypes.map((roomType) => {
              const sales = roomTypeSales[roomType.id] || {};
              return (
                <tr key={roomType.id} className="bg-gray-sub">
                  <td className="indent">- {roomType.name}</td>
                  <td className="text-right">{formatInt(sales.todayActual)}</td>
                  <td className="text-right">{formatInt(sales.mtdActual)}</td>
                  <td className="text-right">{formatInt(sales.mtdLastMonth)}</td>
                  <td className="text-right">{formatInt(sales.mtdBudget)}</td>
                  <td className="text-right">{formatInt(sales.mtdVariance)}</td>
                  <td className="text-right">{formatInt(sales.ytdActual)}</td>
                </tr>
              );
            })}

            <tr>
              <td>Total House Use (HSE)</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalHouseUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalHouseUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalHouseUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalHouseUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalHouseUse"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalHouseUse"))}</td>
            </tr>

            <tr>
              <td>Total Complimentary (COM)</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalComplimentary"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalComplimentary"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalComplimentary"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalComplimentary"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalComplimentary"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalComplimentary"))}</td>
            </tr>

            <tr>
              <td>Total Saleable Room</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalSaleableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalSaleableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalSaleableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalSaleableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalSaleableRoom"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalSaleableRoom"))}</td>
            </tr>

            <tr>
              <td>Total Vacant Room</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalVacantRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalVacantRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalVacantRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalVacantRoom"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalVacantRoom"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalVacantRoom"))}</td>
            </tr>

            <tr>
              <td>Total Walk In</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalWalkIn"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalWalkIn"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalWalkIn"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalWalkIn"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalWalkIn"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalWalkIn"))}</td>
            </tr>

            <tr>
              <td>Total Day Use</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalDayUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalDayUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalDayUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalDayUse"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalDayUse"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalDayUse"))}</td>
            </tr>

            <tr>
              <td>Total Inhouse Guests (Excl. HSE)</td>
              <td className="text-right">{formatInt(getValue(todayActual, "totalInHouseGuests"))}</td>
              <td className="text-right">{formatInt(getValue(mtdActual, "totalInHouseGuests"))}</td>
              <td className="text-right">{formatInt(getValue(mtdLastMonth, "totalInHouseGuests"))}</td>
              <td className="text-right">{formatInt(getValue(mtdBudget, "totalInHouseGuests"))}</td>
              <td className="text-right">{formatInt(getValue(mtdVariance, "totalInHouseGuests"))}</td>
              <td className="text-right">{formatInt(getValue(ytdActual, "totalInHouseGuests"))}</td>
            </tr>

            {/* Average Rate Section */}
            <tr className="bg-gray-header">
              <td colSpan={7}>Average Rate</td>
            </tr>
            <tr>
              <td>Average Room Rate (ARR)</td>
              <td className="text-right">{formatDecimal(getValue(todayActual, "averageRoomRate"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdActual, "averageRoomRate"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdLastMonth, "averageRoomRate"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdBudget, "averageRoomRate"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdVariance, "averageRoomRate"))}</td>
              <td className="text-right">{formatDecimal(getValue(ytdActual, "averageRoomRate"))}</td>
            </tr>
            <tr>
              <td>Average Room Rate (Inc BF)</td>
              <td className="text-right">{formatDecimal(getValue(todayActual, "averageRoomRateIncBF"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdActual, "averageRoomRateIncBF"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdLastMonth, "averageRoomRateIncBF"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdBudget, "averageRoomRateIncBF"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdVariance, "averageRoomRateIncBF"))}</td>
              <td className="text-right">{formatDecimal(getValue(ytdActual, "averageRoomRateIncBF"))}</td>
            </tr>
            <tr>
              <td>Revenue Per Avail. Room (RevPAR)</td>
              <td className="text-right">{formatDecimal(getValue(todayActual, "revenuePerAvailableRoom"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdActual, "revenuePerAvailableRoom"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdLastMonth, "revenuePerAvailableRoom"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdBudget, "revenuePerAvailableRoom"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdVariance, "revenuePerAvailableRoom"))}</td>
              <td className="text-right">{formatDecimal(getValue(ytdActual, "revenuePerAvailableRoom"))}</td>
            </tr>

            {/* Occupancy Section */}
            <tr className="bg-gray-header">
              <td colSpan={7}>Occupancy</td>
            </tr>
            <tr>
              <td>% Room Saleable Occupancy</td>
              <td className="text-right">{formatDecimal(getValue(todayActual, "roomSaleableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdActual, "roomSaleableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdLastMonth, "roomSaleableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdBudget, "roomSaleableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdVariance, "roomSaleableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(ytdActual, "roomSaleableOccupancy"))}%</td>
            </tr>
            <tr>
              <td>% Room Available Occupancy</td>
              <td className="text-right">{formatDecimal(getValue(todayActual, "roomAvailableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdActual, "roomAvailableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdLastMonth, "roomAvailableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdBudget, "roomAvailableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdVariance, "roomAvailableOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(ytdActual, "roomAvailableOccupancy"))}%</td>
            </tr>
            <tr>
              <td>% Occupied Room Occupancy</td>
              <td className="text-right">{formatDecimal(getValue(todayActual, "occupiedRoomOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdActual, "occupiedRoomOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdLastMonth, "occupiedRoomOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdBudget, "occupiedRoomOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(mtdVariance, "occupiedRoomOccupancy"))}%</td>
              <td className="text-right">{formatDecimal(getValue(ytdActual, "occupiedRoomOccupancy"))}%</td>
            </tr>
            <tr>
              <td>% Double Occupancy</td>
              <td className="text-right">{formatDecimal(getValue(todayActual, "doubleOccupancy"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdActual, "doubleOccupancy"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdLastMonth, "doubleOccupancy"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdBudget, "doubleOccupancy"))}</td>
              <td className="text-right">{formatDecimal(getValue(mtdVariance, "doubleOccupancy"))}</td>
              <td className="text-right">{formatDecimal(getValue(ytdActual, "doubleOccupancy"))}</td>
            </tr>
          </tbody>
        </table>
      </main>

      <footer>
        <p>
          <br />
          <strong>Daily Flash Report</strong>
          <br />
          <strong>Printed On:</strong> {currentDate}
        </p>
      </footer>
    </div>
  );
};

export default DailyFlashReportHTML;