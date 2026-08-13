import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import InputBase from "../input/InputBase";
import CardDragDrop from "./CardDragDrop";
interface CardInputGalleryProps {
  //   inputRadio: {
  //     label: string;
  //     value: string;
  //     id: string;
  //   }[];
  answerRadio: string;
  onChangeRadio: (data: any) => void;
  onChangeFiles: (data: any) => void;
  onChangeName: (data: any, indexName: number) => void;
  onChangeLink: (data: any, indexLink: number) => void;
  inputName: {
    value: string;
    placeholder: string;
    label: string;
  }[];
  inputLink: {
    value: string;
    placeholder: string;
    label: string;
  }[];
  addName: () => void;
  addLink: () => void;
  id: string;
}
const CardInputGallery = (props: CardInputGalleryProps) => {
  const {
    answerRadio,
    onChangeRadio,
    onChangeLink,
    onChangeName,
    inputLink,
    inputName,
    addLink,
    addName,
    id,
    onChangeFiles,
  } = props;
  const [inputRadio, setInputRadio] = useState([
    {
      value: "image",
      label: "Image",
      id: "image-radio",
    },
    {
      value: "video",
      label: "video",
      id: "video-radio",
    },
    {
      value: "audio",
      label: "audio",
      id: "audio-radio",
    },
    {
      value: "document",
      label: "document",
      id: "document-radio",
    },
  ]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onChangeFiles(files),
  });

  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="flex flex-col gap-2 border-b-2 pb-8">
      <div className="flex gap-4">
        {inputRadio.map((row, index) => (
          <div
            className="flex gap-2 items-center"
            key={"radio-card-gallery" + id + index}
          >
            <input
              type="radio"
              id={row.id + index + id}
              value={row.value}
              checked={answerRadio == row.value}
              onChange={onChangeRadio}
            />
            <label
              className="capitalize font-bold"
              htmlFor={row.id + index + id}
            >
              {row.label}
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-8 ">
  
          <div
            {...getRootProps({
              className:
                "w-[300px] h-[130px] bg-[#E4E2F1] p-4 flex flex-col items-center justify-center rounded-xl",
            })}
          >
            <input {...getInputProps()} />

            {files.length > 0 ? (
              <ul className="list-disc list-inside">{files}</ul>
            ) : (
              <CardDragDrop />
            )}
          </div>
        

        {answerRadio == "image" ? (
          <div className="w-full">
            {inputName.map((row, index) => (
              <InputBase
                label="Image Name"
                error={false}
                rest={{
                  onChange: (e) => onChangeName(e, index),
                  value: row.value,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-1">
              {inputName.map((row, index) => (
                <InputBase
                  label={
                    answerRadio == "video"
                      ? "Video Name"
                      : answerRadio == "audio"
                      ? "Name Audio"
                      : "Name Document"
                  }
                  error={false}
                  rest={{
                    onChange: (e) => onChangeName(e, index),
                    value: row.value,
                  }}
                />
              ))}

              <button
                onClick={addName}
                className="bg-[#766FB6] w-fit mt-2 text-white px-4 py-2 rounded-md"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {inputLink.map((row, index) => (
                <InputBase
                  label="Embeded Link"
                  error={false}
                  rest={{
                    onChange: (e) => onChangeLink(e, index),
                    value: row.value,
                  }}
                />
              ))}

              <button
                onClick={addLink}
                className="bg-[#766FB6] w-fit mt-2 text-white px-4 py-2 rounded-md"
              >
                + Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardInputGallery;
