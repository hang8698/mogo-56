import { Header } from '@/app/header';
import Link from 'next/link';

export default function ApiDocsPage() {
  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
      <Header />
      
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center relative z-10 w-full max-w-3xl">
        <header className='flex flex-col gap-4 items-center text-center w-full'>
          <h1 className="font-title text-[40px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[40px] lg:text-[28px] sm:text-[28px]">API 文档</h1>
          <p className="text-gray-400">五四班单点登录API接口使用说明</p>
        </header>
        
        <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg w-full">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">接口概述</h2>
            <p className="mb-4">
              本系统提供单点登录API，允许用户在此系统登录后，其他集成的网站可以通过验证cookie识别用户身份。
            </p>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">API端点</h3>
            <pre className="bg-gray-900/50 p-3 rounded overflow-x-auto mb-4">
              <code>POST /api/auth/validate</code>
            </pre>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">客户端集成示例 (JavaScript)</h3>
            <p className="mb-2">在需要验证用户身份的页面添加以下代码:</p>
            <pre className="bg-gray-900/50 p-3 rounded overflow-x-auto mb-4">
              <code>{`// 自动检测API服务器地址
const POSSIBLE_AUTH_SERVERS = [
  'http://localhost:3000',
  'https://auth.20204.xyz',
  'https://auth.20204.dpdns.org',
  window.location.origin // 当前页面的来源
];

let authServer = '';

// 检测认证服务器地址
function detectAuthServer() {
  // 首先尝试当前域名
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  } else if (window.location.hostname === 'auth.20204.xyz') {
    return 'https://auth.20204.xyz';
  } else if (window.location.hostname === 'auth.20204.dpdns.org') {
    return 'https://auth.20204.dpdns.org';
  } else {
    // 如果不是已知域名，使用当前域名
    return window.location.origin;
  }
}

// 验证用户登录状态
function checkUserAuthentication() {
  // 确保已检测到认证服务器
  if (!authServer) {
    authServer = detectAuthServer();
  }
  
  fetch(authServer + '/api/auth/validate', {
    method: 'POST',
    credentials: 'include', // 这很重要，确保发送跨域cookie
  })
  .then(response => {
    // 检查HTTP状态码
    if (!response.ok) {
      throw new Error(\`HTTP错误: \${response.status}\`);
    }
    
    // 检查内容类型
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError('未收到JSON格式的响应');
    }
    
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // 用户已登录
      console.log('已登录用户:', data.user);
      // 显示用户信息
      document.getElementById('user-name').textContent = data.user.displayName || data.user.email;
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('user-section').style.display = 'block';
    } else {
      // 用户未登录，显示登录链接
      document.getElementById('login-section').style.display = 'block';
      document.getElementById('user-section').style.display = 'none';
    }
  })
  .catch(error => {
    console.error('验证失败:', error);
    // 显示错误或登录链接
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('user-section').style.display = 'none';
    // 可选：显示详细错误信息
    document.getElementById('error-message').textContent = error.message;
  });
}

// 初始化认证服务器
authServer = detectAuthServer();

// 页面加载时检查用户状态
document.addEventListener('DOMContentLoaded', checkUserAuthentication);`}</code>
            </pre>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">HTML示例</h3>
            <pre className="bg-gray-900/50 p-3 rounded overflow-x-auto mb-4">
              <code>{`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>集成示例</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    #user-section { display: none; }
    .api-info { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
  </style>
</head>
<body>
  <h1>五四班单点登录集成示例</h1>
  
  <div class="api-info">
    <p>当前使用的验证服务器: <code id="server-url">检测中...</code></p>
  </div>
  
  <div id="login-section">
    <p>您尚未登录。</p>
    <a href="#" id="login-link" target="_blank">前往登录</a>
  </div>
  
  <div id="user-section">
    <p>欢迎回来，<span id="user-name"></span>！</p>
    <button id="logout-button">退出登录</button>
  </div>
  
  <div id="error-message" style="color: red; display: none;"></div>

  <script>
    // 这里放入上方的JavaScript代码
    
    // 额外初始化代码，更新页面上的链接
    function updateUILinks(server) {
      document.getElementById('server-url').textContent = server;
      document.getElementById('login-link').href = server + '/handler/sign-in';
      document.getElementById('logout-button').onclick = function() {
        window.location.href = server + '/handler/sign-out?redirect=' + 
          encodeURIComponent(window.location.href);
      };
    }
    
    // 更新UI链接
    document.addEventListener('DOMContentLoaded', function() {
      updateUILinks(authServer);
    });
  </script>
</body>
</html>`}</code>
            </pre>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">注意事项</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>确保在集成网站上启用CORS以允许跨域请求</li>
              <li>集成网站的域名必须添加到本系统的允许列表中</li>
              <li>用户必须先在本系统登录才能在其他网站被识别</li>
              <li>Cookie会在一段时间后过期，过期后需要重新登录</li>
              <li>为安全起见，只有受信任的网站才能使用此API</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">API响应示例</h3>
            <p>成功响应:</p>
            <pre className="bg-gray-900/50 p-3 rounded overflow-x-auto mb-4">
              <code>{`{
  "success": true,
  "user": {
    "id": "user_123456",
    "displayName": "张三",
    "email": "zhangsan@example.com",
    "emailVerified": true,
    "role": "user",
    "profile": {
      "name": "张三"
    }
  }
}`}</code>
            </pre>
            
            <p>错误响应:</p>
            <pre className="bg-gray-900/50 p-3 rounded overflow-x-auto mb-4">
              <code>{`{
  "success": false,
  "message": "未认证"
}`}</code>
            </pre>
          </div>
        </section>
        
        <div className="mt-4">
          <Link 
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700 border border-gray-600"
          >
            返回首页
          </Link>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-xs text-gray-500">
        © 2025 五四班 版权所有
      </footer>
    </div>
  );
} 