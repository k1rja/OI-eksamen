<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const TO_EMAIL = 'march67093@edu.ucl.dk'

function onSubmit() {
  const bodyText =
    `Navn: ${form.name}\n` +
    `Email: ${form.email}\n\n` +
    `${form.message}`

  const subject = encodeURIComponent(form.subject)
  const body = encodeURIComponent(bodyText)

  window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`
}

</script>

<template>
  <form @submit.prevent="onSubmit" class="kontakt_formular">
    <label>
     <p class="kantakt_formular_p">Dit navn</p>
        <input 
            class="kontakt_indput" 
            v-model="form.name" 
            type="text" required
            placeholder="Skriv dit navn"
        />
    </label>

    <label>
      <p class="kantakt_formular_p">Din mail</p>
        <input 
            class="kontakt_indput" 
            v-model="form.email" 
            type="email" required 
            placeholder="Skriv din mail"
        />
    </label>

    <label>
      <p class="kantakt_formular_p">Emne</p>
        <input 
            class="kontakt_indput" 
            v-model="form.subject" 
            type="text" required 
            placeholder="Emne"
        />
    </label>

    <label>
        <p class="kantakt_formular_p">Din besked</p>
        <textarea
            class="kontakt_formualar_besked"
            v-model="form.message"
            rows="5"
            required
            placeholder="Skriv din besked her..."
        ></textarea>
    </label>

    <button type="submit" class="btn">SEND</button>
  </form>
</template>

<style lang="scss">
    @use '../assets/_colors.scss' as c;
    @use '../assets/_fonts.scss' as f;
    @use '../assets/_buttons.scss' as b;
    
    .btn {
    @include b.button(b.$button-primary);
    margin-top: 20px;
    }

    input::placeholder,
    textarea::placeholder {
    color: #94A3B8;  
    opacity: 1;     
    font-style: italic; 
    padding: 5px;
    }

    input,
    textarea {
    padding: 5px;
    padding-left: 10px;
    }

    .kantakt_formular_p {
        font-weight: 600;
        margin: 5px;
    }

    .contactForm {
        margin: 20px 0px;
        display: flex;
        flex-direction: column;
    }

    .kontakt_indput {
        width: 100%;
        height: 30px;
        flex-shrink: 0;
        filter: drop-shadow(4px 6px 17px rgba(0, 0, 0, 0.25));
        border: 1px solid rgba(0, 0, 0, 0.40);
        border-radius: 0.625rem;
        margin-bottom: 20px;
    }

    .kontakt_formualar_besked {
        width: 100%;
        height: 150px;
        flex-shrink: 0;
        filter: drop-shadow(4px 6px 17px rgba(0, 0, 0, 0.25));
        border: 1px solid rgba(0, 0, 0, 0.40);
        border-radius: 0.625rem;
    }


</style>
