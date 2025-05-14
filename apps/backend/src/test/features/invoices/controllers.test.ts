import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getInvoices, 
  getInvoiceById, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice 
} from '../../../features/invoices/controllers';
import { invoicesTable, ordersTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock invoice data
const mockInvoice = {
  id: 1,
  order_id: 1,
  invoice_number: 'INV-2023-001',
  issue_date: new Date('2023-01-01'),
  due_date: new Date('2023-01-31'),
  total_amount: 10000,
  status: 'PENDING',
  payment_method: 'CREDIT_CARD',
  notes: 'テスト用の領収書です',
  created_at: new Date(),
  updated_at: new Date()
};

// Mock order data
const mockOrder = {
  id: 1,
  user_id: 1,
  status: 'COMPLETED',
  total_amount: 10000,
  created_at: new Date(),
  updated_at: new Date()
};

// Mock the database module
vi.mock('../../../common/utils/db', () => ({
  getDB: vi.fn()
}));

// Mock context
const createMockContext = (body = {}, params = {}) => ({
  req: {
    valid: vi.fn().mockReturnValue(body),
    param: vi.fn((key) => params[key])
  },
  json: vi.fn().mockImplementation((data, status) => ({ data, status })),
  env: {
    DATABASE_URL: 'postgres://test:test@localhost:5432/test'
  }
});

// Mock DB client
const mockDbClient = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([mockInvoice])
};

describe('Invoice Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('getInvoices', () => {
    it('should return all invoices', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockInvoice]);

      const result = await getInvoices(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ invoices: [mockInvoice] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getInvoices(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockInvoice]);

      const result = await getInvoiceById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ invoice: mockInvoice });
    });

    it('should return 404 if invoice not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getInvoiceById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '領収書が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getInvoiceById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('createInvoice', () => {
    it('should create a new invoice with order_id and return it', async () => {
      const mockBody = {
        order_id: 1,
        invoice_number: 'INV-2023-001',
        issue_date: '2023-01-01',
        due_date: '2023-01-31',
        total_amount: 10000,
        status: 'PENDING',
        payment_method: 'CREDIT_CARD',
        notes: 'テスト用の領収書です'
      };
      const mockContext = createMockContext(mockBody);
      
      // Mock the order check
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockOrder]);

      const result = await createInvoice(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ invoice: mockInvoice }, 201);
    });

    it('should create a new invoice without order_id and return it', async () => {
      const mockBody = {
        invoice_number: 'INV-2023-001',
        issue_date: '2023-01-01',
        due_date: '2023-01-31',
        total_amount: 10000,
        status: 'PENDING',
        payment_method: 'CREDIT_CARD',
        notes: 'テスト用の領収書です'
      };
      const mockContext = createMockContext(mockBody);

      const result = await createInvoice(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ invoice: mockInvoice }, 201);
    });

    it('should create a new invoice with default values', async () => {
      const mockBody = {
        invoice_number: 'INV-2023-001',
        total_amount: 10000,
        payment_method: 'CREDIT_CARD'
      };
      const mockContext = createMockContext(mockBody);

      const result = await createInvoice(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ invoice: mockInvoice }, 201);
    });

    it('should return 404 if order not found', async () => {
      const mockBody = {
        order_id: 999,
        invoice_number: 'INV-2023-001',
        total_amount: 10000
      };
      const mockContext = createMockContext(mockBody);
      
      // Mock the order check to return empty
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await createInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '指定された注文が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        invoice_number: 'INV-2023-001',
        total_amount: 10000
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice and return it', async () => {
      const mockBody = {
        invoice_number: 'INV-2023-001-UPDATED',
        status: 'PAID',
        payment_method: 'BANK_TRANSFER'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to check if invoice exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockInvoice]);

      const result = await updateInvoice(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ invoice: mockInvoice });
    });

    it('should update an invoice with order_id and return it', async () => {
      const mockBody = {
        order_id: 2,
        invoice_number: 'INV-2023-001-UPDATED'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to check if invoice exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockInvoice]);
      
      // Mock the order check
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([{ ...mockOrder, id: 2 }]);

      const result = await updateInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ invoice: mockInvoice });
    });

    it('should return 404 if invoice not found', async () => {
      const mockBody = {
        invoice_number: 'INV-2023-001-UPDATED'
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      
      // Mock the first query to check if invoice exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '領収書が見つかりません' }, 404);
    });

    it('should return 404 if order not found', async () => {
      const mockBody = {
        order_id: 999,
        invoice_number: 'INV-2023-001-UPDATED'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to check if invoice exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockInvoice]);
      
      // Mock the order check to return empty
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '指定された注文が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        invoice_number: 'INV-2023-001-UPDATED'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the first query to check if invoice exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockInvoice]);

      const result = await deleteInvoice(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ success: true, message: '領収書が削除されました' });
    });

    it('should return 404 if invoice not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      
      // Mock the first query to check if invoice exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await deleteInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '領収書が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteInvoice(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});