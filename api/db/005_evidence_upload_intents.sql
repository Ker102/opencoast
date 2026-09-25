CREATE TABLE IF NOT EXISTS evidence_upload_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  original_name text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('image/jpeg','image/png','image/webp','application/pdf')),
  declared_byte_size integer NOT NULL CHECK (declared_byte_size > 0 AND declared_byte_size <= 10485760),
  publish_consent boolean NOT NULL,
  staging_key text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  final_evidence_id uuid UNIQUE REFERENCES proposal_evidence(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS evidence_upload_intents_proposal_idx
  ON evidence_upload_intents(proposal_id, expires_at);

-- Migration 004 intentionally closed every existing table. Close this new table
-- too for Supabase's generated API roles when they exist.
DO $$
DECLARE api_roles text;
BEGIN
  SELECT string_agg(quote_ident(rolname), ', ')
    INTO api_roles FROM pg_roles
   WHERE rolname IN ('anon', 'authenticated', 'service_role');
  IF api_roles IS NOT NULL THEN
    EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE evidence_upload_intents FROM %s', api_roles);
  END IF;
END $$;
