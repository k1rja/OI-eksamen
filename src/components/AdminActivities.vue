<script setup>
import { ref, onMounted } from 'vue'
import ActivityForm from '@/components/ActivityForm.vue'

const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

const activities = ref([])
const loading = ref(false)
const error = ref('')
const editing = ref(null)

function hasTag(act, key) {
  return Array.isArray(act.tags) && act.tags.includes(key)
}

async function load() {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(`${DB_URL}/activities.json`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const raw = (await res.json()) || {}

    activities.value = Object.entries(raw)
      .map(([id, v]) => ({
        id,
        ...v,
        tags: Array.isArray(v.tags) ? v.tags : [],
      }))
      .filter(Boolean)
  } catch (e) {
    console.error(e)
    error.value = 'Kunne ikke hente aktiviteter.'
  } finally {
    loading.value = false
  }
}

function onCreated(act) {
  activities.value.push(act)
}

function onUpdated(updated) {
  const i = activities.value.findIndex(a => a.id === updated.id)
  if (i !== -1) activities.value[i] = updated
  editing.value = null
}

function onEdit(act) {
  editing.value = { ...act }
}

async function onDelete(id) {
  if (!confirm('Vil du slette denne aktivitet?')) return
  try {
    const res = await fetch(`${DB_URL}/activities/${id}.json`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    activities.value = activities.value.filter(a => a.id !== id)
  } catch (e) {
    console.error(e)
    alert('Kunne ikke slette aktiviteten.')
  }
}

onMounted(load)
</script>

<template>
  <div class="adminGrid">
    <!-- VENSTRE: formular -->
    <section class="adminGrid__panel">
      <h2 class="adminGrid__title">
        {{ editing ? 'Redigér aktivitet' : 'Opret aktivitet' }}
      </h2>

      <ActivityForm
        :activity="editing"
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
      <header class="list__header">
        <h2>Aktivitetsoversigt</h2>
        <span v-if="loading">Henter…</span>
      </header>

      <p v-if="error" class="msg msg--error">{{ error }}</p>
      <p v-else-if="!loading && !activities.length">Ingen aktiviteter endnu.</p>

      <ul v-else class="list__items">
        <li v-for="act in activities" :key="act.id" class="card">
            <div class="card__main">
                <strong class="card__title">{{ act.title || 'Uden titel' }}</strong>

                <p v-if="act.lead" class="card__lead">{{ act.lead }}</p>

                <p class="card__meta">
                <span v-if="act.date">{{ act.date }}</span>
                <span v-if="act.start || act.end">
                    • {{ act.start || '—' }}–{{ act.end || '—' }}
                </span>
                <span v-if="act.location"> • {{ act.location }}</span>
                <span v-if="act.priceText"> • Pris: {{ act.priceText }}</span>
                </p>

                <div class="card__tags">
                    <span
                        v-if="hasTag(act, 'family')"
                        class="tag"
                    >
                        Familie
                    </span>

                    <span
                        v-if="hasTag(act, 'kids')"
                        class="tag"
                    >
                        Børn
                    </span>

                    <span
                        v-if="hasTag(act, 'indoor')"
                        class="tag"
                    >
                        Indendørs
                    </span>

                    <span
                        v-if="hasTag(act, 'outdoor')"
                        class="tag"
                    >
                        Udendørs
                    </span>

                    <!-- tempo – vi accepterer både calm/active OG lowTempo/highTempo -->
                    <span
                        v-if="hasTag(act, 'calm') || hasTag(act, 'lowTempo')"
                        class="tag"
                    >
                        Lavt tempo
                    </span>

                    <span
                        v-if="hasTag(act, 'active') || hasTag(act, 'highTempo')"
                        class="tag"
                    >
                        Højt tempo
                    </span>
                </div>

            </div>

          <div class="card__actions">
            <button
              type="button"
              class="adminBtn adminBtn--secondary"
              @click="onEdit(act)"
            >
              Redigér
            </button>
            <button
              type="button"
              class="adminBtn adminBtn--danger"
              @click="onDelete(act.id)"
            >
              Slet
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/_colors.scss' as c;

/* 2-kolonne layout */
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

/* overskrifter: Opret aktivitet + Aktivitetsoversigt */
.adminGrid__title,
.list__header h2 {
  margin: 0 0 10px;
  font-size: 1.4rem;
  font-weight: 700;
}

/* ekstra lille spacing til “Fortryd redigering” */
.adminGrid__cancel {
  margin-top: 8px;
}

/* ADMIN-KNAPPER (genbruges i flere admin-komponenter) */
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
  color: c.$color-secondary; // hvid

    &:hover {
        background: c.$color-tertiary;
        border-color: c.$color-tertiary;
        transform: translateY(-1px);
    }
}


/* --- SEKUNDÆR (hvid med orange kant) – bruges til REDIGÉR --- */
.adminBtn--secondary {
  background: #fefffe;
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

/* LISTE / KORT */

.list__header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}

.list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  padding: 16px 18px;
  background: c.$color-secondary;
  border-radius: 14px;
  border: 1px solid #c5c8d3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}


.card__title {
  font-weight: 700;
}

.card__lead {
  margin: 4px 0;
  font-size: 0.9rem;
}

.card__meta {
  font-size: 0.85rem;
  color: #444;
}

.card__tags {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef0ff;
}

.card__actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

/* små beskeder */
.msg {
  font-size: 0.85rem;
  margin-top: 4px;
}
.msg--error {
  color: #b00020;
}
</style>
