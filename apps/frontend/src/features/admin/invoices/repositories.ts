// Invoice repositories
import { client } from '@/common/utils/client';
import type { CreateInvoiceInput } from './controllers';

// Invoice repository
export const invoiceRepository = {
  // Get all invoices
  getInvoices: async () => {
    return client.invoices.$get();
  },

  // Create a new invoice
  createInvoice: async (invoiceData: CreateInvoiceInput) => {
    return client.invoices.$post({
      json: invoiceData,
    });
  },

  // Get an invoice by ID
  getInvoiceById: async (id: number) => {
    return client.invoices[':id'].$get({
      param: { id: id.toString() },
    });
  },

  // Update an invoice
  updateInvoice: async (
    id: number,
    invoiceData: Partial<CreateInvoiceInput>
  ) => {
    return client.invoices[':id'].$put({
      param: { id: id.toString() },
      json: invoiceData,
    });
  },

  // Delete an invoice
  deleteInvoice: async (id: number) => {
    return client.invoices[':id'].$delete({
      param: { id: id.toString() },
    });
  },
};
