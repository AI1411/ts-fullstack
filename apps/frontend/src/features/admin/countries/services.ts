// Country services
import {
  type Country,
  type CreateCountryInput,
  createCountry as createCountryController,
  deleteCountry as deleteCountryController,
  getCountries as getCountriesController,
  getCountryById as getCountryByIdController,
  updateCountry as updateCountryController,
} from './controllers';

// Country service
export const countryService = {
  // Get all countries
  getCountries: async (): Promise<Country[]> => {
    return getCountriesController();
  },

  // Create a new country
  createCountry: async (countryData: CreateCountryInput): Promise<Country> => {
    return createCountryController(countryData);
  },

  // Get a country by ID
  getCountryById: async (id: number): Promise<Country> => {
    return getCountryByIdController(id);
  },

  // Update a country
  updateCountry: async (
    id: number,
    countryData: Partial<CreateCountryInput>
  ): Promise<Country> => {
    return updateCountryController(id, countryData);
  },

  // Delete a country
  deleteCountry: async (id: number): Promise<void> => {
    return deleteCountryController(id);
  },
};
