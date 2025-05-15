import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InvoiceForm from '@/features/admin/invoices/components/InvoiceForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { invoiceService } from '@/features/admin/invoices/services';
import { Invoice } from '@/features/admin/invoices/controllers';

// Mock the invoice service
vi.mock('@/features/admin/invoices/services', () => ({
  invoiceService: {
    createInvoice: vi.fn()
  }
}));

describe('InvoiceForm Component', () => {
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
        <InvoiceForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(InvoiceForm).toBeDefined();
    expect(typeof InvoiceForm).toBe('function');

    // Check if the form title is rendered
    expect(screen.getByRole('heading', { name: '領収書を追加' })).toBeInTheDocument();
  });

  it('should update form fields when user inputs data', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceForm />
      </QueryClientProvider>
    );

    // Get form fields
    const invoiceNumberInput = screen.getByLabelText('領収書番号');
    const orderIdInput = screen.getByLabelText('注文ID');
    const totalAmountInput = screen.getByLabelText('合計金額');
    const statusSelect = screen.getByLabelText('ステータス');
    const paymentMethodInput = screen.getByLabelText('支払方法');
    const notesTextarea = screen.getByLabelText('備考');

    // Input values
    fireEvent.change(invoiceNumberInput, { target: { value: 'INV-001' } });
    fireEvent.change(orderIdInput, { target: { value: '123' } });
    fireEvent.change(totalAmountInput, { target: { value: '10000' } });
    fireEvent.change(statusSelect, { target: { value: 'PAID' } });
    fireEvent.change(paymentMethodInput, { target: { value: 'Credit Card' } });
    fireEvent.change(notesTextarea, { target: { value: 'Test notes' } });

    // Check if values are updated
    expect(invoiceNumberInput).toHaveValue('INV-001');
    expect(orderIdInput).toHaveValue(123);
    expect(totalAmountInput).toHaveValue(10000);
    expect(statusSelect).toHaveValue('PAID');
    expect(paymentMethodInput).toHaveValue('Credit Card');
    expect(notesTextarea).toHaveValue('Test notes');
  });

  it('should submit the form and create an invoice successfully', async () => {
    // Mock successful response
    const mockInvoice: Invoice = {
      id: 1,
      order_id: 123,
      invoice_number: 'INV-001',
      issue_date: '2023-01-01',
      due_date: '2023-02-01',
      total_amount: 10000,
      status: 'PAID',
      payment_method: 'Credit Card',
      notes: 'Test notes',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };
    vi.mocked(invoiceService.createInvoice).mockResolvedValue(mockInvoice);

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceForm />
      </QueryClientProvider>
    );

    // Get form fields
    const invoiceNumberInput = screen.getByLabelText('領収書番号');
    const orderIdInput = screen.getByLabelText('注文ID');
    const totalAmountInput = screen.getByLabelText('合計金額');
    const statusSelect = screen.getByLabelText('ステータス');
    const paymentMethodInput = screen.getByLabelText('支払方法');
    const notesTextarea = screen.getByLabelText('備考');
    const submitButton = screen.getByRole('button', { name: '領収書を追加' });

    // Input values
    fireEvent.change(invoiceNumberInput, { target: { value: 'INV-001' } });
    fireEvent.change(orderIdInput, { target: { value: '123' } });
    fireEvent.change(totalAmountInput, { target: { value: '10000' } });
    fireEvent.change(statusSelect, { target: { value: 'PAID' } });
    fireEvent.change(paymentMethodInput, { target: { value: 'Credit Card' } });
    fireEvent.change(notesTextarea, { target: { value: 'Test notes' } });

    // Submit form
    fireEvent.click(submitButton);

    // Check if the service was called with correct data
    await waitFor(() => {
      expect(invoiceService.createInvoice).toHaveBeenCalledWith({
        order_id: 123,
        invoice_number: 'INV-001',
        issue_date: expect.any(String),
        due_date: null,
        total_amount: 10000,
        status: 'PAID',
        payment_method: 'Credit Card',
        notes: 'Test notes'
      });
    });

    // Check if form was reset
    await waitFor(() => {
      // Get the form fields again after reset
      const resetInvoiceNumberInput = screen.getByLabelText('領収書番号');
      const resetOrderIdInput = screen.getByLabelText('注文ID');
      const resetTotalAmountInput = screen.getByLabelText('合計金額');
      const resetStatusSelect = screen.getByLabelText('ステータス');
      const resetPaymentMethodInput = screen.getByLabelText('支払方法');
      const resetNotesTextarea = screen.getByLabelText('備考');

      expect(resetInvoiceNumberInput).toHaveValue('');
      expect(resetOrderIdInput).toHaveValue(null);
      expect(resetTotalAmountInput).toHaveValue(null);
      expect(resetStatusSelect).toHaveValue('PENDING');
      expect(resetPaymentMethodInput).toHaveValue('');
      expect(resetNotesTextarea).toHaveValue('');
    });
  });

  it('should show error message when invoice creation fails', async () => {
    // Mock error response
    vi.mocked(invoiceService.createInvoice).mockRejectedValue(new Error('領収書の追加に失敗しました'));

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceForm />
      </QueryClientProvider>
    );

    // Get form fields
    const invoiceNumberInput = screen.getByLabelText('領収書番号');
    const totalAmountInput = screen.getByLabelText('合計金額');
    const submitButton = screen.getByRole('button', { name: '領収書を追加' });

    // Input required values
    fireEvent.change(invoiceNumberInput, { target: { value: 'INV-001' } });
    fireEvent.change(totalAmountInput, { target: { value: '10000' } });

    // Submit form
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('領収書の追加に失敗しました')).toBeInTheDocument();
    });

    // Check if the service was called
    expect(invoiceService.createInvoice).toHaveBeenCalled();
  });

  it('should show loading state during form submission', async () => {
    // Mock a delayed response
    vi.mocked(invoiceService.createInvoice).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({} as Invoice), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceForm />
      </QueryClientProvider>
    );

    // Get form fields
    const invoiceNumberInput = screen.getByLabelText('領収書番号');
    const totalAmountInput = screen.getByLabelText('合計金額');
    const submitButton = screen.getByRole('button', { name: '領収書を追加' });

    // Input required values
    fireEvent.change(invoiceNumberInput, { target: { value: 'INV-001' } });
    fireEvent.change(totalAmountInput, { target: { value: '10000' } });

    // Submit form
    fireEvent.click(submitButton);

    // Check if loading state is displayed
    expect(screen.getByText('送信中...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for the submission to complete
    await waitFor(() => {
      expect(screen.queryByText('送信中...')).not.toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InvoiceForm />
      </QueryClientProvider>
    );

    // Get submit button
    const submitButton = screen.getByRole('button', { name: '領収書を追加' });

    // Try to submit without filling required fields
    fireEvent.click(submitButton);

    // Check if the form validation prevents submission
    expect(invoiceService.createInvoice).not.toHaveBeenCalled();
  });
});
