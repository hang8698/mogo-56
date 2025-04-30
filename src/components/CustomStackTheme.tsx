'use client';

import React, { useEffect } from 'react';
import { StackTheme } from '@stackframe/stack';
import { useTheme } from '@/context/ThemeContext';

export function CustomStackTheme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  // 在客户端组件挂载时确保主题正确应用
  useEffect(() => {
    // 在组件挂载和主题变化时确保样式正确
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    
    // 在主题切换时强制刷新 Stack 组件
    const stackComponents = document.querySelectorAll('[data-stack-component]');
    stackComponents.forEach(component => {
      if (theme === 'light') {
        component.classList.add('stack-light-theme');
        component.classList.remove('stack-dark-theme');
      } else {
        component.classList.add('stack-dark-theme');
        component.classList.remove('stack-light-theme');
      }
    });
  }, [theme]);

  // 应用额外的类以基于当前主题
  return (
    <StackTheme>
      <div 
        data-theme-mode={theme} 
        className={`custom-stack-theme ${theme === 'light' ? 'stack-light-theme' : 'stack-dark-theme'}`}
      >
        {children}
      </div>
    </StackTheme>
  );
} 