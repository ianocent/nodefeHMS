import Image from "next/image";
import React from "react";
import { IconDelete, IconEdit } from "../icon/CardIcon";
interface CardGalleryProps {
  image: string;
  title: string;
  description: string;
  id: string;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}
const CardGallery = (props: CardGalleryProps) => {
  const { description, id, image, onClick, title ,onEdit,onDelete} = props;
  return (
    <div className="p-2 border-dashed border rounded-sm">
      <div className="w-full h-[150px] relative">
        <Image fill src={image} alt="gallery-items" className="object-cover" />
        <div className="absolute flex gap-2 top-2 right-2">
          <button onClick={onEdit}>
            <IconEdit />
          </button>
          <button onClick={onDelete}>
            <IconDelete />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-[16px] leading-[21px] font-bold">{title}</h4>
        <p className="text-gray-500 line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default CardGallery;
