'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

// 使用更明确的接口定义，只接收需要的数据
interface ClientHeaderProps {
  userData: {
    id: string;
    displayName: string | null;
    primaryEmail: string | null;
  } | null;
  authUrls: {
    signIn: string;
    signUp: string;
    signOut: string;
  };
  userProfile: {
    name?: string;
    raw_json?: {
      profile_image_url?: string;
    };
  } | null;
}

export function ClientHeader({ userData, authUrls, userProfile }: ClientHeaderProps) {
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 z-10">
      <div className="font-medium text-[15px] tracking-tight flex items-center gap-2">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/neon.svg"
            alt="Logo"
            width={102}
            height={28}
            priority
          />
        </Link>
        <div className="hidden sm:flex items-center space-x-4 ml-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            首页
          </Link>
          <Link href="/announcements" className="text-gray-300 hover:text-white transition-colors">
            公告栏
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
            关于我们
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        {userData ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium text-gray-300 transition-all hover:bg-gray-700 dark:hover:bg-gray-800"
              >
                个人资料
              </Link>
              <Link
                href="/handler/account-settings"
                className="inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium bg-primary-1 hover:bg-[#00e5bf] text-black whitespace-nowrap transition-colors duration-200"
              >
                管理账户
              </Link>
            </div>
            
            <span className='hidden md:inline-flex h-8 items-end flex-col'>
              {userProfile?.name && <span className="text-[14px] text-gray-600 dark:text-gray-300">
                {`你好，${userProfile.name.split(' ')[0]}`}
              </span>}
              <Link
                href={authUrls.signOut}
                className="bg-gray-50 px-1 underline text-[11px] hover:no-underline"
              >
                退出登录
              </Link>
            </span>
            
            {userProfile?.raw_json?.profile_image_url && 
              <Image 
                src={userProfile.raw_json.profile_image_url}
                alt="用户头像"
                width={32}
                height={32}
                className="rounded-full hidden md:block"
              />
            }
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href={authUrls.signIn}
              className="inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium text-gray-300 transition-all hover:bg-gray-700 dark:hover:bg-gray-800 border border-gray-600"
            >
              登录
            </Link>
            <Link
              href={authUrls.signUp}
              className="inline-flex h-8 items-center justify-center font-medium text-center rounded-md outline-none dark:text-black bg-primary-1 hover:bg-[#00e5bf] whitespace-nowrap px-4 text-[13px] transition-colors duration-200"
            >
              注册
            </Link>
          </div>
        )}
      </div>
    </header>
  );
} 