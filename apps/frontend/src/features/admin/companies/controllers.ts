// Company controllers
import { companyRepository } from './repositories';

// Types
export interface Company {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyInput {
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

// Get all companies
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await companyRepository.getCompanies();
    if (!response.ok) {
      throw new Error('Error fetching companies');
    }
    const { companies } = await response.json();
    return companies;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// Create a new company
export const createCompany = async (
  companyData: CreateCompanyInput
): Promise<Company> => {
  try {
    const response = await companyRepository.createCompany(companyData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { company } = await response.json();
    return company;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

// Get a company by ID
export const getCompanyById = async (id: number): Promise<Company> => {
  try {
    const response = await companyRepository.getCompanyById(id);
    if (!response.ok) {
      throw new Error('Company not found');
    }
    const { company } = await response.json();
    return company;
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error);
    throw error;
  }
};

// Update a company
export const updateCompany = async (
  id: number,
  companyData: Partial<CreateCompanyInput>
): Promise<Company> => {
  try {
    const response = await companyRepository.updateCompany(id, companyData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { company } = await response.json();
    return company;
  } catch (error) {
    console.error(`Error updating company ${id}:`, error);
    throw error;
  }
};

// Delete a company
export const deleteCompany = async (id: number): Promise<void> => {
  try {
    const response = await companyRepository.deleteCompany(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting company ${id}:`, error);
    throw error;
  }
};
