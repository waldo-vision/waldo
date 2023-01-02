import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
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
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import WaldoLogo from '../public/android-chrome-256x256.png';
import GithubLogo from '../public/navbar_github.png';
import { discord, docs, githubrepo } from '@utils/links';
import useSite from '@site';
import BlacklistedModal from './BlacklistedModal';
export default function Navigation() {
  const { isOpen, onToggle } = useDisclosure();
  const [y, setY] = useState(0);

  const { session } = useSite();
  const changeBackground = () => {
    setY(window.scrollY);
  };
  useEffect(() => {
    changeBackground();
    // adding the event when scroll change background
    window.addEventListener('scroll', changeBackground);
  }, []);

  return (
    <>
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
          px={{ base: 2, sm: 4, md: 50 }}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            display={{ base: 'flex', md: 'none' }}
            align={'center'}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
            <Heading size={'md'} pb={1} pl={3}>
              <Link href={'/'}>WALDO</Link>
            </Heading>
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'left' }}>
            <Link href={'/'}>
              <Flex
                flexDirection={'row'}
                alignItems={'center'}
                display={{ base: 'none', md: 'flex' }}
              >
                <Image src={WaldoLogo} width={40} height={40} alt="Logo" />
                <Heading size={'md'} pl={3}>
                  WALDO
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
            <Image alt="Github" src={GithubLogo} width={35} height={35} />
          </Link>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
      {session && session.user?.blacklisted && <BlacklistedModal show={true} />}
    </>
  );
}

const DesktopNav = () => {
  const linkHoverColor = 'purple.800';
  const router = useRouter();

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map(({ label, href, pathName }: NavItem) => (
        <Box key={label}>
          <Link href={href ?? '#'}>
            <Text
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
              fontWeight={
                pathName != null && router.pathname.includes(pathName)
                  ? 'bold'
                  : 'regular'
              }
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

const githubIconHref = githubrepo;
interface NavItem {
  label: string;
  href: string;
  pathName: string | null;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Submissions',
    href: '/submissions/',
    pathName: '/submissions',
  },
  {
    label: 'Account',
    href: '/account',
    pathName: '/account',
  },
  {
    label: 'Community',
    href: discord,
    pathName: null,
  },
  {
    label: 'Docs',
    href: docs,
    pathName: null,
  },
];
