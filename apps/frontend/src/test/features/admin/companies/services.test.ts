import * as controllers from '@/features/admin/companies/controllers';
import type {
  Company,
  CreateCompanyInput,
} from '@/features/admin/companies/controllers';
import { companyService } from '@/features/admin/companies/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/companies/controllers', async () => {
  const actual = await vi.importActual(
    '@/features/admin/companies/controllers'
  );
  return {
    ...actual,
    getCompanies: vi.fn(),
    createCompany: vi.fn(),
    getCompanyById: vi.fn(),
    updateCompany: vi.fn(),
    deleteCompany: vi.fn(),
  };
});

describe('Company Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCompanies', () => {
    it('should call the controller getCompanies function', async () => {
      const mockCompanies: Company[] = [
        {
          id: 1,
          name: 'Test Company',
          description: 'Test Description',
          address: 'Test Address',
          phone: '123-456-7890',
          email: 'test@example.com',
          website: 'https://example.com',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];

      vi.mocked(controllers.getCompanies).mockResolvedValue(mockCompanies);

      const result = await companyService.getCompanies();

      expect(controllers.getCompanies).toHaveBeenCalled();
      expect(result).toBe(mockCompanies);
    });
  });

  describe('createCompany', () => {
    it('should call the controller createCompany function with correct parameters', async () => {
      const mockCompanyData: CreateCompanyInput = {
        name: 'Test Company',
        description: 'Test Description',
        address: 'Test Address',
        phone: '123-456-7890',
        email: 'test@example.com',
        website: 'https://example.com',
      };

      const mockCompany: Company = {
        id: 1,
        name: 'Test Company',
        description: 'Test Description',
        address: 'Test Address',
        phone: '123-456-7890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      vi.mocked(controllers.createCompany).mockResolvedValue(mockCompany);

      const result = await companyService.createCompany(mockCompanyData);

      expect(controllers.createCompany).toHaveBeenCalledWith(mockCompanyData);
      expect(result).toBe(mockCompany);
    });
  });

  describe('getCompanyById', () => {
    it('should call the controller getCompanyById function with correct parameters', async () => {
      const mockId = 123;

      const mockCompany: Company = {
        id: mockId,
        name: 'Test Company',
        description: 'Test Description',
        address: 'Test Address',
        phone: '123-456-7890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      vi.mocked(controllers.getCompanyById).mockResolvedValue(mockCompany);

      const result = await companyService.getCompanyById(mockId);

      expect(controllers.getCompanyById).toHaveBeenCalledWith(mockId);
      expect(result).toBe(mockCompany);
    });
  });

  describe('updateCompany', () => {
    it('should call the controller updateCompany function with correct parameters', async () => {
      const mockId = 123;
      const mockCompanyData: Partial<CreateCompanyInput> = {
        name: 'Updated Company',
        description: 'Updated Description',
      };

      const mockCompany: Company = {
        id: mockId,
        name: 'Updated Company',
        description: 'Updated Description',
        address: 'Test Address',
        phone: '123-456-7890',
        email: 'test@example.com',
        website: 'https://example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      };

      vi.mocked(controllers.updateCompany).mockResolvedValue(mockCompany);

      const result = await companyService.updateCompany(
        mockId,
        mockCompanyData
      );

      expect(controllers.updateCompany).toHaveBeenCalledWith(
        mockId,
        mockCompanyData
      );
      expect(result).toBe(mockCompany);
    });
  });

  describe('deleteCompany', () => {
    it('should call the controller deleteCompany function with correct parameters', async () => {
      const mockId = 123;

      vi.mocked(controllers.deleteCompany).mockResolvedValue(undefined);

      await companyService.deleteCompany(mockId);

      expect(controllers.deleteCompany).toHaveBeenCalledWith(mockId);
    });
  });
});
