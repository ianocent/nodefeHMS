import { useEffect, useState } from "react";
import PaperBase from "../../components/common/paper/PaperBase";
import Tabs from "../../components/common/tab";
import City from "../../components/pages/city/index";
import CodeBilingPage from "../../components/pages/code-billing/index";
import CodeGlsPage from "../../components/pages/code-gls/index";
import CodeItem from "../../components/pages/code-item/index";
import CodePost from "../../components/pages/code-post/index";
import Country from "../../components/pages/country/index";
import RoomInventory from "../../components/pages/room-inventory/index";
import RoomResevation from "../../components/pages/room-reservation/index";
import RoomType from "../../components/pages/room-type/index";
import Room from "../../components/pages/room/index";
import ListView from "../../components/pages/security-audit/index";
import SetupPage from "../../components/pages/setup/index";
import TypePayment from "../../components/pages/type-payment/index";

import { useRouter } from "next/router";
import { GetPathUri } from "../../components/helper";
import PosMatrixSales from "../../components/pages/pos-matrix-sales";
import RoomTypeImage from "../../components/pages/room-type-image";
import AddPage from "../../components/pages/room-type/form";
import StaahOtaMapping from "../../components/pages/staah-ota-mapping";
import DynamicRate from "../dynamic-rate";

// `?module=` comes from menus.visibility, which is free text and can disagree with
// the path it is attached to (menus 1121 stored "country" on a market-segment url,
// so the page rendered an empty Country table instead of the segment list).
// These modules own fixed paths, so a module that cannot own the current path is
// stale and the generic SetupPage group renderer takes over from the path alone.
const MODULE_PATH_SEGMENTS: Record<string, string[]> = {
  "code-billing": ["billing-code"],
  "code-gls": ["code-gls"],
  "code-item": ["code-item"],
  "code-post": ["code-post"],
  "type-payment": ["type-payment"],
  "staah-ota-mapping": ["staah-ota-mapping"],
  "dynamic-rate": ["dynamic-rate"],
  "pos-matrix-sales": ["pos-matrix-sales", "pos-matrix-saless"],
  "room-type": ["room-type"],
  "room-type-main": ["main"],
  "country": ["country"],
  "city": ["city"],
  "room": ["room"],
  "room-reservation": ["reservation"],
  "room-inventory": ["inventory"],
};

function resolveModule(moduleUri: string | null, lastPath: string): string {
  if (!moduleUri) return lastPath;
  const ownedSegments = MODULE_PATH_SEGMENTS[moduleUri];
  if (ownedSegments && !ownedSegments.includes(lastPath)) return "master-setup";
  return moduleUri;
}

const MasterPage = () => {
  const routers = useRouter();
  const [path, setpath] = useState("");
  // const [lastPath, setlastPath] = useState("");
  const [parentid, setparentid] = useState("0");
  const [module, setmodule] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // get last path
    const Lastpath = window.location.pathname.split("/").pop();
    const parent = urlParams.get("parent");
    let moduleUri = urlParams.get("module");
    if (!moduleUri) {
      moduleUri = Lastpath;
    } else {
      moduleUri = resolveModule(moduleUri, Lastpath);
    }
    setparentid(parent);
    // setlastPath(Lastpath);
    setmodule(moduleUri);
    // console.log("DATALOG", window.location.pathname.split("/"));
  }, [window.location.search, window.location.pathname]);

  function RouteInit() {
    const lastPath = window.location.pathname.split("/").pop();
    if (module == "code-billing") {
      return <CodeBilingPage />;
    } else if (module == "pos-matrix-sales") {
      return <PosMatrixSales />;
    } else if (module == "staah-ota-mapping") {
      return <StaahOtaMapping />;
    } else if (module == "code-gls") {
      return <CodeGlsPage />;
    } else if (module == "master-setup") {
      return <SetupPage groups={lastPath} />;
    } else if (lastPath == "main" && module == "room-type-main") {
      return <AddPage />;
    } else if (module == "code-item") {
      return <CodeItem />;
    } else if (module == "code-post") {
      return <CodePost />;
    } else if (lastPath == "image") {
      return <RoomTypeImage />;
    } else if (module == "room-type") {
      return <RoomType />;
    } else if (module == "city") {
      return <City />;
    } else if (module == "country") {
      return <Country />;
    } else if (module == "room") {
      return <Room />;
    } else if (module == "room-reservation") {
      return <RoomResevation />;
    } else if (module == "room-inventory") {
      return <RoomInventory />;
    } else if (module == "type-payment") {
      return <TypePayment />;
    } else if (module == "dynamic-rate") {
      return <DynamicRate />;
    } else {
      // alert("asd");
      const urlParams = new URLSearchParams(window.location.search);

      return <ListView module={module} id={urlParams.get("data")} />;
    }
  }
  return (
      <PaperBase>
        <Tabs active={GetPathUri(1)} idparent={parentid} />

        {module != null && RouteInit()}
      </PaperBase>);
};

export default MasterPage;
