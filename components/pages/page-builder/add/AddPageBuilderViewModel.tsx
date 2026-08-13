import { IconHome } from "../../../../components/common/icon/SidebarIcon";
import React, { useState } from "react";
import { IconAddPost, IconSeo } from "../../../common/icon/StepIcon";
interface OnChangeBasicInputProps {
  e: any;
  index: any;
  indexCol: any;
  indexSection: any;
  indexInput: any;
}
const AddPageBuilderViewModel = () => {
  const [stepper, setStepper] = useState([
    {
      icon: <IconAddPost />,
      title: "Add Post Details",
      subTitle: "",
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
  function nextStep() {
    setActiveStep(activeStep + 1);
  }

  function previousStep() {
    setActiveStep(activeStep - 1);
  }

  const [input, setInput] = useState([
    {
      stepper: 0,
      children: [
        {
          language: "id",
          section: [
            {
              input: [
                {
                  label: "Name",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: true,
                  style: "col-span-12",
                  placeholder: "",
                },
                {
                  label: "Type",
                  type: "text",
                  value: "",
                  error: false,
                  style: "col-span-12",
                  options: [
                    {
                      label: "rich-editor",
                      value: "rich-editor",
                    },
                    {
                      label: "custom",
                      value: "custom",
                    },
                  ],
                  typeInput: "select",
                  category: {
                    label: "Category",
                    type: "text",
                    typeInput: "select",
                    value: "",
                    error: false,
                    required: true,
                    style: "col-span-6",
                    placeholder: "",
                  },
                  template: {
                    label: "Template",
                    type: "text",
                    typeInput: "select",
                    value: "",
                    error: false,
                    required: true,
                    style: "col-span-6",
                    placeholder: "",
                  },
                  sectionRichEditor: [
                    {
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
          ],
        },
        {
          language: "en",
          section: [
            {
              input: [
                {
                  label: "Name",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: true,
                  style: "col-span-12",
                  placeholder: "",
                },
                {
                  label: "Type",
                  type: "text",
                  value: "",
                  error: false,
                  style: "col-span-12",
                  options: [
                    {
                      label: "rich-editor",
                      value: "rich-editor",
                    },
                    {
                      label: "custom",
                      value: "custom",
                    },
                  ],
                  typeInput: "select",
                  category: {
                    label: "Category",
                    type: "text",
                    typeInput: "select",
                    value: "",
                    error: false,
                    required: true,
                    style: "col-span-6",
                    placeholder: "",
                  },
                  template: {
                    label: "Template",
                    type: "text",
                    typeInput: "select",
                    value: "",
                    error: false,
                    required: true,
                    style: "col-span-6",
                    placeholder: "",
                  },
                  sectionRichEditor: [
                    {
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
          ],
        },
      ],
    },
    {
      stepper: 1,
      children: [
        {
          language: "id",
          section: [
            {
              input: [
                {
                  label: "Meta Title",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: true,
                  style: "col-span-12",
                  placeholder: "",
                },
                {
                  label: "Meta Keyword",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: true,
                  style: "col-span-12",
                  placeholder: "",
                },
                {
                  label: "Meta Description",
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
        {
          language: "en",
          section: [
            {
              input: [
                {
                  label: "Meta Title",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: true,
                  style: "col-span-12",
                  placeholder: "",
                },
                {
                  label: "Meta Keyword",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: true,
                  style: "col-span-12",
                  placeholder: "",
                },
                {
                  label: "Meta Description",
                  type: "textarea",
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
      ],
    },
  ]);

  function onChangeBasicInput(props: OnChangeBasicInputProps) {
    const { e, index, indexCol, indexInput, indexSection } = props;
    let dataInput = [...input];
    dataInput[index].children[indexCol].section[indexSection].input[
      indexInput
    ].value = e;
    setInput([...dataInput]);
  }
  function addSectionRicchEditor(props: OnChangeBasicInputProps) {
    let dataInput = [...input];
    const { e, index, indexCol, indexInput, indexSection } = props;
    dataInput[index].children[indexCol].section[indexSection].input[
      indexInput
    ].sectionRichEditor?.push({
      value: "",
      error: false,
      required: true,
      style: "col-span-12",
      placeholder: "",
    });
    setInput([...dataInput]);
  }
  function addSection() {
    let dataInput = [...input];
    const indexLanguage = dataInput[activeStep].children.findIndex(
      (obj) => obj.language === activeLanguage
    );
    console.log(activeStep), console.log(indexLanguage);
    console.log(dataInput);
    dataInput[activeStep].children[indexLanguage].section.push({
      input: [
        {
          label: "Name",
          type: "text",
          typeInput: "base",
          value: "",
          error: false,
          required: true,
          style: "col-span-12",
          placeholder: "",
        },
        {
          label: "Type",
          type: "text",
          value: "",
          error: false,
          style: "col-span-12",
          options: [
            {
              label: "rich-editor",
              value: "rich-editor",
            },
            {
              label: "custom",
              value: "custom",
            },
          ],
          typeInput: "select",
          category: {
            label: "Category",
            type: "text",
            typeInput: "select",
            value: "",
            error: false,
            required: true,
            style: "col-span-6",
            placeholder: "",
          },
          template: {
            label: "Template",
            type: "text",
            typeInput: "select",
            value: "",
            error: false,
            required: true,
            style: "col-span-6",
            placeholder: "",
          },
          sectionRichEditor: [
            {
              value: "",
              error: false,
              required: true,
              style: "col-span-12",
              placeholder: "",
            },
          ],
        },
      ],
    });
    setInput([...dataInput]);
  }

  function onDeleteSection(props: OnChangeBasicInputProps) {
    const { e, index, indexCol, indexInput, indexSection } = props;
    let dataInput = [...input];
    dataInput[index].children[indexCol].section.splice(indexSection, 1);
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
    addSectionRicchEditor,
    addSection,
    onDeleteSection,
  };
};

export default AddPageBuilderViewModel;
