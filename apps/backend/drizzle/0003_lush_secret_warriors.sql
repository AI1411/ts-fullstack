CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_chat_messages_chat_id" ON "chat_messages" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_sender_id" ON "chat_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_is_read" ON "chat_messages" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_created_at" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_updated_at" ON "chat_messages" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_chats_creator_id" ON "chats" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "idx_chats_recipient_id" ON "chats" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "idx_chats_created_at" ON "chats" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_chats_updated_at" ON "chats" USING btree ("updated_at");