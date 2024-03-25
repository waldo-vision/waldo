import React from 'react';
import { Spinner } from 'ui';

const Loading = () => {
  return (
    <div className="flex flex-col gap-2 w-full h-screen items-center justify-center bg-black">
      <Spinner size={26} className="text-sigp" />
      <h1
        className="text-white underline cursor-pointer font-semibold"
        onClick={() => window.location.reload()}
      >
        Refresh
      </h1>
    </div>
  );
};

export default Loading;
