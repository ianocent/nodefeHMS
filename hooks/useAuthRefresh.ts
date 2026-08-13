import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetEncrypt } from "../components/helper";
import { setPermissions, setDatas, setLogin } from "../redux/auth/authSlice";
import { mapPermissions } from "../redux/auth/permissionHelper";

const useAuthRefresh = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state.auth);

  const getToken = useCallback(() => {
    if (!isLogin) return null;
    try {
      const parsed = JSON.parse(GetDecrypt(isLogin) || "{}");
      return parsed?.data?.access_token || null;
    } catch {
      return null;
    }
  }, [isLogin]);

  const refreshAuth = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const encryptedBody = GetEncrypt(JSON.stringify({})); // atau kirim kosong saja

      const res = await FetchData(
        // "/cms/role",
        "/cms/role",
        "GET",
        "",
        false,
        token,
        null,
        "", 
        true
      );

      if (res?.code === "200") {
        const userData = res.data || res;

        if (userData?.permissions) {
          const mapped = mapPermissions(userData.permissions);
          dispatch(setPermissions(mapped));
          dispatch(setDatas(userData));
          
          // Optional: update full login data
          // dispatch(setLogin(GetEncrypt(JSON.stringify(res))));
        }
      }
    } catch (err: any) {
      console.warn("Auth refresh failed:", err);
      
      const currentToken = getToken();
      if (!currentToken) {
        dispatch(setLogin(""));
      }
    }
  }, [dispatch, getToken]);

  useEffect(() => {
    if (!isLogin) return;

    // Refresh saat pertama kali mount
    refreshAuth();

    // Refresh setiap 25 menit
    const interval = setInterval(refreshAuth, 25 * 60 * 1000);

    // Refresh saat user kembali ke tab / browser
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "visible") {
    //     refreshAuth();
    //   }
    // };

    const handleFocus = () => refreshAuth();

    // document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshAuth, isLogin]);
};

export default useAuthRefresh;