<script setup>
  import { ref, onMounted, onUnmounted } from "vue";

  import warningIcon from "@/assets/images/ikoner/warning.webp";
  import arrowIcon from "@/assets/images/ikoner/arrow_black.webp";

  import {
    listenOpeningChanges,
    filterActiveOpeningChanges,
    getFacilityNameById,
  } from "@/stores/openingHoursStore";

  const isOpen = ref(false);
  const activeChanges = ref([]);
  let unsubscribeFn = null;

  // hent ændringer løbende
  onMounted(() => {
    unsubscribeFn = listenOpeningChanges((allChanges) => {
      activeChanges.value = filterActiveOpeningChanges(allChanges);
    });
  });

  onUnmounted(() => {
    if (unsubscribeFn) unsubscribeFn();
  });

  function toggleOpen() {
    if (!activeChanges.value.length) return;
    isOpen.value = !isOpen.value;
  }

  function getFacilityName(id) {
    return getFacilityNameById(id);
  }

  function formatDateDMY(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
  }

  function formatDateRange(c) {
    const from = formatDateDMY(c.dateFrom);
    const to = c.dateTo ? formatDateDMY(c.dateTo) : null;
    return to && to !== from ? `${from} – ${to}` : from;
  }

  function hasTime(change) {
    return !!(change.timeFrom || change.timeTo || change.isClosed);
  }

  function formatTimeRange(change) {
    const hasClock = change.timeFrom || change.timeTo;
    const span = hasClock
      ? `${change.timeFrom || "?"} – ${change.timeTo || "?"}`
      : "";

    if (change.isClosed) {
      if (!hasClock) return "Lukket hele dagen";
      return `Lukket ${span}`;
    }

    if (!hasClock) return "";
    return `Kl. ${span}`;
  }
</script>

<template>
  <!-- vis kun hvis der faktisk er ændringer -->
  <section
    v-if="activeChanges.length > 0"
    class="opening-banner"
    :class="{ 'opening-banner--open': isOpen }"
  >
    <button class="opening-banner__toggle" @click="toggleOpen">
      <img
        :src="warningIcon"
        alt="Advarsel"
        class="opening-banner__warning-icon"
      />
      <span class="opening-banner__label">Ændrede åbningstider</span>
      <img
        :src="arrowIcon"
        alt=""
        class="opening-banner__icon"
      />
    </button>

    <div class="opening-banner__content">
      <ul class="opening-banner__list">
        <li
          v-for="change in activeChanges"
          :key="change.id"
          class="opening-banner__item"
          :class="{ 'opening-banner__item--closed': change.isClosed }"
        >
          <span class="opening-banner__facility">
            {{ getFacilityName(change.facilityId) }}
          </span>

          <span class="opening-banner__details">
            {{ formatDateRange(change) }}
            <template v-if="hasTime(change)">
              · {{ formatTimeRange(change) }}
            </template>
            <template v-if="change.reason">
              ({{ change.reason }})
            </template>
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .opening-banner {
    width: 100%;
    background-color: #f8e9c8;
    border-bottom: 1px solid #e0cfa4;
    font-family: system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    font-size: 0.95rem;

    &__toggle {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.45rem 1rem;
      background: none;
      border: none;
      cursor: pointer;
      font: inherit;
    }

    &__warning-icon {
      width: 24px;
      height: 24px;
      object-fit: contain;
      flex-shrink: 0;
    }

    &__label {
      font-weight: 600;
      flex: 1;
      text-align: left;
    }

    &__icon {
      width: 22px;
      height: 22px;
      object-fit: contain;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    &--open {
      .opening-banner__icon {
        transform: rotate(180deg);
      }

      .opening-banner__content {
        max-height: 500px;
        padding-bottom: 0.6rem;
      }
    }

    &__content {
      max-height: 0;
      overflow: hidden;
      padding: 0 1rem;
      transition: max-height 0.25s ease, padding-bottom 0.25s ease;
    }

    &__list {
      list-style: none;
      margin: 0.5rem 0 0;
      padding: 0;
    }

    &__item {
      margin-bottom: 0.25rem;
    }

    &__item--closed {
      .opening-banner__details {
        font-weight: 600;
        color: #b00020;
      }
    }

    &__facility {
      font-weight: 600;
      display: block;
    }

    &__details {
      display: block;
      font-size: 0.85rem;
    }
  }
</style>
