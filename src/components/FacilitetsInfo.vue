<script setup>
    const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    href: String
    })
</script>

<template>
  <div class="facilityCard">
    <img :src="icon" alt="" class="facilityCard__icon" />

    <div class="facilityCard__content">
      <a
        v-if="href"
        :href="href"
        class="facilityCard__text facilityCard__text--link"
      >
        {{ text }}
      </a>

      <p v-else class="facilityCard__text">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;


.facilityCard {
  background-color: c.$color-secondary; 
  border-radius: 14px ;
  border: 1px solid rgba(0, 0, 0, 0.40);
  padding: 0.9rem 1.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  width: 100%;
}

.facilityCard__icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}


.facilityCard__text {
  font-family: f.$font-primary;
  color: c.$color-primary;
  margin: 0;
}

.facilityCard__text--link {
  text-decoration: none;
}

.facilityCard__text--link:hover {
  text-decoration: underline;
}

@media (min-width: 1024px) {
  .facilityCard {
    border-radius: 18px;
    padding: 1.1rem 1.6rem;
  }

  .facilityCard__icon {
    width: 32px;
    height: 32px;
  }

  .facilityCard__text {
    font-size: 1rem;
    line-height: 1.6rem;
  }
}
</style>
