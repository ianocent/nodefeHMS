import React, { useState } from "react";
import InputMain from "../input/InputMain";
interface ButtonAddListProps {
  onAdd?: () => void;
  label: string;
  onXicon?: () => void;
  title: string;
  onRefresh?: () => void;
  isBtnadd?: boolean;
}
const ButtonAddList = (props: ButtonAddListProps) => {
  const { label, onAdd, onXicon, title, onRefresh, isBtnadd = true } = props;

  return (
    <div className="flex gap-4 justify-between items-center">
      <div className="flex">
        <div>
          <h5 className="text-base !text-[14px] font-bold uppercase">
            {title}
          </h5>
        </div>
      </div>

      <div className="flex gap-4">
        {onXicon && (
          <button
            className="bg-gray-500 px-4 py-2 text-white rounded-md"
            onClick={() => {
              onXicon();
            }}
          >
            X
          </button>
        )}
        {onRefresh && (
          <button
            className="border-primary border-2  px-4 py-2 text-primary rounded-md"
            onClick={() => {
              onRefresh();
            }}
          >
            Refresh
          </button>
        )}
        {isBtnadd && (
          <button
            className="bg-primary px-4 py-2 text-white rounded-md"
            onClick={() => {
              onAdd();
            }}
          >
            {label}
          </button>
        )}
      </div>
    </div>
  );
};

export default ButtonAddList;
