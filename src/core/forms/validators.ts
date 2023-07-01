import type { TValidatorFn, TCompositeValidatorFn } from './forms.interface'

export const Validators = {
  required(v, msg) {
    return !!v || msg || 'This field is required'
  },
  email(v: string, msg) {
    return /^(\w+\.?)+@\w+\.\w{2,}$/.test(v) || msg || 'Email is invalid'
  },
} satisfies { [name: string]: TValidatorFn<any> }

export const CompositeValidators = {
  min(count: number) {
    return (v: number, msg) => {
      return (!!v && +v >= count) || msg || `This field must be more than or equal to ${count}`
    }
  },
  max(count: number) {
    return (v: string, msg) => {
      return (!!v && +v <= count) || msg || `This field must be less than or equal to ${count}`
    }
  },
  minLength(count: number) {
    return (v: any[] | string, msg) => {
      return (
        (!!v && v.length >= count) || msg || `This field must be more than or equal to ${count}`
      )
    }
  },
  maxLength(count: number) {
    return (v: any[] | string, msg) => {
      return (
        (!!v && v.length >= count) || msg || `This field must be more than or equal to ${count}`
      )
    }
  },
} satisfies { [name: string]: TCompositeValidatorFn }

export default {
  ...Validators,
  ...CompositeValidators,
}
