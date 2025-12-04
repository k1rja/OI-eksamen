<script setup>
import SectionDarkBlue from '@/components/SectionDarkBlue.vue';
import SectionLightBlue from '@/components/SectionLightBlue.vue';
import HeroTamplate from '@/components/HeroTamplate.vue';

import Atlatik from '@/assets/images/activities/atlatik.webp'
import Dans from '@/assets/images/activities/dans.webp'
import Hero from '@/assets/images/activities/hero_move.webp'
import Gymnastik from '@/assets/images/activities/gymnastik.webp'
import Kampsport from '@/assets/images/activities/kampsport.webp'
import Rulle from '@/assets/images/activities/rulle.webp'
import Styrke from '@/assets/images/activities/styrke.webp'
</script>

<template>
<HeroTamplate 
  :image="Hero"
  title="Bevægelse & træning"
/>

<SectionLightBlue
  :image="Styrke"
  title="Styrketræning"
  text="Find de foreninger som tilbyder aktiviteter hvor der er fokus på styrketræning. "
  buttonText="Udforsk"
  buttonLink="/foreningsstrength"
/>

<SectionDarkBlue
  :image="Gymnastik"
  title="Gymnastik"
  text="Find nogen af de mange foreninger som tilbyder gymnastik hold. Her finder du blandt andet tilbud om <span>rytmisk gymnastik, spring gymnastik, varmtvands gymnastik</span> og meget mere."
  buttonText="Udforsk"
  buttonLink="/foreningsstrength"
/>

<SectionLightBlue
  :image="Dans"
  title="Dans"
  text="Find de foreninger som tilbyder dansehold, her finder du blandt andet <span>cheerleding, dance-fitness og linedance</span>"
  buttonText="Udforsk"
  buttonLink="/foreningsstrength"
/>

<SectionDarkBlue
  :image="Atlatik"
  title="Atletik"
  text="Her finder du alle de forskellige foreninger som tilbyder Atletik aktiviteter "
  buttonText="Udforsk"
  buttonLink="/foreningsstrength"
/>

<SectionLightBlue
  :image="Rulle"
  title="Rulleskøjter"
  text="Find de foreninger som tilbyder aktiviteter inde for rulleskøjtning som <span>rulleski, skøjtning og rulle skøjter</span>"
  buttonText="Udforsk"
  buttonLink="/foreningsstrength"
/>

<SectionDarkBlue
  :image="Kampsport"
  title="Kampsport"
  text="Her finder du alle de forskellige foreninger som tilbyder forskellige kampsportshold. Blandt andet hold med <span>boksning, fætning, karate og mange flere</span>"
  buttonText="Udforsk"
  buttonLink="/foreningsstrength"
/>
</template>

<style lang="sass">
</style>