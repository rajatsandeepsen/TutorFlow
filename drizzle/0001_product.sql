CREATE TYPE "public"."slot_status" AS ENUM('pending', 'confirmed', 'in_progress', 'cancelled', 'rejected', 'expired', 'attended');--> statement-breakpoint
CREATE TABLE "homeworks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot_id" text NOT NULL,
	"question" text NOT NULL,
	"anwser" text,
	"score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot_id" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slot" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" text NOT NULL,
	"student_id" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"topic" text NOT NULL,
	"description" text,
	"status" "slot_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profile" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"current_level" text NOT NULL,
	"learning_goals" text NOT NULL,
	"weak_areas" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."slot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."slot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot" ADD CONSTRAINT "slot_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot" ADD CONSTRAINT "slot_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "homeworks_slot_id_idx" ON "homeworks" USING btree ("slot_id");--> statement-breakpoint
CREATE INDEX "notes_slot_id_idx" ON "notes" USING btree ("slot_id");--> statement-breakpoint
CREATE INDEX "slot_teacher_status_time_idx" ON "slot" USING btree ("teacher_id","status","start_time","end_time");--> statement-breakpoint
CREATE UNIQUE INDEX "student_profile_student_teacher_unique" ON "student_profile" USING btree ("student_id","teacher_id");--> statement-breakpoint
CREATE INDEX "student_profile_subject_idx" ON "student_profile" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "student_profile_teacher_id_idx" ON "student_profile" USING btree ("teacher_id");