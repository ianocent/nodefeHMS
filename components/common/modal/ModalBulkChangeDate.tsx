import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
} from "@nextui-org/react";

interface ModalBulkChangeDateProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newCheckIn: string, newCheckOut: string) => void;
  selectedCount: number;
  currentCheckIn?: string;
  currentCheckOut?: string;
}

export default function ModalBulkChangeDate({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  currentCheckIn,
  currentCheckOut,
}: ModalBulkChangeDateProps) {
  const [checkIn, setCheckIn] = useState(currentCheckIn || "");
  const [checkOut, setCheckOut] = useState(currentCheckOut || "");

  const handleConfirm = () => {
    if (!checkIn || !checkOut) {
      alert("Please fill both check-in and check-out dates");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date must be after check-in date");
      return;
    }
    onConfirm(checkIn, checkOut);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: "bg-white dark:bg-[#19172c]",
        header: "border-b border-gray-200 dark:border-[#292f46]",
        body: "py-6 px-8",
        footer: "border-t border-gray-200 dark:border-[#292f46]",
      }}
    >
      <ModalContent className="rounded-lg shadow-xl">
        <ModalHeader className="text-lg font-semibold">
          Change Check-in / Check-out Date
        </ModalHeader>
        <ModalBody>
          <p className="text-default-600 mb-4">
            You are about to update dates for <strong>{selectedCount}</strong> reservation(s).
          </p>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="date"
              label=""
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              fullWidth
              variant="bordered"
            />

            <Input
              type="date"
              label=""
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              fullWidth
              variant="bordered"
            />
          </div>

          {currentCheckIn && currentCheckOut && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Current dates (first selected item):</p>
              <p>Check-in: <strong>{currentCheckIn}</strong></p>
              <p>Check-out: <strong>{currentCheckOut}</strong></p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} className="bg-gray-400 rounded-md">
            Cancel
          </Button>
          <Button color="primary" onPress={handleConfirm} className="text-white rounded-md">
            Update Dates
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}