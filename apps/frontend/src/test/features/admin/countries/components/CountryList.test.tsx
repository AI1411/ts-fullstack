import CountryList from '@/features/admin/countries/components/CountryList';
import type { Country } from '@/features/admin/countries/controllers';
import { countryService } from '@/features/admin/countries/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the country service
vi.mock('@/features/admin/countries/services', () => ({
  countryService: {
    getCountries: vi.fn(),
    updateCountry: vi.fn(),
    deleteCountry: vi.fn(),
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

// Mock React Icons
vi.mock('react-icons/ri', () => ({
  RiArrowDownSLine: () => <span data-testid="arrow-down-icon">↓</span>,
  RiArrowRightSLine: () => <span data-testid="arrow-right-icon">→</span>,
}));

describe('CountryList Component', () => {
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
    // Mock successful response with empty array
    vi.mocked(countryService.getCountries).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(CountryList).toBeDefined();
    expect(typeof CountryList).toBe('function');
  });

  it('should show loading state initially', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(countryService.getCountries).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(countryService.getCountries).mockRejectedValue(
      new Error('API error')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should show empty state when no countries are available', async () => {
    // Mock successful response with empty array
    vi.mocked(countryService.getCountries).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('国がありません')).toBeInTheDocument();
  });

  it('should display country list when data is available', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
      {
        id: 2,
        name: 'United States',
        code: 'US',
        flag_url: 'https://example.com/us.png',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-04T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('JP')).toBeInTheDocument();
    expect(screen.getByText('US')).toBeInTheDocument();
  });

  it('should handle edit mode correctly', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);
    vi.mocked(countryService.updateCountry).mockResolvedValue(mockCountries[0]);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText('編集'));

    // Check if edit form is displayed
    const nameInput = screen.getByDisplayValue('Japan');
    const codeInput = screen.getByDisplayValue('JP');

    expect(nameInput).toBeInTheDocument();
    expect(codeInput).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();

    // Edit the country name
    fireEvent.change(nameInput, { target: { value: 'Japan Updated' } });

    // Save the changes
    fireEvent.click(screen.getByText('保存'));

    // Check if updateCountry was called with correct parameters
    await waitFor(() => {
      expect(countryService.updateCountry).toHaveBeenCalledWith(1, {
        name: 'Japan Updated',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
      });
    });
  });

  it('should handle update error correctly', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);
    vi.mocked(countryService.updateCountry).mockRejectedValue(
      new Error('Update failed')
    );

    // Mock console.error and window.alert
    const originalConsoleError = console.error;
    const originalAlert = window.alert;
    console.error = vi.fn();
    window.alert = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText('編集'));

    // Edit the country name
    const nameInput = screen.getByDisplayValue('Japan');
    fireEvent.change(nameInput, { target: { value: 'Japan Updated' } });

    // Save the changes
    fireEvent.click(screen.getByText('保存'));

    // Check if error handling was triggered
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Failed to update country:',
        expect.any(Error)
      );
      expect(window.alert).toHaveBeenCalledWith('国の更新に失敗しました');
    });

    // Restore original functions
    console.error = originalConsoleError;
    window.alert = originalAlert;
  });

  it('should handle cancel edit correctly', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText('編集'));

    // Check if edit form is displayed
    const nameInput = screen.getByDisplayValue('Japan');

    // Edit the country name
    fireEvent.change(nameInput, { target: { value: 'Japan Updated' } });

    // Cancel the changes
    fireEvent.click(screen.getByText('キャンセル'));

    // Check if we're back to view mode and the original name is displayed
    await waitFor(() => {
      expect(
        screen.queryByDisplayValue('Japan Updated')
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(countryService.updateCountry).not.toHaveBeenCalled();
  });

  it('should handle delete correctly', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);
    vi.mocked(countryService.deleteCountry).mockResolvedValue();

    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText('削除'));

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('本当にこの国を削除しますか？');

    // Check if deleteCountry was called with correct parameters
    await waitFor(() => {
      expect(countryService.deleteCountry).toHaveBeenCalledWith(1);
    });

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should handle delete error correctly', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);
    vi.mocked(countryService.deleteCountry).mockRejectedValue(
      new Error('Delete failed')
    );

    // Mock console.error and window.alert
    const originalConsoleError = console.error;
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    console.error = vi.fn();
    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText('削除'));

    // Check if error handling was triggered
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Failed to delete country:',
        expect.any(Error)
      );
      expect(window.alert).toHaveBeenCalledWith('国の削除に失敗しました');
    });

    // Restore original functions
    console.error = originalConsoleError;
    window.alert = originalAlert;
    window.confirm = originalConfirm;
  });

  it('should not delete when confirm is canceled', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);

    // Mock window.confirm to return false (cancel)
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText('削除'));

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('本当にこの国を削除しますか？');

    // Check that deleteCountry was not called
    expect(countryService.deleteCountry).not.toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should handle expand/collapse correctly', async () => {
    // Mock country data
    const mockCountries: Country[] = [
      {
        id: 1,
        name: 'Japan',
        code: 'JP',
        flag_url: 'https://example.com/japan.png',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(countryService.getCountries).mockResolvedValue(mockCountries);

    render(
      <QueryClientProvider client={queryClient}>
        <CountryList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Initially, the details should not be visible
    expect(screen.queryByText('国の詳細')).not.toBeInTheDocument();

    // Click the expand button (which contains the arrow icon)
    fireEvent.click(screen.getByTestId('arrow-right-icon'));

    // Check if details are now visible
    expect(screen.getByText('国の詳細')).toBeInTheDocument();
    expect(screen.getByText('国旗URL:')).toBeInTheDocument();
    expect(
      screen.getByText('https://example.com/japan.png')
    ).toBeInTheDocument();
    expect(screen.getByText('最終更新日:')).toBeInTheDocument();

    // Click the collapse button
    fireEvent.click(screen.getByTestId('arrow-down-icon'));

    // Check if details are hidden again
    await waitFor(() => {
      expect(screen.queryByText('国の詳細')).not.toBeInTheDocument();
    });
  });
});
