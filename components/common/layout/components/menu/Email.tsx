import { Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import React from "react";

const Email = () => {
  return (
    <Menu>
      <MenuHandler>
        <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#F4F7F9] rounded-full">
          <span className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>

            <span className="badge !rounded-full bg-success text-white absolute -end-2 -top-2">
              5
            </span>
          </span>
        </div>
      </MenuHandler>
      <MenuList placeholder={''} >
        <MenuItem placeholder={''}>Menu Item 1</MenuItem>
        <MenuItem placeholder={''}>Menu Item 2</MenuItem>
        <MenuItem placeholder={''}>Menu Item 3</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Email;
