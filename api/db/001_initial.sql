CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS moderators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moderator_sessions (
  token_hash text PRIMARY KEY,
  moderator_id uuid NOT NULL REFERENCES moderators(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_record_id uuid,
  receipt_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','clarification','approved','rejected')),
  kind text NOT NULL CHECK (kind IN ('area','route','point')),
  geometry geometry(Geometry,4326) NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  jurisdiction text NOT NULL,
  local_category text NOT NULL DEFAULT '',
  access_status text NOT NULL CHECK (access_status IN ('allowed','conditional','restricted','disputed','unknown')),
  allowed_activities jsonb NOT NULL DEFAULT '[]'::jsonb,
  conditions text NOT NULL DEFAULT '',
  land_route_status text NOT NULL DEFAULT 'not_verified',
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  observed_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  review_message text,
  CONSTRAINT proposal_valid_geometry CHECK (ST_IsValid(geometry)),
  CONSTRAINT proposal_geometry_kind CHECK (
    (kind = 'point' AND GeometryType(geometry) = 'POINT') OR
    (kind = 'route' AND GeometryType(geometry) = 'LINESTRING') OR
    (kind = 'area' AND GeometryType(geometry) = 'POLYGON')
  )
);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON proposals(status, created_at);
CREATE INDEX IF NOT EXISTS proposals_geom_idx ON proposals USING gist(geometry);

CREATE TABLE IF NOT EXISTS access_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revision integer NOT NULL DEFAULT 1,
  kind text NOT NULL CHECK (kind IN ('area','route','point')),
  geometry geometry(Geometry,4326) NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  jurisdiction text NOT NULL,
  local_category text NOT NULL DEFAULT '',
  access_status text NOT NULL CHECK (access_status IN ('allowed','conditional','restricted','disputed','unknown')),
  allowed_activities jsonb NOT NULL DEFAULT '[]'::jsonb,
  conditions text NOT NULL DEFAULT '',
  land_route_status text NOT NULL DEFAULT 'not_verified',
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  observed_at date,
  evidence_level text NOT NULL CHECK (evidence_level IN ('document_backed','community_reviewed')),
  geometry_precision text NOT NULL DEFAULT 'approximate' CHECK (geometry_precision IN ('approximate','surveyed')),
  moderator_explanation text NOT NULL,
  last_edited_at timestamptz NOT NULL,
  last_reviewed_at timestamptz,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT record_valid_geometry CHECK (ST_IsValid(geometry)),
  CONSTRAINT record_geometry_kind CHECK (
    (kind = 'point' AND GeometryType(geometry) = 'POINT') OR
    (kind = 'route' AND GeometryType(geometry) = 'LINESTRING') OR
    (kind = 'area' AND GeometryType(geometry) = 'POLYGON')
  ),
  CONSTRAINT backed_needs_official_source CHECK (
    evidence_level <> 'document_backed' OR sources @> '[{"kind":"official"}]'::jsonb
  )
);
ALTER TABLE proposals DROP CONSTRAINT IF EXISTS proposals_target_record_id_fkey;
ALTER TABLE proposals ADD CONSTRAINT proposals_target_record_id_fkey FOREIGN KEY (target_record_id) REFERENCES access_records(id);
CREATE INDEX IF NOT EXISTS access_records_geom_idx ON access_records USING gist(geometry) WHERE visible;
CREATE INDEX IF NOT EXISTS access_records_visible_idx ON access_records(visible);

CREATE TABLE IF NOT EXISTS access_revisions (
  record_id uuid NOT NULL REFERENCES access_records(id) ON DELETE CASCADE,
  revision integer NOT NULL,
  snapshot jsonb NOT NULL,
  edited_at timestamptz NOT NULL,
  proposal_id uuid REFERENCES proposals(id),
  PRIMARY KEY (record_id, revision)
);

CREATE TABLE IF NOT EXISTS proposal_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  original_name text NOT NULL,
  content_type text NOT NULL,
  byte_size integer NOT NULL CHECK (byte_size > 0 AND byte_size <= 10485760),
  publish_consent boolean NOT NULL DEFAULT false,
  private_key text NOT NULL UNIQUE,
  public_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS proposal_evidence_proposal_idx ON proposal_evidence(proposal_id);

CREATE TABLE IF NOT EXISTS review_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id),
  moderator_id uuid NOT NULL REFERENCES moderators(id),
  action text NOT NULL CHECK (action IN ('approve','reject','clarification','edit')),
  explanation text NOT NULL,
  evidence_level text,
  reviewed_sources boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS proposal_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('contributor','moderator')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS proposal_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id),
  moderator_id uuid NOT NULL REFERENCES moderators(id),
  before jsonb NOT NULL,
  after jsonb NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jurisdiction_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  reviewed_at timestamptz NOT NULL,
  visible boolean NOT NULL DEFAULT false
);
