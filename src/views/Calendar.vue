<script setup>
import { ref, computed, onMounted } from 'vue'
import EventForm from '../components/EventForm.vue'
import { eventStartMs } from '../utils/date'

const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

const events = ref([])
const loading = ref(false)
const error = ref('')

const editingEvent = ref(null)

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

onMounted(load)

const sortedEvents = computed(() =>
  [...events.value].sort((a, b) => eventStartMs(a) - eventStartMs(b))
)

function onCreated(newEvent) {
  if (!newEvent?.id) return
  events.value.push(newEvent)
}

function onEdit(ev) {
  editingEvent.value = { ...ev }
}
function cancelEdit() {
  editingEvent.value = null
}

async function onUpdated(updated) {
  if (!updated?.id) return

  const priceText = updated.priceText ?? ''
  const price = clamp0(parsePrice(priceText))

  const { id, ...payload } = {
    ...updated,
    priceText,
    price,
  }

  try {
    const res = await fetch(`${DB_URL}/events/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)

    const i = events.value.findIndex(e => e.id === id)
    if (i !== -1) events.value[i] = { id, ...payload }

    editingEvent.value = null
  } catch (e) {
    console.error(e)
    alert('Kunne ikke gemme ændringer.')
  }
}

async function onDelete(id) {
  if (!confirm('Slet hold?')) return
  const res = await fetch(`${DB_URL}/events/${id}.json`, { method: 'DELETE' })
  if (!res.ok) return alert('Kunne ikke slette hold.')
  events.value = events.value.filter(e => e?.id !== id)
  const r2 = await fetch(`${DB_URL}/booking/${id}.json`, { method: 'DELETE' })
  if (!r2.ok) console.warn('Kunne ikke slette booking for id:', id)
}

function parsePrice(txt) {
  if (txt == null) return 0
  const s = String(txt).replace(',', '.')
  const m = s.match(/(\d+(\.\d+)?)/)
  return m ? Number(m[1]) : 0
}
const clamp0 = (n) => (Number.isFinite(n) && n > 0 ? n : 0)
</script>

<template>
  <main class="calendar">
    <section v-if="!editingEvent" class="panel">
      <EventForm @created="onCreated" />
    </section>

    <section v-else class="panel">
      <h2>Redigér hold</h2>
      <EventForm :event="editingEvent" @updated="onUpdated" />
      <div class="panel__actions">
        <button type="button" @click="cancelEdit">Fortryd redigering</button>
      </div>
    </section>

    <hr class="calendar__divider" />

    <section class="calendar__list">
      <header class="calendar__header">
        <h2 class="calendar__title">Holdoversigt</h2>
        <span v-if="loading">Henter…</span>
      </header>

      <p v-if="error" class="calendar__error">{{ error }}</p>

      <ul v-if="sortedEvents.length" class="calendar__items">
        <li v-for="event in sortedEvents" :key="event.id" class="calendar__item">
          <div class="calendar__itemMain">
            <strong class="calendar__name">{{ event.title ?? 'Uden titel' }}</strong>
            <div class="calendar__meta">
              <span>{{ event.date }} • {{ event.start || '—' }}–{{ event.end || '—' }}</span>
              <span v-if="event.location"> • {{ event.location }}</span>
              <span v-if="event.priceText || event.price !== undefined">
                • Pris: {{ event.priceText ?? (event.price + ' kr.') }}
              </span>
            </div>
            <p v-if="event.description" class="calendar__desc">{{ event.description }}</p>
          </div>

          <div class="calendar__actions">
            <button @click="onEdit(event)">Rediger</button>
            <button @click="onDelete(event.id)">Slet</button>
          </div>
        </li>
      </ul>

      <p v-else>Ingen hold endnu.</p>
    </section>
  </main>
</template>

<style scoped>
.calendar { 
  display: grid; 
  gap: 24px; 
  padding: 24px; 
}

.calendar__divider { 
  border: none; 
  border-top: 1px solid #eee; 
}

.calendar__header { 
  display: flex; 
  gap: 12px; 
  align-items: baseline; 
}

.calendar__items { 
  list-style: none; 
  margin: 0; 
  padding: 0; 
  display: grid; 
  gap: 10px; 
}

.calendar__item {
  display: flex; 
  justify-content: space-between; 
  gap: 16px;
  padding: 12px; 
  border: 1px solid #eee; 
  border-radius: 12px;
}

.calendar__actions { 
  display: flex; 
  gap: 8px; 
}

.calendar__error { 
  color: #b00020; 
}

.panel { 
  padding: 16px; 
  border: 1px solid #e6e6e6; 
  border-radius: 12px; 
}

.panel__actions { 
  margin-top: 8px; 
}
</style>