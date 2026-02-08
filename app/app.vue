<template>
  <div class="app">
    <!-- User-gesture audio only: no autoplay -->
    <audio ref="audioEl" loop preload="auto" />

    <WelcomeGate
      v-if="!started"
      title="Hi my love 💛"
      subtitle="I made something for you…"
      button-text="Let’s Start"
      @start="startExperience"
    />

    <main v-else class="container" aria-label="Valentine experience">
      <TimelineStory />
      <EnvelopeKisses />
      <LoveLetter />
      <YesNoChoice />
      <FinalScreen />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const started = ref(false)
const musicPlaying = ref(false)

const audioEl = ref<HTMLAudioElement | null>(null)

async function startExperience() {
  started.value = true

  // Must be triggered by a user gesture (pointerdown in WelcomeGate)
  const el = audioEl.value
  if (!el) return

  // You can swap this later for an actual audio file in /public (e.g. /music.mp3)
  if (!el.src) el.src = '/music.mp3'

  try {
    await el.play()
    musicPlaying.value = true
  } catch {
    // If the browser still blocks playback (or file missing), keep UI functional.
    musicPlaying.value = false
  }
}
</script>

<style>
/* App-wide baseline (kept here for fast iteration; can be moved later) */
html,
body {
  height: 100%;
}

body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica,
    Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
  color: #eaf0ff;
  background:
    radial-gradient(900px 650px at 15% 10%, rgba(9, 118, 255, 0.18) 0%, rgba(9, 118, 255, 0) 60%),
    radial-gradient(850px 600px at 85% 25%, rgba(255, 33, 84, 0.16) 0%, rgba(255, 33, 84, 0) 62%),
    radial-gradient(1200px 900px at 50% 110%, rgba(110, 59, 255, 0.10) 0%, rgba(110, 59, 255, 0) 58%),
    linear-gradient(180deg, #070913 0%, #050a1d 32%, #02040d 100%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* --- Global button styles (dark theme) --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 800;
  letter-spacing: 0.01em;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease,
    background 120ms ease, border-color 120ms ease;
}

.btn:active {
  transform: translateY(1px) scale(0.99);
}

.btn:focus-visible {
  outline: 3px solid rgba(9, 118, 255, 0.55);
  outline-offset: 3px;
}

.btn--primary {
  color: #ffeef3;
  background: linear-gradient(180deg, #ff2e67 0%, #c10a3e 100%);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 34px rgba(255, 46, 103, 0.20), 0 0 0 1px rgba(70, 10, 26, 0.55) inset;
}

.btn--primary:hover {
  filter: brightness(1.03) saturate(1.06);
}

.btn--danger {
  color: #ffeef3;
  background: linear-gradient(180deg, #ff2e67 0%, #c10a3e 100%);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 34px rgba(255, 46, 103, 0.20), 0 0 0 1px rgba(70, 10, 26, 0.55) inset;
}

/* Optional blue button for secondary/alt CTAs */
.btn--blue {
  color: #eaf0ff;
  background: linear-gradient(180deg, #167cff 0%, #0b3bff 100%);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 34px rgba(11, 59, 255, 0.30), 0 0 0 1px rgba(15, 25, 60, 0.45) inset;
}

.btn--ghost {
  color: rgba(234, 240, 255, 0.92);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
}

.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }

  .btn:active {
    transform: none;
  }
}
</style>

<style scoped>
.app {
  min-height: 100dvh;
  padding: 18px 14px 28px;
}

.container {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
}

@media (min-width: 640px) {
  .app {
    padding: 28px 18px 40px;
  }

  .container {
    gap: 16px;
  }
}
</style>
