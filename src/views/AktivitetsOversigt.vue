<script setup>
import SectionDarkBlue from '@/components/SectionDarkBlue.vue';
import SectionLightBlue from '@/components/SectionLightBlue.vue';
import HeroTamplate from '@/components/HeroTamplate.vue';

import moveImg     from '@/assets/images/activities/movetraining.webp'
import ballImg     from '@/assets/images/activities/ballandteam.webp'
import outdoorImg  from '@/assets/images/activities/outdoornature.webp'
import cultureImg  from '@/assets/images/activities/creativityculture.webp'
import heroImg from '@/assets/images/hero-slides/heroishocky.webp'


</script>

<template>

<HeroTamplate 
  :image="heroImg"
  title="Find din næste <span>fritidsaktivitet</span> i Odense"
  text="Dyk ned i byens mange fritidsaktiviteter – uanset om du vil prøve noget nyt, møde nye mennesker eller dyrke din passion. Herunder kan du udforske kategorierne og finde din næste en forening som tilbyder aktiviteterne."
/>

<SectionLightBlue
  :image="moveImg"
    title="Bevægelse & træning"
    text="Udfordre dig selv og hold kroppen i gang! Her finder du alt fra <span>klassisk styrketræning og gymnastik til kampsport og rulleskøjter.</span> Uanset niveau kan du være med – det handler bare om at bevæge sig og have det sjovt."
    buttonText="Udforsk"
    buttonLink="/activities/movetraining"
/>

<SectionDarkBlue
    :image="ballImg"
    title="Bold- og holdsport"
    text="Elsker du fællesskabet og energien i holdsport? Vælg mellem alt fra <span>fodbold og håndbold til badminton, volleyball og tennis.</span> Her er der altid plads til både nye spillere og erfarne boldentusiaster."
    buttonText="Udforsk"
    buttonLink="/activities/movetraining"
/>

<SectionLightBlue
  :image="outdoorImg"
    title="Friluft & natur"
    text="Få frisk luft og god energi i naturen. Deltag i aktiviteter som <span>ridning, golf, spejder eller vandaktiviteter </span>– perfekte for dig, der elsker at være aktiv under åben himmel og nyde fællesskabet i naturen."
    buttonText="Udforsk"
    buttonLink="/activities/movetraining"
/>

<SectionDarkBlue
    :image="cultureImg"
    title="Kreativitet & kultur"
    text="Her finder du alt, der samler mennesker om oplevelser og fællesskab. Udfold dig <span>kreativt gennem musik, teater og håndværk </span>– eller vær med i aktiviteter som e-sport, curling og motorsport."
    buttonText="Udforsk"
    buttonLink="/activities/movetraining"
/>
</template>