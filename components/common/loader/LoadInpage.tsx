import React, { useEffect } from "react";
import { IconSpiner } from "../icon/CardIcon";

const LoadInPage = () => {
  return (
    <>
      <div className="flex justify-center">
        <div>
          <IconSpiner />
        </div>
      </div>
    </>
  );
};
export default LoadInPage;
