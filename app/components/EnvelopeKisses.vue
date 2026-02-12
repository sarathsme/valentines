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
      <h2 class="title">I want to ask you something…</h2>
      <p class="subtitle">Collect 5 hearts to open it 💋</p>

      <p v-if="!unlocked" class="progress" aria-live="polite">
        {{ collectedCount }} / {{ TOTAL_HEARTS }} hearts
      </p>
      <p v-else class="progress progress--ready" aria-live="polite">Tap the envelope</p>
    </div>

    <!-- Envelope -->
    <div class="envelope-wrapper">
      <div
        class="envelope"
        :data-unlocked="unlocked ? 'true' : 'false'"
        :data-opened="letterOpen ? 'true' : 'false'"
      >
        <!-- Back of envelope (behind letter) -->
        <div class="envelope-back"></div>

        <!-- Flap (behind letter when closed, visible when open) -->
        <div class="flap"></div>

        <!-- Letter slides up from inside -->
        <LoveLetter :open="letterOpen" />

        <!-- Front of envelope (covers bottom of letter) -->
        <div class="envelope-front"></div>

        <!-- Tap target button -->
        <button
          class="envelope-tap"
          type="button"
          :aria-disabled="unlocked ? 'false' : 'true'"
          @pointerdown.prevent="onEnvelopeTap"
        >
          <span class="sr-only">{{ unlocked ? 'Open envelope' : 'Collect all hearts first' }}</span>
        </button>
      </div>
    </div>

    <!-- Yes/No choice (after letter reveal) -->
    <div v-if="letterOpen" class="choice" aria-label="Valentine choice">
      <div class="choiceRow" role="group" aria-label="Yes or No">
        <button
          class="btn btn--primary choiceBtn choiceBtn--yes"
          type="button"
          :disabled="choiceLocked"
          :aria-disabled="choiceLocked ? 'true' : 'false'"
          :style="{
            transform: `scale(${yesScale})`,
            '--yes-scale': String(yesScale),
          }"
          @pointerdown.prevent="onYesPointer"
          @click.prevent="onYesClick"
        >
          Yes
        </button>

        <button
          class="btn btn--ghost choiceBtn choiceBtn--no"
          type="button"
          :disabled="choiceLocked"
          :aria-disabled="choiceLocked ? 'true' : 'false'"
          @pointerdown.prevent="onNoPointer"
          @click.prevent="onNoClick"
        >
          <Transition name="msgfade" mode="out-in">
            <span :key="noClickCount" aria-live="polite">{{ currentMessage }}</span>
          </Transition>
        </button>
      </div>
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
  yes: []
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
const letterOpen = ref(false)

const noMessages = [
  'No',
  'are you sure?',
  'pretty please!',
  'This could be a mistake',
  'you are breaking my heart :(',
  'No!! Dont click me',
] as const

const noClickCount = ref(0)
const yesScale = ref(1)
const currentMessage = ref<string>(noMessages[0] ?? '')
const choiceLocked = ref(false)

const lastPointerAt = ref(0)

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
  letterOpen.value = true
  emit('open')
}

function updateNoMessage() {
  const idx = Math.min(noClickCount.value, noMessages.length - 1)
  currentMessage.value = noMessages[idx] ?? ''
}

function handleNo() {
  if (choiceLocked.value) return
  noClickCount.value += 1
  updateNoMessage()
  yesScale.value = clamp(yesScale.value + 0.08, 1, 1.6)
}

function handleYes() {
  if (choiceLocked.value) return
  choiceLocked.value = true
  emit('yes')
}

function onNoPointer() {
  lastPointerAt.value = Date.now()
  handleNo()
}

function onNoClick() {
  if (Date.now() - lastPointerAt.value < 450) return
  handleNo()
}

function onYesPointer() {
  lastPointerAt.value = Date.now()
  handleYes()
}

function onYesClick() {
  if (Date.now() - lastPointerAt.value < 450) return
  handleYes()
}
</script>

<style scoped>
.section {
  height: 100%;
  min-height: 100%;
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
  margin-bottom: 80px;
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

/* Choice UI */
.choice {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-top: 4px;
}

.choiceRow {
  width: min(360px, 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 12px;
}

.choiceBtn {
  flex: 1 1 0;
  min-width: 0;
}

.choiceBtn--yes {
  transition: transform 250ms ease, box-shadow 250ms ease, filter 250ms ease;
  will-change: transform;
  transform-origin: center;
  position: relative;
  z-index: 1;

  /* Subtle glow that increases with --yes-scale */
  box-shadow:
    0 14px 34px rgba(255, 46, 103, 0.20),
    0 0 calc(14px + (var(--yes-scale, 1) - 1) * 20px) rgba(11, 59, 255, 0.18),
    0 0 calc(10px + (var(--yes-scale, 1) - 1) * 16px) rgba(255, 46, 103, 0.18),
    0 0 0 1px rgba(70, 10, 26, 0.55) inset;
}

.choiceBtn--no {
  position: relative;
  z-index: 2; /* keep No visible/clickable if Yes grows */
  flex-direction: column;
  gap: 4px;
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Message fade transition */
.msgfade-enter-active,
.msgfade-leave-active {
  transition: opacity 180ms ease;
}

.msgfade-enter-from,
.msgfade-leave-to {
  opacity: 0;
}

/* Envelope container */
.envelope {
  position: relative;
  width: min(280px, 70vw);
  aspect-ratio: 1.875 / 1;
  animation: wiggle-pause 2.0s ease-in-out infinite;
}

.envelope[data-unlocked='true'] {
  animation: none;
}

.envelope[data-opened='true'] {
  animation: none;
}

/* Tap target covers the whole envelope */
.envelope-tap {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
}

.envelope[data-unlocked='true'] .envelope-tap {
  cursor: pointer;
}

.envelope[data-unlocked='true'] .envelope-tap:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.35);
  outline-offset: 6px;
  border-radius: 14px;
}

/* Hide tap target when letter is open */
.envelope[data-opened='true'] .envelope-tap {
  pointer-events: none;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Back of envelope (behind everything) */
.envelope-back {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, #e0d0bc 0%, #d4c4ae 100%);
  border-radius: 4px 4px 12px 12px;
}

/* Envelope flap (triangle) - on top when closed */
.flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  z-index: 5; /* On top of everything when closed */
  background: linear-gradient(180deg, #e8d4be 0%, #dcc9b3 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top center;
  transition: transform 400ms ease-out, z-index 0s linear 200ms;
}

/* Flap opens and goes behind when opened */
.envelope[data-opened='true'] .flap {
  transform: rotateX(180deg);
  z-index: 1; /* Goes behind everything when open */
  transition: transform 400ms ease-out, z-index 0s linear 0ms;
}

/* Front of envelope (covers full body, in front of letter) */
.envelope-front {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 4;
  background: linear-gradient(180deg, #f5e6d3 0%, #e8d4be 100%);
  border-radius: 4px 4px 12px 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 -4px 12px rgba(0, 0, 0, 0.05);
}

/* Top edge shadow on front */
.envelope-front::before {
  content: '';
  position: absolute;
  top: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
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

  .flap {
    transition: none;
  }

  .heart {
    animation: none;
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .heart[data-collected='true'] {
    transition: none;
  }

  .msgfade-enter-active,
  .msgfade-leave-active {
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
