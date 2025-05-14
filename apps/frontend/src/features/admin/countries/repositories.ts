// Country repositories
import {client} from '@/common/utils/client';
import {CreateCountryInput} from './controllers';

// Country repository
export const countryRepository = {
  // Get all countries
  getCountries: async () => {
    return client.countries.$get();
  },

  // Create a new country
  createCountry: async (countryData: CreateCountryInput) => {
    return client.countries.$post({
      json: countryData,
    });
  },

  // Get a country by ID
  getCountryById: async (id: number) => {
    return client.countries[':id'].$get({
      param: {id: id.toString()}
    });
  },

  // Update a country
  updateCountry: async (id: number, countryData: Partial<CreateCountryInput>) => {
    return client.countries[':id'].$put({
      param: {id: id.toString()},
      json: countryData
    });
  },

  // Delete a country
  deleteCountry: async (id: number) => {
    return client.countries[':id'].$delete({
      param: {id: id.toString()}
    });
  }
};