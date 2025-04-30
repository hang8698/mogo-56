'use client';

import { useEffect } from 'react';

// This component ensures theme is properly initialized on direct navigation to auth pages
export function ThemeInitializer() {
  useEffect(() => {
    // 检查初始主题
    const applyTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    };

    // 初始应用主题
    applyTheme();

    // 添加一个存储监听器，以便在其他页面更改主题时同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        applyTheme();
      }
    };

    // 监听存储变化
    window.addEventListener('storage', handleStorageChange);

    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null; // This component doesn't render anything
} 