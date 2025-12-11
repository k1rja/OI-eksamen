<script setup>
  import { reactive, watch } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const localFilters = reactive({
    familyFriendly: props.modelValue.familyFriendly ?? true,
    kidFriendly: props.modelValue.kidFriendly ?? false,
    indoor: props.modelValue.indoor ?? false,
    outdoor: props.modelValue.outdoor ?? false,
    calm: props.modelValue.calm ?? false,
    active: props.modelValue.active ?? false,
    free: props.modelValue.free ?? false,
    duration: props.modelValue.duration ?? null
  })
  
  function toggle(key) {
    localFilters[key] = !localFilters[key]
    emit('update:modelValue', { ...localFilters })
  }
  
  function setDuration(value) {
    localFilters.duration = localFilters.duration === value ? null : value
    emit('update:modelValue', { ...localFilters })
  }
  
  watch(
    () => props.modelValue,
    newVal => {
      Object.assign(localFilters, newVal)
    },
    { deep: true }
  )
</script>
  <template>
    <section class="filter-bar">
      <h2 class="filter-bar__title">Vælg hvad der passer til jer</h2>
      <p class="filter-bar__subtitle">
        Vi viser kun aktiviteter, der matcher dine valg.
      </p>
    </section>
  </template>