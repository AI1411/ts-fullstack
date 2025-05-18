import { client } from '@/common/utils/client';
import type { CreateCountryInput } from '@/features/admin/countries/controllers';
import { countryRepository } from '@/features/admin/countries/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define a type for mock responses
type MockResponse = {
  status: number;
  ok?: boolean;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
};

// Mock the client
vi.mock('@/common/utils/client', () => ({
  client: {
    countries: {
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
        $put: vi.fn(),
        $delete: vi.fn(),
      },
    },
  },
}));

describe('Country Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCountries', () => {
    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 200 };
      vi.mocked(client.countries.$get).mockResolvedValue(mockResponse);

      const result = await countryRepository.getCountries();

      expect(client.countries.$get).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.countries.$get).mockRejectedValue(error);

      await expect(countryRepository.getCountries()).rejects.toThrow(error);
      expect(client.countries.$get).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCountry', () => {
    const countryData: CreateCountryInput = {
      name: 'Japan',
      code: 'JP',
      flag_url: 'https://example.com/japan.png',
    };

    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 201 };
      vi.mocked(client.countries.$post).mockResolvedValue(mockResponse);

      const result = await countryRepository.createCountry(countryData);

      expect(client.countries.$post).toHaveBeenCalledTimes(1);
      expect(client.countries.$post).toHaveBeenCalledWith({
        json: countryData,
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.countries.$post).mockRejectedValue(error);

      await expect(
        countryRepository.createCountry(countryData)
      ).rejects.toThrow(error);
      expect(client.countries.$post).toHaveBeenCalledTimes(1);
      expect(client.countries.$post).toHaveBeenCalledWith({
        json: countryData,
      });
    });
  });

  describe('getCountryById', () => {
    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 200 };
      vi.mocked(client.countries[':id'].$get).mockResolvedValue(mockResponse);

      const result = await countryRepository.getCountryById(1);

      expect(client.countries[':id'].$get).toHaveBeenCalledTimes(1);
      expect(client.countries[':id'].$get).toHaveBeenCalledWith({
        param: { id: '1' },
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.countries[':id'].$get).mockRejectedValue(error);

      await expect(countryRepository.getCountryById(1)).rejects.toThrow(error);
      expect(client.countries[':id'].$get).toHaveBeenCalledTimes(1);
      expect(client.countries[':id'].$get).toHaveBeenCalledWith({
        param: { id: '1' },
      });
    });
  });

  describe('updateCountry', () => {
    const countryData: Partial<CreateCountryInput> = {
      name: 'Japan Updated',
      code: 'JP',
    };

    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 200 };
      vi.mocked(client.countries[':id'].$put).mockResolvedValue(mockResponse);

      const result = await countryRepository.updateCountry(1, countryData);

      expect(client.countries[':id'].$put).toHaveBeenCalledTimes(1);
      expect(client.countries[':id'].$put).toHaveBeenCalledWith({
        param: { id: '1' },
        json: countryData,
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.countries[':id'].$put).mockRejectedValue(error);

      await expect(
        countryRepository.updateCountry(1, countryData)
      ).rejects.toThrow(error);
      expect(client.countries[':id'].$put).toHaveBeenCalledTimes(1);
      expect(client.countries[':id'].$put).toHaveBeenCalledWith({
        param: { id: '1' },
        json: countryData,
      });
    });
  });

  describe('deleteCountry', () => {
    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 204 };
      vi.mocked(client.countries[':id'].$delete).mockResolvedValue(
        mockResponse
      );

      const result = await countryRepository.deleteCountry(1);

      expect(client.countries[':id'].$delete).toHaveBeenCalledTimes(1);
      expect(client.countries[':id'].$delete).toHaveBeenCalledWith({
        param: { id: '1' },
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.countries[':id'].$delete).mockRejectedValue(error);

      await expect(countryRepository.deleteCountry(1)).rejects.toThrow(error);
      expect(client.countries[':id'].$delete).toHaveBeenCalledTimes(1);
      expect(client.countries[':id'].$delete).toHaveBeenCalledWith({
        param: { id: '1' },
      });
    });
  });
});
