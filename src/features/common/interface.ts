export type PartialNull<T> = {
	[K in keyof T]?: T[K] | null
}
