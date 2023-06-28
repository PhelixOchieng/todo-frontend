export interface ITodoJson {
	id: number;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	isCompleted: boolean;
}

export interface ITodo {
	id: number;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	isCompleted: boolean;
}
