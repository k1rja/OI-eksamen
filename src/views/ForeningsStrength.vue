<script setup>
import ForeningsTamplate from '@/components/ForeningsTamplate.vue';

import Fjordager from '@/assets/images/foreninger/fjordager.webp'
import KvindernesKvater from '@/assets/images/foreninger/kvinderneskvater.webp'
import OGF from '@/assets/images/foreninger/ogf.webp'
import SportsCentrum from '@/assets/images/foreninger/Sportscentrum.webp'
import VK from '@/assets/images/foreninger/vk.webp'


</script>

<template>
<ForeningsTamplate 
    :image="Fjordager"
    title="Fjordager Idrætsforening"
    text="Fjordager Motion er en afdeling i Fjordager IF. Vi er hjemmehørende i Seden, 6 km fra Odense centrum. Fjordager IF tilbyder et bredt og alsidigt udbud af forskellige aktiviteter for alle aldersgrupper i et motionspræget miljø med fokus på fællesskabet.
    <br> <br>
    Kig dig omkring på vores side og se mere til hvad vi har at tilbyde. "
    buttonText="Gå til forening"
    buttonLink="https://fjordager-if.dk/"
/>

<ForeningsTamplate 
    :image="KvindernesKvater"
    title="Kvindernes Kvarter"
    text="Kvindernes Kvarter er et sjovt og inkluderende motionsfællesskab for kvinder, hvor vi sammen skaber et stærkt og socialt sammenhold. <br>
    Her er alle med til at sætte dagsordenen for foreningen, og vi bidrager aktivt til at skaffe nye medlemmer, arrangere træning og holde gejsten oppe. "
    buttonText="Gå til forening"
    buttonLink="https://motionsdag.dk/"
/>

<ForeningsTamplate 
    :image="OGF"
    title="Odense Gymnastikforening"
    text="Oplevelse · Glæde · Fællesskab <br>
    Hos OGF handler det om mere end bare motion – det handler om at være en del af et fællesskab, hvor glæden ved bevægelse er i centrum.
    <br> <br>
    Du kan følge med og blive en del af vores fælleskab på hjemmesiden"
    buttonText="Gå til forening"
    buttonLink="https://www.ogf.dk/"
/>

<ForeningsTamplate 
    :image="SportsCentrum"
    title="Odense Sportscentrum"
    text="Nordens Største Multi- og Kampsportcenter <br>
    Odense Sportscentrum er et samlingssted for  forskellige idrætsaktiviteter.  Med sine 1.000 kvm foreningsfitness for alle. Kraftværket har døgnåbent 24/7, hvor du uden for åbningstid kan bruge dit nøglearmbånd. Gratis parkering – gratis indmeldelse – ubegrænset træning"
    buttonText="Gå til forening"
    buttonLink="https://odensesportscentrum.dk/"
/>

<ForeningsTamplate 
    :image="VK"
    title="Vægtløfterklubben Kono"
    text="I VK Kono kan du træne styrkeløft og vægtløftning samt almindelig fitnesstræning, både alene eller som en del af vores fællestræninger. 
    <br> <br>
    På hjemmesiden kan du finde mere information "
    buttonText="Gå til forening"
    buttonLink="https://vkkono.dk/default.aspx"
/>
</template>

<style lang="scss">
</style>