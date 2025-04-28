import {boolean, index, integer, pgTable, serial, text, timestamp, uniqueIndex, varchar} from "drizzle-orm/pg-core";

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
