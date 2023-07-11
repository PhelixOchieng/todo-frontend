import { createRouter, createWebHistory } from 'vue-router'

import { isAuthTokenValid, isTokenValidForAdmin } from '@/common/functional'

import { authRoutes } from '@/features/auth/routes'
import { homeRoutes } from '@/features/home/routes'
import { profileRoutes } from '@/features/profile/routes'
import { errorsRoutes } from '@/features/errors/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...homeRoutes, ...profileRoutes, ...errorsRoutes],
})

router.beforeEach((to) => {
  const routeRequiresAuth = !to.meta.noAuth
  console.log(to, to.meta.noAuth, routeRequiresAuth)
  if (!routeRequiresAuth) return

  const isLoggedIn = isAuthTokenValid()
	console.log('Needs to be logged in:', isLoggedIn)
  if (!isLoggedIn) return { name: 'login', query: { to: to.path !== '/' ? to.path : undefined } }

  const isUserAdmin = isTokenValidForAdmin()
  if (isUserAdmin) return

  return { name: 'err-not-allowed', query: { to: to.path } }
})

export default router
