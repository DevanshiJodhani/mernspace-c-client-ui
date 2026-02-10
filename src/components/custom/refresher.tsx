'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import * as jose from 'jose';

const Refresher = ({ children }: { children: React.ReactNode }) => {
  const timeoutId = useRef<NodeJS.Timeout>(undefined);

  const getAccessToken = async () => {
    const res = await fetch('/api/auth/accessToken');

    if (!res.ok) {
      return;
    }

    const accessToken = await res.json();
    return accessToken.token;
  };

  const startRefresh = useCallback(async () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      const token = await jose.decodeJwt(accessToken);
      const exp = token.exp! * 1000; // Convert to milliseconds

      const currentTime = Date.now();
      const refreshTime = exp - currentTime - 5000;

      timeoutId.current = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime);
    } catch (error: any) {}
  }, []);

  const refreshAccessToken = async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (!res.ok) {
        console.log('Failed to refresh access token');
        return;
      }
    } catch (error: any) {
      console.error(`Error while refreshing the token`, error);
    }

    startRefresh();
  };

  useEffect(() => {
    startRefresh();

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [timeoutId, startRefresh]);

  return <div> {children}</div>;
};

export default Refresher;
