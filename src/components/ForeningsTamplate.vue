<script setup>
defineProps({
  title: String,
  text: String,
  buttonText: String,
  buttonLink: String,
  image: String
})
</script>

<template>
    <section class="forenings_tamplate">
        <div class="tamplate_section_img">
            <img class="forening_section_img" v-if="image" :src="image" alt="">
        </div>
        <div class="content">
        <h2 class="content_h2" v-html="title"></h2>
        <p class="content_p" v-html="text"></p>
        </div>
        
        <div class="tamplate_btn">
            <div class="tamplate_content_btn">
                <a
                    v-if="buttonText && buttonLink && buttonLink.startsWith('http')"
                    :href="buttonLink"
                    target="_blank"
                    class="link_btn"
                    rel="noopener"
                >
                    {{ buttonText }}
                </a>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;
@use '../assets/_buttons.scss' as b;

.tamplate_content_btn {
  @include b.button(b.$button-primary);
  margin-top: 20px;
}

.link_btn:hover {
    color: c.$color-secondary;
}

.link_btn {
    color: c.$color-secondary;
}

.forenings_tamplate {
    width: 90%;
    height: 33.9375rem;
    flex-shrink: 0;
    border-radius: 0.625rem;
    background: c.$color-secondary;
    filter: drop-shadow(4px 5px 10.5px rgba(0, 0, 0, 0.25));
    margin: auto;
    margin-bottom: 20px;
    margin-top: 20px;
}

.tamplate_section_img {
    display: flex;
    justify-content: center;
    margin: 0px 0px;
    padding: 10px;
}

.forening_section_img {
    width: 40%;
    max-width: 200px;
}

.content {
    margin: 0px 30px;
}

.content_p {
    margin-top: 10px;
}

.tamplate_btn {
    display: flex;
    justify-content: center;
}

@media (min-width: 1024px) {
    .forenings_tamplate {
        display: flex;
        flex-direction: row;
        height: 17.625rem;
        align-items: center;
        justify-content: space-between;
    }

    .content {
        width: 60%;
        margin: 0px 10px;
    }

    .tamplate_section_img {
        display: block;
    }

    .forening_section_img {
        width: 100%;
        margin-left: 20px;
    }

    .tamplate_btn {
        margin-right: 40px;
    }
}




</style>