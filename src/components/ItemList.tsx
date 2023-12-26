import React, { useEffect, useRef } from "react";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export interface Item {
  name: string;
  duration: number;
}

interface ItemListProps {
  items: Item[];
  masterTimer: number;
  isTimerActive: boolean;
  handleEdit: (item: Item) => void;
  handleRemove: (item: Item) => void;
}

type ListItemIconButtonsProps = {
  item: Item;
  handleEdit: (item: Item) => void;
  handleRemove: (item: Item) => void;
};

const ListItemIconButtons = ({
  item,
  handleEdit,
  handleRemove,
}: ListItemIconButtonsProps) => {
  return (
    <HStack marginTop="4">
      <IconButton
        aria-label="Edit item"
        colorScheme="yellow"
        icon={<EditIcon />}
        onClick={() => handleEdit(item)}
      />
      <IconButton
        aria-label="Remove item"
        icon={<DeleteForeverIcon />}
        colorScheme="red"
        onClick={() => handleRemove(item)}
      />
    </HStack>
  );
};

export const ItemList: React.FC<ItemListProps> = ({
  items,
  masterTimer,
  isTimerActive,
  handleEdit,
  handleRemove,
}) => {
  const playedSoundsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    items.forEach((item, index) => {
      const beginIn = masterTimer - item.duration;
      if (
        beginIn === 0 &&
        !playedSoundsRef.current.has(index) &&
        isTimerActive
      ) {
        new Audio("/bells.wav").play();
        playedSoundsRef.current.add(index);
      }
    });
  }, [items, masterTimer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const itemsInProgress = items.filter(
    (item) => 0 >= masterTimer - item.duration
  );
  const itemsToStart = items.filter((item) => 0 < masterTimer - item.duration);
  itemsToStart.sort((a, b) => b.duration - a.duration);
  itemsInProgress.sort((a, b) => a.duration - b.duration);

  return (
    <HStack height="100%" backgroundColor="black" color="white">
      <VStack
        flex="1"
        alignItems="start"
        border="1px"
        borderColor="gray.400"
        borderRadius="md"
        p="4"
        height="100%"
        zIndex="1"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        overflow="auto"
      >
        {itemsToStart.map((item, index) => {
          const beginIn = Math.max(masterTimer - item.duration, 0);
          return (
            <Box
              backgroundColor="gray.600"
              p="4"
              borderRadius="md"
              key={index}
              width="100%"
            >
              <Text key={index}>
                {item.name} - Begin in {formatTime(beginIn)}
              </Text>
              <ListItemIconButtons
                item={item}
                handleEdit={handleEdit}
                handleRemove={handleRemove}
              />
            </Box>
          );
        })}
      </VStack>
      <VStack
        flex="1"
        alignItems="start"
        border="1px"
        borderColor="gray.400"
        borderRadius="md"
        p="4"
        height="100%"
        zIndex="1"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        overflow="auto"
      >
        {itemsInProgress.map((item, index) => {
          return (
            <Box
              backgroundColor="green.500"
              p="4"
              borderRadius="md"
              key={index}
              width="100%"
            >
              <Text key={index}>
                {item.name} ({formatTime(item.duration)})
              </Text>
              <ListItemIconButtons
                item={item}
                handleEdit={handleEdit}
                handleRemove={handleRemove}
              />
            </Box>
          );
        })}
      </VStack>
    </HStack>
  );
};
