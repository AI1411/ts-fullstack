CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(64) DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_todos_user_id" ON "todos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_todos_title" ON "todos" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_todos_status" ON "todos" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_todos_created_at" ON "todos" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_todos_updated_at" ON "todos" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_users_name" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_updated_at" ON "users" USING btree ("updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "email_unique" ON "users" USING btree ("email");