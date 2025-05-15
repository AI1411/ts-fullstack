// Sub-Task controllers
import { subTaskRepository } from './repositories';

// Types
export interface SubTask {
  id: number;
  task_id: number;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSubTaskInput {
  task_id: number;
  title: string;
  description?: string;
  status?: string;
  due_date?: string | null;
}

// Get all sub-tasks
export const getSubTasks = async (): Promise<SubTask[]> => {
  try {
    const response = await subTaskRepository.getSubTasks();
    if (!response.ok) {
      throw new Error(`Error fetching sub-tasks: ${response.statusText}`);
    }
    const { subTasks } = await response.json();
    return subTasks;
  } catch (error) {
    console.error('Error fetching sub-tasks:', error);
    throw error;
  }
};

// Get sub-tasks by task ID
export const getSubTasksByTaskId = async (taskId: number): Promise<SubTask[]> => {
  try {
    const response = await subTaskRepository.getSubTasksByTaskId(taskId);
    if (!response.ok) {
      throw new Error(`Error fetching sub-tasks for task ${taskId}: ${response.statusText}`);
    }
    const { subTasks } = await response.json();
    return subTasks;
  } catch (error) {
    console.error(`Error fetching sub-tasks for task ${taskId}:`, error);
    throw error;
  }
};

// Create a new sub-task
export const createSubTask = async (subTaskData: CreateSubTaskInput): Promise<SubTask> => {
  try {
    const response = await subTaskRepository.createSubTask(subTaskData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { subTask } = await response.json();
    return subTask;
  } catch (error) {
    console.error('Error creating sub-task:', error);
    throw error;
  }
};

// Get a sub-task by ID
export const getSubTaskById = async (id: number): Promise<SubTask> => {
  try {
    const response = await subTaskRepository.getSubTaskById(id);
    if (!response.ok) {
      throw new Error('Sub-task not found');
    }
    const { subTask } = await response.json();
    return subTask;
  } catch (error) {
    console.error(`Error fetching sub-task ${id}:`, error);
    throw error;
  }
};

// Update a sub-task
export const updateSubTask = async (id: number, subTaskData: Partial<CreateSubTaskInput>): Promise<SubTask> => {
  try {
    const response = await subTaskRepository.updateSubTask(id, subTaskData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { subTask } = await response.json();
    return subTask;
  } catch (error) {
    console.error(`Error updating sub-task ${id}:`, error);
    throw error;
  }
};

// Delete a sub-task
export const deleteSubTask = async (id: number): Promise<void> => {
  try {
    const response = await subTaskRepository.deleteSubTask(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting sub-task ${id}:`, error);
    throw error;
  }
};
