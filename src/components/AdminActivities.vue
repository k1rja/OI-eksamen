<script setup>
  import { ref, onMounted } from 'vue'
  import ActivityForm from '@/components/ActivityForm.vue'
  import { formatDateDa } from '@/utils/date'
  
  const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')
  
  const activities = ref([])
  const loading = ref(false)
  const error = ref('')
  const editing = ref(null)
  
  // modal-state til sletning
  const showConfirm = ref(false)
  const confirmTarget = ref(null) 
  
  function hasTag(act, key) {
    return Array.isArray(act.tags) && act.tags.includes(key)
  }
  
  async function load () {
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
  
  function onCreated (act) {
    activities.value.push({
      ...act,
      tags: Array.isArray(act.tags) ? act.tags : [],
    })
  }
  
  async function onUpdated(updated) {
  if (!updated?.id) return

  const { id, ...payload } = updated

  try {
    const res = await fetch(`${DB_URL}/activities/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)

    // opdater lokalt, så listen også ændrer sig uden reload
    const i = activities.value.findIndex(a => a.id === id)
    if (i !== -1) activities.value[i] = { id, ...payload }

    editing.value = null
  } catch (e) {
    console.error(e)
    alert('Kunne ikke gemme ændringer.')
  }
}

  
  function onEdit (act) {
    editing.value = { ...act }
  }
  
  // Åbn modal til sletning
  function onDelete (act) {
    confirmTarget.value = act
    showConfirm.value = true
  }
  
  // Luk modal
  function closeConfirm () {
    showConfirm.value = false
    confirmTarget.value = null
  }
  
  // sletning på server
  async function deleteActivityOnServer (id) {
    if (!id) return
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
  
  async function confirmDeleteNow () {
    if (!confirmTarget.value) return
    await deleteActivityOnServer(confirmTarget.value.id)
    closeConfirm()
  }
  
  onMounted(load)
</script>

<template>
  <div class="adminGrid">
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

            <p class="card__meta">
              <span v-if="act.date">{{ formatDateDa(act.date) }}</span>
              <span v-if="act.start || act.end">
                • {{ act.start || '—' }}–{{ act.end || '—' }}
              </span>
              <span v-if="act.location"> • {{ act.location }}</span>
              <span v-if="act.priceText"> • Pris: {{ act.priceText }}</span>
            </p>

            <div class="card__tags">
              <span v-if="hasTag(act, 'family')" class="tag">Familie</span>
              <span v-if="hasTag(act, 'kids')" class="tag">Børn</span>
              <span v-if="hasTag(act, 'indoor')" class="tag">Indendørs</span>
              <span v-if="hasTag(act, 'outdoor')" class="tag">Udendørs</span>
              <span
                v-if="hasTag(act, 'calm') || hasTag(act, 'lowTempo')"
                class="tag"
              >
                Roligt tempo
              </span>
              <span
                v-if="hasTag(act, 'active') || hasTag(act, 'highTempo')"
                class="tag"
              >
                Høj intensitet
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
              @click="onDelete(act)"
            >
              Slet
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- BEKRÆFTELSES-MODAL (samme stil som ved hold) -->
    <div v-if="showConfirm" class="adminModal">
      <div class="adminModal__backdrop" @click="closeConfirm" />
      <div class="adminModal__panel" role="dialog" aria-modal="true">
        <h3 class="adminModal__title">Bekræft handling</h3>

        <p class="adminModal__text">
          Er du sikker på, at du vil
          <strong>slette denne aktivitet?</strong>
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
            class="adminBtn adminBtn--danger"
            @click="confirmDeleteNow"
          >
            Slet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<style scoped lang="scss">
  @use '../assets/_colors.scss' as c;
  @use '../assets/_fonts.scss' as f;
  
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
  
  .adminGrid__title,
  .list__header h2 {
    margin: 0 0 10px;
    font-size: 1.4rem;
    font-weight: 700;
  }
  
  .adminGrid__cancel {
    margin-top: 8px;
  }
  
  .adminBtn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 10px 26px;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.2s ease;
    border: 2px solid c.$cta;
    min-width: 130px; 
  }
  
  .adminBtn--danger {
    background: c.$cta;
    color: c.$color-secondary;
  
    &:hover {
      background: c.$color-tertiary;
      border-color: c.$color-tertiary;
      transform: translateY(-1px);
    }
  }
  
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
  
  .adminBtn--full {
    width: 100%;
  }
  
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
  
  /* beskeder */
  .msg {
    font-size: 0.85rem;
    margin-top: 4px;
  }
  .msg--error {
    color: #b00020;
  }
  
  .adminModal {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: grid;
    place-items: center;
  }
  
  .adminModal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }
  
  .adminModal__panel {
    position: relative;
    width: min(640px, 92vw);
    background: c.$color-secondary;
    border-radius: 14px;
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.25),
      0 2px 6px rgba(0, 0, 0, 0.15);
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
  