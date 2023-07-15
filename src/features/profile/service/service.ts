import { api } from '@/core/api'

import type { TUserApiResponse, TUserUpdatePayload, TUserUpdateApiResponse } from './interface'

export const userService = {
  async getProfile() {
    return new Promise<TUserApiResponse>((resolve, reject) => {
      api.get('/profile/', {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },
  async updateProfile(payload: TUserUpdatePayload) {
    return new Promise<TUserUpdateApiResponse>((resolve, reject) => {
      api.post('/profile/', payload, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },
}
