<template>
  <div class="gate" role="dialog" aria-modal="true" aria-label="Welcome">
    <div class="bg" aria-hidden="true" />
    <div class="card">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>

      <button class="btn btn--primary" type="button" @pointerdown="emit('start')">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    buttonText?: string
  }>(),
  {
    title: 'Hi my love 💛',
    subtitle: 'I made something for you…',
    buttonText: 'Let’s Start',
  },
)

const emit = defineEmits<{
  start: []
}>()
</script>

<style scoped>
.gate {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  isolation: isolate;
  z-index: 50;

  animation: gateFade 260ms ease-out both;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;

  background-image:
    linear-gradient(
      180deg,
      rgba(24, 18, 30, 0.50) 0%,
      rgba(24, 18, 30, 0.62) 55%,
      rgba(24, 18, 30, 0.72) 100%
    ),
    url('/welcome-bg.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.03);
}

.card {
  width: 100%;
  max-width: 520px;
  border-radius: 20px;
  padding: 22px 18px;
  background: rgba(7, 9, 19, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.55);
  color: #eaf0ff;
  text-align: center;
  backdrop-filter: blur(10px);
}

.title {
  font-size: 28px;
  line-height: 1.1;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0 0 18px;
  color: rgba(234, 240, 255, 0.82);
  font-size: 16px;
}

@media (prefers-reduced-motion: reduce) {
  .gate {
    animation: none;
  }
}

@keyframes gateFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
