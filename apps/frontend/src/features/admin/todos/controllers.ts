// Todo controllers
import {todoRepository} from './repositories';

// Types
export interface Todo {
  id: number;
  user_id: number | null;
  title: string;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  user_id?: number;
  status?: string;
}

// Get all todos
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await todoRepository.getTodos();
    const {todos} = await response.json();
    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// Create a new todo
export const createTodo = async (todoData: CreateTodoInput): Promise<Todo> => {
  try {
    const response = await todoRepository.createTodo(todoData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {todo} = await response.json();
    return todo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// Get a todo by ID
export const getTodoById = async (id: number): Promise<Todo> => {
  try {
    const response = await todoRepository.getTodoById(id);
    if (!response.ok) {
      throw new Error('Todo not found');
    }
    const {todo} = await response.json();
    return todo;
  } catch (error) {
    console.error(`Error fetching todo ${id}:`, error);
    throw error;
  }
};

// Update a todo
export const updateTodo = async (id: number, todoData: Partial<CreateTodoInput>): Promise<Todo> => {
  try {
    const response = await todoRepository.updateTodo(id, todoData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {todo} = await response.json();
    return todo;
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (id: number): Promise<void> => {
  try {
    const response = await todoRepository.deleteTodo(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    throw error;
  }
};
