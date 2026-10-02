import React, { useEffect, useState } from "react";
import CodeBilingPage from "../../components/pages/code-billing/index";
import Tabs from "../../components/common/tab";
import PaperBase from "../../components/common/paper/PaperBase";
import CodeGlsPage from "../../components/pages/code-gls/index";
import Bar from "../../components/pages/bar/index";
import Rate from "../../components/pages/rate/index";

import RateLink from "../../components/pages/rate-link-listing/index";
import RateLinkRate from "../../components/pages/rate-link-listing-rate/index";
import SecurityAudit from "../../components/pages/security-audit/index";
import RateBar from "../../components/pages/rate-bar/index";
import RateRate from "../../components/pages/rate-rate/index";
import RateCompany from "../../components/pages/rate-company/index";
import RateInformation from "../../components/pages/rate-information/form";
import RatePromotion from "../../components/pages/rate-promotion/index";
import Promotion from "../../components/pages/promotion/index";
import HolidayEvent from "../../components/pages/holiday/index";
import Allotment from "../../components/pages/allotment/index";
import Overbooking from "../../components/pages/overbooking/index";
import YieldManagement from "../../components/pages/yield-management";
import EventManagement from "../../components/pages/event-management";

import { useRouter } from "next/router";

const MasterPage = () => {
  const routers = useRouter();

  // Every /rate-management/* URL is rewritten to this one page (next.config.js
  // afterFiles: "/rate-management/:path*"), so router.pathname is constant and the
  // real route lives in asPath. It used to be read from window.location inside a
  // dependency-less useEffect and copied into state, which meant every navigation
  // rendered once with the PREVIOUS route's state before the effect corrected it --
  // visible as the rate-link tab content flashing while coming back to a rate code
  // detail. Deriving during render removes that intermediate render entirely.
  const [routePath, queryString] = routers.asPath.split("?");
  const segments = routePath.split("/").filter(Boolean);
  const q = new URLSearchParams(queryString ?? "");
  const path = segments[1] ?? "";
  const pathdua = segments[2] ?? "";
  const parentid = q.get("parent") ?? "0";
  const ischildren = q.get("bar_id") ?? "1";

  function RouteInit() {
    if (path == "bar") {
      if (pathdua == "rate-link-listing") {
        return <RateLink />;
      } else if (pathdua == "security-audit") {
        return <SecurityAudit module="bar" />;
      } else if (pathdua == "rate") {
        return <RateBar />;
      } else if (pathdua == "channel-manager") {
        return (
          <div className="mt-4 mb-4 flex justify-center">
            <div className="font-bold">Under Construction</div>
          </div>
        );
      } else {
        return <Bar />;
      }
    } else if (path == "rate") {
      if (pathdua == "rate-link-listing") {
        return <RateLinkRate />;
      } else if (pathdua == "security-audit") {
        return <SecurityAudit module="rate" />;
      } else if (pathdua == "rate") {
        return <RateRate />;
      } else if (pathdua == "company-applicable") {
        return <RateCompany />;
      } else if (pathdua == "information") {
        return <RateInformation />;
      } else if (pathdua == "promotion") {
        return <RatePromotion />;
      } else {
        return <Rate />;
      }
    } else if (path == "promo-setup") {
      if (pathdua == "detail") {
        return <Promotion />;
      } else if (pathdua == "security-audit") {
        return <SecurityAudit module="promotion" />;
      } else {
        return <Promotion />;
      }
    } else if (path == "holiday-and-event-setup") {
      return <HolidayEvent />;
    } else if (path == "allotment") {
      return <Allotment />;
    } else if (path == "overbooking") {
      return (
        <>
          <div>
            {" "}
            <h3 className="font-bold uppercase">Overbooking</h3>
          </div>
          <Overbooking />
        </>
      );
    } else if (path == "yield-management") {
      return <YieldManagement />;
    } else if (path == "event-management") {
      return <EventManagement />;
    } else {
      return <Bar />;
    }
  }
  return (
      <PaperBase>
        <Tabs active={path} idparent={parentid} ischildren={ischildren} />
        {path != "" ? RouteInit() : <></>}
      </PaperBase>);
};

export default MasterPage;
