import {
  Box,
  Text,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Center,
  InputRightElement,
  InputGroup,
  Table,
  Tbody,
  Td,
  Image,
  Th,
  Thead,
  Tr,
  Flex,
  Tfoot,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import Layout from '@components/dashboard/Layout';
import { useEffect, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from '@chakra-ui/icons';
import { trpc } from '@utils/trpc';
import { FiUser } from 'react-icons/fi';
import { CiWarning } from 'react-icons/ci';
import { BiBlock } from 'react-icons/bi';
import { BsFillExclamationOctagonFill } from 'react-icons/bs';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import { ReactElement } from 'react';

export default function User() {
  // Searching states
  const [searchUserValue, setSearchUserValue] = useState<string>('');
  const [searchRole, setSearchRole] = useState<string | null>(null);

  const handleFilter = async (role: string | null) => {
    role == null ? setSearchRole(null) : setSearchRole(role.toUpperCase());
  };

  // Data and Rows
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [currentUserCount, setCurrentUserCount] = useState<number | null>(null);

  const {
    data: users,
    isLoading: isLoading,
    refetch: refetchUsers,
  } = trpc.user.getUsers.useQuery(
    {
      page: pageNumber,
      filterRoles: searchRole,
    },
    { enabled: false },
  );

  const {
    data: searchedUser,
    isLoading: isSearchLoading,
    refetch: research,
  } = trpc.user.search.useQuery(
    { name: searchUserValue },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    if (searchUserValue === '') {
      refetchUsers();
      users && setCurrentUserCount(users.userCount);
    } else {
      research();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchRole, users, searchUserValue]);

  const handlePage = () => {
    if (!currentUserCount) return;
    if (pageNumber == Math.ceil(currentUserCount / Math.round(10))) {
      return;
    } else {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePageChange = async (add: boolean) => {
    if (add) {
      setPageNumber(pageNumber + 1);
    } else {
      setPageNumber(1);
    }
  };

  return (
    <Center width={'100%'} flexDirection={'column'} gap={5}>
      <InputGroup width={{ base: '100%', md: '60%' }}>
        <Input
          bgColor={'white'}
          borderRadius={16}
          border={'none'}
          height={'50px'}
          fontWeight={'medium'}
          placeholder={'Search Users'}
          value={searchUserValue}
          onChange={e => {
            setSearchUserValue(e.target.value);
          }}
        />
        <InputRightElement mt={1}>
          <SearchIcon />
        </InputRightElement>
      </InputGroup>
      <Box width={{ base: '100%', md: '85%' }}>
        <Menu>
          <MenuButton
            as={Button}
            bgColor={'white'}
            _hover={{ bgColor: 'white' }}
            _active={{ bgColor: 'white' }}
            rightIcon={<ChevronDownIcon />}
          >
            Roles:{' '}
            {searchRole
              ? searchRole?.toLowerCase().charAt(0).toUpperCase() +
                searchRole?.toLowerCase().slice(1)
              : 'All'}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleFilter(null)}>All</MenuItem>
            <MenuItem onClick={() => handleFilter('User')}>User</MenuItem>
            <MenuItem onClick={() => handleFilter('Trusted')}>Trusted</MenuItem>
            <MenuItem onClick={() => handleFilter('Mod')}>Mod</MenuItem>
            <MenuItem onClick={() => handleFilter('Admin')}>Admin</MenuItem>
          </MenuList>
        </Menu>
        <Box overflowX="auto">
          <Table
            width={'100%'}
            variant={'simple'}
            sx={{
              borderCollapse: 'separate',
              borderSpacing: '0 1rem',
            }}
          >
            <Thead>
              <Tr bgColor={'white'} height={'50px'}>
                <Th borderLeftRadius={16}>
                  <Text casing={'capitalize'} fontWeight={'bold'} fontSize={15}>
                    User
                  </Text>
                </Th>
                <Th>
                  <Text casing={'capitalize'} fontWeight={'bold'} fontSize={15}>
                    Role
                  </Text>
                </Th>
                <Th>
                  <Text casing={'capitalize'} fontWeight={'bold'} fontSize={15}>
                    Email
                  </Text>
                </Th>
                <Th>
                  <Text casing={'capitalize'} fontWeight={'bold'} fontSize={15}>
                    Verified
                  </Text>
                </Th>
                <Th>
                  <Text casing={'capitalize'} fontWeight={'bold'} fontSize={15}>
                    ID
                  </Text>
                </Th>
                <Th borderRightRadius={16}>
                  <Text casing={'capitalize'} fontWeight={'bold'} fontSize={15}>
                    Actions
                  </Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading || (isSearchLoading && searchUserValue != '') ? (
                <Tr>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td>
                    <Center h={600}>
                      <Spinner color={'purple.500'} size={'xl'} />
                    </Center>
                  </Td>
                  <Td></Td>
                </Tr>
              ) : searchUserValue === '' ? (
                users && users.users.length > 0 ? (
                  users.users.map((result, index) => {
                    return (
                      <Tr bgColor={'white'} height={'70px'} key={index}>
                        <Td borderLeftRadius={16}>
                          <Flex direction={'row'} align={'center'} gap={2}>
                            <Image
                              src={result.image as string}
                              alt={'Profile Image'}
                              rounded={'full'}
                              width={7}
                              height={7}
                            />
                            <Text fontWeight={'bold'}>
                              {result.name && result.name.length > 20
                                ? result.name.substring(0, 10) +
                                  '\u2026' +
                                  result.name.slice(-10)
                                : result.name}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text casing={'capitalize'} fontSize={15}>
                            {result.blacklisted
                              ? 'Blacklisted'
                              : result.role.toLowerCase()}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize={15}>{result.email}</Text>
                        </Td>
                        <Td>
                          <Text fontSize={15}>
                            {result.emailVerified ? 'Verified' : 'Not Verified'}
                          </Text>
                        </Td>
                        <Td>
                          <Text as="samp" fontSize={15} isTruncated>
                            {result.id.replace(/.{5}/g, '$&:').slice(0, -1)}
                          </Text>
                        </Td>
                        <Td borderRightRadius={16}>
                          <MenuAction
                            userId={result.id}
                            isBlacklisted={result.blacklisted}
                          />
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Notfound />
                )
              ) : searchedUser ? (
                <Tr bgColor={'white'} height={'70px'}>
                  <Td borderLeftRadius={16}>
                    <Flex direction={'row'} align={'center'} gap={2}>
                      <Image
                        src={searchedUser.image as string}
                        alt={'Profile Image'}
                        rounded={'full'}
                        width={7}
                        height={7}
                      />
                      <Text fontWeight={'bold'}>
                        {searchedUser.name && searchedUser.name.length > 20
                          ? searchedUser.name.substring(0, 10) +
                            '\u2026' +
                            searchedUser.name.slice(-10)
                          : searchedUser.name}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Text casing={'capitalize'} fontSize={15}>
                      {searchedUser.blacklisted
                        ? 'Blacklisted'
                        : searchedUser.role.toLowerCase()}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize={15}>{searchedUser.email}</Text>
                  </Td>
                  <Td>
                    <Text fontSize={15}>
                      {searchedUser.emailVerified ? 'Verified' : 'Not Verified'}
                    </Text>
                  </Td>
                  <Td>
                    <Text as="samp" fontSize={15} isTruncated>
                      {searchedUser.id.replace(/.{5}/g, '$&:').slice(0, -1)}
                    </Text>
                  </Td>
                  <Td borderRightRadius={16}>
                    <MenuAction
                      userId={searchedUser.id}
                      isBlacklisted={searchedUser.blacklisted}
                    />
                  </Td>
                </Tr>
              ) : (
                <Notfound />
              )}
            </Tbody>
            <Tfoot bgColor={'white'} height={'50px'}>
              <Tr>
                <Td borderLeftRadius={16} />
                <Td />
                <Td />
                <Td />
                <Td />
                {searchUserValue === '' ? (
                  <Td bgColor={'white'} borderRadius={16} isTruncated>
                    <Flex
                      direction={'row'}
                      align={'center'}
                      textAlign={'center'}
                      gap={2}
                    >
                      <ChevronLeftIcon
                        cursor={pageNumber === 1 ? 'not-allowed' : 'pointer'}
                        h={6}
                        w={6}
                        _hover={{ color: 'gray.400' }}
                        color={pageNumber === 1 ? 'gray.300' : ''}
                        onClick={() =>
                          pageNumber === 1 ? null : handlePageChange(false)
                        }
                      />
                      <Flex>
                        <Text fontWeight={'semibold'}>Page</Text>{' '}
                        <Text ml={2}>
                          {pageNumber} of{' '}
                          {currentUserCount &&
                            currentUserCount &&
                            Math.ceil(currentUserCount / Math.round(10))}
                        </Text>
                      </Flex>
                      <ChevronRightIcon
                        cursor={
                          currentUserCount &&
                          pageNumber ==
                            Math.ceil(currentUserCount / Math.round(10))
                            ? 'not-allowed'
                            : 'pointer'
                        }
                        h={6}
                        w={6}
                        _hover={{ color: 'gray.400' }}
                        color={
                          currentUserCount &&
                          pageNumber ==
                            Math.ceil(currentUserCount / Math.round(10))
                            ? 'gray.300'
                            : ''
                        }
                        onClick={() => handlePage()}
                      />
                    </Flex>
                  </Td>
                ) : (
                  <Td>Results</Td>
                )}
              </Tr>
            </Tfoot>
          </Table>
        </Box>
      </Box>
    </Center>
  );
}
interface MenuActionProps {
  userId: string;
  isBlacklisted: boolean | null;
}
const MenuAction = (props: MenuActionProps) => {
  const userId = props.userId;
  const blacklisted = props.isBlacklisted;
  const utils = trpc.useContext();
  const toast = useToast();
  const changeRole = trpc.user.updateRole.useMutation({
    async onSuccess() {
      await utils.user.invalidate();
    },
  });
  const suspendUser = trpc.user.blackList.useMutation({
    async onSuccess() {
      await utils.user.invalidate();
    },
  });
  const handleRoleChange = async (roleToChange: string) => {
    await changeRole.mutateAsync({ role: roleToChange, userId: userId });
    toast({
      position: 'bottom-right',
      title: 'Role Change',
      description: `Successfully changed the selected user's role to ${roleToChange}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuspendUser = async () => {
    await suspendUser.mutateAsync({
      userId: userId,
      blacklisted: !blacklisted,
    });
    if (blacklisted) {
      toast({
        position: 'bottom-right',
        title: 'Un-Suspend User',
        description: `Successfully un-suspeneded the user.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        position: 'bottom-right',
        title: 'Suspend User',
        description: `Successfully suspeneded the user.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Actions
      </MenuButton>
      <MenuList p={0} borderBottomRadius={12}>
        <MenuItem
          height={'35px'}
          icon={<FiUser size={16} />}
          onClick={() => handleRoleChange('USER')}
        >
          Grant User
        </MenuItem>
        <MenuItem
          height={'35px'}
          icon={<FiUser size={16} />}
          onClick={() => handleRoleChange('TRUSTED')}
        >
          Grant Trusted
        </MenuItem>
        <MenuItem
          height={'35px'}
          icon={<CiWarning size={16} style={{ strokeWidth: '1px' }} />}
          onClick={() => handleRoleChange('MOD')}
        >
          Grant Mod
        </MenuItem>
        <MenuItem
          color={'red.300'}
          height={'35px'}
          _hover={{ bgColor: 'red.200', color: 'white' }}
          onClick={() => handleRoleChange('ADMIN')}
          icon={<BsFillExclamationOctagonFill size={16} />}
        >
          Grant Admin
        </MenuItem>
        <MenuItem
          icon={
            <BiBlock color={'white'} size={16} style={{ strokeWidth: '1px' }} />
          }
          bgColor={'red.300'}
          color={'white'}
          height={'45px'}
          borderTopRadius={0}
          borderBottomRadius={12}
          _hover={{ bgColor: 'red.400' }}
          onClick={() => handleSuspendUser()}
        >
          {blacklisted ? 'Un-Suspend User' : 'Suspend User'}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const Notfound = () => (
  <Tr>
    <Td></Td>
    <Td></Td>
    <Td></Td>
    <Td>
      <Center h={600}>
        <Text>Could not find any users.</Text>
      </Center>
    </Td>
    <Td></Td>
  </Tr>
);

User.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function getServerSideProps(context) {
  const user = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (user?.user?.role === 'ADMIN' || user?.user?.role === 'MOD')
    return { props: {} };
  else return { redirect: { destination: '/404' } };
}
