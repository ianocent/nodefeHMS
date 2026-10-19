"use client";
/** M10 — Pool Recap desktop (menu 1206). */
import React from "react";
import PoolShell from "../../../components/pages/pool/shell";
import PoolRecap from "../../../components/pages/pool/recap";

const PoolRecapPage = () => (
  <PoolShell active="recap">
    <PoolRecap />
  </PoolShell>
);

export default PoolRecapPage;
