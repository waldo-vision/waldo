import { Box, Center } from '@chakra-ui/react';
import WithSubnavigation from './Navbar';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Box>
        <WithSubnavigation />
        <Center>{children}</Center>
      </Box>
    </>
  );
}
