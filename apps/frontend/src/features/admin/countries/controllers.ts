// Country controllers
import {countryRepository} from './repositories';

// Types
export interface Country {
  id: number;
  name: string;
  code: string | null;
  flag_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCountryInput {
  name: string;
  code?: string | null;
  flag_url?: string | null;
}

// Get all countries
export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await countryRepository.getCountries();
    const {countries} = await response.json();
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// Create a new country
export const createCountry = async (countryData: CreateCountryInput): Promise<Country> => {
  try {
    const response = await countryRepository.createCountry(countryData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {country} = await response.json();
    return country;
  } catch (error) {
    console.error('Error creating country:', error);
    throw error;
  }
};

// Get a country by ID
export const getCountryById = async (id: number): Promise<Country> => {
  try {
    const response = await countryRepository.getCountryById(id);
    if (!response.ok) {
      throw new Error('Country not found');
    }
    const {country} = await response.json();
    return country;
  } catch (error) {
    console.error(`Error fetching country ${id}:`, error);
    throw error;
  }
};

// Update a country
export const updateCountry = async (id: number, countryData: Partial<CreateCountryInput>): Promise<Country> => {
  try {
    const response = await countryRepository.updateCountry(id, countryData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {country} = await response.json();
    return country;
  } catch (error) {
    console.error(`Error updating country ${id}:`, error);
    throw error;
  }
};

// Delete a country
export const deleteCountry = async (id: number): Promise<void> => {
  try {
    const response = await countryRepository.deleteCountry(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting country ${id}:`, error);
    throw error;
  }
};