import React, { useState, useEffect } from "react";
import { AddItemForm } from "./components/AddItemForm";
import { Item, ItemList } from "./components/ItemList";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { EditItemModal } from "./components/EditItemModal";
import Snowflake from "./components/Snowflakes";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import TimerIcon from "@mui/icons-material/Timer";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [masterTimer, setMasterTimer] = useState(0);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (name: string, duration: number) => {
    const durationInSeconds = duration * 60;
    const beginAt = masterTimer - durationInSeconds; // When to start cooking
    setItems([...items, { name: name, duration: durationInSeconds, beginAt }]);
    setMasterTimer((prev) => Math.max(prev, durationInSeconds));
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
  };

  const handleRemove = (item: Item) => {
    const newItems = items.filter((i) => i !== item);
    setItems(newItems);
  };

  const handleSave = (name: string, time: number) => {
    const durationInSeconds = time * 60;
    const beginAt = masterTimer - durationInSeconds;
    const newItems = items.map((item) => {
      if (item === editingItem) {
        return { ...item, name, duration: durationInSeconds, beginAt };
      }
      return item;
    });
    setItems(newItems);

    // Set the master timer to the highest duration
    if (!isTimerActive)
      setMasterTimer(Math.max(...newItems.map((item) => item.duration)));

    setEditingItem(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerActive && masterTimer > 0) {
      timer = setInterval(() => {
        setMasterTimer((prev) => prev - 1);
        if (masterTimer === 1) {
          setIsTimerActive(false);
          new Audio("/bells.wav").play();
        }
      }, 1000); // Every second
    } else if (masterTimer === 0) {
      setIsTimerActive(false); // Stop the timer when it reaches 0
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, masterTimer]);

  const getNextItems = () => {
    // if there are no items, return nothing
    if (items.length === 0) return "";

    const nextItems = items
      .filter((item) => item.duration < masterTimer)
      .sort((a, b) => b.duration - a.duration)
      .filter((item, index, array) => item.duration === array?.[0]?.duration)
      .map((item) => item.name);
    return nextItems.join(", ");
  };

  const getNextItemTimer = () => {
    // if there are no items, return nothing
    if (items.length === 0) return 0;

    const nextItems = items
      .filter((item) => item.duration < masterTimer)
      .sort((a, b) => b.duration - a.duration);

    if (nextItems.length === 0) return 0;

    // return the duration of the next first item
    return masterTimer - nextItems[0].duration;
  };

  return (
    <div>
      <Snowflake />
      <VStack
        backgroundColor="black"
        color="white"
        flex="1"
        height="100vh"
        padding="4"
        zIndex="1"
      >
        <HStack justifyContent="space-between" width="100%" height="100%">
          <Box
            backgroundColor="rgba(0, 0, 0, 0.5)"
            zIndex="1"
            flex="1"
            alignItems="center"
            border="1px"
            borderColor="gray.400"
            borderRadius="md"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            height="100%"
          >
            <VStack>
              <Text
                fontSize="8xl"
                textAlign="center"
                width="100%"
                zIndex="1"
                color={isTimerActive ? "white" : "blue.300"}
              >
                {Math.floor(masterTimer / 60)}:
                {(masterTimer % 60).toString().padStart(2, "0")}
              </Text>
              <Text
                fontSize="2xl"
                textAlign="center"
                width="100%"
                zIndex="1"
                color={isTimerActive ? "purple.300" : "blue.100"}
              >
                Next: {getNextItems()} in {Math.floor(getNextItemTimer() / 60)}:
                {(getNextItemTimer() % 60).toString().padStart(2, "0")}
              </Text>
              <HStack flex="1" justifyContent="center">
                <IconButton
                  aria-label={isTimerActive ? "Pause Timer" : "Start Timer"}
                  icon={
                    isTimerActive ? (
                      <PauseCircleOutlineIcon />
                    ) : (
                      <PlayCircleOutlineIcon />
                    )
                  }
                  colorScheme={isTimerActive ? "red" : "green"}
                  zIndex="1"
                  onClick={() => {
                    if (isTimerActive) {
                      setIsTimerActive(false);
                    } else {
                      setIsTimerActive(true);
                    }
                  }}
                  mt="4"
                  disabled={isTimerActive}
                />
                <IconButton
                  aria-label="Reset Timer"
                  icon={<StopCircleIcon />}
                  colorScheme="red"
                  zIndex="1"
                  onClick={() => {
                    setIsTimerActive(false);
                    // Reset the master timer to the highest duration
                    setMasterTimer(
                      Math.max(...items.map((item) => item.duration))
                    );
                  }}
                  mt="4"
                  disabled={isTimerActive}
                  isDisabled={isTimerActive}
                />
                <IconButton
                  aria-label="Set Timer"
                  icon={<TimerIcon />}
                  colorScheme="blue"
                  zIndex="1"
                  onClick={() => {
                    const time = prompt("Set the Time in Minutes");
                    if (time) {
                      setMasterTimer(parseInt(time) * 60);
                    }
                  }}
                  mt="4"
                  disabled={isTimerActive}
                  isDisabled={isTimerActive}
                />
                <IconButton
                  aria-label="Add Items"
                  icon={<PlaylistAddIcon />}
                  colorScheme="purple"
                  zIndex="1"
                  onClick={() => setIsOpen(true)}
                  mt="4"
                  disabled={isTimerActive}
                  isDisabled={isTimerActive}
                />
              </HStack>
            </VStack>
          </Box>
          <Box
            flex="2"
            backgroundColor="white"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <ItemList
              items={items}
              masterTimer={masterTimer}
              isTimerActive={isTimerActive}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
            />
          </Box>
        </HStack>
        <EditItemModal
          isOpen={editingItem != null}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          onSave={handleSave}
        />
      </VStack>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent backgroundColor="gray.800" color="white">
          <ModalHeader>Add Items</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddItemForm onAdd={addItem} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default App;
