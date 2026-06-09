import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  name: text('name').notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  type: text('type').notNull(), // 'savings' | 'cost'
  amount: integer('amount').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
});
