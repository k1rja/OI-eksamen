<script setup>
import odenseIdraetspark from '../assets/images/ikoner/odense-idreatspark-logo.webp'
import odenseKommune from '../assets/images/ikoner/kommunelogo.webp'
import instagramBlack from '../assets/images/instagram_logo/black-glyph/instagram_glyph_black.webp'
import facebookBlue from '../assets/images/facebook_logo/logo/primary-logo/Facebook_Logo_Primary.webp'
</script>

<template>
    <footer class="footer" role="contentinfo">
      <div class="footer__inner">
        <div class="footer__logos">
          <img
            class="footer__logo footer__logo--idraetspark" :src="odenseIdraetspark" alt="Logo af Odense Idrætspark"/>
          <img
            v-if="odenseKommune" class="footer__logo footer__logo--kommune" :src="odenseKommune" alt="Logo af Odense Kommune"/>
        </div>
  
        <div class="footer__info">
          <h2 class="footer__title">Odense Idrætspark</h2>
          <p class="footer__subtitle">– en del af Odense Kommune</p>
          <p class="footer__line">
            By- og Kulturforvaltningen (Fritid og Kultur)
          </p>
          <p class="footer__line">Israels Plads 3, 5200 Odense V</p>
          <p class="footer__line">CVR: 35209115</p>
        </div>

        <div class="footer__contact">
          <h2 class="footer__heading">Kontakt</h2>
          <a class="footer__link" href="mailto:kontakt@odense-idraetspark.dk">
            kontakt@odense-idraetspark.dk
          </a>
          <a class="footer__link" href="tel:+4566131372">
            +45 66 13 13 72
          </a>
        </div>

        <div class="footer__social" aria-label="Sociale medier">
          <h2 class="footer__follow">Følg os</h2>
  
          <div class="footer__social-icons">
            <a
              class="footer__social-link" href="https://www.instagram.com/odenseidraetspark/" target="_blank" rel="noopener">
              <span class="sr-only">Instagram</span>
              <img class="footer__social-img" :src="instagramBlack" alt="Ikon af Instagram"/>
            </a>
  
            <a
              class="footer__social-link" href="https://www.facebook.com/OdenseIdraetspark/" target="_blank" rel="noopener">
              <span class="sr-only">Facebook</span>
              <img class="footer__social-img" :src="facebookBlue" alt="Ikon af Facebook" />
            </a>
          </div>
        </div>
        <p class="footer__copyright"><a href="https://www.flaticon.com/free-icons/linkedin" title="icons from freepik and flaticon">© 2025 - Odense Idrætspark (Ikoner fra Freepik og Flaticon)</a></p>
      </div>
    </footer>
</template>

<style lang="scss" scoped>
@use '../assets/_colors.scss' as c;

    .footer {
        background: c.$color-tertiary;
        color: c.$color-primary;

        &__inner {
            display: grid;
            gap: 28px;
            padding-block: 24px;                      
            padding-inline: clamp(1.5rem, 5vw, 80px); 
            margin-inline: auto;
            grid-template-columns: 1fr;
            grid-template-areas:
            "logos"
            "info"
            "contact"
            "follow";
        }

        &__logos   {
            grid-area: logos;
            display: flex;
            flex-direction: column; 
            align-items: flex-start;
            gap: 16px;
        }

        &__info    { grid-area: info;    line-height: 1.6; min-width: 0; }
        &__contact { grid-area: contact; display: flex; flex-direction: column; gap: 12px; }

        &__social {
            grid-area: follow;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }

        .footer__follow {
            margin: 0;
            font-weight: 700;
            font-size: 1.1rem;
        }

        .footer__social-icons {
            display: flex;
            gap: 8px;
            margin-left: -8px;
        }

        .footer__social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            inline-size: 38px;
            block-size: 38px;
            border-radius: 999px;
        }

        .footer__social-img {
            inline-size: 22px;
            block-size: 22px;
        }

        &__logo--idraetspark { height: 56px; }
        &__logo--kommune     { height: 64px; }

        &__title     { margin: 0 0 6px; font-weight: 700; font-size: 1rem; }
        &__subtitle  { margin: 0 0 8px; font-weight: 400; font-size: .9rem; }
        &__line      { margin: 0 0 6px; font-size: .95rem; }

        &__heading,
        .footer__follow {
            margin: 0;
            font-weight: 700;
            font-size: 1rem;
        }

        &__link {
            color: c.$color-primary;
            text-decoration: none;

            &:hover,
            &:focus {
            text-decoration: underline;
            }
        }

        @media (min-width: 600px) {
            &__inner {
                gap: 34px;
                padding-block: 32px;
                padding-inline: clamp(1.5rem, 4vw, 48px);
                grid-template-columns: 1.4fr 1fr 0.9fr;
                grid-template-areas: "logos logos logos" "info contact follow";
                align-items: start;
            }

            &__logos {
                flex-direction: row;
                align-items: center;
                gap: 28px;
            }


            &__logo--idraetspark { height: 60px; }
            &__logo--kommune     { height: 70px; }
                .footer__social-link { inline-size: 40px; block-size: 40px; 
            }

            &__copyright {
              grid-column: 1 / -1;
              text-align: center;
            }
          }
        @media (min-width: 1024px) {
            &__inner {
                padding-block: 40px;
                gap: 48px;
                grid-template-columns: 1.4fr 1fr 0.9fr;
                grid-template-areas: "logos logos logos" "info  contact follow";
                align-items: start;
            }

            &__logo--idraetspark { height: 64px; }
            &__logo--kommune     { height: 72px; }

            &__title { font-size: 1.25rem; }
            &__heading,
            .footer__follow { font-size: 1.2rem; }
            &__line  { font-size: 1rem; }

            .footer__social-link { inline-size: 42px; block-size: 42px; }
            .footer__social-img  { inline-size: 24px; block-size: 24px; }
        }
    }

    /* skærmlæser-hjælper */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
</style>