import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';
import type { UserInfo } from 'firebase/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

const UserAvatar = () => {
  const [userInfo, setUserInfo] = useState<UserInfo[] | undefined>();

  // get user information from firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user !== undefined && user !== null) {
        setUserInfo(user.providerData);
      } else {
        setUserInfo(undefined);
      }
    });

    return () => unsubscribe();
  }, []);

  // if user is not logged do not display the avatar
  if (!userInfo) {
    return null;
  }

  const oAuthUserInitials = userInfo[0].displayName
    ?.split(' ')
    .map((name) => name[0].slice(0))
    .join('');

  return (
    <Avatar className="relative flex h-8 w-8 items-center justify-center">
      {oAuthUserInitials ? (
        <AvatarFallback className="bg-secondary h-8 w-8 flex-col gap-0.5 text-xs">{oAuthUserInitials}</AvatarFallback>
      ) : (
        <LogOut className="h-6 w-6" />
      )}
    </Avatar>
  );
};

export default UserAvatar;
