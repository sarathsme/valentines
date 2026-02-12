<template>
  <section class="timeline" aria-label="Our Story">
    <header class="header">
      <h2 class="h">
        Our Story
        <span class="heart" aria-hidden="true">❤️</span>
      </h2>
    </header>

    <ol class="list" aria-label="Timeline">
      <li
        v-for="(item, idx) in items"
        :key="item.id"
        class="item"
        :class="{
          'is-left': idx % 2 === 0,
          'is-right': idx % 2 === 1,
          'is-visible': visible[idx],
        }"
      >
        <!-- Center line + dot marker -->
        <div class="marker" aria-hidden="true">
          <span class="dot" />
        </div>

        <!-- Media + text alternate around the center line -->
        <article :ref="(el) => setItemRef(el, idx)" class="row">
          <div class="media">
            <img
              class="img"
              :src="withBase(item.imageSrc)"
              :alt="item.title"
            />
          </div>

          <div class="copy">
            <p class="kicker">{{ item.label }}</p>
            <h3 class="title">{{ item.title }}</h3>
            <p class="text">{{ item.text }}</p>
          </div>
        </article>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { joinURL } from 'ufo'

type StoryItem = {
  id: string
  label: string
  title: string
  text: string
  imageSrc: string
}

// Use NuxtImg if the module is installed; otherwise fall back to a normal img tag.
// This keeps the component working without adding any dependencies.
const imgComponent = 'NuxtImg' as any

const runtimeConfig = useRuntimeConfig()

function withBase(src: string) {
  const trimmed = (src || '').trim()

  // Leave absolute URLs / data URIs alone.
  if (/^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) return trimmed

  const baseURL = runtimeConfig.app.baseURL || '/'
  if (trimmed.startsWith(baseURL)) return trimmed

  return joinURL(baseURL, trimmed)
}

const items: StoryItem[] = [
  {
    id: 'meeting',
    label: 'THEN',
    title: 'Meeting',
    text: 'A tiny moment that became our universe.',
    imageSrc: '/story-meeting.svg',
  },
  {
    id: 'first-date',
    label: 'THEN',
    title: 'First Date',
    text: 'The Start of Something Beautiful',
    imageSrc: '/story-first-date.svg',
  },
  {
    id: 'proposal',
    label: 'THEN',
    title: 'Proposal',
    text: 'Forever Started With a Yes',
    imageSrc: '/story-proposal.svg',
  },
  {
    id: 'wedding',
    label: 'THEN',
    title: 'Wedding',
    text: 'A promise, and the happiest kind of calm.',
    imageSrc: '/story-wedding.JPG',
  },
  {
    id: 'today',
    label: 'NOW',
    title: '',
    text: 'Still my favorite person. Still my home.',
    imageSrc: '/story-today.svg',
  },
]

const visible = ref<boolean[]>(Array.from({ length: items.length }, () => false))
const itemEls = ref<(HTMLElement | null)[]>(Array.from({ length: items.length }, () => null))

