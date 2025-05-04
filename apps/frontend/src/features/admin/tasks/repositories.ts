// Task repositories
import {client} from '@/common/utils/client';
import {CreateTaskInput} from './controllers';

// Task repository
export const taskRepository = {
  // Get all tasks
  getTasks: async () => {
    return client.tasks.$get();
  },

  // Create a new task
  createTask: async (taskData: CreateTaskInput) => {
    return client.tasks.$post({
      json: taskData,
    });
  },

  // Get a task by ID
  getTaskById: async (id: number) => {
    return client.tasks[':id'].$get({
      param: {id: id.toString()}
    });
  },

  // Update a task
  updateTask: async (id: number, taskData: Partial<CreateTaskInput>) => {
    return client.tasks[':id'].$put({
      param: {id: id.toString()},
      json: taskData
    });
  },

  // Delete a task
  deleteTask: async (id: number) => {
    return client.tasks[':id'].$delete({
      param: {id: id.toString()}
    });
  }
};
