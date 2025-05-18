import { expect, vi } from 'vitest';

// Make sure vi is properly defined and available globally
global.vi = vi;

// Ensure all Vitest mock functions are properly exported
export { vi };
