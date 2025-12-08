<script setup>
import { ref, computed, onMounted } from 'vue'
import BookBtn from '@/components/BookBtn.vue'
import InfoDialog from '@/components/InfoDialog.vue'
import { eventStartMs, dateKey, weekdayDa, formatDateDa } from '@/utils/date'

// Firebase base URL
const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')
if (!DB_URL) {
  console.error('Mangler VITE_FIREBASE_DATABASE_URL i .env')
}

// hvilken tab er aktiv: 'activities' eller 'events'
const activeTab = ref('activities')

// vis / skjul filter-boks
const showFilter = ref(false)

const events = ref([])      // hold
const activities = ref([])  // aktiviteter
const loading = ref(false)
const error = ref('')

// filter-state
const filters = ref({
  kids: false,       // Børnevenligt (kun aktiviteter)
  family: false,     // Familievenligt (kun aktiviteter)
  indoor: false,
  outdoor: false,
  highTempo: false,  // maps til tag 'active'
  lowTempo: false,   // maps til tag 'calm'
  today: false,
  tomorrow: false,
  weekend: false,
})

onMounted(() => {
  loadAll()
})

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

/* ---------- helpers til filtrering ---------- */

const hasAnyFilter = computed(() =>
  Object.values(filters.value).some(Boolean)
)

function resetFilters () {
  Object.keys(filters.value).forEach(k => {
    filters.value[k] = false
  })
}

function closeFilter () {
  showFilter.value = false
}

function toggleTab (tab) {
  activeTab.value = tab
}

/* TAG-fitre (AND-logik) */

function matchesTagFilters (item) {
  const f = filters.value
  const tags = Array.isArray(item.tags) ? item.tags : []

  const required = []

  // fælles tags
  if (f.indoor) required.push('indoor')
  if (f.outdoor) required.push('outdoor')
  if (f.highTempo) required.push('active') // høj intensitet
  if (f.lowTempo) required.push('calm')    // roligt tempo

  // kun aktiviteter
  if (activeTab.value === 'activities') {
    if (f.kids) required.push('kids')
    if (f.family) required.push('family')
  }

  if (!required.length) return true
  return required.every(tag => tags.includes(tag))
}

/* Dato-filtre (OR-logik mellem i dag / i morgen / i weekenden) */

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
  const day = d.getDay() // 0 = søndag, 6 = lørdag
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

/* samlet filtrering + sortering */

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

// lille helper til badges i kortene
function hasTag (item, tag) {
  return Array.isArray(item.tags) && item.tags.includes(tag)
}
</script>

