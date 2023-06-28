import axios, { type AxiosResponse } from 'axios'

import type { IApiRequestConfig } from './interfaces'
import {
  authInterceptor,
  requestLoggerInterceptor,
  responseLoggerInterceptor,
} from './interceptors'
import { delay } from '@/common/functional'

export const baseURL = import.meta.env.VITE_API_URL

const instance = axios.create({
  baseURL,
  timeout: 30 * 1000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(authInterceptor)
instance.interceptors.request.use(requestLoggerInterceptor)
instance.interceptors.response.use(
  responseLoggerInterceptor.success,
  responseLoggerInterceptor.error,
)

export const api = {
  async request(config: IApiRequestConfig) {
    const onSuccess = config.onSuccess
    const onError = config.onError

    delete config.onSuccess
    delete config.onError

    if (config.isFormData) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    }

    try {
      const [_, response] = await Promise.all([
        delay(250 + Math.random() * 250),						// delay between 250 - 500 ms
        await instance.request(config),
      ])
      if (onSuccess) onSuccess(response)
    } catch (err) {
      if (onError) onError(err)
    }
  },

  get(url: string, config: IApiRequestConfig) {
    return this.request({ method: 'get', url, ...config })
  },

  post(url: string, data: unknown, config: IApiRequestConfig) {
    return this.request({ method: 'post', url, data, ...config })
  },

  patch(url: string, data: unknown, config: IApiRequestConfig) {
    return this.request({ method: 'patch', url, data, ...config })
  },

  delete(url: string, config: IApiRequestConfig) {
    return this.request({ method: 'delete', url, ...config })
  },
}
