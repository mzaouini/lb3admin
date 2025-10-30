import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

// Import existing schema from main app (we'll connect to same database)
// These are the existing tables - DO NOT MODIFY
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const kycStatusEnum = pgEnum("kyc_status", ["pending", "in_progress", "verified", "rejected"]);
export const salaryAdvanceStatusEnum = pgEnum("salary_advance_status", ["pending", "approved", "disbursed", "repaid", "rejected"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["salary_advance", "repayment", "fee", "transfer"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed"]);
export const cardStatusEnum = pgEnum("card_status", ["active", "locked", "expired"]);

// Existing tables from main app
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  nationalId: varchar("national_id", { length: 50 }),
  company: varchar("company", { length: 255 }),
  netSalary: integer("net_salary"),
  currency: varchar("currency", { length: 3 }).default("MAD").notNull(),
  kycStatus: kycStatusEnum("kyc_status").default("pending").notNull(),
  kycCompletedAt: timestamp("kyc_completed_at"),
  pin: varchar("pin", { length: 255 }),
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: varchar("city", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 100 }).default("Morocco"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export const bankAccounts = pgTable("bank_accounts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountTitle: varchar("account_title", { length: 255 }).notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  iban: varchar("iban", { length: 34 }),
  isDefault: integer("is_default").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const salaryAdvances = pgTable("salary_advances", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  serviceFee: integer("service_fee").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: salaryAdvanceStatusEnum("status").default("pending").notNull(),
  bankAccountId: integer("bank_account_id").references(() => bankAccounts.id),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  disbursedAt: timestamp("disbursed_at"),
  repaidAt: timestamp("repaid_at"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  salaryAdvanceId: integer("salary_advance_id").references(() => salaryAdvances.id),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  status: transactionStatusEnum("status").default("pending").notNull(),
  description: text("description"),
  referenceNumber: varchar("reference_number", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const cards = pgTable("cards", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  cardNumber: varchar("card_number", { length: 19 }).notNull(),
  cardholderName: varchar("cardholder_name", { length: 255 }).notNull(),
  expiryMonth: integer("expiry_month").notNull(),
  expiryYear: integer("expiry_year").notNull(),
  cvv: varchar("cvv", { length: 4 }),
  cardType: varchar("card_type", { length: 50 }).default("virtual").notNull(),
  status: cardStatusEnum("status").default("active").notNull(),
  balance: integer("balance").default(0).notNull(),
  dailyLimit: integer("daily_limit"),
  monthlyLimit: integer("monthly_limit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== NEW ADMIN-SPECIFIC TABLES (ADDITIVE ONLY) =====

/**
 * Admin user roles enum
 */
export const adminRoleEnum = pgEnum("admin_role", ["maker", "checker", "support", "super_admin"]);

/**
 * Admin users table - separate from regular users
 */
export const adminUsers = pgTable("admin_users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(), // Hashed
  role: adminRoleEnum("role").default("support").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

/**
 * Audit logs for admin actions
 */
export const auditLogs = pgTable("audit_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  adminUserId: integer("admin_user_id").references(() => adminUsers.id),
  action: varchar("action", { length: 255 }).notNull(), // e.g., "approve_advance", "add_employee"
  entityType: varchar("entity_type", { length: 100 }).notNull(), // e.g., "salary_advance", "user"
  entityId: integer("entity_id"),
  details: text("details"), // JSON string with additional details
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Organizations/Companies table
 */
export const organizations = pgTable("organizations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).unique(),
  parentOrganizationId: integer("parent_organization_id").references(() => organizations.id),
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  address: text("address"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

/**
 * System settings/configuration
 */
export const systemSettings = pgTable("system_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: integer("updated_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = typeof bankAccounts.$inferInsert;
export type SalaryAdvance = typeof salaryAdvances.$inferSelect;
export type InsertSalaryAdvance = typeof salaryAdvances.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;
