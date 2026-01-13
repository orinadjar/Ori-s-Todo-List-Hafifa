import { useEffect, useState } from "react";

import { Dialog, DialogTitle,DialogContent, TextField, 
         Button, Stack, MenuItem, Box } from "@mui/material";

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import type { TodoSubject } from "../types/types";
import MapComponent from "./MapComponent";

import type { Todo } from "../types/types";

import { useAtom, useSetAtom } from "jotai";
import { filteredTodosAtom, addTodoAtom, updateTodoAtom } from "../atoms/todoAtoms";

const SUBJECTS: TodoSubject[] = ['Work' , 'Personal' , 'Military' , 'Urgent' , 'General']

interface Props {
  isDialogOpen: boolean;
  editingTodoId: string | null;
  handleCloseDialog: () => void;
}

const TodoDialog = ({ handleCloseDialog, isDialogOpen, editingTodoId }: Props) => {
  const addTodo = useSetAtom( addTodoAtom );
  const updateTodo = useSetAtom( updateTodoAtom );
  const [ filteredTodos ] = useAtom(filteredTodosAtom)

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('General');
  const [priority, setPriority] = useState(2);
  const [date, setDate] = useState<Dayjs | null>(dayjs('2026-01-01'));
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const todoToEdit = editingTodoId ? filteredTodos.find((t) => t.id === editingTodoId) : null;

  const handleCancel = () => {
    setName('');
    setSubject('General');
    setPriority(1);
    setDate(dayjs('2026-01-01'));
    setSelectedLocation(null);
    handleCloseDialog();
  }

  const handleSubmit = () => {
    if(name.trim() && date && selectedLocation){
      const finalDate = new Date(date.format('YYYY-MM-DD'));

      if (editingTodoId) {
        updateTodo(editingTodoId, { name, subject: subject as TodoSubject, priority, date: finalDate, location: selectedLocation });
      } else {
        addTodo(name, subject as TodoSubject, priority, finalDate, selectedLocation);
      }

      handleCancel();
    } else if (!selectedLocation) {
      alert('Most enter a location on the map!');
    }
  }

  useEffect(() =>  {
    if(isDialogOpen && todoToEdit){
        setName(todoToEdit.name);
        setSubject(todoToEdit.subject);
        setPriority(todoToEdit.priority);
        setDate(dayjs(todoToEdit.date));
        setSelectedLocation(todoToEdit.location)
    }
  }, [isDialogOpen ,todoToEdit])

  return (
    <Dialog open={isDialogOpen} onClose={handleCancel} fullWidth maxWidth='xs' PaperProps={{style: { borderRadius: 12 }}}>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', bgcolor: '#f8f9fa' }}>
        Add new Mission
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>

          <TextField label="Write your next mission" fullWidth variant="outlined" value={name} 
                     onChange={(e) => setName(e.target.value)} autoFocus></TextField>

          <TextField select label="Subject" value={subject} 
                     onChange={(e) => setSubject(e.target.value)} fullWidth>
              {SUBJECTS.map((sub) => (
                <MenuItem key={sub} value={sub} >{sub}</MenuItem>
              ))}
          </TextField>

          <TextField select label="Priority" value={priority} onChange={(e) => setPriority(Number(e.target.value))}
                     fullWidth>
               {[...Array(10)].map((_, i) => ( 
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Pick your target date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          
        </Stack>

        {selectedLocation && (
            <Box sx={{ fontSize: '15px', color: 'gray', mt: 3,fontWeight: 'bold' }}>
                Location selected: {selectedLocation[0].toFixed(2)}, {selectedLocation[1].toFixed(2)}
            </Box>
        )}

        <Box sx={{ mt: 1, height: '300px', width: '100%', borderRadius: 2 }}>
            <MapComponent todos={(selectedLocation ? [{ ...todoToEdit, location: selectedLocation }] : []) as Todo[]}
                          onLocationSelect={(cordinates) => setSelectedLocation(cordinates)}/>
        </Box>

      </DialogContent>

      <DialogContent sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>

        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()} sx={{ ml: 25,px: 4, borderRadius: 2 }}>
          {isDialogOpen && editingTodoId ? 'Update' : 'Add Task'}
        </Button>
      </DialogContent>

    </Dialog>
  )
}

export default TodoDialog