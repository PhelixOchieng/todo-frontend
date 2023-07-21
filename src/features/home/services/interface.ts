import type { IApiResponse } from '@/core/api'

import type { PartialNull } from '@/features/common/interface'
import type { ITodoDetailsJson, ITodoJson } from '../models/todo.interface'

export interface ITodosParams {
	lastItemId?: ITodoJson['id'] | null
	pageSize?: number | null
  search?: string | null
}

export type TTodosApiResponse = IApiResponse<ITodoJson[]>
export type TTodoApiResponse = IApiResponse<ITodoDetailsJson>

export type TTodoUpdatePayload = PartialNull<
  Omit<ITodoDetailsJson, 'id' | 'createdAt' | 'updatedAt' | 'createdAt'>
> & { isCompleted?: boolean | null }
export type TTodoUpdateApiResponse = TTodoApiResponse

export type TTodoAddPayload = {
  title: string
  description: string | null
}
export type TTodoAddApiResponse = IApiResponse<ITodoDetailsJson>

export type TTodoDeleteApiResponse = IApiResponse
