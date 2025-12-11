import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import Calendar from '@/views/Calendar.vue'
import Events from '@/views/Events.vue'

import AktivitetsOversigt from '@/views/AktivitetsOversigt.vue'
import ForeningsStrength from '@/views/ForeningsStrength.vue'
import OmOs from '@/views/OmOs.vue'
import Kontakt from '@/views/Kontakt.vue'
import KontaktFormular from '@/views/KontaktFormular.vue'
import KlodsterBakken from '@/views/KlodsterBakken.vue'
import Havnebadet from '@/views/Havnebadet.vue'
import LoginChoice from '@/views/LoginChoice.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginChoice,
    },
    { 
      path: '/calendar',
      name: 'calendar',
      component: Calendar, 
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
    },
    {
      path: '/aktivitetsoversigt',
      name: 'aktivitetsoversigt',
      component: AktivitetsOversigt,
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
      path: '/kontaktformular',
      name: 'kontaktformular',
      component: KontaktFormular,
    },
    {
      path: '/klodsterbakken',
      name: 'klodsterbakken',
      component: KlodsterBakken,
    },
    {
      path: '/havnebadet',
      name: 'havnebadet',
      component: Havnebadet,
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
    return { left: 0, top: 0 }
  },
})

export default router