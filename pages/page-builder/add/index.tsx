import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import AddPageBuilderView from "../../../components/pages/page-builder/add/AddPageBuilderView";
import AddPostView from "../../../components/pages/post/add/AddPostView";
import React from "react";

const PageBuilderPage = () => {
  return (
    <LayoutComponent>
      <AddPageBuilderView />
    </LayoutComponent>
  );
};

export default PageBuilderPage;
