<script setup>
    import instagramBlack from '@/assets/images/instagram_logo/black-glyph/instagram_glyph_black.webp'
    import facebookBlue from '@/assets/images/facebook_logo/logo/primary-logo/Facebook_Logo_Primary.webp'
    import odenseIdreatspark from '@/assets/images/ikoner/odense-idreatspark-logo.webp'
    import logIndIkon from '@/assets/images/ikoner/logind-ikon.webp'
    import dropdownPil from '@/assets/images/ikoner/dropdown_pil.webp'

    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { useRouter } from 'vue-router'


    const activeIndex = ref(null)
    const isMenuOpen  = ref(false)

    const toggle = (i) => {
    activeIndex.value = activeIndex.value === i ? null : i
    }

    const toggleMenu = () => {        
    isMenuOpen.value = !isMenuOpen.value
    }

    // refs til klik-udenfor
    const desktopNavRef = ref(null)
    const mobileNavRef  = ref(null)
    const burgerRef     = ref(null)

    const onDocClick = (e) => {
    const inDesktop = desktopNavRef.value?.contains(e.target)
    const inMobile  = mobileNavRef.value?.contains(e.target)
    const onBurger  = burgerRef.value?.contains(e.target)
    if (!inDesktop && !inMobile && !onBurger) {
        activeIndex.value = null
        isMenuOpen.value  = false
    }
    }

    onMounted(() => document.addEventListener('click', onDocClick, { capture: true }))
    onBeforeUnmount(() => document.removeEventListener('click', onDocClick, { capture: true }))

    const router = useRouter()
    router.afterEach(() => { activeIndex.value = null; isMenuOpen.value = false })

</script>

