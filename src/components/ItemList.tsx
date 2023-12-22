import React, { useEffect, useRef } from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';

export interface Item {
    name: string;
    duration: number;
    beginAt: number;
  }
  
  interface ItemListProps {
    items: Item[];
    masterTimer: number;
    isTimerActive: boolean;
  }
  
  export const ItemList: React.FC<ItemListProps> = ({ items, masterTimer, isTimerActive }) => {
  
    const playedSoundsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        items.forEach((item, index) => {
        const beginIn = masterTimer - item.duration;
        if (beginIn === 0 && !playedSoundsRef.current.has(index) && isTimerActive) {
            new Audio('/alarm.mp3').play();
            playedSoundsRef.current.add(index);
        }
        });
    }, [items, masterTimer]);

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const itemsInProgress = items.filter(item => 0 >= masterTimer - item.duration);
    const itemsToStart = items.filter(item => 0 < masterTimer - item.duration);
    itemsToStart.sort((a, b) => b.duration - a.duration);
    itemsInProgress.sort((a, b) => a.duration - b.duration);
  
    return (
        <HStack
        height="100%"
        >
        <VStack mt="4" flex="1" alignItems="start" border="1px" borderColor="gray.400" borderRadius="md" p="4" height="100%"
        >
        {itemsToStart.map((item, index) => {
          const beginIn = Math.max(masterTimer - item.duration, 0);
          return (
              <Box
              backgroundColor={beginIn === 0 ? 'green.200' : 'gray.100'}
              p="4"
              borderRadius="md"
              key={index}
              width="100%"
              >
            <Text key={index}>
              {item.name} - Begin in {formatTime(beginIn)}
            </Text>
                  </Box>
          );
        })}
      </VStack>
      <VStack mt="4" flex="1" alignItems="start" border="1px" borderColor="gray.400" borderRadius="md" p="4" height="100%">
          {itemsInProgress.map((item, index) => {
            return (
                <Box
                backgroundColor="green.200"
                p="4"
                borderRadius="md"
                key={index}
                width="100%"
                >
              <Text key={index}>
                {item.name} ({formatTime(item.duration)})
              </Text>
                    </Box>
            );
          })}
        </VStack>
        </HStack>
      );
    };