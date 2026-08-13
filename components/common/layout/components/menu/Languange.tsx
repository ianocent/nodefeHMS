import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import React from "react";

const Languange = () => {
  return (
    <Menu>
      <MenuHandler>
        <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#F4F7F9] rounded-full">
          <div className="font-bold">EN</div>
        </div>
      </MenuHandler>
      <MenuList placeholder={""}>
        <MenuItem placeholder={""}>Menu Item 1</MenuItem>
        <MenuItem placeholder={""}>Menu Item 2</MenuItem>
        <MenuItem placeholder={""}>Menu Item 3</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Languange;
