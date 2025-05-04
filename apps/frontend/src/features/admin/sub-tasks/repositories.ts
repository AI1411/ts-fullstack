// Sub-Task repositories
import { client } from '@/common/utils/client';
import { CreateSubTaskInput } from './controllers';

// Sub-Task repository
export const subTaskRepository = {
  // Get all sub-tasks
  getSubTasks: async () => {
    return client['sub-tasks'].$get();
  },

  // Get sub-tasks by task ID
  getSubTasksByTaskId: async (taskId: number) => {
    return client.tasks[':taskId']['sub-tasks'].$get({
      param: { taskId: taskId.toString() }
    });
  },

  // Create a new sub-task
  createSubTask: async (subTaskData: CreateSubTaskInput) => {
    return client['sub-tasks'].$post({
      json: subTaskData,
    });
  },

  // Get a sub-task by ID
  getSubTaskById: async (id: number) => {
    return client['sub-tasks'][':id'].$get({
      param: { id: id.toString() }
    });
  },

  // Update a sub-task
  updateSubTask: async (id: number, subTaskData: Partial<CreateSubTaskInput>) => {
    return client['sub-tasks'][':id'].$put({
      param: { id: id.toString() },
      json: subTaskData
    });
  },

  // Delete a sub-task
  deleteSubTask: async (id: number) => {
    return client['sub-tasks'][':id'].$delete({
      param: { id: id.toString() }
    });
  }
};
