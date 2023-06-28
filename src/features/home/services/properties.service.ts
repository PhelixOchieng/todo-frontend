import { api } from '@/core/api'

import type {
  TLocationsApiResponse,
  IPropertiesApiResponse,
  IPropertiesParams,
  IPropertyApiResponse,
} from './interface'

export const propertiesService = {
  retrieveAll(params: IPropertiesParams) {
    return new Promise<IPropertiesApiResponse>((resolve, reject) => {
      api.get('properties/', { params, onSuccess: resolve, onError: reject })
    })
  },
  retrieveOne(id: string) {
    return new Promise<IPropertyApiResponse>((resolve, reject) => {
      api.get(`properties/${id}/`, { onSuccess: resolve, onError: reject })
    })
  },

  getLocations() {
    return new Promise<TLocationsApiResponse>((resolve, reject) => {
      api.get('properties/locations/', { onSuccess: resolve, onError: reject })
    })
  },
}
