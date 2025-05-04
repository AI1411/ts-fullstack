// User controllers
import {userRepository} from './repositories';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await userRepository.getUsers();
    const {users} = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData: CreateUserInput): Promise<User> => {
  try {
    const response = await userRepository.createUser(userData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {user} = await response.json();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get a user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await userRepository.getUserById(id);
    if (!response.ok) {
      throw new Error('User not found');
    }
    const {user} = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id: number, userData: Partial<CreateUserInput>): Promise<User> => {
  try {
    const response = await userRepository.updateUser(id, userData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {user} = await response.json();
    return user;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: number): Promise<void> => {
  try {
    const response = await userRepository.deleteUser(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};
