import {boolean, index, integer, pgTable, serial, text, timestamp, uniqueIndex, varchar} from "drizzle-orm/pg-core";

export const countriesTable = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 255}).notNull(),
  code: varchar("code", {length: 10}),
  flag_url: varchar("flag_url", {length: 255}),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    nameIdx: index("idx_countries_name").on(table.name),
    codeIdx: index("idx_countries_code").on(table.code),
    createdAtIdx: index("idx_countries_created_at").on(table.created_at),
    updatedAtIdx: index("idx_countries_updated_at").on(table.updated_at)
  };
});

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 255}).notNull(),
  description: text("description"),
  address: varchar("address", {length: 255}),
  phone: varchar("phone", {length: 50}),
  email: varchar("email", {length: 255}),
  website: varchar("website", {length: 255}),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    nameIdx: index("idx_companies_name").on(table.name),
    emailIdx: index("idx_companies_email").on(table.email),
    createdAtIdx: index("idx_companies_created_at").on(table.created_at),
    updatedAtIdx: index("idx_companies_updated_at").on(table.updated_at)
  };
});

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 100}).notNull(),
  email: varchar("email", {length: 255}).notNull(),
  subject: varchar("subject", {length: 255}).notNull(),
  message: text("message").notNull(),
  status: varchar("status", {length: 64}).default("PENDING").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    nameIdx: index("idx_inquiries_name").on(table.name),
    emailIdx: index("idx_inquiries_email").on(table.email),
    statusIdx: index("idx_inquiries_status").on(table.status),
    createdAtIdx: index("idx_inquiries_created_at").on(table.created_at),
    updatedAtIdx: index("idx_inquiries_updated_at").on(table.updated_at)
  };
});


export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 64}).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    nameIdx: index("idx_categories_name").on(table.name),
    createdAtIdx: index("idx_categories_created_at").on(table.created_at),
    updatedAtIdx: index("idx_categories_updated_at").on(table.updated_at)
  };
});

export const teamsTable = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 64}).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    nameIdx: index("idx_teams_name").on(table.name),
    createdAtIdx: index("idx_teams_created_at").on(table.created_at),
    updatedAtIdx: index("idx_teams_updated_at").on(table.updated_at)
  };
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 64}).notNull(),
  email: varchar("email", {length: 255}).notNull().unique(),
  password: varchar("password", {length: 255}).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    nameIdx: index("idx_users_name").on(table.name),
    createdAtIdx: index("idx_users_created_at").on(table.created_at),
    updatedAtIdx: index("idx_users_updated_at").on(table.updated_at),
    emailUnique: uniqueIndex("email_unique").on(table.email)
  };
});

export const todosTable = pgTable("todos", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id, {onDelete: "cascade"}),
  title: varchar("title", {length: 255}).notNull(),
  description: text("description"),
  status: varchar("status", {length: 64}).default("PENDING"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index("idx_todos_user_id").on(table.user_id),
    titleIdx: index("idx_todos_title").on(table.title),
    statusIdx: index("idx_todos_status").on(table.status),
    createdAtIdx: index("idx_todos_created_at").on(table.created_at),
    updatedAtIdx: index("idx_todos_updated_at").on(table.updated_at)
  };
});

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id, {onDelete: "cascade"}),
  team_id: integer("team_id").references(() => teamsTable.id, {onDelete: "cascade"}),
  title: varchar("title", {length: 255}).notNull(),
  description: text("description"),
  status: varchar("status", {length: 64}).default("PENDING"),
  due_date: timestamp("due_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index("idx_tasks_user_id").on(table.user_id),
    teamIdIdx: index("idx_tasks_team_id").on(table.team_id),
    titleIdx: index("idx_tasks_title").on(table.title),
    statusIdx: index("idx_tasks_status").on(table.status),
    dueDateIdx: index("idx_tasks_due_date").on(table.due_date),
    createdAtIdx: index("idx_tasks_created_at").on(table.created_at),
    updatedAtIdx: index("idx_tasks_updated_at").on(table.updated_at)
  };
});

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id, {onDelete: "cascade"}),
  title: varchar("title", {length: 255}).notNull(),
  message: text("message").notNull(),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index("idx_notifications_user_id").on(table.user_id),
    isReadIdx: index("idx_notifications_is_read").on(table.is_read),
    createdAtIdx: index("idx_notifications_created_at").on(table.created_at),
    updatedAtIdx: index("idx_notifications_updated_at").on(table.updated_at)
  };
});

