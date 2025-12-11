<script setup>
  import swimImg    from '@/assets/images/about/swim.webp';
  import stadiumImg from '@/assets/images/about/stadium.webp';
  import sportImg   from '@/assets/images/about/sport.webp';
  import badetImg   from '@/assets/images/about/havnebadet.webp';
  import iceImg     from '@/assets/images/about/iceskating.webp';
</script>

<template>
  <section class="about-section about-section--white">
    <div class="about-container">
      <h2>Vores faciliteter</h2>

      <div class="about-text-split">
        <p>
          Odense Idrætspark driver og vedligeholder en række moderne idrætsfaciliteter i hele Odense.
          Her finder du svømmehaller, haller, baner, stadioner og grønne områder til både hverdag og events.
        </p>
      </div>

      <div class="about-cards about-cards--facilities">
        <article class="about-card">
          <img :src="swimImg" alt="Billede af svømmehal, som fungerer som genvejsknap til faciliteter" />
          <span>Svømmehaller</span>
        </article>
        <article class="about-card">
          <img :src="stadiumImg" alt="Billede af fodboldstadion, som fungerer som genvejsknap til faciliteter" />
          <span>Stadion og arenaer</span>
        </article>
        <article class="about-card">
          <img :src="sportImg" alt="Billede af idrætshal, som fungerer som genvejsknap til faciliteter " />
          <span>Idrætshaller</span>
        </article>
        <article class="about-card">
          <img :src="badetImg" alt="Billede af Odense Havnebad, som fungerer som genvejsknap til faciliteter" />
          <span>Friluftsfaciliteter</span>
        </article>
        <article class="about-card">
          <img :src="iceImg" alt="Billede af skøjtehal, som fungerer som genvejsknap til faciliteter" />
          <span>Skøjtehal</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  @use '../assets/_colors.scss' as c;
  @use '../assets/_fonts.scss' as f;

  .about-section {
    background-color: c.$color-secondary;
    color: c.$color-primary;

    &--white {
      background-color: c.$color-secondary;
      color: c.$color-primary;

      h2,
      p {
      color: c.$color-primary;
      }

      .about-text-split p {
      max-width: none;
      }
    }

    h2 {
      font-family: f.$font-secondary;
      font-variation-settings: "wght" 400;
      margin: 20px 0;
    }

    p {
      max-width: 46rem;
      margin-bottom: 1rem;
      line-height: 1.5rem;

      @media (min-width: 1024px) {
      line-height: 2.2rem;
      }
    }
  }

  .about-container {
    margin: 0 auto;
    padding-block: 2rem;
    padding-inline: 4rem;
    font-family: f.$font-primary;
    color: c.$color-primary;

    @media (min-width: 600px) {
      padding-block: 3rem;
    }

    @media (min-width: 1024px) {
      padding-block: 4rem;
    }
}

  .about-text-split {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;

    p {
      margin: 0;
    }
  }

  .about-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;

    @media (min-width: 600px) {
        &--facilities {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (min-width: 1024px) {
      &--facilities {
        grid-template-columns: repeat(5, 1fr);
      }
    }
  }

  .about-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    background-color: c.$color-secondary;

      img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        display: block;
        transition: transform 0.3s ease;
        z-index: 0;
        position: relative;
      }

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.45),
        rgba(0, 0, 0, 0.65)
        );
        z-index: 1;
        pointer-events: none;
      }

      span {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        text-align: center;
        background: transparent;
        color: c.$color-secondary;
        font-size: 1rem;
        font-family: f.$font-secondary;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        pointer-events: none;
      }

      &:hover img {
        transform: scale(1.04);
      }
  }
</style>