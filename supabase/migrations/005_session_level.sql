-- ============================================
-- MIGRATION 005: Add level to sessions
-- ============================================
-- Each session stores the Shu-Ha-Ri level it was run at
-- This determines which statements were used for that session

-- Add level column to delta_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'delta_sessions' AND column_name = 'level'
  ) THEN
    ALTER TABLE delta_sessions ADD COLUMN level TEXT DEFAULT 'shu' CHECK (level IN ('shu', 'ha', 'ri'));
  END IF;
END $$;

-- Backfill existing sessions: set level to 'shu' for all existing sessions
-- (They were created before levels existed, so they used Shu-level questions)
UPDATE delta_sessions SET level = 'shu' WHERE level IS NULL;

-- Index for filtering sessions by level
CREATE INDEX IF NOT EXISTS idx_delta_sessions_level ON delta_sessions(level);
CREATE INDEX IF NOT EXISTS idx_delta_sessions_team_level ON delta_sessions(team_id, level);
