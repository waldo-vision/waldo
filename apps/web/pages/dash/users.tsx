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
import Loading from '@components/Loading';
import { FiUser } from 'react-icons/fi';
import { CiWarning } from 'react-icons/ci';
import { BiBlock } from 'react-icons/bi';
import { BsFillExclamationOctagonFill } from 'react-icons/bs';
import { ReactElement } from 'react';
type Query =
  | {
      userCount?: number | undefined;
      id: string;
      name: string | null;
      blacklisted: boolean;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: string;
    }[]
  | undefined;
export default function User() {
  // Searching states
  const [searchUserValue, setSearchUserValue] = useState<string | null>(null);

  const [searchRole, setSearchRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // Data and Rows
  // const { data, isLoading } = trpc.user.getUsers.useQuery({ page: 1 });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [data, setData] = useState<Query>();
  const {
    data: userQueryData,
    isLoading: userQueryLoading,
    refetch: userQueryRefetch,
  } = trpc.user.getUsers.useQuery(
    {
      page: pageNumber,
      filterRoles: searchRole,
    },
    { enabled: false },
  );
  const {
    data: searchFilterData,
    isLoading: searchFilterLoading,
    refetch: searchFilterRefetch,
    isError,
  } = trpc.user.search.useQuery({ name: searchUserValue }, { enabled: true });
  const handleFilter = async (role: string | null) => {
    if (role == null) {
      setSearchRole(null);
      return;
    }
    setSearchRole(role.toUpperCase());
  };

  const handlePageChange = async (add: boolean) => {
    setLoading(true);
    await userQueryRefetch();
    if (add) {
      setPageNumber(pageNumber + 1);
      await userQueryRefetch();
      setLoading(false);
    } else {
      setPageNumber(1);
      await userQueryRefetch();
    }
    setLoading(false);
  };
  useEffect(() => {
    const doLoadThings = async () => {
      if (searchUserValue == '') {
        setSearchUserValue(null);
      }
      if (!isError && searchFilterData) {
        setData([searchFilterData]);
      } else {
        await userQueryRefetch();
        setData(userQueryData);
      }
    };
    doLoadThings();
  }, [userQueryData, searchFilterData]);
  if (userQueryLoading) {
    return (
      <Box>
        <Loading color={'blue.500'} />
      </Box>
    );
  } else {
    const handlePage = () => {
      if (pageNumber == Math.ceil(data[0].userCount / Math.round(10))) {
        return;
      } else {
        setPageNumber(pageNumber + 1);
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
            onChange={e => setSearchUserValue(e.target.value)}
          />
          <InputRightElement mt={1}>
            <SearchIcon />
          </InputRightElement>
        </InputGroup>
        <Box width={{ base: '100%', md: '70%' }}>
          <Menu>
            <MenuButton
              as={Button}
              bgColor={'white'}
              _hover={{ bgColor: 'white' }}
              _active={{ bgColor: 'white' }}
              rightIcon={<ChevronDownIcon />}
            >
              Roles: {searchRole}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleFilter(null)}>All</MenuItem>
              <MenuItem onClick={() => handleFilter('User')}>User</MenuItem>
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
                    <Text
                      casing={'capitalize'}
                      fontWeight={'bold'}
                      fontSize={15}
                    >
                      User
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      casing={'capitalize'}
                      fontWeight={'bold'}
                      fontSize={15}
                    >
                      Role
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      casing={'capitalize'}
                      fontWeight={'bold'}
                      fontSize={15}
                    >
                      Email
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      casing={'capitalize'}
                      fontWeight={'bold'}
                      fontSize={15}
                    >
                      Verified
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      casing={'capitalize'}
                      fontWeight={'bold'}
                      fontSize={15}
                    >
                      ID
                    </Text>
                  </Th>
                  <Th borderRightRadius={16}>
                    <Text
                      casing={'capitalize'}
                      fontWeight={'bold'}
                      fontSize={15}
                    >
                      Actions
                    </Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((result, index) => {
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
                        <Text fontSize={15} isTruncated>
                          {result.id.replace(/.{5}/g, '$& : ').slice(0, -3)}
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
                })}
              </Tbody>
              <Tfoot bgColor={'white'} height={'50px'}>
                <Tr>
                  <Td borderLeftRadius={16} />
                  <Td />
                  <Td />
                  <Td />
                  <Td />
                  <Td bgColor={'white'} borderRadius={16} isTruncated>
                    <Flex
                      direction={'row'}
                      align={'center'}
                      textAlign={'center'}
                      gap={2}
                    >
                      <ChevronLeftIcon
                        cursor={'pointer'}
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
                          {data &&
                            data[0].userCount &&
                            Math.ceil(data[0].userCount / Math.round(10))}
                        </Text>
                      </Flex>
                      <ChevronRightIcon
                        cursor={'pointer'}
                        h={6}
                        w={6}
                        _hover={{ color: 'gray.400' }}
                        color={
                          data &&
                          data[0].userCount &&
                          pageNumber ==
                            Math.ceil(data[0].userCount / Math.round(10))
                            ? 'gray.300'
                            : ''
                        }
                        onClick={() => handlePage()}
                      />
                    </Flex>
                  </Td>
                </Tr>
              </Tfoot>
            </Table>
          </Box>
        </Box>
      </Center>
    );
  }
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
  const changeRole = trpc.user.updateUser.useMutation({
    async onSuccess() {
      await utils.user.invalidate();
    },
  });
  const suspendUser = trpc.user.blackListUser.useMutation({
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

User.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
