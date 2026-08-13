import ButtonAddList from "../../../../components/common/button/ButtonAddList";
import PaperBase from "../../../../components/common/paper/PaperBase";
import React from "react";
import ListPostViewModel from "./ListPostViewModel";
import SelectBase from "../../../../components/common/input/SelectBase";
import PaginationTable from "../../../common/pagination/PaginationTable";

const ListPostView = () => {
  const { filter, table, goToAddView, pagination } = ListPostViewModel();
  return (
    <PaperBase>
      <ButtonAddList
        label="+ Add"
        title="List Post"
        onAdd={() => {
          goToAddView();
        }}
        onXicon={() => {}}
      />
      <div className="grid grid-cols-5 gap-4 mt-4">
        {filter.map((input) => (
          <SelectBase
            error={input.error}
            label={""}
            options={input.options}
            rest={{
              value: input.value,
              onChange: (e) => {},
              "aria-placeholder": input.placeholder,
            }}
          />
        ))}
      </div>

      <div className="my-4 w-full table-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              {table.head.map((row) => (
                <td className="p-2 font-bold">{row}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.body.map((row, index) => (
              <tr>
                {Object.entries(row).map((key, val) => (
                  <td className={`${index % 2 == 0 ? "bg-gray-300" : ""} p-2`}>
                    {key[1]}
                  </td>
                ))}
                <td className={`${index % 2 == 0 ? "bg-gray-300" : ""} p-2`}>
                  <div className="flex gap-2">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationTable {...pagination} />
    </PaperBase>
  );
};

export default ListPostView;