<template>
  <section
    class="homeSchedule"
    aria-labelledby="homeScheduleTitle"
  >
    <!-- INFO-TEKST -->
    <aside class="homeSchedule__info">
      <h2 id="homeScheduleTitle" class="homeSchedule__infoTitle">
        Find din næste <span>aktivitet eller dit næste hold</span> her
      </h2>

      <p class="homeSchedule__infoText">
        I Odense Idrætspark er der altid noget i gang. Vores mange aktiviteter
        og hold dækker alt fra børneaktiviteter til seniortræning – og alt midt
        imellem. Brug filtrene til at finde præcis det, der passer til dig, og
        tilmeld dig direkte.
      </p>

      <a class="homeSchedule__infoBtn" href="/events">
        FIND HOLD 
      </a>
    </aside>

    <!-- LISTE + TABS + FILTRERING -->
    <div class="homeSchedule__list">
      <header class="homeSchedule__tabs">
        <div class="homeSchedule__tabButtons">
          <button
            type="button"
            class="homeSchedule__tabBtn"
            :class="{ 'homeSchedule__tabBtn--active': activeTab === 'activities' }"
            @click="toggleTab('activities')"
          >
            Aktivitet
          </button>
          <button
            type="button"
            class="homeSchedule__tabBtn"
            :class="{ 'homeSchedule__tabBtn--active': activeTab === 'events' }"
            @click="toggleTab('events')"
          >
            Hold
          </button>
        </div>

        <button
          type="button"
          class="homeSchedule__filterBtn"
          @click="showFilter = true"
        >
          Filtrér
        </button>
      </header>

      <p v-if="error" class="homeSchedule__error">{{ error }}</p>

      <p
        v-if="!loading && !error && !groups.length"
        class="homeSchedule__empty"
      >
        Ingen {{ activeTab === 'activities' ? 'aktiviteter' : 'hold' }} matcher
        de valgte filtre.
      </p>

      <section
        v-for="group in groups"
        :key="group.day"
        class="homeSchedule__dayGroup"
      >
        <h3 class="homeSchedule__dayTitle">
          {{ group.day }}
        </h3>

        <ul class="homeSchedule__dayList">
          <li
            v-for="item in group.items"
            :key="item.id"
            class="homeSchedule__card"
          >
            <div class="homeSchedule__cardMain">
              <div class="homeSchedule__cardTitle">
                {{ item.title || 'Uden titel' }}
              </div>

              <div class="homeSchedule__cardMeta">
                <span>
                  Kl. {{ item.start || '—' }} – {{ item.end || '—' }}
                </span>
                <span v-if="item.location">
                  • {{ item.location }}
                </span>
                <span v-if="item.priceText || item.price">
                  • {{ item.priceText ?? (item.price ? item.price + ' kr.' : '') }}
                </span>
              </div>

              <p
                v-if="item.lead || item.shortIntro"
                class="homeSchedule__cardLead"
              >
                {{ item.lead || item.shortIntro }}
              </p>

              <div class="homeSchedule__cardTags">
                <span v-if="hasTag(item, 'kids')" class="homeSchedule__tag">
                  Børnevenlig
                </span>
                <span v-if="hasTag(item, 'family')" class="homeSchedule__tag">
                  Familievenlig
                </span>
                <span v-if="hasTag(item, 'indoor')" class="homeSchedule__tag">
                  Indendørs
                </span>
                <span v-if="hasTag(item, 'outdoor')" class="homeSchedule__tag">
                  Udendørs
                </span>
                <span v-if="hasTag(item, 'active')" class="homeSchedule__tag">
                  Høj intensitet
                </span>
                <span v-if="hasTag(item, 'calm')" class="homeSchedule__tag">
                  Lavt tempo
                </span>
              </div>
            </div>

            <div class="homeSchedule__cardActions">
              <!-- Info-popup (både for aktiviteter og hold) -->
              <InfoDialog
                :item="item"
                :type-label="activeTab === 'activities' ? 'Aktivitet' : 'Hold'"
                button-label="Info"
              />

              <!-- For aktiviteter kan du evt. stadig have et link -->
              <a
                v-if="activeTab === 'activities' && (item.linkPath || item.url)"
                class="homeSchedule__cardLink"
                :href="item.linkPath || item.url"
              >
                Læs mere
              </a>

              <!-- Tilmeld-knap kun på hold -->
              <BookBtn
                v-if="activeTab === 'events'"
                :id="item.id"
              />
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- FILTER MODAL -->
    <div v-if="showFilter" class="filterModal">
      <div class="filterModal__backdrop" @click="closeFilter" />

      <div class="filterModal__panel">
        <header class="filterModal__header">
          <h3>Filtrér</h3>
          <button
            type="button"
            class="filterModal__close"
            @click="closeFilter"
          >
            ✕
          </button>
        </header>

        <div class="filterModal__section">
          <h4>Kendetegn</h4>

          <label
            v-if="activeTab === 'activities'"
            class="filterCheckbox"
          >
            <input
              v-model="filters.kids"
              type="checkbox"
            />
            <span>Børnevenligt</span>
          </label>

          <label
            v-if="activeTab === 'activities'"
            class="filterCheckbox"
          >
            <input
              v-model="filters.family"
              type="checkbox"
            />
            <span>Familievenligt</span>
          </label>

          <label class="filterCheckbox">
            <input
              v-model="filters.indoor"
              type="checkbox"
            />
            <span>Indendørs</span>
          </label>

          <label class="filterCheckbox">
            <input
              v-model="filters.outdoor"
              type="checkbox"
            />
            <span>Udendørs</span>
          </label>

          <label class="filterCheckbox">
            <input
              v-model="filters.highTempo"
              type="checkbox"
            />
            <span>Høj intensitet</span>
          </label>

          <label class="filterCheckbox">
            <input
              v-model="filters.lowTempo"
              type="checkbox"
            />
            <span>Roligt tempo</span>
          </label>
        </div>

        <div class="filterModal__section">
          <h4>Tidspunkt</h4>

          <label class="filterCheckbox">
            <input
              v-model="filters.today"
              type="checkbox"
            />
            <span>I dag</span>
          </label>

          <label class="filterCheckbox">
            <input
              v-model="filters.tomorrow"
              type="checkbox"
            />
            <span>I morgen</span>
          </label>

          <label class="filterCheckbox">
            <input
              v-model="filters.weekend"
              type="checkbox"
            />
            <span>I weekenden</span>
          </label>
        </div>

        <footer class="filterModal__footer">
          <button
            type="button"
            class="btn btn--ghost"
            :disabled="!hasAnyFilter"
            @click="resetFilters"
          >
            Nulstil
          </button>

          <button
            type="button"
            class="btn btn--primary"
            @click="closeFilter"
          >
            Gem
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/_colors.scss' as c;
@use '@/assets/_fonts.scss' as f;
@use '@/assets/_buttons.scss' as btn;

.homeSchedule {
  font-family: f.$font-primary;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "info"
    "list";
  gap: 28px;
  padding: 40px clamp(1.5rem, 5vw, 70px);
  border-radius: 14px;
}

