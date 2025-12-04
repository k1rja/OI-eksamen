<script setup>
import KontaktInfo from '@/components/KontaktInfo.vue'

import Mail from '@/assets/images/ikoner/mail.webp'
import Mobil from '@/assets/images/ikoner/mobil.webp'
import Lokation from '@/assets/images/ikoner/placering.webp'
import Ur from '@/assets/images/ikoner/tid.webp'
import KontaktFormular from './KontaktFormular.vue'

</script>

<template>
    <div class="kontakt_content">
        <div class="content_left">
            <div class="content_left_info">

                <h2>Administration</h2>

                
                <KontaktInfo
                    :icon="Mail"
                    text="Idraetspark@odense.dk"
                    href="mailto:Idraetspark@odense.dk"
                />

                <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 65 51 53 72"
                    href="tel:+4565515372"
                />

                <KontaktInfo
                    :icon="Lokation"
                    text="Israels Plads 3, 5200 Odense V"
                />

                <KontaktInfo
                    :icon="Ur"
                    text="Man-tor: kl. 08.30 - 15.30 fredag: kl. 08.30 - 13.00"
                />
                
            </div>

            <div class="content_left_info">

                <h2>Odense idrætshal</h2>

                <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 30 24 02 65 - Forplejning til arrangementer eller møder"
                    href="tel:+4530240265"
                />

                <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 65 51 53 77 - Vagttelefon Odense Idrætshal"
                    href="tel:+4565515377"
                />

                <p class="p_content">
                    OBS - vagttelefonen besvarer ikke henvendelser vedrørende NemBillet, Åbningstider, eller glemte sager.
                </p>

            </div>

            <div class="content_left_info">
                
                <h2>Odense Isstadion</h2>

                <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 65 51 53 77 - Vagten"
                    href="tel:+4565515377"
                />

                <KontaktInfo
                    :icon="Lokation"
                    text="Møllemarksvej 75, 5200 Odense V"
                />

                <p class="p_content">
                    Har du brug for information om firma-arrangementer eller Pay & Play, bedes du kontakte Odense Bulldogs
                </p>

                <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 69 96 05 50 - Odense Bulldogs "
                    href="tel:+4569960550"
                />
            </div>

            <div class="content_left_info">
                <h2>Thorvald Ellegaard Arena</h2>

                <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 40 90 32 06 - John Smed"
                    href="tel:+4540903206"
                />

                <KontaktInfo
                    :icon="Lokation"
                    text="Thorvalds Vænge 9, 5200 Odense V"
                />
            </div>

            <div class="content_left_info">

                <h2>Svømmeanlæg</h2>

                <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 65 51 53 72"
                    href="tel:+4565515372"
                />

                <p class="p_content">
                    Adresser på de enkle anlæg kan finde under faciliteter også under svømmehaller
                </p>
            </div>

        </div>

        <div class="content_right">

            <div class="content_right_info">

                <h2>Ledere ved Odense Idrætspark</h2>
                
                <div class="right_info_ledere1">

                    <h3>Sekretariatsleder Maria Skovlund Herreborg</h3>

                    <KontaktInfo
                    :icon="Mail"
                    text="msher@odense.dk"
                    href="mailto:msher@odense.dk"
                    />

                    <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 21 72 99 51"
                    href="tel:+4565515372"
                    />
                </div>

                <div class="right_info_ledere">

                    <h3>Leder af svømmehallerne Lars Christensen</h3>

                    <KontaktInfo
                    :icon="Mail"
                    text="larch@odense.dk"
                    href="mailto:larch@odense.dk"
                    />

                    <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 29 11 86 22"
                    href="tel:+4529118622"
                    />
                </div>

                <div class="right_info_ledere">

                    <h3>Leder af Odense Idrætspark og teknisk afdeling</h3>

                    <KontaktInfo
                    :icon="Mail"
                    text="danfl@odense.dk"
                    href="mailto:danfl@odense.dk"
                    />

                    <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 61 37 25 31"
                    href="tel:+4561372531"
                    />
                </div>

                <div class="right_info_ledere">

                    <h3>Chef for Fritid, Park og Vej  Anders Skovgaard</h3>

                    <KontaktInfo
                    :icon="Mail"
                    text="ansm@odense.dk"
                    href="mailto:ansm@odense.dk"
                    />

                    <KontaktInfo
                    :icon="Mobil"
                    text="+ 45 40 48 36 19"
                    href="tel:+4540483619"
                    />
                </div>

            </div>

            <div class="right_kontakt_formular">

                <h2>Kom i kontakt med os</h2>
                <p class="kontakt_formular_p">Har du spørgsmål til booking, åbningstider eller vores faciliteter, er du altid velkommen til at kontakte os. Vi hjælper gerne med at finde den rette person eller afdeling, så du hurtigt får svar på dit spørgsmål.</p>
                  
                <KontaktFormular />
            </div>

        </div>


    </div>


</template>

<style lang="scss">
@use '../assets/_colors.scss' as c;
@use '../assets/_fonts.scss' as f;
@use '../assets/_buttons.scss' as b;

.kontakt_content {
    margin-left: 20px;
    margin-right: 20px;
    color: c.$color-primary;
}

h2 {
    font-weight: 900;
    margin-bottom: 20px;
}

h3 {
    margin-bottom: 20px;
}

.p_content {
    margin-bottom: 20px;
    margin-left: 5px;
}

.content_left_info {
    margin-top: 70px;
    margin-left: 0px;
}

.content_right_info {
    margin-top: 70px;
    margin-left: 0px;
}

.right_info_ledere {
    margin-top: 70px;
}

.right_info_ledere1 {
    margin-top: 20px;
}

.right_kontakt_formular {
    margin-top: 70px;
    margin-bottom: 40px;
}

.kontakt_formular_p {
    margin-bottom: 20px;
}

@media (min-width: 1024px) {

    .kontakt_content {
        display: flex;
    }

    .content_left {
        width: 50%;
        margin: 0px 100px 0px 60px;
    }

    .content_right {
        width: 50%;
        margin: 0px 60px 40px 100px;
    }

    .content_left_info {
        margin-bottom: 70px;
    }

    .right_info_ledere {
        margin-bottom: 70px;
    }

    .right_info_ledere1 {
        margin-bottom: 70px;
    }

}
</style>