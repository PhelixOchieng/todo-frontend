export interface ISelectOption<T> {
	key: T,
	value: string,
}

export interface IProps<T> {
	modelValue: T;
	options?: ISelectOption<T>[] | undefined | null
  id?: string
  name?: string
  label?: string
  loading?: boolean
  placeholder?: string
  validateOnChange?: boolean
  valueClass?: string
  disabled?: boolean
  optionsClass?: string
}
