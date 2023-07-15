export interface IUserJson {
  id: string
	userName: string
  firstName: string
  lastName: string
  email: string
	createdAt: string;
	updatedAt: string | null;
}

export interface IUser {
  id: string
	username: string
  firstName: string
  lastName: string
  email: string
	createdAt: Date;
	updatedAt: Date | null;
	avatarUrl: string | null;
}
