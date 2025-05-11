import { describe, it, expect } from 'vitest';
import { createTask, getTasks, getTaskById, getTasksByUserId, getTasksByTeamId, updateTask, deleteTask } from '../../../features/tasks/controllers';

describe('Task Controllers', () => {
  // Simple test to verify the controllers are defined
  it('should have controllers defined', () => {
    expect(createTask).toBeDefined();
    expect(getTasks).toBeDefined();
    expect(getTaskById).toBeDefined();
    expect(getTasksByUserId).toBeDefined();
    expect(getTasksByTeamId).toBeDefined();
    expect(updateTask).toBeDefined();
    expect(deleteTask).toBeDefined();

    // Check that the controllers are functions
    expect(typeof createTask).toBe('function');
    expect(typeof getTasks).toBe('function');
    expect(typeof getTaskById).toBe('function');
    expect(typeof getTasksByUserId).toBe('function');
    expect(typeof getTasksByTeamId).toBe('function');
    expect(typeof updateTask).toBe('function');
    expect(typeof deleteTask).toBe('function');
  });
});
