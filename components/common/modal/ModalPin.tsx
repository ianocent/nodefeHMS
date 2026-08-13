import React from "react";
import { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Checkbox, Input, Link } from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import ButtonSubmit from "../button/ButtonSubmit";
import { useFormPermission } from "../../../hooks/useFormPermission";

interface ModalViewProps {
  label?: string;
  onCheck?: (e:any) => void;
  value?: string;
}

export default function ModalPinComponent( props: ModalViewProps) {
  const [value, setvalue] = useState("");
  const {canCreate,canUpdate} = useFormPermission(1027);
  const [loading, setLoading] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const onSave = () => {
      props.onCheck(value);
      setTimeout(() => {
        onOpenChange();
      }, 1000);
      setLoading(false);
    };
    return (
      <>
        <Button 
        onPress={onOpen}
        className="bg-[#111C43] text-white rounded-md px-4 py-2"
        >
          {props.label || "Open Modal"}
          </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}   classNames={{
          body: "py-6 px-8 gap-4 text-[#a8b0d3] dark:text-[#a8b0d3] dark:bg-[#19172c] dark:border-[#292f46] justify-center",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#111C43]  text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}>
          <ModalContent className="rounded-lg">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Input Pin</ModalHeader>
                <ModalBody>
                <Input
                  autoFocus
                  placeholder="Enter your Pin"
                  variant="bordered"
                  value={value}
                  type="password"
                  onChange={(e) => setvalue(e.target.value)}
                />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose} className="rounded-md bg-gray-400">
                    Close
                  </Button>
                  {/* <Button color="primary" onPress={onSave} className="rounded-md text-white">
                    Submit
                  </Button> */}
                  <ButtonSubmit
                    isBtnAdd={canUpdate || canCreate}
                    onCreate={() => {
                      setLoading(true);
                      onSave();
                    }}
                    loading={loading}
                    label="Submit"
                  />
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  