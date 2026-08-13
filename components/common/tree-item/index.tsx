import React, { SetStateAction, useState } from "react";
import Link from "next/link";

interface treeItem {
  item: any;
  setGroupActive: React.Dispatch<SetStateAction<number>>;
  groupActive: number | null;
}

const TreeItem = ({ item, setGroupActive, groupActive }: treeItem) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  console.log(item.id, "cek item id");

  return (
    <div>
      <div
        className={`flex items-center cursor-pointer px-2 py-2 hover:bg-[#f0f1f8] ${
          groupActive === item.id ? "bg-[#f0f1f8]" : ""
        } transition-all`}
        style={{ textDecoration: "none" }}
        onClick={() => setGroupActive(item.id)}
      >
        <div
          className={`flex-grow flex items-center ${
            isOpen ? "text-blue-500" : "text-gray-700"
          }`}
        >
          <img
            width={16}
            height={16}
            alt=""
            src={"/assets/iconfonts/bootstrap-icons/icons/icons/folder.svg"}
            onClick={handleToggle}
          />

          <span className="ml-2">{item.name}</span>
        </div>
        {hasChildren && (
          <img
            width={14}
            height={14}
            alt=""
            src={
              "/assets/iconfonts/bootstrap-icons/icons/icons/chevron-right.svg"
            }
            onClick={handleToggle}
            className={`${isOpen && "rotate-90"} hover:scale-125`}
          />
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-40" : "max-h-0"
        }`}
      >
        {isOpen && hasChildren && (
          <div className="ml-4">
            {item.children.map((child: any) => (
              <TreeItem
                key={child.id}
                item={child}
                groupActive={groupActive}
                setGroupActive={setGroupActive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeItem;
