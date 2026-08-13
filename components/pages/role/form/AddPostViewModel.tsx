import { useRouter } from "next/router";
import { IconHome } from "../../../common/icon/SidebarIcon";
import React, { useState } from "react";
import {
  IconAddPost,
  IconPostCategories,
  IconPostImage,
  IconSeo,
} from "../../../common/icon/StepIcon";

const AddPostViewModel = () => {
  const router = useRouter();
  const [stepper, setStepper] = useState([
    {
      icon: <IconAddPost />,
      title: "Add Post Details",
      subTitle: "",
    },
    {
      icon: <IconPostImage />,
      title: "Post Image :",
      subTitle: "",
    },
    {
      icon: <IconPostCategories />,
      title: "Post Categories",
      subTitle: "Add ost cactegory , Status and tags",
    },
    {
      icon: <IconSeo />,
      title: "SEO",
      subTitle: "Add ost cactegory , Status and tags",
    },
  ]);

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
  const [input, setInput] = useState([
    {
      stepper: 0,
      children: [
        {
          language: "id",
          input: [
            {
              label: "Post Title",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "Slug",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "overview",
              type: "text",
              typeInput: "rich-editor",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "description",
              type: "text",
              typeInput: "rich-editor",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
          ],
        },
        {
          language: "en",
          input: [
            {
              label: "Post Title",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "Slug",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "overview",
              type: "text",
              typeInput: "rich-editor",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "description",
              type: "text",
              typeInput: "rich-editor",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
          ],
        },
      ],
    },

    {
      stepper: 1,
      children: [
        {
          language: "id",
          input: [
            {
              label: "Image Dekstop",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image mobile",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image Tablet",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image thumbnail",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image App",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
          ],
        },
        {
          language: "en",
          input: [
            {
              label: "Image Dekstop",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image mobile",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image Tablet",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image thumbnail",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
            {
              label: "Image App",
              type: "text",
              typeInput: "file-image",
              value: "",
              error: false,
              required: true,
              style: "col-span-6",
              placeholder: "",
            },
          ],
        },
      ],
    },

    {
      stepper: 2,
      children: [
        {
          language: "id",
          input: [
            {
              label: "Add Category",
              type: "text",
              typeInput: "select",
              value: "",
              options: [
                {
                  label: "testing",
                  value: "testing",
                },
                {
                  label: "testing2",
                  value: "testing",
                },
                {
                  label: "testing3",
                  value: "testing",
                },
              ],
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
            {
              label: "Add Tag",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
            {
              label: "Publish Status",
              type: "text",
              typeInput: "select",
              value: "",
              options: [
                {
                  label: "testing",
                  value: "testing",
                },
                {
                  label: "testing2",
                  value: "testing",
                },
                {
                  label: "testing3",
                  value: "testing",
                },
              ],
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
            {
              label: "publish Date & Time",
              type: "date",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
          ],
        },
        {
          language: "en",
          input: [
            {
              label: "Add Category",
              type: "text",
              typeInput: "select",
              value: "",
              options: [
                {
                  label: "testing",
                  value: "testing",
                },
                {
                  label: "testing2",
                  value: "testing",
                },
                {
                  label: "testing3",
                  value: "testing",
                },
              ],
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
            {
              label: "Add Tag",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
            {
              label: "Publish Status",
              type: "text",
              typeInput: "select",
              value: "",
              options: [
                {
                  label: "testing",
                  value: "testing",
                },
                {
                  label: "testing2",
                  value: "testing",
                },
                {
                  label: "testing3",
                  value: "testing",
                },
              ],
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
            {
              label: "publish Date & Time",
              type: "date",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "cols-span-12  md:col-span-6",
              placeholder: "",
            },
          ],
        },
      ],
    },

    {
      stepper: 3,
      children: [
        {
          language: "id",
          input: [
            {
              label: "meta title",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "meta keyword",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "meta description",
              type: "text",
              typeInput: "textarea",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
          ],
        },
        {
          language: "en",
          input: [
            {
              label: "meta title",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "meta keyword",
              type: "text",
              typeInput: "base",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
            {
              label: "meta description",
              type: "text",
              typeInput: "textarea",
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
          ],
        },
      ],
    },
  ]);

  function nextStep() {
    setActiveStep(activeStep + 1);
  }

  function previousStep() {
    setActiveStep(activeStep - 1);
  }

  function onChangeBasicInput(
    e: any,
    index: any,
    indexCol: any,
    indexInput: any
  ) {
    let dataInput = [...input];
    dataInput[index].children[indexCol].input[indexInput].value = e;
    setInput([...dataInput]);
  }

  return {
    input,
    stepper,
    activeStep,
    language,
    setActiveLanguage,
    activeLanguage,
    nextStep,
    previousStep,
    onChangeBasicInput,
    router,
  };
};

export default AddPostViewModel;
