CREATE TABLE "sub_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(64) DEFAULT 'PENDING',
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sub_tasks" ADD CONSTRAINT "sub_tasks_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_sub_tasks_task_id" ON "sub_tasks" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "idx_sub_tasks_title" ON "sub_tasks" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_sub_tasks_status" ON "sub_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_sub_tasks_due_date" ON "sub_tasks" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "idx_sub_tasks_created_at" ON "sub_tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_sub_tasks_updated_at" ON "sub_tasks" USING btree ("updated_at");