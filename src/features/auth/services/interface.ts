import type { IApiResponse } from "@/core/api";

export interface ILoginPayload {
	email: string;
	password: string;
}
export type TLoginApiResponse = IApiResponse<{accessToken: string, refreshToken: string}>;

export interface IEmailVerificationPayload {
	email: string;
}
export type TEmailVerificationApiResponse = IApiResponse<never>;

export interface IPasswordResetPayload {
	token: string;
	password: string;
}
export type TPasswordResetApiResponse = IApiResponse<never>;

export interface ISignupPayload {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}
export type TSignupApiResponse = IApiResponse<never>;

