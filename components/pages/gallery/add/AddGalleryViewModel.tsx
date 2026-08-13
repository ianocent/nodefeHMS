import React, { useState } from "react";
import { uploadMediaData } from "../dataDummy";

const AddGalleryViewModel = () => {
  const [input, setInput] = useState([
    {
      label: "Gallery Name",
      type: "text",
      typeInput: "base",
      value: "",
      error: false,
      required: false,
      style: "col-span-12",
      placeholder: "please insert name of gallery",
    },
    {
      label: "Subject",
      type: "text",
      typeInput: "base",
      value: "",
      error: false,
      required: false,
      style: "col-span-12",
      placeholder: "please insert subject of gallery",
    },
    {
      label: "Starting Date",
      type: "date",
      typeInput: "base",
      value: "",
      error: false,
      required: false,
      style: "col-span-6",
      placeholder: "",
    },
    {
      label: "Ending Date",
      type: "date",
      typeInput: "base",
      value: "",
      error: false,
      required: false,
      style: "col-span-6",
      placeholder: "",
    },
    {
      label: "description",
      type: "text",
      typeInput: "textarea",
      value: "",
      error: false,
      required: false,
      style: "col-span-12",
      placeholder: "",
    },
  ]);
  const [uploadMedia, setUploadMedia] = useState([uploadMediaData]);

  const onChangeRadio = (e: any, index: number) => {
    let upload = [...uploadMedia];
    upload[index].answerRadio = e.target.value;
    upload[index].link = [
      {
        value: "",
        placeholder: "",
        label: "",
      },
    ];
    upload[index].name = [
      {
        value: "",
        placeholder: "",
        label: "",
      },
    ];

    setUploadMedia([...upload]);
  };

  const onChangeFiles = (e: any, index: number) => {
    let upload = [...uploadMedia];
    upload[index].files = e;
   

    setUploadMedia([...upload]);
  };

  const onChangeLink = (e: any, index: number, indexLink: number) => {
    let upload = [...uploadMedia];
    upload[index].link[indexLink].value = e.target.value;
    setUploadMedia([...upload]);
  };

  const onChangeName = (e: any, index: number, indexName: number) => {
    let upload = [...uploadMedia];
    upload[index].name[indexName].value = e.target.value;
    setUploadMedia([...upload]);
  };

  const addLink = (index: number) => {
    let upload = [...uploadMedia];
    upload[index].link.push({
      value: "",
      placeholder: "",
      label: "",
    });
    setUploadMedia([...upload]);
  };

  const addName = (index: number) => {
    let upload = [...uploadMedia];
    upload[index].name.push({
      value: "",
      placeholder: "",
      label: "",
    });
    setUploadMedia([...upload]);
  };

  const addSection = () => {
    let upload = [...uploadMedia];
    upload.push({
      answerRadio: "image",
      files:[],
      name: [
        {
          value: "",
          placeholder: "",
          label: "",
        },
      ],
      link: [
        {
          value: "",
          placeholder: "",
          label: "",
        },
      ],
    });
    setUploadMedia([...upload]);
  };

  return {
    input,
    uploadMedia,
    setUploadMedia,
    onChangeRadio,
    onChangeLink,
    onChangeName,
    addLink,
    addName,
    addSection,
    setInput,
    onChangeFiles
  };
};

export default AddGalleryViewModel;
