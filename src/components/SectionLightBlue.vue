<script setup>
defineProps({
  title: String,
  text: String,
  buttonText: String,
  buttonLink: String,
  image: String
})
</script>

<template>
  <section class="light_blue_section">
    <div class="content">
      <h2 class="content_h2" v-html="title"></h2>
      <p class="content_p" v-html="text"></p>
      <div class="content_btn">
        <RouterLink
          v-if="buttonText && buttonLink"
          :to="buttonLink"
          class="btn"
        >
          {{ buttonText }}
        </RouterLink>
      </div>
    </div>
    <img class="section_img" v-if="image" :src="image" alt="">
  </section>
</template>


<style scoped lang="scss">
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;
@use '../assets/_buttons.scss' as b;

.light_blue_section {
  background-color: c.$color-tertiary;
  color: c.$color-primary;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content_h2 { font-variation-settings: "wght" 400 !important; }
.content_h2 :deep(span) { font-variation-settings: "wght" 800 !important; }
.content_p { font-variation-settings: "wght" 400 !important; }
.content_p :deep(span) { font-variation-settings: "wght" 800 !important; }

.section_img {
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.content_btn {
  display: flex;
}

.content_h2 {
  margin: 20px 0px;
}

.content_p {
  line-height: 1.5rem;
}

.btn {
  @include b.button(b.$button-primary);
  margin-top: 20px;
}

@media (min-width: 1024px) {
  .light_blue_section {
    flex-direction: row;
  }

  .content {
    padding: 2rem 4rem;
    margin-block: 0;
  }

  .content_p {
    line-height: 2.2rem;
  }

  .section_img {
    width: 50%;
  }

  .content_btn {
    justify-content: left;
  }

  .btn {
    margin-top: 30px;
  }
}

</style>