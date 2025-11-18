import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from './pages/Home.vue'
import ChampionRank from './pages/ChampionRank.vue'
import Messages from './pages/Messages.vue'
import Videos from './pages/Videos.vue'
import Gacha from './pages/Gacha.vue'
import DpsCalc from './pages/DpsCalc.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages
  },
  {
    path: '/videos',
    name: 'Videos',
    component: Videos
  },
  {
    path: '/champions',
    name: 'ChampionRank',
    component: ChampionRank
  },
  {
    path: '/gacha',
    name: 'Gacha',
    component: Gacha
  },
  {
    path: '/dps-calculator',
    name: 'DPSCalculator',
    component: DpsCalc
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
