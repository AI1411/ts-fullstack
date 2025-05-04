// Dashboard controllers
import {todoService} from '../todos/services';
import {userService} from '../users/services';

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    // Get todos and users in parallel
    const [todos, users] = await Promise.all([
      todoService.getTodos(),
      userService.getUsers()
    ]);

    // Calculate statistics
    const completedTodos = todos.filter(todo => todo.status === 'COMPLETED').length;
    const inProgressTodos = todos.filter(todo => todo.status === 'IN_PROGRESS').length;
    const pendingTodos = todos.filter(todo => todo.status === 'PENDING' || !todo.status).length;

    return {
      totalTodos: todos.length,
      completedTodos,
      inProgressTodos,
      pendingTodos,
      totalUsers: users.length
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
