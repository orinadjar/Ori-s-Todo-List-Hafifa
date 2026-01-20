CREATE TYPE "public"."todo_subject" AS ENUM('Work', 'Personal', 'Military', 'Urgent', 'General');--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"subject" "todo_subject" NOT NULL,
	"priority" integer NOT NULL,
	"date" timestamp NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL
);
