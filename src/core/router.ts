import { createRouter, createWebHistory } from 'vue-router'

import { isAuthTokenValid } from '@/common/functional'
import IndexView from '@/features/index.vue'

import { authRoutes } from '@/features/auth/routes'
import { homeRoutes } from '@/features/home/routes'
import { profileRoutes } from '@/features/profile/routes'
import { errorsRoutes } from '@/features/errors/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    {
      path: '',
      component: IndexView,
      children: [...homeRoutes, ...profileRoutes, ...errorsRoutes],
    },
  ],
})

router.beforeEach((to) => {
  const routeRequiresAuth = !to.meta.noAuth
  if (!routeRequiresAuth) return

  const isLoggedIn = isAuthTokenValid()
  if (!isLoggedIn) return { name: 'login', query: { to: to.path !== '/' ? to.path : undefined } }

  return
})

export default router
