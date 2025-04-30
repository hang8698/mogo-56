'use client';

import { Header } from '@/app/header';
import { useUser, useStackApp } from '@stackframe/stack';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserRoleName } from '@/utils/admin';

export default function ProfilePage() {
  // 重定向未登录用户
  const user = useUser({ or: "redirect" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
      <Header />
      
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10 w-full max-w-xl">
        <header className='flex flex-col gap-4 items-center text-center w-full'>
          <h1 className="font-title text-[40px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[40px] lg:text-[28px] sm:text-[28px]">我的资料</h1>
        </header>
        
        <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg w-full">
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-900/50 text-green-100' : 'bg-red-900/50 text-red-100'}`}>
              {message.text}
            </div>
          )}
          
          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-center mb-6">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="用户头像" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary-1"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-300">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">用户名</span>
                <span className="text-lg text-white">{user.displayName || '未设置'}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">电子邮箱</span>
                <span className="text-lg text-white">{user.primaryEmail || '未设置'}</span>
                <span className="text-xs text-gray-500">
                  {user.primaryEmailVerified ? '(已验证)' : '(未验证)'}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">账户ID</span>
                <span className="text-sm text-gray-300 break-all">{user.id}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">注册时间</span>
                <span className="text-lg text-white">{formatDate(user.signedUpAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/handler/account-settings"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary-1 hover:bg-[#00e5bf] text-black transition-colors duration-200"
            >
              管理账户设置
            </Link>
            
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 border border-gray-600 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-xs text-gray-500">
        © 2024 五四班 版权所有
      </footer>
    </div>
  );
} 