<template>
    <header>
        <div class="header_mobil">
            <div>
                <button class="hamburger" ref="burgerRef" @click.stop="toggleMenu" :aria-expanded="isMenuOpen">
            
                    <svg width="40" height="17" viewBox="0 0 55 24" fill="none">              
                        <rect id="streg_1" width="40" height="2" fill="#210700"></rect>         
                        <rect id="streg_2" y="11" width="40" height="2" fill="#210700"></rect>
                        <rect id="streg_3" y="22" width="40" height="2" fill="#210700"></rect>
                    </svg>  <!--størrelsen, højden og farven for mine streger - hamburgermenuen-->  

                </button>
            </div>

            <nav class="mobil_nav" ref="mobileNavRef" :class="{ open: isMenuOpen }" @click.stop>
                <ul class="mobil_nav_ul" @click.stop>
                    <li>
                        <button @click="toggle(0)">Aktiviteter<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 0 }"></button>

                        <ul v-if="activeIndex === 0">
                            <li><RouterLink to="/aktivitetsoversigt">Aktivitetsoversigt</RouterLink></li>
                            <li>Foreninger</li>
                        </ul>
                    </li>

                    <li>
                        <button @click="toggle(1)">Booking og priser<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 1 }"></button>

                        <ul v-if="activeIndex === 1">
                            <li><RouterLink to="/events">Book hold</RouterLink></li>
                            <li>Book mødelokale</li>
                            <li>Lej udstyr</li>
                            <li>Priser og billetter</li>
                        </ul>
                    </li>

                    <li>
                        <button @click="toggle(2)">Åbningstider og info<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 2 }"></button>

                        <ul v-if="activeIndex === 2">
                            <li>Svømmehaller</li>
                            <li>Idrætshaller</li>
                            <li>Stadion og Arenaer</li>
                            <li>Friluftbad</li>
                            <li>Skøjtehal</li>
                        </ul>

                    </li>

                    <li>
                        <button @click="toggle(3)">Om os<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 3 }"></button>

                        <ul v-if="activeIndex === 3">
                            <li>Hvem er vi?</li>
                            <li>Ledige stillinger</li>
                            <li>Presse og udvikling</li>
                        </ul>
                    </li>

                    <li>
                        <RouterLink to="/kontakt" class="header_nav_link header_nav_link--kontakt">
                            Kontakt
                        </RouterLink>
                    </li>

                    <ul class="header__socials">
                        <li>
                            <a href="https://www.instagram.com/odenseidraetspark/" target="_blank" rel="noopener">
                            <img class="logo_mobil_some" :src="instagramBlack" alt="Instagram logo"/>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/OdenseIdraetspark/" target="_blank" rel="noopener">
                            <img class="logo_mobil_some" :src="facebookBlue" alt="Facebook logo"/>
                            </a>
                        </li>
                    </ul>
                        
                </ul> 
            </nav>

            <div class="mobil_header_logo">
                <RouterLink to="/">
                    <img class="mobil_logo_img" :src="odenseIdreatspark" alt=" Logo af Odense Idrætspark" />
                </RouterLink>
            </div>

            <div class="mobil_header_actions">
                <div class="header_actions_login">
                    <img class="mobil_ikon_img" :src="logIndIkon" alt="Logind ikon" />
                </div>
            </div>
        </div>

        <div class="top_header">
            <div class="top_header_some">
                <a href="https://www.instagram.com/odenseidraetspark/" 
                    target="_blank" 
                    rel="noopener">
                    <img class="header_some_img" :src="instagramBlack" alt="instagram logo" />
                </a>

                <a href="https://www.facebook.com/OdenseIdraetspark/" 
                    target="_blank" 
                    rel="noopener">
                    <img class="header_some_img" :src="facebookBlue" alt="facebook logo" />
                </a>
            </div>

            <div class="top_header_logo">
                <RouterLink to="/">
                    <img class="header_logo_img" :src="odenseIdreatspark" alt="Logo af Odense Idrætspark" />
                </RouterLink>
            </div>

            <div class="top_header_actions">
                <div class="header_actions_login">
                    <img class="actions_img" :src="logIndIkon" alt="Logind ikon" />
                </div>
                <p class="actions_LogInd_p">Log ind</p>
            </div>
        </div>

        <nav class="bottom_header_nav" ref="desktopNavRef">
            <ul class="header_nav_ul">
                <li>
                    <button @click="toggle(0)">Aktiviteter<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 0 }"></button>

                    <ul v-if="activeIndex === 0">
                        <li><RouterLink to="/aktivitetsoversigt">Aktivitetsoversigt</RouterLink></li>
                        <li><RouterLink to="/foreningsstrength">Foreninger</RouterLink></li>
                    </ul>
                </li>

                <li>
                    <button @click="toggle(1)">Booking og priser<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 1 }"></button>

                    <ul v-if="activeIndex === 1">
                        <li><RouterLink to="/events">Book hold</RouterLink></li>
                        <li>Book mødelokale</li>
                        <li>Lej udstyr</li>
                        <li>Priser og billetter</li>
                    </ul>
                </li>

                <li>
                    <button @click="toggle(2)">Åbningstider og info<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 2 }"></button>

                    <ul v-if="activeIndex === 2">
                        <li>Svømmehaller</li>
                        <li>Idrætshaller</li>
                        <li>Stadion og Arenaer</li>
                        <li>Friluftbad</li>
                        <li>Skøjtehal</li>
                    </ul>

                </li>

                <li>
                    <button @click="toggle(3)">Om os<img :src="dropdownPil" alt="dropdown pil" class="dropdown__arrow" :class="{ rotated: activeIndex === 3 }"></button>

                    <ul v-if="activeIndex === 3">
                        <li><RouterLink to="/omos">Hvem er vi?</RouterLink></li>
                        <li>Ledige stillinger</li>
                        <li>Presse og udvikling</li>
                    </ul>
                </li>

                <li>
                    <RouterLink to="/kontakt" class="header_nav_link header_nav_link--kontakt">
                        Kontakt
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style lang="scss" scoped>
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;

.top_header {
    display: none;
}

