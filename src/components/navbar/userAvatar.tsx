import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';
import type { UserInfo } from 'firebase/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserAvatar = () => {
  const [userInfo, setUserInfo] = useState<UserInfo[] | undefined>();
  const userInitials =
    userInfo && userInfo[0].displayName
      ? userInfo[0].displayName
          ?.split(' ')
          .map((name) => name[0].slice(0))
          .join('')
      : '';

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

  return (
    <Avatar className="relative flex h-8 w-8 items-center justify-center">
      <AvatarFallback className="bg-secondary h-8 w-8 flex-col gap-0.5 text-xs">
        {userInitials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
