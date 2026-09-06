CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'slot_no_overlap_teacher_active'
	) THEN
	ALTER TABLE slot
		ADD CONSTRAINT slot_no_overlap_teacher_active
		EXCLUDE USING gist (
			teacher_id WITH =,
			tstzrange(start_time, end_time, '[)') WITH &&
		)
		WHERE (status IN ('pending', 'confirmed', 'in_progress'));
	END IF;
END $$;
