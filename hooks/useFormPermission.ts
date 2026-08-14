import { useSelector } from "react-redux";
import { GetDecrypt } from "../components/helper";
import { hasPermission } from "../redux/auth/permissionHelper";
import { GetQueryParam } from "../components/helper";

const SUPER_USER_IDENTIFIERS = ["developer", "anyaman"];

export const checkIsSuperUser = (roles: string[], users: string[], username?: string): boolean => {
    const rolesLower = roles.map((r) => r.toLowerCase().trim());
    const usersLower = users.map((r) => r.toLowerCase().trim());
    const usernameLower = (username || "").toLowerCase().trim();

    return (
        SUPER_USER_IDENTIFIERS.some((id) => rolesLower.includes(id)) ||
        SUPER_USER_IDENTIFIERS.some((id) => usersLower.includes(id)) ||
        SUPER_USER_IDENTIFIERS.some((id) => usernameLower.includes(id))
    );
};

export const useFormPermission = (menuId?: number) => {
    const { isLogin, permissions } = useSelector((state: any) => state?.auth);
    const parsed: any = JSON.parse(GetDecrypt(isLogin ?? "") || "{}");
    const datalocal = parsed?.data ?? parsed;
    const rawRoles = datalocal?.role || [];
    const rawUser = datalocal?.name || [];
    const userNames: string[] = Array.isArray(rawUser) ? rawUser.map((r: any) => (typeof r === "string" ? r : r?.name || "")).filter(Boolean) : [];
    const userRoleNames: string[] = Array.isArray(rawRoles) ? rawRoles.map((r: any) => (typeof r === "string" ? r : r?.name || "")).filter(Boolean) : [];
    const isSuperUser = checkIsSuperUser(
        userRoleNames, 
        userNames, 
        datalocal?.username,
    );
    const reduxPermissions = permissions ?? {};
    const resolvedMenuId = menuId ?? (GetQueryParam("parent") ? Number(GetQueryParam("parent")) : null);
    const canCreate = isSuperUser
    ? true
    : resolvedMenuId
    ? hasPermission(reduxPermissions, resolvedMenuId, "add", userRoleNames)
    : false;
    const canUpdate = isSuperUser
    ? true
    : resolvedMenuId
    ? hasPermission(reduxPermissions, resolvedMenuId, "edit", userRoleNames)
    : false;
    const canView = isSuperUser
    ? true
    : resolvedMenuId
    ? hasPermission(reduxPermissions, resolvedMenuId, "view", userRoleNames)
    : false;
    const canDelete = isSuperUser
    ? true
    : resolvedMenuId
    ? hasPermission(reduxPermissions, resolvedMenuId, "delete", userRoleNames)
    : false;
    // console.log({
    //     resolvedMenuId,
    //     typeOf: typeof resolvedMenuId,
    //     permKeys: Object.keys(reduxPermissions).slice(0, 5),
    //     canCreate,
    //     canUpdate,
    // });
    return { canCreate, canUpdate, canView, canDelete, isSuperUser };
};
export const useTransactionPermission = (action: string): boolean => {
    const { isLogin, permissions } = useSelector((state: any) => state?.auth);

    const parsed: any = JSON.parse(GetDecrypt(isLogin ?? "") || "{}");
    const datalocal = parsed?.data ?? parsed;
    const rawUser = datalocal?.name || [];
    const rawRoles = datalocal?.role || [];
    const userNames: string[] = Array.isArray(rawUser) ? rawUser.map((r: any) => (typeof r === "string" ? r : r?.name || "")).filter(Boolean) : [];
    const userRoleNames: string[] = Array.isArray(rawRoles) ? rawRoles.map((r: any) => (typeof r === "string" ? r : r?.name || "")).filter(Boolean) : [];
    const isSuperUser = checkIsSuperUser(
        userRoleNames, 
        userNames, 
        datalocal?.username,
    );
    if (isSuperUser) return true;

    if (!permissions || typeof permissions !== 'object' || Object.keys(permissions).length === 0) {
        console.log(`❌ No permissions loaded for action: ${action}`);
        return false;
    }

    for (const [menuId, menuPerm] of Object.entries(permissions)) {
        const perm = menuPerm as any;
        if (perm?.transaction_actions && typeof perm.transaction_actions === 'object') {
            if (perm.transaction_actions[action]) {
                console.log(`✅ Permission GRANTED for ${action} on menu ${menuId}`);
                return true;
            }
        }
    }
    console.log(`❌ Permission DENIED for ${action}`);
    return false;
};