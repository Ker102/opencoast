-- The app uses direct PostgreSQL connections. Supabase's generated Data API must
-- not expose private proposals, receipts, sessions, or evidence metadata.
DO $$
DECLARE
  api_roles text;
BEGIN
  SELECT string_agg(quote_ident(rolname), ', ')
    INTO api_roles
    FROM pg_roles
   WHERE rolname IN ('anon', 'authenticated', 'service_role');

  IF api_roles IS NOT NULL THEN
    EXECUTE format('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s', api_roles);
    EXECUTE format('REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM %s', api_roles);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM %s', api_roles);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %s', api_roles);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM %s', api_roles);
  END IF;

  EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC';
END $$;
