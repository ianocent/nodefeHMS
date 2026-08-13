import Paper from "../../../../components/common/paper/Paper";
import React from "react";
import ListGalleryViewModel from "./ListGalleryViewModel";
import Image from "next/image";
import CardGallery from "../../../../components/common/card/CardGallery";

const ListGalleryView = () => {
  const { gallery ,goToAdd} = ListGalleryViewModel();
  return (
    <Paper title="Gallery List" goToAdd={()=>goToAdd()}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {gallery.map((row) => (
          <CardGallery {...row} key={row.id} />
        ))}
      </div>
    </Paper>
  );
};

export default ListGalleryView;
