"use client";
/** M10 — Pool desktop hub (menu 1201). Default = Pool Attendance (menu 1204). */
import React from "react";
import PoolShell from "../../../components/pages/pool/shell";
import PoolAttendance from "../../../components/pages/pool/attendance";

const PoolDesktopHub = () => (
  <PoolShell active="attendance">
    <PoolAttendance />
  </PoolShell>
);

export default PoolDesktopHub;
