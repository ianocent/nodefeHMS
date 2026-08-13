import ButtonAddList from "../../../common/button/ButtonAddList";
import PaperBase from "../../../common/paper/PaperBase";
import React from "react";
import ListNavigationMenuViewModel from "./ListNavigationMenuViewModel";
import PaginationTable from "../../../common/pagination/PaginationTable";
import { IconAcccourdion } from "../../../common/icon/SidebarIcon";

const ListNavigationMenuView = () => {
  const {
    table,
    dragEnter,
    dragStart,
    drop,
    tableBody,
    dropChildren,
    router,
    pagination,
    showChildren,
  } = ListNavigationMenuViewModel();
  return (
    <div>
      <PaperBase>
        <ButtonAddList
          onRefresh={() => {}}
          title="List Menu"
          label="+ Add Menu"
          onAdd={() => {
            router.push("/navigation-menu/add");
          }}
        />
      </PaperBase>
      <div className=" w-full table-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b-[10px] border-[#f0f1f7]">
              {table.head.map((row) => (
                <td className="p-2 font-bold bg-white uppercase">{row}</td>
              ))}
            </tr>
          </thead>
          <tbody className="w-full pt-4">
            {tableBody.map((row, index) => (
              <>
                <tr className="border-b-[10px] border-[#f0f1f7]">
                  <td
                    className="bg-white p-2 cursor-move"
                    key={index}
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={(e) => dragEnter(e, index)}
                    onDragEnd={drop}
                    draggable
                  >
                    =
                  </td>

                  <td className="bg-white p-2">{row?.no ?? ""}</td>

                  <td className="bg-white p-2">{row?.name ?? ""}</td>
                  <td className="bg-white p-2">{row?.template ?? ""}</td>
                  <td className="bg-white p-2">{row?.sort ?? ""}</td>
                  <td className="bg-white p-2">{row?.status ?? ""}</td>

                  <td className="bg-white p-2 w-fit">
                    <div className="flex gap-2 w-fit">
                      <button
                        className="border-primary w-fit border px-4 py-2 text-primary rounded-md"
                        onClick={() => {}}
                      >
                        View
                      </button>
                      <button
                        className="bg-primary w-fit px-4 py-2 text-white rounded-md"
                        onClick={() => {}}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                  <td className="bg-white p-2">
                    {row.children.length != 0 && (
                      <div
                        className={`cursor-pointer w-fit ${
                          !row.show ? "rotate-180" : ""
                        }`}
                        onClick={() => {
                          showChildren(index);
                        }}
                      >
                        <IconAcccourdion />
                      </div>
                    )}
                  </td>
                </tr>
                {row?.children.map((chilRow, indexChildRow) => (
                  <tr
                    className={`border-b-[10px] border-[#f0f1f7] ${
                      row.show ? "" : "hidden"
                    }`}
                  >
                    <td
                      className="bg-white p-2 cursor-move"
                      key={indexChildRow}
                      onDragStart={(e) => dragStart(e, indexChildRow)}
                      onDragEnter={(e) => dragEnter(e, indexChildRow)}
                      onDragEnd={(e) => dropChildren(e, index)}
                      draggable
                    >
                      =
                    </td>
                    <td className="bg-white p-2"></td>
                    <td className="bg-white p-2">{chilRow?.name ?? ""}</td>
                    <td className="bg-white p-2">{chilRow?.template ?? ""}</td>
                    <td className="bg-white p-2">{chilRow?.sort ?? ""}</td>
                    <td className="bg-white p-2">{chilRow?.status ?? ""}</td>
                    <td className="bg-white p-2">
                      <div className="flex gap-2 w-fit">
                        <button
                          className="border-primary w-fit border px-4 py-2 text-primary rounded-md"
                          onClick={() => {}}
                        >
                          View
                        </button>
                        <button
                          className="bg-primary w-fit px-4 py-2 text-white rounded-md"
                          onClick={() => {}}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                    <td className="bg-white p-2"></td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white px-4 py-2 rounded-b-lg">
        <PaginationTable {...pagination} />
      </div>
    </div>
  );
};

export default ListNavigationMenuView;
