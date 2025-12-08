<script setup>
const props = defineProps({
  selectedTags: {
    type: Array,
    default: () => [],
  },
  // her fortæller du, hvilke knapper der skal vises
  options: {
    type: Array,
    default: () => [
      // fx: { key: 'family', label: 'Familievenlig', icon: '👨‍👩‍👧‍👦' }
    ],
  },
  title: {
    type: String,
    default: 'Filtrér',
  },
})

const emit = defineEmits(['update:selectedTags'])

function isSelected(key) {
  return props.selectedTags.includes(key)
}

function toggle(key) {
  const current = props.selectedTags.slice()
  const index = current.indexOf(key)

  if (index === -1) {
    current.push(key)
  } else {
    current.splice(index, 1)
  }

  emit('update:selectedTags', current)
}
</script>

<template>
  <section class="filterBar" aria-label="Filtrér indhold">
    <h3 class="filterBar__title">{{ title }}</h3>

    <div class="filterBar__chips">
      <button
        v-for="opt in options"
        :key="opt.key"
        type="button"
        class="chip"
        :class="{ 'chip--active': isSelected(opt.key) }"
        @click="toggle(opt.key)"
      >
        <span v-if="opt.icon" class="chip__icon">{{ opt.icon }}</span>
        <span>{{ opt.label }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.filterBar {
  display: grid;
  gap: 6px;
  margin: 8px 0 10px;
}

.filterBar__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.filterBar__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border-radius: 999px;
  border: 1px solid #d0d7e2;
  padding: 6px 10px;
  font-size: 0.8rem;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.chip--active {
  background: #f37141;
  border-color: #f37141;
  color: #fff;
}

.chip__icon {
  font-size: 1rem;
}
</style>