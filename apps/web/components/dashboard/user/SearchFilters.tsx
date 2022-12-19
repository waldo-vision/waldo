import React from 'react';
import {
  Box,
  Flex,
  Text,
  MenuButton,
  Menu,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaUserAlt as UserIcon, FaServer as AdminIcon } from 'react-icons/fa';
import { BsShieldFillCheck as ModeratorIcon } from 'react-icons/bs';
import { AiOutlineStop as BlacklistIcon } from 'react-icons/ai';
const SearchFilters = () => {
  return (
    <div>
      <Flex direction={'column'} m={8} w={'inherit'} position={'relative'}>
        <Flex bgColor={'white'} p={6} borderRadius={'16'} direction={'column'}>
          {/* TOP */}
          <Flex alignItems={'center'}>
            <Text fontSize={20} fontWeight={'bold'}>
              Search Filters
            </Text>
            <Button colorScheme={'purple'} ml={4}>
              Clear Filters
            </Button>
          </Flex>
          {/* BOTTOM */}
          <Flex direction={'row'} mt={6} justifyContent={'space-between'}>
            <RoleFilter />
            <NameFilter />
            <GameplayFilter />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default SearchFilters;

const RoleFilter = () => {
  return (
    <Menu>
      <MenuButton
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'gray.400' }}
        w={'xs'}
        textAlign={'left'}
      >
        Select Role <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={'user'}>
          <MenuItemOption icon={<UserIcon />} value={'user'}>
            User
          </MenuItemOption>
          <MenuItemOption icon={<ModeratorIcon />} value={'mod'}>
            Mod
          </MenuItemOption>
          <MenuItemOption icon={<AdminIcon />} value={'admin'}>
            Admin
          </MenuItemOption>
          <MenuItemOption icon={<BlacklistIcon />} value={'blacklisted'}>
            Blacklisted
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

const NameFilter = () => {
  return (
    <Menu>
      <MenuButton
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'gray.400' }}
        w={'xs'}
        textAlign={'left'}
      >
        Select Name Filter <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={'atz'}>
          <MenuItemOption value={'atz'}>A-Z</MenuItemOption>
          <MenuItemOption value={'zta'}>Z-A</MenuItemOption>
          <MenuItemOption value={'firstname'}>First Name</MenuItemOption>
          <MenuItemOption value={'lastname'}>Last Name</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

const GameplayFilter = () => {
  return (
    <Menu>
      <MenuButton
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'gray.400' }}
        w={'xs'}
        textAlign={'left'}
      >
        Select Gameplay Range <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={'1t10d'}>
          <MenuItemOption icon={<UserIcon />} value={'1t10d'}>
            1-10 Docs
          </MenuItemOption>
          <MenuItemOption icon={<ModeratorIcon />} value={'10t20d'}>
            10-20
          </MenuItemOption>
          <MenuItemOption icon={<AdminIcon />} value={'20t50d'}>
            20-50
          </MenuItemOption>
          <MenuItemOption icon={<BlacklistIcon />} value={'50t1000d'}>
            50-1000
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};
