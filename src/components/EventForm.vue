<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  event: { type: Object, default: null },
})

const emit = defineEmits(['created', 'updated'])

const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

const form = ref({
  id: null,
  title: '',
  date: '',
  start: '',
  end: '',
  location: '',
  priceText: ''  
})

const submitting = ref(false)
const error = ref('')
const success = ref(false)

watch(
  () => props.event,
  (ev) => {
    if (ev) {
      form.value = {
        id: ev.id ?? null,
        title: ev.title ?? '',
        date: ev.date ?? '',
        start: ev.start ?? '',
        end: ev.end ?? '',
        location: ev.location ?? '',
        priceText: ev.priceText ?? (Number.isFinite(ev.price) ? String(ev.price) : ''),
        description: ev.description ?? ''
      }
    } else {
      form.value = {
        id: null, title: '', date: '', start: '', end: '',
        location: '', priceText: '', description: ''
      }
    }
  },
  { immediate: true }
)

function parsePrice(txt) {
  if (txt == null) return 0
  const s = String(txt).replace(',', '.')
  const m = s.match(/(\d+(\.\d+)?)/)
  return m ? Number(m[1]) : 0
}
const clamp0 = (n) => (Number.isFinite(n) && n > 0 ? n : 0)

async function onSubmit() {
  error.value = ''
  success.value = false

  if (!form.value.title || !form.value.date || !form.value.start) {
    error.value = 'Udfyld titel, dato og starttid.'
    return
  }
  const priceText = form.value.priceText ?? ''
  const price = clamp0(parsePrice(priceText))

  submitting.value = true
  try {
    if (props.event && form.value.id) {
      emit('updated', {
        ...form.value,
        priceText,
        price
      })
      success.value = true
      return
    }

    const res = await fetch(`${DB_URL}/events.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.value.title,
        date: form.value.date,
        start: form.value.start,
        end: form.value.end || '',
        location: form.value.location || '',
        priceText,
        price,
        createdAt: Date.now()
      })
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const { name: id } = await res.json()

    const created = {
      id,
      title: form.value.title,
      date: form.value.date,
      start: form.value.start,
      end: form.value.end || '',
      location: form.value.location || '',
      priceText,
      price
    }

    emit('created', created)

    form.value = {
      id: null, title: '', date: '', start: '', end: '',
      location: '', priceText: ''
    }
    success.value = true
  } catch (e) {
    console.error(e)
    error.value = 'Kunne ikke gemme.'
  } finally {
    submitting.value = false
    if (success.value && !props.event) setTimeout(() => (success.value = false), 1200)
  }
}
</script>

<template>
  <form class="event-form" @submit.prevent="onSubmit">
    <h2>{{ props.event ? 'Redigér hold' : 'Opret hold' }}</h2>

    <label>Titel *</label>
    <input v-model.trim="form.title" />

    <label>Dato *</label>
    <input type="date" v-model="form.date" />

    <label>Starttid *</label>
    <input type="time" v-model="form.start" />

    <label>Sluttid</label>
    <input type="time" v-model="form.end" />

    <label>Lokation</label>
    <input v-model.trim="form.location" />

    <label>Pris</label>
    <input type="text" v-model.trim="form.priceText" />

    <button :disabled="submitting">
      {{ submitting ? 'Gemmer...' : (props.event ? 'Gem ændringer' : 'Opret hold') }}
    </button>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="success" style="color:green">✔ {{ props.event ? 'Ændringer gemt!' : 'Hold oprettet!' }}</p>
  </form>
</template>

<style scoped>
.event-form { 
  display: grid; 
  gap: 10px; 
  padding: 16px; 
  border: 1px solid #dddddd; 
  border-radius: 12px; 
}

.event-form input, .event-form textarea { 
  padding: 6px; 
  border-radius: 6px; 
  border: 1px solid #aaa; 
}

button {
   margin-top: 8px; 
   padding: 8px 12px; 
   font-weight: bold; 
   cursor: pointer; 
}

</style>