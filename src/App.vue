<script setup>
  import { useRouter } from 'vue-router'
  import Footer from './components/Footer.vue'
  import Header from './components/Header.vue'

  const router = useRouter()
</script>

<template>
  <Header></Header>
  <RouterView />
  <Footer></Footer>
</template>

<style lang="scss" scoped>

</style>