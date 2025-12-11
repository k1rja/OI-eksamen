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

<style scoped lang="scss">
  @use '@/assets/_colors.scss' as c;
  @use '@/assets/_fonts.scss' as f;
  @use '@/assets/_buttons.scss' as btn;

  /* -------- OVERLAY-KONTAINER -------- */

  .filterBar {
    position: fixed;
    inset: 0;
    z-index: 40;
    font-family: f.$font-primary;
  }

  .filterBar__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }

  /* -------- PANEL: LILLE KORT I HØJRE SIDE -------- */

  .filterBar__panel {
    position: absolute;
    top: 90px;                                   // afstand fra top (tilpas efter behov)
    right: clamp(16px, 5vw, 70px);              // afstand fra højre
    background: c.$color-secondary;
    border-radius: 16px;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
    width: min(340px, 90vw);
    max-height: calc(100vh - 180px);

    padding: 20px 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }

  /* Mobil: mere “bottom sheet” */

  @media (max-width: 680px) {
    .filterBar__panel {
      top: auto;
      right: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      max-height: 80vh;
      border-radius: 18px 18px 0 0;
      box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.25);
    }
  }

  /* -------- INDHOLD (OVERSKRIFT, CHIPS, FOOTER) -------- */

  .filterBar__title {
    margin: 0 0 4px;
    font-family: f.$font-secondary;
    font-size: 1.1rem;
  }

  /* CHIPS – som du havde dem før */

  $chip-config: map-merge(btn.$button-primary, (
    bg: c.$color-secondary,
    color: c.$color-primary,
    radius: 999px,
    border-width: 1px,
  ));

  .filterBar__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip {
    @include btn.button($chip-config);

    width: auto;
    height: auto;
    padding: 6px 10px;
    font-size: 0.8rem;
    font-weight: 600;

    display: inline-flex;
    align-items: center;
    gap: 4px;

    border-color: #d0d7e2;
  }

  .chip--active {
    background: c.$cta;
    border-color: c.$cta;
    color: c.$color-secondary;
  }

  .chip__icon {
    font-size: 1rem;
  }

  /* FOOTER MED KNAPPER (NULSTIL / GEM) */

  .filterBar__footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  /* knapper ca. som adminBtn */

  .filterBar__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 10px 26px;        // “adminBtn-størrelse”
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.2s ease;

    border: 2px solid transparent;
    font-family: f.$font-primary;
  }

  /* NULSTIL – hvid med orange kant */
  .filterBar__btn--ghost {
    background: c.$color-secondary;
    color: c.$cta;
    border-color: c.$cta;

    &:hover:not(:disabled) {
      border-color: c.$color-tertiary;
      color: c.$color-tertiary;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
      transform: none;
    }
  }

  /* GEM – solid orange CTA */
  .filterBar__btn--primary {
    background: c.$cta;
    color: c.$color-secondary;
    border-color: c.$cta;

    &:hover {
      background: c.$color-tertiary;
      border-color: c.$color-tertiary;
      transform: translateY(-1px);
    }
  }
</style>

