import React, {useRef} from "react";
import { env } from "../../../next.config";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    GetDecrypt,
    FetchData
  } from "../../helper";

export default function MapBase( ) {
    const mapRef = useRef(null)
    const { isLogin } = useSelector((state: any) => state?.auth);
    const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
    let url = env.uriApi+"/map";
    const router = useRouter();
    const refresh = async () => {
        const datajson = await FetchData(
            '/map' + "?json=1"+ "&token=" + datalocal?.data?.access_token+ "&refresh=1",
            "GET",
            "",
            false,
            datalocal?.data?.access_token,
            router,
            "",
            true
          );
          if (datajson?.code == "200") {
            window.location.reload()
          }
    }

    return (
        <>
       <iframe 
            src={url+"?token="+datalocal?.data?.access_token}
            allowFullScreen
            width="800" 
            height="600" 
            loading="lazy" 
            className="w-full"
            referrerPolicy="no-referrer-when-downgrade">
        </iframe>   
        </>
    )
  }
  