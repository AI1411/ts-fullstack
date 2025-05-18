import { client } from '@/common/utils/client';
import type { CreateInvoiceInput } from '@/features/admin/invoices/controllers';
import { invoiceRepository } from '@/features/admin/invoices/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define a type for mock responses
type MockResponse = {
  status: number;
  ok?: boolean;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
};

// Mock the client
vi.mock('@/common/utils/client', () => ({
  client: {
    invoices: {
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
        $put: vi.fn(),
        $delete: vi.fn(),
      },
    },
  },
}));

describe('Invoice Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getInvoices', () => {
    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 200 };
      vi.mocked(client.invoices.$get).mockResolvedValue(mockResponse);

      const result = await invoiceRepository.getInvoices();

      expect(client.invoices.$get).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.invoices.$get).mockRejectedValue(error);

      await expect(invoiceRepository.getInvoices()).rejects.toThrow(error);
      expect(client.invoices.$get).toHaveBeenCalledTimes(1);
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
      notes: 'Test notes',
    };

    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 201 };
      vi.mocked(client.invoices.$post).mockResolvedValue(mockResponse);

      const result = await invoiceRepository.createInvoice(invoiceData);

      expect(client.invoices.$post).toHaveBeenCalledTimes(1);
      expect(client.invoices.$post).toHaveBeenCalledWith({
        json: invoiceData,
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.invoices.$post).mockRejectedValue(error);

      await expect(
        invoiceRepository.createInvoice(invoiceData)
      ).rejects.toThrow(error);
      expect(client.invoices.$post).toHaveBeenCalledTimes(1);
      expect(client.invoices.$post).toHaveBeenCalledWith({
        json: invoiceData,
      });
    });
  });

  describe('getInvoiceById', () => {
    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 200 };
      vi.mocked(client.invoices[':id'].$get).mockResolvedValue(mockResponse);

      const result = await invoiceRepository.getInvoiceById(1);

      expect(client.invoices[':id'].$get).toHaveBeenCalledTimes(1);
      expect(client.invoices[':id'].$get).toHaveBeenCalledWith({
        param: { id: '1' },
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.invoices[':id'].$get).mockRejectedValue(error);

      await expect(invoiceRepository.getInvoiceById(1)).rejects.toThrow(error);
      expect(client.invoices[':id'].$get).toHaveBeenCalledTimes(1);
      expect(client.invoices[':id'].$get).toHaveBeenCalledWith({
        param: { id: '1' },
      });
    });
  });

  describe('updateInvoice', () => {
    const invoiceData: Partial<CreateInvoiceInput> = {
      invoice_number: 'INV-001-UPDATED',
      total_amount: 15000,
      status: 'PAID',
    };

    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 200 };
      vi.mocked(client.invoices[':id'].$put).mockResolvedValue(mockResponse);

      const result = await invoiceRepository.updateInvoice(1, invoiceData);

      expect(client.invoices[':id'].$put).toHaveBeenCalledTimes(1);
      expect(client.invoices[':id'].$put).toHaveBeenCalledWith({
        param: { id: '1' },
        json: invoiceData,
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.invoices[':id'].$put).mockRejectedValue(error);

      await expect(
        invoiceRepository.updateInvoice(1, invoiceData)
      ).rejects.toThrow(error);
      expect(client.invoices[':id'].$put).toHaveBeenCalledTimes(1);
      expect(client.invoices[':id'].$put).toHaveBeenCalledWith({
        param: { id: '1' },
        json: invoiceData,
      });
    });
  });

  describe('deleteInvoice', () => {
    it('should call the client with correct parameters', async () => {
      const mockResponse: MockResponse = { status: 204 };
      vi.mocked(client.invoices[':id'].$delete).mockResolvedValue(mockResponse);

      const result = await invoiceRepository.deleteInvoice(1);

      expect(client.invoices[':id'].$delete).toHaveBeenCalledTimes(1);
      expect(client.invoices[':id'].$delete).toHaveBeenCalledWith({
        param: { id: '1' },
      });
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from the client', async () => {
      const error = new Error('Network error');
      vi.mocked(client.invoices[':id'].$delete).mockRejectedValue(error);

      await expect(invoiceRepository.deleteInvoice(1)).rejects.toThrow(error);
      expect(client.invoices[':id'].$delete).toHaveBeenCalledTimes(1);
      expect(client.invoices[':id'].$delete).toHaveBeenCalledWith({
        param: { id: '1' },
      });
    });
  });
});
