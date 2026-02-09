-- Extended trend function: parameterized version of get_team_trend
-- Free teams get 14 days (7 + 7 previous), Pro teams get up to 60 days (30 + 30 previous)
CREATE OR REPLACE FUNCTION get_team_trend_extended(p_team_id UUID, p_days INTEGER DEFAULT 14)
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
        AND entry_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      GROUP BY entry_date
    ) sub
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
