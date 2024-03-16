import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Heading,
  Text,
} from '@chakra-ui/react';
import { BiLock } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';
import WaldoLogo from '../../../public/android-chrome-256x256.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Tab = {
  tabName: string;
  path: string;
  icon: React.ReactElement;
};

const SideBarTabs: Tab[] = [
  { tabName: 'API Keys', path: '/apikeys', icon: <BiLock size={25} /> },
];

export default function Sidebar({ children }: { children?: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p={'4'} pt={'5'}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  return (
    <Box
      bgColor={'white'}
      px={3}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent="space-between">
        <Link href={'/'}>
          <Flex align={'center'}>
            <Image src={WaldoLogo} width={40} height={40} alt="Logo" />
            <Flex direction={'column'}>
              <Heading size={'md'} pl={3}>
                Waldo Vision
              </Heading>
              <Text pl={3} fontWeight={'regular'}>
                Developer Portal
              </Text>
            </Flex>
          </Flex>
        </Link>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex direction={'column'} gap={3}>
        {SideBarTabs.map((tab, index) => (
          <Flex
            bgColor={
              '/portal/developers' + tab.path == router.pathname
                ? 'purple.500'
                : 'white'
            }
            color={
              '/portal/developers' + tab.path == router.pathname ? 'white' : ''
            }
            fontWeight={'medium'}
            borderRadius={16}
            py={3}
            px={5}
            alignItems={'center'}
            gap={2}
            key={index}
            cursor={'pointer'}
            _hover={
              '/portal/developers' + tab.path == router.pathname
                ? { bgColor: 'purple.600' }
                : {
                    bgColor: 'gray.50',
                  }
            }
            onClick={() => router.push('/portal/developers' + tab.path)}
          >
            {/* ICONS */}
            {tab.icon}
            {/* NAMING */}

            {tab.tabName}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      gap={2}
      alignItems="center"
      bg={'white'}
      justifyContent="space-between"
      {...rest}
    >
      <Link href={'/'}>
        <Flex align={'center'}>
          <Image src={WaldoLogo} width={40} height={40} alt="Logo" />
          <Flex direction={'column'}>
            <Heading size={'md'} pl={3}>
              Waldo Vision
            </Heading>
            <Text pl={3} fontWeight={'regular'}>
              Developer Portal
            </Text>
          </Flex>
        </Flex>
      </Link>
      <IconButton
        variant="ghost"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
};
