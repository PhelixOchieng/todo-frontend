import type { ITodo, ITodoJson } from './todo.interface'

export default class TodoModel implements ITodo {
  public id: number
  public title: string
  public description: string
  public isCompleted: boolean
  public completedAt: Date | null
  public createdAt: Date
  public updatedAt: Date

  constructor(data: ITodo) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.isCompleted = data.isCompleted
    this.completedAt= data.completedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  static fromJson(json: ITodoJson): TodoModel {
    return new TodoModel({
      id: json.id,
      title: json.title,
      description: json.description,
      isCompleted: json.isCompleted,
      completedAt: json.completedAt ? new Date(json.completedAt) : null,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    })
  }
}
