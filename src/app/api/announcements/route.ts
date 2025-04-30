import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/utils/admin';
import { stackServerApp } from '@/stack';
import fs from 'fs/promises';
import path from 'path';

// 公告数据文件路径
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'announcements.json');

// 确保数据目录存在
async function ensureDataDirectory() {
  const dirPath = path.join(process.cwd(), 'data');
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// 读取公告数据
async function readAnnouncements() {
  await ensureDataDirectory();
  
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回初始数据
    const initialData = [
      {
        id: 1,
        title: '系统上线通知',
        content: '五四班登录系统正式上线，欢迎大家注册使用。系统目前处于测试阶段，如有问题请及时反馈。',
        date: '2024-05-04',
        important: true
      },
      {
        id: 2,
        title: '账户安全提醒',
        content: '请妥善保管您的账号密码，定期更换密码，不要在不安全的设备上登录系统。',
        date: '2024-05-05',
        important: false
      },
      {
        id: 3,
        title: '系统功能更新',
        content: '新增个人资料页面、公告栏和暗黑模式切换功能，提升用户体验。',
        date: '2024-05-06',
        important: false
      }
    ];
    
    // 写入初始数据
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

// 保存公告数据
async function saveAnnouncements(announcements) {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(announcements, null, 2));
}

// 获取公告列表
export async function GET() {
  const announcements = await readAnnouncements();
  return NextResponse.json(announcements);
}

// 创建新公告
export async function POST(req: NextRequest) {
  const user = await stackServerApp.getUser();
  
  // 验证管理员权限
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: '只有管理员可以创建公告' },
      { status: 403 }
    );
  }
  
  try {
    const { title, content, important } = await req.json();
    
    // 验证必填字段
    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }
    
    const announcements = await readAnnouncements();
    
    // 生成新公告ID（当前最大ID + 1）
    const maxId = Math.max(0, ...announcements.map(a => a.id));
    const newId = maxId + 1;
    
    // 生成当前日期
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    
    // 创建新公告
    const newAnnouncement = {
      id: newId,
      title,
      content,
      date,
      important: !!important
    };
    
    // 添加到列表并保存
    announcements.unshift(newAnnouncement);
    await saveAnnouncements(announcements);
    
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('创建公告失败:', error);
    return NextResponse.json(
      { error: '创建公告失败' },
      { status: 500 }
    );
  }
}

// 更新公告
export async function PUT(req: NextRequest) {
  const user = await stackServerApp.getUser();
  
  // 验证管理员权限
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: '只有管理员可以更新公告' },
      { status: 403 }
    );
  }
  
  try {
    const { id, title, content, important } = await req.json();
    
    // 验证必填字段
    if (!id || !title || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    const announcements = await readAnnouncements();
    const index = announcements.findIndex(a => a.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '公告不存在' },
        { status: 404 }
      );
    }
    
    // 更新公告
    announcements[index] = {
      ...announcements[index],
      title,
      content,
      important: !!important
    };
    
    await saveAnnouncements(announcements);
    
    return NextResponse.json(announcements[index]);
  } catch (error) {
    console.error('更新公告失败:', error);
    return NextResponse.json(
      { error: '更新公告失败' },
      { status: 500 }
    );
  }
}

// 删除公告
export async function DELETE(req: NextRequest) {
  const user = await stackServerApp.getUser();
  
  // 验证管理员权限
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: '只有管理员可以删除公告' },
      { status: 403 }
    );
  }
  
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少公告ID' },
        { status: 400 }
      );
    }
    
    const announcements = await readAnnouncements();
    const newAnnouncements = announcements.filter(a => a.id !== id);
    
    if (announcements.length === newAnnouncements.length) {
      return NextResponse.json(
        { error: '公告不存在' },
        { status: 404 }
      );
    }
    
    await saveAnnouncements(newAnnouncements);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除公告失败:', error);
    return NextResponse.json(
      { error: '删除公告失败' },
      { status: 500 }
    );
  }
} 