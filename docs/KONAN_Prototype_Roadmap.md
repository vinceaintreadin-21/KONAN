# KONAN Prototype — Roadmap & Dependencies

Stack: React Native (TS) + Expo Go (Scroller/mobile) · React (TS) (Verifier/web) · Django + Django Channels (backend) · Redis (channel layer + room state cache) · Render (deployment)

Scenarios are hardcoded fixtures (no procedural generation). No leaderboard (not part of the source design — see Section 12 of the game rules: "no leaderboard shared between pairs").

---

## Core Concept Recap

- A **pair** = 2 players in one session, locked together across all 3 rounds, swapping roles (Scroller ⇄ Verifier), cooperating — never competing.
- A **room** = the backend/session representation of a pair. One `room_id`, one Channels group, one Redis state hash.
- Nothing works — Hold timer, description relay, tool checks — until two clients are correctly joined to the same room.

---

## Phase 0 — Foundations

- [ ] Django project scaffold + DRF
- [ ] `channels` + `channels_redis` install and config
- [ ] Core models: `Scenario`, `Room`/`Session`, `Player`, `Round`, `ScenarioAttempt`, `VerdictRecommendation`
- [ ] Hardcode 5–10 seed scenarios as Django fixtures matching the 5-module structure (Account Profile, Content Type, Claim Category, Fabrication Type, Deception Sophistication)
- [ ] Two serializers per scenario: `ScrollerScenarioSerializer` (feed content only) vs `VerifierScenarioSerializer` (tool payloads only, no `correct_verdict` until Reveal phase)

## Phase 1 — Room / Pairing Flow

- [ ] Room creation (Player A generates a room code)
- [ ] Room join (Player B enters the code)
- [ ] WebSocket Consumer: join/leave room group, track connected roles
- [ ] Redis room state hash: `phase`, `current_scenario_id`, `round_number`

## Phase 2 — Core Game Loop (Section 4 of rules)

- [ ] **Phase 1 — The Hold**: server-authoritative 10s timer via Redis TTL, broadcast start/end to both clients
- [ ] **Phase 2 — Initial Description**: 45s window, Scroller submits description, server tracks 5-item checklist completion (Redis hash) before Verifier can ask questions
- [ ] **Phase 3 — Verification Dialogue**: Verifier "runs" pre-authored tool payloads (Account History, Domain Authority, Image Metadata, WHOIS, Cross-Source, Keyword Search); server tracks tool-check count (Redis set) to enforce the 2-tool minimum
- [ ] **Phase 4 — Verdict Recommendation**: verdict + primary signal + confidence (1–5) submitted by Verifier
- [ ] **Phase 5 — Scroller Decision**: follow or override; apply scoring matrix (full/half/zero per rules) server-side, unit-tested
- [ ] **Phase 6 — Instant Reveal**: broadcast ground truth + explanation to both clients simultaneously, gated until this phase

## Phase 3 — Round Structure

- [ ] Round 1 (A=Scroller/B=Verifier) → Round 2 (reversed) → Round 3 (solo, shared interface, no role split)
- [ ] Round Summary aggregation (highest-error verdict type, most/least used tool, avg Description Accuracy Score)

## Phase 4 — Debrief & Assessment

- [ ] Session Debrief: 3 structured questions (Q1–Q3) flow, post-Round 3
- [ ] Pre-Assessment (5 posts, Yes/No/Unsure) — decoupled from gameplay
- [ ] Post-Assessment (same posts, 1 week later) — for share/hesitation/refusal rate comparison

## Phase 5 — Deployment & Polish

- [ ] Render: Django/Channels web service + managed Redis add-on
- [ ] React web app (Verifier) deploy on Render (static or web service)
- [ ] Expo Go for mobile (Scroller) testing/demo — skip native builds for prototype
- [ ] Accessibility modes (Section 10) — defer post-MVP unless required for demo/judging

---

## Dependencies to Install

### Backend (Django)

```bash
pip install django
pip install djangorestframework
pip install channels
pip install channels_redis
pip install redis
pip install django-cors-headers
pip install python-dotenv
pip install daphne          # ASGI server for Channels in production
pip install psycopg2-binary # if using Postgres (recommended over SQLite for Render deploy)
```

### Redis (local dev)

```bash
# Option A: Docker
docker run -p 6379:6379 redis

# Option B: native install (varies by OS)
```

### Frontend — Web (React TS, Verifier)

```bash
npm create vite@latest konan-verifier -- --template react-ts
cd konan-verifier
npm install
npm install axios
npm install zustand          # or your preferred state management
```
No dedicated WS client library required — native `WebSocket` API is sufficient for Channels.

### Frontend — Mobile (React Native TS, Scroller)

```bash
npx create-expo-app konan-scroller --template expo-template-blank-typescript
cd konan-scroller
npm install axios
npm install zustand
```
Native `WebSocket` API works in Expo/React Native as well — no extra socket library needed.

### Render Deployment

- No extra local dependencies — provision via Render dashboard:
  - Web Service (Django/Channels via Daphne, `Procfile` or Render "Start Command": `daphne konan.asgi:application --port $PORT --bind 0.0.0.0`)
  - Redis instance (managed add-on) → set `REDIS_URL` env var
  - Postgres instance (managed add-on, optional but recommended) → set `DATABASE_URL` env var

---

## What NOT to Build (per source material)

- ❌ No leaderboard shared between pairs (explicitly ruled out, Section 12)
- ❌ No live external API calls for verification tools — all tool data is pre-authored per scenario
- ❌ No procedural scenario generation — scenarios are hardcoded fixtures for the prototype
- ❌ No client-trusted timers — Hold and other phase timing should be server-authoritative via Redis TTL
