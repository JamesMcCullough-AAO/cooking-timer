import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { AddItemForm } from "./AddItemForm";
import { Item } from "./ItemList";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null; // Assuming 'Item' is your item type
  onSave: (name: string, time: number) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent backgroundColor="gray.800" color="white">
        <ModalHeader>Edit Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddItemForm
            onAdd={onSave}
            initialName={item?.name || ""}
            initialTime={item ? (item.duration / 60).toString() : ""} // Assuming duration is in seconds
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
