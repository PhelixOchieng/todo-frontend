import type { IUser, IUserJson } from './user.interface'

export default class UserModel implements IUser {
  public id: string
	public username: string;
  public firstName: string
  public lastName: string
  public email: string
	public createdAt: Date;
	public updatedAt: Date | null;
	public avatarUrl: string | null;

  constructor(data: IUser) {
    this.id = data.id
		this.username = data.username
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.avatarUrl = data.avatarUrl
  }

  static fromJson(json: IUserJson): UserModel {
    return new UserModel({
      id: json.id,
			username: json.userName,
      firstName: json.firstName,
      lastName: json.lastName,
      email: json.email,
			createdAt: new Date(json.createdAt),
			updatedAt: json.updatedAt ? new Date(json.updatedAt) : null,
			avatarUrl: null
    })
  }
}
