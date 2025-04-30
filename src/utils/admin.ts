import { CurrentUser } from "@stackframe/stack";

// 管理员电子邮箱列表
const ADMIN_EMAILS = ['hanghangjason@qq.com'];

/**
 * 检查用户是否为管理员
 * @param user 用户对象
 * @returns 是否为管理员
 */
export function isAdmin(user: CurrentUser | null): boolean {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.primaryEmail || '');
}

/**
 * 获取用户权限等级
 * @param user 用户对象
 * @returns 权限等级（0: 游客, 1: 普通用户, 2: 管理员）
 */
export function getUserRole(user: CurrentUser | null): number {
  if (!user) return 0; // 游客
  if (isAdmin(user)) return 2; // 管理员
  return 1; // 普通用户
}

/**
 * 获取用户角色名称
 * @param user 用户对象
 * @returns 角色名称
 */
export function getUserRoleName(user: CurrentUser | null): string {
  const role = getUserRole(user);
  switch (role) {
    case 0: return '游客';
    case 1: return '用户';
    case 2: return '管理员';
    default: return '未知';
  }
} 