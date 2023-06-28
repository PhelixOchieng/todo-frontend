import type { IApiResponse } from '@/core/api'

import type { ITodoJson } from '../models/todo.interface'

export interface ITodosParams {
  page?: number
  pageSize?: number
  title?: number
}

export type TTodosApiResponse = IApiResponse<ITodoJson[]>
export type TTodoApiResponse = IApiResponse<ITodoJson>
