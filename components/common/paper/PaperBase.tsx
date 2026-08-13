import React, { ReactNode } from "react";
interface PaperBaseProps {
  children: ReactNode;
}
const PaperBase = ({ children }: PaperBaseProps) => {
  return (
    <div className="rounded-t-lg p-0 md:p-4 w-full mx-auto">
      {children}
    </div>
  );
};

export default PaperBase;
