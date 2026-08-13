import LayoutComponent from "../../components/common/layout/LayoutComponent";
import Paper from "../../components/common/paper/Paper";
import ListGalleryView from "../../components/pages/gallery/list/ListGalleryView";
import React from "react";

const GalleryPage = () => {
  return (
    <LayoutComponent>
      <ListGalleryView />
    </LayoutComponent>
  );
};

export default GalleryPage;
