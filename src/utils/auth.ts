export function getToken() {
  return sessionStorage.getItem('luma-auth-token') || '';
}

export function setToken(token: string) {
  sessionStorage.setItem('luma-auth-token', token);
}

export function removeToken() {
  sessionStorage.removeItem('luma-auth-token');
}
