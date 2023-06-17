// 运行时配置

import { RequestConfig, RuntimeConfig } from '@umijs/max';
import { message } from 'antd';
import logo from './assets/img/logo.png';
import { checkStatus } from './services/helper/checkStatus';
import { getNewToken, redirectToSso } from './utils/token';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '' };
}

export const layout: RuntimeConfig['layout'] = () => {
  return {
    logo,
    menu: {
      locale: true,
    },
    logout: () => {
      redirectToSso();
    },
    title: '物流配置',
    onPageChange: () => {
      const token = getNewToken();
      if (!token) {
        message.error('身份校验失败,请重新登录');
        redirectToSso();
      }
    },
  };
};

export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [],
  responseInterceptors: [
    [
      (response) => {
        return response;
      },
      (error: any) => {
        const { response } = error;
        if (response) checkStatus(response);
        return Promise.reject(error);
      },
    ],
  ],
};
