import React, { useState, useEffect } from 'react';
import { AddItemForm } from './components/AddItemForm';
import { Item, ItemList } from './components/ItemList';
import { Box, Button, HStack, Text } from '@chakra-ui/react';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [masterTimer, setMasterTimer] = useState(0);

  const addItem = (name: string, duration: number) => {
    const durationInSeconds = duration * 60;
    const beginAt = masterTimer - durationInSeconds; // When to start cooking
    setItems([...items, { name: name, duration: durationInSeconds, beginAt }]);
    setMasterTimer(prev => Math.max(prev, durationInSeconds));
  };


  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerActive && masterTimer > 0) {
      timer = setInterval(() => {
        setMasterTimer(prev => prev - 1);
      }, 1000); // Every second
    } else if (masterTimer === 0) {
      setIsTimerActive(false); // Stop the timer when it reaches 0
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, masterTimer]);

  return (
    <div>
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
      </HStack>
      <HStack
      justifyContent="space-between"
      height="80vh"
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
      <ItemList items={items} masterTimer={masterTimer} isTimerActive={isTimerActive} />
        </Box>
      </HStack>
    </div>
  );
};

export default App;
