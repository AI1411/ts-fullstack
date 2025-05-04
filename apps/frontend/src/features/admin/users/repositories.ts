// User repositories
import {client} from '@/common/utils/client';
import {CreateUserInput} from './controllers';

// User repository
export const userRepository = {
  // Get all users
  getUsers: async () => {
    return client.users.$get();
  },

  // Create a new user
  createUser: async (userData: CreateUserInput) => {
    return client.users.$post({
      json: userData,
    });
  },

  // Get a user by ID
  getUserById: async (id: number) => {
    return client.users[':id'].$get({
      param: {id: id.toString()}
    });
  },

  // Update a user
  updateUser: async (id: number, userData: Partial<CreateUserInput>) => {
    return client.users[':id'].$put({
      param: {id: id.toString()},
      json: userData
    });
  },

  // Delete a user
  deleteUser: async (id: number) => {
    return client.users[':id'].$delete({
      param: {id: id.toString()}
    });
  }
};
