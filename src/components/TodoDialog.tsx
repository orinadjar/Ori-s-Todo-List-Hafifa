import { useEffect, useState } from "react";

import { Dialog, DialogTitle,DialogContent, TextField, 
         Button, Stack, MenuItem } from "@mui/material";

import { useTodoContext } from '../context/todoContext';
import type { TodoSubject } from "../types/types";

const SUBJECTS: TodoSubject[] = ['Work' , 'Personal' , 'Military' , 'Urgent' , 'General']

const TodoDialog = () => {
  const { addTodo, handleCloseDialog, isDialogOpen, editingTodoId, filteredTodos, updateTodo } = useTodoContext();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('General');
  const [priority, setPriority] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCancel = () => {
    setName('');
    setSubject('General');
    setPriority(1);
    setDate(new Date().toISOString().split('T')[0]);
    handleCloseDialog();
  }

  const handleSubmit = () => {
    if(name.trim()){
      const finalDate = date ? new Date(date) : new Date();

      if (editingTodoId) {
        updateTodo(editingTodoId, { name, subject: subject as TodoSubject, priority, date: finalDate });
      } else {
        addTodo(name, subject as TodoSubject, priority, finalDate);
      }

      handleCancel();
    }
  }

  useEffect(() =>  {
    if(isDialogOpen && editingTodoId){
      const todoToEdit = filteredTodos.find((todo) => todo.id === editingTodoId);

      if(todoToEdit){
        setName(todoToEdit.name);
        setSubject(todoToEdit.subject);
        setPriority(todoToEdit.priority);
        setDate(todoToEdit.date.toISOString().split('T')[0]);
      }
    }
  }, [editingTodoId])

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
               {[...Array(10)].map((_, i) => ( // empty array with 10 slots, i indicates index
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
          </TextField>

          <TextField label="Target Date" type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}></TextField>
          
        </Stack>
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