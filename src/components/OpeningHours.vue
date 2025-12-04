<script setup>
import backgroundImage from '@/assets/images/activities/havnebad.webp'
</script>

<template>
  <section
    class="openingHours"
    :style="{
      backgroundImage: `
        linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.45) 0%,
          rgba(0, 0, 0, 0.55) 60%,
          rgba(0, 0, 0, 0.65) 100%
        ),
        url(${backgroundImage})
      `
    }"
  >
    <div class="openingHours__overlay">
      <div class="openingHours__content">
        <h2 class="openingHours__title">
          Find <span>åbningstider</span> for alle vores haller og svømmefaciliteter
        </h2>

        <p class="openingHours__text">
          Se de aktuelle åbningstider for vores anlæg og svømmehaller i hele
          Odense Idrætspark. Vi opdaterer løbende, så du altid ved, hvornår du
          kan komme forbi og være aktiv.
        </p>

        <a href="/opening-hours" class="openingHours__btn">
          Åbningstider
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
    @use '../assets/_colors.scss' as c;
    @use '../assets/_fonts.scss' as f;
    @use '../assets/_buttons.scss' as btn;

    .openingHours {
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        color: c.$color-secondary;
        font-family: f.$font-primary;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: clamp(340px, 55vh, 500px);
        padding: 40px 16px;

        &__overlay {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        &__content {
            max-width: 720px;
            margin-inline: auto;
        }

        &__title {
            margin: 0 0 16px;
            font-family: f.$font-secondary;
            font-size: clamp(1.6rem, 3vw, 2.4rem);
            line-height: 1.25;
            font-weight: 500;

            span {
            font-weight: 900;
            }
        }

        &__text {
            margin: 0 0 28px;
            line-height: 2rem;
            opacity: 0.95;
        }

        &__btn {
            @include btn.button(btn.$button-primary);
            font-family: f.$font-primary;
            text-decoration: none;
        }

        @media (min-width: 768px) {
            padding: 64px 32px;

            &__text {
            margin-bottom: 32px;
            }
        }

        @media (min-width: 1024px) {
            min-height: 440px;

            &__title {
            font-size: 2.5rem;
            }

            &__text {
            font-size: 1.05rem;
            }
        }
    }
</style>