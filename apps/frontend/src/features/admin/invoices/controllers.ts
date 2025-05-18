// Invoice controllers
import { invoiceRepository } from './repositories';

// Types
export interface Invoice {
  id: number;
  order_id: number | null;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  total_amount: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceInput {
  order_id?: number | null;
  invoice_number: string;
  issue_date?: string;
  due_date?: string | null;
  total_amount: number;
  status?: string;
  payment_method?: string | null;
  notes?: string | null;
}

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await invoiceRepository.getInvoices();
    const { invoices } = await response.json();
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (
  invoiceData: CreateInvoiceInput
): Promise<Invoice> => {
  try {
    const response = await invoiceRepository.createInvoice(invoiceData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { invoice } = await response.json();
    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

// Get an invoice by ID
export const getInvoiceById = async (id: number): Promise<Invoice> => {
  try {
    const response = await invoiceRepository.getInvoiceById(id);
    if (!response.ok) {
      throw new Error('Invoice not found');
    }
    const { invoice } = await response.json();
    return invoice;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
};

// Update an invoice
export const updateInvoice = async (
  id: number,
  invoiceData: Partial<CreateInvoiceInput>
): Promise<Invoice> => {
  try {
    const response = await invoiceRepository.updateInvoice(id, invoiceData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { invoice } = await response.json();
    return invoice;
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (id: number): Promise<void> => {
  try {
    const response = await invoiceRepository.deleteInvoice(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    throw error;
  }
};
