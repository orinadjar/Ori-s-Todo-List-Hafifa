import { createContext, useContext } from 'react';

import type { Todo, TodoSubject } from '../types/types';

export interface TodoContextType {
    filteredTodos: Todo[];
    isDialogOpen: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    editingTodoId: string | null;
    addTodo: (name: string, subject: TodoSubject, priority: number, date: Date) => void;
    deleteTodo: (id: string) => void;
    toggleTodo: (id: string) => void;
    updateTodo: (id: string, updatedFields: Partial<Omit<Todo, 'id'>>) => void;
    openEditDialog: (id: string) => void;
    handleOpenDialog: () => void;
    handleCloseDialog: () => void;
    // Partial with Omit makes all fields optional except 'id'
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodoContext = () => {
    const context = useContext(TodoContext);

    if(context === undefined){
        throw new Error('context is undifined');
    }
    
    return context;
}
