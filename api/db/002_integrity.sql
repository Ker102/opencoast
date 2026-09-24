DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='proposal_valid_geometry') THEN
    ALTER TABLE proposals ADD CONSTRAINT proposal_valid_geometry CHECK (ST_IsValid(geometry));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='record_valid_geometry') THEN
    ALTER TABLE access_records ADD CONSTRAINT record_valid_geometry CHECK (ST_IsValid(geometry));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION block_history_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Review history is append only';
END;
$$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='review_events_append_only') THEN
    CREATE TRIGGER review_events_append_only BEFORE UPDATE OR DELETE ON review_events
      FOR EACH ROW EXECUTE FUNCTION block_history_mutation();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='access_revisions_append_only') THEN
    CREATE TRIGGER access_revisions_append_only BEFORE UPDATE OR DELETE ON access_revisions
      FOR EACH ROW EXECUTE FUNCTION block_history_mutation();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='proposal_edits_append_only') THEN
    CREATE TRIGGER proposal_edits_append_only BEFORE UPDATE OR DELETE ON proposal_edits
      FOR EACH ROW EXECUTE FUNCTION block_history_mutation();
  END IF;
END $$;
