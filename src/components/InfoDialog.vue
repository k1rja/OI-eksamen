<script setup>
  import { ref, computed } from 'vue'

  const props = defineProps({
    // Aktivitet eller hold-objekt
    item: { type: Object, required: true },
    // Bruges i teksten: "Om holdet" / "Om aktiviteten"
    typeLabel: { type: String, default: 'Hold' },
    // Tekst på knappen
    buttonLabel: { type: String, default: 'Info' },
  })

  const open = ref(false)

  const hasAnyExtraInfo = computed(() => {
    const it = props.item || {}
    return (
      it.description ||
      it.lead ||
      it.infoText ||
      it.whatToBring ||
      it.facilityOpeningHours
    )
  })

  function onOpen() {
    if (!hasAnyExtraInfo.value) return
    open.value = true
  }

  function onClose() {
    open.value = false
  }
</script>

<template>
  <!-- Trigger-knap -->
  <button
    type="button"
    class="infoBtn"
    :disabled="!hasAnyExtraInfo"
    @click="onOpen"
  >
    {{ buttonLabel }}
  </button>

  <!-- Modal -->
  <teleport to="body">
    <div
      v-if="open"
      class="infoModal"
      @click.self="onClose"
    >
      <div class="infoModal__dialog">
        <header class="infoModal__header">
          <h2 class="infoModal__title">
            {{ item.title || (typeLabel === 'Hold' ? 'Hold' : 'Aktivitet') }}
          </h2>
        </header>

        <div class="infoModal__body">
          <!-- Overblik – dato/tid/sted/pris -->
          <p class="infoModal__meta">
            <span v-if="item.date">{{ item.date }}</span>
            <span v-if="item.start || item.end">
              • {{ item.start || '—' }}–{{ item.end || '—' }}
            </span>
            <span v-if="item.location"> • {{ item.location }}</span>
            <span v-if="item.priceText || item.price">
              • Pris: {{ item.priceText || (item.price + ' kr.') }}
            </span>
          </p>

          <section v-if="item.lead || item.description" class="infoSection">
            <h3>Om {{ typeLabel.toLowerCase() }}</h3>
            <p v-if="item.lead">{{ item.lead }}</p>
            <p v-else-if="item.description">{{ item.description }}</p>
          </section>

          <section v-if="item.infoText" class="infoSection">
            <h3>Godt at vide</h3>
            <p>{{ item.infoText }}</p>
          </section>

          <section v-if="item.whatToBring" class="infoSection">
            <h3>Hvad skal jeg medbringe?</h3>
            <p>{{ item.whatToBring }}</p>
          </section>

          <section v-if="item.facilityOpeningHours" class="infoSection">
            <h3>Åbningstider</h3>
            <p>{{ item.facilityOpeningHours }}</p>
          </section>
        </div>

        <footer class="infoModal__footer">
          <button type="button" class="infoBtn infoBtn--secondary" @click="onClose">
            Luk
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
  @use '../assets/_colors.scss' as c;

  .infoBtn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 10px 26px;      
    border-radius: 10px;     
    font-size: 0.95rem;        
    font-weight: 800;        
    text-transform: uppercase;

    cursor: pointer;
    transition: 0.2s ease;
    background: c.$color-secondary;
    color: c.$cta;
    border: 2px solid c.$cta; 
  }

  .infoBtn:hover:not(:disabled) {
    border-color: c.$color-tertiary;
    color: c.$color-tertiary;
    transform: translateY(-1px);
  }

  .infoBtn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .infoBtn--secondary {
    background: c.$color-secondary;
    color: c.$cta;
  }


  /* Overlay */
  .infoModal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  /* Selve boksen */
  .infoModal__dialog {
    background: #fff;
    border-radius: 16px;
    max-width: 520px;
    width: 100%;
    padding: 18px 20px 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .infoModal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .infoModal__title {
    font-size: 1.2rem;
    margin: 0;
  }

  .infoModal__close {
    border: none;
    background: transparent;
    font-size: 1.6rem;
    cursor: pointer;
    line-height: 1;
  }

  .infoModal__body {
    font-size: 0.95rem;
    max-height: 60vh;
    overflow-y: auto;
  }

  .infoModal__meta {
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 10px;
  }

  .infoSection + .infoSection {
    margin-top: 10px;
  }

  .infoSection h3 {
    font-size: 0.95rem;
    margin: 0 0 2px;
  }

  .infoSection p {
    margin: 0;
  }

  .infoModal__footer {
    margin-top: 14px;
    display: flex;
    justify-content: flex-end;
  }
</style>
