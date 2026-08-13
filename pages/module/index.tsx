import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React from "react";
import CrmView from "../../components/pages/dashboards/crm";
import ModulePage from "../../components/pages/module";
import PaperBase from "../../components/common/paper/PaperBase";

const DashboardPage = () => {
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
      <PaperBase>
        <ModulePage />
      </PaperBase>
    </LayoutComponent>
  );
};

export default DashboardPage;
