export interface ITodoJson {
  id: number
  title: string
  description: string
  completedAt: string | null
  createdAt: string
  updatedAt: string | null
}
export interface ITodo {
  id: number
  title: string
  description: string
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
}

export interface ITodoDetailsJson extends ITodoJson {
  createdBy: {
    id: string
    userName: string
    image: string
  }
}
export interface ITodoDetails extends ITodo {
  createdBy: {
    id: string
    username: string
    image: string
  }
}
