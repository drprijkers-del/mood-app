-- ============================================
-- UPDATE BACKLOG: Clear old items, add remaining tasks
-- Run this in Supabase SQL Editor
-- ============================================

-- First, mark all existing items as decided/done (or delete them)
-- Using soft-delete approach: mark as 'decided' with 'not_doing' for shipped items
UPDATE backlog_items
SET status = 'decided',
    decision = 'not_doing',
    rationale_en = 'Shipped or superseded',
    rationale_nl = 'Shipped or superseded',
    decided_at = NOW()
WHERE status != 'decided';

-- Alternatively, if you want to hard delete all and start fresh:
-- DELETE FROM backlog_items;

-- Insert remaining backlog items
INSERT INTO backlog_items (product, category, status, title_en, title_nl, source_en, source_nl, our_take_en, our_take_nl, reviewed_at) VALUES

-- High Priority
('shared', 'features', 'exploring',
 'Run SQL migration for performance boost',
 'SQL migratie uitvoeren voor snelheidsboost',
 'Performance optimization deployed with fallback',
 'Performance optimalisatie deployed met fallback',
 'Run supabase/migrations/001_team_stats.sql to enable fast team stats loading (60+ queries → 3 queries)',
 'Voer supabase/migrations/001_team_stats.sql uit om snelle team stats te activeren (60+ queries → 3 queries)',
 CURRENT_DATE),

-- Medium Priority
('shared', 'features', 'review',
 'Feedback persistence - save to database',
 'Feedback persistentie - opslaan in database',
 'Feedback tool is currently UI-only preview',
 'Feedback tool is momenteel alleen UI preview',
 'Create feedback table and wire up the FeedbackTool component to actually save feedback',
 'Maak feedback tabel en koppel de FeedbackTool component om daadwerkelijk feedback op te slaan',
 CURRENT_DATE),

('shared', 'analytics', 'review',
 'Delta tensions in coach questions',
 'Delta spanningen in coach vragen',
 'Coach questions generator has hardcoded empty tensions array',
 'Coach vragen generator heeft hardcoded lege spanningen array',
 'Pull actual tension data from recent Delta sessions to make coaching questions more contextual',
 'Haal echte spanning data uit recente Delta sessies om coaching vragen contextueler te maken',
 CURRENT_DATE),

-- Low Priority / Future
('shared', 'analytics', 'review',
 'Historical charts - Pulse/Delta over time',
 'Historische grafieken - Pulse/Delta over tijd',
 'Users want to see trends visually',
 'Gebruikers willen trends visueel zien',
 'Add line charts showing mood and Delta scores over weeks/months',
 'Voeg lijn grafieken toe die stemming en Delta scores over weken/maanden tonen',
 CURRENT_DATE),

('shared', 'analytics', 'review',
 'Team comparison - side by side',
 'Team vergelijking - naast elkaar',
 'Coaches managing multiple teams want to compare',
 'Coaches die meerdere teams beheren willen vergelijken',
 'Dashboard view comparing 2+ teams on key metrics',
 'Dashboard view die 2+ teams vergelijkt op belangrijke metrics',
 CURRENT_DATE),

('shared', 'features', 'review',
 'Notification system - alerts on low scores',
 'Notificatie systeem - waarschuwingen bij lage scores',
 'Proactive alerting for team health',
 'Proactieve waarschuwingen voor team gezondheid',
 'Email or in-app notifications when Pulse drops below threshold or Delta shows concerning patterns',
 'Email of in-app notificaties wanneer Pulse onder drempel zakt of Delta zorgwekkende patronen toont',
 CURRENT_DATE),

('shared', 'ux', 'review',
 'OverallSignal dashboard widget',
 'OverallSignal dashboard widget',
 'Cross-tool health indicator',
 'Cross-tool gezondheids indicator',
 'Combined Pulse + Delta health score on team cards and dashboard',
 'Gecombineerde Pulse + Delta gezondheids score op team kaarten en dashboard',
 CURRENT_DATE);

-- ============================================
-- RELEASE NOTES: Add today's shipped features
-- ============================================

INSERT INTO release_notes (product, version, title_en, title_nl, description_en, description_nl, changes, released_at) VALUES

('shared', '0.4.0',
 'Phase 3: Coach-Grade Analytics & Performance',
 'Fase 3: Coach-Grade Analytics & Performance',
 'Major update with Delta trends, session comparison, coaching tools, and a significant performance optimization.',
 'Grote update met Delta trends, sessie vergelijking, coaching tools, en een significante performance optimalisatie.',
 '[
   {"en": "Delta trend indicators on team cards (up/down/stable arrows)", "nl": "Delta trend indicatoren op team kaarten (omhoog/omlaag/stabiel pijlen)"},
   {"en": "Session comparison tool - compare two Delta sessions side-by-side", "nl": "Sessie vergelijking tool - vergelijk twee Delta sessies naast elkaar"},
   {"en": "Contextual coaching questions generator based on team data", "nl": "Contextuele coaching vragen generator gebaseerd op team data"},
   {"en": "Feedback tool with appreciation/suggestion/concern types", "nl": "Feedback tool met waardering/suggestie/zorg types"},
   {"en": "CSV export for Pulse data", "nl": "CSV export voor Pulse data"},
   {"en": "Performance optimization: team loading 20x faster (after migration)", "nl": "Performance optimalisatie: team laden 20x sneller (na migratie)"}
 ]'::jsonb,
 CURRENT_DATE);

-- Show what we inserted
SELECT title_en, status, category FROM backlog_items WHERE status != 'decided' ORDER BY category;
SELECT version, title_en, released_at FROM release_notes ORDER BY released_at DESC LIMIT 3;
