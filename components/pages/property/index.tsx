import React, { useContext, useEffect, useState, useRef } from "react";
import Seo from "../../common/seo";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt, GetEncrypt, RouteChange } from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setDatas } from "../../../redux/auth/authSlice";
import { color } from "framer-motion";

const PropertyListView = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [datatable, setdatatable] = useState<any>([{}]);

  const LinkRed = async (uri: string, img: string, names: string) => {
    //router.push(uri);

    const data = FetchData(
      "/cms/property/auth/" + uri,
      "GET",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    const datajson = await data;
    if (datajson?.code == "200") {
      // localStorage.setItem("data", GetEncrypt(JSON.stringify(datajson)));
      // dispatch(setLogin(GetEncrypt(JSON.stringify(datajson))));
      datajson.imgProperty = img;
      datajson.NameProperty = names;
      dispatch(setLogin(GetEncrypt(JSON.stringify(datajson))));

      RouteChange(router, "/dashboard", false);
    } else {
      //RouteChange(router, "/dashboard", false);
      if (datajson?.code == "400") {
      }
    }
  };
  const GetDataTable = async () => {
    try {
      let status = 0;

      let pages = 1;

      const datajson = await FetchData(
        "/cms/property?page=" + pages + "&name=&trash=" + status,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (datajson?.code == "200") {
        setdatatable(datajson);
      } else {
      }
      return;
    } catch (error) {
      // console.log("err", error);
      return;
    }
  };
  
  useEffect(() => {
    GetDataTable();
  }, []);

  const getColorFromString = (str: string): string => {
    const palette = [
      "#b45309", // amber
      "#0f766e", // teal
      "#7c3aed", // violet
      "#be185d", // pink
      "#0369a1", // sky
      "#15803d", // green
      "#c2410c", // orange
      "#1d4ed8", // blue
      "#7e22ce", // purple
      "#b91c1c", // red
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  };

  const getDominantColor = (src: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      // Jangan set crossOrigin — biar image load normal dulu
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 50;
          canvas.height = 50;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve("#6366f1");
          ctx.drawImage(img, 0, 0, 50, 50);
          const data = ctx.getImageData(0, 0, 50, 50).data;
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 128) continue;
            if (data[i] > 230 && data[i+1] > 230 && data[i+2] > 230) continue;
            r += data[i]; g += data[i+1]; b += data[i+2];
            count++;
          }
          if (count === 0) return resolve("#6366f1");
          resolve(`rgb(${Math.round(r/count)}, ${Math.round(g/count)}, ${Math.round(b/count)})`);
        } catch {
          resolve("#6366f1"); // CORS block → fallback color, image tetap muncul
        }
      };
      img.onerror = () => resolve("#6366f1");
      img.src = src;
    });
  };

  const CARDS_PER_PAGE = 6; // 2 baris × 3 kolom
  const PropertyCard = ({ row, onClick }: { row: any; onClick: () => void }) => {
    const accentColor = row?.color || getColorFromString(row?.name || row?.id || "default");
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          borderColor: isHovered ? accentColor : "#f3f4f6",
          boxShadow: isHovered ? `0 4px 20px ${accentColor}40` : "none",
        }}
        // h-full biar semua card stretch sesuai row height
        className="bg-white border rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 cursor-pointer"
      >
        {/* Logo area — flex-1 biar menyesuaikan sisa ruang, min-h biar ga kempes */}
        <div
          style={{ backgroundColor: isHovered ? `${accentColor}18` : "#f9fafb" }}
          className="flex items-center justify-center min-h-[180px] flex-1 p-6 transition-colors duration-300"
        >
          <img
            src={row?.image}
            alt={row?.name}
            className="max-h-[140px] max-w-full object-contain"
          />
        </div>

        {/* Info — fixed height biar sejajar antar card */}
        <div className="flex flex-col gap-1 px-4 pt-3 rounded-lg">
          <h2 className="font-semibold text-sm text-gray-900 leading-snug capitalize truncate">
            {row?.name}
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {row?.relation?.cities?.label}
          </p>
        </div>

        {/* Button — always di bawah */}
        <div className="px-4 pb-4 pt-3">
          <button
            style={isHovered ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
            className="w-full py-2 text-sm font-medium bg-primary border border-primary rounded-lg text-white transition-all duration-300"
          >
            Choose property
          </button>
        </div>
      </div>
    );
  };

  const [currentPage, setCurrentPage] = useState(0);

  const allProperties = datatable?.data || [];
  const totalPages = Math.ceil(allProperties.length / CARDS_PER_PAGE);
  const currentData = allProperties.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  return (
    <>
      <Seo title={"List Of Property"} />

      <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4 flex-1 min-h-0">
          {currentData.map((row: any, index: number) => (
            <PropertyCard
              key={index}
              row={row}
              onClick={() => LinkRed(row?.id, row?.image, row?.name)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-1 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
            >
              Prev
            </button>
            <span className="text-sm text-gray-500">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default PropertyListView;
