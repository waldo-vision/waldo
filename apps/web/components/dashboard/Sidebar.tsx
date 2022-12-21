import React, { useEffect, useState } from 'react';
import { Box, Flex, Center, Text, Image } from '@chakra-ui/react';
import { FaUserAlt, FaGamepad } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Tab = {
  tabName: string;
  path: string;
  icon: React.ReactElement;
};

const sidebarTabs = [
  { tabName: 'Users', path: '/user', icon: <FaUserAlt /> },
  { tabName: 'Gameplay', path: '/gameplay', icon: <FaGamepad /> },
];

export default function Sidebar() {
  const [tabs, setTabs] = useState<Array<Tab>>(sidebarTabs);
  const router = useRouter();
  useEffect(() => {
    setTabs(sidebarTabs);
  }, []);
  return (
    <Box height={'100vh'} minWidth={60} bgColor={'white'} py={3} px={5}>
      <Flex direction={'column'} height={'100%'} gap={'24px'}>
        <Link href={'/'}>
          <Flex direction={'row'}>
            <Center h={'100%'}>
              <Image
                src={'../android-chrome-192x192.png'}
                w={12}
                h={12}
                alt={'Logo'}
              />
              <Text ml={2} fontWeight={'bold'} fontSize={20}>
                Waldo
              </Text>
            </Center>
          </Flex>
        </Link>
        {tabs && (
          <Flex direction={'column'} gap={2}>
            {tabs.map((tab, index) => (
              <Flex
                bgColor={
                  '/dash' + tab.path == router.pathname ? 'purple.500' : 'white'
                }
                color={'/dash' + tab.path == router.pathname ? 'white' : ''}
                fontWeight={'medium'}
                borderRadius={16}
                py={3}
                px={5}
                alignItems={'center'}
                gap={2}
                key={index}
                cursor={'pointer'}
                _hover={
                  '/dash' + tab.path == router.pathname
                    ? { bgColor: 'purple.600' }
                    : {
                        bgColor: 'gray.100',
                      }
                }
                onClick={() => router.push('/dash/' + tab.path)}
              >
                {/* ICONS */}
                {tab.icon}
                {/* NAMING */}

                {tab.tabName}
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
