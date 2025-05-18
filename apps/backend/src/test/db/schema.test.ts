import { describe, expect, it } from 'vitest';
import {
  categoriesTable,
  chatMessagesTable,
  chatsTable,
  companiesTable,
  contactsTable,
  countriesTable,
  inquiriesTable,
  invoicesTable,
  notificationsTable,
  orderItemsTable,
  ordersTable,
  productsTable,
  subTasksTable,
  tasksTable,
  teamsTable,
  todosTable,
  usersTable,
} from '../../db/schema';

describe('Database Schema', () => {
  // Test that all tables are defined and exported correctly
  it('should export all tables correctly', () => {
    // Check that all tables are defined
    expect(subTasksTable).toBeDefined();
    expect(chatsTable).toBeDefined();
    expect(chatMessagesTable).toBeDefined();
    expect(productsTable).toBeDefined();
    expect(ordersTable).toBeDefined();
    expect(orderItemsTable).toBeDefined();
    expect(invoicesTable).toBeDefined();
    expect(tasksTable).toBeDefined();
    expect(usersTable).toBeDefined();
    expect(categoriesTable).toBeDefined();
    expect(teamsTable).toBeDefined();
    expect(contactsTable).toBeDefined();
    expect(countriesTable).toBeDefined();
    expect(companiesTable).toBeDefined();
    expect(inquiriesTable).toBeDefined();
    expect(notificationsTable).toBeDefined();
    expect(todosTable).toBeDefined();
  });

  // Test that all tables have the expected structure
  it('should have the expected structure', () => {
    // For each table, check that it is an object
    expect(typeof subTasksTable).toBe('object');
    expect(typeof chatsTable).toBe('object');
    expect(typeof chatMessagesTable).toBe('object');
    expect(typeof productsTable).toBe('object');
    expect(typeof ordersTable).toBe('object');
    expect(typeof orderItemsTable).toBe('object');
    expect(typeof invoicesTable).toBe('object');
    expect(typeof tasksTable).toBe('object');
    expect(typeof usersTable).toBe('object');
    expect(typeof categoriesTable).toBe('object');
    expect(typeof teamsTable).toBe('object');
    expect(typeof contactsTable).toBe('object');
    expect(typeof countriesTable).toBe('object');
    expect(typeof companiesTable).toBe('object');
    expect(typeof inquiriesTable).toBe('object');
    expect(typeof notificationsTable).toBe('object');
    expect(typeof todosTable).toBe('object');
  });
});
