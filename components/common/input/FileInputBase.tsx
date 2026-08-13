import React from "react";
import { useDropzone } from "react-dropzone";
import CardDragDrop from "../card/CardDragDrop";
interface FileInputBaseProps {
  onChangeFiles: (e: any) => void;
  label: string;
  required?: boolean;
  urlImg?: string;
}
const FileInputBase = (props: FileInputBaseProps) => {
  const { onChangeFiles, label, required, urlImg } = props;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onChangeFiles(files),
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const files = acceptedFiles.map((file: any) => {
    let url = URL.createObjectURL(file);

    return (
      <div key={file.path}>
        <img src={url} className="w-full h-[200px]" />
      </div>
    );
  });

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="font-bold">
          {label} {required ? <span className="text-red">*</span> : null}
        </label>
        <div className="w-full h-[250px] !bg-[#E4E2F1] p-4 flex flex-col items-center justify-center rounded-xl text-center">
          <div
            {...getRootProps({
              className: "",
            })}
            className=" flex flex-col items-center justify-center border-none border-0"
          >
            <input {...getInputProps()} />

            {files.length > 0 ? (
              <ul>{files}</ul>
            ) : urlImg != "" ? (
              <>
                <div key={"img" + label}>
                  <img src={urlImg} className="w-full h-[200px]" />
                </div>
              </>
            ) : (
              <CardDragDrop />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileInputBase;
