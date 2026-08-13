import React, { useEffect } from "react";
import "../styles/globals.scss";
import { createWrapper } from "next-redux-wrapper";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import { persistor, store } from "../redux/store/store";
import useAuthRefresh from "../hooks/useAuthRefresh";
import { GetDecrypt } from "../components/helper";
import { initPushNotification } from "../services/pushNotification";
import { Capacitor } from "@capacitor/core";

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

function MyApp({ Component, pageProps }) {
  const { store: wrappedStore, props } = wrapper.useWrappedStore(pageProps);

  return (
    <Provider store={wrappedStore}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent Component={Component} pageProps={props} />
      </PersistGate>
    </Provider>
  );
}

function AppContent({ Component, pageProps }) {
  useAuthRefresh();

  const { isLogin } = useSelector((state: any) => state?.auth);
  
  useEffect(() => {
    if (!isLogin) return;

    if (!Capacitor.isNativePlatform()) {
      console.log("Skip push notification on web");
      return;
    }

    try {
      const datalocal = JSON.parse(GetDecrypt(isLogin));
      const accessToken = datalocal?.data?.access_token;

      if (!accessToken) return;

      initPushNotification(accessToken);
    } catch (e) {
      console.error("Gagal init push notification:", e);
    }
  }, [isLogin]);

  return <Component {...pageProps} />;
}

export default MyApp;