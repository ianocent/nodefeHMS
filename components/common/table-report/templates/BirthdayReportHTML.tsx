import React from "react";

interface BirthdayReportHTMLProps {
  startDate: string;
  endDate: string;
  reportData: any[];
}

const BirthdayReportHTML: React.FC<BirthdayReportHTMLProps> = ({
  startDate,
  endDate,
  reportData,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "24px" }}>
      <h2 style={{ margin: 0 }}>Birthday Report</h2>
      <p style={{ margin: "4px 0 16px", color: "#666" }}>
        Period: {startDate} - {endDate}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Guest</th>
            <th style={thStyle}>Room</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(reportData) ? reportData : []).map(
            (guest: any, i: number) => (
              <tr key={i}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>
                  {guest?.name || guest?.guest_name || "-"}
                </td>
                <td style={tdStyle}>{guest?.room || guest?.room_no || "-"}</td>
                <td style={tdStyle}>
                  {guest?.date || guest?.birthday || "-"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {(!reportData || reportData.length === 0) && (
        <p style={{ color: "#999", marginTop: "16px" }}>
          No birthday data for this period.
        </p>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
  background: "#f5f5f5",
};
const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default BirthdayReportHTML;