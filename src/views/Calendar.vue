<script setup>
import { ref } from 'vue'

import AdminActivities from '@/components/AdminActivities.vue'
import AdminEvents from '@/components/AdminEvents.vue'
import AdminOpeningList from '@/components/AdminOpeningList.vue'

const activeTab = ref('events')
</script>

<template>
  <main class="adminPage">

    <header class="adminTabs">
      <button
        class="adminTabs__btn"
        :class="{ 'adminTabs__btn--active': activeTab === 'activities' }"
        @click="activeTab = 'activities'"
      >
        Aktiviteter
      </button>

      <button
        class="adminTabs__btn"
        :class="{ 'adminTabs__btn--active': activeTab === 'events' }"
        @click="activeTab = 'events'"
      >
        Hold
      </button>

      <button
        class="adminTabs__btn"
        :class="{ 'adminTabs__btn--active': activeTab === 'openingchanges' }"
        @click="activeTab = 'openingchanges'"
      >
        Ændrede åbningstider
      </button>
    </header>

    <section class="adminPage__content">
      <AdminActivities v-if="activeTab === 'activities'" />
      <AdminEvents v-else-if="activeTab === 'events'" />
      <AdminOpeningList v-else />
    </section>
  </main>
</template>


<style scoped lang="scss">
@use '../assets/_colors.scss' as c;

.adminPage {
  padding: 24px;
  display: grid;
  gap: 18px;
  margin-top: 40px;
}

.adminPage__title {
  font-size: 1.6rem;
  margin: 0;
}

/* Tabs-linje */
.adminTabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #000;
  padding: 8px 0 6px;
  font-size: 1.8rem;
}

.adminTabs__btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: inherit;
  font-weight: 400;
  color: #000;
  padding: 0 0 4px;
}

.adminTabs__btn--active {
  font-weight: 700;
  border-bottom: 3px solid #000;
}

.adminPage__content {
  margin-top: 12px;
}
</style>
