import type { IApiResponse } from '@/core/api'

import type { IPropertyJson } from '../models/property.interface';
import type { ILocationJson } from '../models/location.interface';


export interface IPropertiesParams {
	page?: number;
	limit?: number;
	price?: string;
	city?: string;
	neighborhood?: string;
}
export interface IPropertiesApiResponse extends IApiResponse<IPropertyJson[]> {}

export interface IPropertyApiResponse extends IApiResponse<IPropertyJson> {}

export type TLocationsApiResponse = IApiResponse<ILocationJson[]>
