CREATE TABLE IF NOT EXISTS access_route_links (
  area_id uuid NOT NULL REFERENCES access_records(id) ON DELETE CASCADE,
  route_id uuid NOT NULL REFERENCES access_records(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES moderators(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (area_id, route_id),
  CONSTRAINT route_link_distinct_records CHECK (area_id <> route_id)
);
CREATE INDEX IF NOT EXISTS access_route_links_route_idx ON access_route_links(route_id);

CREATE TABLE IF NOT EXISTS route_link_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid NOT NULL REFERENCES access_records(id),
  moderator_id uuid NOT NULL REFERENCES moderators(id),
  before_route_ids uuid[] NOT NULL,
  after_route_ids uuid[] NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT route_link_event_reason CHECK (length(btrim(reason)) >= 10)
);
CREATE INDEX IF NOT EXISTS route_link_events_area_idx ON route_link_events(area_id, created_at);

CREATE OR REPLACE FUNCTION check_route_link_kinds() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM access_records WHERE id=NEW.area_id AND kind='area' AND visible) THEN
    RAISE EXCEPTION 'Route link needs a visible area record';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM access_records WHERE id=NEW.route_id AND kind='route' AND visible) THEN
    RAISE EXCEPTION 'Route link needs a visible route record';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION protect_linked_record_geometry() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (NEW.kind <> OLD.kind OR NOT ST_Equals(NEW.geometry, OLD.geometry)) AND
     EXISTS (SELECT 1 FROM access_route_links WHERE area_id=OLD.id OR route_id=OLD.id) THEN
    RAISE EXCEPTION 'Remove reviewed route links before changing a linked record geometry or kind';
  END IF;
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='access_route_links_kind_guard') THEN
    CREATE TRIGGER access_route_links_kind_guard BEFORE INSERT OR UPDATE ON access_route_links
      FOR EACH ROW EXECUTE FUNCTION check_route_link_kinds();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='access_records_link_geometry_guard') THEN
    CREATE TRIGGER access_records_link_geometry_guard BEFORE UPDATE OF kind,geometry ON access_records
      FOR EACH ROW EXECUTE FUNCTION protect_linked_record_geometry();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='route_link_events_append_only') THEN
    CREATE TRIGGER route_link_events_append_only BEFORE UPDATE OR DELETE ON route_link_events
      FOR EACH ROW EXECUTE FUNCTION block_history_mutation();
  END IF;
END $$;
