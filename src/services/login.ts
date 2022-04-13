import request from '@/utils/request';

const namespace = 'TenantAdminFacade';

/**
 * 登录
 */
export async function accountLogin(params: any) {
  return request(`/${namespace}/login`, {
    prefix: '/api/pqjob/auth',
    method: 'POST',
    data: params,
  });
}

/**
 * @description: 退出登录
 * @return {type}
 */
export async function logout() {
  return request(`/${namespace}/logout`, {
    method: 'POST',
    prefix: '/api/pqjob/auth',
    data: [],
  });
}

// 获取当前登陆用户
export async function queryCurLoginUser() {
  return request(`/${namespace}/queryCurLoginUser`, { prefix: '/api/pqjob/auth' });
}
