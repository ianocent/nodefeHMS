import React from "react";
import { IconTrush } from "../icon/CardIcon";
interface ButtonDeletePageBuilderprops {
  onDelete: () => void;
  label: string;
}
const ButtonDeletePageBuilder = (props: ButtonDeletePageBuilderprops) => {
  const { onDelete, label } = props;
  return (
    <div className="flex gap-4 ">
      <button
        className="bg-primary px-4 py-2 text-white rounded-md"
        onClick={() => {}}
      >
        {label}
      </button>

      <button
        className="bg-[#FF0000] px-4 py-2 text-white rounded-md"
        onClick={() => {
          onDelete();
        }}
      >
        <IconTrush />
      </button>
    </div>
  );
};

export default ButtonDeletePageBuilder;
