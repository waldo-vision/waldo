import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Tag,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import Image from 'next/image';
import { docs, github, mailto, twitter, discord, legal } from '@utils/links';
import WaldoLogo from '../public/android-chrome-256x256.png';

const Logo = () => {
  return <Image src={WaldoLogo} width={40} height={40} alt="Logo" />;
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box bg={'white'}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <ListHeader>Services</ListHeader>
            <Link href={'/'}>Waldo Vision</Link>
            <Stack direction={'row'} align={'center'} spacing={2}>
              <Link href={docs}>Docs</Link>
              <Tag size={'sm'} bg={'purple.300'} ml={2} color={'white'}>
                New
              </Tag>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            <Link href={github}>Github</Link>
            <Link href={mailto}>Contact Us</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Legal</ListHeader>
            <Link href={legal.TOS}>Terms of Service</Link>
            <Link href={legal.privacy}>Privacy Policy</Link>
            <Link href={legal.cookie}>Cookie Policy</Link>
            <Link href={legal.COC}>Code of Conduct</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Follow Us</ListHeader>
            <Link href={discord}>Discord</Link>
            <Link href={twitter}>Twitter</Link>
            <Link href={github}>Github</Link>
          </Stack>
        </SimpleGrid>
      </Container>
      <Box py={10}>
        <Flex
          align={'center'}
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: 'gray.200',
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: 'gray.200',
            flexGrow: 1,
            ml: 8,
          }}
        >
          <Logo />
        </Flex>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          &copy; 2023 Waldo Intelligence LLC
        </Text>
      </Box>
    </Box>
  );
}
