// User services
import {
  type CreateUserInput,
  type User,
  createUser as createUserController,
  deleteUser as deleteUserController,
  getUserById as getUserByIdController,
  getUsers as getUsersController,
  updateUser as updateUserController,
} from './controllers';

// User service
export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    return getUsersController();
  },

  // Create a new user
  createUser: async (userData: CreateUserInput): Promise<User> => {
    return createUserController(userData);
  },

  // Get a user by ID
  getUserById: async (id: number): Promise<User> => {
    return getUserByIdController(id);
  },

  // Update a user
  updateUser: async (
    id: number,
    userData: Partial<CreateUserInput>
  ): Promise<User> => {
    return updateUserController(id, userData);
  },

  // Delete a user
  deleteUser: async (id: number): Promise<void> => {
    return deleteUserController(id);
  },

  // Get user count
  getUserCount: async (): Promise<number> => {
    const users = await getUsersController();
    return users.length;
  },
};
