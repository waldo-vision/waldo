import { Box, Center } from '@chakra-ui/react';
import Navigation from '@components/Navbar';
import Footer from '@components/Footer';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Box>
        <Navigation />
        <Center>{children}</Center>
        <Footer />
      </Box>
    </>
  );
}
