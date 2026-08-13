import React, { useEffect, useState } from "react";
// import { InputSite } from "../../data";
import InputMain from "../../../../../components/common/input/InputMain";
import ButtonCreate from "../../../../../components/common/button/ButtonCreate";
import { InputSite } from "../../data";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  getImgBase64,
} from "../../../../helper";
import { useSelector } from "react-redux";
import router, { useRouter } from "next/router";
interface SiteProps {
  group: string;
}
const Site = (props: SiteProps) => {
  const { group } = props;
  const routers = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [isloading, setIsloading] = useState<boolean>(false);

  const GetDataTable = async (i?: any, page?: number) => {
    let search = group;
    let arraydat: any = [];

    try {
      setIsloading(true);
      let status = 0;
      if (i == 1) {
        status = 1;
      } else if (i == 2) {
        status = -1;
      }
      let pages = 1;
      if (page) {
        pages = page;
      }
      const datajson = await FetchData(
        "/cms/setting?page=" +
          pages +
          "&limit=50&group=" +
          search +
          "&trash=" +
          status,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      // setdatatable(datajson);
      if (datajson?.code == "200") {
        setIsloading(false);
        datajson?.data.forEach((el: any, index: any) => {
          let typeinput = "text";
          if (el?.key == "web_logo") {
            typeinput = "file";
          } else if (el?.key == "web_favicon") {
            typeinput = "file";
          } else if (el?.key == "meta_image") {
            typeinput = "file";
          }
          var obj = {
            label: el?.key.replace("_", " "),
            type: typeinput,
            typeInput: "base",
            value: el?.value,
            error: false,
            required: false,
            style: "col-span-1",
            placeholder: "Input " + el?.key,
            group: el?.group,
          };
          arraydat.push(obj);
        });

        setInput(arraydat);
      } else {
        // console.log("array-dat", arraydat);
      }
      // console.log("array-dat", arraydat);

      return;
    } catch (error) {
      setIsloading(false);
      // console.log("err", error);
      return;
    }
  };
  const [input, setInput] = useState([]);
  function onChangeInput(value: any, index: number) {
    const tempInput = [...input];
    tempInput[index].value = value;
    setInput([...tempInput]);
    //console.log("logsfile", tempInput);
  }
  const OnSave = async () => {
    try {
      let urisave = "/cms/settings";
      let mth = "POST";
      let postbodyarr = [];
      input.forEach((v: any, i: number) => {
        var obj = {
          group: v?.group,
          key: v?.label,
          value: v?.value,
          status: 1,
        };
        postbodyarr.push(obj);
      });
      const raw = JSON.stringify(postbodyarr);
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        routers,
        "/settings"
      );
      if (saveprocess?.code == "200") {
        setIsloading(false);
      } else {
        setIsloading(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    GetDataTable();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {input.map((inputValue, indexInput) => (
          <div key={"input" + indexInput} className={`${inputValue.style}`}>
            <InputMain
              typeInput={inputValue.typeInput}
              restArea={{
                placeholder: inputValue.placeholder,
                value: inputValue.value,
                style: { height: "100px" },
                onChange: (e) => {
                  onChangeInput(e.target.value, indexInput);
                },
              }}
              restSelect={{
                value: inputValue.value,
                onChange: (e) => {
                  onChangeInput(e.target.value, indexInput);
                },
              }}
              error={inputValue.error}
              label={inputValue.label}
              options={[]}
              required={inputValue.required}
              onChangeFiles={(e) => {
                // console.log("logsfile", e);
                onChangeInput(e.target.value, indexInput);
              }}
              rest={{
                placeholder: inputValue.placeholder,
                value: inputValue.value,
                type: inputValue.type,
                onChange: async (e) => {
                  // console.log("fileslog", e);
                  var val: any = "";
                  if (inputValue.type == "file") {
                    try {
                      val = await getImgBase64(e[0]);
                    } catch (error) {}
                  } else {
                    val = e.target.value;
                  }
                  // console.log("input", val);
                  //onChangeInput(e.target.value, indexInput);
                  onChangeInput(val, indexInput);
                },
              }}
              onChangeRichEditor={(e) => {
                onChangeInput(e.target.value, indexInput);
              }}
              valueRichEditor={inputValue.value}
            />
          </div>
        ))}
      </div>
      <ButtonCreate
        onCancel={() => {}}
        onCreate={() => {
          OnSave();
          //console.log("input", input);
        }}
      />
    </div>
  );
};

export default Site;
