# Valentine Microsite Spec (Nuxt + Vue)

Purpose: a playful, romantic interactive Valentine page for my wife.
Single-page experience, built quickly, personal, and smooth.

---

## Core Principles (MOST IMPORTANT)

1. **Mobile-first UI**
   - Design for phones first, then scale up gracefully.
   - Max content width ~430–520px centered on desktop.
   - Large tap targets, readable typography.

2. **User-gesture audio only**
   - Background music must start ONLY after the first user tap
     (e.g., “Let’s Start” button). No autoplay.

3. **Lightweight + smooth**
   - Prefer Vue + CSS animations.
   - Keep dependencies minimal (optional: tiny confetti helper).
   - Use pointer events, not hover-only interactions.

4. **Playful, not annoying**
   - Interactions should feel cute and quick, not frustrating.
   - Whole experience should be under ~1–2 minutes.

---

## Flow (Single Page)

### 1) Welcome Gate
- Hero background (photo or soft gradient).
- Short intro text.
- Button: **“Let’s Start”**
  - Starts music
  - Reveals the story content

---

### 2) Timeline Story
- 4–6 timeline cards: meeting → relationship → wedding → today
- Subtle scroll animations (fade + slide up)

---

### 3) Envelope Unlock: Tap 5 Kisses
Purpose: a playful interaction that directly opens the letter.

- Show text: **“Tap 5 kisses to open your envelope 💋”**
- Envelope is visible at center from the start
- Envelope gently shakes/wiggles while locked
- 5 kiss icons appear around the viewport
- Keep icons reachable on small screens, not under UI.
- User taps each kiss:
  - Kiss pops/disappears with animation
  - Progress updates: `3/5`
  - Add subtle haptic feedback if available (navigator.vibrate(10)).
- When all 5 kisses are collected:
  - Envelope becomes “ready”
  - Tap envelope to open

---

### 4) Envelope Open + Letter Reveal
Purpose: the main romantic moment.

- On envelope tap (when unlocked):
  - Flap opens smoothly
  - Letter slides upward from inside
- Letter contains:
  - Main question: **“Will you be my Valentine?”**
  - Yes / No buttons

---

### 5) Final Choice (Yes/No)
- Mobile behavior:
  - “No” dodges taps playfully (moves away on pointerdown)
  - Each attempt grows “Yes” slightly and shrinks “No”
  - If “No” is tapped: show “try again 😌”
- “Yes” triggers confetti + final reveal

---

### 6) Final Screen
- Short heartfelt message
- Optional photo
- Calm ending (no extra gimmicks)

---

## Technical Notes

- Nuxt app, Vue `<script setup>`
- Component-based structure is fine
- Use `pointerdown`/`touchstart` for responsiveness
- Respect `prefers-reduced-motion`
- Keep deployable as a static site

---

## Suggested Components

- `WelcomeGate.vue`
- `TimelineStory.vue`
- `EnvelopeKisses.vue` (kisses + shaking envelope)
- `LoveLetter.vue` (open animation + letter)
- `YesNoChoice.vue`

App state lives in `app.vue`.

---
