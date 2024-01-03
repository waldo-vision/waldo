'use client';
import React from 'react';
import { WaldoButton } from 'ui';

export const CreateAccountBtn = () => {
  return (
    <div className="fixed bottom-0 right-0 m-9">
      <WaldoButton
        size="sm"
        className="text-white font-semibold text-sm py-1 px-14"
      >
        Create Account
      </WaldoButton>
    </div>
  );
};
