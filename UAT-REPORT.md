# TEAM LAB — FULL PLATFORM USER ACCEPTANCE TEST (UAT)

**Date:** 2026-02-01
**Version:** Post-theme cleanup (Breaking Bad references removed)
**Prepared by:** Claude (Senior QA Lead / Product Manager / UX Researcher)

---

## PART A — TEST PERSONAS

### Persona 1: Marieke — Scrum Master

| Attribute | Details |
|-----------|---------|
| **Role & Context** | Scrum Master for a single development team (7 people) at a mid-size Dutch company. Team has been together 8 months. |
| **Experience Level** | 3 years as SM, certified PSM II. Comfortable with tooling but skeptical of "yet another dashboard." |
| **Goal with this tool** | Get a lightweight pulse on team morale without adding ceremony. Wants to spot issues before they escalate to retros. |
| **What makes her skeptical** | "Will this become another thing I have to maintain?" / "Will the team actually use it?" / "Is it really anonymous?" |
| **What would make her say "this is useful"** | If she can share a link, get signals within a day, and have something concrete to discuss in 1-on-1s or retros — without configuring anything. |

### Persona 2: Erik — Agile Coach

| Attribute | Details |
|-----------|---------|
| **Role & Context** | External Agile Coach supporting 4 teams across 2 departments. Hired for a 6-month engagement to improve flow and collaboration. |
| **Experience Level** | 8 years coaching, SAFe SPC, former developer. Has seen many tools come and go. |
| **Goal with this tool** | Compare team health across his portfolio. Identify which team needs attention this week. Have data to back up his observations to leadership. |
| **What makes him skeptical** | "Does this actually measure anything real?" / "Will leadership misuse this as a performance metric?" / "Is this just a mood survey with extra steps?" |
| **What would make him say "this is useful"** | If Delta gives him sharp, observable statements he can use in coaching conversations. If "needs attention" correlates with what he's seeing on the ground. |

### Persona 3: Lisa — Team Member

| Attribute | Details |
|-----------|---------|
| **Role & Context** | Backend developer, 2 years at the company. Part of Marieke's team. Not particularly engaged with Agile tooling. |
| **Experience Level** | Junior-mid level. Does her work, attends ceremonies, but doesn't initiate process improvements. |
| **Goal with this tool** | Minimal friction. If she has to use it, it should take seconds. Wants to feel heard without having to speak up in meetings. |
| **What makes her skeptical** | "Is this really anonymous or will my manager see my comments?" / "Why do I need another app?" / "Will anything actually change based on this?" |
| **What would make her say "this is useful"** | If she can express a bad day in 2 seconds and see that the team average reflects reality. If her context comments lead to actual retro discussions. |

---

## PART B — FULL PLATFORM WALKTHROUGH (PER PERSONA)

### MARIEKE (Scrum Master) — Full Walkthrough

#### 1. Landing Page & First Impression

**What she sees:** Clean landing page with "Team Lab" branding, three feature cards (Pulse, Delta, Data-driven), CTA to teams dashboard.

| Aspect | Assessment |
|--------|------------|
| **Clear** | The value proposition is visible. "Sense what's happening" resonates. |
| **Confusing** | "Pink Pollos" branding at bottom — unclear if this is a company or product name. |
| **Unfinished** | No pricing, no "how it works" section, no social proof. |
| **Blocks confident usage** | Nothing blocking — but also nothing that builds urgency to try it. |

#### 2. Creating a Team

**Flow:** Clicks "Naar je teams" → Login (passwordless) → Teams list → "Nieuw team"

| Aspect | Assessment |
|--------|------------|
| **Clear** | Form is minimal (name, description, size). Auto-enables both tools. |
| **Confusing** | "Expected team size" — is this for calculations? What happens if I get it wrong? |
| **Unfinished** | No team import, no Slack/Teams integration for invites. |
| **Blocks confident usage** | Nothing blocking. Simple enough to just try. |

#### 3. Understanding What the Tool Is and Is Not

