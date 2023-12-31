import type { RouteRecordRaw } from 'vue-router'

import IndexView from './index.vue'
import LoginView from './pages/login.vue'
import SignupView from './pages/signup.vue'
import PasswordResetView from './pages/reset-password.vue'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    component: IndexView,
    redirect: { name: 'login' },
		meta: { noAuth: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginView
      },
			{
				path: 'signup',
				name: 'signup',
				component: SignupView,
			},
			{
				path: 'reset-password',
				name: 'password-reset',
				component: PasswordResetView,
			}
    ]
  }
]
