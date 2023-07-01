import { api } from '@/core/api'

import type {
  TTodosApiResponse,
  ITodosParams,
  TTodoApiResponse,
  TTodoUpdateApiResponse,
  TTodoUpdatePayload,
  TTodoAddPayload,
  TTodoAddApiResponse,
TTodoDeleteApiResponse,
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
  addOne(payload: TTodoAddPayload) {
    return new Promise<TTodoAddApiResponse>((resolve, reject) => {
      api.post(`${basePath}/`, payload, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  },
	deleteOne(id: string) {
		return new Promise<TTodoDeleteApiResponse>((resolve, reject) => {
			api.delete(`${basePath}/${id}/`, {
				onSuccess: resolve,
				onError: reject,
			})
		})
	}
}
