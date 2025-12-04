<script setup>
import { ref, computed, onMounted } from 'vue'
import BookBtn from '@/components/BookBtn.vue'
import { eventStartMs, dateKey, weekdayDa, formatDateDa } from '@/utils/date'

const props = defineProps({
  width:  { type: String, default: '60vw' },
  height: { type: String, default: '50vh' },
})

const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

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

const VISIBLE_COUNT = 10
const showAll = ref(false)
const totalCount = computed(() => groups.value.reduce((sum, g) => sum + g.items.length, 0))

const groupsForView = computed(() => {
  if (showAll.value) return groups.value
  let remaining = VISIBLE_COUNT
  const out = []
  for (const g of groups.value) {
    if (remaining <= 0) break
    const take = g.items.slice(0, remaining)
    if (take.length) out.push({ day: g.day, items: take })
    remaining -= take.length
  }
  return out
})
</script>

<template>
    <section
      class="calendarPreview" :style="{ '--preview-w': width, '--preview-h': height }" aria-labelledby="calendarPreviewTitle">

      <aside class="calendarPreview__right">
        <h2 id="calendarPreviewTitle" class="info__title">
          Find din næste <span>aktivitet</span> her
        </h2>
        <p class="info__text">
          I Odense Idrætspark er der altid noget i gang. Vores mange hold
          og arrangementer dækker alt fra børneaktiviteter til seniortræning
          – og alt midt imellem. Tilmeld dig direkte og oplev, hvor nemt det
          er at være aktiv i fællesskab.
        </p>
        <a class="info__btn" href="/events">FIND AKTIVITET</a>
      </aside>
  
      <div class="calendarPreview__left">
        <div class="calendarPreview__scroll" role="region" aria-label="Aktivitetsliste">
          <template v-if="groupsForView.length">
            <section v-for="group in groupsForView" :key="group.day" class="previewDay">
              <h4 class="previewDay__title">{{ group.day }}</h4>
  
              <ul class="previewList">
                <li v-for="ev in group.items" :key="ev.id" class="previewCard">
                  <div class="previewCard__main">
                    <div class="previewCard__title">{{ ev.title ?? 'Uden titel' }}</div>
                    <div class="previewCard__meta">
                      <span>Kl. {{ ev.start || '—' }}–{{ ev.end || '—' }}</span>
                      <span v-if="ev.location"> • {{ ev.location }}</span>
                      <span v-if="ev.priceText || ev.price !== undefined">
                        • {{ ev.priceText ?? (ev.price + ' kr.') }}
                      </span>
                    </div>
                  </div>
  
                  <div class="previewCard__actions">
                    <BookBtn :id="ev.id" />
                  </div>
                </li>
              </ul>
            </section>
  
            <div
              v-if="!showAll && totalCount > VISIBLE_COUNT"
              class="previewMore">
              <button type="button" class="previewMore__btn" @click="showAll = true">
                Indlæs flere aktiviteter
              </button>
            </div>
          </template>
  
          <p v-else-if="!loading && !error" class="calendarPreview__empty">Ingen hold endnu.</p>
        </div>
      </div>
    </section>
  </template>

