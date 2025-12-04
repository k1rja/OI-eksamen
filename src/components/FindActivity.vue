<script setup>
import { RouterLink } from 'vue-router'

import moveImg     from '@/assets/images/activities/movetraining.webp'
import ballImg     from '@/assets/images/activities/ballandteam.webp'
import outdoorImg  from '@/assets/images/activities/outdoornature.webp'
import cultureImg  from '@/assets/images/activities/creativityculture.webp'

const activities = [
  {
    id: 'move',
    title: 'Bevægelse & træning',
    to: '/activities/movetraining',
    image: moveImg,
  },
  {
    id: 'ball',
    title: 'Bold- og holdsport',
    to: '/activities/movetraining',
    image: ballImg,
  },
  {
    id: 'outdoor',
    title: 'Friluft & natur',
    to: '/activities/movetraining',
    image: outdoorImg,
  },
  {
    id: 'culture',
    title: 'Kreativitet & kultur',
    to: '/activities/movetraining',
    image: cultureImg,
  },
]
</script>

<template>
  <section class="findActivity" aria-labelledby="findActivityTitle">
    <div class="findActivity__inner">
      <header class="findActivity__header">
        <h2 id="findActivityTitle" class="findActivity__title">
          Et bredt udvalg af
          <span>aktiviteter for alle</span>
        </h2>
      </header>

      <ul class="findActivity__grid">
        <li
          v-for="activity in activities"
          :key="activity.id"
          class="findActivity__item"
        >
          <RouterLink
            :to="activity.to"
            class="findActivity__card"
            :style="{ '--bg-image': `url(${activity.image})` }"
          >
            <div class="findActivity__overlay" />
            <div class="findActivity__content">
              <p class="findActivity__label">
                {{ activity.title }}
              </p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;

    .findActivity {
        background: c.$color-secondary;
        padding-block: 48px;

        &__inner {
            padding-inline: 1rem;

            @media (min-width: 1024px) {
                padding-inline: 4rem;
            }
        }

        &__header {
            margin-bottom: 28px;
        }

        &__title {
            margin: 0;
            font-family: f.$font-secondary;
            font-size: clamp(1.5rem, 2vw, 2rem);
            font-weight: 500;
            color: c.$color-primary;

            span {
                font-weight: 900;
            }
        }

        &__grid {
            list-style: none;
            margin: 0;
            padding: 0;
            display: grid;
            gap: 18px;

            @media (min-width: 600px) {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 20px;
            }

            @media (min-width: 1024px) {
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 24px;
            }
        }

        &__item {
            min-width: 0;
        }

        &__card {
            position: relative;
            display: block;
            inline-size: 100%;
            block-size: 190px;
            border-radius: 18px;
            overflow: hidden;
            background-image: var(--bg-image);
            background-size: cover;
            background-position: center;
            text-decoration: none;
            cursor: pointer;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);
            transform: translateY(0);
            transition:
            transform 150ms ease-out,
            box-shadow 150ms ease-out;
        }

        &__overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.45),
            rgba(0, 0, 0, 0.65)
            );
            transition: background 150ms ease-out;
        }

        &__content {
            position: relative;
            inset: auto;
            block-size: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px 16px;
        }

        &__label {
            margin: 0;
            font-family: f.$font-secondary;
            font-weight: 800;
            font-size: 1rem;
            letter-spacing: 0.02em;
            color: c.$color-secondary;
        }

        &__card:hover,
        &__card:focus-visible {
            transform: translateY(-4px);
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
        }

        &__card:hover .findActivity__overlay,
        &__card:focus-visible .findActivity__overlay {
            background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0.6)
            );
        }

        &__card:focus-visible {
            outline: 2px solid c.$cta;
            outline-offset: 3px;
        }
    }
</style>