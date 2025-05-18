import * as controllers from '@/features/admin/invoices/controllers';
import { invoiceService } from '@/features/admin/invoices/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/invoices/controllers', () => ({
  getInvoices: vi.fn(),
  createInvoice: vi.fn(),
  getInvoiceById: vi.fn(),
  updateInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
}));

describe('Invoice Service', () => {
  const mockInvoice = {
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
    updated_at: '2023-01-01T00:00:00Z',
  };

  const mockInvoices = [mockInvoice];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getInvoices', () => {
    it('should call the controller and return invoices', async () => {
      vi.mocked(controllers.getInvoices).mockResolvedValue(mockInvoices);

      const result = await invoiceService.getInvoices();

      expect(controllers.getInvoices).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockInvoices);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to fetch invoices');
      vi.mocked(controllers.getInvoices).mockRejectedValue(error);

      await expect(invoiceService.getInvoices()).rejects.toThrow(error);
      expect(controllers.getInvoices).toHaveBeenCalledTimes(1);
    });
  });

  describe('createInvoice', () => {
    const invoiceData = {
      order_id: 123,
      invoice_number: 'INV-001',
      issue_date: '2023-01-01',
      due_date: '2023-02-01',
      total_amount: 10000,
      status: 'PENDING',
      payment_method: 'Credit Card',
      notes: 'Test notes',
    };

    it('should call the controller and return the created invoice', async () => {
      vi.mocked(controllers.createInvoice).mockResolvedValue(mockInvoice);

      const result = await invoiceService.createInvoice(invoiceData);

      expect(controllers.createInvoice).toHaveBeenCalledTimes(1);
      expect(controllers.createInvoice).toHaveBeenCalledWith(invoiceData);
      expect(result).toEqual(mockInvoice);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to create invoice');
      vi.mocked(controllers.createInvoice).mockRejectedValue(error);

      await expect(invoiceService.createInvoice(invoiceData)).rejects.toThrow(
        error
      );
      expect(controllers.createInvoice).toHaveBeenCalledTimes(1);
      expect(controllers.createInvoice).toHaveBeenCalledWith(invoiceData);
    });
  });

  describe('getInvoiceById', () => {
    it('should call the controller and return the invoice', async () => {
      vi.mocked(controllers.getInvoiceById).mockResolvedValue(mockInvoice);

      const result = await invoiceService.getInvoiceById(1);

      expect(controllers.getInvoiceById).toHaveBeenCalledTimes(1);
      expect(controllers.getInvoiceById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockInvoice);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to fetch invoice');
      vi.mocked(controllers.getInvoiceById).mockRejectedValue(error);

      await expect(invoiceService.getInvoiceById(1)).rejects.toThrow(error);
      expect(controllers.getInvoiceById).toHaveBeenCalledTimes(1);
      expect(controllers.getInvoiceById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateInvoice', () => {
    const invoiceData = {
      invoice_number: 'INV-001-UPDATED',
      total_amount: 15000,
      status: 'PAID',
    };

    it('should call the controller and return the updated invoice', async () => {
      const updatedInvoice = { ...mockInvoice, ...invoiceData };
      vi.mocked(controllers.updateInvoice).mockResolvedValue(updatedInvoice);

      const result = await invoiceService.updateInvoice(1, invoiceData);

      expect(controllers.updateInvoice).toHaveBeenCalledTimes(1);
      expect(controllers.updateInvoice).toHaveBeenCalledWith(1, invoiceData);
      expect(result).toEqual(updatedInvoice);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to update invoice');
      vi.mocked(controllers.updateInvoice).mockRejectedValue(error);

      await expect(
        invoiceService.updateInvoice(1, invoiceData)
      ).rejects.toThrow(error);
      expect(controllers.updateInvoice).toHaveBeenCalledTimes(1);
      expect(controllers.updateInvoice).toHaveBeenCalledWith(1, invoiceData);
    });
  });

  describe('deleteInvoice', () => {
    it('should call the controller', async () => {
      vi.mocked(controllers.deleteInvoice).mockResolvedValue();

      await invoiceService.deleteInvoice(1);

      expect(controllers.deleteInvoice).toHaveBeenCalledTimes(1);
      expect(controllers.deleteInvoice).toHaveBeenCalledWith(1);
    });

    it('should propagate errors from the controller', async () => {
      const error = new Error('Failed to delete invoice');
      vi.mocked(controllers.deleteInvoice).mockRejectedValue(error);

      await expect(invoiceService.deleteInvoice(1)).rejects.toThrow(error);
      expect(controllers.deleteInvoice).toHaveBeenCalledTimes(1);
      expect(controllers.deleteInvoice).toHaveBeenCalledWith(1);
    });
  });
});
