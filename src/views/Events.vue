<script setup>
import { ref, computed, onMounted } from 'vue'
import BookBtn from '@/components/BookBtn.vue'
import { eventStartMs, dateKey, weekdayDa, formatDateDa } from '@/utils/date'

// Firebase base URL
const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')
if (!DB_URL) {
  console.error('Mangler VITE_FIREBASE_DATABASE_URL i .env')
}

// hvilken tab er aktiv: 'activities' eller 'events'
const activeTab = ref('events') // her giver det mening at starte på "Hold" på booking-siden

const events = ref([])      // hold
const activities = ref([])  // aktiviteter
const loading = ref(false)
const error = ref('')

// filtres state (samme som på forsiden – du kan fjerne dem, du ikke vil bruge her)
const filters = ref({
  kids: false,
  family: false,
  indoor: false,
  outdoor: false,
  highTempo: false,
  lowTempo: false,
  today: false,
  tomorrow: false,
  weekend: false,
})

onMounted(loadAll)

async function loadAll () {
  if (!DB_URL) return
  loading.value = true
  error.value = ''

  try {
    const [eventsRes, activitiesRes] = await Promise.all([
      fetch(`${DB_URL}/events.json`),
      fetch(`${DB_URL}/activities.json`),
    ])

    if (!eventsRes.ok || !activitiesRes.ok) {
      throw new Error('HTTP-fejl ved hentning af data')
    }

    const rawEvents = (await eventsRes.json()) || {}
    const rawActivities = (await activitiesRes.json()) || {}

    events.value = Object.entries(rawEvents)
      .map(([id, v]) => (v ? { id, ...v } : null))
      .filter(Boolean)

    activities.value = Object.entries(rawActivities)
      .map(([id, v]) => (v ? { id, ...v } : null))
      .filter(Boolean)
    } catch (e) {
    console.error(e)
    error.value = 'Kunne ikke hente aktiviteter og hold.'
    } finally {
    loading.value = false
    }
}

/* ---------- filtrering ---------- */

const hasAnyFilter = computed(() =>
  Object.values(filters.value).some(Boolean)
)

function resetFilters () {
  Object.keys(filters.value).forEach(k => {
    filters.value[k] = false
  })
}

/* TAG-fitre (AND-logik) */

function matchesTagFilters (item) {
  const f = filters.value
  const tags = Array.isArray(item.tags) ? item.tags : []

  const selected = []

  // fælles tags
  if (f.indoor) selected.push('indoor')
  if (f.outdoor) selected.push('outdoor')
  if (f.highTempo) selected.push('highTempo')
  if (f.lowTempo) selected.push('lowTempo')

  // kun aktiviteter
  if (activeTab.value === 'activities') {
    if (f.kids) selected.push('kids')
    if (f.family) selected.push('family')
  }

  // ingen tag-filtre valgt → alt vises
  if (!selected.length) return true

  // OR-logik: MINDEST én af de valgte tags skal matche
  return selected.some(tag => tags.includes(tag))
}


/* dato-filtre */

