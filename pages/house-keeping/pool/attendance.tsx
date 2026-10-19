"use client";
/** M10 — Pool Attendance desktop (menu 1204). */
import React from "react";
import PoolShell from "../../../components/pages/pool/shell";
import PoolAttendance from "../../../components/pages/pool/attendance";

const PoolAttendancePage = () => (
  <PoolShell active="attendance">
    <PoolAttendance />
  </PoolShell>
);

export default PoolAttendancePage;
