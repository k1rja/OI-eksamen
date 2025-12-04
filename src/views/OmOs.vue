<script setup>
import HeroTamplate      from '@/components/HeroTamplate.vue';
import SectionDarkBlue   from '@/components/SectionDarkBlue.vue';
import SectionLightBlue  from '@/components/SectionLightBlue.vue';

import AboutFacilities   from '@/components/AboutFacilities.vue';
import AboutValues       from '@/components/AboutValues.vue';
import AboutFollow       from '@/components/AboutFollow.vue';

import friendsImg    from '@/assets/images/about/friends.webp';
import communityImg  from '@/assets/images/about/community.webp';
import bikeImg       from '@/assets/images/about/cykel.webp';
import handsImg      from '@/assets/images/about/hands.webp';
</script>

<template>
  <!-- HERO -->
  <div class="about-hero">
    <HeroTamplate
      :image="friendsImg"
      title="Bevægelse, fællesskab og oplevelser for alle"
      text="Odense Idrætspark skaber rammerne for idræt, bevægelse og fællesskab i hele byen. Her mødes borgere, foreninger og klubber for at dyrke motion, oplevelser og glæden ved at være aktiv – uanset alder og niveau."
      :gradient="true"
    />
  </div>

  <!-- VORES FACILITETER -->
  <AboutFacilities />

  <!-- MERE END BARE SPORT -->
  <SectionLightBlue
    :image="bikeImg"
    title="Mere end bare sport"
    text="Odense Idrætspark er en del af Odense Kommune og arbejder for at skabe <span>aktive fællesskaber</span> i hele byen. Vi samarbejder med lokale foreninger og haller for at give alle adgang til <span>sunde og sjove aktiviteter.</span>"
    buttonText="Udforsk"
    buttonLink="/aktiviteter"
  />

  <!-- VÆRDIER OG VISION -->
  <AboutValues />

  <!-- FÆLLESSKAB OG FRIVILLIGHED -->
  <SectionDarkBlue
    :image="communityImg"
    title="Fællesskab og frivillighed"
    text="Hos Odense Idrætspark er fællesskab meget mere end motion. Det er glæden ved at være sammen, hjælpe hinanden og skabe oplevelser, der binder mennesker sammen. Frivillige er en vigtig del af hverdagen og er med til at skabe liv i hallerne og styrke sammenholdet."
    buttonText="Udforsk"
    buttonLink="/frivillighed"
  />

  <!-- FØLG MED -->
  <AboutFollow />

  <!-- HAR DU SPØRGSMÅL? -->
  <SectionDarkBlue
    :image="handsImg"
    title="Har du spørgsmål?"
    text="Har du spørgsmål til booking, åbningstider eller vores faciliteter, er du altid velkommen til at kontakte os. Vi hjælper dig gerne videre til den rette person eller afdeling, så du hurtigt får svar."
    buttonText="Kontakt"
    buttonLink="/kontakt"
  />
</template>

<style scoped lang="scss">
@use '../assets/_colors.scss' as c;

/* mørkere gradient kun på OM OS hero */
.about-hero :deep(.hero_tamplate--gradient::before) {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.55) 40%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

/* match hero-typografi */
.about-hero :deep(.content_h2) {
  font-variation-settings: "wght" 700;
  font-size: clamp(1.6rem, 4vw, 3rem);
}

.about-hero :deep(.content_h2 span) {
  font-variation-settings: "wght" 900;
}
</style>