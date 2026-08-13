import Link from "next/link";
import React from "react";
interface TableActivityProps {
  head: string[];
  body: {
    key: number;
    activity: string;
    name: string;
    icon:any,
    time: string;
    users: {
      image: string;
    }[];
    ip: string;
  }[];
}
const TableActivity = (props: TableActivityProps) => {
  const { body, head } = props;
  return (
    <>
      <div className="table-responsive bg-white">
        <table className="table whitespace-nowrap min-w-full">
          <thead>
            <tr className="border-b border-defaultborder">
              <th scope="col">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkboxNoLabel"
                  value=""
                  aria-label="..."
                />
              </th>
              {head.map((row) => (
                <th scope="col" className="text-start" key={row}>
                  {row}x
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, index) => (
              <tr className="border-b border-defaultborder">
                <th scope="row">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`checkboxNoLabel${index}`}
                    value={row.key}
                    aria-label="..."
                  />
                </th>

                <td>
                  <div className="flex items-center">
                    {row.icon}
                    <div className="ms-2">
                      <div className="font-bold">{row.activity}</div>
                      <div className="text-gray-500">{row.name}</div>
                    </div>
                  </div>
                </td>
                <td>{row.time}</td>
                <td>
                  <div className="flex ">
                    {row.users.map((colUser) => (
                      <span className=" w-[32px] -me-[1.35rem] flex justify-center items-center h-[32px] avatar-rounded">
                        <img src={colUser.image} alt="img" />
                      </span>
                    ))}

                    <Link
                      className=" w-[32px] h-[32px] flex justify-center items-center bg-primary text-white 
avatar-rounded"
                      href="#"
                    >
                      {row.users.length}+
                    </Link>
                  </div>
                </td>
                <td>{row.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation" className="my-4 ">
        <ul className="ti-pagination justify-end">
          <li className="page-item disabled">
            <Link href="#" className="page-link px-3 py-[0.375rem]">
              Previous
            </Link>
          </li>
          <li className="page-item" aria-current="page">
            <Link className="page-link active px-3 py-[0.375rem]" href="#">
              1
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link px-3 py-[0.375rem]" href="#">
              2
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link px-3 py-[0.375rem]" href="#">
              3
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link px-3 py-[0.375rem]" href="#">
              Next
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default TableActivity;
