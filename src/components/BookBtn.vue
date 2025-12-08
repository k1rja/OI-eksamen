<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
})

// Base-URL til Firebase
const BASE = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

const status = ref(0)            // 0 = ikke tilmeldt, 1 = tilmeldt
const loading = ref(false)
const error = ref('')

const showConfirm = ref(false)   // styrer modal
const pendingAction = ref(null)  // 'join' | 'leave' | null

// Beskyt mod manglende BASE, så vi ikke får undefined i fetch
const PATH = BASE
  ? `${BASE}/booking/${encodeURIComponent(props.id)}.json`
  : ''

onMounted(load)

async function load () {
  if (!PATH) return
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(PATH)
    if (!res.ok) throw new Error(`GET ${res.status} ${res.statusText}`)
    const data = await res.json()
    status.value = (data === 0 || data === 1) ? data : 0
  } catch (e) {
    console.error('[BookBtn][GET] failed:', e)
    error.value = 'Kunne ikke hente status.'
  } finally {
    loading.value = false
  }
}

// Åbn modal med korrekt "tilmelding/afmelding" kontekst
function openConfirm () {
  pendingAction.value = (status.value === 1) ? 'leave' : 'join'
  showConfirm.value = true
}

// Luk modal uden at gøre noget
function closeConfirm () {
  showConfirm.value = false
  pendingAction.value = null
}

// Kør toggle når brugeren bekræfter i modalen
async function confirmAction () {
  if (!pendingAction.value) return
  await toggleOnServer()
  closeConfirm()
}

// Ren toggle-funktion (PUT til Firebase)
async function toggleOnServer () {
  if (!PATH) return
  loading.value = true
  error.value = ''
  try {
    const next = (status.value === 1) ? 0 : 1
    const res = await fetch(PATH, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
    if (!res.ok) throw new Error(`PUT ${res.status} ${res.statusText}`)
    status.value = next
  } catch (e) {
    console.error('[BookBtn][PUT] failed:', e)
    error.value = 'Kunne ikke gemme status.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Primær knap på kortet -->
    <button
        type="button"
        class="adminBtn adminBtn--danger"
        @click="openConfirm"
        :disabled="loading || !PATH"
        >
        {{ status === 1 ? 'AFMELD' : 'TILMELD' }}
    </button>


  <!-- Bekræftelses-popup -->
  <div
    v-if="showConfirm"
    class="modal-backdrop"
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
    >
      <h2 class="modal__title">
        Bekræft din {{ pendingAction === 'join' ? 'tilmelding' : 'afmelding' }}
      </h2>

      <p
        v-if="pendingAction === 'join'"
        class="modal__text"
      >
        Skulle du blive forhindret, så husk at afmelde dig
        <strong> senest 12 timer før</strong>, så en anden kan tilmelde holdet.
      </p>

      <p
        v-else
        class="modal__text"
      >
        Ved afmeldelse af aktivitet risikerer du, at din plads går videre til en
        evt. venteliste – og du mister din plads.
      </p>

      <div class="modal__actions">
        <button
          type="button"
          class="btn btn--outline"
          @click="closeConfirm"
          :disabled="loading"
        >
          ANNULLER
        </button>

        <button
          type="button"
          class="btn btn--solid"
          @click="confirmAction"
          :disabled="loading"
        >
          {{ pendingAction === 'join' ? 'TILMELD' : 'AFMELD' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Evt. fejltekst -->
  <p
    v-if="error"
    class="error"
  >
    {{ error }}
  </p>
</template>

<style scoped lang="scss">
@use '../assets/_buttons.scss' as btn;
@use '../assets/_fonts.scss' as f;
@use '../assets/_colors.scss' as c;

/* ---------- KORT-KNAP (samme størrelse som adminBtn) ---------- */

.bookBtn {
  @include btn.button(btn.$button-primary); // samme config som adminBtn
  font-family: f.$font-primary;
  border: 0;
  cursor: pointer;
}

.bookBtn--active {
  background: c.$color-primary;
}

.bookBtn:disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
}

/* ---------- Modal styles (uændret) ---------- */

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  display: grid;
  place-items: center;
  z-index: 999;
}

.modal {
  width: min(640px, 92vw);
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

.modal__title {
  font-family: f.$font-secondary;
  color: c.$color-primary;
  font-weight: 600;
  font-size: clamp(24px, 3.2vw, 40px);
  line-height: 1.1;
  margin: 0 0 12px;
  text-align: center;
}

.modal__text {
  color: c.$color-primary;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 20px;
  text-align: center;
}

.modal__actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 8px;
}

/* knapper i modalen */
.btn {
  @include btn.button(btn.$button-primary);
  font-weight: 900;
}

.btn--outline {
  background: transparent;
  color: c.$cta;
  border: 3px solid c.$cta;
}

.btn--outline:hover {
  color: c.$color-tertiary;
  border-color: c.$color-tertiary;
  background-color: transparent;
}

.btn--solid {
  background: c.$cta;
  border: 0;
  color: c.$color-secondary;
}

/* fejltekst under knappen */
.error {
  margin-top: 10px;
  color: c.$color-secondary;
  font-size: 0.8rem;
}
</style>
