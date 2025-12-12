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
    priceText: '',
    isFree: false, 
    description: '',
    infoText: '',
    whatToBring: '',
    facilityOpeningHours: '',
    isFamilyFriendly: false,
    isKidFriendly: false,
    isIndoor: false,
    isOutdoor: false,
    isCalm: false,
    isActive: false,
  })

  const submitting = ref(false)
  const error = ref('')
  const success = ref(false)

  function parsePrice(txt) {
    if (txt == null) return 0
    const s = String(txt).replace(',', '.')
    const m = s.match(/(\d+(\.\d+)?)/)
    return m ? Number(m[1]) : 0
  }
  const clamp0 = (n) => (Number.isFinite(n) && n > 0 ? n : 0)

  function buildTagsFromForm() {
    const f = form.value
    return [
      f.isFamilyFriendly && 'family',
      f.isKidFriendly && 'kids',
      f.isIndoor && 'indoor',
      f.isOutdoor && 'outdoor',
      f.isCalm && 'calm',
      f.isActive && 'active',
      f.isFree && 'free', 
    ].filter(Boolean)
  }

  watch(
    () => props.event,
    (ev) => {
      if (ev) {
        const tags = Array.isArray(ev.tags) ? ev.tags : []
        form.value = {
          id: ev.id ?? null,
          title: ev.title ?? '',
          date: ev.date ?? '',
          start: ev.start ?? '',
          end: ev.end ?? '',
          location: ev.location ?? '',
          priceText: ev.priceText ?? (Number.isFinite(ev.price) ? String(ev.price) : ''),
          isFree: act.isFree ?? tags.includes('free'), 
          description: ev.description ?? '',
          infoText: ev.infoText ?? '',
          whatToBring: ev.whatToBring ?? '',
          facilityOpeningHours: ev.facilityOpeningHours ?? '',
          isFamilyFriendly: ev.isFamilyFriendly ?? tags.includes('family'),
          isKidFriendly: ev.isKidFriendly ?? tags.includes('kids'),
          isIndoor: ev.isIndoor ?? tags.includes('indoor'),
          isOutdoor: ev.isOutdoor ?? tags.includes('outdoor'),
          isCalm: ev.isCalm ?? tags.includes('calm'),
          isActive: ev.isActive ?? tags.includes('active'),
        }
      } else {
        form.value = {
          id: null,
          title: '',
          date: '',
          start: '',
          end: '',
          location: '',
          priceText: '',
          isFree: false, 
          description: '',
          infoText: '',
          whatToBring: '',
          facilityOpeningHours: '',
          isFamilyFriendly: false,
          isKidFriendly: false,
          isIndoor: false,
          isOutdoor: false,
          isCalm: false,
          isActive: false,
        }
      }
      error.value = ''
      success.value = false
    },
    { immediate: true }
  )

  async function onSubmit() {
    error.value = ''
    success.value = false

    if (!form.value.title || !form.value.date || !form.value.start) {
      error.value = 'Udfyld titel, dato og starttid.'
      return
    }

    const priceText = form.value.priceText ?? ''
    const price = clamp0(parsePrice(priceText))
    const tags = buildTagsFromForm()

    const basePayload = {
      title: form.value.title,
      date: form.value.date,
      start: form.value.start,
      end: form.value.end || '',
      location: form.value.location || '',
      priceText,
      price,
      isFree: !!form.value.isFree,
      description: form.value.description || '',
      infoText: form.value.infoText || '',
      whatToBring: form.value.whatToBring || '',
      facilityOpeningHours: form.value.facilityOpeningHours || '',
      isFamilyFriendly: form.value.isFamilyFriendly,
      isKidFriendly: form.value.isKidFriendly,
      isIndoor: form.value.isIndoor,
      isOutdoor: form.value.isOutdoor,
      isCalm: form.value.isCalm,
      isActive: form.value.isActive,
      tags,
    }

    submitting.value = true
    try {
      // REDIGERING
      if (props.event && form.value.id) {
        emit('updated', {
          id: form.value.id,
          ...basePayload,
        })
        success.value = true
        return
      }

      // OPRETTELSE
      const res = await fetch(`${DB_URL}/events.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basePayload,
          createdAt: Date.now(),
        }),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const { name: id } = await res.json()

      const created = {
        id,
        ...basePayload,
      }

      emit('created', created)

      form.value = {
        id: null,
        title: '',
        date: '',
        start: '',
        end: '',
        location: '',
        priceText: '',
        description: '',
        infoText: '',
        whatToBring: '',
        facilityOpeningHours: '',
        isFamilyFriendly: false,
        isKidFriendly: false,
        isIndoor: false,
        isOutdoor: false,
        isCalm: false,
        isActive: false,
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
  <form class="adminForm" @submit.prevent="onSubmit">
    <label>Titel *</label>
    <input v-model.trim="form.title" />

    <label>Dato *</label>
    <input type="date" v-model="form.date" />

    <div class="event-form__row">
        <label>
            Starttid *
            <input type="time" v-model="form.start" />
        </label>

        <label>
            Sluttid
            <input type="time" v-model="form.end" />
        </label>
    </div>

    <label>
      Lokation
      <input
        v-model.trim="form.location"
        placeholder="Fx. Svømmehallen Højme, Svømmehallen Klosterbakken"
      />
    </label>

    <label>
      Pris
      <input
        v-model.trim="form.priceText"
        placeholder="Fx. 40 kr., Gratis, 2 klip"
      />
    </label>

    <label class="adminForm__inlineCheck">
      <input type="checkbox" v-model="form.isFree" />
      Gratis
    </label>

    <label>Beskrivelse</label>
    <textarea v-model.trim="form.description" rows="3" />

    <label>
      Godt at vide
      <textarea
        v-model.trim="form.infoText"
        rows="2"
        placeholder="Praktisk info, fx om omklædning, adgang, parkering …"
      />
    </label>

    <label>
      Hvad skal man medbringe?
      <textarea
        v-model.trim="form.whatToBring"
        rows="2"
        placeholder="Fx. svømmetøj, drikkedunk, håndklæde ..."
      />
    </label>

    <label>
      Åbningstider for denne dag
      <textarea
        v-model.trim="form.facilityOpeningHours"
        rows="2"
        placeholder="Fx. Man–fre 06.00–22.00, lør–søn 08.00–20.00"
      />
    </label>

    <fieldset class="adminForm__tags">
      <legend>Kendetegn (til filtrering på forsiden)</legend>

      <label>
        <input type="checkbox" v-model="form.isIndoor" />
        Indendørs
      </label>

      <label>
        <input type="checkbox" v-model="form.isOutdoor" />
        Udendørs
      </label>

      <label>
        <input type="checkbox" v-model="form.isCalm" />
        Roligt tempo
      </label>

      <label>
        <input type="checkbox" v-model="form.isActive" />
        Høj intensitet
      </label>
    </fieldset>

    <button
      :disabled="submitting"
      class="adminBtn adminBtn--primary adminBtn--full"
    >
      {{ submitting ? 'Gemmer...' : (props.event ? 'Gem ændringer' : 'Opret hold') }}
    </button>

    <p v-if="error" class="msg msg--error">{{ error }}</p>
    <p v-if="success" class="msg msg--success">
      ✔ {{ props.event ? 'Ændringer gemt!' : 'Hold oprettet!' }}
    </p>
  </form>
</template>

<style scoped lang="scss">
  @use '../assets/_colors.scss' as c;
  @use '../assets/_fonts.scss' as f;
  @use '../assets/_buttons.scss' as btn;

  .adminForm {
    display: grid;
    gap: 10px;
  }

  .adminForm label {
    display: grid;
    gap: 4px;
    font-size: 0.9rem;
  }

  .adminForm input,
  .adminForm textarea {
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #c9c9c9;
    font-size: 0.9rem;
  }

  /* start/slut i række – matcher aktivitetssiden */
  .event-form__row {
    display: grid;
    gap: 10px;
  }

  @media (min-width: 600px) {
    .event-form__row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .adminForm__tags {
    margin-top: 8px;
    border-radius: 8px;
    border: 1px dashed #ddd;
    padding: 8px;
    display: grid;
    gap: 4px;
  }

  .adminForm__tags legend {
    font-size: 0.9rem;
    padding: 0 4px;
  }

  .adminForm__tags label {
    font-size: 0.85rem;
    display: flex;
    gap: 6px;
    align-items: center;
  }

  /* knap – samme størrelse som forsiden */
  .adminBtn {
    @include btn.button(btn.$button-primary);
    display: inline-flex;
    margin-top: 12px;
    cursor: pointer;
  }

  .msg {
    font-size: 0.85rem;
    margin-top: 4px;
  }

  .msg--error {
    color: #b00020;
  }

  .msg--success {
    color: #1b7a34;
  }
</style>