export const subTasksTable = pgTable("sub_tasks", {
  id: serial("id").primaryKey(),
  task_id: integer("task_id").references(() => tasksTable.id, {onDelete: "cascade"}).notNull(),
  title: varchar("title", {length: 255}).notNull(),
  description: text("description"),
  status: varchar("status", {length: 64}).default("PENDING"),
  due_date: timestamp("due_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    taskIdIdx: index("idx_sub_tasks_task_id").on(table.task_id),
    titleIdx: index("idx_sub_tasks_title").on(table.title),
    statusIdx: index("idx_sub_tasks_status").on(table.status),
    dueDateIdx: index("idx_sub_tasks_due_date").on(table.due_date),
    createdAtIdx: index("idx_sub_tasks_created_at").on(table.created_at),
    updatedAtIdx: index("idx_sub_tasks_updated_at").on(table.updated_at)
  };
});

export const chatsTable = pgTable("chats", {
  id: serial("id").primaryKey(),
  creator_id: integer("creator_id").references(() => usersTable.id, {onDelete: "cascade"}).notNull(),
  recipient_id: integer("recipient_id").references(() => usersTable.id, {onDelete: "cascade"}).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    creatorIdIdx: index("idx_chats_creator_id").on(table.creator_id),
    recipientIdIdx: index("idx_chats_recipient_id").on(table.recipient_id),
    createdAtIdx: index("idx_chats_created_at").on(table.created_at),
    updatedAtIdx: index("idx_chats_updated_at").on(table.updated_at)
  };
});

export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  chat_id: integer("chat_id").references(() => chatsTable.id, {onDelete: "cascade"}).notNull(),
  sender_id: integer("sender_id").references(() => usersTable.id, {onDelete: "cascade"}).notNull(),
  content: text("content").notNull(),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    chatIdIdx: index("idx_chat_messages_chat_id").on(table.chat_id),
    senderIdIdx: index("idx_chat_messages_sender_id").on(table.sender_id),
    isReadIdx: index("idx_chat_messages_is_read").on(table.is_read),
    createdAtIdx: index("idx_chat_messages_created_at").on(table.created_at),
    updatedAtIdx: index("idx_chat_messages_updated_at").on(table.updated_at)
  };
});

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id").references(() => categoriesTable.id, {onDelete: "set null"}),
  name: varchar("name", {length: 255}).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  stock: integer("stock").default(0),
  image_url: varchar("image_url", {length: 255}),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    nameIdx: index("idx_products_name").on(table.name),
    categoryIdIdx: index("idx_products_category_id").on(table.category_id),
    priceIdx: index("idx_products_price").on(table.price),
    stockIdx: index("idx_products_stock").on(table.stock),
    createdAtIdx: index("idx_products_created_at").on(table.created_at),
    updatedAtIdx: index("idx_products_updated_at").on(table.updated_at)
  };
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id, {onDelete: "cascade"}).notNull(),
  total_amount: integer("total_amount").notNull(),
  status: varchar("status", {length: 64}).default("PENDING").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index("idx_orders_user_id").on(table.user_id),
    statusIdx: index("idx_orders_status").on(table.status),
    createdAtIdx: index("idx_orders_created_at").on(table.created_at),
    updatedAtIdx: index("idx_orders_updated_at").on(table.updated_at)
  };
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => ordersTable.id, {onDelete: "cascade"}).notNull(),
  product_id: integer("product_id").references(() => productsTable.id, {onDelete: "restrict"}).notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    orderIdIdx: index("idx_order_items_order_id").on(table.order_id),
    productIdIdx: index("idx_order_items_product_id").on(table.product_id),
    createdAtIdx: index("idx_order_items_created_at").on(table.created_at),
    updatedAtIdx: index("idx_order_items_updated_at").on(table.updated_at)
  };
});

export const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => ordersTable.id, { onDelete: "set null" }),
  invoice_number: varchar("invoice_number", { length: 50 }).notNull(),
  issue_date: timestamp("issue_date").defaultNow().notNull(),
  due_date: timestamp("due_date"),
  total_amount: integer("total_amount").notNull(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
  payment_method: varchar("payment_method", { length: 50 }),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  return {
    orderIdIdx: index("idx_invoices_order_id").on(table.order_id),
    invoiceNumberIdx: index("idx_invoices_invoice_number").on(table.invoice_number),
    issueDateIdx: index("idx_invoices_issue_date").on(table.issue_date),
    dueDateIdx: index("idx_invoices_due_date").on(table.due_date),
    statusIdx: index("idx_invoices_status").on(table.status),
    createdAtIdx: index("idx_invoices_created_at").on(table.created_at),
    updatedAtIdx: index("idx_invoices_updated_at").on(table.updated_at)
  };
});
