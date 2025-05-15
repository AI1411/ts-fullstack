import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompanyList from '@/features/admin/companies/components/CompanyList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { companyService } from '@/features/admin/companies/services';
import { Company } from '@/features/admin/companies/controllers';

// Mock the company service
vi.mock('@/features/admin/companies/services', () => ({
  companyService: {
    getCompanies: vi.fn(),
    updateCompany: vi.fn(),
    deleteCompany: vi.fn()
  }
}));

// Mock window.confirm
const originalConfirm = window.confirm;
window.confirm = vi.fn();

// Mock next/link
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href} data-testid="next-link">
        {children}
      </a>
    )
  };
});

describe('CompanyList Component', () => {
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
    window.confirm = vi.fn();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  it('should render the component', () => {
    // Mock successful response with empty array
    vi.mocked(companyService.getCompanies).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(CompanyList).toBeDefined();
    expect(typeof CompanyList).toBe('function');
  });

  it('should show loading state initially', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(companyService.getCompanies).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(companyService.getCompanies).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should show empty state when no companies are available', async () => {
    // Mock successful response with empty array
    vi.mocked(companyService.getCompanies).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('会社がありません')).toBeInTheDocument();
  });

  it('should display company list when data is available', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      },
      {
        id: 2,
        name: 'Test Company 2',
        description: 'Description 2',
        address: 'Address 2',
        phone: '098-765-4321',
        email: 'test2@example.com',
        website: 'https://example2.com',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-04T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Check if company names are displayed
    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    expect(screen.getByText('Test Company 2')).toBeInTheDocument();

    // Check if other company details are displayed
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('098-765-4321')).toBeInTheDocument();
  });

  it('should toggle expanded view when clicking the expand button', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Initially, expanded details should not be visible
    expect(screen.queryByText('会社詳細')).not.toBeInTheDocument();

    // Find and click the expand button
    const expandButtons = screen.getAllByRole('button');
    const expandButton = expandButtons.find(button => 
      button.className.includes('text-gray-600') && 
      button.className.includes('flex items-center')
    );

    if (expandButton) {
      fireEvent.click(expandButton);
    } else {
      throw new Error('Expand button not found');
    }

    // After clicking, expanded details should be visible
    expect(screen.getByText('会社詳細')).toBeInTheDocument();
    expect(screen.getByText('説明:')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('住所:')).toBeInTheDocument();
    expect(screen.getByText('Address 1')).toBeInTheDocument();
    expect(screen.getByText('ウェブサイト:')).toBeInTheDocument();
    expect(screen.getByText('https://example1.com')).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(expandButton);

    // After clicking again, expanded details should not be visible
    expect(screen.queryByText('会社詳細')).not.toBeInTheDocument();
  });

  it('should enter edit mode when clicking the edit button', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // After clicking, edit form should be visible
    const nameInput = screen.getByDisplayValue('Test Company 1');
    const emailInput = screen.getByDisplayValue('test1@example.com');
    const phoneInput = screen.getByDisplayValue('123-456-7890');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();

    // Save and cancel buttons should be visible
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('should update form values when editing', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Get form inputs
    const nameInput = screen.getByDisplayValue('Test Company 1');
    const emailInput = screen.getByDisplayValue('test1@example.com');
    const phoneInput = screen.getByDisplayValue('123-456-7890');

    // Change input values
    fireEvent.change(nameInput, { target: { value: 'Updated Company Name' } });
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '555-555-5555' } });

    // Check if input values are updated
    expect(nameInput).toHaveValue('Updated Company Name');
    expect(emailInput).toHaveValue('updated@example.com');
    expect(phoneInput).toHaveValue('555-555-5555');
  });

  it('should save changes when clicking the save button', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    const updatedCompany = {
      id: 1,
      name: 'Updated Company Name',
      description: 'Description 1',
      address: 'Address 1',
      phone: '555-555-5555',
      email: 'updated@example.com',
      website: 'https://example1.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-05T00:00:00Z'
    };

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);
    vi.mocked(companyService.updateCompany).mockResolvedValue(updatedCompany);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Get form inputs
    const nameInput = screen.getByDisplayValue('Test Company 1');
    const emailInput = screen.getByDisplayValue('test1@example.com');
    const phoneInput = screen.getByDisplayValue('123-456-7890');

    // Change input values
    fireEvent.change(nameInput, { target: { value: 'Updated Company Name' } });
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '555-555-5555' } });

    // Mock getCompanies to return updated data after save
    vi.mocked(companyService.getCompanies).mockResolvedValue([updatedCompany]);

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if updateCompany was called with correct data
    await waitFor(() => {
      expect(companyService.updateCompany).toHaveBeenCalledWith(1, {
        name: 'Updated Company Name',
        email: 'updated@example.com',
        phone: '555-555-5555',
        description: 'Description 1',
        address: 'Address 1',
        website: 'https://example1.com'
      });
    });

    // After saving, edit mode should be exited
    await waitFor(() => {
      expect(screen.queryByText('保存')).not.toBeInTheDocument();
      expect(screen.queryByText('キャンセル')).not.toBeInTheDocument();
    });
  });

  it('should cancel editing when clicking the cancel button', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Get form inputs
    const nameInput = screen.getByDisplayValue('Test Company 1');

    // Change input value
    fireEvent.change(nameInput, { target: { value: 'Updated Company Name' } });

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // After canceling, edit mode should be exited and original values should be displayed
    await waitFor(() => {
      expect(screen.queryByText('保存')).not.toBeInTheDocument();
      expect(screen.queryByText('キャンセル')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
  });

  it('should delete a company when clicking the delete button and confirming', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);
    vi.mocked(companyService.deleteCompany).mockResolvedValue();
    vi.mocked(window.confirm).mockReturnValue(true);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('本当にこの会社を削除しますか？');

    // Check if deleteCompany was called with correct ID
    await waitFor(() => {
      expect(companyService.deleteCompany).toHaveBeenCalledWith(1);
    });
  });

  it('should not delete a company when clicking the delete button and canceling', async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);
    vi.mocked(window.confirm).mockReturnValue(false);

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('本当にこの会社を削除しますか？');

    // Check that deleteCompany was not called
    expect(companyService.deleteCompany).not.toHaveBeenCalled();
  });

  it('should handle error when updating a company fails', async () => {
    // Mock the console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);
    vi.mocked(companyService.updateCompany).mockRejectedValue(new Error('Update failed'));

    // Mock window.alert
    const originalAlert = window.alert;
    window.alert = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if alert was called with error message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('会社の更新に失敗しました');
    });

    // Restore mocks
    console.error = originalConsoleError;
    window.alert = originalAlert;
  });

  it('should handle error when deleting a company fails', async () => {
    // Mock the console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Mock company data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Test Company 1',
        description: 'Description 1',
        address: 'Address 1',
        phone: '123-456-7890',
        email: 'test1@example.com',
        website: 'https://example1.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(companyService.getCompanies).mockResolvedValue(mockCompanies);
    vi.mocked(companyService.deleteCompany).mockRejectedValue(new Error('Delete failed'));
    vi.mocked(window.confirm).mockReturnValue(true);

    // Mock window.alert
    const originalAlert = window.alert;
    window.alert = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <CompanyList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Check if alert was called with error message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('会社の削除に失敗しました');
    });

    // Restore mocks
    console.error = originalConsoleError;
    window.alert = originalAlert;
  });
});
