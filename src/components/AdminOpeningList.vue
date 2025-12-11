<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import OpeningChangesForm from "@/components/OpeningChangesForm.vue";
  import {
    listenOpeningChanges,
    getFacilityNameById,
    deleteOpeningChange,
  } from "@/stores/openingHoursStore";
  import { formatDateDa } from "@/utils/date";
  
  const changes = ref([]);
  const unsubscribeFn = ref(null);
  const editingChange = ref(null);
  const error = ref("");
  
  // --- NYT: modal-state til slet ---
  const showConfirm = ref(false);
  const confirmTarget = ref(null); // den ændring, der skal slettes
  
  onMounted(() => {
    const unsub = listenOpeningChanges((all) => {
      changes.value = all;
    });
    unsubscribeFn.value = unsub;
  });
  
  onUnmounted(() => {
    if (unsubscribeFn.value) unsubscribeFn.value();
  });
  
  function formatDateRange(c) {
    const from = formatDateDa(c.dateFrom);
    const to = formatDateDa(c.dateTo);
  
    if (c.dateTo && c.dateTo !== c.dateFrom) return `${from} – ${to}`;
    return from;
  }
  
  function formatTime(c) {
    const hasClock = c.timeFrom || c.timeTo;
    const span = hasClock ? `${c.timeFrom || "?"} – ${c.timeTo || "?"}` : "";
  
    if (c.isClosed) {
      if (!hasClock) return "Lukket hele dagen";
      return `Lukket ${span}`;
    }
  
    if (!hasClock) return "";
    return `Kl. ${span}`;
  }
  
  function startEdit(change) {
    editingChange.value = { ...change };
  }
  
  // --- NYT: åbn modal i stedet for window.confirm ---
  function handleDelete(change) {
    confirmTarget.value = change;
    showConfirm.value = true;
  }
  
  function closeConfirm() {
    showConfirm.value = false;
    confirmTarget.value = null;
  }
  
  async function confirmDeleteNow() {
  if (!confirmTarget.value) return;

  error.value = "";
  try {
    await deleteOpeningChange(confirmTarget.value.id);

    // 🔥 fjern fra listen med det samme
    changes.value = changes.value.filter(
      c => c.id !== confirmTarget.value.id
    );

    if (editingChange.value && editingChange.value.id === confirmTarget.value.id) {
      editingChange.value = null;
    }
  } catch (e) {
    console.error(e);
    error.value = "Kunne ikke slette ændringen.";
  } finally {
    closeConfirm();
  }
}


function handleCreated(newChange) {
  editingChange.value = null;

  // 🔥 læg den nye ændring i listen med det samme
  if (newChange) {
    changes.value.push(newChange);
  }
}

function handleUpdated(updatedChange) {
  editingChange.value = null;

  if (!updatedChange) return;

  const i = changes.value.findIndex(c => c.id === updatedChange.id);
  if (i !== -1) {
    // 🔥 erstat eksisterende item i listen
    changes.value[i] = updatedChange;
  }
}

  </script>
  


<template>
  <section class="adminOpening">
    <!-- VENSTRE: formular -->
    <div class="adminOpening__left">
      <h2 class="adminOpening__title">Ændrede åbningstider</h2>
      <OpeningChangesForm
        :change="editingChange"
        @created="handleCreated"
        @updated="handleUpdated"
      />
    </div>

    <!-- HØJRE: oversigt -->
    <div class="adminOpening__right">
      <h2 class="adminOpening__title">Oversigt</h2>

      <p v-if="error" class="adminOpening__error">{{ error }}</p>

      <ul class="adminOpening__list">
        <li
          v-for="c in changes"
          :key="c.id"
          class="adminOpening__item"
        >
          <div class="adminOpening__itemMain">
            <p class="adminOpening__facility">
              {{ getFacilityNameById(c.facilityId) }}
            </p>
            <p class="adminOpening__meta">
              {{ formatDateRange(c) }}
              <span v-if="formatTime(c)"> • {{ formatTime(c) }}</span>
            </p>
            <p v-if="c.reason" class="adminOpening__reason">
              {{ c.reason }}
            </p>
          </div>

          <div class="adminOpening__actions">
            <button
              type="button"
              class="adminBtn adminBtn--secondary"
              @click="startEdit(c)"
            >
              REDIGÉR
            </button>
            <button
              type="button"
              class="adminBtn adminBtn--danger"
              @click="handleDelete(c)"
            >
              SLET
            </button>
          </div>
        </li>

        <li v-if="changes.length === 0" class="adminOpening__empty">
          Ingen ændringer oprettet endnu.
        </li>
      </ul>
    </div>
        <!-- BEKRÆFTELSES-MODAL FOR ÅBNINGSTIDER -->
    <div v-if="showConfirm" class="adminModal">
      <div class="adminModal__backdrop" @click="closeConfirm" />

      <div class="adminModal__panel" role="dialog" aria-modal="true">
        <h3 class="adminModal__title">
          Bekræft sletning
        </h3>

        <p class="adminModal__text">
          Er du sikker på, at du vil slette ændringen for
          <strong>
            {{ confirmTarget && getFacilityNameById(confirmTarget.facilityId) }}
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
            class="adminBtn adminBtn--danger"
            @click="confirmDeleteNow"
          >
            Slet
          </button>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped lang="scss">
@use '@/assets/_colors.scss' as c;
@use '@/assets/_fonts.scss' as f;

.adminOpening {
  display: grid;
  gap: 24px;
  margin-top: 20px;
}

@media (min-width: 900px) {
  .adminOpening {
    grid-template-columns: 1.2fr 1fr;
  }
}

.adminOpening__title {
  font-family: f.$font-secondary;
  font-size: 1.6rem;
  margin: 0 0 8px;
}

/* LISTE + KORT – matcher adminActivities */

.adminOpening__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.adminOpening__item {
  padding: 16px 18px;
  background: c.$color-secondary;         /* samme som .card i AdminActivities */
  border-radius: 14px;
  border: 1px solid #c5c8d3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;
}

.adminOpening__itemMain {
  display: grid;
  gap: 4px;
}

.adminOpening__facility {
  margin: 0;
  font-weight: 700;
}

.adminOpening__meta {
  margin: 0;
  font-size: 0.9rem;
}

.adminOpening__reason {
  margin: 0;
  color: #444;
  font-style: italic;
  font-size: 0.9rem;
}

.adminOpening__empty {
  color: #666;
  padding: 8px 0;
}

.adminOpening__actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

/* --- ADMIN KNAPPER: samme som i AdminActivities --- */

.adminBtn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px 26px;
  border-radius: 10px;
  min-width:140px;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s ease;
  border: 2px solid c.$cta;
}

/* Primær (orange) – SLET */
.adminBtn--danger {
  background: c.$cta;
  color: c.$color-secondary;

  &:hover {
    background: c.$color-tertiary;
    border-color: c.$color-tertiary;
    transform: translateY(-1px);
  }
}

/* Sekundær (hvid med orange kant) – REDIGER */
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

.adminOpening__error {
  color: #b00020;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

/* ---------- ADMIN CONFIRM-MODAL (samme look som i AdminEvents) ---------- */

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
  background: rgba(0, 0, 0, .35);
}

.adminModal__panel {
  position: relative;
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
