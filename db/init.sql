-- Bourges Télévision — Planning collaboratif
-- Schéma initial PostgreSQL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────
--  Plannings
-- ────────────────────────────────────────────────
CREATE TABLE plannings (
  id           TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name         VARCHAR(255) NOT NULL,
  start_year   SMALLINT    NOT NULL,
  start_month  SMALLINT    NOT NULL CHECK (start_month BETWEEN 0 AND 11),
  month_count  SMALLINT    NOT NULL CHECK (month_count >= 1),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
--  Événements
--  id = BIGINT pour compatibilité avec Date.now() côté frontend
-- ────────────────────────────────────────────────
CREATE TABLE events (
  id          BIGINT       PRIMARY KEY,
  planning_id TEXT         NOT NULL REFERENCES plannings(id) ON DELETE CASCADE,
  type        VARCHAR(16)  NOT NULL CHECK (type IN ('fixed', 'tournage', 'uncertain', 'task')),
  text        VARCHAR(512) NOT NULL,
  month       SMALLINT     NOT NULL,
  pos         NUMERIC(6,4) NOT NULL,
  dur         NUMERIC(6,4),                -- NULL pour fixed et tournage
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX events_planning_id_idx ON events (planning_id);

-- ────────────────────────────────────────────────
--  Trigger auto-update updated_at
-- ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plannings_updated_at
  BEFORE UPDATE ON plannings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────
--  Planning par défaut (migration depuis localStorage)
-- ────────────────────────────────────────────────
INSERT INTO plannings (id, name, start_year, start_month, month_count)
VALUES ('default', 'Planning BTV 2026', 2026, 3, 8)
ON CONFLICT (id) DO NOTHING;
