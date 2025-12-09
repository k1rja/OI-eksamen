<script setup>
import { ref, computed, onMounted } from 'vue'
import EventForm from '@/components/EventForm.vue'
import EventFilter from '@/components/EventFilter.vue'
import { eventStartMs } from '@/utils/date'

const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

const events = ref([])
const loading = ref(false)
const error = ref('')
const editing = ref(null)
const selectedTags = ref([])

function hasTag(ev, key) {
  return Array.isArray(ev.tags) && ev.tags.includes(key)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${DB_URL}/events.json`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const raw = (await res.json()) || {}

    events.value = Object.entries(raw)
      .map(([id, v]) => ({
        id,
        ...v,
        tags: Array.isArray(v.tags) ? v.tags : [],
      }))
      .filter(Boolean)
  } catch (e) {
    console.error(e)
    error.value = 'Kunne ikke hente hold.'
  } finally {
    loading.value = false
  }
}

const sortedEvents = computed(() =>
  [...events.value].sort((a, b) => eventStartMs(a) - eventStartMs(b))
)

const filteredEvents = computed(() => {
  if (!selectedTags.value.length) return sortedEvents.value
  return sortedEvents.value.filter(ev =>
    selectedTags.value.every(t => ev.tags.includes(t))
  )
})

function onCreated(newEvent) {
  events.value.push({
    ...newEvent,
    tags: Array.isArray(newEvent.tags) ? newEvent.tags : [],
  })
}

async function onUpdated(updated) {
  if (!updated?.id) return

  // EventForm sender kun payload – vi PATCH'er her
  const { id, ...payload } = updated

  try {
    const res = await fetch(`${DB_URL}/events/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)

    const i = events.value.findIndex(e => e.id === id)
    if (i !== -1) events.value[i] = { id, ...payload }

    editing.value = null
  } catch (e) {
    console.error(e)
    alert('Kunne ikke gemme ændringer.')
  }
}

function onEdit(ev) {
  editing.value = { ...ev }
}

