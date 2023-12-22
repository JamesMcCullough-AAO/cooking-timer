import React, { useState, useEffect } from 'react';
import { AddItemForm } from './components/AddItemForm';
import { Item, ItemList } from './components/ItemList';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { EditItemModal } from './components/EditItemModal';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [masterTimer, setMasterTimer] = useState(0);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const addItem = (name: string, duration: number) => {
    const durationInSeconds = duration * 60;
    const beginAt = masterTimer - durationInSeconds; // When to start cooking
    setItems([...items, { name: name, duration: durationInSeconds, beginAt }]);
    setMasterTimer(prev => Math.max(prev, durationInSeconds));
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
  };

  const handleRemove = (item: Item) => {
    const newItems = items.filter(i => i !== item);
    setItems(newItems);
  }

  const handleSave = (name: string, time: number) => {
    const durationInSeconds = time * 60;
    const beginAt = masterTimer - durationInSeconds;
    const newItems = items.map(item => {
      if (item === editingItem) {
        return { ...item, name, duration: durationInSeconds, beginAt };
      }
      return item;
    });
    setItems(newItems);

    // Set the master timer to the highest duration
    setMasterTimer(Math.max(...newItems.map(item => item.duration)));

    setEditingItem(null);
  };


  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerActive && masterTimer > 0) {
      timer = setInterval(() => {
        setMasterTimer(prev => prev - 1);
        if (masterTimer === 1) {
          setIsTimerActive(false);
          new Audio('/bells.wav').play();
        }
      }, 1000); // Every second
    } else if (masterTimer === 0) {
      setIsTimerActive(false); // Stop the timer when it reaches 0
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, masterTimer]);

  return (
    <VStack
    backgroundColor="black"
    color="white"
    flex="1"
    height="100vh"
    padding="4"
    >
      <AddItemForm onAdd={addItem} />
      <HStack
      flex="1"
      justifyContent="center"
      >
      <Button
        colorScheme={isTimerActive ? 'red' : 'green'}
        onClick={() => 
          {
            if(isTimerActive) {
              setIsTimerActive(false)
            } else {
              setIsTimerActive(true)
            }
          }
          
          } 
        mt="4"
        disabled={isTimerActive}
      >
        {isTimerActive ? 'Pause' : 'Start'}
      </Button>
      <Button
        colorScheme="red"
        onClick={() => {
          setIsTimerActive(false);
          // Reset the master timer to the highest duration
          setMasterTimer(Math.max(...items.map(item => item.duration)));
        }}
        mt="4"
        disabled={isTimerActive}
        isDisabled={isTimerActive}
      >
        Reset
      </Button>
      <Button
        colorScheme="blue"
        onClick={() => {
          const time = prompt('Set the Time in Minutes');
          if (time) {
            setMasterTimer(parseInt(time)*60);
          }
        }}
        mt="4"
        disabled={isTimerActive}
        isDisabled={isTimerActive}
      >
        Set Timer
      </Button>
      
      </HStack>
      <HStack
      justifyContent="space-between"
      width="100%"
      height="100%"
      >
        <Box
         mt="4" 
         flex="1" 
         alignItems="start" 
         border="1px" borderColor="gray.400" borderRadius="md" p="4" height="100%"
         display="flex"
         justifyContent="center"
         flexDirection="column"
        >
      <Text fontSize="8xl" mt="4" textAlign="center" width="100%"
      color={isTimerActive ? 'white': 'blue.300'}
      >
        {Math.floor(masterTimer / 60)}:{(masterTimer % 60).toString().padStart(2, '0')}
      </Text>
        </Box>
      <Box
        flex="2"
        backgroundColor="white"
        height="100%"
         display="flex"
         flexDirection="column"
         justifyContent="center"
        >
      <ItemList items={items} masterTimer={masterTimer} isTimerActive={isTimerActive} handleEdit={handleEdit} handleRemove={handleRemove} />
        </Box>
      </HStack>
      <EditItemModal
        isOpen={editingItem != null} 
        onClose={() => setEditingItem(null)} 
        item={editingItem} 
        onSave={handleSave}
      />
    </VStack>
  );
};

export default App;
