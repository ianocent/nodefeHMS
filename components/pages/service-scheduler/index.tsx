import React, { useEffect, useState, useCallback } from "react";
import Seo from "../../common/seo";
import { FetchData, GetDecrypt } from "../../../components/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CreateScheduleModal from "./create-schedule-modal";
import { useTransactionPermission } from "../../../hooks/useFormPermission";
// ─── Mobile hook ─────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShiftRoster {
  id: number;
  name: string;
  time_start: string;
  time_end: string;
  description?: string;
}

interface AssignedUser {
  id: number;
  name: string;
  total_rooms?: number;
  floors?: string[];
}

interface Roster {
  id: number;
  date: string;
  shift_id: number;
  roster_list_id: number;
  is_assigned: boolean;
  assigned_users?: AssignedUser[];
  shift?: ShiftRoster;
}

type ViewMode = "month" | "week";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SHIFT_COLORS = [
  { bg: "#E8F4FD", border: "#2196F3", text: "#1565C0" },
  { bg: "#E8F5E9", border: "#4CAF50", text: "#2E7D32" },
  { bg: "#FFF3E0", border: "#FF9800", text: "#E65100" },
  { bg: "#FCE4EC", border: "#E91E63", text: "#880E4F" },
  { bg: "#F3E5F5", border: "#9C27B0", text: "#4A148C" },
  { bg: "#E0F2F1", border: "#009688", text: "#004D40" },
];

function getShiftColor(shiftId: number) {
  return SHIFT_COLORS[shiftId % SHIFT_COLORS.length];
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getWeekDates(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  const dow = date.getDay();
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() - dow + i);
    dates.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }
  return dates;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ShiftBadge = ({
  roster,
  compact = false,
}: {
  roster: Roster;
  compact?: boolean;
}) => {
  const color = getShiftColor(roster.shift_id);
  return (
    <div
      style={{
        background: color.bg,
        borderLeft: `3px solid ${color.border}`,
        color: color.text,
        padding: compact ? "1px 4px" : "3px 6px",
        borderRadius: "0 4px 4px 0",
        fontSize: compact ? "10px" : "11px",
        fontWeight: 600,
        marginBottom: 2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
      }}
      title={`${roster.shift?.name ?? "Shift"} | ${roster.shift?.time_start ?? ""} - ${roster.shift?.time_end ?? ""}`}
    >
      {compact
        ? roster.shift?.name ?? `Shift #${roster.shift_id}`
        : `${roster.shift?.name ?? "Shift"} ${roster.shift?.time_start ?? ""}-${roster.shift?.time_end ?? ""}`}
    </div>
  );
};

// ─── Day Cell (Month View) ────────────────────────────────────────────────────

