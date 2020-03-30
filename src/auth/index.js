// 获取权限
export function getCurrentAuthority() {
  // 这里返回的权限应该是从后端读取回来的，此时用admin替代
  return ["user"];
}

// 鉴权
export function check(authority) {
  const current = getCurrentAuthority();
  return current.some(item => authority.includes(item));
}

// 判断是否登陆
export function isLogin() {
  const current = getCurrentAuthority();
  return current && current[0] !== "guest";
}
