import { TokenCategory } from '../constants'

interface IAuthToken {
  accessToken: string
  refreshToken: string
}

export function saveAuthToken(token: IAuthToken): void {
  localStorage.setItem(TokenCategory.Access, token.accessToken)
  localStorage.setItem(TokenCategory.Refresh, token.refreshToken)
}

export function retrieveAuthToken(category: TokenCategory): string | null {
  if (category === TokenCategory.Access) {
    return localStorage.getItem(TokenCategory.Access)
  } else {
    return localStorage.getItem(TokenCategory.Refresh)
  }
}

export function removeAuthToken(): void {
	localStorage.removeItem(TokenCategory.Access)
	localStorage.removeItem(TokenCategory.Refresh)
}

export function getUserID(category = TokenCategory.Access): string | null {
  const token = retrieveAuthToken(category)
  if (!token) return null

  return JSON.parse(atob(token.split('.')[1])).userID;
}

export function isAuthTokenValid(offset = 0, token?: string): boolean {
  const authToken = token ?? retrieveAuthToken(TokenCategory.Access)
  if (!authToken) return false

  const expiry = JSON.parse(atob(authToken.split('.')[1])).exp * 1000
  const expiryDate = new Date(expiry - offset)
  const now = new Date()

  return now < expiryDate
}

export function isTokenForAdmin(token?: string): boolean {
  const authToken = token ?? retrieveAuthToken(TokenCategory.Access)!
  const isAdmin = JSON.parse(atob(authToken.split('.')[1])).role === 'admin'
  return isAdmin
}

export function isTokenValidForAdmin(token?: string) {
  return isAuthTokenValid(0, token) && isTokenForAdmin(token)
}
