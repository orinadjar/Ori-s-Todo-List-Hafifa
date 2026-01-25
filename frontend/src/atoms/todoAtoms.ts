import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Todo, TodoSubject } from '../types/types';

export const todosAtom = atomWithStorage<Todo[]>('todos', []);

export const searchQueryAtom = atom('');

export const debouncedSearchAtom = atom('');

export const filteredTodosAtom = atom((get) => {

    const todos = get(todosAtom);
    const debouncedSearch = get(debouncedSearchAtom);

    return todos.filter((todo) => todo.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
});

export const addTodoAtom = atom(
    null,
    (get, set, name: string, subject: TodoSubject, priority: number, date: Date, location: [number, number]) => {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            name,
            subject,
            priority,
            date,
            isCompleted: false,
            location,
        };

        const prevTodos = get(todosAtom);

        set(todosAtom , [...prevTodos, newTodo]);
    }
);

export const deleteTodoAtom = atom(
    null,
    (get, set, id: string) => {

        const prevTodos = get(todosAtom);

        set(todosAtom, prevTodos.filter((todo) => todo.id !== id));
    }
);

export const toggleTodoAtom = atom(
    null,
    (get, set, id: string) => {

        const prevTodos = get(todosAtom);

        set(todosAtom, prevTodos.map((todo) => todo.id === id 
            ? 
            {...todo, isCompleted: !todo.isCompleted} 
            : 
            todo ));
    }
);

export const updateTodoAtom = atom(
    null,
    (get, set, id: string, fields: Partial<Todo>) => {
        
        const prevTodos = get(todosAtom);

        set(todosAtom, prevTodos.map((todo) => todo.id === id
        ? 
        {...todo, ...fields} 
        : 
        todo ));
    }
);