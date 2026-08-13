// pages/housekeeping-setup/index.tsx
import React from "react";
import { useRouter } from "next/router";
import TableView from "../../../components/common/table-edit";
import Seo from "../../../components/common/seo";
import PaperBase from "../../../components/common/paper/PaperBase";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import AddView from "./form/index";

const HousekeepingSetup = () => {
  const GLOBALURI = "/cms/housekeeping-setup";
  const router    = useRouter();

  // Pakai router.query dari Next.js — reactive, tidak ada race condition
  const add      = router.query.add;
  const parentid = router.query.parent as string ?? "0";

  function RouteInit() {
    if (add === "1") {
      return <AddView />;
    }

    return (
      <div className="mt-2 min-w-full table-auto">
        <TableView
          groups={GLOBALURI}
          uri={GLOBALURI}
          isEditTable={false}
          queryString={`&trash=0`}
          isBtnAdd={true}
        />
      </div>
    );
  }

  return (
    <>
      <Seo title="Housekeeping Setup" />
      <LayoutComponent>
        <PaperBase>
          {RouteInit()}
        </PaperBase>
      </LayoutComponent>
    </>
  );
};

export default HousekeepingSetup;