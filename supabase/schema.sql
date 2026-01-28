-- Pink Pollos Mood App - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Admin users (synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invite links (token_hash stored, never raw token)
CREATE TABLE IF NOT EXISTS invite_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants (team members via share link)
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  nickname TEXT,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, device_id)
);

-- Mood entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  mood SMALLINT NOT NULL CHECK (mood >= 1 AND mood <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  entry_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(participant_id, entry_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invite_links_team_id ON invite_links(team_id);
CREATE INDEX IF NOT EXISTS idx_invite_links_token_hash ON invite_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_participants_team_id ON participants(team_id);
CREATE INDEX IF NOT EXISTS idx_participants_device_id ON participants(device_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_team_id ON mood_entries(team_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_entry_date ON mood_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin users policies
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

-- Teams policies
CREATE POLICY "Admins can do everything with teams"
  ON teams FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can read teams by slug"
  ON teams FOR SELECT
  TO anon
  USING (TRUE);

-- Invite links policies
CREATE POLICY "Admins can manage invite_links"
  ON invite_links FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can read active invite_links"
  ON invite_links FOR SELECT
  TO anon
  USING (is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()));

-- Participants policies
CREATE POLICY "Admins can view all participants"
  ON participants FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Public can insert participants via RPC"
  ON participants FOR INSERT
  TO anon
  WITH CHECK (TRUE);

CREATE POLICY "Public can read own participant"
  ON participants FOR SELECT
  TO anon
  USING (TRUE);

-- Mood entries policies
CREATE POLICY "Admins can view all mood_entries"
  ON mood_entries FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Public can insert mood_entries via RPC"
  ON mood_entries FOR INSERT
  TO anon
  WITH CHECK (TRUE);

CREATE POLICY "Public can read team mood_entries"
  ON mood_entries FOR SELECT
  TO anon
  USING (TRUE);

-- ============================================
-- RPC FUNCTIONS (for public actions)
-- ============================================

-- Validate invite token and return team info
CREATE OR REPLACE FUNCTION validate_invite_token(p_token_hash TEXT)
RETURNS TABLE (
  team_id UUID,
  team_slug TEXT,
  team_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.slug, t.name
  FROM invite_links il
  JOIN teams t ON t.id = il.team_id
  WHERE il.token_hash = p_token_hash
    AND il.is_active = TRUE
    AND (il.expires_at IS NULL OR il.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get or create participant
CREATE OR REPLACE FUNCTION get_or_create_participant(
  p_team_id UUID,
  p_device_id TEXT,
  p_nickname TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_participant_id UUID;
BEGIN
  -- Try to find existing participant
  SELECT id INTO v_participant_id
  FROM participants
  WHERE team_id = p_team_id AND device_id = p_device_id;

  -- If not found, create new
  IF v_participant_id IS NULL THEN
    INSERT INTO participants (team_id, device_id, nickname)
    VALUES (p_team_id, p_device_id, p_nickname)
    RETURNING id INTO v_participant_id;
  ELSE
    -- Update nickname if provided
    IF p_nickname IS NOT NULL THEN
      UPDATE participants
      SET nickname = p_nickname
      WHERE id = v_participant_id;
    END IF;
  END IF;

  RETURN v_participant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Submit mood check-in
CREATE OR REPLACE FUNCTION submit_mood_checkin(
  p_team_id UUID,
  p_participant_id UUID,
  p_mood SMALLINT,
  p_comment TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_entry_id UUID;
  v_already_checked_in BOOLEAN;
BEGIN
  -- Check if already checked in today
  SELECT EXISTS (
    SELECT 1 FROM mood_entries
    WHERE participant_id = p_participant_id
      AND entry_date = CURRENT_DATE
  ) INTO v_already_checked_in;

  IF v_already_checked_in THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'Already checked in today'
    );
  END IF;

  -- Insert mood entry
  INSERT INTO mood_entries (team_id, participant_id, mood, comment, entry_date)
  VALUES (p_team_id, p_participant_id, p_mood, p_comment, CURRENT_DATE)
  RETURNING id INTO v_entry_id;

  RETURN json_build_object(
    'success', TRUE,
    'entry_id', v_entry_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get team mood stats for today
CREATE OR REPLACE FUNCTION get_team_mood_stats(p_team_id UUID)
RETURNS JSON AS $$
DECLARE
  v_avg_mood NUMERIC;
  v_total_entries INTEGER;
  v_mood_distribution JSON;
BEGIN
  -- Get today's stats
  SELECT
    AVG(mood)::NUMERIC(3,2),
    COUNT(*)::INTEGER
  INTO v_avg_mood, v_total_entries
  FROM mood_entries
  WHERE team_id = p_team_id
    AND entry_date = CURRENT_DATE;

  -- Get mood distribution
  SELECT json_object_agg(mood, count)
  INTO v_mood_distribution
  FROM (
    SELECT mood, COUNT(*)::INTEGER as count
    FROM mood_entries
    WHERE team_id = p_team_id
      AND entry_date = CURRENT_DATE
    GROUP BY mood
  ) sub;

  RETURN json_build_object(
    'average_mood', COALESCE(v_avg_mood, 0),
    'total_entries', COALESCE(v_total_entries, 0),
    'distribution', COALESCE(v_mood_distribution, '{}'::JSON)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get participant streak
CREATE OR REPLACE FUNCTION get_participant_streak(p_participant_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_has_entry BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM mood_entries
      WHERE participant_id = p_participant_id
        AND entry_date = v_current_date
    ) INTO v_has_entry;

    EXIT WHEN NOT v_has_entry;

    v_streak := v_streak + 1;
    v_current_date := v_current_date - INTERVAL '1 day';
  END LOOP;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get team trend (last 7 days)
CREATE OR REPLACE FUNCTION get_team_trend(p_team_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_agg(day_data ORDER BY entry_date)
    FROM (
      SELECT
        entry_date,
        json_build_object(
          'date', entry_date,
          'average', ROUND(AVG(mood)::NUMERIC, 2),
          'count', COUNT(*)
        ) as day_data
      FROM mood_entries
      WHERE team_id = p_team_id
        AND entry_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY entry_date
    ) sub
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant execute on RPC functions to anon
GRANT EXECUTE ON FUNCTION validate_invite_token TO anon;
GRANT EXECUTE ON FUNCTION get_or_create_participant TO anon;
GRANT EXECUTE ON FUNCTION submit_mood_checkin TO anon;
GRANT EXECUTE ON FUNCTION get_team_mood_stats TO anon;
GRANT EXECUTE ON FUNCTION get_participant_streak TO anon;
GRANT EXECUTE ON FUNCTION get_team_trend TO anon;
