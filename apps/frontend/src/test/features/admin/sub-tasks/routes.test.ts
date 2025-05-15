import { describe, it, expect } from 'vitest';
import { SUB_TASK_ROUTES } from '@/features/admin/sub-tasks/routes';

describe('Sub-Task Routes', () => {
  it('should define the list route', () => {
    expect(SUB_TASK_ROUTES.list).toBe('/sub-tasks');
  });

  it('should define the detail route with a parameter', () => {
    const subTaskId = 123;
    expect(SUB_TASK_ROUTES.detail(subTaskId)).toBe(`/sub-tasks/${subTaskId}`);
    expect(SUB_TASK_ROUTES.detail('abc')).toBe('/sub-tasks/abc');
  });

  it('should define the create route', () => {
    expect(SUB_TASK_ROUTES.create).toBe('/sub-tasks/create');
  });

  it('should define the edit route with a parameter', () => {
    const subTaskId = 456;
    expect(SUB_TASK_ROUTES.edit(subTaskId)).toBe(`/sub-tasks/${subTaskId}/edit`);
    expect(SUB_TASK_ROUTES.edit('def')).toBe('/sub-tasks/def/edit');
  });

  it('should define the taskSubTasks route with a parameter', () => {
    const taskId = 789;
    expect(SUB_TASK_ROUTES.taskSubTasks(taskId)).toBe(`/tasks/${taskId}/sub-tasks`);
    expect(SUB_TASK_ROUTES.taskSubTasks('ghi')).toBe('/tasks/ghi/sub-tasks');
  });
});