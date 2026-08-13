import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  title?: string;
  text?: any;
  isHtml?: boolean;
  IsOpenModel?: boolean;
  ChangeonClose?: (e: boolean) => void;
}

export default function ModalNotedComponent(props: ModalViewProps) {
  const { isHtml = false } = props;
  const urlParams = new URLSearchParams(window.location.search);
  const parent = urlParams.get("parent");
  const add = urlParams.get("add");
  const { title, text } = props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (props.IsOpenModel) {
      onOpenChange();
    }
  }, [props.IsOpenModel]);

  const closeModal = () => {
    props.ChangeonClose(false);
    onOpenChange();
  };

  return (
    <>
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
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 uppercase">
                {title}
              </ModalHeader>
              <ModalBody>
                {isHtml ? (
                  <div
                    className="uppercase"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                ) : (
                  <p className="text-[#a8b0d3] dark:text-[#a8b0d3] uppercase">
                    {text}
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={closeModal}
                  className="rounded-md"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
