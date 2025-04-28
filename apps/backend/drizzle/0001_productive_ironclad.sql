CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"team_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(64) DEFAULT 'PENDING',
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_notifications_user_id" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_is_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_notifications_created_at" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_updated_at" ON "notifications" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_id" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_team_id" ON "tasks" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_title" ON "tasks" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_tasks_status" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_tasks_due_date" ON "tasks" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "idx_tasks_created_at" ON "tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_tasks_updated_at" ON "tasks" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_teams_name" ON "teams" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_teams_created_at" ON "teams" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_teams_updated_at" ON "teams" USING btree ("updated_at");