import React, { useCallback, useEffect, useState } from "react";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTransactionPermission } from "../../../../hooks/useFormPermission";

interface Props {
  date: string;
  onClose: () => void;
  onSuccess: () => void;
  existingRosters?: any[];
}

const CreateScheduleModal: React.FC<Props> = ({ date, onClose, onSuccess }) => {
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const token = datalocal?.data?.access_token;

  const canAssignHousekeeper = useTransactionPermission("assign_housekeeper");

  // Steps: HKSPV = [Shift, Rooms, Review], non-SPV = [Shift, Review]
  const totalSteps = canAssignHousekeeper ? 3 : 2;
  const stepLabels = canAssignHousekeeper
    ? ["Shift", "Rooms", "Review"]
    : ["Shift", "Review"];

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Data ─────────────────────────────────────────────────────────
  const [shifts, setShifts] = useState<any[]>([]);
  const [housekeepers, setHousekeepers] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // ── Selections ───────────────────────────────────────────────────
  const [selectedShiftId, setSelectedShiftId] = useState<number | "">("");
  const [selectedHKIds, setSelectedHKIds] = useState<Set<number>>(new Set());
  const [selectedFloor, setSelectedFloor] = useState<number | "">("");
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<number>>(new Set());

  // ── Fetchers ─────────────────────────────────────────────────────
  const fetchShifts = useCallback(async () => {
    try {
      const res = await FetchData(
        "/cms/housekeeping/shift-roster?limit=100",
        "GET", "", false, token, router, ""
      );
      const sorted = (res?.data || []).sort((a: any, b: any) =>
        a.time_start.localeCompare(b.time_start)
      );
      setShifts(sorted);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const fetchHousekeepers = useCallback(async () => {
    try {
      const res = await FetchData(
        "/cms/housekeeping/service-scheduler/housekeepers",
        "GET", "", false, token, router, ""
      );
      setHousekeepers(
        (res?.data || []).map((u: any) => ({
          id: u.id,
          name: (u.name || "").toUpperCase(),
        }))
      );
    } catch (e) {
      console.error(e);
      setHousekeepers([]);
    }
  }, [token]);

  const fetchFloors = useCallback(async () => {
    try {
      const res = await FetchData(
        "/cms/housekeeping/room-status/master",
        "GET", "", false, token, router, ""
      );
      setFloors(res?.master?.floor || []);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const fetchRoomsByFloor = useCallback(async (floorId: number) => {
    setLoadingRooms(true);
    setSelectedRoomIds(new Set());
    try {
      const res = await FetchData(
        `/cms/housekeeping/room-status?limit=1000&date=${date}&floor=${floorId}`,
        "GET", "", false, token, router, ""
      );
      setRooms(res?.data || []);
    } catch (e) {
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  }, [token, date]);

  // ── Effects ───────────────────────────────────────────────────────
  useEffect(() => { fetchShifts(); }, [fetchShifts]);
  useEffect(() => {
    if (canAssignHousekeeper) {
      fetchHousekeepers();
      fetchFloors();
    }
  }, [canAssignHousekeeper, fetchHousekeepers, fetchFloors]);
  useEffect(() => {
    if (selectedFloor) fetchRoomsByFloor(Number(selectedFloor));
  }, [selectedFloor, fetchRoomsByFloor]);

  // ── Navigation ────────────────────────────────────────────────────
  const isReviewStep = step === totalSteps;

  const goNext = () => {
    setError(null);
    if (step === 1 && !selectedShiftId)
      return setError("Please select a shift");
    if (canAssignHousekeeper && step === 2) {
      if (selectedHKIds.size === 0)
        return setError("Please select at least one housekeeper");
      if (selectedRoomIds.size === 0)
        return setError("Please select at least one room");
    }
    setStep((p) => p + 1);
  };

  const goBack = () => { setError(null); setStep((p) => p - 1); };

  // ── Save ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedShiftId) return;
    setSaving(true);
    try {
      const hkIds = canAssignHousekeeper ? Array.from(selectedHKIds) : [];

      // Kalau non-SPV (tidak pilih HK), kirim 1 entry tanpa user_id
      const payload = hkIds.length > 0
        ? hkIds.map((hkId) => ({
            date,
            shift_id: Number(selectedShiftId),
            user_id: hkId,
            is_assigned: true,
          }))
        : [{ date, shift_id: Number(selectedShiftId), is_assigned: true }];

      const res = await FetchData(
        "/cms/housekeeping/rosters",
        "POST",
        GetEncrypt(JSON.stringify(payload)),
        false, token, router, ""
      );

      if (res?.code === 200) {
        if (canAssignHousekeeper && selectedRoomIds.size > 0) {
          await FetchData(
            "/cms/housekeeping/room-status/batch", "POST",
            GetEncrypt(JSON.stringify({
              housekeeper: housekeepers
                .filter((u) => selectedHKIds.has(u.id))
                .map((u) => ({ value: u.id, label: u.name })),
              selectedRoomId: Object.fromEntries(
                Array.from(selectedRoomIds).map((id) => [id, true])
              ),
              date,
            })),
            false, token, router, ""
          );
        }

        if (res?.skipped?.length > 0) {
          alert(`Tersimpan, tapi ada yang dilewati:\n${res.skipped.join('\n')}`);
        }

        onSuccess();
        onClose();

      } else if (res?.code === 409) {
        // Semua duplicate, tidak ada yang tersimpan
        setError(res?.message);
      } else {
        setError(res?.message || "Failed to save");
      }
    } catch (e) {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  // ── Room helpers ──────────────────────────────────────────────────
  const toggleRoom = (id: number) =>
    setSelectedRoomIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllRooms = () =>
    setSelectedRoomIds(
      selectedRoomIds.size === rooms.length
        ? new Set()
        : new Set(rooms.map((r) => r.id))
    );

  const toggleAllHK = () =>
    setSelectedHKIds(
      selectedHKIds.size === housekeepers.length
        ? new Set()
        : new Set(housekeepers.map((u) => u.id))
    );

  // ── Derived ───────────────────────────────────────────────────────
  const selectedShift = shifts.find((s) => s.id === selectedShiftId);
  const selectedFloorLabel = floors.find((f: any) => f.value === selectedFloor)?.label || "";

  // ── Styles ────────────────────────────────────────────────────────
  const s = {
    overlay: {
      position: "fixed" as const, inset: 0,
      background: "rgba(0,0,0,0.45)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    },
    modal: {
      background: "#fff", borderRadius: 16, width: "100%", maxWidth: 540,
      maxHeight: "90vh", display: "flex", flexDirection: "column" as const,
      boxShadow: "0 24px 80px rgba(0,0,0,0.22)", overflow: "hidden",
    },
    header: {
      padding: "16px 20px 14px", borderBottom: "1px solid #F3F4F6",
      display: "flex", justifyContent: "space-between",
    },
    body: { padding: "16px 20px", overflowY: "auto" as const, flex: 1 },
    footer: {
      padding: "12px 20px", borderTop: "1px solid #F3F4F6",
      display: "flex", gap: 10,
    },
    label: { fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 10 } as React.CSSProperties,
    card: (selected: boolean) => ({
      padding: 12,
      border: `2px solid ${selected ? "#2563EB" : "#E5E7EB"}`,
      borderRadius: 10, marginBottom: 8,
      background: selected ? "#EFF6FF" : "#fff",
      cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
    }),
    error: {
      background: "#FEF2F2", border: "1px solid #FECACA",
      color: "#991B1B", padding: "10px", borderRadius: 8, marginBottom: 12,
    },
    roomRow: (selected: boolean) => ({
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px",
      border: `2px solid ${selected ? "#2563EB" : "#E5E7EB"}`,
      borderRadius: 10, marginBottom: 6,
      background: selected ? "#EFF6FF" : "#fff",
      cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
    }),
  };

  // ── Step Indicator ────────────────────────────────────────────────
  const renderStepIndicator = () => (
    <div style={{ padding: "14px 24px 0", display: "flex", alignItems: "flex-start", gap: 8 }}>
      {stepLabels.map((label, i) => {
        const sNum = i + 1;
        const done = step > sNum;
        const active = step === sNum;
        return (
          <React.Fragment key={sNum}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? "#10B981" : active ? "#2563EB" : "#E5E7EB",
                color: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 12, fontWeight: 700,
              }}>
                {done ? "✓" : sNum}
              </div>
              <div style={{ fontSize: 10, marginTop: 4, color: active ? "#2563EB" : "#9CA3AF" }}>
                {label}
              </div>
            </div>
            {i < stepLabels.length - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: step > sNum ? "#10B981" : "#E5E7EB",
                marginTop: 14,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ── Step Content ──────────────────────────────────────────────────
  const renderStepContent = () => {
    // ── Step 1: Pilih Shift ──
    if (step === 1) {
      return (
        <div>
          <p style={s.label}>SELECT SHIFT</p>
          {shifts.map((shift) => (
            <div
              key={shift.id}
              onClick={() => { setSelectedShiftId(shift.id); setSelectedHKIds(new Set()); }}
              style={s.card(selectedShiftId === shift.id)}
            >
              <strong>{shift.name.toUpperCase()}</strong>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                {shift.time_start} – {shift.time_end}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── Step 2 (HKSPV): Pilih HK + Lantai + Room ──
    if (canAssignHousekeeper && step === 2) {
      const allHKSelected = housekeepers.length > 0 && selectedHKIds.size === housekeepers.length;
      const allRoomsSelected = rooms.length > 0 && selectedRoomIds.size === rooms.length;

      return (
        <div>
          {/* Pilih HK */}
          <p style={s.label}>PILIH HOUSEKEEPER</p>
          {housekeepers.length === 0 ? (
            <div style={{ color: "#9CA3AF", fontStyle: "italic", marginBottom: 16 }}>
              Tidak ada housekeeper tersedia
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                <button onClick={toggleAllHK} style={{
                  fontSize: 12, color: "#2563EB", background: "none",
                  border: "none", cursor: "pointer", fontWeight: 600, padding: 0,
                }}>
                  {allHKSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {housekeepers.map((u) => {
                  const selected = selectedHKIds.has(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedHKIds((prev) => {
                        const next = new Set(prev);
                        next.has(u.id) ? next.delete(u.id) : next.add(u.id);
                        return next;
                      })}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 14px", borderRadius: 999,
                        border: `2px solid ${selected ? "#2563EB" : "#E5E7EB"}`,
                        background: selected ? "#EFF6FF" : "#fff",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: `2px solid ${selected ? "#2563EB" : "#D1D5DB"}`,
                        background: selected ? "#2563EB" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {selected && <span style={{ color: "#fff", fontSize: 9 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize: 13, fontWeight: selected ? 700 : 400,
                        color: selected ? "#1D4ED8" : "#374151",
                      }}>
                        👤 {u.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ height: 1, background: "#F3F4F6", margin: "4px 0 16px" }} />

          {/* Pilih Lantai */}
          <p style={s.label}>PILIH LANTAI</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {floors.map((f: any) => (
              <button
                key={f.value}
                onClick={() => setSelectedFloor(f.value)}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  border: `2px solid ${selectedFloor === f.value ? "#2563EB" : "#E5E7EB"}`,
                  background: selectedFloor === f.value ? "#EFF6FF" : "#fff",
                  color: selectedFloor === f.value ? "#2563EB" : "#374151",
                  fontWeight: selectedFloor === f.value ? 700 : 400,
                  cursor: "pointer", fontSize: 13,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Pilih Room */}
          {selectedFloor ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ ...s.label, marginBottom: 0 }}>
                  PILIH KAMAR — {selectedFloorLabel}
                  {rooms.length > 0 && (
                    <span style={{ color: "#6B7280", fontWeight: 400 }}>
                      {" "}({selectedRoomIds.size}/{rooms.length} dipilih)
                    </span>
                  )}
                </p>
                {rooms.length > 0 && (
                  <button onClick={toggleAllRooms} style={{
                    fontSize: 12, color: "#2563EB", background: "none",
                    border: "none", cursor: "pointer", fontWeight: 600, padding: 0,
                  }}>
                    {allRoomsSelected ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>
              {loadingRooms ? (
                <div style={{ textAlign: "center", padding: 32, color: "#9CA3AF" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                  <div style={{ fontSize: 13 }}>Memuat kamar...</div>
                </div>
              ) : rooms.length === 0 ? (
                <div style={{ color: "#9CA3AF", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                  Tidak ada kamar di lantai ini
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {rooms.map((room: any) => {
                    const selected = selectedRoomIds.has(room.id);
                    return (
                      <div key={room.id} onClick={() => toggleRoom(room.id)} style={s.roomRow(selected)}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                          border: `2px solid ${selected ? "#2563EB" : "#D1D5DB"}`,
                          background: selected ? "#2563EB" : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {selected && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                          {room.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#9CA3AF" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
              <div style={{ fontSize: 13 }}>Pilih lantai untuk melihat daftar kamar</div>
            </div>
          )}
        </div>
      );
    }

    // ── Review (last step) ──
    if (isReviewStep) {
      return (
        <div>
          <div style={{ background: "#F8FAFC", padding: 14, borderRadius: 10, marginBottom: 16 }}>
            <p style={s.label}>SUMMARY</p>
            <div><strong>Date:</strong> {date}</div>
            <div>
              <strong>Shift:</strong> {selectedShift?.name?.toUpperCase()} (
              {selectedShift?.time_start} – {selectedShift?.time_end})
            </div>
            {canAssignHousekeeper && selectedRoomIds.size > 0 && (
              <div>
                <strong>Rooms Assigned:</strong> {selectedRoomIds.size} Rooms {selectedFloorLabel}
              </div>
            )}
          </div>

          {canAssignHousekeeper && selectedHKIds.size > 0 && (
            <>
              <p style={s.label}>HOUSEKEEPERS ASSIGNED</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {housekeepers
                  .filter((u) => selectedHKIds.has(u.id))
                  .map((u) => (
                    <span key={u.id} style={{
                      background: "#D1FAE5", color: "#065F46",
                      padding: "6px 12px", borderRadius: 999, fontSize: 13,
                    }}>
                      👤 {u.name}
                    </span>
                  ))}
              </div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Assign Housekeeper</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>📅 {date}</div>
          </div>
          <button onClick={onClose} style={{
            border: "none", background: "#F3F4F6",
            width: 30, height: 30, borderRadius: 8, fontSize: 18, cursor: "pointer",
          }}>✕</button>
        </div>

        {renderStepIndicator()}

        <div style={s.body}>
          {error && <div style={s.error}>{error}</div>}
          {renderStepContent()}
        </div>

        <div style={s.footer}>
          <button
            onClick={step === 1 ? onClose : goBack}
            style={{
              flex: 1, padding: "10px", border: "1px solid #ccc",
              borderRadius: 8, cursor: "pointer", background: "#fff",
            }}
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {!isReviewStep ? (
            <button onClick={goNext} style={{
              flex: 1, padding: "10px", background: "#2563EB",
              color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", fontWeight: 600,
            }}>
              Next
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} style={{
              flex: 1, padding: "10px",
              background: saving ? "#93C5FD" : "#2563EB",
              color: "#fff", border: "none", borderRadius: 8,
              cursor: saving ? "not-allowed" : "pointer", fontWeight: 600,
            }}>
              {saving ? "Saving..." : "Save Schedule"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;