| Aspect | Assessment |
|--------|------------|
| **Clear** | Pulse = daily signal. Delta = focused sessions. The tabs make this obvious. |
| **Confusing** | The relationship between Pulse and Delta is not explained. Are they connected? Do they inform each other? |
| **Unfinished** | No "About" or "How to use" help section. |
| **Blocks confident usage** | Marieke can figure it out, but she wishes there was a 30-second video. |

#### 4. Using Pulse

**Flow:** Goes to Pulse tab → Copies share link → Opens in incognito → Submits test check-in

| Aspect | Assessment |
|--------|------------|
| **Clear** | The check-in is delightfully simple. 1-5, optional comment, submit. 2 seconds. |
| **Confusing** | Scale labels are just numbers (1-5). No hint what they mean. The old "purity" labels are gone — but nothing replaced them. |
| **Unfinished** | No way to see individual responses (by design, but Marieke doesn't know that). |
| **Blocks confident usage** | The privacy notice ("never shared with HR") is reassuring. She feels comfortable sharing the link. |

**Interpreting Results:**
| Aspect | Assessment |
|--------|------------|
| **Clear** | Zone labels (Excellent/Good/Attention/Critical) are helpful. Trend arrows work. |
| **Confusing** | "Confidence: Low" — what does this mean? Not enough data? Conflicting signals? |
| **Unfinished** | No export to Slack/Teams. Manual copy-paste needed for retros. |
| **Blocks confident usage** | She wants to know: "What's a normal score for a healthy team?" No benchmark provided. |

#### 5. Using Delta

**Flow:** Delta tab → New Session → Picks "Scrum" angle → Shares link with team

| Aspect | Assessment |
|--------|------------|
| **Clear** | The angle picker is excellent. Descriptions help her choose. |
| **Confusing** | After creating session, she's on a page that says "Waiting for responses" but the link isn't prominently displayed. She has to scroll to find it. |
| **Unfinished** | No way to schedule a session or set a deadline. |
| **Blocks confident usage** | None — the flow works. |

**Synthesis (after 3+ responses):**
| Aspect | Assessment |
|--------|------------|
| **Clear** | Statement breakdown is immediately useful. She can see which statements are tensions. |
| **Confusing** | "Disagreement" badge — high disagreement could mean the team is split OR that one person is an outlier. No way to tell. |
| **Unfinished** | No AI-generated talking points (promised in UI, not always visible). |
| **Blocks confident usage** | The "Close Session" modal asks for experiment/owner/follow-up — this is great, forces intentionality. |

#### 6. Team Status ("Needs Attention")

| Aspect | Assessment |
|--------|------------|
| **Clear** | Red dot with "Needs Attention" is visible. Tooltip now explains: "Score below 2.5 or declining trend." |
| **Confusing** | Nothing confusing after the recent fix. |
| **Unfinished** | No notification when a team enters "needs attention" state. |
| **Blocks confident usage** | None. |

#### 7. Settings

| Aspect | Assessment |
|--------|------------|
| **Clear** | Tool toggles work. Danger zone is appropriately scary. |
| **Confusing** | "Team ID" and "Team Slug" shown — but why would Marieke need these? |
| **Unfinished** | No team member management (add/remove people). |
| **Blocks confident usage** | None. |

#### 8. Future Capabilities (Modules Tab)

| Aspect | Assessment |
|--------|------------|
| **Clear** | "Coming Soon" badges set expectations. |
| **Confusing** | Nothing confusing. |
| **Unfinished** | By design. |
| **Blocks confident usage** | None — but also no way to express interest or get notified. |

#### 9. Backlog

| Aspect | Assessment |
|--------|------------|
| **Clear** | Public backlog builds trust. She can see what's planned. |
| **Confusing** | Nothing confusing. |
| **Unfinished** | No voting or commenting on items yet. |
| **Blocks confident usage** | None. |

#### 10. Mobile Experience

**Test:** Opens Pulse link on iPhone

| Aspect | Assessment |
|--------|------------|
| **Clear** | Check-in works perfectly. Touch targets are good. |
| **Confusing** | Nothing confusing. |
| **Unfinished** | Admin dashboard is usable but cramped on mobile. |
| **Blocks confident usage** | None for team members. Admin tasks better on desktop. |

---

### ERIK (Agile Coach) — Full Walkthrough

#### 1. Landing Page & First Impression

| Aspect | Assessment |
|--------|------------|
| **Clear** | Erik immediately gets that this is a sensing tool, not a survey platform. |
| **Confusing** | No mention of multi-team support. He wonders: "Can I see all my teams at once?" |
| **Unfinished** | No enterprise/coach pricing tier visible. |
| **Blocks confident usage** | Nothing blocking initial trial. |

#### 2. Creating/Selecting Teams

**Flow:** Creates 4 teams for his portfolio

| Aspect | Assessment |
|--------|------------|
| **Clear** | Teams list shows all teams with quick stats. Filter by "Needs Attention" is exactly what he wants. |
| **Confusing** | No way to group teams by department or tag them. |
| **Unfinished** | No portfolio view or cross-team comparison dashboard. |
| **Blocks confident usage** | He can work around it, but this is a gap for his use case. |

#### 3. Using Pulse (Multi-Team)

| Aspect | Assessment |
|--------|------------|
| **Clear** | Each team has its own Pulse. He can compare by opening tabs. |
| **Confusing** | No way to see all teams' Pulse scores on one screen. |
| **Unfinished** | No export of all teams' data for leadership reporting. |
| **Blocks confident usage** | For pilot, acceptable. For go-live with leadership reporting, this is a gap. |

#### 4. Using Delta (Multi-Team)

| Aspect | Assessment |
|--------|------------|
| **Clear** | He loves the sharp statements. "These are things I can actually observe." |
| **Confusing** | Can't run the same Delta angle across all teams simultaneously for comparison. |
| **Unfinished** | No "portfolio Delta" view. |
| **Blocks confident usage** | Acceptable for pilot — each team is different anyway. |

#### 5. "Needs Attention" Interpretation

| Aspect | Assessment |
|--------|------------|
| **Clear** | The explanation tooltip is now clear. He knows what triggers it. |
| **Confusing** | He wonders: "What if Pulse is fine but Delta shows tensions?" The two aren't connected. |
| **Unfinished** | No combined health score across Pulse + Delta. |
| **Blocks confident usage** | None for pilot. |

#### 6. Leadership/Reporting

| Aspect | Assessment |
|--------|------------|
| **Clear** | N/A — not built yet. |
| **Confusing** | The "Leadership" module is locked. No ETA visible. |
| **Unfinished** | By design. |
| **Blocks confident usage** | Erik needs to export CSVs manually and build his own reports. Acceptable for pilot. |

---

### LISA (Team Member) — Full Walkthrough

#### 1. First Encounter with Pulse Link

**Flow:** Receives `/t/awesome-team` link from Marieke via Slack

| Aspect | Assessment |
|--------|------------|
| **Clear** | Link opens directly to check-in. No login. Beautiful. |
| **Confusing** | Nothing confusing. |
| **Unfinished** | No Slack integration (would be nice to check in directly from Slack). |
| **Blocks confident usage** | None. This is exactly the friction level she wants: zero. |

#### 2. Submitting a Check-in

| Aspect | Assessment |
|--------|------------|
| **Clear** | 5 buttons. Pick one. Optional comment. Done. |
| **Confusing** | The 1-5 scale has no labels. Is 1 bad? Is 5 good? She assumes based on order. |
| **Unfinished** | No confirmation email or receipt (not needed, but she wonders if it worked). |
| **Blocks confident usage** | The success screen confirms it worked. Privacy notice is reassuring. |

#### 3. Success Screen

| Aspect | Assessment |
|--------|------------|
| **Clear** | Sees her mood, streak, team average. Simple and friendly. |
| **Confusing** | "Team today: 3.8 average" — she wonders: "Who else submitted? Is that good?" |
| **Unfinished** | No way to see history of her own submissions. |
| **Blocks confident usage** | None. |

#### 4. Repeat Visit (Already Checked In)

**Flow:** Clicks link again same day

| Aspect | Assessment |
|--------|------------|
| **Clear** | "Already recorded today" message is clear. |
| **Confusing** | Nothing confusing. |
| **Unfinished** | Nothing unfinished. |
| **Blocks confident usage** | None. |

#### 5. Delta Participation

**Flow:** Receives Delta session link from Marieke

| Aspect | Assessment |
|--------|------------|
| **Clear** | Statements are clear and specific. 1-5 scale makes sense here. |
| **Confusing** | Some statements feel similar. She wonders: "Did I already answer this?" |
| **Unfinished** | No progress indicator (3/10 statements done). |
| **Blocks confident usage** | None — she completes it in 2 minutes. |

#### 6. Seeing Results

| Aspect | Assessment |
|--------|------------|
| **Clear** | Lisa has no access to results. Only Marieke (admin) does. |
| **Confusing** | She wonders: "What happened to my input? Will I ever see the results?" |
| **Unfinished** | No team-visible summary or outcome sharing. |
| **Blocks confident usage** | This is a trust gap. If she never sees results, she'll stop participating. |

---

## PART C — ACCEPTANCE CRITERIA CHECK

### 1. Usability

| Criterion | Assessment | Score |
|-----------|------------|-------|
| Can this be used without verbal explanation? | Pulse: Yes. Delta: Mostly (angle picker needs 30 seconds to understand). Admin dashboard: Needs brief orientation. | 🟢 |
| Are next steps always clear? | Usually. Getting Started Checklist helps. Some dead ends exist (e.g., after closing session, what's next?). | 🟡 |

### 2. Focus & Scope

| Criterion | Assessment | Score |
|-----------|------------|-------|
| Is it clear what is in scope now vs later? | Yes. Tabs structure + "Coming Soon" badges communicate this well. | 🟢 |
| Do future features create desire without distraction? | Mostly. Premium modules are visible but not pushy. | 🟢 |

### 3. Trust

| Criterion | Assessment | Score |
|-----------|------------|-------|
| Do signals feel meaningful? | Yes. The simplicity of 1-5 and the zone labels create meaning without false precision. | 🟢 |
| Is "needs attention" understandable and justified? | Yes, after recent tooltip improvement. Clear threshold explanation. | 🟢 |
| Does the backlog build confidence rather than doubt? | Yes. Transparency about what's planned is trust-building. | 🟢 |
| Is anonymity credible? | Mostly. New privacy notice helps. But power users might wonder about device IDs. | 🟡 |

### 4. Mobile Experience

| Criterion | Assessment | Score |
|-----------|------------|-------|
| Are interactions reliable? | Yes. Touch targets adequate. Forms work. | 🟢 |
| Are touch targets usable? | Yes. 56px buttons on check-in. | 🟢 |
| Is critical information accessible? | Yes for team members. Admin dashboard is cramped but usable. | 🟡 |

---

## PART D — GO / NO-GO VERDICT

### Marieke (Scrum Master): **CONDITIONAL GO**

**Top 3 Reasons:**
1. ✅ Pulse is exactly what she needs — zero-friction daily sensing
2. ✅ Delta gives her concrete talking points for retros
3. ⚠️ She needs to manually communicate results to the team (no team-visible summary)

**Condition:** She will pilot this, but will need to create her own process for sharing Delta results with the team.

---

### Erik (Agile Coach): **CONDITIONAL GO**

**Top 3 Reasons:**
1. ✅ Sharp statements in Delta are coaching gold
2. ✅ "Needs Attention" filter helps him prioritize
3. ⚠️ No portfolio view or cross-team reporting — he'll need to build his own

**Condition:** Acceptable for pilot with 2-4 teams. For enterprise rollout with leadership reporting, needs portfolio features.

---

### Lisa (Team Member): **GO**

**Top 3 Reasons:**
1. ✅ 2-second check-in is respectful of her time
2. ✅ Privacy notice addresses her main concern
3. ✅ Delta statements are clear and answerable

**Concern:** She may disengage if she never sees results from her participation.

---

### OVERALL PLATFORM VERDICT: **CONDITIONAL GO FOR PILOT**

**Is this ready for a first real pilot?**
**YES** — with clear expectations set.

**What must be fixed before go-live?**
1. Add labels to 1-5 Pulse scale (currently just numbers, no semantic meaning)
2. Provide way to share Delta results with team (not just admin)
3. Add progress indicator to Delta participation flow

**What can safely wait?**
- Portfolio/cross-team view
- Slack/Teams integration
- Leadership reporting module
- Team member management
- Notification system

---

## PART E — PRIORITIZED UAT IMPROVEMENT BACKLOG

| # | Description | Persona(s) | Category | Severity |
|---|-------------|------------|----------|----------|
| 1 | **Add semantic labels to 1-5 Pulse scale** — Currently just numbers. Add subtle labels like "Rough day" to "Great day" or similar. | Lisa, Marieke | UX/Copy | **Blocker** |
| 2 | **Team-visible Delta results summary** — Team members should see outcomes of sessions they participated in, at minimum the focus area and experiment decided. | Lisa, Marieke | Flow | **Blocker** |
| 3 | **Progress indicator for Delta participation** — Show "3 of 10 statements" so team members know how far along they are. | Lisa | UX | **Blocker** |
| 4 | **Explain what happens after check-in** — On success screen, add "Your Scrum Master will see the team average, not your individual response." | Lisa | Copy/Trust | **Important** |
| 5 | **Clarify "Confidence" indicator** — Add tooltip explaining what Low/Moderate/High confidence means (sample size, variance, etc.) | Marieke, Erik | UX | **Important** |
| 6 | **Share link more prominent in session setup** — After creating Delta session, the share link should be the hero element, not buried. | Marieke | UX | **Important** |
| 7 | **Add "What's next?" after closing session** — When session is closed, suggest next steps (schedule retro, create follow-up session, etc.) | Marieke | Flow | **Important** |
| 8 | **Benchmark guidance for Pulse scores** — Add help text: "Most healthy teams average 3.5-4.2" or similar. | Marieke, Erik | Copy | **Important** |
| 9 | **Explain Pulse + Delta relationship** — Brief help text on dashboard explaining how the two tools complement each other. | Marieke, Erik | Copy | **Important** |
| 10 | **Portfolio view for coaches** — Allow grouping teams and seeing cross-team health at a glance. | Erik | Feature | **Nice to have** |
| 11 | **Notification when team enters "needs attention"** — Email or in-app alert when threshold is crossed. | Erik | Feature | **Nice to have** |
| 12 | **Slack/Teams integration for check-in** — Allow daily reminder and in-chat response. | Lisa, Marieke | Feature | **Nice to have** |
| 13 | **Mobile admin dashboard optimization** — Better layout for team management on small screens. | Marieke | Mobile | **Nice to have** |
| 14 | **Express interest in premium modules** — Add "Notify me" button on Coming Soon features. | Erik | UX | **Nice to have** |
| 15 | **Personal submission history** — Let team members see their own past check-ins (not others). | Lisa | Feature | **Nice to have** |

---

## PULSE UPGRADE PLAN

### TASK A — ROLE OF PULSE

**What Pulse IS:**
- A daily 2-second signal capturing team energy
- A conversation starter, not a conclusion
- A rhythm builder that creates consistency
- A lightweight thermometer, not a diagnosis

**What Pulse explicitly IS NOT:**
- A survey (no questions, just a signal)
- A performance metric (cannot evaluate individuals)
- A dashboard for management (no drill-down to individuals)
- A happiness score (it's about energy/capacity, not satisfaction)
- A replacement for conversations (it prompts them)

---

### TASK B — PULSE v1 FINALIZATION

#### Improvement 1: Semantic Scale Labels

**Current:** 1 — 2 — 3 — 4 — 5 (no labels)

**Proposed:** Keep numbers primary, add subtle contextual hints below:
```
  1         2         3         4         5
Rough    Meh     Steady    Good    Great
```

**Rationale:** Numbers preserve neutrality. Labels provide just enough meaning without prescribing emotion. "Steady" for 3 positions it as normal/baseline, not mediocre.

#### Improvement 2: Clarify What Happens to Signals

**Current:** Privacy notice says "never shared with HR"

**Add to success screen:** "Your Scrum Master sees the team average and participation — never individual responses."

**Rationale:** Builds trust through transparency. Team members should understand the information flow.

#### Improvement 3: Streak Messaging Simplification

**Current (after recent fix):** Neutral messaging like "Consistent!" and "Building rhythm"

**Confirmed good.** No further changes needed. The non-gamified approach is correct.

#### Improvement 4: Zone Label Consistency

**Current:** Excellent / Good / Attention / Critical

**Keep as-is.** These labels are appropriately neutral and action-oriented. "Attention" is better than "Warning" — it doesn't alarm, it focuses.

---

### TASK C — PULSE v1.5 (POST-PILOT)

#### Enhancement 1: Trend Interpretation Hints

**What it does:** When viewing a declining trend, show contextual hint: "This often correlates with sprint mid-point fatigue or external blockers."

**Decision it supports:** Helps SM decide whether to investigate or wait for natural recovery.

**How it avoids false certainty:** Uses "often correlates" language, not "means." Positions as hypothesis, not diagnosis.

#### Enhancement 2: Week Pattern Visualization

**What it does:** Show Mon-Fri pattern over past 4 weeks. Reveals if team consistently dips on certain days.

**Decision it supports:** Helps SM identify ceremony fatigue (Monday planning dread) or end-of-sprint stress.

**How it avoids false certainty:** Shows pattern, doesn't interpret. "You have the data, you have the context."

#### Enhancement 3: Participation Insight

**What it does:** When participation drops, surface: "3 people haven't checked in this week who usually do."

**Decision it supports:** Helps SM know if they need to re-share the link or if people are disengaging.

**How it avoids false certainty:** States facts only. No inference about why.

---

### TASK D — GUARDRAILS

#### Features Pulse Must Never Get:
1. **Individual identification** — Never show which person gave which score
2. **Mood prediction** — Never "AI predicts tomorrow's score will be..."
3. **Comparison rankings** — Never "Team A is happier than Team B"
4. **Performance correlation** — Never link Pulse to velocity or output metrics
5. **Mandatory participation** — Never show "Lisa hasn't checked in" to managers
6. **Historical drill-down** — Never show "2 weeks ago, someone gave a 1"
7. **Comment sentiment analysis** — Never "20% of comments are negative"

#### Warning Signs Pulse Is Becoming "Too Much":
1. ⚠️ Adding more than 1 input field to check-in
2. ⚠️ Check-in takes more than 5 seconds
3. ⚠️ Dashboard has more than 5 metrics visible at once
4. ⚠️ Anyone asks "What's the ROI of Pulse?"
5. ⚠️ Leadership requests team-by-team ranking
6. ⚠️ Feature requests for "weekly summary email to management"
7. ⚠️ Pressure to increase check-in frequency beyond daily

---

## SUMMARY

The platform is **ready for pilot** with real Scrum Masters. The core experience (Pulse check-in, Delta sessions) is polished and trustworthy.

**Three blockers to fix before pilot:**
1. Add labels to 1-5 scale
2. Show Delta results to team members
3. Add progress indicator in Delta participation

**Answer to the key question:**
*"Would real Scrum Masters trust this tool enough to use it next week?"*

**Yes** — Marieke would share the Pulse link with her team tomorrow. She understands what she's getting, trusts the anonymity, and sees immediate value in the Delta statements. The remaining gaps are workable for a pilot.

---

*Report saved to prevent session loss. Last updated: 2026-02-01*
