import { getUserDetails } from '@/app/actions';
import { stackServerApp } from '@/stack';
import { ClientHeader } from '@/components/ClientHeader';

export async function Header() {
  const user = await stackServerApp.getUser();
  const userProfile = user ? await getUserDetails(user.id) : null;
  
  // 只传递客户端需要的数据，避免传递函数
  const userData = user ? {
    id: user.id,
    displayName: user.displayName,
    primaryEmail: user.primaryEmail
  } : null;
  
  // 只传递简单的URL字符串，而非完整的对象
  const authUrls = {
    signIn: '/handler/sign-in',
    signUp: '/handler/sign-up',
    signOut: '/handler/sign-out'
  };

  return <ClientHeader 
    userData={userData} 
    authUrls={authUrls} 
    userProfile={userProfile}
  />;
}
