import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import type { Todo } from '../types/types';
import { useAtomValue } from 'jotai';
import { isSearchGeometryAtom, searchGeoJsonAtom } from '../atoms/mapAtoms';

const TODO_URL = `${import.meta.env.VITE_API_URL}/todos`;

export const useTodos = (searchTerm?: string) => {
    const queryClient = useQueryClient();
    const searchGeoJson = useAtomValue(searchGeoJsonAtom);
    const isSearchGeometry = useAtomValue(isSearchGeometryAtom);

    // GET: GetAllTodos
    const { data, isLoading, error, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<Todo[]>({
        queryKey: ['todos', searchGeoJson],
        queryFn: async ({ pageParam = 0 }) => {

            const url = new URL(TODO_URL + (searchGeoJson && isSearchGeometry ? '/filter' : ''));
            url.searchParams.append('limit', '15');
            url.searchParams.append('offset', String(pageParam));

            const options: RequestInit = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };

            if (searchGeoJson && isSearchGeometry) {
                options.method = 'POST';
                options.body = JSON.stringify({
                    filterGeometry: searchGeoJson
                });
            }

            const res = await fetch(url.toString(), options);

            if (!res.ok) throw new Error(`Error: ${res.statusText}`);

            return res.json();
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 15 ? allPages.length * 15 : undefined;
        },
        refetchOnMount: false,
        select: (data) => ({
            pages: data.pages.map(page =>
                !searchTerm ? page : page.filter(todo =>
                    todo.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
            pageParams: data.pageParams,
        }),
    });

    const todos = data?.pages.flat() || [];

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
            if (!res.ok) throw new Error('Failed to update todo');
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
            if (!res.ok) throw new Error('Failed to toggle todo');
            return await res.json();
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['todos'] })
    })

    return {
        todos,
        status,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
        error,
        addTodo: addMutation.mutate,
        deleteTodo: deleteMutation.mutate,
        updateTodo: updateMutation.mutate,
        toggleTodo: toggleMutation.mutate,
    }
}