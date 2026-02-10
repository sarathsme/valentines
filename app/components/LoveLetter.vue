<template>
  <Transition name="letter">
    <section v-if="open" class="letter" aria-label="Love Letter">
      <div class="paper">
        <p class="question">Will you be my Valentine?</p>
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  /** When true, the letter slides into view */
  open: boolean
}>()
</script>

<style scoped>
.letter {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.paper {
  width: 100%;
  max-width: 340px;
  min-height: 280px;
  padding: 40px 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Paper-like appearance */
  background: linear-gradient(
    180deg,
    #fdfbf7 0%,
    #f9f6f0 50%,
    #f5f1e8 100%
  );
  border-radius: 6px;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.35),
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);

  /* Subtle paper texture via noise */
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-blend-mode: soft-light;
  background-size: cover, 200px 200px;
}

.question {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  color: #3a2f2a;
  letter-spacing: -0.01em;
}

/* Slide-up animation */
.letter-enter-active {
  transition: opacity 400ms ease;
}

.letter-enter-active .paper {
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease;
}

.letter-leave-active {
  transition: opacity 300ms ease;
}

.letter-leave-active .paper {
  transition: transform 300ms ease, opacity 300ms ease;
}

.letter-enter-from {
  opacity: 0;
}

.letter-enter-from .paper {
  opacity: 0;
  transform: translateY(80px) scale(0.95);
}

.letter-leave-to {
  opacity: 0;
}

.letter-leave-to .paper {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .letter-enter-active,
  .letter-enter-active .paper,
  .letter-leave-active,
  .letter-leave-active .paper {
    transition: none;
  }

  .letter-enter-from,
  .letter-enter-from .paper,
  .letter-leave-to,
  .letter-leave-to .paper {
    transform: none;
  }
}

/* Larger screens */
@media (min-width: 480px) {
  .paper {
    max-width: 400px;
    min-height: 320px;
    padding: 48px 36px;
  }

  .question {
    font-size: 26px;
  }
}
</style>
