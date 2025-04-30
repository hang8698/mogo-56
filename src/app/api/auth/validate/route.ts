import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { headers } from "next/headers";
import { getUserDetails } from '@/app/actions';
import { isAdmin } from '@/utils/admin';
import { authConfig } from '@/utils/config';

// 允许的域名列表
const VALID_ORIGINS = authConfig.allowedOrigins.filter(origin => !!origin);

export async function OPTIONS(req: NextRequest) {
  const headersList = headers();
  const origin = headersList.get('origin');
  
  // 确认请求来源是否在允许列表中
  if (origin && VALID_ORIGINS.includes(origin)) {
    const response = new NextResponse(JSON.stringify({ status: "ok" }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // 24小时
      }
    });
    return response;
  }

  // 对于OPTIONS请求，返回一个简单的成功响应
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

/**
 * 验证cookie并返回用户信息的API端点
 * 其他系统可以调用此API来验证用户身份
 */
export async function POST(req: NextRequest) {
  // 设置CORS响应头
  const headersList = headers();
  const origin = headersList.get('origin');
  const responseHeaders: HeadersInit = {};
  
  if (origin && VALID_ORIGINS.includes(origin)) {
    responseHeaders['Access-Control-Allow-Origin'] = origin;
    responseHeaders['Access-Control-Allow-Credentials'] = 'true';
  }

  try {
    // 从API请求中获取cookie
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { success: false, message: "未提供cookie" },
        { 
          status: 401,
          headers: responseHeaders
        }
      );
    }

    // 使用Stack Auth验证用户
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "未认证" },
        { 
          status: 401,
          headers: responseHeaders
        }
      );
    }

    // 获取用户详细信息
    const userProfile = await getUserDetails(user.id);
    const userRole = isAdmin(user) ? 'admin' : 'user';

    // 返回用户信息（注意：只返回必要的非敏感信息）
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.primaryEmail,
        emailVerified: user.primaryEmailVerified,
        role: userRole,
        profile: userProfile ? {
          name: userProfile.name,
          // 可以添加其他你想从userProfile中公开的字段
        } : null
      }
    }, { 
      headers: responseHeaders
    });
  } catch (error) {
    console.error("身份验证错误:", error);
    return NextResponse.json(
      { success: false, message: "验证失败" },
      { 
        status: 500,
        headers: responseHeaders
      }
    );
  }
} 