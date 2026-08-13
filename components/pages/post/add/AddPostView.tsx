import React from "react";
import AddPostViewModel from "./AddPostViewModel";
import ButtonAddInput from "../../../../components/common/button/ButtonAddInput";
import PaperBase from "../../../../components/common/paper/PaperBase";
import Stepper from "../../../../components/common/stepper/Stepper";
import InputMain from "../../../../components/common/input/InputMain";

const AddPostView = () => {
  const {
    activeLanguage,
    activeStep,
    input,
    language,
    setActiveLanguage,
    stepper,
    nextStep,
    previousStep,
    onChangeBasicInput,router
  } = AddPostViewModel();
  return (
    <PaperBase>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold">Post Details</h2>
          </div>
          <div className="col-span-8 h-fit">
            <div className="flex gap-2">
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

        <div className="grid grid-cols-12 h-fit gap-4 ">
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
                            style: { height: "100px" },
                            onChange: (e) => {
                              onChangeBasicInput(
                                e.target.value,
                                index,
                                indexCol,
                                indexInput
                              );
                            },
                          }}
                          restSelect={{
                            value: inputValue.value,

                            onChange: (e) => {
                              onChangeBasicInput(
                                e.target.value,
                                index,
                                indexCol,
                                indexInput
                              );
                            },
                          }}
                          error={inputValue.error}
                          label={inputValue.label}
                          options={inputValue.options}
                          required={inputValue.required}
                          onChangeFiles={(e) => {
                            onChangeBasicInput(
                              e.target.value,
                              index,
                              indexCol,
                              indexInput
                            );
                          }}
                          rest={{
                            placeholder: inputValue.placeholder,
                            value: inputValue.value,
                            type: inputValue.type,
                            onChange: (e) => {
                              onChangeBasicInput(
                                e.target.value,
                                index,
                                indexCol,
                                indexInput
                              );
                            },
                          }}
                          onChangeRichEditor={(e) => {
                            onChangeBasicInput(e, index, indexCol, indexInput);
                          }}
                          valueRichEditor={inputValue.value}
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
      />
    </PaperBase>
  );
};

export default AddPostView;
