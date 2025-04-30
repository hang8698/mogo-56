'use client';

import { StackClientApp } from "@stackframe/stack";

// 客户端使用的Stack实例
export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
}); 