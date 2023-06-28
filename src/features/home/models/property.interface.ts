export interface IPropertyJson {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	isCompleted: boolean;
}

export interface IProperty {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	isCompleted: boolean;
}
