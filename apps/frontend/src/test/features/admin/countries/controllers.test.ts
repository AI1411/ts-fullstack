import {
  type Country,
  type CreateCountryInput,
  createCountry,
  deleteCountry,
  getCountries,
  getCountryById,
  updateCountry,
} from '@/features/admin/countries/controllers';
import { countryRepository } from '@/features/admin/countries/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the repository
vi.mock('@/features/admin/countries/repositories', () => ({
  countryRepository: {
    getCountries: vi.fn(),
    createCountry: vi.fn(),
    getCountryById: vi.fn(),
    updateCountry: vi.fn(),
    deleteCountry: vi.fn(),
  },
}));

describe('Country Controllers', () => {
  const mockCountry: Country = {
    id: 1,
    name: 'Japan',
    code: 'JP',
    flag_url: 'https://example.com/japan.png',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
  };

  const mockCountries = [mockCountry];

  // Mock response object
  const createMockResponse = (data: Record<string, unknown>, ok = true) => ({
    ok,
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue('Error message'),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCountries', () => {
    it('should call the repository and return countries', async () => {
      const mockResponse = createMockResponse({ countries: mockCountries });
      vi.mocked(countryRepository.getCountries).mockResolvedValue(mockResponse);

      const result = await getCountries();

      expect(countryRepository.getCountries).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCountries);
    });

    it('should handle errors from the repository', async () => {
      // Mock a failed response
      vi.mocked(countryRepository.getCountries).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(getCountries()).rejects.toThrowError(
        'Failed to fetch countries'
      );
      expect(countryRepository.getCountries).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCountry', () => {
    const countryData: CreateCountryInput = {
      name: 'Japan',
      code: 'JP',
      flag_url: 'https://example.com/japan.png',
    };

    it('should call the repository and return the created country', async () => {
      const mockResponse = createMockResponse({ country: mockCountry });
      vi.mocked(countryRepository.createCountry).mockResolvedValue(
        mockResponse
      );

      const result = await createCountry(countryData);

      expect(countryRepository.createCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.createCountry).toHaveBeenCalledWith(countryData);
      expect(result).toEqual(mockCountry);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(countryRepository.createCountry).mockResolvedValue(
        mockResponse
      );

      await expect(createCountry(countryData)).rejects.toThrow();
      expect(countryRepository.createCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.createCountry).toHaveBeenCalledWith(countryData);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Failed to create country');
      vi.mocked(countryRepository.createCountry).mockRejectedValue(error);

      await expect(createCountry(countryData)).rejects.toThrow(error);
      expect(countryRepository.createCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.createCountry).toHaveBeenCalledWith(countryData);
    });
  });

  describe('getCountryById', () => {
    it('should call the repository and return the country', async () => {
      const mockResponse = createMockResponse({ country: mockCountry });
      vi.mocked(countryRepository.getCountryById).mockResolvedValue(
        mockResponse
      );

      const result = await getCountryById(1);

      expect(countryRepository.getCountryById).toHaveBeenCalledTimes(1);
      expect(countryRepository.getCountryById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCountry);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(countryRepository.getCountryById).mockResolvedValue(
        mockResponse
      );

      await expect(getCountryById(1)).rejects.toThrow('Country not found');
      expect(countryRepository.getCountryById).toHaveBeenCalledTimes(1);
      expect(countryRepository.getCountryById).toHaveBeenCalledWith(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Failed to fetch country');
      vi.mocked(countryRepository.getCountryById).mockRejectedValue(error);

      await expect(getCountryById(1)).rejects.toThrow(error);
      expect(countryRepository.getCountryById).toHaveBeenCalledTimes(1);
      expect(countryRepository.getCountryById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateCountry', () => {
    const countryData: Partial<CreateCountryInput> = {
      name: 'Japan Updated',
      code: 'JP',
    };

    it('should call the repository and return the updated country', async () => {
      const updatedCountry = { ...mockCountry, name: 'Japan Updated' };
      const mockResponse = createMockResponse({ country: updatedCountry });
      vi.mocked(countryRepository.updateCountry).mockResolvedValue(
        mockResponse
      );

      const result = await updateCountry(1, countryData);

      expect(countryRepository.updateCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.updateCountry).toHaveBeenCalledWith(
        1,
        countryData
      );
      expect(result).toEqual(updatedCountry);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(countryRepository.updateCountry).mockResolvedValue(
        mockResponse
      );

      await expect(updateCountry(1, countryData)).rejects.toThrow();
      expect(countryRepository.updateCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.updateCountry).toHaveBeenCalledWith(
        1,
        countryData
      );
    });

    it('should handle repository errors', async () => {
      const error = new Error('Failed to update country');
      vi.mocked(countryRepository.updateCountry).mockRejectedValue(error);

      await expect(updateCountry(1, countryData)).rejects.toThrow(error);
      expect(countryRepository.updateCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.updateCountry).toHaveBeenCalledWith(
        1,
        countryData
      );
    });
  });

  describe('deleteCountry', () => {
    it('should call the repository', async () => {
      const mockResponse = createMockResponse({});
      vi.mocked(countryRepository.deleteCountry).mockResolvedValue(
        mockResponse
      );

      await deleteCountry(1);

      expect(countryRepository.deleteCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.deleteCountry).toHaveBeenCalledWith(1);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(countryRepository.deleteCountry).mockResolvedValue(
        mockResponse
      );

      await expect(deleteCountry(1)).rejects.toThrow();
      expect(countryRepository.deleteCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.deleteCountry).toHaveBeenCalledWith(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Failed to delete country');
      vi.mocked(countryRepository.deleteCountry).mockRejectedValue(error);

      await expect(deleteCountry(1)).rejects.toThrow(error);
      expect(countryRepository.deleteCountry).toHaveBeenCalledTimes(1);
      expect(countryRepository.deleteCountry).toHaveBeenCalledWith(1);
    });
  });
});
