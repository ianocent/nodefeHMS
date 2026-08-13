import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React from "react";
import CrmView from "../../components/pages/dashboards/crm";
import DashboardListView from "../../components/pages/dashboards/DashboardListView";

const DashboardPage = () => {
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
      <DashboardListView />
    </LayoutComponent>
  );
};

export default DashboardPage;
