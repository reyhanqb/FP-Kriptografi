import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    // {
    //   path: '/blind',
    //   name: 'Test',
    //   component: () => import('../views/Blind.vue')
    // },
    {
      path: '/algo',
      name: 'Voting',
      component: () => import('../views/Algorithm.vue')
    },
    {
      path: '/view',
      name: 'View Votes',
      component: () => import('../views/ViewVote.vue')
    }
  ]
})

export default router
