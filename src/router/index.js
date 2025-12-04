// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Calendar from '../views/Calendar.vue'
import Events from '../views/Events.vue'
import Header from '@/components/Header.vue'
import AktivitetsOversigt from '@/views/AktivitetsOversigt.vue'
import HeroSlideshow from '@/components/HeroSlideshow.vue'
import MiniCalendar from '@/components/MiniCalendar.vue'
import SectionDarkBlue from '@/components/SectionDarkBlue.vue'
import FindActivity from '@/components/FindActivity.vue'
import OpeningHours from '@/components/OpeningHours.vue'
import ForeningsTamplate from '@/components/ForeningsTamplate.vue'
import ForeningsStrength from '@/views/ForeningsStrength.vue'
import OmOs from '@/views/OmOs.vue'
import Kontakt from '@/views/Kontakt.vue'
import KontaktFormular from '@/views/KontaktFormular.vue'
import KlodsterBakken from '@/views/KlodsterBakken.vue'
import Havnebadet from '@/views/Havnebadet.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/calendar',
      name: 'calendar',
      component: Calendar, 
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
    },
    {
      path: '/header',
      name: 'header',
      component: Header,
    },
    {
      path: '/aktivitetsoversigt',
      name: 'aktivitetsoversigt',
      component: AktivitetsOversigt,
    },
    {
      path: '/heroslide',
      name: 'heroslide',
      component: HeroSlideshow,
    },
    {
      path: '/minicalendar',
      name: 'minicalendar',
      component: MiniCalendar,
    },
    {
      path: '/sectiondarkblue',
      name: 'sectiondarkblue',
      component: SectionDarkBlue,
    },
    {
      path:'/findactivity',
      name: 'findactivity',
      component: FindActivity,
    },
    {
      path: '/openinghours',
      name: 'openinghours',
      component: OpeningHours,
    },
    {
      path: '/foreningstamplate',
      name: 'foreningstamplate',
      component: ForeningsTamplate,
    },
    {
      path: '/foreningsstrength',
      name: 'foreningsstrength',
      component: ForeningsStrength,
    },
    {
      path: '/omos',
      name: 'omos',
      component: OmOs,
    },
    {
      path: '/kontakt',
      name: 'kontakt',
      component: Kontakt,
    },
    {
      path: '/klodsterbakken',
      name: 'klodsterbakken',
      component: KlodsterBakken
    },
    {
      path: '/havnebadet',
      name: 'havnebadet',
      component: Havnebadet,
    },
    {
      path: '/kontaktformular',
      name: 'kontaktformular',
      component: KontaktFormular,
    },
    {
      path: '/activities/movetraining',
      name: 'movetraining',
      component: () => import('@/views/MoveTraining.vue'),
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    // hvis man klikker "tilbage"/"frem" i browseren
    if (savedPosition) {
      return savedPosition
    }
    // ellers: altid top
    return { left: 0, top: 0 }
  },
})

export default router

