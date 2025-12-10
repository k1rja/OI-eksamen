<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import OpeningChangesForm from "@/components/OpeningChangesForm.vue";
import {
  listenOpeningChanges,
  getFacilityNameById,
  deleteOpeningChange,
} from "@/stores/openingHoursStore";

const changes = ref([]);
const unsubscribeFn = ref(null);
const editingChange = ref(null);
const error = ref("");

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
  if (c.dateTo && c.dateTo !== c.dateFrom) return `${c.dateFrom} – ${c.dateTo}`;
  return c.dateFrom;
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

async function handleDelete(change) {
  const ok = window.confirm(
    `Er du sikker på, at du vil slette ændringen for ${getFacilityNameById(
      change.facilityId
    )}?`
  );
  if (!ok) return;

  error.value = "";
  try {
    await deleteOpeningChange(change.id);
    if (editingChange.value && editingChange.value.id === change.id) {
      editingChange.value = null;
    }
  } catch (e) {
    console.error(e);
    error.value = "Kunne ikke slette ændringen.";
  }
}

function handleCreated() {
  editingChange.value = null;
}

function handleUpdated() {
  editingChange.value = null;
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
</style>
