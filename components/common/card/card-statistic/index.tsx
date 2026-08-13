import Image from "next/image";
import React from "react";
import { IconDelete, IconEdit } from "../../icon/CardIcon";
interface CardGalleryProps {
  data?: any;
}
const CardRoom = (props: CardGalleryProps) => {
  const { data } = props;
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border h-full">
      <div className="px-4 py-3 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {data?.label}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {data?.sub_label}
        </p>
      </div>
      <div className="border-t border-gray-200 px-3 py-3 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {data?.list.map((item: any, i: any) => (
            <div
              key={i}
              className="py-1 sm:py-2 sm:grid sm:grid-cols-12 sm:gap-4 sm:px-6"
            >
              <dt className="text-sm font-medium text-gray-500 sm:col-span-6">
                {item?.name}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-6">
                {item?.data}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default CardRoom;
