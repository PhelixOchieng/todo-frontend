import { api } from '@/core/api'

import type {
  TEmailVerificationApiResponse,
  IEmailVerificationPayload,
  ILoginPayload,
  TLoginApiResponse,
  IPasswordResetPayload,
  TPasswordResetApiResponse,
  ISignupPayload,
  TSignupApiResponse,
} from './interface'

const basePath = '/auth'

export const authService = {
  async login(payload: ILoginPayload) {
    return new Promise<TLoginApiResponse>((resolve, reject) => {
      api.post(`${basePath}/login/`, payload, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },
  async signup(payload: ISignupPayload) {
    return new Promise<TSignupApiResponse>((resolve, reject) => {
      api.post(`${basePath}/signup/`, payload, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },

  async validateEmail(payload: IEmailVerificationPayload) {
    return new Promise<TEmailVerificationApiResponse>((resolve, reject) => {
      api.post(`${basePath}/forgot-password/`, payload, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },
  async resetPassword(payload: IPasswordResetPayload) {
    return new Promise<TPasswordResetApiResponse>((resolve, reject) => {
      api.post(`${basePath}/new-password/`, payload, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },
}
