import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import Guest from "../../components/pages/guest/index";

import { useRouter } from "next/router";
import ReservationFolio from "../../components/pages/reservation-folio";
import AuditLog from "../../components/pages/guest-audit-log";
import CompanyProfile from "../../components/pages/company-profile";
import CompanyOthers from "../../components/pages/company-others";
import CompanyDepartment from "../../components/pages/company-department";
import ContactPerson from "../../components/pages/contact-person";
import CompanyActivity from "../../components/pages/company-activity";
import CompanyGuest from "../../components/pages/company-guest";
import ArTransaction from "../../components/pages/ar-transaction";
import CompanyDocument from "../../components/pages/company-document";
import CompanyStatistic from "../../components/pages/company-statistic";
import CompanyBillingSetup from "../../components/pages/company-billing-setup";
import CompanyAuditLog from "../../components/pages/company-auditlog";
import GuestDocument from "../../components/pages/guest-document";
import ListView from "../../components/pages/security-audit/index";
import CompanyReservation from "../../components/pages/company-reservation";
import MergeGuest from "../../components/pages/merge-guest";
import ContractRate from "../../components/pages/company-contract-rate";

const ProfilePage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const [module, setmodule] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const guestId = urlParams.get("data");
    const module = urlParams.get("module");
    setmodule(module);
    if (guestId) {
      setischildren(guestId);
    }
    setparentid(parent);
    setadd(add);
    setpath(window.location.pathname.split("/")[2]);
    setpathdua(window.location.pathname.split("/")[3]);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });
  function RouteInit() {
    if (path == "guest") {
      if (pathdua == "reservation") {
        return <ReservationFolio />;
      } else if (pathdua == "security-audit") {
        const urlParams = new URLSearchParams(window.location.search);
        return <ListView module="GuestProfile" id={urlParams.get("data")} />;
      } else if (pathdua == "document") {
        return <GuestDocument />;
      } else {
        return <Guest />;
      }
    } else if (path == "company") {
      if (pathdua == "others") {
        return <CompanyOthers />;
      } else if (pathdua == "department") {
        return <CompanyDepartment />;
      } else if (pathdua == "contact-person") {
        return <ContactPerson />;
      } else if (pathdua == "activity") {
        return <CompanyActivity />;
      } else if (pathdua == "reservation") {
        return <CompanyReservation />;
      } else if (pathdua == "guest") {
        return <CompanyGuest />;
      } else if (pathdua == "contract-rate") {
        return <ContractRate />;
      } else if (pathdua == "ar-transaction") {
        return <ArTransaction />;
      } else if (pathdua == "document") {
        return <CompanyDocument />;
      } else if (pathdua == "statistic") {
        return <CompanyStatistic />;
      } else if (pathdua == "billing-setup") {
        return <CompanyBillingSetup />;
      } else if (pathdua == "security-audit") {
        const urlParams = new URLSearchParams(window.location.search);
        return <ListView module={module} id={urlParams.get("data")} />;
      } else {
        return <CompanyProfile />;
      }
    } else if (path == "merge") {
      return <MergeGuest />;
    } else {
      return <div></div>;
    }
  }
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
      <PaperBase>
        <Tabs active={path} idparent={parentid} ischildren={ischildren} />

        {RouteInit()}
      </PaperBase>
    </LayoutComponent>
  );
};

export default ProfilePage;
