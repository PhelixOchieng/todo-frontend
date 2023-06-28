import type { RouteRecordRaw } from 'vue-router'

import HomeView from './index.vue'
import ListView from './pages/list.vue'
import DetailsView from './pages/details.vue'

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'home',
        component: ListView,
      },
      {
        path: 'properties/:id',
        name: 'property-details',
        component: DetailsView,
      },
    ],
  },
]
