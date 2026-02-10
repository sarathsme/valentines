<template>
  <div class="app">
    <!-- User-gesture audio only: no autoplay -->
    <audio ref="audioEl" loop preload="auto" />

    <WelcomeGate
      v-if="!started"
      title="Hi my Thakkudu!!! 💛"
      subtitle="I made something for us..."
      button-text="Let’s Start"
      @start="startExperience"
    />

    <main
      v-else
      ref="stageEl"
      class="stage"
      aria-label="Valentine experience"
    >
      <section class="panel" aria-label="Timeline stage">
        <div ref="timelineScrollEl" class="panelScroll">
          <TimelineStory />
        </div>
      </section>

      <section class="panel" aria-label="Envelope stage">
        <EnvelopeKisses :active="currentPanel === 'envelope'" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const started = ref(false)
const musicPlaying = ref(false)
const currentPanel = ref<'timeline' | 'envelope'>('timeline')

const audioEl = ref<HTMLAudioElement | null>(null)

const stageEl = ref<HTMLElement | null>(null)
const timelineScrollEl = ref<HTMLElement | null>(null)

let activeLock = false
let lastSnapAt = 0

function snapToEnvelope() {
  const now = Date.now()
  // debounce so trackpads don't trigger multiple snaps
  if (now - lastSnapAt < 700) return
  lastSnapAt = now

  const el = stageEl.value
  if (!el) return
  el.scrollTo({ top: el.clientHeight, behavior: 'smooth' })
}

// Set up scroll listeners after the experience starts (stage element renders)
watch(started, async (isStarted) => {
  if (!isStarted) return

  // Wait for next tick so the DOM updates and refs are available
  await nextTick()

  const stage = stageEl.value
  const timeline = timelineScrollEl.value
  if (!stage || !timeline) return

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  // Wheel: if user scrolls down and timeline is already at the bottom, snap to envelope.
  const onWheel = (e: WheelEvent) => {
    if (activeLock) return
    if (e.deltaY <= 0) return

    const atBottom = timeline.scrollTop + timeline.clientHeight >= timeline.scrollHeight - 2
    const alreadyOnEnvelope = stage.scrollTop >= stage.clientHeight * 0.5

    if (!alreadyOnEnvelope && atBottom) {
      e.preventDefault()
      activeLock = true
      if (prefersReduced) {
        stage.scrollTop = stage.clientHeight
        activeLock = false
      } else {
        snapToEnvelope()
        window.setTimeout(() => {
          activeLock = false
        }, 520)
      }
    }
  }

  // Touch: detect upward swipe when timeline is at bottom, then snap.
  let touchStartY = 0
  const onTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0]?.clientY ?? 0
  }
  const onTouchMove = (e: TouchEvent) => {
    if (activeLock) return
    const y = e.touches[0]?.clientY ?? 0
    const dy = touchStartY - y
    if (dy <= 0) return

    const atBottom = timeline.scrollTop + timeline.clientHeight >= timeline.scrollHeight - 2
    const alreadyOnEnvelope = stage.scrollTop >= stage.clientHeight * 0.5
    if (!alreadyOnEnvelope && atBottom) {
      e.preventDefault()
      activeLock = true
      if (prefersReduced) {
        stage.scrollTop = stage.clientHeight
        activeLock = false
      } else {
        snapToEnvelope()
        window.setTimeout(() => {
          activeLock = false
        }, 520)
      }
    }
  }

  // Important: passive must be false to allow preventDefault.
  stage.addEventListener('wheel', onWheel, { passive: false })
  stage.addEventListener('touchstart', onTouchStart, { passive: true })
  stage.addEventListener('touchmove', onTouchMove, { passive: false })

  // Track which panel is currently visible to toggle EnvelopeKisses active state
  const onScroll = () => {
    const threshold = stage.clientHeight * 0.5
    currentPanel.value = stage.scrollTop >= threshold ? 'envelope' : 'timeline'
  }
  stage.addEventListener('scroll', onScroll, { passive: true })

  onBeforeUnmount(() => {
    stage.removeEventListener('wheel', onWheel as any)
    stage.removeEventListener('touchstart', onTouchStart as any)
    stage.removeEventListener('touchmove', onTouchMove as any)
    stage.removeEventListener('scroll', onScroll)
  })
})

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

/*
  Two-stage scroller:
  - Stage itself is the viewport-height scroll container.
  - Panel 1: timeline scrolls internally.
  - Panel 2: full-screen envelope.
*/
.stage {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;

  height: calc(100dvh - 18px - 28px);
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  border-radius: 18px;
}

.panel {
  height: 100%;
  min-height: 100%;
  scroll-snap-align: start;
}

.panelScroll {
  height: 100%;
  overflow-y: auto;
  padding: 0;
}

@media (min-width: 640px) {
  .app {
    padding: 28px 18px 40px;
  }

  .stage {
    height: calc(100dvh - 28px - 40px);
  }
}
</style>