function parseDateStr (s) {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function stripTime (d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isToday (d) {
  const today = stripTime(new Date())
  return stripTime(d).getTime() === today.getTime()
}

function isTomorrow (d) {
  const t = new Date()
  t.setDate(t.getDate() + 1)
  const tomorrow = stripTime(t)
  return stripTime(d).getTime() === tomorrow.getTime()
}

function isWeekend (d) {
  const day = d.getDay()
  return day === 0 || day === 6
}

function matchesDateFilters (item) {
  const f = filters.value
  const anyDateFilter = f.today || f.tomorrow || f.weekend
  if (!anyDateFilter) return true

  const d = parseDateStr(item.date)
  if (!d) return false

  let ok = false
  if (f.today && isToday(d)) ok = true
  if (f.tomorrow && isTomorrow(d)) ok = true
  if (f.weekend && isWeekend(d)) ok = true
  return ok
}

/* sortering + samlet filtrering */

const sortedActivities = computed(() =>
  [...activities.value].sort((a, b) => eventStartMs(a) - eventStartMs(b))
)

const sortedEvents = computed(() =>
  [...events.value].sort((a, b) => eventStartMs(a) - eventStartMs(b))
)

const filteredItems = computed(() => {
  const list =
    activeTab.value === 'activities' ? sortedActivities.value : sortedEvents.value

  return list.filter(item => matchesTagFilters(item) && matchesDateFilters(item))
})

/* gruppering pr. dag */

function buildGroups (list) {
  const map = new Map()

  for (const ev of list) {
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
}

const groups = computed(() => buildGroups(filteredItems.value))

// helper til badges
function hasTag (item, tag) {
  return Array.isArray(item.tags) && item.tags.includes(tag)
}
</script>

<template>
  <main class="eventsPage wrapper">
        <header class="eventsPage__header">
            <h1 class="eventsPage__title">
                Book aktiviteter og hold
            </h1>
            <p class="eventsPage__intro">
                Her kan du få det fulde overblik over alle hold og aktiviteter i
                Odense Idrætspark. Brug filtrene til at finde det, der passer dig –
                og tilmeld dig direkte.
            </p>
        </header>

        <!-- Tabs + filter-knapper -->
        <section class="eventsPage__controls">
            <div class="eventsPage__tabs">

                <!-- Første tab: Aktiviteter -->
                <button
                type="button"
                class="eventsPage__tabBtn"
                :class="{ 'eventsPage__tabBtn--active': activeTab === 'activities' }"
                @click="activeTab = 'activities'"
                >
                    Aktiviteter
                </button>

                <!-- Anden tab: Hold -->
                <button
                type="button"
                class="eventsPage__tabBtn"
                :class="{ 'eventsPage__tabBtn--active': activeTab === 'events' }"
                @click="activeTab = 'events'"
                >
                    Hold
                </button>

            </div>
        </section>

        <div class="eventsPage__filtersInline">
            <!-- simple checkboxes inline – du kan style/forenkle som du vil -->
            <label
            v-if="activeTab === 'activities'"
            class="eventsPage__filterCheckbox"
            >
            <input v-model="filters.kids" type="checkbox" />
            <span>Børnevenlig</span>
            </label>
            <label
            v-if="activeTab === 'activities'"
            class="eventsPage__filterCheckbox"
            >
            <input v-model="filters.family" type="checkbox" />
            <span>Familievenlig</span>
            </label>
            <label class="eventsPage__filterCheckbox">
            <input v-model="filters.indoor" type="checkbox" />
            <span>Indendørs</span>
            </label>
            <label class="eventsPage__filterCheckbox">
            <input v-model="filters.outdoor" type="checkbox" />
            <span>Udendørs</span>
            </label>
            <label class="eventsPage__filterCheckbox">
            <input v-model="filters.highTempo" type="checkbox" />
            <span>Højt tempo</span>
            </label>
            <label class="eventsPage__filterCheckbox">
            <input v-model="filters.lowTempo" type="checkbox" />
            <span>Lavt tempo</span>
            </label>
            <label class="eventsPage__filterCheckbox">
            <input v-model="filters.today" type="checkbox" />
            <span>I dag</span>
            </label>
            <label class="eventsPage__filterCheckbox">
            <input v-model="filters.tomorrow" type="checkbox" />
            <span>I morgen</span>
            </label>
            <label class="eventsPage__filterCheckbox">
            <input v-model="filters.weekend" type="checkbox" />
            <span>I weekenden</span>
            </label>

            <button
                type="button"
                class="eventsPage__resetBtn"
                :disabled="!hasAnyFilter"
                @click="resetFilters"
                >
                Nulstil filtre
            </button>
      </div>
   

        <p v-if="error" class="eventsPage__error">{{ error }}</p>

        <p
        v-if="!loading && !error && !groups.length"
        class="eventsPage__empty"
        >
        Ingen
        {{ activeTab === 'events' ? 'hold' : 'aktiviteter' }}
        matcher de valgte filtre.
        </p>

        <!-- LISTE PR. DAG -->
        <section
            v-for="group in groups"
            :key="group.day"
            class="eventsPage__dayGroup"
            >
            <h2 class="eventsPage__dayTitle">
                {{ group.day }}
            </h2>

            <ul class="eventsPage__list">
                <li
                    v-for="item in group.items"
                    :key="item.id"
                    class="eventsPage__card"
                    >
                    <div class="eventsPage__cardMain">
                        <h3 class="eventsPage__cardTitle">
                        {{ item.title || 'Uden titel' }}
                        </h3>

                        <p class="eventsPage__cardMeta">
                        <span>
                            Kl. {{ item.start || '—' }} – {{ item.end || '—' }}
                        </span>
                        <span v-if="item.location">
                            • {{ item.location }}
                        </span>
                        <span v-if="item.priceText || item.price">
                            • {{ item.priceText ?? (item.price ? item.price + ' kr.' : '') }}
                        </span>
                        </p>

                        <p
                        v-if="item.lead || item.shortIntro"
                        class="eventsPage__cardLead"
                        >
                        {{ item.lead || item.shortIntro }}
                        </p>

                        <div class="eventsPage__cardTags">
                            <span v-if="hasTag(item, 'kids')" class="eventsPage__tag">
                                Børnevenlig
                            </span>
                            <span v-if="hasTag(item, 'family')" class="eventsPage__tag">
                                Familie
                            </span>
                            <span v-if="hasTag(item, 'indoor')" class="eventsPage__tag">
                                Indendørs
                            </span>
                            <span v-if="hasTag(item, 'outdoor')" class="eventsPage__tag">
                                Udendørs
                            </span>
                            <span v-if="hasTag(item, 'highTempo')" class="eventsPage__tag">
                                Højt tempo
                            </span>
                            <span v-if="hasTag(item, 'lowTempo')" class="eventsPage__tag">
                                Lavt tempo
                            </span>
                        </div>
                    </div>

                    <div class="eventsPage__cardActions">
                        <!-- Aktiviteter: link til mere info / booking -->
                        <a
                        v-if="activeTab === 'activities'"
                        class="eventsPage__cardLink"
                        :href="item.linkPath || item.url || '#'"
                        >
                        Læs mere
                        </a>

                        <!-- Hold: BookBtn som før -->
                        <BookBtn
                        v-else
                        :id="item.id"
                        />
                    </div>
                </li>
            </ul>
        </section>
    </main>
</template>

<style lang="scss" scoped>
@use '@/assets/_colors.scss' as c;
@use '@/assets/_fonts.scss' as f;

.wrapper {
  padding: 40px clamp(1.5rem, 5vw, 70px) 70px;
}

.eventsPage {
  display: grid;
  gap: 24px;
  font-family: f.$font-primary;
}

.eventsPage__header {
  display: grid;
  gap: 8px;
}

.eventsPage__title {
  margin: 0;
  font-family: f.$font-secondary;
  font-size: 1.8rem;
  color: c.$color-primary;
}

.eventsPage__intro {
  margin: 0;
  max-width: 48rem;
}

.eventsPage__controls {
  display: grid;
  gap: 10px;
}

.eventsPage__tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #d0d4e4;
  padding-bottom: 4px;
}

.eventsPage__tabBtn {
  border: none;
  background: transparent;
  font-family: f.$font-secondary;
  font-size: 1.1rem;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
  color: #252b45;
}

.eventsPage__tabBtn--active::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -4px;
  height: 3px;
  border-radius: 999px;
  background: c.$color-primary;
}

.eventsPage__tabBtn--active {
  font-weight: 700;
}

.eventsPage__filtersInline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  align-items: center;
}

