import React, { useEffect } from 'react';

import { api } from './_trpc/serverClient';

const Page = async () => {
  const data = await api.site.getPageData.query({ name: 'review' });
  console.log(data);
  return (
    <div>
      <header>
        <h1>Hello Logto. 1</h1>
      </header>
    </div>
  );
};

export default Page;
