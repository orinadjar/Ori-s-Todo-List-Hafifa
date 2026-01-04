import { useState, useMemo, useEffect } from "react";

import { TodoContext } from "./todoContext";
import type { Todo, TodoSubject } from "../types/types";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
    children: React.ReactNode;
}

export function TodoProvider({ children }: Props){
    // states
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedData = localStorage.getItem('todos');

        if(savedData){
            return JSON.parse(savedData);
        }

        return [];
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos])

    const debouncedSearch = useDebounce(searchQuery, 300);

    // function to get the todos after the search from he user (usng debounce to prevent usless calculations)
    const filteredTodos = useMemo(() => {
        return todos.filter((todo) => todo.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }, [debouncedSearch, todos]);

    const addTodo = (name: string, subject: TodoSubject, priority: number, date: Date) => {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            name,
            subject,
            priority,
            date,
            isCompleted: false,
        };
        setTodos((prev) => [...prev, newTodo]);
    };

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }

    const toggleTodo = (id: string) => {
        setTodos((prev) => prev.map((todo) => 
            (todo.id === id ? {...todo, isCompleted: !todo.isCompleted} : todo)));
    }

    const updateTodo = (id: string, fields: Partial<Todo>) => {
        setTodos((prev) => prev.map((todo) => todo.id === id ? {...todo, ...fields} : todo))
    }

    const openEditDialog = (id: string) => {
        setEditingTodoId(id);
        setIsDialogOpen(true);
    }

    const handleOpenDialog = () => {
        setEditingTodoId(null);
        setIsDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingTodoId(null);
    }

    return (
        <TodoContext.Provider value={{
            filteredTodos,
            isDialogOpen,
            searchQuery,
            setSearchQuery,
            editingTodoId,
            setEditingTodoId,
            addTodo,
            deleteTodo,
            toggleTodo,
            updateTodo,
            openEditDialog,
            handleOpenDialog,
            handleCloseDialog,
        }}>
            {children}
        </TodoContext.Provider>
    );
}
