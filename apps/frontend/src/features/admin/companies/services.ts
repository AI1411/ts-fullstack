// Company services
import {
  createCompany as createCompanyController,
  CreateCompanyInput,
  deleteCompany as deleteCompanyController,
  getCompanyById as getCompanyByIdController,
  getCompanies as getCompaniesController,
  Company,
  updateCompany as updateCompanyController
} from './controllers';

// Company service
export const companyService = {
  // Get all companies
  getCompanies: async (): Promise<Company[]> => {
    return getCompaniesController();
  },

  // Create a new company
  createCompany: async (companyData: CreateCompanyInput): Promise<Company> => {
    return createCompanyController(companyData);
  },

  // Get a company by ID
  getCompanyById: async (id: number): Promise<Company> => {
    return getCompanyByIdController(id);
  },

  // Update a company
  updateCompany: async (id: number, companyData: Partial<CreateCompanyInput>): Promise<Company> => {
    return updateCompanyController(id, companyData);
  },

  // Delete a company
  deleteCompany: async (id: number): Promise<void> => {
    return deleteCompanyController(id);
  }
};