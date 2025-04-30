import { Header } from '@/app/header';
import Link from 'next/link';
import { stackServerApp } from '@/stack';

export default async function Home() {
  const user = await stackServerApp.getUser();
  
  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
      <Header />
      
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center relative z-10 w-full max-w-xl">
        
        <header className='flex flex-col gap-4 items-center text-center w-full'>
          <h1 className="font-title text-[48px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[48px] lg:text-[32px] sm:text-[32px]">欢迎来到五四班登录系统</h1>
          
          <p className="text-medium text-gray-300 mt-2">
            本登录系统暂时为测试阶段，有错误可及时反馈到mail@20204.xyz
          </p>
          
          {user && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/handler/account-settings"
                className="inline-flex h-12 items-center justify-center font-medium text-center rounded-md px-8 py-3 text-[16px] bg-primary-1 hover:bg-[#00e5bf] text-black transition-colors duration-200 shadow-md"
              >
                管理我的账户
              </Link>
            </div>
          )}
          
          {!user && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/handler/sign-in"
                className="inline-flex h-12 items-center justify-center rounded-md px-6 text-[16px] font-medium text-gray-700 transition-all hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-300"
              >
                登录
              </Link>
              <Link
                href="/handler/sign-up"
                className="inline-flex h-12 items-center justify-center font-medium text-center rounded-md outline-none dark:text-black bg-primary-1 hover:bg-[#00e5bf] whitespace-nowrap px-6 text-[16px] transition-colors duration-200"
              >
                注册账户
              </Link>
            </div>
          )}
        </header>
        
        {/* 开发者资源区域 */}
        <section className="w-full mt-8 bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">开发者资源</h2>
          <p className="text-gray-300 mb-4">
            本系统提供单点登录(SSO)API，允许集成到其他网站系统中。用户在本站登录后，可以在其他集成网站上自动识别身份。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              href="/api/auth/docs"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary-1 hover:bg-[#00e5bf] text-black transition-colors duration-200"
            >
              查看API文档
            </Link>
            <Link
              href="/demo.html"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700 border border-gray-600"
              target="_blank"
            >
              查看演示页面
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-xs text-gray-500">
        © 2025 五四班 版权所有
      </footer>
    </div>
  );
}
