import LayoutComponent from "../../components/common/layout/LayoutComponent";
import React from "react";
import PaperBase from "../../components/common/paper/PaperBase";
import CrmView from "../../components/pages/dashboards/crm";
import PropertyListView from "../../components/pages/property";

const PropertyPage = () => {
  return (
    <LayoutComponent>
      {/* <CrmView /> */}
        <PropertyListView />
    </LayoutComponent>
  );
};

export default PropertyPage;
