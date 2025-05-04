// Todo repositories
import {client} from '@/common/utils/client';
import {CreateTodoInput} from './controllers';

// Todo repository
export const todoRepository = {
  // Get all todos
  getTodos: async () => {
    return client.todos.$get();
  },

  // Create a new todo
  createTodo: async (todoData: CreateTodoInput) => {
    return client.todo.$post({
      json: todoData,
    });
  },

  // Get a todo by ID
  getTodoById: async (id: number) => {
    return client.todos[':id'].$get({
      param: {id: id.toString()}
    });
  },

  // Update a todo
  updateTodo: async (id: number, todoData: Partial<CreateTodoInput>) => {
    return client.todos[':id'].$put({
      param: {id: id.toString()},
      json: todoData
    });
  },

  // Delete a todo
  deleteTodo: async (id: number) => {
    return client.todos[':id'].$delete({
      param: {id: id.toString()}
    });
  }
};
