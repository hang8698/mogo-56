import { Header } from '@/app/header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
      <Header />
      
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center relative z-10 w-full max-w-xl">
        <header className='flex flex-col gap-4 items-center text-center w-full'>
          <h1 className="font-title text-[40px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[40px] lg:text-[28px] sm:text-[28px]">关于我们</h1>
        </header>
        
        <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg w-full">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">五四班登录系统</h2>
            <p className="mb-4">
              本系统是为五四班学生提供的统一身份认证平台，旨在为班级成员提供便捷的账户管理服务。
            </p>
            <p className="mb-4">
              系统特点：
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>安全的用户认证</li>
              <li>个人资料管理</li>
              <li>密码恢复功能</li>
              <li>第三方登录支持</li>
            </ul>
            <p className="mb-6">
              本系统目前处于测试阶段，如果您在使用过程中遇到任何问题，请随时联系我们：<a href="mailto:mail@20204.xyz" className="text-primary-1 hover:underline">mail@20204.xyz</a>
            </p>
            
            <h3 className="text-lg font-semibold mb-2">版本信息</h3>
            <p>当前版本：1.0.0 Beta</p>
            <p>发布日期：2024年5月</p>
          </div>
        </section>
        
        <div className="mt-6">
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