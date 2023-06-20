import Cookies from 'js-cookie'

const isProd = import.meta.env.PROD;
const SSO_URL = isProd ? '/sso' : 'http://sso.multiway-cloud.com';
const NEW_TOKEN_KEY = 'access_token';

export const redirectToSso = () => {
    const queryString = `returnUrl=${location.href}`;
    window.location.href = `${SSO_URL}/#/login?${queryString}`;
};

export const getTenant = () => {
    return Cookies.get('tenant')
}

export const getAccessToken = () => {
    return Cookies.get(NEW_TOKEN_KEY)
}