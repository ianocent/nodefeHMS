import React from "react";
import { IconSearch } from "../../../../../public/assets/iconfonts/tabler-icons/icons-react";

const SearchHeader = () => {
  return (
    <div className="bg-[#F4F7F9] rounded-full h-[50px] px-4 py-2 flex items-center">
      <IconSearch />
      <input
        type="text"
        className="w-40 bg-transparent border-0 py-0 "
        placeholder="search..."
      />
    </div>
  );
};

export default SearchHeader;
