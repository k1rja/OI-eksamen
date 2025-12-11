<script setup>
  import { useRouter } from 'vue-router'
  import { loginAsUser, loginAsAdmin } from '@/stores/authState'

  const router = useRouter()

  function handleUserLogin () {
    loginAsUser()
    router.push('/')          // tilbage til forsiden
  }

  function handleAdminLogin () {
    loginAsAdmin()
    router.push('/calendar')  // ind på admin-/calendar-siden
  }
</script>

<template>
  <main class="loginChoice wrapper">
    <h1 class="loginChoice__title">Log ind som</h1>

    <section class="loginChoice__options">
      <button
        type="button"
        class="loginChoice__btn loginChoice__btn--user"
        @click="handleUserLogin"
      >
        Privat bruger / borger
      </button>

      <button
        type="button"
        class="loginChoice__btn loginChoice__btn--admin"
        @click="handleAdminLogin"
      >
        Administrator
      </button>
    </section>
  </main>
</template>

<style scoped>
  .wrapper {
    padding: 40px clamp(1.5rem, 5vw, 70px) 70px;
  }

  .loginChoice {
    display: grid;
    gap: 24px;
    max-width: 480px;
    margin-inline: auto;
    text-align: center;
  }

  .loginChoice__title {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .loginChoice__options {
    display: grid;
    gap: 16px;
  }

  .loginChoice__btn {
    border-radius: 999px;
    padding: 12px 20px;
    border: 1px solid #d0d4e4;
    background: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
</style>