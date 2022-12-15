import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import { Box, Center } from '@chakra-ui/react';
import Navigation from './Navbar';
const Footer = dynamic(() => import('./Footer'), {
  suspense: true,
});

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Box>
        <Navigation />
        <Center>{children}</Center>
        <Suspense fallback={`Loading...`}>
          <Footer />
        </Suspense>
      </Box>
    </>
  );
}
