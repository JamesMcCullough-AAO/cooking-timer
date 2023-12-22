import React, { useState } from 'react';
import { Button, Input, HStack } from '@chakra-ui/react';

interface AddItemFormProps {
  onAdd: (name: string, time: number) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

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
        <Button type="submit" colorScheme="blue">Add Item</Button>
      </HStack>
    </form>
  );
};
