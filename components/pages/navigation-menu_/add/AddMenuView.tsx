import PaperBase from "../../../common/paper/PaperBase";
import React, { useContext } from "react";
import AddMenuViewModel from "./AddMenuViewModel";
import Stepper from "../../../common/stepper/Stepper";
import InputMain from "../../../common/input/InputMain";
import ButtonAddInput from "../../../common/button/ButtonAddInput";
import Seo from "../../../common/seo";
import { LayoutContext } from "../../../../context/LayoutContext";

const AddMenuView = () => {
  const {
    stepper,
    activeStep,

    activeLanguage,
    language,
    setActiveLanguage,
    input,
    setInput,

    nextStep,
    previousStep,
    onSubmit,
    onCancel,
  } = AddMenuViewModel();
  const layout = useContext(LayoutContext);

  return (
    <PaperBase>
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 h-fit gap-4 border-b border-dashed ">
          <div className="col-span-4">
            <h2 className="text-lg font-bold">Menu Details</h2>
          </div>
          <div className="col-span-8 h-fit">
            <div className="flex gap-2 h-fit">
              {language.map((row) => (
                <div
                  key={row.label + row.value}
                  onClick={() => {
                    setActiveLanguage(row.value);
                  }}
                  className={`${
                    activeLanguage == row.value
                      ? "text-primary border-b border-primary"
                      : ""
                  } cursor-pointer`}
                >
                  {row.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4  h-fit">
          <div className="col-span-4">
            <Stepper data={stepper} activeStep={activeStep} />
          </div>
          <div className="col-span-8 grid grid-cols-12 h-fit  gap-2">
            {input.map(
              (row, index) =>
                row.stepper == activeStep &&
                row.children.map(
                  (col, indexCol) =>
                    col.language == activeLanguage &&
                    col.input.map((inputValue, indexInput) => (
                      <div
                        key={"input" + indexInput}
                        className={`${inputValue.style}`}
                      >
                        <InputMain
                          typeInput={inputValue.typeInput}
                          restArea={{
                            placeholder: inputValue.placeholder,
                            value: inputValue.value,

                            onChange: (e) => {
                              let dataInput = [...input];
                              input[index].children[indexCol].input[
                                indexInput
                              ].value = e.target.value;
                              if (inputValue.label != "Name") {
                                input[index].children[
                                  indexCol == 0 ? indexCol + 1 : indexCol - 1
                                ].input[indexInput].value = e.target.value;
                              }

                              setInput([...dataInput]);
                            },
                          }}
                          restSelect={{
                            value: inputValue.value,
                            "aria-placeholder": inputValue.placeholder,
                            onChange: (e) => {
                              let dataInput = [...input];
                              input[index].children[indexCol].input[
                                indexInput
                              ].value = e.target.value;
                              input[index].children[
                                indexCol == 0 ? indexCol + 1 : indexCol - 1
                              ].input[indexInput].value = e.target.value;
                              setInput([...dataInput]);
                            },
                          }}
                          onChangeSel={(e) => {
                            let dataInput = [...input];
                            input[index].children[indexCol].input[
                              indexInput
                            ].value = e;
                            if (inputValue.label != "Name") {
                              input[index].children[
                                indexCol == 0 ? indexCol + 1 : indexCol - 1
                              ].input[indexInput].value = e.target.value;
                            }

                            console.log("dataInput", dataInput);
                            setInput([...dataInput]);
                          }}
                          error={inputValue.error}
                          label={inputValue.label}
                          options={inputValue.options}
                          required={inputValue.required}
                          rest={{
                            placeholder: inputValue.placeholder,
                            value: inputValue.value,
                            type: inputValue.type,
                            onChange: (e) => {
                              console.log("input", "testupload");
                              let dataInput = [...input];
                              input[index].children[indexCol].input[
                                indexInput
                              ].value = e.target.value;
                              if (inputValue.label != "Name") {
                                input[index].children[
                                  indexCol == 0 ? indexCol + 1 : indexCol - 1
                                ].input[indexInput].value = e.target.value;
                              }
                              setInput([...dataInput]);
                            },
                          }}
                          onChangeFiles={(e) => {
                            let dataInput = [...input];
                            input[index].children[indexCol].input[
                              indexInput
                            ].value = e;
                            setInput([...dataInput]);
                          }}
                          valueSel={inputValue?.options?.find(
                            (row) => row.value == inputValue.value
                          )}
                        />
                      </div>
                    ))
                )
            )}
          </div>
        </div>
      </div>

      <ButtonAddInput
        activeStep={activeStep}
        next={nextStep}
        previous={previousStep}
        stepper={stepper.length - 1}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </PaperBase>
  );
};

export default AddMenuView;
