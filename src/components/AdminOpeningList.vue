<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import OpeningChangesForm from "@/components/OpeningChangesForm.vue";
import {
  listenOpeningChanges,
  getFacilityNameById,
  deleteOpeningChange
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
  // scrolle op til formular, hvis man vil være ekstra sød: optional
  // window.scrollTo({ top: 0, behavior: "smooth" });
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
              class="adminOpening__btn adminOpening__btn--edit"
              @click="startEdit(c)"
            >
              Rediger
            </button>
            <button
              type="button"
              class="adminOpening__btn adminOpening__btn--delete"
              @click="handleDelete(c)"
            >
              Slet
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

.adminOpening__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.adminOpening__item {
  padding: 12px 14px;
  background: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: grid;
  gap: 8px;
}

.adminOpening__itemMain {
  display: grid;
  gap: 2px;
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
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.adminOpening__btn {
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid transparent;
}

.adminOpening__btn--edit {
  background: c.$color-primary;
  color: #fff;
}

.adminOpening__btn--delete {
  background: #fff;
  color: #b00020;
  border-color: #b00020;
}

.adminOpening__error {
  color: #b00020;
  font-size: 0.9rem;
  margin-bottom: 6px;
}
</style>
