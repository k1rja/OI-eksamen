<script setup>
import { ref, computed, onMounted } from 'vue'
import BookBtn from '@/components/BookBtn.vue'
import { eventStartMs, dateKey, weekdayDa, formatDateDa } from '@/utils/date'

const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')
if (!DB_URL) {
  console.error('Mangler VITE_FIREBASE_DATABASE_URL i .env')
}

const events  = ref([])
const loading = ref(false)
const error   = ref('')

onMounted(load)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${DB_URL}/events.json`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const raw = await res.json() || {}

    events.value = Object.entries(raw)
      .map(([id, v]) => (v ? { id, ...v } : null))
      .filter(Boolean)
  } catch (e) {
    console.error(e)
    error.value = 'Kunne ikke hente hold.'
  } finally {
    loading.value = false
  }
}

const groups = computed(() => {
  const sorted = [...events.value].sort((a, b) => eventStartMs(a) - eventStartMs(b))
  const map = new Map()

  for (const ev of sorted) {
    const key = dateKey(ev)
    if (!map.has(key)) {
      const wd = ev?.date ? weekdayDa(ev.date) : ''
      const title = ev?.date
        ? `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${formatDateDa(ev.date)}`
        : 'Uden dato'
      map.set(key, { day: title, items: [] })
    }
    map.get(key).items.push(ev)
  }

  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, g]) => g)
})
</script>

<template>
  <main class="events">
    <header class="events__header">
      <h1 class="events__title">Holdoversigt</h1>
      <span v-if="loading" class="events__status">Henter…</span>
    </header>

    <p v-if="error" class="events__error">{{ error }}</p>
    <p v-else-if="!loading && !events.length" class="events__empty">
      Ingen hold endnu.
    </p>

    <section
      v-for="group in groups"
      :key="group.day"
      class="previewDay"
    >
      <h2 class="previewDay__title">{{ group.day }}</h2>

      <ul class="previewList">
        <li v-for="ev in group.items" :key="ev.id" class="previewCard">
          <div class="previewCard__main">
            <span class="previewCard__title">{{ ev.title ?? 'Uden titel' }}</span>
            <span class="previewCard__time">
              Kl. {{ ev.start || '—' }} – {{ ev.end || '—' }}
            </span>
            <span class="previewCard__location">{{ ev.location ?? '' }}</span>
            <span class="previewCard__price">
            {{ ev.priceText ?? (ev.price ? ev.price + ' kr.' : '') }}
            </span>
          </div>

          <div class="previewCard__actions">
            <BookBtn :id="ev.id" />
         </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<style lang="scss" scoped>
  @use '../assets/_colors.scss' as c;
  @use '../assets/_fonts.scss' as f;

  .events {
    font-family: f.$font-primary;
    background: c.$color-secondary;
    padding: 40px clamp(1.5rem, 5vw, 80px) 60px;
    display: grid;
    gap: 28px;
  }

  .events__header {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  .events__title {
    margin: 0;
    font-family: f.$font-secondary;
    font-size: 2rem;
    font-weight: 700;
    color: c.$color-primary;
  }

  .events__status {
    font-size: 0.95rem;
    opacity: 0.8;
  }

  .events__error {
    color: #b00020;
  }

  .events__empty {
    margin: 0;
  }

  .previewDay {
    display: grid;
    gap: 14px;
    margin: 0 0 24px;
  }

  .previewDay__title {
    margin: 0;
    font-family: f.$font-secondary;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: .2px;
    color: c.$color-primary;
  }

  .previewList {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 16px;
  }

  .previewCard {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 16px 18px;
    background: c.$color-secondary;
    border: 1px solid #c5c8d3;
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }

    &__main {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      min-width: 0;
      width: 100%;
    }

    &__title {
      font-weight: 800;
      font-size: 1rem;
      color: c.$color-primary;
    }

    &__time,
    &__location,
    &__price {
      font-size: 0.9rem;
      color: #1e1e1e;
      font-family: f.$font-primary;
    }

    &__actions {
      display: flex;
      justify-content: center;
      margin-top: 6px;

      :deep(button) {
        min-width: 130px;
        height: 44px;
        transform: scale(0.85);
        transform-origin: right center;
      }
    }
  }

  @media (min-width: 600px) {
    .events {
      gap: 32px;
    }

    .previewDay__title {
      font-size: 1.8rem;
    }

    .previewCard {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 18px;
      padding: 18px 22px;

      &__main {
        display: grid;
        grid-template-columns: 2fr 1.2fr 1fr 0.8fr;
        align-items: center;
        gap: 18px;
      }

      &__title {
        font-size: 1.1rem;
      }

      &__time,
      &__location,
      &__price {
        font-size: 0.98rem;
      }

      &__actions {
        margin-top: 0;

        :deep(button) {
          transform: none;
        }
      }
    }
  }

  @media (min-width: 1024px) {
    .events {
      padding-bottom: 80px;
    }
  }
</style>