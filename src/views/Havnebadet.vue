<script setup>
import SectionDarkBlue from '@/components/SectionDarkBlue.vue';
import SectionLightBlue from '@/components/SectionLightBlue.vue';
import HeroTamplate from '@/components/HeroTamplate.vue';
import OpenHours from '@/components/OpenHours.vue';
import FacilitetsInfo from '@/components/FacilitetsInfo.vue';

import HavnebadetHero from '@/assets/images/faciliteter/HavnebadHero.webp'
import Havnebadet from '@/assets/images/faciliteter/Havnebad.webp'
import BoernHavnebadet from '@/assets/images/faciliteter/BoernHavnebad.webp'
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
  { day: 'Mandag',  time: '06:30 - 09.30' },
  { day: 'Tirsdag', time: '16:00 - 20:30' },
  { day: 'Onsdag',  time: '06:00 - 09:30' },
  { day: 'Torsdag', time: '16:00 - 20:30' },
  { day: 'Fredag',  time: '06:00 - 09:30' },
  { day: 'Lørdag',  time: '08:00 - 10:30' },
  { day: 'Søndag',  time: '08:00 - 10:30' }
]
</script>

<template>
   <HeroTamplate 
    :image="HavnebadetHero"
    title="Odense havnebad"
  />

  <SectionDarkBlue 
    :image="BoernHavnebadet"
    title="Vinter åbningstider"
    text="Der er lukkede d.25/12 samt d. 1-4 januar"
  >
    <template #extra>
      <OpenHours :hours="winterHours" />
    </template>
  </SectionDarkBlue>

  <SectionLightBlue 
    :image="Havnebadet"
    title="Gode ting at være opmærksom på"
    text="Da området er udendørs, er det vigtigt at have tøj og håndklæde med – og et ekstra håndklæde til at sidde på i saunaen. <br> <br>
    Oplevelsen afhænger meget af vejret og årstiden. Selvom der er åbent hele året, kan temperatur og komfort variere, så det er en god idé at tage højde for dagens vejrforhold før besøget."
  />


    <div class="praktisk_info">
        <div class="praktisk_info_container">
            <h2 class="praktisk_info_h2">Det skal du vide inden jeres besøg</h2>
        </div>

        <div class="praktisk_info_wrapper">
            <div class="praktisk_info_left">
                <FacilitetsInfo 
                    :icon="placeringIkon"
                    text="Gammel Havnekaj 3, 5000 Odense C"
                />
                
                <FacilitetsInfo 
                    :icon="BilletIkon"
                    text="Gratis entre"
                />
                
                <FacilitetsInfo 
                    :icon="PoolIkon"
                    text="Bassin størrelse 33,3 m × 12,5 m"
                />
                
                <FacilitetsInfo 
                    :icon="DybteIkon"
                    text="Vanddybde fra ca. 80 cm til 200 cm"
                />
            
            </div>

            <div class="praktisk_info_right">
                <FacilitetsInfo 
                    :icon="BadIkon"
                    text="Omklædningsrum, brusere og toiletter tilgængelige"
                />
                
                <FacilitetsInfo 
                    :icon="SkabIkon"
                    text="Små aflåste skabe til værdigenstande"
                />
                
                <FacilitetsInfo 
                    :icon="SaunaIkon"
                    text="Sauna (~85 °C)"
                />
            
                <FacilitetsInfo 
                    :icon="LivrederIkon"
                    text="Livredder til stede i sommerperioden"
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