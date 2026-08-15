import * as crypto from "crypto";
import { fetchQueue } from "../../utils/fetchQueue";
import { toast } from "react-toastify";

const env = process.env;

const AES_METHOD = "aes-256-cbc";
const IV_LENGTH = 16;
const passwords = env.passAes;

export function GetCapitalFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function GetCurrentDate() {
  let currentDate = new Date().toJSON().slice(0, 10);
  return currentDate;
}
export function CarbonLikeParse(dateStr: string) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  const parts = dateStr.split(/[-\/]/);
  if (parts.length !== 3) return dateStr;
  let year, month, day;
  if (parts[0].length === 4) {
    year = parts[0];
    month = parts[1];
    day = parts[2];
  } else if (parseInt(parts[0]) > 12) {
    day = parts[0];
    month = parts[1];
    year = parts[2];
  } else {
    month = parts[0];
    day = parts[1];
    year = parts[2];
  }
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
export function GetSelisihDay(dt1: string, dt2: string) {
  var tanggal1: any = new Date(dt1);
  var tanggal2: any = new Date(dt2);
  tanggal1.setHours(0, 0, 0, 0);
  tanggal2.setHours(0, 0, 0, 0);
  var selisih = Math.abs(tanggal1 - tanggal2);
  var hariDalamMillisecond = 1000 * 60 * 60 * 24;
  var selisihTanggal = Math.round(selisih / hariDalamMillisecond);
  return selisihTanggal;
}
export function GetNextDay(dt1: string, next: number) {
  if (isNaN(Date.parse(dt1))) {
    dt1 = new Date().toISOString().split("T")[0];
  }
  var hariKedepan = new Date(new Date(dt1).getTime() + next * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  return formatDate(hariKedepan);
}
export function formatDate(date: string) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}
export function getEnv(key: string) {
  if (key == "domainapi") {
    return env.uriApi;
  }
  if (key == "domain") {
    return "https://cmsbankofindia.dipstrategy.co.id/";
  }
  if (key == "token") {
    return "8|QPIdzPvafAonPK2cP2Ko0i1zYY0A0duJJ8wEImz471afe86d";
  }
}
export function GetEncrypt(text: any, logout?: boolean) {
  if (process.versions.openssl <= "1.0.1f") {
    throw new Error("OpenSSL Version too old, vulnerability to Heartbleed");
  }
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(AES_METHOD, Buffer.from(passwords), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}
export function GetDecrypt(text: any, logout?: boolean) {
  try {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift()!, "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(AES_METHOD, Buffer.from(passwords), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    return "";
  }
}

export const FetchData = async (
  uri: string,
  methods: string,
  bodys: any,
  isjson: boolean,
  token: string,
  navigate: any,
  linksucces: any,
  isNotToast?: boolean
) => {
  return fetchQueue.add(async () => {
    let requestOptions: RequestInit = {};
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "text/plain");
    if (methods == "POST" || methods == "PUT") {
      requestOptions = {
        method: methods,
        headers: myHeaders,
        body: bodys,
        redirect: "follow",
      };
    } else {
      requestOptions = {
        method: methods,
        headers: myHeaders,
        redirect: "follow",
      };
    }

    try {
      const apiUrl = env.uriApi + "" + uri;
      const response = await fetch(apiUrl, requestOptions);
      const data = isjson ? await response.json() : await response.text();
      const datatext = data;
      const datajson: any = JSON.parse(GetDecrypt(datatext));
      if (datajson?.code != "200") {
        toast(datajson?.message, {
          autoClose: 6000,
          type: "error",
          position: "bottom-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        if (datajson?.code == "401") {
          setTimeout(() => {
            localStorage.clear();
            RouteChange(navigate, "/dashboard", true);
          }, 800);
        } else if (datajson?.code == "403") {
          setTimeout(() => {
          }, 800);
        }
        return false;
      } else {
        if (
          (datajson?.code == "200" && methods == "PUT") ||
          (datajson?.code == "200" && methods == "POST")
        ) {
          if (!isNotToast) {
            toast(datajson?.message, {
              autoClose: 6000,
              type: "success",
              position: "bottom-center",
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
          if (linksucces != "") {
            setTimeout(() => {
              RouteChange(navigate, linksucces, false);
            }, 800);
          }
        } else if (datajson?.code == "200" && methods == "DELETE") {
          if (!isNotToast) {
            toast(datajson?.message, {
              autoClose: 6000,
              type: "success",
              position: "bottom-center",
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
          if (linksucces != "") {
            setTimeout(() => {
              RouteChange(navigate, linksucces, false);
            }, 800);
          }
        }
        return datajson;
      }
    } catch (error) {
      console.log("debug", error);
      if (methods != "GET" && !isNotToast) {
        toast("Failed to connect to server", {
          autoClose: 6000,
          type: "error",
          position: "bottom-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      return false;
    }
  });
};

export const FetchDataKey = async (
  uri: string,
  methods: string,
  bodys: any,
  isjson: boolean,
  token: string,
  navigate: any,
  linksucces: any,
  isNotToast?: boolean
) => {
  let requestOptions: RequestInit = {};
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (methods == "POST" || methods == "PUT") {
    requestOptions = {
      method: methods,
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(bodys),
      redirect: "follow",
    };
  } else {
    requestOptions = {
      method: methods,
      headers: myHeaders,
      redirect: "follow",
    };
  }

  try {
    const response = await fetch(uri, requestOptions);
    const rawData = isjson ? await response.json() : await response.text();
    let datajson: any = rawData;
    if (typeof rawData === "string") {
      try {
        datajson = JSON.parse(rawData);
      } catch (e) {
        datajson = rawData;
      }
    }
    return datajson;
  } catch (error) {
    return false;
  }
};

export const FetchDataDocument = async (
  uri: string,
  methods: string,
  bodys: any,
  isjson: boolean,
  token: string,
  navigate: any,
  linksucces: any,
  isNotToast?: boolean
) => {
  let requestOptions: RequestInit = {};
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  if (methods == "POST" || methods == "PUT") {
    requestOptions = {
      method: methods,
      headers: myHeaders,
      body: bodys,
      redirect: "follow",
    };
  } else {
    requestOptions = {
      method: methods,
      headers: myHeaders,
      redirect: "follow",
    };
  }

  try {
    const apiUrl = env.uriApi + "" + uri;
    const response = await fetch(apiUrl, requestOptions);
    const data = isjson ? await response.json() : await response.text();
    const datajson: any = JSON.parse(GetDecrypt(data));
    if (datajson?.code != "200") {
      toast(datajson?.message, {
        autoClose: 6000,
        type: "error",
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      if (datajson?.code == "401") {
        setTimeout(() => {
          localStorage.clear();
          RouteChange(navigate, "/dashboard", true);
        }, 800);
      } else if (datajson?.code == "403") {
        setTimeout(() => {
        }, 800);
      }
      return false;
    } else {
      if (
        (datajson?.code == "200" && methods == "PUT") ||
        (datajson?.code == "200" && methods == "POST")
      ) {
        if (!isNotToast) {
          toast(datajson?.message, {
            autoClose: 6000,
            type: "success",
            position: "bottom-center",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        if (linksucces != "") {
          setTimeout(() => {
            RouteChange(navigate, linksucces, false);
          }, 800);
        }
      } else if (datajson?.code == "200" && methods == "DELETE") {
        if (!isNotToast) {
          toast(datajson?.message, {
            autoClose: 6000,
            type: "success",
            position: "bottom-center",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        if (linksucces != "") {
          setTimeout(() => {
            RouteChange(navigate, linksucces, false);
          }, 800);
        }
      }
      return datajson;
    }
  } catch (error) {
    console.log("debug", error);
    return true;
  }
};

export function GetQueryStr(a: string) {
  return new URLSearchParams(window.location.search).get(a);
}
export function removeItem<T>(arr: Array<T>, value: number): Array<T> {
  arr.splice(value, 1);
  return arr;
}
export const Logout = async (
  uri: string,
  mth: string,
  bodys: any,
  token: string,
  navigate: any,
  dispatch: any
) => {
  if (mth != "no") {
    await FetchData(
      "/cms/logout",
      mth,
      bodys,
      false,
      token,
      navigate,
      ""
    );
  }

  dispatch({ type: "auth/setLogin", payload: "" });
  dispatch({ type: "auth/setDatas", payload: "" });
  dispatch({ type: "auth/setPermissions", payload: {} });
  dispatch({ type: "auth/setRoles", payload: [] });

  localStorage.clear();

  RouteChange(navigate, "/dashboard", true);

  return true;
};
export const GetLocaData = (key: string) => {
  const datajson = JSON.parse(
    localStorage.getItem(key) ? GetDecrypt(localStorage.getItem(key)!) : "{}"
  );
  return datajson;
};
export const RouteChange = (
  navigate: any,
  paths: string,
  reload: boolean,
  params?: {}
) => {
  if (reload) {
    navigate.reload();
  } else {
    navigate.push(paths, params);
  }
};
export const GetQueryParam = (key: string | number): string | null => {
  if (typeof key === "number") {
    const segments = window.location.pathname.split("/").filter(Boolean);
    return segments[key] || null;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};
export const getImgBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
export function isStringJSON(text: any) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}
export const GetPathUri = (i: number) => {
  return window.location.pathname.split("/")[i];
};
export function formatAmountNoDecimals(number: string) {
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(number)) {
    number = number.replace(rgx, "$1" + "." + "$2");
  }
  return number;
}
export function formatAmount(number: string | number) {
  number = String(number);
  var numberD = number.split(",");
  var main = numberD[0];
  main = main.replace(/[A-Za-z]/g, "");
  main = main.replace(/[.]/g, "");
  main = main.replace(/[!$%^&*()_+|~=`{}[:;<>?.@#\]]/g, "");
  var numbersubstr = main.substring(1).replace(/[-]/g, "");
  var minus = "";
  if (main.substring(0, 1) == "-") {
    main = numbersubstr;
    minus = "-";
  }
  if (main.length == 0) main = "0";
  else
    main =
      main.substring(0, main.length - 0) +
      "." +
      main.substring(main.length - 0, main.length);
  var num: any = new Number(main);
  num = num.toFixed(0);
  num = num.replace(/\./g, ",");
  var x = num.split(",");
  var x1 = x[0];
  var x2 = x.length > 1 ? "," + x[1] : "";
  var dec = "";
  if (numberD.length > 1) {
    dec = "," + numberD[1];
  }
  dec = dec.replace(/[A-Za-z]/g, "");
  dec = dec.replace(/[.]/g, "");
  dec = dec.replace(/[-!$%^&*()_+|~=`{}[:;<>?.@#\]]/g, "");
  return minus + "" + (num == 0 ? "0" : formatAmountNoDecimals(x1)) + dec;
}
export function NumberClear(cur: string) {
  cur = cur.replaceAll(".", "").replaceAll(",", ".");
  return cur;
}
export function IntlNumberFormat(number: number) {
  const formattedNumber = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
  return formattedNumber;
}
export const GetInitials = function (string: string) {
  var num = 0;
  var names = string.split(" "),
    initials = names[0].substring(0, 3);
  if (!names[0]) {
    names = string.replace(" ", "").split(" ");
    initials = names[0].substring(0, 3);
  }
  if (names.length > 1) {
    if (!names[names.length - 1]) {
      initials = names[names.length - 2].substring(0, 6);
    } else {
      initials += names[names.length - 1].substring(0, 3);
    }
  } else {
    num = 1;
    initials = names[0].substring(0, 6).toUpperCase();
  }
  return initials;
};
export const svgType = (svg: string) => {
  switch (svg) {
    case "money":
      return '<svg fill="#000000" class"h-8 w-8" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 487.4 487.4" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M103.4,196.55c13.4,0,24.3,10.9,24.3,24.3c0,13.4-10.9,24.3-24.3,24.3s-24.3-10.9-24.3-24.3 C79.1,207.45,90,196.55,103.4,196.55z M463.4,329.25H350.9c-5.2,0-9.5,4.2-9.5,9.5v15.2c0,5.2,4.2,9.5,9.5,9.5h112.5 c5.2,0,9.5-4.2,9.5-9.5v-15.2C472.9,333.55,468.6,329.25,463.4,329.25z M447.3,375.75H334.8c-5.2,0-9.5,4.2-9.5,9.5v15.2 c0,5.2,4.2,9.5,9.5,9.5h112.5c5.2,0,9.5-4.2,9.5-9.5v-15.2C456.7,379.95,452.5,375.75,447.3,375.75z M477.9,236.35H365.4 c-5.2,0-9.5,4.2-9.5,9.5v15.2c0,5.2,4.2,9.5,9.5,9.5h112.5c5.2,0,9.5-4.2,9.5-9.5v-15.2C487.4,240.65,483.1,236.35,477.9,236.35z M325.3,292.25v15.2c0,5.2,4.2,9.5,9.5,9.5h112.5c5.2,0,9.5-4.2,9.5-9.5v-15.2c0-5.2-4.2-9.5-9.5-9.5H334.8 C329.6,282.85,325.3,287.05,325.3,292.25z M469.2,224.05c5.2,0,9.5-4.2,9.5-9.5v-15.2c0-5.2-4.2-9.5-9.5-9.5H356.8 c-5.2,0-9.5,4.2-9.5,9.5v15.2c0,5.2,4.2,9.5,9.5,9.5H469.2z M330.5,355.75v-18.8c0-4.2-3.4-7.7-7.7-7.7h-45.7h-196 c1.1-6,1-12.5-1.1-19.2c-3.3-10.7-11.2-19.5-21.2-24.5c-8.7-4.4-17-5-24.6-3.6v-122.9c9.1,1.6,19.2,0.5,29.8-6.7 c6.4-4.3,11.6-10.4,14.6-17.6c3.4-8.1,3.8-15.9,2.5-23.1h297.2c-1.5,6-1.7,12.5-0.1,19.2c3.5,15,15.6,26.9,30.7,30.2 c6.6,1.4,12.9,1.2,18.7-0.3v9.5c0,4.3,3.5,7.8,7.8,7.8H454c4.3,0,7.8-3.5,7.8-7.8v-52.8c0-22.1-17.9-40-40-40H40 c-22.1,0-40,17.9-40,40v205.8c0,22.1,17.9,40,40,40h237.1h45.7l0,0C327.1,363.45,330.5,360.05,330.5,355.75z M230.8,132.95 c48.3,0,87.6,39.3,87.6,87.6s-39.3,87.6-87.6,87.6s-87.6-39.3-87.6-87.6S182.5,132.95,230.8,132.95z M258.7,183.95l-39.2,39 l-16.4-16.5l-17.1,17l16.4,16.5l17,17.1l17.1-17l39.2-39L258.7,183.95z"></path> </g> </g></svg>';
    case "room":
      return '<svg fill="#000000" class"h-8 w-8" viewBox="-13.22 0 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="enable-background:new 0 0 96.43 122.88" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style> <g> <path class="st0" d="M0,115.27h4.39V1.99V0h1.99h82.93h1.99v1.99v113.28h5.14v7.61H0V115.27L0,115.27z M13.88,8.32H81.8h0.83v0.83 v104.89h4.69V3.97H8.36v111.3h4.69V9.15V8.32H13.88L13.88,8.32z M19.75,59.66l4.23-1.21v15.81l-4.23-1.53V59.66L19.75,59.66z"></path> </g> </g></svg>';
    case "in":
      return '<svg fill="#000000" class"h-8 w-8" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>in</title> <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v4h4v-4q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408v-4h-4v4zM0 18.016h8v4l8-6.016-8-5.984v4h-8v4z"></path> </g></svg>';
    case "out":
      return '<svg fill="#000000" class"h-8 w-8" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>out</title> <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v4.992l4-2.496v-2.496q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408v-2.496l-4-2.496v4.992zM0 16l8 6.016v-4h8v-4h-8v-4z"></path> </g></svg>';
    case "guest":
      return '<svg fill="#000000" class"h-8 w-8" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 9C12.067 9 10.5 10.567 10.5 12.5C10.5 14.433 12.067 16 14 16C15.933 16 17.5 14.433 17.5 12.5C17.5 10.567 15.933 9 14 9Z" fill="#212121"></path> <path d="M10.7001 17C9.84 17 8.904 17.6024 8.87933 18.6719C8.86205 19.421 8.99609 20.5246 9.77391 21.4475C10.5705 22.3927 11.9142 23 14 23C16.0858 23 17.4295 22.3927 18.2261 21.4475C19.0039 20.5246 19.1379 19.421 19.1207 18.6719C19.096 17.6024 18.16 17 17.2999 17H10.7001Z" fill="#212121"></path> <path d="M18.8965 4H20.25C21.7688 4 23 5.23122 23 6.75V23.25C23 24.7688 21.7688 26 20.25 26H7.75C6.23122 26 5 24.7688 5 23.25V6.75C5 5.23122 6.23122 4 7.75 4H9.10352C9.42998 2.84575 10.4912 2 11.75 2H16.25C17.5088 2 18.57 2.84575 18.8965 4ZM9.10352 5.5H7.75C7.05964 5.5 6.5 6.05964 6.5 6.75V23.25C6.5 23.9404 7.05964 24.5 7.75 24.5H20.25C20.9404 24.5 21.5 23.9404 21.5 23.25V6.75C21.5 6.05964 20.9404 5.5 20.25 5.5H18.8965C18.57 6.65425 17.5088 7.5 16.25 7.5H11.75C10.4912 7.5 9.42998 6.65425 9.10352 5.5ZM10.5 4.75C10.5 5.44036 11.0596 6 11.75 6H16.25C16.9404 6 17.5 5.44036 17.5 4.75C17.5 4.05964 16.9404 3.5 16.25 3.5H11.75C11.0596 3.5 10.5 4.05964 10.5 4.75Z" fill="#212121"></path> </g></svg>';
    default:
      return '<svg fill="#000000" class"h-8 w-8" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 487.4 487.4" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M103.4,196.55c13.4,0,24.3,10.9,24.3,24.3c0,13.4-10.9,24.3-24.3,24.3s-24.3-10.9-24.3-24.3 C79.1,207.45,90,196.55,103.4,196.55z M463.4,329.25H350.9c-5.2,0-9.5,4.2-9.5,9.5v15.2c0,5.2,4.2,9.5,9.5,9.5h112.5 c5.2,0,9.5-4.2,9.5-9.5v-15.2C472.9,333.55,468.6,329.25,463.4,329.25z M447.3,375.75H334.8c-5.2,0-9.5,4.2-9.5,9.5v15.2 c0,5.2,4.2,9.5,9.5,9.5h112.5c5.2,0,9.5-4.2,9.5-9.5v-15.2C456.7,379.95,452.5,375.75,447.3,375.75z M477.9,236.35H365.4 c-5.2,0-9.5,4.2-9.5,9.5v15.2c0,5.2,4.2,9.5,9.5,9.5h112.5c5.2,0,9.5-4.2,9.5-9.5v-15.2C487.4,240.65,483.1,236.35,477.9,236.35z M325.3,292.25v15.2c0,5.2,4.2,9.5,9.5,9.5h112.5c5.2,0,9.5-4.2,9.5-9.5v-15.2c0-5.2-4.2-9.5-9.5-9.5H334.8 C329.6,282.85,325.3,287.05,325.3,292.25z M469.2,224.05c5.2,0,9.5-4.2,9.5-9.5v-15.2c0-5.2-4.2-9.5-9.5-9.5H356.8 c-5.2,0-9.5,4.2-9.5,9.5v15.2c0,5.2,4.2,9.5,9.5,9.5H469.2z M330.5,355.75v-18.8c0-4.2-3.4-7.7-7.7-7.7h-45.7h-196 c1.1-6,1-12.5-1.1-19.2c-3.3-10.7-11.2-19.5-21.2-24.5c-8.7-4.4-17-5-24.6-3.6v-122.9c9.1,1.6,19.2,0.5,29.8-6.7 c6.4-4.3,11.6-10.4,14.6-17.6c3.4-8.1,3.8-15.9,2.5-23.1h297.2c-1.5,6-1.7,12.5-0.1,19.2c3.5,15,15.6,26.9,30.7,30.2 c6.6,1.4,12.9,1.2,18.7-0.3v9.5c0,4.3,3.5,7.8,7.8,7.8H454c4.3,0,7.8-3.5,7.8-7.8v-52.8c0-22.1-17.9-40-40-40H40 c-22.1,0-40,17.9-40,40v205.8c0,22.1,17.9,40,40,40h237.1h45.7l0,0C327.1,363.45,330.5,360.05,330.5,355.75z M230.8,132.95 c48.3,0,87.6,39.3,87.6,87.6s-39.3,87.6-87.6,87.6s-87.6-39.3-87.6-87.6S182.5,132.95,230.8,132.95z M258.7,183.95l-39.2,39 l-16.4-16.5l-17.1,17l16.4,16.5l17,17.1l17.1-17l39.2-39L258.7,183.95z"></path> </g> </g></svg>';
  }
};
export const getColor = (svg: string) => {
  switch (svg) {
    case "bg-success":
      return "bg-success";
    case "bg-blue":
      return "bg-blue";
    case "bg-green":
      return "bg-green";
    case "bg-purple":
      return "bg-purple";
    case "bg-red":
      return "bg-red";
    case "bg-orange":
      return "bg-orange";
    case "bg-yellow":
      return "bg-yellow";
    case "bg-cyan":
      return "bg-cyan";
    case "bg-transparent":
      return "bg-transparent";
    case "bg-primary":
      return "bg-primary";
    case "bg-secondary":
      return "bg-secondary";
    case "bg-black-red":
      return "bg-blackRed";
    default:
      return " ";
  }
};
export const inArray = (needle: string, haystack: Array<string>) => {
  var length = haystack.length;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true;
  }
  return false;
};
export const GFormatDate = function (date: string) {
  return new Date(date).toLocaleDateString("en-GB");
};
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));