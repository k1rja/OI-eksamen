<script setup>
  import { useRoute } from 'vue-router';
  import Footer from './components/Footer.vue';
  import Header from './components/Header.vue';
  import OpeningBanner from './components/OpeningBanner.vue';

  const route = useRoute();
  const hideBannerOn = ['calendar'];
</script>

<template>
  <Header />
  <OpeningBanner v-if="!hideBannerOn.includes(route.name)" />
  <RouterView />
  <Footer />
</template>


