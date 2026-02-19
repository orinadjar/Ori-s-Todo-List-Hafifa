import { createContext, useContext } from "react";

import type { Todo } from "../types/types";

export interface TodoContextType {
  filteredTodos: Todo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addTodo: (todo: Omit<Todo, "id" | "isCompleted">) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updatedFields: Partial<Omit<Todo, "id">>) => void; // Partial with Omit makes all fields optional except 'id'
}

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);

export const useTodos = () => {
  const context = useContext(TodoContext);

  if (context === undefined) {
    throw new Error("context is undefined");
  }

  return context;
};
