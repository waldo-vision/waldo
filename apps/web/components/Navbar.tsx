import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  useDisclosure,
  Heading,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
export default function Navigation() {
  const { isOpen, onToggle } = useDisclosure();
  const [userSession, setUserSession] = useState<any>()
  const [y, setY] = useState(0);

  const changeBackground = () => {
    setY(window.scrollY);
  };
  const getCurrentSession = async () => {
    const session = await getSession();
    setUserSession(session)
    console.log(session)
  }
  useEffect(() => {
    changeBackground();
    // adding the event when scroll change background
    window.addEventListener('scroll', changeBackground);
    getCurrentSession()
  }, []);

  return (
    <Box
      minWidth={'max-content'}
      alignItems={'center'}
      gap={2}
      position={'fixed'}
      w={'100%'}
      zIndex={100}
    >
      <Flex
        bg={y > 25 || isOpen ? 'white' : 'transparent'}
        sx={{
          transition: 'all .25s ease-in-out',
          WebkitTransition: 'all .25s ease-in-out',
          MozTransition: 'all .25s ease-in-out',
        }}
        minH={'60px'}
        py={{ base: 2 }}
        align={'center'}
        gap={5}
        px={{ base: 0, md: 50 }}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          display={{ base: 'flex', md: 'none' }}
          align={'center'}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
          <Heading size={'md'} pb={1} pl={3}>
            Waldo
          </Heading>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'left' }}>
          <Link href={'/'}>
            <Flex
              flexDirection={'row'}
              alignItems={'center'}
              display={{ base: 'none', md: 'flex' }}
            >
              <Image
                src="/android-chrome-256x256.png"
                width={40}
                height={40}
                alt="Logo"
              />
              <Heading size={'md'} pl={3}>
                Waldo
              </Heading>
            </Flex>
          </Link>
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'end' }}>
          <Flex display={{ base: 'none', md: 'flex' }}>
            <DesktopNav />
          </Flex>
        </Flex>
        <Link href={githubIconHref}>
          <Image alt="Github" src="/navbar_github.png" width={35} height={35} />
        </Link>
        <Box>
            {userSession && <Image src={userSession.user.avatarUrl} alt="Avatar" width={22} height={22} />}
        </Box>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkHoverColor = 'purple.800';
  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map(({ label, href }: NavItem) => (
        <Box key={label}>
          <Link href={href ?? '#'}>
            <Text
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
            >
              {label}
            </Text>
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack bg={'white'} p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem: NavItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  const { onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
      >
        <Text>{label}</Text>
      </Flex>
    </Stack>
  );
};

const githubIconHref = 'https://github.com/waldo-vision';
interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Upload',
    href: '/upload',
  },
  {
    label: 'Docs',
    href: 'https://docs.waldo.vision',
  },
  {
    label: 'Community',
    href: 'https://discord.gg/MPAV4qP8Hx',
  },
];
