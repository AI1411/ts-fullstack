CREATE TABLE "invoices" (
  "id" serial PRIMARY KEY NOT NULL,
  "order_id" integer REFERENCES "orders"("id") ON DELETE SET NULL,
  "invoice_number" varchar(50) NOT NULL,
  "issue_date" timestamp DEFAULT now() NOT NULL,
  "due_date" timestamp,
  "total_amount" integer NOT NULL,
  "status" varchar(50) DEFAULT 'PENDING' NOT NULL,
  "payment_method" varchar(50),
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_invoices_order_id" ON "invoices" USING btree ("order_id");
--> statement-breakpoint
CREATE INDEX "idx_invoices_invoice_number" ON "invoices" USING btree ("invoice_number");
--> statement-breakpoint
CREATE INDEX "idx_invoices_issue_date" ON "invoices" USING btree ("issue_date");
--> statement-breakpoint
CREATE INDEX "idx_invoices_due_date" ON "invoices" USING btree ("due_date");
--> statement-breakpoint
CREATE INDEX "idx_invoices_status" ON "invoices" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "idx_invoices_created_at" ON "invoices" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "idx_invoices_updated_at" ON "invoices" USING btree ("updated_at");