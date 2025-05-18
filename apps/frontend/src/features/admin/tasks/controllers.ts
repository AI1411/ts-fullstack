// Task controllers
import { taskRepository } from './repositories';

// Types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  user_id: number | null;
  team_id: number | null;
  due_date: string | null;
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  user_id?: number | null;
  team_id?: number | null;
  due_date?: string | null;
}

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await taskRepository.getTasks();
    const { tasks } = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData: CreateTaskInput): Promise<Task> => {
  try {
    const response = await taskRepository.createTask(taskData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { task } = await response.json();
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Get a task by ID
export const getTaskById = async (id: number): Promise<Task> => {
  try {
    const response = await taskRepository.getTaskById(id);
    if (!response.ok) {
      throw new Error('Task not found');
    }
    const { task } = await response.json();
    return task;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

// Update a task
export const updateTask = async (
  id: number,
  taskData: Partial<CreateTaskInput>
): Promise<Task> => {
  try {
    const response = await taskRepository.updateTask(id, taskData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { task } = await response.json();
    return task;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await taskRepository.deleteTask(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};
