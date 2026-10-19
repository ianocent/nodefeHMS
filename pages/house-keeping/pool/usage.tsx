"use client";
/** M10 — Pool Usage desktop (menu 1205). */
import React from "react";
import PoolShell from "../../../components/pages/pool/shell";
import PoolUsage from "../../../components/pages/pool/usage";

const PoolUsagePage = () => (
  <PoolShell active="usage">
    <PoolUsage />
  </PoolShell>
);

export default PoolUsagePage;
