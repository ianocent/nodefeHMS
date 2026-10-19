"use client";
/** M10 — Pool Area desktop (menu 1202). */
import React from "react";
import PoolShell from "../../../components/pages/pool/shell";
import PoolAreas from "../../../components/pages/pool/areas";

const PoolAreaPage = () => (
  <PoolShell active="area">
    <PoolAreas />
  </PoolShell>
);

export default PoolAreaPage;
