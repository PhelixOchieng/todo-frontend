import { defineStore } from 'pinia'

import { IApiRequestStatus } from '@/core/api'
import { getErrorMessage } from '@/core/api/utils'

import TodoModel from './models/todo.model'
import type { ITodosParams } from './services/interface'
import { todosService } from './services/service'

interface IState {
  todosApiStatus: IApiRequestStatus
  todosApiMsg: string
  todos: TodoModel[]

  todoApiStatus: IApiRequestStatus
  todoApiMsg: string
  todo: TodoModel | null
}

const state = (): IState => ({
  todosApiStatus: IApiRequestStatus.Default,
  todosApiMsg: '',
  todos: [],

  todoApiStatus: IApiRequestStatus.Default,
  todoApiMsg: '',
  todo: null,
})

export const useTodosStore = defineStore('todosStore', {
  state,
  actions: {
    async getTodos(params: ITodosParams) {
      try {
        this.todosApiStatus = IApiRequestStatus.Loading
        this.todosApiMsg = ''

        const response = await todosService.retrieveAll(params)
        this.todos = response.data.map((json) => TodoModel.fromJson(json))

        this.todosApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.todosApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.todosApiMsg = message
      }
    },
    async getTodo(id: number) {
      try {
        const todo = this.todos?.find((i) => i.id === id)
        if (todo) {
          this.todo = todo
          return
        }

        this.todoApiStatus = IApiRequestStatus.Loading
        this.todoApiMsg = ''

        const response = await todosService.retrieveOne(id)
        this.todo = TodoModel.fromJson(response.data)

        this.todoApiStatus = IApiRequestStatus.Success
      } catch (e) {
        this.todoApiStatus = IApiRequestStatus.Error

        const message = getErrorMessage(e)
        this.todoApiMsg = message
      }
    },
  },
})
