import React from "react";
interface ButtonCreateProps {
  onCancel: () => void;
  onCreate: () => void;
  label?: string;
}
const ButtonCreate = (props: ButtonCreateProps) => {
  const { onCancel, onCreate, label = "Create" } = props;
  const baseBtn = "px-4 py-2 rounded-md font-medium flex items-center justify-center";

  return (
    <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0">
      <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
        <button
          className={"bg-[#E0E0E0] text-black " + baseBtn}
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className={"bg-primary text-white " + baseBtn}
          onClick={onCreate}
        >
          {label}
        </button>
      </div>
    </div>
  );

};

export default ButtonCreate;