async function onDelete(id) {
  if (!confirm('Slet hold?')) return

  try {
    const res = await fetch(`${DB_URL}/events/${id}.json`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    events.value = events.value.filter(e => e.id !== id)

    // ryd bookinger også, som du havde før
    const r2 = await fetch(`${DB_URL}/booking/${id}.json`, {
      method: 'DELETE',
    })
    if (!r2.ok) console.warn('Kunne ikke slette booking for id:', id)
  } catch (e) {
    console.error(e)
    alert('Noget gik galt ved sletning.')
  }
}

onMounted(load)
</script>

<template>
  <div class="adminGrid">
    <!-- VENSTRE: formular -->
    <section class="adminGrid__panel">
      <h2 class="adminGrid__title">
        {{ editing ? 'Redigér hold' : 'Opret hold' }}
      </h2>

      <EventForm
        :event="editing"
        @created="onCreated"
        @updated="onUpdated"
      />

      <button
        v-if="editing"
        type="button"
        class="adminBtn adminBtn--secondary adminGrid__cancel"
        @click="editing = null"
      >
        Fortryd redigering
      </button>
    </section>

    <!-- HØJRE: oversigt -->
    <section class="adminGrid__list">
      <header class="calendar__header">
        <h2 class="calendar__title">Holdoversigt</h2>
        <span v-if="loading">Henter…</span>
      </header>

      <EventFilter v-model:selectedTags="selectedTags" />

      <p v-if="error" class="msg msg--error">{{ error }}</p>

      <ul v-if="filteredEvents.length" class="calendar__items">
        <li v-for="ev in filteredEvents" :key="ev.id" class="calendar__item">
          <div class="calendar__itemMain">
                <strong class="calendar__name">
                {{ ev.title ?? 'Uden titel' }}
                </strong>

                <div class="calendar__meta">
                    <span>
                        {{ ev.date }} • {{ ev.start || '—' }}–{{ ev.end || '—' }}
                    </span>
                    <span v-if="ev.location"> • {{ ev.location }}</span>
                    <span v-if="ev.priceText"> • Pris: {{ ev.priceText }}</span>
                </div>

                <p v-if="ev.description" class="calendar__desc">
                {{ ev.description }}
                </p>

                <div class="calendar__flags">
                    <span
                        v-if="hasTag(ev, 'indoor')"
                        class="calendar__flag"
                    >
                        Indendørs
                    </span>

                    <span
                        v-if="hasTag(ev, 'outdoor')"
                        class="calendar__flag"
                    >
                        Udendørs
                    </span>

                    <!-- tempo – både calm/active og lowTempo/highTempo understøttes -->
                    <span
                        v-if="hasTag(ev, 'calm') || hasTag(ev, 'lowTempo')"
                        class="calendar__flag"
                    >
                        Lavt tempo
                    </span>

                    <span
                        v-if="hasTag(ev, 'active') || hasTag(ev, 'highTempo')"
                        class="calendar__flag"
                    >
                        Højt tempo
                    </span>
                </div>
            </div>

          <div class="calendar__actions">
            <button
              type="button"
              class="adminBtn adminBtn--secondary"
              @click="onEdit(ev)"
            >
              Redigér
            </button>
            <button
              type="button"
              class="adminBtn adminBtn--danger"
              @click="onDelete(ev.id)"
            >
              Slet
            </button>
          </div>
        </li>
      </ul>

      <p v-else>Ingen hold matcher filtrene.</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/_colors.scss' as c;

/* samme 2-kolonne layout som aktiviteter */
.adminGrid {
  display: grid;
  gap: 24px;
}

@media (min-width: 1024px) {
  .adminGrid {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    align-items: flex-start;
  }
}

/* overskrifter: Opret hold + Holdoversigt */
.adminGrid__title,
.calendar__title {
  margin: 0 0 10px;
  font-size: 1.4rem;
  font-weight: 700;
}

.adminGrid__cancel {
  margin-top: 8px;
}

/* Basis – samme form som Tilmeld/Afmeld */
.adminBtn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px 26px;
  border-radius: 10px;       // matcher Tilmeld/Afmeld
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s ease;
  border: 2px solid c.$cta; 
}


/* --- PRIMÆR (orange) – bruges til SLET --- */
.adminBtn--danger {
  background: c.$cta;
  color: c.$color-secondary;

    &:hover {
        background: c.$color-tertiary;
        border-color: c.$color-tertiary;
        transform: translateY(-1px);
    }
}


/* --- SEKUNDÆR (hvid med orange kant) – bruges til REDIGÉR --- */
.adminBtn--secondary {
  background: c.$color-secondary;
  border: 3px solid c.$cta;
  color: c.$cta;

  &:hover {
    border-color: c.$color-tertiary;
    color: c.$color-tertiary;
    transform: translateY(-1px);
  }
}


/* Hvis du vil have en "fuld bredde" knap (fx i formularer) */
.adminBtn--full {
  width: 100%;
}


/* LISTE / KORT FOR HOLD */

.calendar__header {
  display: flex;
  gap: 12px;
  align-items: baseline;
  justify-content: space-between;
}

.calendar__items {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.calendar__item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 14px;
  background: c.$color-secondary;
  border: 1px solid #c5c8d3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}


.calendar__meta {
  font-size: 0.9rem;
  color: #555;
}

.calendar__desc {
  font-size: 0.9rem;
  margin-top: 4px;
}

.calendar__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calendar__flags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.calendar__flag {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 999px;
  background: #eef2ff;
}

/* responsiv stacking */
@media (max-width: 1024px) {
  .calendar__item {
    flex-direction: column;
  }

  .calendar__actions {
    flex-direction: row;
    justify-content: flex-start;
  }
}

/* beskeder */
.msg {
  font-size: 0.85rem;
  margin-top: 4px;
}
.msg--error {
  color: #b00020;
}
</style>
