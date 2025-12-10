<script setup>
import { useRoute } from 'vue-router';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import OpeningBanner from './components/OpeningBanner.vue';

const route = useRoute();
// de routes hvor banneret IKKE skal vises
const hideBannerOn = ['calendar']; // name: 'calendar' i din router
</script>

<template>
  <Header />
  <OpeningBanner v-if="!hideBannerOn.includes(route.name)" />
  <RouterView />
  <Footer />
</template>

<style lang="scss" scoped>
</style>


<style lang="scss" scoped>

</style>