const DayCell = ({
  dateStr,
  rosters,
  isToday,
  isCurrentMonth,
  onClick,
  isMobile,
}: {
  dateStr: string;
  rosters: Roster[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: (dateStr: string) => void;
  isMobile: boolean;
}) => {
  const day = parseInt(dateStr.split("-")[2]);
  const maxVisible = 3;
  const overflow = rosters.length - maxVisible;

  if (isMobile) {
    return (
      <div
        onClick={() => onClick(dateStr)}
        style={{
          padding: "4px 2px 6px",
          borderRight: "1px solid #E5E7EB",
          borderBottom: "1px solid #E5E7EB",
          background: isToday ? "#EFF6FF" : isCurrentMonth ? "#fff" : "#F9FAFB",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          userSelect: "none",
          minHeight: 44,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: isToday ? "#2563EB" : "transparent",
            color: isToday ? "#fff" : isCurrentMonth ? "#111827" : "#C4C4C4",
            fontSize: 12,
            fontWeight: isToday ? 700 : 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {day}
        </div>
        {rosters.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
            {rosters.slice(0, 3).map((r) => {
              const color = getShiftColor(r.shift_id);
              return (
                <span
                  key={r.id}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: color.border,
                    display: "inline-block",
                  }}
                />
              );
            })}
            {rosters.length > 3 && (
              <span style={{ fontSize: 8, color: "#9CA3AF", lineHeight: "5px" }}>+</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(dateStr)}
      style={{
        minHeight: 80,
        padding: "4px 4px 2px",
        borderRight: "1px solid #E5E7EB",
        borderBottom: "1px solid #E5E7EB",
        background: isToday ? "#EFF6FF" : isCurrentMonth ? "#fff" : "#F9FAFB",
        cursor: "pointer",
        transition: "background 0.15s",
        position: "relative",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (!isToday) (e.currentTarget as HTMLDivElement).style.background = "#F0F9FF";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = isToday
          ? "#EFF6FF"
          : isCurrentMonth
          ? "#fff"
          : "#F9FAFB";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: isToday ? "#2563EB" : "transparent",
          color: isToday ? "#fff" : isCurrentMonth ? "#111827" : "#9CA3AF",
          fontSize: 12,
          fontWeight: isToday ? 700 : 500,
          marginBottom: 3,
        }}
      >
        {day}
      </div>
      {rosters.slice(0, maxVisible).map((r) => (
        <ShiftBadge key={r.id} roster={r} compact />
      ))}
      {overflow > 0 && (
        <div style={{ fontSize: 10, color: "#6B7280", paddingLeft: 4 }}>
          +{overflow} more
        </div>
      )}
    </div>
  );
};

// ─── Day Modal ────────────────────────────────────────────────────────────────

const DayModal = ({
  dateStr,
  rosters,
  onClose,
  canAssignHousekeeper,
  onCreateShift,
}: {
  dateStr: string;
  rosters: Roster[];
  onClose: () => void;
  canAssignHousekeeper: boolean;
  onCreateShift: (date: string) => void;
}) => {
  const [d, m, y] = dateStr.split("-").reverse();
  const label = `${d} ${MONTHS[parseInt(m) - 1]} ${y}`;

  // Group rosters by shift_id
  const groupedByShift = rosters.reduce((acc, roster) => {
    const key = roster.shift_id;
    if (!acc[key]) acc[key] = { shift: roster.shift, users: [] };
    acc[key].users.push(...(roster.assigned_users ?? []));
    return acc;
  }, {} as Record<number, { shift: ShiftRoster; users: AssignedUser[] }>);

  const [openShifts, setOpenShifts] = useState<Record<number, boolean>>(
    // semua collapse by default, buka pertama saja
    Object.keys(groupedByShift).reduce((acc, key, idx) => {
      acc[Number(key)] = idx === 0;
      return acc;
    }, {} as Record<number, boolean>)
  );

  const toggleShift = (shiftId: number) =>
    setOpenShifts((prev) => ({ ...prev, [shiftId]: !prev[shiftId] }));

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
        zIndex: 1000, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 12,
          width: "100%", maxWidth: 480,
          // ── fix: fixed height + flex column supaya bisa scroll
          height: "85vh", maxHeight: 640,
          display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header (fixed, tidak ikut scroll) ── */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #F3F4F6",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              📅 {label}
            </h3>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              {rosters.length === 0
                ? "Belum ada shift"
                : `${Object.keys(groupedByShift).length} shift · ${rosters.length} assignment`}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none", background: "#F3F4F6", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer", fontSize: 14,
            }}
          >✕</button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "12px 16px",
          WebkitOverflowScrolling: "touch" as any,
        }}>
          {rosters.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <p style={{ color: "#9CA3AF", marginBottom: 20 }}>
                Belum ada shift untuk tanggal ini.
              </p>
              {canAssignHousekeeper && (
                <button
                  onClick={() => onCreateShift(dateStr)}
                  style={{
                    background: "#2563EB", color: "#fff", border: "none",
                    borderRadius: 8, padding: "12px 24px", fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Assign Housekeeper
                </button>
              )}
            </div>
          ) : (
            Object.entries(groupedByShift).map(([shiftId, { shift, users }]) => {
              const isOpen = openShifts[Number(shiftId)] ?? false;
              const totalRooms = users.reduce((s, u) => s + (u.total_rooms ?? 0), 0);

              return (
                <div
                  key={shiftId}
                  style={{
                    marginBottom: 8, borderRadius: 10,
                    border: "1px solid #E5E7EB", overflow: "hidden",
                  }}
                >
                  {/* Shift header — klik untuk collapse */}
                  <div
                    onClick={() => toggleShift(Number(shiftId))}
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", padding: "12px 14px",
                      background: isOpen ? "#F0F9FF" : "#F9FAFB",
                      cursor: "pointer", userSelect: "none",
                      transition: "background 0.15s",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                        {shift?.name ?? `Shift #${shiftId}`}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                        🕒 {shift?.time_start} – {shift?.time_end}
                        <span style={{ marginLeft: 8 }}>
                          👥 {users.length} HK · 🏠 {totalRooms} Rooms
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        background: "#D1FAE5", color: "#065F46",
                        padding: "3px 10px", borderRadius: 999,
                        fontSize: 11, fontWeight: 600,
                      }}>
                        Assigned
                      </span>
                      <span style={{ color: "#9CA3AF", fontSize: 14 }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* User list — collapsible */}
                  {isOpen && (
                    <div style={{ padding: "8px 14px 12px" }}>
                      {users.length === 0 ? (
                        <div style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
                          Tidak ada housekeeper
                        </div>
                      ) : (
                        users.map((user, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex", justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 10px", marginBottom: 6,
                              background: "#fff", borderRadius: 8,
                              border: "1px solid #E5E7EB",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span>👤</span>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</span>
                            </div>
                            <span style={{ fontSize: 12, color: "#4B5563" }}>
                              🏠 <strong>{user.total_rooms ?? 0}</strong> Rooms
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer (fixed, tidak ikut scroll) ── */}
        {rosters.length > 0 && canAssignHousekeeper && (
          <div style={{
            padding: "12px 16px", borderTop: "1px solid #F3F4F6", flexShrink: 0,
          }}>
            <button
              onClick={() => onCreateShift(dateStr)}
              style={{
                width: "100%", padding: "12px",
                background: "#EFF6FF", color: "#2563EB",
                border: "1px dashed #2563EB", borderRadius: 8,
                fontWeight: 600, cursor: "pointer", fontSize: 13,
              }}
            >
              + Assign More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ServiceScheduler = () => {
  const today = new Date();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [scheduleMap, setScheduleMap] = useState<Record<string, Roster[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekDay, setWeekDay] = useState(today.getDate());

  // ── State modal create ──
  const [createModalDate, setCreateModalDate] = useState<string | null>(null);

  const GLOBALURI = "/cms/housekeeping/service-scheduler";
  // const canAssignHousekeeper = datalocal?.data?.role?.includes("hkspv") || false;
  const canAssignHousekeeper = useTransactionPermission("assign_housekeeper");

  const fetchSchedule = useCallback(async (year: number, month: number) => {
    setLoading(true);
    try {
      const dateFrom = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = getDaysInMonth(year, month);
      const dateTo = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;

      const uri = `${GLOBALURI}?date_from=${dateFrom}&date_to=${dateTo}&limit=1000`;

      const res = await FetchData(
        uri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      const items: Roster[] = res?.data ?? [];
      const map: Record<string, Roster[]> = {};
      items.forEach((item) => {
        const key = item.date?.split(" ")[0] ?? item.date;
        if (!map[key]) map[key] = [];
        map[key].push(item);
      });
      setScheduleMap(map);
    } catch (e) {
      console.error("Failed to fetch schedule", e);
    } finally {
      setLoading(false);
    }
  }, [datalocal?.data?.access_token]);

  useEffect(() => {
    fetchSchedule(currentYear, currentMonth);
  }, [currentYear, currentMonth, fetchSchedule]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function goToday() {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setWeekDay(today.getDate());
  }

  // Handler: buka CreateScheduleModal dari DayModal
  function handleOpenCreateModal(date: string) {
    setSelectedDate(null); // tutup DayModal dulu
    setCreateModalDate(date);
  }

  // ── Month View ──
  function renderMonthView() {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const prevMonthDays = getDaysInMonth(
      currentMonth === 0 ? currentYear - 1 : currentYear,
      currentMonth === 0 ? 11 : currentMonth - 1
    );
    const cells: JSX.Element[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = toDateStr(y, m, day);
      cells.push(
        <DayCell
          key={`prev-${i}`}
          dateStr={dateStr}
          rosters={scheduleMap[dateStr] ?? []}
          isToday={false}
          isCurrentMonth={false}
          onClick={setSelectedDate}
          isMobile={isMobile}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = toDateStr(currentYear, currentMonth, day);
      const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
      cells.push(
        <DayCell
          key={day}
          dateStr={dateStr}
          rosters={scheduleMap[dateStr] ?? []}
          isToday={dateStr === todayStr}
          isCurrentMonth={true}
          onClick={setSelectedDate}
          isMobile={isMobile}
        />
      );
    }

    const total = cells.length;
    const rows = Math.ceil(total / 7);
    const trailing = rows * 7 - total;
    for (let i = 1; i <= trailing; i++) {
      const m = currentMonth === 11 ? 0 : currentMonth + 1;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = toDateStr(y, m, i);
      cells.push(
        <DayCell
          key={`next-${i}`}
          dateStr={dateStr}
          rosters={scheduleMap[dateStr] ?? []}
          isToday={false}
          isCurrentMonth={false}
          onClick={setSelectedDate}
          isMobile={isMobile}
        />
      );
    }

    const dayLabels = isMobile
      ? ["S", "M", "T", "W", "T", "F", "S"]
      : DAYS;

    return (
      <div style={{ overflowX: isMobile ? "hidden" : "auto" }}>
        <div style={{ minWidth: isMobile ? "unset" : 560 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderTop: "1px solid #E5E7EB",
              borderLeft: "1px solid #E5E7EB",
            }}
          >
            {dayLabels.map((d, idx) => (
              <div
                key={idx}
                style={{
                  padding: isMobile ? "6px 0" : "8px 0",
                  textAlign: "center",
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 700,
                  color: idx === 0 || idx === 6 ? "#EF4444" : "#6B7280",
                  borderRight: "1px solid #E5E7EB",
                  borderBottom: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                }}
              >
                {d}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderLeft: "1px solid #E5E7EB",
            }}
          >
            {cells}
          </div>
        </div>
      </div>
    );
  }

  // ── Week View ──
  function renderWeekView() {
    const weekDates = getWeekDates(currentYear, currentMonth, weekDay);
    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

    return (
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(100px, 1fr))",
            minWidth: 560,
            borderTop: "1px solid #E5E7EB",
            borderLeft: "1px solid #E5E7EB",
          }}
        >
          {weekDates.map((dateStr, idx) => {
            const parts = dateStr.split("-");
            const day = parseInt(parts[2]);
            const isToday = dateStr === todayStr;
            const rosters = scheduleMap[dateStr] ?? [];
            return (
              <div
                key={dateStr}
                style={{
                  borderRight: "1px solid #E5E7EB",
                  borderBottom: "1px solid #E5E7EB",
                  minHeight: 200,
                }}
              >
                <div
                  style={{
                    padding: "8px 4px",
                    textAlign: "center",
                    borderBottom: "1px solid #E5E7EB",
                    background: isToday ? "#EFF6FF" : "#F9FAFB",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: idx === 0 || idx === 6 ? "#EF4444" : "#6B7280",
                      fontWeight: 700,
                    }}
                  >
                    {DAYS[idx]}
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isToday ? "#2563EB" : "transparent",
                      color: isToday ? "#fff" : "#111827",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "2px auto 0",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {day}
                  </div>
                </div>
                <div style={{ padding: 4 }}>
                  {rosters.length === 0 ? (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#D1D5DB",
                        textAlign: "center",
                        paddingTop: 8,
                      }}
                    >
                      —
                    </div>
                  ) : (
                    rosters.map((r) => <ShiftBadge key={r.id} roster={r} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Legend ──
  function renderLegend() {
    const allShifts: Record<number, ShiftRoster> = {};
    Object.values(scheduleMap).forEach((rosters) => {
      rosters.forEach((r) => {
        if (r.shift && !allShifts[r.shift_id]) {
          allShifts[r.shift_id] = r.shift;
        }
      });
    });
    const entries = Object.entries(allShifts);
    if (entries.length === 0) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {entries.map(([id, shift]) => {
          const color = getShiftColor(parseInt(id));
          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: color.bg,
                border: `1px solid ${color.border}`,
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 11,
                color: color.text,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color.border,
                  display: "inline-block",
                }}
              />
              {shift.name} ({shift.time_start}–{shift.time_end})
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <Seo title="Service Scheduler | Housekeeping" />

      <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#111827" }}>
        {/* ── Header Bar ── */}
        <div
          style={{
            display: "flex",
            flexWrap: isMobile ? "nowrap" : "wrap",
            gap: isMobile ? 6 : 8,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          {/* Left: nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 4 : 6,
              minWidth: 0,
              flex: 1,
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                ...navBtnStyle,
                width: isMobile ? 30 : 32,
                height: isMobile ? 30 : 32,
                fontSize: isMobile ? 16 : 18,
                flexShrink: 0,
              }}
              title="Previous month"
            >
              ‹
            </button>

            <div
              style={{
                minWidth: isMobile ? 0 : 160,
                flex: isMobile ? 1 : undefined,
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 16,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {MONTHS[currentMonth]} {currentYear}
              </span>
            </div>

            <button
              onClick={nextMonth}
              style={{
                ...navBtnStyle,
                width: isMobile ? 30 : 32,
                height: isMobile ? 30 : 32,
                fontSize: isMobile ? 16 : 18,
                flexShrink: 0,
              }}
              title="Next month"
            >
              ›
            </button>
          </div>

          {/* Right: view toggle + loading */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 4 : 8,
              flexShrink: 0,
            }}
          >
            {loading && !isMobile && (
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>Loading...</span>
            )}

            <button
              onClick={goToday}
              style={{
                ...todayBtnStyle,
                height: isMobile ? 30 : undefined,
                padding: isMobile ? "0 10px" : "5px 12px",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              Today
            </button>

            <div
              style={{
                display: "flex",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {(["month", "week"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  style={{
                    padding: isMobile ? "6px 10px" : "6px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: viewMode === v ? "#2563EB" : "#fff",
                    color: viewMode === v ? "#fff" : "#374151",
                    transition: "all 0.15s",
                    minWidth: isMobile ? 54 : undefined,
                  }}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Calendar ── */}
        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {viewMode === "month" ? renderMonthView() : renderWeekView()}
        </div>

        {/* ── Legend ── */}
        {renderLegend()}

        {/* ── Day Modal ── */}
        {selectedDate && (
          <DayModal
            dateStr={selectedDate}
            rosters={scheduleMap[selectedDate] ?? []}
            onClose={() => setSelectedDate(null)}
            canAssignHousekeeper={canAssignHousekeeper}
            onCreateShift={handleOpenCreateModal}
          />
        )}

        {/* ── Create Schedule Modal ── */}
        {createModalDate && (
          <CreateScheduleModal
            date={createModalDate}
            onClose={() => setCreateModalDate(null)}
            onSuccess={() => {
              setCreateModalDate(null);
              fetchSchedule(currentYear, currentMonth);
            }}
            existingRosters={scheduleMap[createModalDate] ?? []}   // ← ini penting
          />
        )}
      </div>
    </>
  );
};

// ─── Shared button styles ─────────────────────────────────────────────────────

const navBtnStyle: React.CSSProperties = {
  border: "1px solid #E5E7EB",
  background: "#fff",
  borderRadius: 8,
  width: 32,
  height: 32,
  cursor: "pointer",
  fontSize: 18,
  color: "#374151",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};

const todayBtnStyle: React.CSSProperties = {
  border: "1px solid #E5E7EB",
  background: "#fff",
  borderRadius: 8,
  padding: "5px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  color: "#374151",
};

export default ServiceScheduler;