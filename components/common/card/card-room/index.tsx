import Image from "next/image";
import React from "react";
import { IconDelete, IconEdit } from "../../icon/CardIcon";
interface CardGalleryProps {
  data?: any;
}
const CardRoom = (props: CardGalleryProps) => {
  const { data } = props;
  return (
    <div className={
      (data?.room_status?.value == 0 ||
      data?.room_status?.label == 0
        ? "bg-[#cafcc7]"
        : data?.room_status?.value == 1 ||
          data?.room_status?.label == 1
        ? "bg-[#fa6b69]"
        : "bg-white") + " relative flex flex-col mt-6 text-gray-700 shadow-md bg-clip-border rounded-xl"
    }>
      <div className="p-6 text-center">
        <span className="block font-sans text-base antialiased font-light leading-relaxed text-inherit mb-5">
          {data?.maid_status?.label}
        </span>
        <h4 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {data?.name}
        </h4>
        <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {data?.room_type_id?.label}
        </h5>
        <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          {data?.room_type_grouping?.label}
        </p>
      </div>
      <hr/>
      {/* <div className="p-6 justify-center text-center">
        <button
          className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          type="button">
          Read More
        </button>
      </div> */}
    </div>
  );
};

export default CardRoom;
