<script setup>
import { ref, watch } from "vue";
import {
  openingFacilities,
  addOpeningChange,
  updateOpeningChange
} from "@/stores/openingHoursStore";

const props = defineProps({
  // hvis der er valgt en ændring i listen til redigering
  change: { type: Object, default: null }
});

const emit = defineEmits(["created", "updated"]);

const facilities = openingFacilities;

const form = ref({
  id: null,
  facilityId: "",
  isClosed: false,
  dateFrom: "",
  dateTo: "",
  timeFrom: "",
  timeTo: "",
  reason: ""
});

const submitting = ref(false);
const error = ref("");
const success = ref(false);

// sync form, når man vælger noget i oversigten
watch(
  () => props.change,
  (c) => {
    if (c) {
      form.value = {
        id: c.id ?? null,
        facilityId: c.facilityId ?? "",
        isClosed: !!c.isClosed,
        dateFrom: c.dateFrom ?? "",
        dateTo: c.dateTo ?? "",
        timeFrom: c.timeFrom ?? "",
        timeTo: c.timeTo ?? "",
        reason: c.reason ?? ""
      };
    } else {
      form.value = {
        id: null,
        facilityId: "",
        isClosed: false,
        dateFrom: "",
        dateTo: "",
        timeFrom: "",
        timeTo: "",
        reason: ""
      };
    }
    error.value = "";
    success.value = false;
  },
  { immediate: true }
);

async function submit() {
  error.value = "";
  success.value = false;

  if (!form.value.facilityId || !form.value.dateFrom) {
    error.value = "Vælg facilitet og mindst én startdato.";
    return;
  }

  submitting.value = true;

  const payload = {
    facilityId: form.value.facilityId,
    isClosed: !!form.value.isClosed,
    dateFrom: form.value.dateFrom,
    dateTo: form.value.dateTo || "",
    timeFrom: form.value.timeFrom || "",
    timeTo: form.value.timeTo || "",
    reason: form.value.reason || ""
  };

  try {
    // REDIGERING
    if (form.value.id) {
      const updated = await updateOpeningChange(form.value.id, payload);
      emit("updated", updated);
      success.value = true;
      return;
    }

    // OPRETTELSE
    const created = await addOpeningChange(payload);
    emit("created", created);

    form.value = {
      id: null,
      facilityId: "",
      isClosed: false,
      dateFrom: "",
      dateTo: "",
      timeFrom: "",
      timeTo: "",
      reason: ""
    };

    success.value = true;
    setTimeout(() => (success.value = false), 1200);
  } catch (e) {
    console.error(e);
    error.value = "Kunne ikke gemme ændringen.";
  } finally {
    submitting.value = false;
  }
}
</script>


<template>
  <form class="adminForm" @submit.prevent="submit">
    <label>
      Facilitet *
      <select v-model="form.facilityId">
        <option value="">Vælg facilitet</option>
        <option
          v-for="f in facilities"
          :key="f.id"
          :value="f.id"
        >
          {{ f.name }}
        </option>
      </select>
    </label>

    <div class="adminForm__row">
      <label>
        Fra dato *
        <input type="date" v-model="form.dateFrom" />
      </label>

      <label>
        Til dato
        <input type="date" v-model="form.dateTo" />
      </label>
    </div>

    <div class="adminForm__row">
      <label>
        Åbner kl.
        <input type="time" v-model="form.timeFrom" />
      </label>

      <label>
        Lukker kl.
        <input type="time" v-model="form.timeTo" />
      </label>
    </div>

    <!-- Denne checkbox gør, at perioden tolkes som “lukket” -->
    <label class="adminForm__checkbox">
      <input type="checkbox" v-model="form.isClosed" />
      <span>Faciliteten er lukket i dette tidsrum</span>
    </label>

    <label>
      Årsag / info
      <textarea
        rows="2"
        v-model="form.reason"
        placeholder="Fx vedligehold, rengøring …"
      />
    </label>

    <button
      class="adminBtn adminBtn--primary adminBtn--full"
      :disabled="submitting"
    >
      {{ submitting ? "Gemmer…" : "Tilføj ændring" }}
    </button>

    <p v-if="error" class="msg msg--error">{{ error }}</p>
    <p v-if="success" class="msg msg--success">✔ Ændring tilføjet!</p>
  </form>
</template>


<style scoped lang="scss">
@use '@/assets/_buttons.scss' as btn;

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
.adminForm textarea,
.adminForm select {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #c9c9c9;
  font-size: 0.9rem;
}

.adminForm__checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

/* Række-layout: mobile first, så 2 kolonner fra 600px */
.adminForm__row {
  display: grid;
  gap: 10px;
}

@media (min-width: 600px) {
  .adminForm__row {
    grid-template-columns: 1fr 1fr;
  }
}

/* Knap – samme som i ActivityForm */
.adminBtn {
  @include btn.button(btn.$button-primary);
  display: inline-flex;
  margin-top: 12px;
  cursor: pointer;
}

/* vi behøver ikke definere .adminBtn--full – så opfører den sig som i ActivityForm */

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

