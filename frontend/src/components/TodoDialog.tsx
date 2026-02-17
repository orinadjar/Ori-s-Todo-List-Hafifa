import { useEffect, useState } from "react";

import {
  Dialog, DialogTitle, DialogContent, TextField,
  Button, Stack, MenuItem, Box
} from "@mui/material";

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import type { TodoSubject } from "../types/types";
import TodoMapComponent from "./TodoMapComponent";

import { useTodos } from "../hooks/useTodos";

const SUBJECTS: TodoSubject[] = ['Work', 'Personal', 'Military', 'Urgent', 'General']

interface Props {
  isDialogOpen: boolean;
  editingTodoId: string | null;
  handleCloseDialog: () => void;
}

const TodoDialog = ({ handleCloseDialog, isDialogOpen, editingTodoId }: Props) => {
  const { todos, addTodo, updateTodo } = useTodos();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('General');
  const [priority, setPriority] = useState(2);
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const [geometryType, setGeometryType] = useState<'Point' | 'Polygon'>('Point');
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][][] | null>(null);
  const [pointCoordinates, setPointCoordinates] = useState<[number, number] | null>(null);

  const todoToEdit = editingTodoId ? todos.find((t) => t.id === editingTodoId) : null;

  const handleCancel = () => {
    setName('');
    setSubject('General');
    setPriority(1);
    setDate(dayjs());
    setPointCoordinates(null);
    setPolygonCoordinates(null);
    handleCloseDialog();
  }

  const handleSubmit = () => {
    if (name.trim() && date && (pointCoordinates || polygonCoordinates)) {
      const finalDate = new Date(date.format('YYYY-MM-DD'));

      const todoData = {
        name,
        subject: subject as TodoSubject,
        priority,
        date: finalDate,
        geom: geometryType === 'Point' && pointCoordinates
          ? { type: 'Point' as const, coordinates: pointCoordinates }
          : { type: 'Polygon' as const, coordinates: polygonCoordinates ?? [] }
      }

      if (editingTodoId) {
        updateTodo({ todoId: editingTodoId, fields: todoData });
      } else {
        addTodo(todoData);
      }
      handleCancel();
    } else {
      alert(geometryType === 'Point' ? 'Please select a location!' : 'Please draw a polygon!');
    }
  }

  useEffect(() => {
    if (isDialogOpen && todoToEdit) {
      setName(todoToEdit.name);
      setSubject(todoToEdit.subject);
      setPriority(todoToEdit.priority);
      setDate(dayjs(todoToEdit.date));
      setGeometryType(todoToEdit.geom.type);

      if (todoToEdit.geom.type === 'Polygon') {
        setPolygonCoordinates(todoToEdit.geom.coordinates as number[][][]);
        setPointCoordinates(null);
      }
      else if (todoToEdit.geom.type === 'Point') {
        setPointCoordinates(todoToEdit.geom.coordinates as [number, number]);
        setPolygonCoordinates(null);
      }
    }
  }, [isDialogOpen, todoToEdit]);

  let locationText: string | null = null;

  if (geometryType === 'Point' && pointCoordinates) {
    locationText = `${pointCoordinates[0].toFixed(2)}, ${pointCoordinates[1].toFixed(2)}`;
  }

  if (geometryType === 'Polygon' && polygonCoordinates) {
    locationText = JSON.stringify(polygonCoordinates);
  }

  return (
    <Dialog open={isDialogOpen} onClose={handleCancel} fullWidth maxWidth='xs' PaperProps={{ style: { borderRadius: 12 } }}>
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

        <TextField select label="Geometry Type" value={geometryType} fullWidth sx={{ mt: 4 }}
          onChange={(e) => setGeometryType(e.target.value as 'Point' | 'Polygon')}>
          <MenuItem value='Point'>Point</MenuItem>
          <MenuItem value='Polygon'>Polygon</MenuItem>
        </TextField>

        {locationText && (
          <Box sx={{ fontSize: '15px', color: 'gray', mt: 3, fontWeight: 'bold' }}>
            Location selected: {locationText}
          </Box>
        )}

        <Box sx={{ mt: 1, height: '300px', width: '100%', borderRadius: 2 }}>
          <TodoMapComponent
            mode={geometryType}
            todos={todoToEdit ? [{
              ...todoToEdit,
              geom: geometryType === 'Point' && pointCoordinates
                ? { type: 'Point' as const, coordinates: pointCoordinates }
                : geometryType === 'Polygon' && polygonCoordinates
                  ? { type: 'Polygon' as const, coordinates: polygonCoordinates }
                  : todoToEdit.geom || { type: 'Point' as const, coordinates: [0, 0] }
            }] : []}
            onLocationSelect={(cordinates) => setPointCoordinates(cordinates)}
            onPolygonSelect={(coordinates) => setPolygonCoordinates(coordinates)}
          />
        </Box>

      </DialogContent>

      <DialogContent sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>

        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()} sx={{ ml: 25, px: 4, borderRadius: 2 }}>
          {isDialogOpen && editingTodoId ? 'Update' : 'Add Task'}
        </Button>
      </DialogContent>

    </Dialog>
  )
}

export default TodoDialog