'use client';

import { Header } from '@/app/header';
import { useUser } from '@stackframe/stack';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 公告类型定义
interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

export default function AnnouncementManagePage() {
  const router = useRouter();
  const user = useUser();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 检查是否为管理员
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        router.push('/handler/sign-in');
        return;
      }
      
      if (user.primaryEmail !== 'hanghangjason@qq.com') {
        setError('只有管理员可以访问此页面');
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
        fetchAnnouncements();
      }
    }
    
    checkAdmin();
  }, [user, router]);
  
  // 获取公告列表
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/announcements');
      
      if (!res.ok) {
        throw new Error('获取公告失败');
      }
      
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('获取公告错误:', err);
      setError('获取公告列表失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  // 删除公告
  const deleteAnnouncement = async (id: number) => {
    if (!confirm('确定要删除此公告吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/announcements?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('删除公告失败');
      }
      
      // 刷新公告列表
      fetchAnnouncements();
    } catch (err) {
      console.error('删除公告错误:', err);
      setError('删除公告失败，请稍后再试');
    }
  };
  
  // 新公告状态
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    important: false
  });
  
  // 编辑状态
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // 重置表单
  const resetForm = () => {
    setNewAnnouncement({
      title: '',
      content: '',
      important: false
    });
    setEditMode(false);
    setEditingId(null);
  };
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理复选框变化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAnnouncement(prev => ({
      ...prev,
      important: e.target.checked
    }));
  };
  
  // 设置编辑模式
  const startEdit = (announcement: Announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      important: announcement.important
    });
    setEditMode(true);
    setEditingId(announcement.id);
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }
    
    try {
      const url = '/api/announcements';
      const method = editMode ? 'PUT' : 'POST';
      const body = editMode 
        ? JSON.stringify({ ...newAnnouncement, id: editingId })
        : JSON.stringify(newAnnouncement);
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '操作失败');
      }
      
      // 重置表单并刷新列表
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      console.error('保存公告错误:', err);
      setError(`${editMode ? '更新' : '创建'}公告失败，请稍后再试`);
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
        <Header />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center relative z-10 w-full max-w-xl">
          <div className="bg-red-900/30 p-6 rounded-lg shadow-lg w-full text-center">
            <h1 className="text-xl font-bold text-white mb-4">访问被拒绝</h1>
            <p className="text-gray-300 mb-4">{error || '您没有权限访问此页面'}</p>
            <Link 
              href="/announcements"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700 border border-gray-600"
            >
              返回公告列表
            </Link>
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-xs text-gray-500">
          © 2025 五四班 版权所有
        </footer>
      </div>
    );
  }
  
  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] relative mx-auto lg:max-w-none">
      <Header />
      
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <header className='flex flex-col gap-4 items-center text-center w-full'>
          <h1 className="font-title text-[40px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[40px] lg:text-[28px] sm:text-[28px]">管理公告</h1>
          <p className="text-gray-400">创建、编辑和删除系统公告</p>
        </header>
        
        {error && (
          <div className="w-full bg-red-900/30 p-4 rounded-lg text-white mb-4">
            {error}
            <button
              className="ml-4 text-sm underline"
              onClick={() => setError('')}
            >
              关闭
            </button>
          </div>
        )}
        
        {/* 公告表单 */}
        <div className="w-full bg-gray-800/50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">
            {editMode ? '编辑公告' : '发布新公告'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                标题 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newAnnouncement.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                placeholder="输入公告标题"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={newAnnouncement.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent min-h-[150px]"
                placeholder="输入公告内容"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="important"
                checked={newAnnouncement.important}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-1 focus:ring-primary-1 rounded"
              />
              <label htmlFor="important" className="ml-2 block text-sm text-gray-300">
                标记为重要公告
              </label>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary-1 hover:bg-[#00e5bf] text-black transition-colors duration-200"
              >
                {editMode ? '更新公告' : '发布公告'}
              </button>
              
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 border border-gray-600 transition-colors"
                >
                  取消编辑
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* 公告列表 */}
        <div className="w-full">
          <h2 className="text-xl font-bold text-white mb-4">公告列表</h2>
          
          {loading ? (
            <div className="text-center p-8 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">加载中...</p>
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div 
                  key={announcement.id}
                  className={`p-4 rounded-lg ${announcement.important ? 'bg-red-900/30 border-l-4 border-red-500' : 'bg-gray-800/50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-bold ${announcement.important ? 'text-red-200' : 'text-white'}`}>
                      {announcement.important && (
                        <span className="inline-block mr-2 px-2 py-0.5 text-xs bg-red-600 text-white rounded">重要</span>
                      )}
                      {announcement.title}
                    </h3>
                    <span className="text-sm text-gray-400">{announcement.date}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-3 line-clamp-2">{announcement.content}</p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => startEdit(announcement)}
                      className="text-sm text-primary-1 hover:underline"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-sm text-red-400 hover:underline"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">暂无公告</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Link 
            href="/announcements"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700 border border-gray-600"
          >
            返回公告列表
          </Link>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-xs text-gray-500">
        © 2025 五四班 版权所有
      </footer>
    </div>
  );
} 