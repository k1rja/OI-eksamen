<script setup>
  const props = defineProps({
    activity: {
      type: Object,
      required: true
    }
  })
</script>

<template>
    <article class="activity-card">
      <header class="activity-card__header">
        <h3 class="activity-card__title">{{ activity.title }}</h3>
        <p class="activity-card__location" v-if="activity.location">
          {{ activity.location }}
        </p>
      </header>
  
      <p class="activity-card__description" v-if="activity.description">
        {{ activity.description }}
      </p>
  
      <ul class="activity-card__meta">
        <li v-if="activity.isFamilyFriendly">Familievenlig</li>
        <li v-if="activity.isKidFriendly">Børnevenlig</li>
        <li v-if="activity.isIndoor">Indendørs</li>
        <li v-if="activity.isOutdoor">Udendørs</li>
        <li v-if="activity.priceLabel">{{ activity.priceLabel }}</li>
        <li v-if="activity.durationLabel">{{ activity.durationLabel }}</li>
      </ul>
  
      <p class="activity-card__time" v-if="activity.openingToday">
        I dag: {{ activity.openingToday }}
        <span
          class="activity-card__badge"
          :class="{
            'activity-card__badge--open': activity.isOpenNow,
            'activity-card__badge--closed': activity.isOpenNow === false
          }"
        >
          {{ activity.isOpenNow ? 'Åbent nu' : 'Lukket' }}
        </span>
      </p>
  
      <footer class="activity-card__footer">
        <button type="button" class="activity-card__button activity-card__button--secondary">
          Læs mere
        </button>
        <button type="button" class="activity-card__button activity-card__button--primary">
          Book billet
        </button>
      </footer>
    </article>
  </template>
  
<style scoped lang="scss">
  @use '../assets/_colors.scss' as c;
  @use '../assets/_fonts.scss' as f;
  
  .activity-card {
    background: c.$color-secondary;
    border-radius: 1rem;
    padding: 1rem 1rem 0.8rem;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.07);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .activity-card__header {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  
  .activity-card__title {
    font-size: 1.05rem;
    font-weight: 600;
  }
  
  .activity-card__location {
    font-size: 0.85rem;
    color: #555;
  }
  
  .activity-card__description {
    font-size: 0.9rem;
    color: #444;
  }
  
  .activity-card__meta {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    font-size: 0.8rem;
    padding: 0;
    margin: 0.25rem 0 0;
    color: #555;
  }
  
  .activity-card__time {
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
  
  .activity-card__badge {
    margin-left: 0.35rem;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
  }
  
  .activity-card__badge--open {
    background: #16a34a;
    color: c.$color-secondary;
  }
  
  .activity-card__badge--closed {
    background: #9ca3af;
    color: c.$color-secondary;
  }
  
  .activity-card__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .activity-card__button {
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    border: 1px solid transparent;
    font-size: 0.85rem;
    cursor: pointer;
  }
  
  .activity-card__button--primary {
    background: #0050b3;
    color: c.$color-secondary;
  }
  
  .activity-card__button--secondary {
    background: transparent;
    color: #0050b3;
    border-color: #0050b3;
  }
</style>