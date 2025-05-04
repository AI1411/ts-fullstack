// Sub-Task services
import {
  createSubTask as createSubTaskController,
  CreateSubTaskInput,
  deleteSubTask as deleteSubTaskController,
  getSubTaskById as getSubTaskByIdController,
  getSubTasks as getSubTasksController,
  getSubTasksByTaskId as getSubTasksByTaskIdController,
  SubTask,
  updateSubTask as updateSubTaskController
} from './controllers';

// Sub-Task service
export const subTaskService = {
  // Get all sub-tasks
  getSubTasks: async (): Promise<SubTask[]> => {
    return getSubTasksController();
  },

  // Get sub-tasks by task ID
  getSubTasksByTaskId: async (taskId: number): Promise<SubTask[]> => {
    return getSubTasksByTaskIdController(taskId);
  },

  // Create a new sub-task
  createSubTask: async (subTaskData: CreateSubTaskInput): Promise<SubTask> => {
    return createSubTaskController(subTaskData);
  },

  // Get a sub-task by ID
  getSubTaskById: async (id: number): Promise<SubTask> => {
    return getSubTaskByIdController(id);
  },

  // Update a sub-task
  updateSubTask: async (id: number, subTaskData: Partial<CreateSubTaskInput>): Promise<SubTask> => {
    return updateSubTaskController(id, subTaskData);
  },

  // Delete a sub-task
  deleteSubTask: async (id: number): Promise<void> => {
    return deleteSubTaskController(id);
  },

  // Get completed sub-tasks
  getCompletedSubTasks: async (taskId: number): Promise<SubTask[]> => {
    const subTasks = await getSubTasksByTaskIdController(taskId);
    return subTasks.filter(subTask => subTask.status === 'COMPLETED');
  },

  // Get pending sub-tasks
  getPendingSubTasks: async (taskId: number): Promise<SubTask[]> => {
    const subTasks = await getSubTasksByTaskIdController(taskId);
    return subTasks.filter(subTask => subTask.status === 'PENDING');
  },

  // Get in-progress sub-tasks
  getInProgressSubTasks: async (taskId: number): Promise<SubTask[]> => {
    const subTasks = await getSubTasksByTaskIdController(taskId);
    return subTasks.filter(subTask => subTask.status === 'IN_PROGRESS');
  }
};
