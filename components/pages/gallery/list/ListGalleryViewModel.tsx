import React, { useEffect, useState } from "react";
import { galleryData } from "../dataDummy";
import { useRouter } from "next/router";

const ListGalleryViewModel = () => {
  const [gallery, setGallery] = useState([
    {
      image: "",
      title: "",
      id: ``,
      description: "",
    },
  ]);
  const router=useRouter()

  useEffect(() => {
    setGallery(galleryData);
  }, []);
  function goToAdd(){
    router.push('/gallery/add')
  }
  return { gallery,goToAdd };
};

export default ListGalleryViewModel;
