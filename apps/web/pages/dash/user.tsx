import {
  Flex,
  Box,
  Text,
  Input,
  Button,
  Image,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import Sidebar from '@components/dashboard/Sidebar';
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FiServer, FiUser } from 'react-icons/fi';
import { BsShieldFillCheck, BsSlashCircle } from 'react-icons/bs';
import { trpc } from '@utils/trpc';
export default function User() {
  const [searchUser, setSearchUser] = useState<string>();
  const [userSession, setUserSession] = useState<Session | undefined>(
    undefined,
  );
  const { data, isLoading } = trpc.user.getUsers.useQuery({ page: 1 });
  const { data: d, isLoading: l } = trpc.site.isPageDisabled.useQuery({
    pageName: 'upload',
  });
  const handleSearch = () => {
    console.log(searchUser);
  };
  const items = ['User', 'Role', 'ID'];
  useEffect(() => {
    const getUSession = async () => {
      const session = await getSession();
      if (session) {
        setUserSession(session);
      }
      console.log(d);
    };
    getUSession();
  }, []);
  return (
    <div>
      <Flex direction={'row'} w={'100%'}>
        <Sidebar />
        <Flex direction={'column'} mt={12} w={'inherit'}>
          <Box
            bgColor={'white'}
            borderRadius={16}
            py={2}
            alignItems={'center'}
            mx={16}
          >
            <Flex alignItems={'center'} w={'full'}>
              <Input
                ml={3}
                placeholder={'Search Users'}
                onChange={event => setSearchUser(event.target.value)}
                size={'sm'}
                borderColor={'white'}
                focusBorderColor={'white'}
                _placeholder={{ fontWeight: 'semibold' }}
                _hover={{ borderColor: 'white' }}
              />
              <Button
                pr={4}
                variant={'unstyled'}
                onClick={() => handleSearch()}
              >
                <MagnifyingGlassIcon color="black" height={20} width={20} />
              </Button>
            </Flex>
          </Box>
          <Flex
            bgColor={'white'}
            borderRadius={16}
            fontWeight={'bold'}
            px={6}
            py={2}
            mx={12}
            mt={12}
          >
            <Flex w={'full'} ml={4} direction={'column'}>
              <Grid
                templateColumns="repeat(5, 1fr)"
                gap={6}
                overflowWrap={'break-word'}
              >
                <GridItem>User</GridItem>
                <GridItem>Role</GridItem>
                <GridItem>Email</GridItem>
                <GridItem right={0} ml={'auto'}>
                  Actions
                </GridItem>
              </Grid>
            </Flex>
          </Flex>
          <Flex
            bgColor={'white'}
            borderRadius={16}
            fontWeight={'bold'}
            px={6}
            py={4}
            mx={12}
            mt={4}
          >
            <Flex w={'full'} direction={'column'} ml={4}>
              <Grid
                templateColumns="repeat(5, 1fr)"
                maxW={'inherit'}
                alignItems={'center'}
              >
                <GridItem>
                  <Flex direction={'row'} gap={3}>
                    <Image
                      src={userSession?.user?.image as string}
                      h={7}
                      w={7}
                      borderRadius={16}
                    />
                    <Flex direction={'row'}>
                      <Text>{userSession?.user?.name}</Text>
                    </Flex>
                  </Flex>
                </GridItem>
                <GridItem>
                  <Text>{userSession?.user?.role}</Text>
                </GridItem>
                <GridItem>
                  <Text>{userSession?.user?.email}</Text>
                </GridItem>
                <GridItem right={0} ml={'auto'}>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList pb={-10} borderBottomRadius={12}>
                      <MenuItem icon={<FiUser size={16} />}>
                        Grant USER
                      </MenuItem>
                      <MenuItem icon={<BsShieldFillCheck size={16} />}>
                        Grant MOD
                      </MenuItem>
                      <MenuItem icon={<FiServer size={16} />}>
                        Grant ADMIN
                      </MenuItem>
                      <MenuItem
                        icon={<BsSlashCircle color={'white'} size={16} />}
                        bgColor={'red.300'}
                        borderTopRadius={0}
                        borderBottomRadius={12}
                        _hover={{ bgColor: 'red.400' }}
                      >
                        Suspend User
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </GridItem>
              </Grid>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
