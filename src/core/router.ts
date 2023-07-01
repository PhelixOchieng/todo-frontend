import { createRouter, createWebHistory } from 'vue-router'

import { isAuthTokenValid, isTokenValidForAdmin } from '@/common/functional/authToken'

import { homeRoutes } from '@/features/home/routes'
import { errorsRoutes } from '@/features/errors/routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...homeRoutes,

    // Must always be last
    ...errorsRoutes,
  ],
})

router.beforeEach((to) => {
  const isAdminRoute = (to.name as string | undefined)?.includes('admin-')
  if (!isAdminRoute) return

  const isLoggedIn = isAuthTokenValid()
  if (!isLoggedIn) return { name: 'auth', query: { to: to.path } }

  const isUserAdmin = isTokenValidForAdmin()
  if (isUserAdmin) return

  return { name: 'err-not-allowed', query: { to: to.path } }
})

export default router
