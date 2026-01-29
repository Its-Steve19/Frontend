import { isExpired } from 'react-jwt';

const accessTokenKey = 'access-token'
const refreshTokenKey = 'refresh-token'

export const setAccessToken = (accessToken) => {
    localStorage.setItem(
        accessTokenKey,accessToken
    )
}

export const removeAccessToken = () => {
    localStorage.removeItem(
        accessTokenKey
    )
}

export const checkToken = (token) => {
    if (token) {
        const tokenExpired = isExpired(token);
        if (tokenExpired) {
            removeAccessToken();
            return null
        } else {
            return localStorage.getItem(
                accessTokenKey
            )
        }
    }
}

export const getAccessToken = () => {
    const token = localStorage.getItem(accessTokenKey);
    const validatedToken = checkToken(token);
    return validatedToken;
}