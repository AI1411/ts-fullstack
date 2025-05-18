import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});

// Mock CSS imports
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));
vi.mock('*.sass', () => ({}));
vi.mock('*.less', () => ({}));
vi.mock('*.styl', () => ({}));
