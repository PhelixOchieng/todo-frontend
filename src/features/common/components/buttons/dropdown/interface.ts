export interface IItem<T> {
	name: string;
	key: string;
	[propName: string]: any;
}

export interface IProps<T> {
	items: IItem<T>[]
}
