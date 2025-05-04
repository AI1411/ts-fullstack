// Todo services
import {
  createTodo as createTodoController,
  CreateTodoInput,
  deleteTodo as deleteTodoController,
  getTodoById as getTodoByIdController,
  getTodos as getTodosController,
  Todo,
  updateTodo as updateTodoController
} from './controllers';

// Todo service
export const todoService = {
  // Get all todos
  getTodos: async (): Promise<Todo[]> => {
    return getTodosController();
  },

  // Create a new todo
  createTodo: async (todoData: CreateTodoInput): Promise<Todo> => {
    return createTodoController(todoData);
  },

  // Get a todo by ID
  getTodoById: async (id: number): Promise<Todo> => {
    return getTodoByIdController(id);
  },

  // Update a todo
  updateTodo: async (id: number, todoData: Partial<CreateTodoInput>): Promise<Todo> => {
    return updateTodoController(id, todoData);
  },

  // Delete a todo
  deleteTodo: async (id: number): Promise<void> => {
    return deleteTodoController(id);
  },

  // Get completed todos
  getCompletedTodos: async (): Promise<Todo[]> => {
    const todos = await getTodosController();
    return todos.filter(todo => todo.status === 'COMPLETED');
  },

  // Get pending todos
  getPendingTodos: async (): Promise<Todo[]> => {
    const todos = await getTodosController();
    return todos.filter(todo => todo.status === 'PENDING');
  },

  // Get in-progress todos
  getInProgressTodos: async (): Promise<Todo[]> => {
    const todos = await getTodosController();
    return todos.filter(todo => todo.status === 'IN_PROGRESS');
  }
};
