// Invoice services
import {
  type CreateInvoiceInput,
  type Invoice,
  createInvoice as createInvoiceController,
  deleteInvoice as deleteInvoiceController,
  getInvoiceById as getInvoiceByIdController,
  getInvoices as getInvoicesController,
  updateInvoice as updateInvoiceController,
} from './controllers';

// Invoice service
export const invoiceService = {
  // Get all invoices
  getInvoices: async (): Promise<Invoice[]> => {
    return getInvoicesController();
  },

  // Create a new invoice
  createInvoice: async (invoiceData: CreateInvoiceInput): Promise<Invoice> => {
    return createInvoiceController(invoiceData);
  },

  // Get an invoice by ID
  getInvoiceById: async (id: number): Promise<Invoice> => {
    return getInvoiceByIdController(id);
  },

  // Update an invoice
  updateInvoice: async (
    id: number,
    invoiceData: Partial<CreateInvoiceInput>
  ): Promise<Invoice> => {
    return updateInvoiceController(id, invoiceData);
  },

  // Delete an invoice
  deleteInvoice: async (id: number): Promise<void> => {
    return deleteInvoiceController(id);
  },
};
