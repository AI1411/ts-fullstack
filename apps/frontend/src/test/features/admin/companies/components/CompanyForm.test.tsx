import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompanyForm from '@/features/admin/companies/components/CompanyForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { companyService } from '@/features/admin/companies/services';
import { Company } from '@/features/admin/companies/controllers';

// Mock the company service
vi.mock('@/features/admin/companies/services', () => ({
  companyService: {
    createCompany: vi.fn()
  }
}));

describe('CompanyForm Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(CompanyForm).toBeDefined();
    expect(typeof CompanyForm).toBe('function');

    // Check if form elements are rendered
    expect(screen.getByRole('heading', { name: '会社を追加' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '会社を追加' })).toBeInTheDocument();
    expect(screen.getByLabelText('会社名')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('住所')).toBeInTheDocument();
    expect(screen.getByLabelText('電話番号')).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('ウェブサイト')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '会社を追加' })).toBeInTheDocument();
  });

  it('should update form values when typing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('会社名');
    const descriptionInput = screen.getByLabelText('説明');
    const addressInput = screen.getByLabelText('住所');
    const phoneInput = screen.getByLabelText('電話番号');
    const emailInput = screen.getByLabelText('メールアドレス');
    const websiteInput = screen.getByLabelText('ウェブサイト');

    // Change input values
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(addressInput, { target: { value: 'Test Address' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(websiteInput, { target: { value: 'https://example.com' } });

    // Check if input values are updated
    expect(nameInput).toHaveValue('Test Company');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(addressInput).toHaveValue('Test Address');
    expect(phoneInput).toHaveValue('123-456-7890');
    expect(emailInput).toHaveValue('test@example.com');
    expect(websiteInput).toHaveValue('https://example.com');
  });

  it('should submit the form with correct data', async () => {
    // Mock successful response
    const mockCompany: Company = {
      id: 1,
      name: 'Test Company',
      description: 'Test Description',
      address: 'Test Address',
      phone: '123-456-7890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    vi.mocked(companyService.createCompany).mockResolvedValue(mockCompany);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('会社名');
    const descriptionInput = screen.getByLabelText('説明');
    const addressInput = screen.getByLabelText('住所');
    const phoneInput = screen.getByLabelText('電話番号');
    const emailInput = screen.getByLabelText('メールアドレス');
    const websiteInput = screen.getByLabelText('ウェブサイト');

    // Fill in the form
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(addressInput, { target: { value: 'Test Address' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(websiteInput, { target: { value: 'https://example.com' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: '会社を追加' });
    fireEvent.click(submitButton);

    // Check if createCompany was called with correct data
    await waitFor(() => {
      expect(companyService.createCompany).toHaveBeenCalledWith({
        name: 'Test Company',
        description: 'Test Description',
        address: 'Test Address',
        phone: '123-456-7890',
        email: 'test@example.com',
        website: 'https://example.com'
      });
    });
  });

  it('should show loading state during submission', async () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(companyService.createCompany).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({} as Company), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Fill in the required field
    const nameInput = screen.getByLabelText('会社名');
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: '会社を追加' });
    fireEvent.click(submitButton);

    // Check if loading state is shown
    expect(screen.getByText('送信中...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should reset form after successful submission', async () => {
    // Mock successful response
    const mockCompany: Company = {
      id: 1,
      name: 'Test Company',
      description: 'Test Description',
      address: 'Test Address',
      phone: '123-456-7890',
      email: 'test@example.com',
      website: 'https://example.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    vi.mocked(companyService.createCompany).mockResolvedValue(mockCompany);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('会社名');
    const descriptionInput = screen.getByLabelText('説明');

    // Fill in the form
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: '会社を追加' });
    fireEvent.click(submitButton);

    // Check if form is reset after submission
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('should show error message when submission fails', async () => {
    // Mock the console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Mock failed response
    vi.mocked(companyService.createCompany).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Fill in the required field
    const nameInput = screen.getByLabelText('会社名');
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: '会社を追加' });
    fireEvent.click(submitButton);

    // Check if error message is shown
    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });

    // Check that form is not reset
    expect(nameInput).toHaveValue('Test Company');

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('should show generic error message when submission fails without specific message', async () => {
    // Mock the console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Mock failed response with a non-Error object to trigger the generic error message
    vi.mocked(companyService.createCompany).mockRejectedValue('Some error');

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Fill in the required field
    const nameInput = screen.getByLabelText('会社名');
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: '会社を追加' });
    fireEvent.click(submitButton);

    // Check if generic error message is shown
    await waitFor(() => {
      expect(screen.getByText('会社の追加に失敗しました')).toBeInTheDocument();
    });

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('should validate required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: '会社を追加' });
    fireEvent.click(submitButton);

    // Check if validation is working (HTML5 validation)
    // Note: This is checking if createCompany was not called because the form didn't submit
    expect(companyService.createCompany).not.toHaveBeenCalled();
  });

  it('should invalidate queries after successful submission', async () => {
    // Mock successful response
    const mockCompany: Company = {
      id: 1,
      name: 'Test Company',
      description: null,
      address: null,
      phone: null,
      email: null,
      website: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    vi.mocked(companyService.createCompany).mockResolvedValue(mockCompany);

    // Create a spy on queryClient.invalidateQueries
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyForm />
      </QueryClientProvider>
    );

    // Fill in the required field
    const nameInput = screen.getByLabelText('会社名');
    fireEvent.change(nameInput, { target: { value: 'Test Company' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: '会社を追加' });
    fireEvent.click(submitButton);

    // Check if invalidateQueries was called with correct key
    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['companies'] });
    });
  });
});
