import * as controllers from '@/features/admin/countries/controllers';
import { countryService } from '@/features/admin/countries/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/countries/controllers', () => ({
  getCountries: vi.fn(),
  createCountry: vi.fn(),
  getCountryById: vi.fn(),
  updateCountry: vi.fn(),
  deleteCountry: vi.fn(),
}));

describe('Country Service', () => {
  const mockCountry = {
    id: 1,
    name: 'Japan',
    code: 'JP',
    flag_url: 'https://example.com/japan.png',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
  };

  const mockCountries = [mockCountry];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCountries', () => {
    it('should call the controller and return countries', async () => {
      vi.mocked(controllers.getCountries).mockResolvedValue(mockCountries);

      const result = await countryService.getCountries();

      expect(controllers.getCountries).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCountries);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to fetch countries');
      vi.mocked(controllers.getCountries).mockRejectedValue(error);

      await expect(countryService.getCountries()).rejects.toThrow(error);
      expect(controllers.getCountries).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCountry', () => {
    const countryData = {
      name: 'Japan',
      code: 'JP',
      flag_url: 'https://example.com/japan.png',
    };

    it('should call the controller and return the created country', async () => {
      vi.mocked(controllers.createCountry).mockResolvedValue(mockCountry);

      const result = await countryService.createCountry(countryData);

      expect(controllers.createCountry).toHaveBeenCalledTimes(1);
      expect(controllers.createCountry).toHaveBeenCalledWith(countryData);
      expect(result).toEqual(mockCountry);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to create country');
      vi.mocked(controllers.createCountry).mockRejectedValue(error);

      await expect(countryService.createCountry(countryData)).rejects.toThrow(
        error
      );
      expect(controllers.createCountry).toHaveBeenCalledTimes(1);
      expect(controllers.createCountry).toHaveBeenCalledWith(countryData);
    });
  });

  describe('getCountryById', () => {
    it('should call the controller and return the country', async () => {
      vi.mocked(controllers.getCountryById).mockResolvedValue(mockCountry);

      const result = await countryService.getCountryById(1);

      expect(controllers.getCountryById).toHaveBeenCalledTimes(1);
      expect(controllers.getCountryById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCountry);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to fetch country');
      vi.mocked(controllers.getCountryById).mockRejectedValue(error);

      await expect(countryService.getCountryById(1)).rejects.toThrow(error);
      expect(controllers.getCountryById).toHaveBeenCalledTimes(1);
      expect(controllers.getCountryById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateCountry', () => {
    const countryData = {
      name: 'Japan Updated',
      code: 'JP',
    };

    it('should call the controller and return the updated country', async () => {
      const updatedCountry = { ...mockCountry, name: 'Japan Updated' };
      vi.mocked(controllers.updateCountry).mockResolvedValue(updatedCountry);

      const result = await countryService.updateCountry(1, countryData);

      expect(controllers.updateCountry).toHaveBeenCalledTimes(1);
      expect(controllers.updateCountry).toHaveBeenCalledWith(1, countryData);
      expect(result).toEqual(updatedCountry);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to update country');
      vi.mocked(controllers.updateCountry).mockRejectedValue(error);

      await expect(
        countryService.updateCountry(1, countryData)
      ).rejects.toThrow(error);
      expect(controllers.updateCountry).toHaveBeenCalledTimes(1);
      expect(controllers.updateCountry).toHaveBeenCalledWith(1, countryData);
    });
  });

  describe('deleteCountry', () => {
    it('should call the controller', async () => {
      vi.mocked(controllers.deleteCountry).mockResolvedValue();

      await countryService.deleteCountry(1);

      expect(controllers.deleteCountry).toHaveBeenCalledTimes(1);
      expect(controllers.deleteCountry).toHaveBeenCalledWith(1);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to delete country');
      vi.mocked(controllers.deleteCountry).mockRejectedValue(error);

      await expect(countryService.deleteCountry(1)).rejects.toThrow(error);
      expect(controllers.deleteCountry).toHaveBeenCalledTimes(1);
      expect(controllers.deleteCountry).toHaveBeenCalledWith(1);
    });
  });
});
