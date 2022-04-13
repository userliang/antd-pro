import request from '@/utils/request';
const namespace = 'TenantAdminFacade';

// 修改自己的密码
export async function changeMyPwd(payload: any) {
  return request(`/${namespace}/changeMyPwd`, {
    method: 'POST',
    data: payload,
  });
}
