import { useState, useMemo, useEffect, useRef, useCallback } from "react";

import { TodoContext } from "./todoContext";
import type { Todo, TodoSubject } from "../types/types";
import { useDebounce } from "../hooks/useDebounce";
import useThrottling from "../hooks/useThrottling";

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
    
    // throttling
    useThrottling(
        useCallback(() => {
            localStorage.setItem('todos', JSON.stringify(todos));
        }, [todos]),
        300);

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

    return (
        <TodoContext.Provider value={{
            filteredTodos,
            searchQuery,
            setSearchQuery,
            addTodo,
            deleteTodo,
            toggleTodo,
            updateTodo,
        }}>
            {children}
        </TodoContext.Provider>
    );
}
