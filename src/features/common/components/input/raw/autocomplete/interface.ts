export interface IAutocompleteOption<T> {
  key: T
  value: string
}

export interface IProps<T> {
  modelValue: T | null
  options?: IAutocompleteOption<T>[] | null
  id?: string
  name?: string
  label?: string
  loading?: boolean
  placeholder?: string
  valueClass?: string
  disabled?: boolean
}
