<script setup>
import SectionDarkBlue from '@/components/SectionDarkBlue.vue';
import SectionLightBlue from '@/components/SectionLightBlue.vue';
import HeroTamplate from '@/components/HeroTamplate.vue';
import OpenHours from '@/components/OpenHours.vue';
import FacilitetsInfo from '@/components/FacilitetsInfo.vue';

import KlosterBakkenHero from '@/assets/images/faciliteter/klosterbakkenHero.webp'
import Klosterbakken from '@/assets/images/faciliteter/klosterbakken.webp'
import Sauna from '@/assets/images/faciliteter/sauna.webp'
import AfslapningIkon from '@/assets/images/ikoner/afslapningIkon.webp'
import BadIkon from '@/assets/images/ikoner/BadIkon.webp'
import BilletIkon from '@/assets/images/ikoner/BilletIkon.webp'
import CabinIkon from '@/assets/images/ikoner/CabinIkon.webp'
import CafeteriIkon from '@/assets/images/ikoner/CafeteriIkon.webp'
import DampIkon from '@/assets/images/ikoner/DampIkon.webp'
import DybteIkon from '@/assets/images/ikoner/DybteIkon.webp'
import FitnessIkon from '@/assets/images/ikoner/FitnessIkon.webp'
import LivrederIkon from '@/assets/images/ikoner/LivrederIkon.webp'
import PoolIkon from '@/assets/images/ikoner/PoolIkon.webp'
import SaunaIkon from '@/assets/images/ikoner/SaunaIkon.webp'
import SkabIkon from '@/assets/images/ikoner/SkabIkon.webp'
import placeringIkon from '@/assets/images/ikoner/placering.webp'

const winterHours = [
  { day: 'Mandag',  time: '06:30 - 20:00' },
  { day: 'Tirsdag', time: '06:30 - 20:00' },
  { day: 'Onsdag',  time: '06:30 - 20:00' },
  { day: 'Torsdag', time: '13:30 - 18:30' },
  { day: 'Fredag',  time: '06:30 - 18:30' },
  { day: 'Lørdag',  time: '07:00 - 13:30' },
  { day: 'Søndag',  time: '08:00 - 13:30' }
]
</script>

<template>
  <HeroTamplate 
    :image="KlosterBakkenHero"
    title="Svømmehallen Klosterbakken"
  />

  <SectionDarkBlue 
    :image="Klosterbakken"
    title="Vinter åbningstider"
    text="Der er lukkede d.25/12 samt d. 1-4 januar"
  >
    <template #extra>
      <OpenHours :hours="winterHours" />
    </template>
  </SectionDarkBlue>

  <SectionLightBlue 
    :image="Sauna"
    title="Gode ting at være opmærksom på"
    text="Når du besøger Svømmehallen Klosterbakken, er der et par praktiske ting, der er gode at have styr på. Skabene i omklædningen kræver som regel, at du selv medbringer en hængelås, og billetter købes enten i automaten med Dankort eller MobilePay, eller online via Nembillet, da der ikke tages imod kontanter."
  />


  <div class="praktisk_info">
    <div class="praktisk_info_container">
        <h2 class="praktisk_info_h2">Det skal du vide inden jeres besøg</h2>
    </div>

    <div class="praktisk_info_wrapper">
        <div class="praktisk_info_left">
            <FacilitetsInfo 
                :icon="placeringIkon"
                text="Klosterbakken 5, 5000 Odense C"
            />
            
            <FacilitetsInfo 
                :icon="BilletIkon"
                text="Billetautomat i svømmehallen"
            />
            
            <FacilitetsInfo 
                :icon="PoolIkon"
                text="Bassin størrelse 25 m x 12 m"
            />
            
            <FacilitetsInfo 
                :icon="DybteIkon"
                text="Vanddybde fra 0,9 til ca. 3,10 m"
            />
            
            <FacilitetsInfo 
                :icon="BadIkon"
                text="Omklædningsrum, brusere og toiletter tilgængelige"
            />
            
            <FacilitetsInfo 
                :icon="SkabIkon"
                text="Små aflåste skabe til værdigenstande (Husk hængelås)"
            />
            
            <FacilitetsInfo 
                :icon="SaunaIkon"
                text="Sauna (~85 °C)"
            />
        </div>
        
        <div class="praktisk_info_right">
            <FacilitetsInfo 
                :icon="AfslapningIkon"
                text="Relax balkonen"
            />
            
            <FacilitetsInfo 
                :icon="CabinIkon"
                text="Infrarød kabine"
            />
            
            <FacilitetsInfo 
                :icon="DampIkon"
                text="Damp-sauna (~47 °C/90% fugtighed)"
            />
            
            <FacilitetsInfo 
                :icon="DampIkon"
                text="Bio-sauna (~57 °C/40% fugtighed)"
            />
            
            <FacilitetsInfo 
                :icon="FitnessIkon"
                text="Motionsrum"
            />
            
            <FacilitetsInfo 
                :icon="CafeteriIkon"
                text="Cafeterie"
            />
            
            <FacilitetsInfo 
                :icon="LivrederIkon"
                text="Livredder til stede i svømmehallen"
            />
        </div>
    </div>

  </div>

</template>

<style lang="scss">
.praktisk_info_container {
margin: 20px;
}

.praktisk_info {
margin-bottom: 50px;
margin-top: 50px;
}

.praktisk_info_wrapper {
padding: 0px 20px;
}

@media (min-width: 1024px) {
    .praktisk_info_wrapper {
        display: flex;
        flex-direction: row;
        padding: 2rem 4rem;
    }

    .praktisk_info_left {
        width: 50%;
        padding-right: 10px;
    }

    .praktisk_info_right {
        width: 50%;
        padding-left: 10px;
    }

    .praktisk_info_container {
        padding: 0px 4rem;
        margin: 0px;
    }

}
</style>