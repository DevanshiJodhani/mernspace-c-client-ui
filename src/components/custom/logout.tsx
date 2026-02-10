'use client';

import { logout } from '@/lib/actions/logout';
import { Button } from '../ui/button';

const Logout = () => {
  return (
    <Button
      size={'sm'}
      onClick={async () => {
        await logout();
      }}>
      Logout
    </Button>
  );
};

export default Logout;
