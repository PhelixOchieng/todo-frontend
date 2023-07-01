export interface ITodoJson {
  id: number
  title: string
  description: string
  isCompleted: boolean
	completedAt: string | null
	createdAt: string
	updatedAt: string
}

export interface ITodo {
  id: number
  title: string
  description: string
	isCompleted: boolean
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
