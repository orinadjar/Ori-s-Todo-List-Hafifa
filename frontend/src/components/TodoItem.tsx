import { Card, CardContent, Checkbox, IconButton, Typography, Box } from '@mui/material'
import { Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

import type { Todo } from '../types/types';

import { useSetAtom } from 'jotai';
import { deleteTodoAtom, toggleTodoAtom } from '../atoms/todoAtoms';

interface Props {
    todo: Todo;
    openEditDialog: (id:string) => void;
}

const TodoItem = ({ todo, openEditDialog }: Props) => {
    const deleteTodo = useSetAtom( deleteTodoAtom );
    const toggleTodo = useSetAtom( toggleTodoAtom );

    const getPriorityColor = (priority: number): string | undefined => {
        if (priority > 0 && priority <= 2) return '#a6a6a6ff'; 
        if (priority >= 3 && priority <= 5) return '#ff9800'; 
        if (priority >= 6 && priority <= 8) return '#ff5722'; 
        if (priority >= 9 && priority <= 10) return '#f44336';
        return undefined;
    };

    return (
        <Card
            elevation={4} 
            sx={{
                mb: 2, 
                width: '100%',
                height: '100%',
                borderRadius: 2, 
                borderTop: `6px solid ${todo.isCompleted ? '#4caf50' : getPriorityColor(todo.priority)}`,
                borderBottom: `6px solid ${todo.isCompleted ? '#4caf50' : getPriorityColor(todo.priority)}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.01)' } 
            }}>
            <CardContent>
                <Box>
                    <Checkbox
                        checked={todo.isCompleted}
                        onChange={() => toggleTodo(todo.id)} 
                        color='success'
                        icon={<DoneIcon />}
                        checkedIcon={<DoneIcon />} 
                    />

                    <Box sx={{ flexGrow: 1, ml: 1 }}>
                        <Typography variant="h6" 
                        sx={{
                            textDecoration: todo.isCompleted ? 'line-through' : 'none',
                            opacity: todo.isCompleted ? 0.6 : 1,
                            typography: 'h5',
                            fontWeight: 'bold',
                        }}>
                            {todo.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 'bold' }} component="div">
                            <Chip style={{ backgroundColor: getPriorityColor(todo.priority) }} label={todo.subject} />
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 800, fontSize: 15 }}>
                                Priority: {todo.priority} <br /> Due: {todo.date.toString().slice(0, 10)}
                            </Typography>
                        </Typography>
                    </Box>

                    <IconButton onClick={() => openEditDialog(todo.id)}>
                        <EditIcon color='primary' />
                    </IconButton>

                    <IconButton onClick={() => deleteTodo(todo.id)}>
                        <DeleteIcon color='error' />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TodoItem