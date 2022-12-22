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
import Sidebar from '@components/dashboard/Sidebar';
import { useEffect, useState } from 'react';
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { trpc } from '@utils/trpc';
import Loading from '@components/Loading';
import { FiUser } from 'react-icons/fi';
import { CiWarning } from 'react-icons/ci';
import { BiBlock } from 'react-icons/bi';
import {
  BsFillExclamationOctagonFill,
  BsChevronLeft,
  BsChevronRight,
} from 'react-icons/bs';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export default function User() {
  // Searching states
  const [searchUser, setSearchUser] = useState<string>();
  const [searchRole, setSearchRole] = useState<string | null>(null);

  // Data and Rows
  // const { data, isLoading } = trpc.user.getUsers.useQuery({ page: 1 });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rows, setRows] = useState({});

  const { data, isLoading } = trpc.user.getUsers.useQuery({ page: 1, filterRoles: searchRole });
  const handleFilter = async (role: string | null) => {
    if (role == null) {
      setSearchRole(null)
      return;
    }
    setSearchRole(role.toUpperCase())
  }
  if (isLoading) {
    return (
      <Box>
        <Loading color={'blue.500'} />
      </Box>
    );
  } else {
    return (
      <Sidebar>
        <Center width={'100%'} flexDirection={'column'} gap={5}>
          <InputGroup width={{ base: '100%', md: '60%' }}>
            <Input
              bgColor={'white'}
              borderRadius={16}
              border={'none'}
              height={'50px'}
              fontWeight={'medium'}
              placeholder={'Search Users'}
              onChange={e => setSearchUser(e.target.value)}
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
                <MenuItem onClick={() => handleFilter('Admin')}>
                  Admin
                </MenuItem>
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
                  {data?.map(result => {
                    return (
                      <Tr bgColor={'white'} height={'70px'}>
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
                              {result.name.length > 20
                                ? result.name.substring(0, 10) +
                                  '\u2026' +
                                  result.name.slice(-10)
                                : result.name}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text casing={'capitalize'} fontSize={15}>
                            {result.blacklisted ? "Blacklisted" : result.role.toLowerCase()}
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
                          <MenuAction userId={result.id} isBlacklisted={result.blacklisted}/>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Center>
      </Sidebar>
    );
  }
}
interface MenuActionProps {
  userId: string
  isBlacklisted: boolean | null
}
const MenuAction = (props:MenuActionProps) => {
  const userId = props.userId;
  const blacklisted = props.isBlacklisted
  const utils = trpc.useContext()
  const toast = useToast()
  const changeRole = trpc.user.updateUser.useMutation({
    async onSuccess() {
      await utils.user.invalidate()
    }
  })
  const suspendUser = trpc.user.blackListUser.useMutation({
    async onSuccess() {
      await utils.user.invalidate()
    }
  })
  const handleRoleChange = async (roleToChange: string) => {
    await changeRole.mutateAsync({ role: roleToChange, userId: userId})
    toast({
      position: 'bottom-right',
      title: 'Role Change',
      description: `Successfully changed the selected user's role to ${roleToChange}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }

  const handleSuspendUser = async () => {
    await suspendUser.mutateAsync({ userId: userId, blacklisted: !blacklisted })
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
  }
  return (
  <Menu>
    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
      Actions
    </MenuButton>
    <MenuList p={0} borderBottomRadius={12}>
      <MenuItem height={'35px'} icon={<FiUser size={16} />} onClick={() => handleRoleChange("USER")}
>
        Grant User
      </MenuItem>
      <MenuItem
        height={'35px'}
        icon={<CiWarning size={16} style={{ strokeWidth: '1px' }} />}
        onClick={() => handleRoleChange("MOD")}
      >
        Grant Mod
      </MenuItem>
      <MenuItem
        color={'red.300'}
        height={'35px'}
        _hover={{ bgColor: 'red.200', color: 'white' }}
        onClick={() => handleRoleChange("ADMIN")}
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
        {blacklisted ? "Un-Suspend User" : "Suspend User"}
      </MenuItem>
    </MenuList>
  </Menu>
)}
