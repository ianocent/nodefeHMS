import React from "react";
import {
  LeftIcon,
  LeftLineIcon,
  RightIcon,
  RightLineIcon,
} from "../icon/PaginationIcon";
interface PaginationTableProps {
  totalPage: number;
  totalData: number;
  page: number;
  position?: "justify-end" | "justify-center" | "justify-start";
  prevJump?: () => void;
  prev?: () => void;
  nextJump?: () => void;
  next?: () => void;
  vnext?: number;
  vnextJump?: number;
  vprev?: number;
  vprevjump?: number;
}
const PaginationTable = (props: PaginationTableProps) => {
  const {
    totalData,
    totalPage,
    page,
    position = "justify-end",
    prevJump,
    prev,
    nextJump,
    next,
    vnext,
    vnextJump,
    vprev,
    vprevjump,
  } = props;
  return (
    <div className={`mt-4 flex gap-4 items-center ${position}`}>
      <div className="flex gap-2 items-center">
        {/* <div>Rows per Page</div>
        <select className="border-none focus:border-none focus:outline-0">
          {options.map((row, index) => (
            <option key={"table-page" + index} value={row.value}>
              {row.label}
            </option>
          ))}
        </select> */}
      </div>

      <div>
        {page}-{totalPage} of {totalData}
      </div>

      <div className="flex gap-4 items-center">
        <button
          className={vprevjump == 1 ? "cursor-def" : ""}
          onClick={() => {
            if (vprevjump != 0) {
              prevJump();
            }
          }}
        >
          <LeftLineIcon />
        </button>
        <button
          onClick={() => {
            if (vprev != 0) {
              prev();
            }
          }}
        >
          <LeftIcon />
        </button>
        <button
          onClick={() => {
            if (vnext != 0) {
              next();
            }
          }}
        >
          <RightIcon />
        </button>
        <button
          onClick={() => {
            if (vnext != 0) {
              nextJump();
            }
          }}
        >
          <RightLineIcon />
        </button>
      </div>
    </div>
  );
};

export default PaginationTable;
