import { api } from '@/core/api'

import {
  type TTodosApiResponse,
  type ITodosParams,
  type TTodoApiResponse,
  type TTodoUpdateApiResponse,
  type TTodoUpdatePayload,
} from './interface'

const basePath = 'todos'

export const todosService = {
  retrieveAll(params: ITodosParams) {
    return new Promise<TTodosApiResponse>((resolve, reject) => {
      api.get(`${basePath}/`, { params, onSuccess: resolve, onError: reject })
    })
  },
  retrieveOne(id: string) {
    return new Promise<TTodoApiResponse>((resolve, reject) => {
      api.get(`${basePath}/${id}/`, { onSuccess: resolve, onError: reject })
    })
  },
  updateOne(id: string, payload: TTodoUpdatePayload) {
    return new Promise<TTodoUpdateApiResponse>((resolve, reject) => {
      api.patch(`${basePath}/${id}/`, payload, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },
}
