import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  Company,
  CreateCompanyInput
} from '@/features/admin/companies/controllers';
import { companyRepository } from '@/features/admin/companies/repositories';

// Mock the company repository
vi.mock('@/features/admin/companies/repositories', () => ({
  companyRepository: {
    getCompanies: vi.fn(),
    createCompany: vi.fn(),
    getCompanyById: vi.fn(),
    updateCompany: vi.fn(),
    deleteCompany: vi.fn()
  }
}));

describe('Company Controllers', () => {
  // Spy on console.error to prevent actual console output during tests
  let consoleErrorSpy: vi.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('getCompanies', () => {
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      },
      {
        id: 2,
        name: 'Test Company 2',
        description: 'Description 2',
        address: 'Address 2',
        phone: '098-765-4321',
        email: 'test2@example.com',
        website: 'https://example2.com',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-04T00:00:00Z'
      }
    ];

    it('should return companies when API call is successful', async () => {
      // Mock successful response
      vi.mocked(companyRepository.getCompanies).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ companies: mockCompanies }),
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      const result = await getCompanies();
      expect(result).toEqual(mockCompanies);
      expect(companyRepository.getCompanies).toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(companyRepository.getCompanies).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(getCompanies()).rejects.toThrow('Error fetching companies');
      expect(companyRepository.getCompanies).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle HTML response instead of JSON', async () => {
      // Mock HTML response
      vi.mocked(companyRepository.getCompanies).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/html' }),
        text: () => Promise.resolve('<!DOCTYPE html><html><body>Error</body></html>')
      } as unknown as Response);

      await expect(getCompanies()).rejects.toThrow();
      expect(companyRepository.getCompanies).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid JSON response', async () => {
      // Mock invalid JSON response
      vi.mocked(companyRepository.getCompanies).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.reject(new Error('Invalid JSON'))
      } as unknown as Response);

      await expect(getCompanies()).rejects.toThrow();
      expect(companyRepository.getCompanies).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('createCompany', () => {
    const companyData: CreateCompanyInput = {
      name: 'New Company',
      description: 'New Description',
      address: 'New Address',
      phone: '555-555-5555',
      email: 'new@example.com',
      website: 'https://newexample.com'
    };

    const mockCompany: Company = {
      id: 3,
      name: 'New Company',
      description: 'New Description',
      address: 'New Address',
      phone: '555-555-5555',
      email: 'new@example.com',
      website: 'https://newexample.com',
      created_at: '2023-01-05T00:00:00Z',
      updated_at: '2023-01-05T00:00:00Z'
    };

    it('should return the created company when API call is successful', async () => {
      // Mock successful response
      vi.mocked(companyRepository.createCompany).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ company: mockCompany }),
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      const result = await createCompany(companyData);
      expect(result).toEqual(mockCompany);
      expect(companyRepository.createCompany).toHaveBeenCalledWith(companyData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(companyRepository.createCompany).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid company data')
      } as unknown as Response);

      await expect(createCompany(companyData)).rejects.toThrow('Invalid company data');
      expect(companyRepository.createCompany).toHaveBeenCalledWith(companyData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle JSON parsing error', async () => {
      // Mock response with JSON parsing error
      vi.mocked(companyRepository.createCompany).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.reject(new Error('JSON parsing error'))
      } as unknown as Response);

      await expect(createCompany(companyData)).rejects.toThrow();
      expect(companyRepository.createCompany).toHaveBeenCalledWith(companyData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getCompanyById', () => {
    const companyId = 1;
    const mockCompany: Company = {
      id: 1,
      name: 'Test Company 1',
      description: 'Description 1',
      address: 'Address 1',
      phone: '123-456-7890',
      email: 'test1@example.com',
      website: 'https://example1.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    };

    it('should return the company when API call is successful', async () => {
      // Mock successful response
      vi.mocked(companyRepository.getCompanyById).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ company: mockCompany }),
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      const result = await getCompanyById(companyId);
      expect(result).toEqual(mockCompany);
      expect(companyRepository.getCompanyById).toHaveBeenCalledWith(companyId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(companyRepository.getCompanyById).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as unknown as Response);

      await expect(getCompanyById(companyId)).rejects.toThrow('Company not found');
      expect(companyRepository.getCompanyById).toHaveBeenCalledWith(companyId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle JSON parsing error', async () => {
      // Mock response with JSON parsing error
      vi.mocked(companyRepository.getCompanyById).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.reject(new Error('JSON parsing error'))
      } as unknown as Response);

      await expect(getCompanyById(companyId)).rejects.toThrow();
      expect(companyRepository.getCompanyById).toHaveBeenCalledWith(companyId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('updateCompany', () => {
    const companyId = 1;
    const companyData = {
      name: 'Updated Company',
      email: 'updated@example.com'
    };

    const mockCompany: Company = {
      id: 1,
      name: 'Updated Company',
      description: 'Description 1',
      address: 'Address 1',
      phone: '123-456-7890',
      email: 'updated@example.com',
      website: 'https://example1.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-06T00:00:00Z'
    };

    it('should return the updated company when API call is successful', async () => {
      // Mock successful response
      vi.mocked(companyRepository.updateCompany).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ company: mockCompany }),
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      const result = await updateCompany(companyId, companyData);
      expect(result).toEqual(mockCompany);
      expect(companyRepository.updateCompany).toHaveBeenCalledWith(companyId, companyData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(companyRepository.updateCompany).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid company data')
      } as unknown as Response);

      await expect(updateCompany(companyId, companyData)).rejects.toThrow('Invalid company data');
      expect(companyRepository.updateCompany).toHaveBeenCalledWith(companyId, companyData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle JSON parsing error', async () => {
      // Mock response with JSON parsing error
      vi.mocked(companyRepository.updateCompany).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.reject(new Error('JSON parsing error'))
      } as unknown as Response);

      await expect(updateCompany(companyId, companyData)).rejects.toThrow();
      expect(companyRepository.updateCompany).toHaveBeenCalledWith(companyId, companyData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('deleteCompany', () => {
    const companyId = 1;

    it('should complete successfully when API call is successful', async () => {
      // Mock successful response
      vi.mocked(companyRepository.deleteCompany).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      await expect(deleteCompany(companyId)).resolves.not.toThrow();
      expect(companyRepository.deleteCompany).toHaveBeenCalledWith(companyId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(companyRepository.deleteCompany).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('Company not found')
      } as unknown as Response);

      await expect(deleteCompany(companyId)).rejects.toThrow('Company not found');
      expect(companyRepository.deleteCompany).toHaveBeenCalledWith(companyId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});