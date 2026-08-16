export const hasPermission = (
  permissions: any,
  menuId: number,
  action: "view" | "add" | "edit" | "delete" | string,
  userRoles: string[] = []
): boolean => {
  const roles = userRoles.map(r => String(r).toLowerCase());
  if (
    roles.includes("developer") ||
    roles.includes("administrator") ||
    roles.includes("admin") ||
    roles.includes("anyaman")
  ) {
    return true;
  }

  if (!permissions || Object.keys(permissions).length === 0) {
    return false;
  }

  const menuPerm = permissions[menuId] || permissions[String(menuId)];
  if (typeof action === 'string' && !["view","add","edit","delete"].includes(action)) {
      const hasAction = !!menuPerm?.transaction_actions?.[action];
      
      // console.log(`Transaction Action Check:`, { 
      //     menuId, 
      //     action, 
      //     transaction_actions: menuPerm?.transaction_actions,
      //     result: hasAction 
      // });
      
      return hasAction;
  }
  return !!(menuPerm && menuPerm[action]);
};
export const hasTransactionAction = (
  permissions: any,
  menuId: number,
  action: string,
  userRoles: string[] = []
): boolean => {
  return hasPermission(permissions, menuId, action, userRoles);
};
export const mapPermissions = (rawPermissions: any[] = []) => {
  const result: any = {};

  rawPermissions.forEach((group: any) => {
    if (!group?.access?.length) return;

    group.access.forEach((menu: any) => {
      const menuId = parseInt(String(menu.value).trim(), 10);
      if (isNaN(menuId)) return;

      if (!result[menuId]) {
        result[menuId] = {
          view: false,
          add: false,
          edit: false,
          delete: false,
          transaction_actions: {}
        };
      }

      // CRUD biasa
      if (menu.crud) {
        result[menuId].view   ||= !!menu.crud.view;
        result[menuId].add    ||= !!menu.crud.add;
        result[menuId].edit   ||= !!menu.crud.edit;
        result[menuId].delete ||= !!menu.crud.delete;
      } 
      else if (menu.isaccess) {
        result[menuId].view = result[menuId].add = result[menuId].edit = result[menuId].delete = true;
      }

      // Transaction
      if (menu.transaction_actions) {
          result[menuId].transaction_actions = {
              ...result[menuId].transaction_actions,
              ...menu.transaction_actions
          };
      } 
      else if (menu.crud && menu.crud.transaction_actions) {
          result[menuId].transaction_actions = {
              ...result[menuId].transaction_actions,
              ...menu.crud.transaction_actions
          };
      }
    });
  });

  // console.log("Mapped Permissions Final:", result);
  return result;
};
export const getUserRoles = (authState: any): string[] => {
  if (!authState) return [];

  if (Array.isArray(authState?.roles) && authState.roles.length > 0) {
    return authState.roles;
  }

  let rolesData = 
    authState?.datas?.data?.role || 
    authState?.datas?.role || 
    authState?.datas?.data?.roles || 
    authState?.datas?.roles || 
    [];

  if (Array.isArray(rolesData)) {
    return rolesData
      .map((r: any) => r?.name || r?.label || String(r))
      .filter(Boolean);
  }
  if (typeof rolesData === "string") return [rolesData];
  if (rolesData?.name) return [rolesData.name];

  return [];
};
