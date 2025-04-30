/**
 * 应用程序配置
 * 集中管理环境变量和配置信息
 */

// 确定当前环境
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// 确定应用基础URL
let appUrl = process.env.NEXT_PUBLIC_APP_URL;

// 根据环境设置默认值
if (!appUrl) {
  if (isDevelopment) {
    appUrl = 'http://localhost:3000';
  } else if (typeof window !== 'undefined') {
    // 客户端: 使用当前URL
    appUrl = window.location.origin;
  } else {
    // 服务器端: 默认生产URL
    appUrl = 'https://auth.20204.xyz';
  }
}

// 身份验证相关的配置
export const authConfig = {
  // 基础URL
  baseUrl: appUrl,
  
  // API端点
  endpoints: {
    validate: `${appUrl}/api/auth/validate`,
    login: `${appUrl}/handler/sign-in`,
    signup: `${appUrl}/handler/sign-up`,
    logout: `${appUrl}/handler/sign-out`,
  },
  
  // 允许的域名列表
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://auth.20204.xyz',
    'https://auth.20204.dpdns.org',
    'http://auth.20204.xyz', 
    'http://auth.20204.dpdns.org',
    appUrl
  ].filter(Boolean)
};

// 一般配置
export const config = {
  app: {
    name: '五四班登录系统',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  auth: authConfig
};

export default config; 