<template>
  <div class="letter-container" :data-open="open ? 'true' : 'false'">
    <div class="paper" aria-label="Love Letter">
      <p class="question">Will you be my Valentine?</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** When true, the letter slides up out of the envelope */
  open: boolean
}>()
</script>

<style scoped>
.letter-container {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 45%; /* Start higher up, inside the envelope */
  top: 5%;
  z-index: 3; /* Between flap and envelope-front */
  pointer-events: none;
  overflow: hidden; /* Clip the paper so it doesn't leak below */
  transition: overflow 0s linear 0ms;
}

/* Allow overflow when open so paper can slide out */
.letter-container[data-open='true'] {
  overflow: visible;
  transition: overflow 0s linear 300ms; /* Delay overflow:visible until animation starts */
}

.paper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 180%;
  padding: 24px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 28px;

  /* Solid paper background - no transparency */
  background-color: #f9f6f0;
  background-image: linear-gradient(
    180deg,
    #fdfbf7 0%,
    #f9f6f0 50%,
    #f5f1e8 100%
  );
  border-radius: 4px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);

  /* Start hidden inside envelope */
  transform: translateY(60%);
  transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Letter slides up when open */
.letter-container[data-open='true'] .paper {
  transform: translateY(-10%);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.3),
    0 8px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  pointer-events: auto;
}

.question {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  color: #3a2f2a;
  letter-spacing: -0.01em;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .paper {
    transition: none;
  }
}

/* Larger screens */
@media (min-width: 480px) {
  .paper {
    padding: 28px 20px;
    padding-top: 32px;
  }

  .question {
    font-size: 18px;
  }
}
</style>
