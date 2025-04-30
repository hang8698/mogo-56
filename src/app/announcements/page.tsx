import { Header } from '@/app/header';
import Link from 'next/link';
import { stackServerApp } from '@/stack';
import { isAdmin } from '@/utils/admin';

async function getAnnouncements() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/announcements`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch announcements');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  const user = await stackServerApp.getUser();
  const userIsAdmin = isAdmin(user);
  
  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
      <Header />
      
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center relative z-10 w-full max-w-3xl">
        <header className='flex flex-col gap-4 items-center text-center w-full'>
          <h1 className="font-title text-[40px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[40px] lg:text-[28px] sm:text-[28px]">公告栏</h1>
          <p className="text-gray-400">查看系统最新通知和更新</p>
        </header>
        
        {userIsAdmin && (
          <div className="w-full text-right mb-4">
            <Link 
              href="/announcements/manage" 
              className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary-1 hover:bg-[#00e5bf] text-black transition-colors duration-200"
            >
              管理公告
            </Link>
          </div>
        )}
        
        <section className="w-full">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className={`mb-6 p-6 rounded-lg shadow-lg ${announcement.important ? 'bg-red-900/30 border-l-4 border-red-500' : 'bg-gray-800/50'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className={`text-xl font-bold ${announcement.important ? 'text-red-200' : 'text-white'}`}>
                    {announcement.important && (
                      <span className="inline-block mr-2 px-2 py-0.5 text-xs bg-red-600 text-white rounded">重要</span>
                    )}
                    {announcement.title}
                  </h2>
                  <span className="text-sm text-gray-400">{announcement.date}</span>
                </div>
                <p className="text-gray-300 whitespace-pre-line">{announcement.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">暂无公告</p>
            </div>
          )}
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