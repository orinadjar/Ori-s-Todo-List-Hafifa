import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Todo } from '../types/types';
import { useAtomValue } from 'jotai';
import { isSearchGeometryAtom, searchGeoJsonAtom } from '../atoms/mapAtoms';

const TODO_URL = `${import.meta.env.VITE_API_URL}/todos`;

export const useTodos = (searchTerm?: string, id?: string) => {
    const queryClient = useQueryClient();
    const searchGeoJson = useAtomValue(searchGeoJsonAtom);
    const isSearchGeometry = useAtomValue(isSearchGeometryAtom);

    // GET: GetAllTodos
    const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
        queryKey: ['todos', searchGeoJson, isSearchGeometry],
        queryFn: async () => {
            let res: Response;

            const options: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if(searchGeoJson && isSearchGeometry){
                options.method = 'POST';
                options.body = JSON.stringify({
                    filterGeometry: searchGeoJson
                }); 

                res = await fetch(TODO_URL + '/filter', options);
            }
            else 
                res = await fetch(TODO_URL, options);
            
            if(!res.ok) {
                throw new Error(`Error: ${ res.statusText }`);
            }

            return res.json();
        },
        select: (data) => {
            if (!searchTerm) return data;
            return data.filter(todo => 
                todo.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    });

    // GET: GetOneTodo
    const { data: todo, isLoading: isSingleLoading } = useQuery<Todo>({
        queryKey: ['todos', id], 
        queryFn: async () => {
            const res = await fetch(`${TODO_URL}/${id}`);
            return res.json();
        },
        enabled: !!id 
    });

    // POST: AddTodo
    const addMutation = useMutation({
        mutationFn: async (newTodo: Omit<Todo, 'id' | 'isCompleted'>) => {
            const res = await fetch(TODO_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo),
            });;
            if (!res.ok) throw new Error('Failed to add todo');
            return await res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    // DELETE: DeleteTodo
    const deleteMutation = useMutation({
        mutationFn: async (todoId: string) => {
            const res = await fetch(`${TODO_URL}/${todoId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete todo');
            return await res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    // UPDATE: updateTodo
    const updateMutation = useMutation({
        mutationFn: async ({ todoId, fields }: { todoId: string, fields: Partial<Todo> }) => {
            const res = await fetch(`${TODO_URL}/${todoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fields)
            });
            if(!res.ok) throw new Error('Failed to update todo');
            return await res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
    })

    // UPDATE: toggle todo
    const toggleMutation = useMutation({
        mutationFn: async (todoId: string) => {
            const res = await fetch(`${TODO_URL}/${todoId}/toggle`, {
                method: 'PATCH',
            });
            if(!res.ok) throw new Error('Failed to toggle todo');
            return await res.json();
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['todos'] })
    })

    return {
        todos,
        isLoading,
        error,
        todo,
        isSingleLoading,
        addTodo: addMutation.mutate,
        deleteTodo: deleteMutation.mutate,
        updateTodo: updateMutation.mutate,
        toggleTodo: toggleMutation.mutate,
    }
}