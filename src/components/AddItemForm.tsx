import React, { useState } from 'react';
import { Button, Input, HStack, IconButton } from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';

interface AddItemFormProps {
  onAdd: (name: string, time: number) => void;
  initialName?: string;
  initialTime?: string;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd, initialName = '', initialTime = '' }) => {
  const [name, setName] = useState(initialName);
  const [time, setTime] = useState(initialTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(name, parseInt(time));
    setName('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <HStack mt="4">
        <Input 
          placeholder="Item name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <Input 
          placeholder="Time in minutes" 
          type="number"
          value={time} 
          onChange={(e) => setTime(e.target.value)} 
        />
        <IconButton 
        aria-label="Add item"
        icon={<AddIcon />}
        type="submit" 
        colorScheme="blue"
        />
      </HStack>
    </form>
  );
};
