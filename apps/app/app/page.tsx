'use client';
import React, { useEffect } from 'react';
//import { api } from './_trpc/serverClient';
import { useSession } from '@contexts/SessionContext';
const Page = () => {
  // const data = await api.site.getPageData.query({ name: 'account' });
  // console.log(data);
  const s = useSession();

  return (
    <div className="flex max-h-screen text-gray-700">
      <div className="ml-12">{s.session ? s.session.name : 'jjj'}</div>
    </div>
  );
};

export default Page;
