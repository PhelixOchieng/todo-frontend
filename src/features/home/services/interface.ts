import type { IApiResponse } from '@/core/api'

import type { ITodoJson } from '../models/todo.interface'

export interface ITodosParams {
  page?: number
  pageSize?: number
  title?: number
}

export type TTodosApiResponse = IApiResponse<ITodoJson[]>
export type TTodoApiResponse = IApiResponse<ITodoJson>

export type TTodoUpdatePayload = Partial<Exclude<ITodoJson, 'id' | 'createdAt' | 'updatedAt'>>
export type TTodoUpdateApiResponse = TTodoApiResponse

export type TTodoAddPayload = {
  title: string
  description: string | null
}
export type TTodoAddApiResponse = IApiResponse<ITodoJson>
