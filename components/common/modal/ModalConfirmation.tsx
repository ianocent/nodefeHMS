import React from "react";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Checkbox, Input, Link } from "@nextui-org/react";
import { Button } from "@nextui-org/button";

interface ModalViewProps {
  label?: string;
  title?: string;
  onCheck?: (e) => void;
  value?: string;
  isShowIcon?: boolean;
  IsOpenModel?: boolean;
  ChangeonClose?: (e: boolean) => void;
}

export default function ModalConfirmationComponent(props: ModalViewProps) {
  const [value, setvalue] = useState("");
  const { isShowIcon = true } = props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onSave = () => {
    props.onCheck(true);
    setTimeout(() => {
      onOpenChange();
    }, 1000);
  };

  const onCloseModal = () => {
    props.onCheck(false);
    setTimeout(() => {
      onOpenChange();
    }, 1000);
  };

  useEffect(() => {
    if (props.IsOpenModel) {
      onOpenChange();
    }
    // onOpenChange();
  }, [props.IsOpenModel]);

  return (
    <>
      {isShowIcon ? (
        <button className="w-[21px] " onClick={onOpen}>
          <img src="/assets/images/apps/delete.png" className="w-[21px]" />
        </button>
      ) : (
        <></>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6 px-8 gap-4 text-[#a8b0d3] dark:text-[#a8b0d3] dark:bg-[#19172c] dark:border-[#292f46] justify-center",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#111C43]  text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.title ?? "Confirmation"}
              </ModalHeader>
              <ModalBody>
                <p className="text-[#a8b0d3] dark:text-[#a8b0d3]">
                  {props.label ??
                    "Are you sure you want to continue this action?"}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseModal}
                  className="rounded-md"
                >
                  No
                </Button>
                <Button color="primary" onPress={onSave} className="rounded-md">
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
