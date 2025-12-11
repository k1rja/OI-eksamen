<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    activity: { type: Object, default: null }, // bruges ved redigering
  })

  const emit = defineEmits(['created', 'updated', 'cancel'])

  const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

  const form = ref({
    id: null,
    title: '',
    lead: '',
    date: '',
    start: '',
    end: '',
    location: '',
    priceText: '',
    infoText: '',
    whatToBring: '',
    facilityOpeningHours: '',
    // tags
    isFamily: false,
    isKids: false,
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
      f.isFamily && 'family',
      f.isKids && 'kids',
      f.isIndoor && 'indoor',
      f.isOutdoor && 'outdoor',
      f.isCalm && 'calm',
      f.isActive && 'active',
    ].filter(Boolean)
  }

  // sync når vi redigerer
  watch(
    () => props.activity,
    (act) => {
      if (act) {
        const tags = Array.isArray(act.tags) ? act.tags : []
        form.value = {
          id: act.id ?? null,
          title: act.title ?? '',
          lead: act.lead ?? '',
          date: act.date ?? '',
          start: act.start ?? '',
          end: act.end ?? '',
          location: act.location ?? '',
          priceText:
            act.priceText ?? (Number.isFinite(act.price) ? String(act.price) : ''),
          infoText: act.infoText ?? '',
          whatToBring: act.whatToBring ?? '',
          facilityOpeningHours: act.facilityOpeningHours ?? '',
          isFamily: tags.includes('family'),
          isKids: tags.includes('kids'),
          isIndoor: tags.includes('indoor'),
          isOutdoor: tags.includes('outdoor'),
          isCalm: tags.includes('calm'),
          isActive: tags.includes('active'),
        }
      } else {
        form.value = {
          id: null,
          title: '',
          lead: '',
          date: '',
          start: '',
          end: '',
          location: '',
          priceText: '',
          infoText: '',
          whatToBring: '',
          facilityOpeningHours: '',
          isFamily: false,
          isKids: false,
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

    if (!form.value.title) {
      error.value = 'Skriv mindst en titel på aktiviteten.'
      return
    }

    const priceText = form.value.priceText ?? ''
    const price = clamp0(parsePrice(priceText))
    const tags = buildTagsFromForm()

    const basePayload = {
      title: form.value.title,
      lead: form.value.lead || '',
      date: form.value.date || '',
      start: form.value.start || '',
      end: form.value.end || '',
      location: form.value.location || '',
      priceText,
      price,
      infoText: form.value.infoText || '',
      whatToBring: form.value.whatToBring || '',
      facilityOpeningHours: form.value.facilityOpeningHours || '',
      tags,
    }

    submitting.value = true
    try {
      // REDIGERING
      if (props.activity && form.value.id) {
        const updated = { id: form.value.id, ...basePayload }
        emit('updated', updated)
        success.value = true
        return
      }

      // OPRETTELSE
      const res = await fetch(`${DB_URL}/activities.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basePayload,
          createdAt: Date.now(),
        }),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const { name: id } = await res.json()

      const created = { id, ...basePayload }
      emit('created', created)

      form.value = {
        id: null,
        title: '',
        lead: '',
        date: '',
        start: '',
        end: '',
        location: '',
        priceText: '',
        infoText: '',
        whatToBring: '',
        facilityOpeningHours: '',
        isFamily: false,
        isKids: false,
        isIndoor: false,
        isOutdoor: false,
        isCalm: false,
        isActive: false,
      }
      success.value = true
    } catch (e) {
      console.error(e)
      error.value = 'Kunne ikke gemme aktiviteten.'
    } finally {
      submitting.value = false
      if (success.value && !props.activity) setTimeout(() => (success.value = false), 1200)
    }
  }

  function onCancel() {
    emit('cancel')
  }
</script>

<template>
  <form class="adminForm" @submit.prevent="onSubmit">
    <label>
      Titel *
      <input v-model.trim="form.title" />
    </label>

    <label>
      Dato
      <input type="date" v-model="form.date" />
    </label>

    <div class="adminForm__row">
      <label>
        Starttid
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
        placeholder="Fx. Odense Havnebad, Odense Skøjtehal"
      />
    </label>

    <label>
      Pris
      <input
        v-model.trim="form.priceText"
        placeholder="Fx. 40 kr., Gratis, 2 klip"
      />
    </label>

    <label>
      Beskrivelse
      <textarea v-model.trim="form.lead" rows="3" />
    </label>

    <label>
      Godt at vide
      <textarea
        v-model.trim="form.infoText"
        rows="2"
        placeholder="Praktisk info, parkeringsforhold, særlige hensyn osv."
      />
    </label>

    <label>
      Hvad skal man medbringe?
      <textarea
        v-model.trim="form.whatToBring"
        rows="2"
        placeholder="Fx. håndklæde, drikkedunk, indendørssko ..."
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
      <legend>Kendetegn (til filtrering)</legend>

      <label>
        <input type="checkbox" v-model="form.isFamily" />
        Familievenlig
      </label>

      <label>
        <input type="checkbox" v-model="form.isKids" />
        Børnevenlig
      </label>

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
        Rolig aktivitet
      </label>

      <label>
        <input type="checkbox" v-model="form.isActive" />
        Høj intensitet
      </label>
    </fieldset>

    <div class="adminForm__actions">
      <button
        type="submit"
        class="adminBtn adminBtn--primary adminBtn--full"
        :disabled="submitting"
      >
        {{ submitting ? 'Gemmer…' : (props.activity ? 'Gem ændringer' : 'Opret aktivitet') }}
      </button>

      <button
        v-if="props.activity"
        type="button"
        class="adminBtn adminBtn--secondary"
        @click="onCancel"
      >
        Fortryd
      </button>
    </div>

    <p v-if="error" class="msg msg--error">{{ error }}</p>
    <p v-if="success" class="msg msg--success">
      ✔ {{ props.activity ? 'Ændringer gemt!' : 'Aktivitet oprettet!' }}
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

  .adminForm__row {
    display: grid;
    gap: 10px;
  }

  @media (min-width: 600px) {
    .adminForm__row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .adminForm__tags {
    margin-top: 6px;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px dashed #d0d0d0;
    display: grid;
    gap: 4px;
  }

  .adminForm__tags legend {
    font-size: 0.9rem;
    padding: 0 4px;
  }

  .adminForm__tags label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .adminForm__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
  }

  /* knapper – bruger din globale mixin */
  .adminBtn {
    @include btn.button(btn.$button-primary);
    display: inline-flex;   // gør den smal
    margin-top: 12px;
    cursor: pointer;
  }

  /* beskeder */
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

