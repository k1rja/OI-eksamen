<script setup>
const props = defineProps({
  title: String,
  text: String,
  buttonText: String,
  buttonLink: String,
  image: String,
  // nyt prop der styrer om vi viser gradient
  gradient: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <section
    class="hero_tamplate"
    :class="{ 'hero_tamplate--gradient': props.gradient }"
  >
    <img class="hero__img" v-if="props.image" :src="props.image" alt="" />

    <div class="hero__content">
      <h1 class="content_h1" v-html="props.title"></h1>
      <p class="content_p" v-html="props.text"></p>

      <div class="hero__actions">
        <a
          v-if="props.buttonText"
          :href="props.buttonLink || '#'"
          class="btn"
        >
          {{ props.buttonText }}
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;
@use '../assets/_buttons.scss' as b;

.hero_tamplate {
  position: relative;
  width: 100%;
  height: 75vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* aktiveres kun når props.gradient = true */
.hero_tamplate--gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.25) 40%,
    rgba(0, 0, 0, 0.65) 100%
  );
  z-index: 1;       
  pointer-events: none;
}

.content_h2 { font-variation-settings: "wght" 400; }
.content_h2 :deep(span) { font-variation-settings: "wght" 800; }
.content_p {
  font-variation-settings: "wght" 400;
  font-size: 1rem;
  line-height: 1.5rem;

  @media (min-width: 1024px) {
    line-height: 2.2rem;
  }
}
.content_p :deep(span) { font-variation-settings: "wght" 800; }

.hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: c.$color-secondary;
  padding: 0 3rem;
  z-index: 2;
}

.hero__title {
  font-size: clamp(1.6rem, 4vw, 3rem);
  margin-bottom: 1rem;
}

.hero__text {
  line-height: 2.2rem;
}

.btn {
  @include b.button(b.$button-primary);
  margin: 2rem;
}

@media (min-width: 1024px) {
  .hero__content {
    max-width: 800px;
    margin-inline: auto;
  }
}
</style>