/* INFO-kolonne */

.homeSchedule__info {
  grid-area: info;
  align-self: start;
}

.homeSchedule__infoTitle {
  margin: 0 0 12px;
  font-family: f.$font-secondary;
  font-weight: 600;
  line-height: 1.25;
  color: c.$color-primary;

  span {
    font-weight: 900;
  }
}

.homeSchedule__infoText {
  margin: 0 0 18px;
  color: c.$color-primary;
  line-height: 1.9rem;
}

.homeSchedule__infoBtn {
  @include btn.button(btn.$button-primary);
  font-family: f.$font-primary;
  text-decoration: none;
  box-shadow: 0 10px 20px rgba(243, 115, 65, 0.25);
}

/* LISTE-kolonne */

.homeSchedule__list {
  grid-area: list;
  display: grid;
  gap: 18px;
}

/* tabs + filter */

.homeSchedule__tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d0d4e4;
  padding-bottom: 4px;
}

.homeSchedule__tabButtons {
  display: flex;
  gap: 24px;
}

.homeSchedule__tabBtn {
  border: none;
  background: transparent;
  font-family: f.$font-secondary;
  font-size: 1.1rem;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
  color: #252b45;
}

.homeSchedule__tabBtn--active::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -4px;
  height: 3px;
  border-radius: 999px;
  background: c.$color-primary;
}

.homeSchedule__tabBtn--active {
  font-weight: 700;
}

.homeSchedule__filterBtn {
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: #252b45;
}

/* fejl / empty */

.homeSchedule__error {
  color: #b00020;
}

.homeSchedule__empty {
  margin: 0;
}

/* dags-grupper */

.homeSchedule__dayGroup {
  display: grid;
  gap: 10px;
}

.homeSchedule__dayTitle {
  margin: 0;
  font-family: f.$font-secondary;
  font-size: 1.4rem;
  font-weight: 700;
  color: c.$color-primary;
}

.homeSchedule__dayList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

/* kort */

.homeSchedule__card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  padding: 16px 18px;
  background: c.$color-secondary;
  border-radius: 14px;
  border: 1px solid #c5c8d3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

.homeSchedule__cardMain {
  display: grid;
  gap: 6px;
}

.homeSchedule__cardTitle {
  font-family: f.$font-secondary;
  font-weight: 800;
  font-size: 1rem;
  color: c.$color-primary;
}

.homeSchedule__cardMeta {
  font-size: 0.9rem;
  color: #1e1e1e;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.homeSchedule__cardLead {
  margin: 0;
  font-size: 0.9rem;
}

.homeSchedule__cardTags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.homeSchedule__tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef0ff;
}

/* allerede i din <style scoped lang="scss"> ... */

.homeSchedule__cardActions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Gør ALLE knapper inde i actions lige så store som adminBtn */
.homeSchedule__cardActions :deep(button) {
  @include btn.button(btn.$button-primary);  // samme mixin som adminBtn
  font-family: f.$font-primary;
}

/* INFO-knappen skal være “outline” men beholde størrelse */
.homeSchedule__cardActions :deep(.infoDialog__btn) {
  background: c.$color-secondary;
  color: c.$cta;
  border: 3px solid c.$cta;
}


.homeSchedule__cardLink {
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 999px;
  background: c.$color-primary;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
}

/* filter-modal */

.filterModal {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.filterModal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
}

.filterModal__panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 90vw);
  background: #fff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.18);
  padding: 20px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filterModal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filterModal__header h3 {
  margin: 0;
  font-family: f.$font-secondary;
  font-size: 1.2rem;
}

.filterModal__close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
}

.filterModal__section {
  border-top: 1px solid #e2e4f0;
  padding-top: 10px;
}

.filterModal__section h4 {
  margin: 0 0 8px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #7a7f93;
}

.filterCheckbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.filterCheckbox input {
  width: 16px;
  height: 16px;
}

.filterModal__footer {
  margin-top: auto;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}

.btn--primary {
  border: none;
  background: c.$color-primary;
  color: #fff;
}

.btn--ghost {
  border: 1px solid #d0d4e4;
  background: #fff;
  color: #252b45;
}

.btn--ghost:disabled {
  opacity: 0.4;
  cursor: default;
}

/* responsive */

@media (max-width: 680px) {
  .homeSchedule {
    padding-inline: clamp(1.25rem, 4vw, 2rem);
  }

  .homeSchedule__card {
    grid-template-columns: 1fr;
  }

  .homeSchedule__cardActions {
    justify-content: flex-start;
  }
}

@media (min-width: 900px) {
  .homeSchedule {
    grid-template-columns: 0.9fr 1.6fr;
    grid-template-areas: "info list";
  }
}
</style>
