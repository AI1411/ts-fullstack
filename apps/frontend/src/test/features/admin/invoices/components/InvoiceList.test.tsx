import InvoiceList from '@/features/admin/invoices/components/InvoiceList';
import type { Invoice } from '@/features/admin/invoices/controllers';
import { invoiceService } from '@/features/admin/invoices/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the invoice service
vi.mock('@/features/admin/invoices/services', () => ({
  invoiceService: {
    getInvoices: vi.fn(),
    updateInvoice: vi.fn(),
    deleteInvoice: vi.fn(),
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock window.confirm
const originalConfirm = window.confirm;
window.confirm = vi.fn();

// Mock console.error
const originalConsoleError = console.error;
console.error = vi.fn();

describe('InvoiceList Component', () => {
  let queryClient: QueryClient;

  // Sample invoice data
  const mockInvoices: Invoice[] = [
    {
      id: 1,
      order_id: 101,
      invoice_number: 'INV-001',
      issue_date: '2023-01-01',
      due_date: '2023-02-01',
      total_amount: 10000,
      status: 'PENDING',
      payment_method: 'Credit Card',
      notes: 'Test notes',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      order_id: 102,
      invoice_number: 'INV-002',
      issue_date: '2023-01-02',
      due_date: null,
      total_amount: 20000,
      status: 'PAID',
      payment_method: null,
      notes: null,
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    },
  ];

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
    console.error = vi.fn();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
    console.error = originalConsoleError;
  });

  it('should render loading state initially', () => {
    // Mock a delayed response
    vi.mocked(invoiceService.getInvoices).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should render error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(invoiceService.getInvoices).mockRejectedValue(
      new Error('API error')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should render empty state when no invoices are available', async () => {
    // Mock successful response with empty array
    vi.mocked(invoiceService.getInvoices).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText('領収書がありません')).toBeInTheDocument();
    });
  });

  it('should display invoice list when data is available', async () => {
    // Mock successful response with data
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Check if invoices are displayed
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('INV-002')).toBeInTheDocument();
    expect(screen.getByText('¥10,000')).toBeInTheDocument();
    expect(screen.getByText('¥20,000')).toBeInTheDocument();
    expect(screen.getByText('未払い')).toBeInTheDocument();
    expect(screen.getByText('支払済み')).toBeInTheDocument();
  });

  it('should expand invoice details when expand button is clicked', async () => {
    // Mock successful response with data
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Initially, details should not be visible
    expect(screen.queryByText('領収書詳細')).not.toBeInTheDocument();

    // Find and click the expand button for the first invoice
    const expandButtons = screen.getAllByRole('button');
    const expandButton = expandButtons.find(
      (button) => button.textContent === ''
    );
    fireEvent.click(expandButton!);

    // Check if details are now visible
    expect(screen.getByText('領収書詳細')).toBeInTheDocument();
    expect(screen.getByText('注文ID:')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(expandButton!);

    // Details should be hidden again
    await waitFor(() => {
      expect(screen.queryByText('領収書詳細')).not.toBeInTheDocument();
    });
  });

  it('should enter edit mode when edit button is clicked', async () => {
    // Mock successful response with data
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button for the first invoice
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    const invoiceNumberInput = screen.getByDisplayValue('INV-001');
    const totalAmountInput = screen.getByDisplayValue('10000');
    const statusSelect = screen.getByRole('combobox', { name: 'ステータス' });

    expect(invoiceNumberInput).toBeInTheDocument();
    expect(totalAmountInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'キャンセル' })
    ).toBeInTheDocument();
  });

  it('should update invoice when save button is clicked', async () => {
    // Mock successful response with data
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);
    vi.mocked(invoiceService.updateInvoice).mockResolvedValue(mockInvoices[0]);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button for the first invoice
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Update form values
    const invoiceNumberInput = screen.getByDisplayValue('INV-001');
    const totalAmountInput = screen.getByDisplayValue('10000');
    const statusSelect = screen.getByRole('combobox', { name: 'ステータス' });

    fireEvent.change(invoiceNumberInput, {
      target: { value: 'INV-001-UPDATED' },
    });
    fireEvent.change(totalAmountInput, { target: { value: '15000' } });
    fireEvent.change(statusSelect, { target: { value: 'PAID' } });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if updateInvoice was called with correct data
    await waitFor(() => {
      expect(invoiceService.updateInvoice).toHaveBeenCalledWith(1, {
        invoice_number: 'INV-001-UPDATED',
        total_amount: 15000,
        status: 'PAID',
        payment_method: 'Credit Card',
        notes: 'Test notes',
      });
    });

    // Check if queryClient.invalidateQueries was called
    await waitFor(() => {
      expect(invoiceService.getInvoices).toHaveBeenCalled();
    });
  });

  it('should cancel edit when cancel button is clicked', async () => {
    // Mock successful response with data
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button for the first invoice
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    expect(screen.getByDisplayValue('INV-001')).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    // Check if edit form is hidden
    await waitFor(() => {
      expect(screen.queryByDisplayValue('INV-001')).not.toBeInTheDocument();
    });

    // Check if we're back to view mode
    expect(screen.getByText('INV-001')).toBeInTheDocument();
  });

  it('should delete invoice when delete button is clicked and confirmed', async () => {
    // Mock successful response with data
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);
    vi.mocked(invoiceService.deleteInvoice).mockResolvedValue();
    vi.mocked(window.confirm).mockReturnValue(true);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button for the first invoice
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith(
      '本当にこの領収書を削除しますか？'
    );

    // Check if deleteInvoice was called
    await waitFor(() => {
      expect(invoiceService.deleteInvoice).toHaveBeenCalledWith(1);
    });

    // Check if queryClient.invalidateQueries was called
    await waitFor(() => {
      expect(invoiceService.getInvoices).toHaveBeenCalled();
    });
  });

  it('should not delete invoice when delete is cancelled', async () => {
    // Mock successful response with data
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);
    vi.mocked(window.confirm).mockReturnValue(false);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button for the first invoice
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith(
      '本当にこの領収書を削除しますか？'
    );

    // Check if deleteInvoice was NOT called
    expect(invoiceService.deleteInvoice).not.toHaveBeenCalled();
  });

  it('should show error when update fails', async () => {
    // Mock successful response with data for initial load
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);
    // Mock error for update
    vi.mocked(invoiceService.updateInvoice).mockRejectedValue(
      new Error('Update failed')
    );

    // Spy on window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button for the first invoice
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Click save button without changing anything
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if error handling was triggered
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('領収書の更新に失敗しました');
    });

    alertSpy.mockRestore();
  });

  it('should show error when delete fails', async () => {
    // Mock successful response with data for initial load
    vi.mocked(invoiceService.getInvoices).mockResolvedValue(mockInvoices);
    // Mock confirmation
    vi.mocked(window.confirm).mockReturnValue(true);
    // Mock error for delete
    vi.mocked(invoiceService.deleteInvoice).mockRejectedValue(
      new Error('Delete failed')
    );

    // Spy on window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button for the first invoice
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if error handling was triggered
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('領収書の削除に失敗しました');
    });

    alertSpy.mockRestore();
  });
});
