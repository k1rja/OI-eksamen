<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import hero1 from '@/assets/images/hero-slides/fritidsaktivitet-hero.webp'
import hero2 from '@/assets/images/hero-slides/sauna-hero.webp'
import hero3 from '@/assets/images/hero-slides/aqualady.webp'
import hero4 from '@/assets/images/hero-slides/diskotet-hero.webp'
import hero5 from '@/assets/images/hero-slides/svoemmehal-hero.webp'

// DINE SLIDES (billede, valgfri overskrift/knap)
const slides = ref([
    {
        src: hero1, 
        title: 'Find din næste fritidsaktivitet',
        subtitle: 'Er du klar til at prøve noget nyt? Udforsk de mange spændende aktiviteter i Odense Kommune fra sport og kreativitet til fællesskab og fordybelse. Find den forening, der passer til dig',
        cta: { text: 'Undersøg', to: '/aktivitetsoversigt' } 
    },
    { 
        src: hero2, 
        title: 'Plads til selvforkælelse', 
        subtitle: 'Efter en travl hverdag fortjener du et pusterum. Til vores helseaftener kan du slappe af sammen i rolige omgivelser – med varmtvandsbassin, spa og saunagus. Nemt at booke, rart at være i.',
        cta: { text: 'Undersøg', to: '/' } 
    },
    { 
        src: hero3, 
        title: 'Billig og sjov træning i hverdagen', 
        subtitle: 'Har du brug for et energiboost uden at tømme kontoen? Vores aqua-hold giver dig en effektiv og sjov træning, der passer perfekt ind i en travl studiehverdag – til en pris, alle kan være med på.',
        cta: { text: 'Udforsk', to: '/events' } 
    },
    { 
        src: hero4, 
        title: 'Vil du være med til vanddiskotek?', 
        subtitle: 'Er du klar til at have det sjovt? Kom og vær med til noglefantastiske aftner i Højme Svømmehal. Vi inviterer alle børn og unge i alderen 8-14 år til at deltage i vores vanddiskotek.',
        cta: { text: 'Udforsk', to: '/events' } 
    },
    { 
        src: hero5, 
        title: 'Gør næste familiedag helt særlig', 
        subtitle: 'Skal I fejre en fødselsdag, samle vennerne eller holde en hyggedag? Vores private arrangementer i svømmehallen kan tilpasses jeres behov – nem booking, god stemning og masser af plads til både børn og voksne.',
        cta: { text: 'Udforsk', to: '/omos' } 
    },
])

const i = ref(0)
const intervalMs = 5000
let timerId = null

const next = () => { i.value = (i.value + 1) % slides.value.length }
const prev = () => { i.value = (i.value - 1 + slides.value.length) % slides.value.length }
const goTo = (idx) => { i.value = idx }

const start = () => { stop(); timerId = setInterval(next, intervalMs) }
const stop = () => { if (timerId) clearInterval(timerId); timerId = null }

onMounted(start)
onBeforeUnmount(stop)

// Pause ved hover/fokus
const onMouseEnter = stop
const onMouseLeave = start

// Touch-swipe
let touchX = 0
const onTouchStart = (e) => { touchX = e.touches[0].clientX }
const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) {
        if (dx < 0) {
            next()
        } else {
            prev()
        }
    }
}
</script>

<template>
  <section
    class="hero"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Slides -->
    <div class="track" :style="{ transform: `translateX(-${i * 100}%)` }">
      <article
        v-for="(s, idx) in slides"
        :key="idx"
        class="slide"
        role="group"
        :aria-label="`${idx + 1}/${slides.length}`"
      >

        <img class="bg" :src="s.src" :alt="s.title || 'Hero slide'" />

        <div class="content">
          <h1 v-if="s.title">{{ s.title }}</h1>
          <p v-if="s.subtitle" class="subtitle">{{ s.subtitle }}</p>
          <RouterLink v-if="s.cta" class="btn" :to="s.cta.to">{{ s.cta.text }}</RouterLink>
        </div>
      </article>
    </div>

    <!-- Pile -->
    <button class="nav prev" @click="prev">‹</button>
    <button class="nav next" @click="next">›</button>

    <!-- Dots -->
    <div class="dots">
      <button
        v-for="(s, idx) in slides"
        :key="idx"
        class="dot"
        :class="{ active: i === idx }"
        @click="goTo(idx)"
      />
    </div>
  </section>
</template>


<style scoped lang="scss">
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;
@use '../assets/_buttons.scss' as b;

.hero {
  position: relative;
  width: 100%;
  height: 75vh; 
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .track {
    display: flex;
    height: 100%;
    transition: transform .6s ease-in-out;
    will-change: transform;
  }

  .slide {
    position: relative;
    min-width: 100%;
    height: 100%;

    .bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: brightness(0.85);
    }

    .content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: c.$color-secondary;
      padding: 0 3rem;

      h1 {
        font-size: clamp(1.6rem, 4vw, 3rem);
        margin-bottom: 1rem;
      }

      .subtitle{
        line-height: 2rem;
      }

      .btn {
        @include b.button(b.$button-primary);
        margin: 2rem;
      }
    }
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 0;
    cursor: pointer;
    background: transparent;
    color: c.$color-secondary;
    font-size: 22px;
    display: grid;
    place-items: center;

    &:hover {
      background: rgba(0, 0, 0, 0.55);
    }

    &.prev {
      left: 12px;
    }

    &.next {
      right: 12px;
    }
  }

  .dots {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    display: flex;
    gap: 8px;
    z-index: 2;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      border: 0;
      cursor: pointer;

      &.active {
        background: c.$color-secondary;
        transform: scale(1.1);
      }
    }
  }
  
}

@media (min-width: 1024px) {
   .content {
    max-width: 800px;
    margin-inline: auto;
   } 
}
</style>
