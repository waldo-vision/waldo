import React, { useEffect, useState } from 'react';
import { Box, Flex, Center, Text, Image } from '@chakra-ui/react';
import { FaRegUser } from 'react-icons/fa';
import { GrGamepad } from 'react-icons/gr';
import { FcLock } from 'react-icons/fc';
import { router } from '@server/trpc/trpc';
import { useRouter } from 'next/router';
type Tab = {
  tabName: string;
  path: string;
};
const Sidebar = () => {
  const sidebarTabs = [
    { tabName: 'Users', path: '/user' },
    { tabName: 'Roles/Permissions', path: '/roleperms' },
    { tabName: 'Gameplay', path: '/gameplay' },
  ];
  const [tabs, setTabs] = useState<Array<Tab>>(sidebarTabs);
  const router = useRouter();
  useEffect(() => {
    setTabs(sidebarTabs);
  }, []);
  return (
    <div>
      <Flex direction={'column'}>
        <Flex direction={'row'} m={6}>
          <Center h={'100%'}>
            <Image src={'../android-chrome-192x192.png'} w={12} h={12} />
            <Text ml={2} fontWeight={'bold'} fontSize={20}>
              Waldo
            </Text>
          </Center>
        </Flex>
        {tabs && (
          <Box>
            {tabs.map((tab, index) => (
              <Flex
                bgColor={
                  '/dash' + tab.path == router.pathname ? 'purple.500' : 'white'
                }
                borderRadius={16}
                p={3}
                alignItems={'center'}
                gap={2}
                key={index}
                ml={6}
                mb={4}
                cursor={'pointer'}
                _hover={
                  '/dash' + tab.path == router.pathname
                    ? { bgColor: 'purple.600' }
                    : { bgColor: 'gray.400' }
                }
                onClick={() => router.push('/dash/' + tab.path)}
              >
                {/* ICONS */}
                <Box pl={2}>
                  {index == 0 && (
                    <FaRegUser
                      color={
                        '/dash' + tab.path == router.pathname
                          ? 'white'
                          : 'black'
                      }
                    />
                  )}
                  {index == 1 && <FcLock />}
                  {index == 2 && (
                    <GrGamepad
                      color={
                        '/dash' + tab.path == router.pathname
                          ? 'black'
                          : 'white'
                      }
                    />
                  )}
                </Box>
                {/* NAMING */}
                <Box pr={2}>
                  <Text
                    fontWeight={'semibold'}
                    fontSize={14}
                    color={
                      '/dash' + tab.path == router.pathname
                        ? 'white'
                        : 'gray.700'
                    }
                  >
                    {tab.tabName}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Box>
        )}
      </Flex>
    </div>
  );
};

export default Sidebar;
