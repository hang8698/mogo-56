import { StackServerApp } from "@stackframe/stack";

// 服务器端使用的Stack实例
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
});

// 注意：客户端使用的Stack实例应在客户端组件中动态导入和初始化
// 例如：
// 'use client';
// import { StackClientApp } from "@stackframe/stack";
// const clientApp = new StackClientApp({ tokenStore: "nextjs-cookie" });

