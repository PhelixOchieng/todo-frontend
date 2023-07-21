import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export enum IApiRequestStatus {
  Default = 'default',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface IApiRequestConfig extends AxiosRequestConfig {
  onSuccess?: (data: AxiosResponse) => void
  onError?: (err: unknown) => void
  isFormData?: boolean
}

export interface IApiRequestParams {
  pageSize?: number
  page?: number
  [propName: string]: any
}

export interface IApiResponse<T = never> extends AxiosResponse {
  data: {
    error: boolean
    message: string
    data: T
  }
}
