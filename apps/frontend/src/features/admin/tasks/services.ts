// Task services
import {
  type CreateTaskInput,
  type Task,
  createTask as createTaskController,
  deleteTask as deleteTaskController,
  getTaskById as getTaskByIdController,
  getTasks as getTasksController,
  updateTask as updateTaskController,
} from './controllers';

// Task service
export const taskService = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    return getTasksController();
  },

  // Create a new task
  createTask: async (taskData: CreateTaskInput): Promise<Task> => {
    return createTaskController(taskData);
  },

  // Get a task by ID
  getTaskById: async (id: number): Promise<Task> => {
    return getTaskByIdController(id);
  },

  // Update a task
  updateTask: async (
    id: number,
    taskData: Partial<CreateTaskInput>
  ): Promise<Task> => {
    return updateTaskController(id, taskData);
  },

  // Delete a task
  deleteTask: async (id: number): Promise<void> => {
    return deleteTaskController(id);
  },

  // Get completed tasks
  getCompletedTasks: async (): Promise<Task[]> => {
    const tasks = await getTasksController();
    return tasks.filter((task) => task.status === 'COMPLETED');
  },

  // Get pending tasks
  getPendingTasks: async (): Promise<Task[]> => {
    const tasks = await getTasksController();
    return tasks.filter((task) => task.status === 'PENDING');
  },

  // Get in-progress tasks
  getInProgressTasks: async (): Promise<Task[]> => {
    const tasks = await getTasksController();
    return tasks.filter((task) => task.status === 'IN_PROGRESS');
  },
};
