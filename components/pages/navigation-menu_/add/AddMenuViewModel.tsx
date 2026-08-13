import { IconHome } from "../../../common/icon/SidebarIcon";
import React, { useEffect, useState } from "react";
import { formAddMenu } from "../data";
import {
  IconAddPost,
  IconPostCategories,
  IconPostImage,
} from "../../../common/icon/StepIcon";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../helper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const AddMenuViewModel = () => {
  const [stepper, setStepper] = useState([
    {
      icon: <IconAddPost />,
      title: "Menu Form",
      subTitle: "",
    },
    {
      icon: <IconPostImage />,
      title: "Connect to Module or Use Direct Url :",
      subTitle: "",
    },
    {
      icon: <IconPostCategories />,
      title: "Image",
      subTitle: "",
    },
  ]);
  const routers = useRouter();
  const [idusr, setidusr] = useState("0");

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [language, setLanguage] = useState([
    {
      value: "en",
      label: "English",
    },
    {
      value: "id",
      label: "Indonesia",
    },
  ]);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [activeStep, setActiveStep] = useState(0);
  const [input, setInput] = useState([...formAddMenu]);
  const [loading, setloading] = useState(false);

  function nextStep() {
    setActiveStep(activeStep + 1);
  }

  function onCancel() {
    routers.push("/navigation-menu", {});
  }
  function previousStep() {
    setActiveStep(activeStep - 1);
  }
  const onSubmit = async () => {
    try {
      let urisave = "/cms/menu";
      let mth = "POST";

      const raw = JSON.stringify({
        parent_id: input[0].children[0].input[0].value,
        page_id: input[1].children[0].input[0].value,
        name: {
          en: input[0].children[1].input[1].value,
          id: input[0].children[0].input[1].value,
        },
        media: {
          icon: input[2].children[0].input[2].value,
          dekstop: input[2].children[0].input[0].value,
          mobile: input[2].children[0].input[1].value,
          thumbnail: input[2].children[0].input[3].value,
        },
        url: input[1].children[0].input[2].value,
        target: input[1].children[0].input[1].value,
        visibility: input[0].children[0].input[2].value,
        status: 1,
      });

      if (idusr != "0") {
        urisave = "/cms/menu/" + idusr;
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        routers,
        "/navigation-menu"
      );
      if (saveprocess?.code == "200") {
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const GetData = async (i: any) => {
    try {
      let getuuri = "/cms/menu/" + i + "/update";
      if (i == 0) {
        getuuri = "/cms/menu/create";
      }
      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        routers,
        ""
      );

      let dataInput = [...input];
      //parent_id
      input[0].children[0].input[0].value = datauser?.data?.parent_id?.value;
      input[0].children[1].input[0].value = datauser?.data?.parent_id?.value;
      //options parent_id
      input[0].children[0].input[0].options = datauser?.master?.menus;
      input[0].children[1].input[0].options = datauser?.master?.menus;

      //name
      input[0].children[0].input[1].value = datauser?.data?.name?.id;
      input[0].children[1].input[1].value = datauser?.data?.name?.en;
      //visibility-category
      input[0].children[0].input[2].value = datauser?.data?.visibility?.value;
      input[0].children[1].input[2].value = datauser?.data?.visibility?.value;
      //status
      input[0].children[0].input[3].value = datauser?.data?.status?.value;
      input[0].children[1].input[3].value = datauser?.data?.status?.value;
      //options status_id
      input[0].children[0].input[3].options = datauser?.master?.statuses;
      input[0].children[1].input[3].options = datauser?.master?.statuses;
      //pagesid
      input[1].children[0].input[0].value = datauser?.data?.relation?.page?.id;
      input[1].children[1].input[0].value = datauser?.data?.relation?.page?.id;
      //options pagesid
      input[1].children[0].input[0].options = datauser?.master?.pages;
      input[1].children[1].input[0].options = datauser?.master?.pages;
      //target
      input[1].children[0].input[1].value = datauser?.data?.target?.value;
      input[1].children[1].input[1].value = datauser?.data?.target?.value;
      //directurl
      input[1].children[0].input[2].value = datauser?.data?.url;
      input[1].children[1].input[2].value = datauser?.data?.url;
      //media
      input[2].children[0].input[2].value =
        datauser?.data?.media?.image?.icon ?? "";
      input[2].children[1].input[2].value =
        datauser?.data?.media?.image?.icon ?? "";
      input[2].children[0].input[0].value =
        datauser?.data?.media?.image?.dekstop ?? "";
      input[2].children[1].input[0].value =
        datauser?.data?.media?.image?.dekstop ?? "";
      input[2].children[0].input[1].value =
        datauser?.data?.media?.image?.mobile ?? "";
      input[2].children[1].input[1].value =
        datauser?.data?.media?.image?.mobile ?? "";
      input[2].children[0].input[3].value =
        datauser?.data?.media?.image?.thumbnail ?? "";
      input[2].children[1].input[3].value =
        datauser?.data?.media?.image?.thumbnail ?? "";

      setInput([...dataInput]);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    const idreq = GetQueryParam(2);
    if (idreq) {
      GetData(idreq);
      setidusr(idreq);
    } else {
      GetData(0);
      setidusr("0");
    }
  }, []);
  return {
    stepper,
    activeStep,
    setActiveStep,
    activeLanguage,
    setActiveLanguage,
    language,
    input,
    setInput,
    nextStep,
    previousStep,
    onSubmit,
    onCancel,
  };
};

export default AddMenuViewModel;