.eventsPage__filterCheckbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.eventsPage__resetBtn {
  margin-left: auto;
  border-radius: 999px;
  padding: 6px 14px;
  border: 1px solid #d0d4e4;
  background: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

.eventsPage__resetBtn:disabled {
  opacity: 0.4;
  cursor: default;
}

/* fejl / tomt */

.eventsPage__error {
  color: #b00020;
}

.eventsPage__empty {
  margin: 0;
}

/* grupper */

.eventsPage__dayGroup {
  display: grid;
  gap: 12px;
}

.eventsPage__dayTitle {
  margin: 0;
  font-family: f.$font-secondary;
  font-size: 1.4rem;
  color: c.$color-primary;
}

.eventsPage__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

/* kort */

.eventsPage__card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  padding: 16px 18px;
  background: c.$color-secondary;
  border-radius: 14px;
  border: 1px solid #c5c8d3;
  box-shadow: 0 4px 10px rgba(0,0,0,0.18);
}

.eventsPage__cardMain {
  display: grid;
  gap: 6px;
}

.eventsPage__cardTitle {
  margin: 0;
  font-family: f.$font-secondary;
  font-weight: 800;
  font-size: 1rem;
  color: c.$color-primary;
}

.eventsPage__cardMeta {
  margin: 0;
  font-size: 0.9rem;
  color: #1e1e1e;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.eventsPage__cardLead {
  margin: 0;
  font-size: 0.9rem;
}

.eventsPage__cardTags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.eventsPage__tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef0ff;
}

.eventsPage__cardActions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.eventsPage__cardLink {
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 999px;
  background: c.$color-primary;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
}

/* responsiv */

@media (max-width: 700px) {
  .wrapper {
    padding-inline: clamp(1.25rem, 4vw, 2rem);
  }

  .eventsPage__card {
    grid-template-columns: 1fr;
  }

  .eventsPage__cardActions {
    justify-content: flex-start;
  }

  .eventsPage__resetBtn {
    margin-left: 0;
  }
}
</style>