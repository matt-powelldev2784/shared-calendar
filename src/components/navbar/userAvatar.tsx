import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import type { UserInfo } from 'firebase/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';

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
    <Link to="/signout" className="mr-2 ml-0 md:ml-1" aria-label="Sign out">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="-translate-y-0.4 text-sm">
          {userInitials}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
