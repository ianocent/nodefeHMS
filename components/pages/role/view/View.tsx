import React, { useEffect, useState, useContext } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt, GetQueryParam } from "../../../helper";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";

const RoleView = () => {
  const router = useRouter();
  const layout = useContext(LayoutContext);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    name: "",
    code: "",
    status: [],
    dashboard: [],
    dashboard_ori: [],
    permissions: {},
  });

  const hkMenus = [172];
  const userMenus = [1116];
  const companyMenus = [83];
  const engineMenus = [1137];
  const transactionMenus = [62, 63, 69, 1162];
  const reservationMenus = [62, 63, 69, 1162];

  const hkActionsList = [{ key: "clean_all_room", label: "Clean All Rooms" }];
  const userActionsList = [{ key: "force_logout_access", label: "Force Logout Access" }];
  const companyActionsList = [
    { key: "finance_access_edit", label: "Finance Access Edit" },
    { key: "finance_access_view", label: "Finance Access View" },
  ];
  const engineActionsList = [
    { key: "start_work_order", label: "Start Work Order" },
    { key: "end_work_order", label: "End Work Order" },
    { key: "assign_engineering", label: "Assign Engineering" },
  ];
  const transactionActionsList = [
    { key: "payment", label: "Payment" },
    { key: "manual_posting", label: "Manual Posting" },
    { key: "refund", label: "Refund" },
    { key: "paidout", label: "Paid Out" },
    { key: "split", label: "Split" },
    { key: "consolidate", label: "Consolidate" },
    { key: "transfer", label: "Transfer" },
    { key: "void", label: "Void" },
  ];
  const reservationActionsList = [
    { key: "fit", label: "FIT" },
    { key: "git", label: "GIT" },
    { key: "day-use", label: "Day Use" },
    { key: "vr", label: "VR" },
    { key: "check_in", label: "Check In" },
    { key: "check_out", label: "Check Out" },
    { key: "confirm_reservation", label: "Confirm Reservation" },
    { key: "cancel_reservation", label: "Cancel Reservation" },
    { key: "assign_room", label: "Assign Room" },
    { key: "un_assign_room", label: "Un Assign Room" },
    { key: "confirm_change_room", label: "Confirm Change Room" },
    { key: "cancel_change_room", label: "Cancel Change Room" },
    { key: "un_check_in", label: "Un Check In" },
    { key: "un_check_out", label: "Un Check Out" },
    { key: "copy_reservation", label: "Copy Reservation" },
    { key: "move_reservation", label: "Move Reservation" },
    { key: "change_rate", label: "Change Rate" },
    { key: "change_rate_code", label: "Change Rate Code" },
    { key: "change_guest", label: "Change Guest" },
    { key: "change_company", label: "Change Company" },
    { key: "change_room", label: "Change Room" },
  ];

  const GetDetailRole = async (id: any) => {
    try {
      const response: any = await FetchData(
        `/cms/role/${id}/update`,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (response?.data) {
        const d = response.data;

        const permMap: any = {};
        (d.permissions || []).forEach((group: any) => {
          if (!permMap[group.value]) permMap[group.value] = {};
          (group.access || []).forEach((menu: any) => {
            permMap[group.value][menu.value] = {
              view:   menu.crud?.view   || false,
              add:    menu.crud?.add    || false,
              edit:   menu.crud?.edit   || false,
              delete: menu.crud?.delete || false,
              transaction_actions: menu.transaction_actions || {},
            };
          });
        });

        setdataoption(response);
        setData({
          name:          d.name || "",
          code:          d.code || "",
          status:        d.status || [],
          dashboard:     d.list_dashboard || [],
          dashboard_ori: d.list_dashboard || [],
          permissions:   permMap,
        });
      }
    } catch (error) {
      console.log("Error fetching role detail:", error);
    }
  };

  // useEffect(() => {
  //   const id = router.query.id || router.query.data;
  //   if (id) GetDetailRole(id);
  // }, [router.query]);
  useEffect(() => {
    const idreq = GetQueryParam(2); // ambil segment ke-2 dari path: /role/view/96
    if (idreq) {
      GetDetailRole(idreq);
    }
  }, []);

  const isGroupChecked = (group: any) => {
    if (!group?.access?.length) return false;
    return group.access.every(
      (menu: any) => data.permissions?.[group.value]?.[menu.value]?.view === true
    );
  };

  const isGroupIndeterminate = (group: any) => {
    const children = group.access || [];
    const total = children.length;
    const checked = children.filter(
      (menu: any) => data.permissions?.[group.value]?.[menu.value]?.view
    ).length;
    return checked > 0 && checked < total;
  };

  const renderPermissions = () => (
    <div className="col-span-12">
      <label className="block text-sm font-semibold mb-2 text-gray-900">
        Role Based Access Control
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dataoption?.data?.permissions
          ?.filter((rw: any) => Array.isArray(rw.access) && rw.access.length > 0)
          ?.sort((a: any, b: any) => a.access.length - b.access.length)
          ?.map((group: any, i: number) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">

              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <input
                  type="checkbox"
                  ref={(el) => { if (el) el.indeterminate = isGroupIndeterminate(group); }}
                  checked={isGroupChecked(group)}
                  disabled
                  className="w-5 h-5 accent-purple-600 cursor-not-allowed"
                />
                <h3 className="font-semibold text-base text-gray-800">{group.label}</h3>
              </div>

              <div className="space-y-5 pl-2">
                {group.access.map((menu: any) => {
                  const menuId = parseInt(menu.value);
                  const isTransactionMenu  = transactionMenus.includes(menuId);
                  const isCompanyMenu      = companyMenus.includes(menuId);
                  const isUserMenu         = userMenus.includes(menuId);
                  const isReservationMenu  = reservationMenus.includes(menuId);
                  const isHkMenu           = hkMenus.includes(menuId);
                  const isEngineMenu       = engineMenus.includes(menuId);

                  return (
                    <div key={menu.value} className="bg-gray-200 p-3 rounded-lg border-l-2 border-purple-100 pl-4">
                      <div className="font-medium text-sm mb-2.5 text-gray-700">
                        {menu.label}
                        <span className="text-xs text-gray-400 ml-1">({menu.value})</span>
                      </div>

                      {/* CRUD */}
                      <div className="grid grid-cols-2 gap-y-2 text-sm mb-2">
                        {["view", "add", "edit", "delete"].map((act) => (
                          <label key={act} className="flex items-center gap-2 select-none cursor-not-allowed">
                            <input
                              type="checkbox"
                              disabled
                              checked={data.permissions?.[group.value]?.[menu.value]?.[act] || false}
                              className="w-4 h-4 accent-purple-600 cursor-not-allowed"
                            />
                            <span className="capitalize text-gray-500">{act}</span>
                          </label>
                        ))}
                      </div>

                      {isTransactionMenu && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="font-medium text-sm mb-3 text-gray-600">Transaction Actions</div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {transactionActionsList.map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 select-none cursor-not-allowed">
                                <input
                                  type="checkbox"
                                  disabled
                                  checked={data.permissions?.[group.value]?.[menu.value]?.transaction_actions?.[key] || false}
                                  className="w-4 h-4 accent-purple-600 cursor-not-allowed"
                                />
                                <span className="text-gray-500">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {isReservationMenu && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="font-medium text-sm mb-3 text-gray-600">Reservation Actions</div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {reservationActionsList.map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 select-none cursor-not-allowed">
                                <input
                                  type="checkbox"
                                  disabled
                                  checked={data.permissions?.[group.value]?.[menu.value]?.transaction_actions?.[key] || false}
                                  className="w-4 h-4 accent-purple-600 cursor-not-allowed"
                                />
                                <span className="text-gray-500">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {isCompanyMenu && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="font-medium text-sm mb-3 text-gray-600">Company Sub Menus</div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {companyActionsList.map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 select-none cursor-not-allowed">
                                <input
                                  type="checkbox"
                                  disabled
                                  checked={data.permissions?.[group.value]?.[menu.value]?.transaction_actions?.[key] || false}
                                  className="w-4 h-4 accent-purple-600 cursor-not-allowed"
                                />
                                <span className="text-gray-500">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {isUserMenu && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="font-medium text-sm mb-3 text-gray-600">User Actions</div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {userActionsList.map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 select-none cursor-not-allowed">
                                <input
                                  type="checkbox"
                                  disabled
                                  checked={data.permissions?.[group.value]?.[menu.value]?.transaction_actions?.[key] || false}
                                  className="w-4 h-4 accent-purple-600 cursor-not-allowed"
                                />
                                <span className="text-gray-500">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {isHkMenu && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="font-medium text-sm mb-3 text-gray-600">Housekeeping Actions</div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {hkActionsList.map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 select-none cursor-not-allowed">
                                <input
                                  type="checkbox"
                                  disabled
                                  checked={data.permissions?.[group.value]?.[menu.value]?.transaction_actions?.[key] || false}
                                  className="w-4 h-4 accent-purple-600 cursor-not-allowed"
                                />
                                <span className="text-gray-500">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Engineering Actions */}
                      {isEngineMenu && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="font-medium text-sm mb-3 text-gray-600">Engineering Actions</div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {engineActionsList.map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 select-none cursor-not-allowed">
                                <input
                                  type="checkbox"
                                  disabled
                                  checked={data.permissions?.[group.value]?.[menu.value]?.transaction_actions?.[key] || false}
                                  className="w-4 h-4 accent-purple-600 cursor-not-allowed"
                                />
                                <span className="text-gray-500">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <>
      <Seo title={"View " + (layout?.title || "Role")} />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
            <div className="col-span-4">
              <h2 className="text-lg font-bold">View Role</h2>
            </div>
          </div>

          <div className="grid grid-cols-12 h-fit gap-4">
            <div className="col-span-12 grid grid-cols-12 gap-4">

              <div className="col-span-12">
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Role Name"}
                  required={true}
                  rest={{ disabled: true, value: data.name, type: "text" }}
                />
              </div>

              <div className="col-span-12">
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Role Code"}
                  required={true}
                  rest={{ disabled: true, value: data.code, type: "text" }}
                />
              </div>

              <div className="col-span-12">
                <InputMain
                  typeInput="select-multi"
                  label={"List Dashboard"}
                  error={false}
                  valueSel={data.dashboard_ori}
                  isMulti={true}
                  options={dataoption?.master?.dashboards || []}
                  disabled={true}
                />
              </div>

              {renderPermissions()}

              <div className="col-span-12">
                <InputMain
                  typeInput={"select-multi"}
                  error={false}
                  label={"Status"}
                  required={true}
                  valueSel={data.status}
                  isMulti={false}
                  disabled={true}
                />
              </div>

            </div>
          </div>
        </div>

        <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
            <ButtonSubmit
              onCreate={() => router.back()}
              label="Back"
              isprimary={false}
            />
          </div>
        </div>
      </PaperBase>
    </>
  );
};

export default RoleView;
