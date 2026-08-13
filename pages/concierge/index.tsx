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
import Baggage from "../../components/pages/bagage";
import CarPark from "../../components/pages/car-park";
import LostAndFound from "../../components/pages/lost-found";
import PhoneBookGroup from "../../components/pages/phonebook-group";
import PhoneBookGroup2 from "../../components/pages/phonebook-group/group2";
import PhoneBookGroup3 from "../../components/pages/phonebook-group/group3";
import PhoneBook from "../../components/pages/phonebook";

const ProfilePage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  const [pathdua, setpathdua] = useState("");
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [ischildren, setischildren] = useState("1");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const guestId = urlParams.get("data");
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
    if (path == "baggage") {
      return <Baggage />;
    } else if (path == "phone-book-group") {
      if (pathdua == "group-2") {
        return <PhoneBookGroup2 />;
      } else if (pathdua == "group-3") {
        return <PhoneBookGroup3 />;
      } else {
        return <PhoneBookGroup />;
      }
    } else if (path == "phone-book") {
      return <PhoneBook />;
    } else if (path == "carpark") {
      return <CarPark />;
    } else if (path == "lost-and-found") {
      return <LostAndFound />;
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
