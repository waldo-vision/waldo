'use client';
import React, { useEffect } from 'react';
//import { api } from './_trpc/serverClient';
const Page = () => {
  // const data = await api.site.getPageData.query({ name: 'account' });
  // console.log(data);

  return (
    <div className="flex max-h-screen text-black">
      <div className="ml-12 text-2xl font-bold">Waldo Dashboard</div>
    </div>
  );
};

export default Page;
