import { IApiRequestStatus } from '@/core/api'
import { defineStore } from 'pinia'

import { isAuthTokenValid, removeAuthTokens, saveAuthToken } from '@/common/functional'
import { getErrorMessage } from '@/common/functional/errors'

import type {
  IEmailVerificationPayload,
  ILoginPayload,
  IPasswordResetPayload,
  ISignupPayload,
} from './services/interface'
import { authService } from './services/service'
import { useProfileStore } from '../profile/store'

interface IState {
  loginApiStatus: IApiRequestStatus
  loginApiMsg: string
	isUserAuthed: boolean

  signupApiStatus: IApiRequestStatus
  signupApiMsg: string

  emailVerificationApiStatus: IApiRequestStatus
  emailVerificationApiMsg: string
  verifiedEmail: string | null

  passwordResetApiStatus: IApiRequestStatus
  passwordResetApiMsg: string
}

const state = (): IState => ({
  loginApiStatus: IApiRequestStatus.Default,
  loginApiMsg: '',
	isUserAuthed: isAuthTokenValid(),

  signupApiStatus: IApiRequestStatus.Default,
  signupApiMsg: '',

  emailVerificationApiStatus: IApiRequestStatus.Default,
  emailVerificationApiMsg: '',
  verifiedEmail: null,

  passwordResetApiStatus: IApiRequestStatus.Default,
  passwordResetApiMsg: '',
})

export const useAuthStore = defineStore('auth-store', {
  state,
  actions: {
    async login(payload: ILoginPayload) {
      try {
        this.loginApiStatus = IApiRequestStatus.Loading
        this.loginApiMsg = ''

        const response = await authService.login(payload)
        const tokens = response.data.data
        saveAuthToken(tokens)

        this.verifiedEmail = null
				this.isUserAuthed = true
        this.loginApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.loginApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.loginApiMsg = message
      }
    },
    async signup(payload: ISignupPayload) {
      try {
        this.signupApiStatus = IApiRequestStatus.Loading
        this.signupApiMsg = ''

        await authService.signup(payload)

        this.signupApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.signupApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.signupApiMsg = message
      }
    },

    async verifyEmail(payload: IEmailVerificationPayload) {
      try {
        this.emailVerificationApiStatus = IApiRequestStatus.Loading
        this.emailVerificationApiMsg = ''

        await authService.validateEmail(payload)

        this.verifiedEmail = payload.email
        this.emailVerificationApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.emailVerificationApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.emailVerificationApiMsg = message
      }
    },
    async resendToken() {
      this.passwordResetApiStatus = IApiRequestStatus.Default
      this.passwordResetApiMsg = ''

      await this.verifyEmail({
        email: this.verifiedEmail!,
      })
    },
    async resetPassword(payload: IPasswordResetPayload) {
      try {
        this.passwordResetApiStatus = IApiRequestStatus.Loading
        this.passwordResetApiMsg = ''

        await authService.resetPassword(payload)

        this.passwordResetApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.passwordResetApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.passwordResetApiMsg = message
      }
    },


		// Reset
		logout() {
			this.isUserAuthed = false;
			removeAuthTokens();

			const profileStore = useProfileStore()
			profileStore.reset()
		}
  },
})
