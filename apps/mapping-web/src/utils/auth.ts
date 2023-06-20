import Cookies from 'js-cookie'

const isProd = import.meta.env.PROD;
const SSO_URL = isProd ? '' : 'http://sso.multiway-cloud.com';
const NEW_TOKEN_KEY = 'access_token';

export const redirectToSso = () => {
    const queryString = `returnUrl=${location.href}`;
    window.location.href = `${SSO_URL}/login?${queryString}`;
};

export const getTenant = () => {
    return Cookies.get('tenant')
}

export const getAccessToken = () => {
    return Cookies.get(NEW_TOKEN_KEY)
}

export const clearAccessToken = () => {
    Cookies.remove(NEW_TOKEN_KEY)
}

export const getCookieByName = (name: string) => {
    return Cookies.get(name)
}

export const setCookie = (name: string, val: string) => {
    Cookies.set(name, val)
}

export const removeCookieByName = (name: string) => {
    Cookies.remove(name)
}