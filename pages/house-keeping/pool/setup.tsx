"use client";
/** M10 — Pool Setup desktop (menu 1203). */
import React from "react";
import PoolShell from "../../../components/pages/pool/shell";
import PoolSetup from "../../../components/pages/pool/setup";

const PoolSetupPage = () => (
  <PoolShell active="setup">
    <PoolSetup />
  </PoolShell>
);

export default PoolSetupPage;
