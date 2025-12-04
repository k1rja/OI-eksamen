<script setup>
import morehandsImg from '@/assets/images/about/morehands.webp';
import runningImg   from '@/assets/images/about/running.webp';
import accessImg    from '@/assets/images/about/accessibility.webp';
import yogaImg      from '@/assets/images/about/yoga.webp';
</script>

<template>
  <section class="about-section about-section--values">
    <div class="about-container">
      <h2>Værdier og vision</h2>

      <div class="about-text-split">
        <p>
          Odense Idrætsparks vision er at skabe rammer, hvor alle kan finde glæde ved bevægelse og fællesskab.
          Vi vil være et sted, hvor både nye og erfarne udøvere føler sig hjemme, og hvor aktiviteterne giver
          energi, motivation og lyst til at være aktiv i hverdagen. Vi arbejder for at gøre vores faciliteter
          indbydende, trygge og tilgængelige for alle – uanset alder, niveau og baggrund. Vores værdier bygger
          på respekt, ansvarlighed og lysten til at bringe mennesker sammen gennem positive oplevelser og stærke
          fællesskaber.
        </p>
      </div>

      <div class="about-cards about-cards--values">
        <article class="about-card">
          <img :src="morehandsImg" alt="En masse hænder, der lægges ovenpå hinanden for at illustrere visionen: fællesskab" />
          <span>Fællesskab</span>
        </article>
        <article class="about-card about-card--offset">
          <img :src="runningImg" alt="To personer, der løber for at illustrerer visonen: bevægelse " />
          <span>Bevægelse</span>
        </article>
        <article class="about-card about-card--offset">
          <img :src="accessImg" alt="Forskellige tegnede hænder, hvoraf en af dem sidder i en kørestol, for at illustrere vædien: tilgængelighed  " />
          <span>Tilgængelighed</span>
        </article>
        <article class="about-card about-card--offset">
          <img :src="yogaImg" alt="To snakkende personer med en yogamåtte for at illustrere værdien: Ansvarlighed" />
          <span>Ansvarlighed</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
    @use '../assets/_colors.scss' as c;
    @use '../assets/_fonts.scss' as f;

    .about-section {
        background-color: #fefffe;
        color: c.$color-primary;

        &--values {
            background-color: #fefffe;
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
            &--values {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (min-width: 1024px) {
            &--values {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    }

    .about-card {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        background-color: #fefffe;

        img {
            width: 100%;
            height: 160px;
            object-fit: cover;
            object-position: 50% 50%;
            display: block;
            transition: transform 0.3s ease;
            z-index: 0;
            position: relative;
        }

        &--offset img {
            object-position: 50% 35%;
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