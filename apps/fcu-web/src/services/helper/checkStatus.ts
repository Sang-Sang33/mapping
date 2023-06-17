import { clearNewToken, redirectToSso } from '@/utils/token';
import { message } from 'antd';
/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (responese: any): void => {
  const { status, message: omessage } = responese;
  console.log(responese);
  switch (status) {
    case 400:
      message.error('请求失败！请您稍后重试');
      break;
    case 401:
      clearNewToken();
      message.error('登录失效！请您重新登录');
      // import.meta.env.VITE_APP_BASIC_API
      // window.location.hash =  "/login";
      redirectToSso();
      break;
    case 403:
      console.log('omessage', omessage);
      message.error(responese?.data?.error?.message || '当前账号无权限访问！');
      break;
    case 404:
      message.error('你所访问的资源不存在！');
      break;
    case 405:
      message.error('请求方式错误！请您稍后重试');
      break;
    case 408:
      message.error('请求超时！请您稍后重试');
      break;
    case 500:
      message.error('服务异常！');
      break;
    case 502:
      message.error('网关错误！');
      break;
    case 503:
      message.error('服务不可用！');
      break;
    case 504:
      message.error('网关超时！');
      break;
    default:
      message.error('请求失败！');
  }
};
