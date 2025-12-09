<script setup>
import { ref, computed, onMounted } from 'vue'
import EventForm from '@/components/EventForm.vue'
import { eventStartMs } from '@/utils/date'

const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

const events = ref([])
const loading = ref(false)
const error = ref('')
const editing = ref(null)

// modal state
const showConfirm = ref(false)
const confirmAction = ref(null)   // 'edit' | 'delete'
const confirmTarget = ref(null)   // event-objektet

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

function onCreated(newEvent) {
  events.value.push({
    ...newEvent,
    tags: Array.isArray(newEvent.tags) ? newEvent.tags : [],
  })
}

async function onUpdated(updated) {
  if (!updated?.id) return

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

/* ---------- Modal logik ---------- */

function openConfirm(action, ev) {
  confirmAction.value = action
  confirmTarget.value = ev
  showConfirm.value = true
}

function closeConfirm() {
  showConfirm.value = false
  confirmAction.value = null
  confirmTarget.value = null
}

async function confirmActionNow() {
  if (!confirmTarget.value || !confirmAction.value) return

  if (confirmAction.value === 'edit') {
    editing.value = { ...confirmTarget.value }
  }

  if (confirmAction.value === 'delete') {
    await deleteEventOnServer(confirmTarget.value.id)
  }

  closeConfirm()
}

function onEdit(ev) {
  editing.value = { ...ev }  // direkte redigering, ingen modal
}


function onDelete(ev) {
  openConfirm('delete', ev)
}

async function deleteEventOnServer(id) {
  try {
    const res = await fetch(`${DB_URL}/events/${id}.json`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)

    events.value = events.value.filter(e => e.id !== id)

    // ryd bookinger for dette hold
    await fetch(`${DB_URL}/booking/${id}.json`, {
      method: 'DELETE',
    })
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
  
        <p v-if="error" class="msg msg--error">{{ error }}</p>
  
        <ul v-if="sortedEvents.length" class="calendar__items">
          <li v-for="ev in sortedEvents" :key="ev.id" class="calendar__item">
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
  
                <span
                  v-if="hasTag(ev, 'calm') || hasTag(ev, 'lowTempo')"
                  class="calendar__flag"
                >
                  Roligt tempo
                </span>
  
                <span
                  v-if="hasTag(ev, 'active') || hasTag(ev, 'highTempo')"
                  class="calendar__flag"
                >
                  Høj intensitet
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
                @click="onDelete(ev)"
              >
                Slet
              </button>
            </div>
          </li>
        </ul>
  
        <p v-else>Ingen hold oprettet endnu.</p>
      </section>
  
      <!-- BEKRÆFTELSES-MODAL -->
      <div v-if="showConfirm" class="adminModal">
        <div class="adminModal__backdrop" @click="closeConfirm" />
  
        <div class="adminModal__panel" role="dialog" aria-modal="true">
          <h3 class="adminModal__title">
            Bekræft handling
          </h3>
  
          <p class="adminModal__text">
            Er du sikker på, at du vil
            <strong>
              {{ confirmAction === 'delete' ? 'slette dette hold' : 'redigere dette hold' }}
            </strong>
            ?
          </p>
  
          <div class="adminModal__actions">
            <button
              type="button"
              class="adminBtn adminBtn--secondary"
              @click="closeConfirm"
            >
              Annuller
            </button>
  
            <button
              type="button"
              class="adminBtn"
              :class="confirmAction === 'delete' ? 'adminBtn--danger' : 'adminBtn--secondary'"
              @click="confirmActionNow"
            >
              Ja, {{ confirmAction === 'delete' ? 'slet' : 'redigér' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  
  <style scoped lang="scss">
  @use '../assets/_colors.scss' as c;
  @use '../assets/_fonts.scss' as f;
  
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
  
  /* ADMIN-KNAPPER – samme form som på resten af sitet */
  .adminBtn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 10px 26px;
    border-radius: 10px; // matcher Tilmeld/Afmeld
    font-size: 0.95rem;
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.2s ease;
    border: 2px solid c.$cta;
  }
  
  /* PRIMÆR (orange) – SLET */
  .adminBtn--danger {
    background: c.$cta;
    color: c.$color-secondary;
  
    &:hover {
      background: c.$color-tertiary;
      border-color: c.$color-tertiary;
      transform: translateY(-1px);
    }
  }
  
  /* SEKUNDÆR (hvid med orange kant) – REDIGÉR / annuller */
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
  
  /* ---------- ADMIN CONFIRM-MODAL (samme look som BookBtn-modal) ---------- */
  
  .adminModal {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: grid;
    place-items: center; // centrer boksen i viewport
  }
  
  .adminModal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, .35);
  }
  
  /* Selve boksen – kopieret fra .modal i BookBtn */
  .adminModal__panel {
    position: relative;
    width: min(640px, 92vw);          // samme bredde som booking-modal
    background: c.$color-secondary;
    border-radius: 14px;
    box-shadow:
      0 20px 40px rgba(0, 0, 0, .25),
      0 2px 6px rgba(0, 0, 0, .15);
    padding: 50px 40px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .adminModal__title {
    font-family: f.$font-secondary;
    color: c.$color-primary;
    font-weight: 600;
    font-size: clamp(24px, 3.2vw, 40px);
    line-height: 1.1;
    margin: 0 0 12px;
    text-align: center;
  }
  
  .adminModal__text {
    color: c.$color-primary;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 20px;
    text-align: center;
  }
  
  .adminModal__actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 8px;
  }
  </style>
  
  