<template>
  <section class="section" aria-label="Letter">
    <!-- Text above envelope -->
    <div class="text-container">
      <h2 class="title">I wrote you something…</h2>
      <p class="subtitle">Collect 5 kisses to open it 💋</p>
    </div>

    <!-- Envelope -->
    <div class="envelope-wrapper">
      <div class="envelope">
        <!-- Flap (triangle) -->
        <div class="flap"></div>
        <!-- Base rectangle -->
        <div class="body"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

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
  gap: 32px;
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
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
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
.body::after {
  content: '💌';
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  opacity: 0.6;
}

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

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .envelope {
    animation: none;
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