function setItemRef(el: unknown, idx: number) {
  itemEls.value[idx] = el instanceof HTMLElement ? el : null
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  const mql = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

  if (mql?.matches) {
    visible.value = visible.value.map(() => true)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue

        const idxStr = (entry.target as HTMLElement).dataset['idx']
        const idx = idxStr ? Number(idxStr) : -1
        if (idx >= 0 && idx < visible.value.length) visible.value[idx] = true

        observer?.unobserve(entry.target)
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  )

  itemEls.value.forEach((el, idx) => {
    if (!el) return
    el.dataset['idx'] = String(idx)
    observer?.observe(el)
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.timeline {
  position: relative;
  width: 100%;
  padding: 16px 12px 6px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px 10px;
}

.h {
  margin: 0;
  font-size: 20px;
  letter-spacing: -0.01em;
  color: rgba(234, 240, 255, 0.98);
}

.heart {
  color: #ff2e67;
  filter: drop-shadow(0 10px 18px rgba(255, 46, 103, 0.25));
}

.list {
  position: relative;
  list-style: none;
  padding: 10px 0 0;
  margin: 0;
}

/* the centered vertical line */
.list::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    rgba(160, 185, 255, 0.00) 0%,
    rgba(160, 185, 255, 0.22) 12%,
    rgba(160, 185, 255, 0.14) 50%,
    rgba(160, 185, 255, 0.22) 88%,
    rgba(160, 185, 255, 0.00) 100%
  );
}

.item {
  position: relative;
  padding: 22px 0 40px;
}

.marker {
  position: absolute;
  left: 50%;
  top: 16px;
  transform: translateX(-50%);
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  z-index: 2;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(160, 185, 255, 0.18);
  border: 1px solid rgba(160, 185, 255, 0.42);
  box-shadow: 0 0 0 7px rgba(2, 4, 13, 0.52);
  transition: background 520ms ease, transform 520ms ease, box-shadow 520ms ease;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;

  /* enter animation base */
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 420ms ease, transform 420ms ease;
}

/* Mobile: keep line centered with media/copy flanking it */
.item.is-left .row {
  grid-template-areas: 'media copy';
  padding-right: 28px;
}

.item.is-right .row {
  grid-template-areas: 'copy media';
  padding-left: 28px;
}

.media {
  grid-area: media;
}

.copy {
  grid-area: copy;
  min-width: 0;
}

.item.is-visible .row {
  opacity: 1;
  transform: translateY(0);
}

.item.is-visible .dot {
  background: rgba(255, 46, 103, 0.62);
  transform: scale(1.06);
  box-shadow:
    0 0 0 7px rgba(2, 4, 13, 0.52),
    0 0 0 2px rgba(255, 46, 103, 0.12),
    0 10px 24px rgba(255, 46, 103, 0.20),
    0 0 22px rgba(255, 46, 103, 0.20);
}

/* Polaroid-style print */
.media {
  height: 160px;
  border-radius: 14px;

  /* creamy frame all around, thicker at bottom */
  padding: 10px;
  padding-bottom: 22px;

  /* allow the frame + shadow to exist (image itself clips) */
  overflow: visible;

  background: linear-gradient(180deg, rgba(255, 248, 233, 0.96), rgba(255, 242, 221, 0.92));
  box-shadow:
    0 18px 55px rgba(0, 0, 0, 0.38),
    0 0 0 1px rgba(255, 255, 255, 0.10) inset,
    0 0 22px rgba(255, 46, 103, 0.08);
}

.img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
}

/* Tiny tilt for “printed” feel */
.item.is-left .media {
  transform: rotate(-0.8deg);
}

.item.is-right .media {
  transform: rotate(0.8deg);
}

.copy {
  padding: 2px 2px 0;
}

.kicker {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(160, 185, 255, 0.70);
}

.title {
  margin: 6px 0 0;
  font-size: 16px;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: rgba(234, 240, 255, 0.98);
  overflow-wrap: anywhere;
}

.text {
  margin: 8px 0 0;
  color: rgba(234, 240, 255, 0.72);
  font-size: 14px;
  line-height: 1.5;
  max-width: 30ch;
}

/* Desktop-ish: alternate left/right around the line */
@media (min-width: 640px) {
  .timeline {
    padding: 18px 16px 8px;
  }

  .item {
    padding: 30px 0 54px;
  }

  .row {
    gap: 18px;
  }

  .item.is-left .row {
    padding-right: 22px;
  }

  .item.is-right .row {
    padding-left: 22px;
  }

  .media {
    height: 200px;
  }

  .copy {
    padding-top: 6px;
  }

  /* side slide on reveal (still subtle) */
  .item.is-left .row {
    transform: translateX(-10px);
  }

  .item.is-right .row {
    transform: translateX(10px);
  }

  .item.is-visible.is-left .row,
  .item.is-visible.is-right .row {
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .row {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .dot {
    transition: none;
  }
}
</style>
