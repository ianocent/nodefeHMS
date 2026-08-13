import {
  IconDelete2,
  IconTrush,
} from "../../../../../components/common/icon/CardIcon";
import InputBase from "../../../../../components/common/input/InputBase";
import React, { useState } from "react";
import { InputSocialMedia, InputSocialMediaTemp } from "../../data";

const SocialMedia = () => {
  const [input, setInput] = useState(InputSocialMedia);
  return (
    <div>
      <div className="flex gap-4 justify-between items-center border-b border-dashed pb-2">
        <h3 className="title-h3">Setting Social Media</h3>
        <button
          className="bg-primary px-2 py-2 text-[14px] text-white rounded-md"
          onClick={() => {
            // onCreate();
            let tempInput = [...input];

            tempInput.push({
              section: [
                {
                  label: "Platform Social Media",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: false,
                  style: "col-span-1",
                  placeholder: "Insert name of platform",
                },
                {
                  label: "value",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: false,
                  style: "col-span-1",
                  placeholder: "Insert name of value",
                },
                {
                  label: "Link sosial media",
                  type: "text",
                  typeInput: "base",
                  value: "",
                  error: false,
                  required: false,
                  style: "col-span-1",
                  placeholder: "Insert name of platform",
                },
              ],
            });
            setInput([...tempInput]);
          }}
        >
          + Add Template
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {input.map((inputTemp, index) => (
          <div className="flex flex-col gap-2 p-2 border rounded-md">
            {inputTemp.section.map((section, indexSection) => (
              <div key={section.label + "section" + indexSection + index}>
                <InputBase
                  error={section.error}
                  label={section.label}
                  rest={{
                    value: section.value,
                    onChange: (e) => {
                      let tempInput: any = [...input];
                      tempInput[index].section[indexSection].value =
                        e.target.value;
                      setInput(tempInput);
                    },
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => {
                let tempInput = [...input];
                tempInput.splice(index, 1);
                setInput([...tempInput]);
              }}
            >
              <IconDelete2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
