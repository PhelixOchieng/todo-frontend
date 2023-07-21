import { defineStore } from 'pinia'

import { IApiRequestStatus } from '@/core/api'
import { getErrorMessage } from '@/core/api/utils'

import UserModel from './models/user.model'
import { userService, type TUserUpdatePayload } from './service'

interface IState {
  userApiStatus: IApiRequestStatus
  userApiMsg: string
  user: UserModel | null

  userUpdateApiStatus: IApiRequestStatus
  userUpdateApiMsg: string
}

const state = (): IState => ({
  userApiStatus: IApiRequestStatus.Default,
  userApiMsg: '',
  user: null,

  userUpdateApiStatus: IApiRequestStatus.Default,
  userUpdateApiMsg: '',
})

export const useProfileStore = defineStore('profile', {
  state,
  actions: {
    async getProfile() {
      try {
        this.userApiStatus = IApiRequestStatus.Loading
        this.userApiMsg = ''
        
				const response = await userService.getProfile()
        const data = response.data.data
        this.user = UserModel.fromJson(data)

        this.userApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.userApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.userApiMsg = message
      }
    },
    async updateProfile(payload: TUserUpdatePayload) {
      try {
        this.userUpdateApiStatus = IApiRequestStatus.Loading
        this.userUpdateApiMsg = ''

        const response = await userService.updateProfile(payload)
        const data = response.data.data
        this.user = UserModel.fromJson(data)

        this.userUpdateApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.userUpdateApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.userUpdateApiMsg = message
      }
    },

    // Reset
    reset() {
      this.userApiStatus = IApiRequestStatus.Default
      this.userApiMsg = ''
      this.user = null
    },
  },
})