<style lang="scss" scoped>
    @use '../assets/_colors.scss' as c;
    @use '../assets/_fonts.scss' as f;
    @use '../assets/_buttons.scss' as btn;

    .calendarPreview {
        font-family: f.$font-primary;

        h1, h2, h3, h4, h5, h6,
        .info__title,
        .previewDay__title,
        .previewCard__title {
            font-family: f.$font-secondary;
        }

        border-radius: 14px;
        padding: 40px .25rem 40px .25rem;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-areas: "info" "list";
        gap: 28px;

        &__right { grid-area: info; }
        &__left  { grid-area: list; padding-left: 0; }

        &__title { margin: 0; font-weight: 800; font-size: 1rem; }
        &__meta  { display: flex; align-items: center; gap: 12px; }
        &__error { color: #b00020; }

        &__scroll {
            block-size: var(--list-h, 38vh);
            overflow-y: scroll;
            overflow-x: hidden;
            direction: rtl;
            padding: 8px 10px 12px 20px;

            .previewDay,
            .previewList,
            .calendarPreview__empty { direction: ltr; }

            scrollbar-gutter: stable both-edges;
            scrollbar-width: thin;
            scrollbar-color: #c2c7d1 transparent;

            &::-webkit-scrollbar { width: 10px; height: 10px; }
            &::-webkit-scrollbar-track { background: transparent; }
            &::-webkit-scrollbar-thumb {
            background: c.$color-secondary;
            border-radius: 8px;
            border: 2px solid transparent;
            background-clip: content-box;
            }

            &::-webkit-scrollbar-thumb:hover { background: #aeb5c2; }
        }
    }

    .previewDay {
        display: grid;
        gap: 14px;
        margin: 0 0 16px;
    }

    .previewDay__title {
        margin: 0;
        font-size: 1.5rem;
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
        display: grid;
        grid-template-columns: 1fr;   
        align-items: flex-start;
        gap: 12px;
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
            gap: 4px;
            min-width: 0;
        }

        &__title {
            font-weight: 800;
            font-size: 1.05rem;
            color: c.$color-primary;
        }

        &__meta {
            color: #3a3a3a;
            font-size: 0.95rem;
            font-family: f.$font-primary;
        }

        &__actions {
            margin-top: 6px;
            display: flex;
            justify-content: center;  
            align-items: center;

            :deep(button) {
            width: 100%;
            max-width: 220px;
            height: 40px;
            font-size: 0.9rem;
            }
        }
    }


    .previewMore {
        display: flex;
        justify-content: center;
        margin-top: 8px;

        &__btn {
            border: 0;
            cursor: pointer;
            padding: 10px 16px;
            border-radius: 12px;
            background: #e9efff;
            color: #1f3bb3;
            font-weight: 800;
            font-family: f.$font-primary;
            box-shadow: 0 6px 16px rgba(31,59,179,.18);

            &:hover { filter: brightness(.97); }
        }
    }

    .calendarPreview__right {
        align-self: start;
        justify-self: stretch;
        inline-size: 100%;
        border-radius: 16px;
        padding: 30px 22px;

        .info__title {
            margin: 0 0 12px;
            font-weight: 600;
            line-height: 1.25;
            color: c.$color-primary;

            span { font-weight: 900; }
        }

        .info__text {
            margin: 0 0 18px;
            color: c.$color-primary;
            line-height: 2rem;
            font-family: f.$font-primary;
        }

        .info__btn {
            @include btn.button(btn.$button-primary);
            font-family: f.$font-primary;
            box-shadow: 0 10px 20px rgba(243,115,65,.25);
            text-decoration: none;
        }
    }

    @media (min-width: 600px) {
        .calendarPreview {
            grid-template-columns: 0.9fr 1.6fr;
            grid-template-areas: "info list";
            gap: 40px;
        }

        .calendarPreview__left { padding-left: 0; }
        .calendarPreview__scroll { block-size: var(--list-h, 44vh); }

        .previewDay__title { font-size: 1.6rem; }

        .previewCard {
            grid-template-columns: 1fr auto; 
            align-items: center;
            gap: 18px;
        }

        .previewCard__actions {
            margin-top: 0;
            justify-content: flex-end;

            :deep(button) {
            width: auto;
            min-width: 130px;
            height: 44px;
            font-size: 1rem;
            }
        }
    }

    @media (min-width: 1024px) {
        .calendarPreview {
            padding-left: 70px;
            padding-right: 70px;
            grid-template-columns: 1fr 2fr;
            gap: 56px;
        }

        .calendarPreview__scroll { block-size: var(--list-h, 52vh); }
        .calendarPreview__right { 
            padding: 60px 0 0 0; 
        }
        .calendarPreview__left{ padding-bottom:30px;}

        .calendarPreview__right .info__btn {
            box-shadow: 0 10px 20px rgba(243,115,65,.3);
        }
        
    }
</style>