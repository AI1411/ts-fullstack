// Company repositories
import {client} from '@/common/utils/client';
import {CreateCompanyInput} from './controllers';

// Company repository
export const companyRepository = {
  // Get all companies
  getCompanies: async () => {
    return client.companies.$get();
  },

  // Create a new company
  createCompany: async (companyData: CreateCompanyInput) => {
    return client.companies.$post({
      json: companyData,
    });
  },

  // Get a company by ID
  getCompanyById: async (id: number) => {
    return client.companies[':id'].$get({
      param: {id: id.toString()}
    });
  },

  // Update a company
  updateCompany: async (id: number, companyData: Partial<CreateCompanyInput>) => {
    return client.companies[':id'].$put({
      param: {id: id.toString()},
      json: companyData
    });
  },

  // Delete a company
  deleteCompany: async (id: number) => {
    return client.companies[':id'].$delete({
      param: {id: id.toString()}
    });
  }
};