/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { getToken, setToken } from '@/utils/auth';

import { history } from 'umi';
import { stringify } from 'querystring';
import APIPrefix from '../../config/APIPrefix';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

message.config({ maxCount: 1 });
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: any }): any => {
  NProgress.done();
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
    return {
      success: false,
      resultData: false,
      errorMsg: `请求错误 ${status}： ${errorText}`,
    };
  }
  return {
    success: false,
    resultData: false,
    errorMsg: `请求失败`,
  };
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
  prefix: APIPrefix.Default,
  method: 'POST',
  data: {},
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // },
  requestType: 'form',
});

request.interceptors.request.use((url, options) => {
  NProgress.start();
  const { headers } = options as any;
  if (getToken()) {
    headers['luma-auth-token'] = getToken();
  }
  return {
    options: { ...options },
  };
});

// -- status 200 error ---------------------------------------------------

// @ts-ignore
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  const { headers } = response;
  // if (data && !data.success) {
  //   notification.error({
  //     description: data.errorMsg,
  //     message: `${data.errorCode} ${status}: ${url}`,
  //   });
  // }
  const token = headers.get('luma-auth-token');
  if (token) {
    setToken(token);
  }
  NProgress.done();
  if (data.errorCode === 'ERR_002_00000003') {
    // message.warning('登录信息已过期，请重新登录');
    const { query = {}, search, pathname } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + '?' + search,
        }),
      });
      return {
        success: false,
        resultData: false,
        errorMsg: data.errorMsg || `登录信息已过期，请重新登录`,
      };
    }
  }
  return response;
});

export default request;
