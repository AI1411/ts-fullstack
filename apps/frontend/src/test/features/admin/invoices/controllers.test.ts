import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getInvoices, 
  createInvoice, 
  getInvoiceById, 
  updateInvoice, 
  deleteInvoice,
  Invoice,
  CreateInvoiceInput
} from '@/features/admin/invoices/controllers';
import { invoiceRepository } from '@/features/admin/invoices/repositories';

// Mock the repository
vi.mock('@/features/admin/invoices/repositories', () => ({
  invoiceRepository: {
    getInvoices: vi.fn(),
    createInvoice: vi.fn(),
    getInvoiceById: vi.fn(),
    updateInvoice: vi.fn(),
    deleteInvoice: vi.fn()
  }
}));

describe('Invoice Controllers', () => {
  const mockInvoice: Invoice = {
    id: 1,
    order_id: 123,
    invoice_number: 'INV-001',
    issue_date: '2023-01-01',
    due_date: '2023-02-01',
    total_amount: 10000,
    status: 'PENDING',
    payment_method: 'Credit Card',
    notes: 'Test notes',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  };

  const mockInvoices = [mockInvoice];

  // Mock response object
  const createMockResponse = (data: Record<string, unknown>, ok = true) => ({
    ok,
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue('Error message')
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getInvoices', () => {
    it('should call the repository and return invoices', async () => {
      const mockResponse = createMockResponse({ invoices: mockInvoices });
      vi.mocked(invoiceRepository.getInvoices).mockResolvedValue(mockResponse);

      const result = await getInvoices();

      expect(invoiceRepository.getInvoices).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockInvoices);
    });

    it('should handle errors from the repository', async () => {
      const error = new Error('Network error');
      vi.mocked(invoiceRepository.getInvoices).mockRejectedValue(error);

      await expect(getInvoices()).rejects.toThrow(error);
      expect(invoiceRepository.getInvoices).toHaveBeenCalledTimes(1);
    });
  });

  describe('createInvoice', () => {
    const invoiceData: CreateInvoiceInput = {
      order_id: 123,
      invoice_number: 'INV-001',
      issue_date: '2023-01-01',
      due_date: '2023-02-01',
      total_amount: 10000,
      status: 'PENDING',
      payment_method: 'Credit Card',
      notes: 'Test notes'
    };

    it('should call the repository and return the created invoice', async () => {
      const mockResponse = createMockResponse({ invoice: mockInvoice });
      vi.mocked(invoiceRepository.createInvoice).mockResolvedValue(mockResponse);

      const result = await createInvoice(invoiceData);

      expect(invoiceRepository.createInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.createInvoice).toHaveBeenCalledWith(invoiceData);
      expect(result).toEqual(mockInvoice);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(invoiceRepository.createInvoice).mockResolvedValue(mockResponse);

      await expect(createInvoice(invoiceData)).rejects.toThrow();
      expect(invoiceRepository.createInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.createInvoice).toHaveBeenCalledWith(invoiceData);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Network error');
      vi.mocked(invoiceRepository.createInvoice).mockRejectedValue(error);

      await expect(createInvoice(invoiceData)).rejects.toThrow(error);
      expect(invoiceRepository.createInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.createInvoice).toHaveBeenCalledWith(invoiceData);
    });
  });

  describe('getInvoiceById', () => {
    it('should call the repository and return the invoice', async () => {
      const mockResponse = createMockResponse({ invoice: mockInvoice });
      vi.mocked(invoiceRepository.getInvoiceById).mockResolvedValue(mockResponse);

      const result = await getInvoiceById(1);

      expect(invoiceRepository.getInvoiceById).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.getInvoiceById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockInvoice);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(invoiceRepository.getInvoiceById).mockResolvedValue(mockResponse);

      await expect(getInvoiceById(1)).rejects.toThrow('Invoice not found');
      expect(invoiceRepository.getInvoiceById).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.getInvoiceById).toHaveBeenCalledWith(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Network error');
      vi.mocked(invoiceRepository.getInvoiceById).mockRejectedValue(error);

      await expect(getInvoiceById(1)).rejects.toThrow(error);
      expect(invoiceRepository.getInvoiceById).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.getInvoiceById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateInvoice', () => {
    const invoiceData: Partial<CreateInvoiceInput> = {
      invoice_number: 'INV-001-UPDATED',
      total_amount: 15000,
      status: 'PAID'
    };

    it('should call the repository and return the updated invoice', async () => {
      const updatedInvoice = { ...mockInvoice, ...invoiceData };
      const mockResponse = createMockResponse({ invoice: updatedInvoice });
      vi.mocked(invoiceRepository.updateInvoice).mockResolvedValue(mockResponse);

      const result = await updateInvoice(1, invoiceData);

      expect(invoiceRepository.updateInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.updateInvoice).toHaveBeenCalledWith(1, invoiceData);
      expect(result).toEqual(updatedInvoice);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(invoiceRepository.updateInvoice).mockResolvedValue(mockResponse);

      await expect(updateInvoice(1, invoiceData)).rejects.toThrow();
      expect(invoiceRepository.updateInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.updateInvoice).toHaveBeenCalledWith(1, invoiceData);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Network error');
      vi.mocked(invoiceRepository.updateInvoice).mockRejectedValue(error);

      await expect(updateInvoice(1, invoiceData)).rejects.toThrow(error);
      expect(invoiceRepository.updateInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.updateInvoice).toHaveBeenCalledWith(1, invoiceData);
    });
  });

  describe('deleteInvoice', () => {
    it('should call the repository', async () => {
      const mockResponse = createMockResponse({});
      vi.mocked(invoiceRepository.deleteInvoice).mockResolvedValue(mockResponse);

      await deleteInvoice(1);

      expect(invoiceRepository.deleteInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.deleteInvoice).toHaveBeenCalledWith(1);
    });

    it('should handle API errors', async () => {
      const mockResponse = createMockResponse({}, false);
      vi.mocked(invoiceRepository.deleteInvoice).mockResolvedValue(mockResponse);

      await expect(deleteInvoice(1)).rejects.toThrow();
      expect(invoiceRepository.deleteInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.deleteInvoice).toHaveBeenCalledWith(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Network error');
      vi.mocked(invoiceRepository.deleteInvoice).mockRejectedValue(error);

      await expect(deleteInvoice(1)).rejects.toThrow(error);
      expect(invoiceRepository.deleteInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.deleteInvoice).toHaveBeenCalledWith(1);
    });
  });
});