.dropdown__arrow {
    width: 14px;
    height: 14px;
    margin-left: 8px;
    transition: transform 0.3s ease;
}

.dropdown__arrow.rotated {
    transform: rotate(180deg);
}

.bottom_header_nav {
    display: none;
}

.hamburger {
    margin-top: 20px;
    background-color: transparent;
    border: 0px;
}

/* ---------------------- */
/* MOBILE NAVIGATION      */
/* ---------------------- */

.mobil_nav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 60%;
    max-width: 320px;
    background: #F5F5F5;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.2);
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 999;
    padding: 2rem 1.5rem;
    color: c.$color-primary;

    &.open {
        transform: translateX(0);
    }

    &_ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            margin-bottom: 1rem;

            button,
            a {
                background: none;
                border: none;
                font-size: 1.1rem;
                color: #210700;
                text-decoration: none;
                width: 100%;
                text-align: left;
                cursor: pointer;
            }

            button {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .dropdown__arrow {
                    transition: transform 0.3s ease;

                    &.rotated {
                        transform: rotate(180deg);
                    }
                }
            }

            ul {
                margin-top: 0.5rem;
                margin-left: 1rem;

                li {
                    margin-bottom: 0.5rem;
                }
            }

            ul {
                list-style: none;
                margin: 0.3rem 0 0 1rem;
                padding: 0;

                li {
                    padding: 0.4rem 0;
                    font-size: 1rem;
                    color: #210700;
                }
            }
        }
    }
}

.logo_mobil_some {
    width: 30px;
    margin: 5px;
}

.header_mobil {
    display: flex;
    justify-content: space-between;
    margin: 15px 15px;
}

.mobil_ikon_img {
    width: 20px;
    height: 20px;
    margin: 10px;
    margin-top: 20px;
}

.mobil_logo_img {
    width: 130px;
}

.mobil_header_actions {
    display: flex;
}

.mobil_nav_ul {
    position: absolute;
}



@media (min-width: 600px) {

}

@media (min-width: 1024px) {

    .header_mobil {
        display: none;
    }

    .top_header {
        display: flex;
        margin: 10px 20px;
        justify-content: space-between;
    }

    .bottom_header_nav {
        width: 100%;
        height: 35px;
        background-color: c.$color-primary;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 0;

        .header_nav_ul {
            display: flex;
            gap: 2rem;
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                position: relative;

                button {
                    background: transparent;
                    border: none;
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 700;
                    cursor: pointer;
                    color: c.$color-secondary;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    transition: all 0.3s ease;

                    &:hover {
                        color: c.$color-tertiary;
                        transform: translateY(-2px);
                    }

                    img {
                        width: 10px;
                        transition: transform 0.3s ease;
                    }

                    &.rotated img {
                        transform: rotate(180deg);
                    }
                }

                ul {
                    list-style: none;
                    position: absolute;
                    top: 1.6rem;
                    left: 0;
                    background-color: c.$color-secondary;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    padding: 0.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    z-index: 2000;

                    li {
                        color: #210700;
                        cursor: pointer;
                        transition: color 0.2s;
                        margin: 10px;

                        &:hover {
                            color: c.$color-tertiary;
                        }
                    }
                }
            }
        }
    }

    .header_some_img {
        width: 20px;
        height: 20px;
        margin: 10px;
        margin-top: 25px;
    }

    .header_logo_img {
        width: 150px;
    }

    .actions_img {
        width: 20px;
        height: 20px;
        margin: 10px;
        margin-top: 25px;
    }

    .top_header_actions {
        display: flex;
    }

    .actions_LogInd_p {
        margin-top: 25px;
        font-weight: 600;
    }

    .header_nav_link--kontakt {
        font-size: 13px;
        font-weight: 700;
        color: c.$color-secondary;
        display: flex;
        align-items: center;
        gap: 0.3rem;
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
            color: c.$color-tertiary;
            transform: translateY(-2px);
        }
    }
}
</style>