<template>
  <section class="section" aria-label="Letter">
    <!-- Floating hearts (fixed to viewport) -->
    <button
      v-for="heart in (active ? hearts : [])"
      :key="heart.id"
      class="heart"
      type="button"
      :style="{
        left: heart.left,
        top: heart.top,
        '--delay': heart.delay + 'ms',
      }"
      :aria-label="`Collect heart ${heart.collected ? '(collected)' : ''}`"
      :disabled="heart.collected"
      :data-collected="heart.collected ? 'true' : 'false'"
      @pointerdown.prevent="collectHeart(heart.id)"
    >
      <span class="heartInner" aria-hidden="true">❤️</span>
    </button>

    <!-- Text above envelope -->
    <div class="text-container">
      <h2 class="title">I wrote you something…</h2>
      <p class="subtitle">Collect 5 kisses to open it 💋</p>

      <p v-if="!unlocked" class="progress" aria-live="polite">
        {{ collectedCount }} / {{ TOTAL_HEARTS }} hearts
      </p>
      <p v-else class="progress progress--ready" aria-live="polite">Tap the envelope</p>
    </div>

    <!-- Envelope -->
    <div class="envelope-wrapper">
      <button
        class="envelope"
        type="button"
        :data-unlocked="unlocked ? 'true' : 'false'"
        :aria-disabled="unlocked ? 'false' : 'true'"
        @pointerdown.prevent="onEnvelopeTap"
      >
        <!-- Flap (triangle) -->
        <div class="flap"></div>
        <!-- Base rectangle -->
        <div class="body"></div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** When false, do not render the floating heart overlay. */
    active?: boolean
  }>(),
  { active: true },
)

const emit = defineEmits<{
  open: []
}>()

const TOTAL_HEARTS = 5 as const

type Heart = {
  id: number
  left: string
  top: string
  delay: number
  collected: boolean
}

const hearts = ref<Heart[]>([])

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function spawnHearts() {
  // Place hearts around the viewport edges but within reachable bounds.
  const w = typeof window !== 'undefined' ? window.innerWidth : 390
  const h = typeof window !== 'undefined' ? window.innerHeight : 780

  const safePad = 20
  const headerReserve = 120 // keep away from header area
  const bottomReserve = 90 // keep away from iOS browser UI

  const positions = [
    { x: 0.14, y: 0.28 },
    { x: 0.78, y: 0.26 },
    { x: 0.18, y: 0.62 },
    { x: 0.80, y: 0.64 },
    { x: 0.50, y: 0.80 },
  ]

  hearts.value = positions.slice(0, TOTAL_HEARTS).map((p, idx) => {
    const x = clamp(Math.round(w * p.x), safePad, w - safePad)
    const y = clamp(Math.round(h * p.y), headerReserve, h - bottomReserve)
    return {
      id: idx,
      left: `${x}px`,
      top: `${y}px`,
      delay: 80 + idx * 80,
      collected: false,
    }
  })
}

onMounted(() => {
  // Create hearts once; we only render them when in view.
  spawnHearts()
})

const collectedCount = computed(
  () => hearts.value.reduce((acc, k) => acc + (k.collected ? 1 : 0), 0),
)

const unlocked = computed(() => collectedCount.value >= TOTAL_HEARTS)

function collectHeart(id: number) {
  const h = hearts.value.find((x) => x.id === id)
  if (!h || h.collected) return

  h.collected = true

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10)
    } catch {
      // ignore
    }
  }
}

function onEnvelopeTap() {
  if (!unlocked.value) return
  emit('open')
}
</script>

<style scoped>
.section {
  height: 100vh;
  height: 100dvh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 24px;
  gap: 46px;
  position: relative;
  overflow: hidden;
}

/* Text */
.text-container {
  text-align: center;
}

.title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.subtitle {
  margin: 0 0 10px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.progress {
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.76);
}

.progress--ready {
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}

/* Envelope wrapper for centering */
.envelope-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Envelope container */
.envelope {
  position: relative;
  width: min(280px, 70vw);
  aspect-ratio: 1.5 / 1;
  animation: wiggle-pause 2.0s ease-in-out infinite;

  background: transparent;
  border: 0;
  padding: 0;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
}

.envelope[data-unlocked='true'] {
  cursor: pointer;
}

.envelope[data-unlocked='true']:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.35);
  outline-offset: 6px;
  border-radius: 14px;
}

.envelope[data-unlocked='true'] {
  animation: none;
}

/* Envelope body (rectangle) */
.body {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #f5e6d3 0%, #e8d4be 100%);
  border-radius: 4px 4px 12px 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 -4px 12px rgba(0, 0, 0, 0.05);
}

/* Envelope flap (triangle) */
.flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(180deg, #e8d4be 0%, #dcc9b3 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* Inner shadow line on body to simulate depth under flap */
.body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 1px;
}

/* Subtle seal/heart decoration */
/* .body::after {
  content: '💌';
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  opacity: 0.6;
} */

/* Wiggle a bit, rest, wiggle again */
@keyframes wiggle-pause {
  /* wiggle burst (0% -> ~25%) */
  0% {
    transform: rotate(0deg);
  }
  5% {
    transform: rotate(-2deg);
  }
  10% {
    transform: rotate(2deg);
  }
  15% {
    transform: rotate(-1.5deg);
  }
  20% {
    transform: rotate(1.5deg);
  }
  25% {
    transform: rotate(0deg);
  }

  /* pause/rest (25% -> 75%) */
  75% {
    transform: rotate(0deg);
  }

  /* small wiggle at the end (75% -> 100%) */
  80% {
    transform: rotate(-2deg);
  }
  85% {
    transform: rotate(2deg);
  }
  90% {
    transform: rotate(-1.5deg);
  }
  95% {
    transform: rotate(1.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/* Floating hearts */
.heart {
  position: fixed;
  z-index: 20;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(8px);
  box-shadow:
    0 20px 55px rgba(0, 0, 0, 0.32),
    0 0 0 1px rgba(0, 0, 0, 0.22) inset;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  opacity: 0;
  transform: translate(-50%, -50%) scale(0.75);
  animation: heartIn 420ms ease-out forwards;
  animation-delay: var(--delay, 0ms);
}

.heartInner {
  font-size: 26px;
  transform: translateY(1px);
  filter: drop-shadow(0 10px 18px rgba(255, 46, 103, 0.22));
}

.heart:active {
  transform: translate(-50%, -50%) scale(0.97);
}

.heart[data-collected='true'] {
  pointer-events: none;
  opacity: 0;
  visibility: hidden;

  /* pop out */
  transform: translate(-50%, -50%) scale(1.25);
  transition:
    transform 220ms ease,
    opacity 220ms ease,
    visibility 0s linear 220ms;
}

@keyframes heartIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.75);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .envelope {
    animation: none;
  }

  .heart {
    animation: none;
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .heart[data-collected='true'] {
    transition: none;
  }
}

/* Larger screens */
@media (min-width: 480px) {
  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 18px;
  }

  .envelope {
    width: 320px;
  }
}
</style>
