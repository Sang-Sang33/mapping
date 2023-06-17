import Cookies from 'js-cookie';

const isProd = process.env.NODE_ENV === 'production';

const SSO_URL = isProd ? '/sso' : 'http://sso.multiway-cloud.com';

const NEW_TOKEN_KEY = isProd ? 'dev.access_token' : 'access_token';

export const getNewToken = () => {
  return Cookies.get(NEW_TOKEN_KEY);
};

export const clearNewToken = () => {
  Cookies.remove(NEW_TOKEN_KEY);
};

export const redirectToSso = () => {
  clearNewToken();
  const queryString = `returnUrl=${location.href}`;

  window.location.href = `${SSO_URL}/login?${queryString}`;
};
