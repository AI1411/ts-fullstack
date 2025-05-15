import { describe, it, expect, vi, beforeEach } from 'vitest';
import { companyRepository } from '@/features/admin/companies/repositories';
import { client } from '@/common/utils/client';
import { CreateCompanyInput } from '@/features/admin/companies/controllers';

// Mock the client
vi.mock('@/common/utils/client', () => ({
  client: {
    companies: {
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
        $put: vi.fn(),
        $delete: vi.fn()
      }
    }
  }
}));

describe('Company Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCompanies', () => {
    it('should call client.companies.$get', async () => {
      const mockResponse = { data: 'test' };
      vi.mocked(client.companies.$get).mockResolvedValue(mockResponse as unknown as Response);

      const result = await companyRepository.getCompanies();

      expect(client.companies.$get).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });
  });

  describe('createCompany', () => {
    it('should call client.companies.$post with correct parameters', async () => {
      const mockCompanyData: CreateCompanyInput = {
        name: 'Test Company',
        description: 'Test Description',
        address: 'Test Address',
        phone: '123-456-7890',
        email: 'test@example.com',
        website: 'https://example.com'
      };
      const mockResponse = { data: 'test' };

      vi.mocked(client.companies.$post).mockResolvedValue(mockResponse as unknown as Response);

      const result = await companyRepository.createCompany(mockCompanyData);

      expect(client.companies.$post).toHaveBeenCalledWith({
        json: mockCompanyData
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('getCompanyById', () => {
    it('should call client.companies[":id"].$get with correct parameters', async () => {
      const mockId = 123;
      const mockResponse = { data: 'test' };

      // Setup the mock directly in the mock definition
      const mockIdEndpoint = {
        $get: vi.fn().mockResolvedValue(mockResponse)
      };

      // Replace the mock implementation temporarily
      const originalIdValue = client.companies[':id'];
      vi.mocked(client.companies)[':id'] = mockIdEndpoint;

      try {
        const result = await companyRepository.getCompanyById(mockId);

        expect(mockIdEndpoint.$get).toHaveBeenCalledWith({
          param: { id: mockId.toString() }
        });
        expect(result).toBe(mockResponse);
      } finally {
        // Restore the original mock
        vi.mocked(client.companies)[':id'] = originalIdValue;
      }
    });
  });

  describe('updateCompany', () => {
    it('should call client.companies[":id"].$put with correct parameters', async () => {
      const mockId = 123;
      const mockCompanyData: Partial<CreateCompanyInput> = {
        name: 'Updated Company',
        description: 'Updated Description'
      };
      const mockResponse = { data: 'test' };

      // Setup the mock directly in the mock definition
      const mockIdEndpoint = {
        $put: vi.fn().mockResolvedValue(mockResponse)
      };

      // Replace the mock implementation temporarily
      const originalIdValue = client.companies[':id'];
      vi.mocked(client.companies)[':id'] = mockIdEndpoint;

      try {
        const result = await companyRepository.updateCompany(mockId, mockCompanyData);

        expect(mockIdEndpoint.$put).toHaveBeenCalledWith({
          param: { id: mockId.toString() },
          json: mockCompanyData
        });
        expect(result).toBe(mockResponse);
      } finally {
        // Restore the original mock
        vi.mocked(client.companies)[':id'] = originalIdValue;
      }
    });
  });

  describe('deleteCompany', () => {
    it('should call client.companies[":id"].$delete with correct parameters', async () => {
      const mockId = 123;
      const mockResponse = { data: 'test' };

      // Setup the mock directly in the mock definition
      const mockIdEndpoint = {
        $delete: vi.fn().mockResolvedValue(mockResponse)
      };

      // Replace the mock implementation temporarily
      const originalIdValue = client.companies[':id'];
      vi.mocked(client.companies)[':id'] = mockIdEndpoint;

      try {
        const result = await companyRepository.deleteCompany(mockId);

        expect(mockIdEndpoint.$delete).toHaveBeenCalledWith({
          param: { id: mockId.toString() }
        });
        expect(result).toBe(mockResponse);
      } finally {
        // Restore the original mock
        vi.mocked(client.companies)[':id'] = originalIdValue;
      }
    });
  });
});
