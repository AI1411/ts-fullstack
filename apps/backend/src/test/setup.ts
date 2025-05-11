import { vi, expect } from 'vitest';

// Define mock functions if they don't exist
if (!vi.mock) {
  vi.mock = (moduleName, factory) => {
    console.log(`Mocking module: ${moduleName}`);
    // This is a simplified implementation that just logs the mock
    // In a real implementation, this would need to intercept imports
    return;
  };
}

if (!vi.doMock) {
  vi.doMock = vi.mock;
}

if (!vi.fn) {
  vi.fn = (implementation) => {
    const mockFn = implementation || (() => {});
    mockFn.mockReturnThis = () => mockFn;
    mockFn.mockImplementation = (impl) => {
      implementation = impl;
      return mockFn;
    };
    return mockFn;
  };
}

if (!vi.spyOn) {
  vi.spyOn = (object, method) => {
    const original = object[method];
    const mockFn = vi.fn();
    object[method] = mockFn;
    mockFn.mockRestore = () => {
      object[method] = original;
    };
    return mockFn;
  };
}

if (!vi.clearAllMocks) {
  vi.clearAllMocks = () => {
    // This is a simplified implementation
    console.log('Clearing all mocks');
  };
}

// Make sure vi is properly defined and available globally
global.vi = vi;
