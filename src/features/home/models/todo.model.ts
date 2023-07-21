import type { ITodo, ITodoDetails, ITodoDetailsJson, ITodoJson } from './todo.interface'

export default class TodoModel implements ITodo {
  public id: number
  public title: string
  public description: string
  public completedAt: Date | null
  public createdAt: Date
  public updatedAt: Date | null

  constructor(data: ITodo) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.completedAt = data.completedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  static fromJson(json: ITodoJson): TodoModel {
    return new TodoModel(TodoModel.buildData(json))
  }

  static buildData(json: ITodoJson): ITodo {
    return {
      id: json.id,
      title: json.title,
      description: json.description,
      completedAt: json.completedAt ? new Date(json.completedAt) : null,
      createdAt: new Date(json.createdAt),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : null,
    }
  }

  get isCompleted(): boolean {
    return this.completedAt !== null
  }
}

export class TodoDetailsModel extends TodoModel implements ITodoDetails {
  public createdBy: { id: string; username: string; image: string }

  constructor(data: ITodoDetails) {
    super(data)
    this.createdBy = data.createdBy
  }

  static fromJson(json: ITodoDetailsJson): TodoDetailsModel {
    return new TodoDetailsModel({
      ...TodoModel.buildData(json),
      createdBy: {
				id: json.createdBy.id,
				username: json.createdBy.userName,
				image: json.createdBy.image,
			}
    })
  }
}
