import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Center,
  Text,
  Input,
  Button,
  Checkbox,
  Divider,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { getSession } from 'next-auth/react';
const Main = () => {
  return (
    <div>
      <Flex
        direction={'column'}
        w={'inherit'}
        bgColor={'white'}
        borderRadius={'16'}
        m={8}
        pb={3}
      >
        <Flex direction={'row'} p={6}>
          {/* TOP PORTION */}
          <Flex direction={'row'} gap={2}>
            <Input size={'md'} placeholder={'Search user'} />
            <Button colorScheme={'purple'} px={6}>
              Add User
            </Button>
          </Flex>
        </Flex>
        <Flex>
          {/* TODO: MAP FROM ARRAY<OBJECT> */}
          <SectionIdentifiers identifier={'USER'} />
          <SectionIdentifiers identifier={'EMAIL'} />
          <SectionIdentifiers identifier={'ROLE'} />
          <SectionIdentifiers identifier={'LE'} />
          <SectionIdentifiers identifier={'ACTION'} />
        </Flex>
        <RoleStack />
      </Flex>
    </div>
  );
};

export default Main;
interface SIProps {
  identifier: string;
}
const SectionIdentifiers = (props: SIProps) => {
  return (
    <Flex
      direction={'row'}
      mt={6}
      bgColor={'gray.100'}
      w={'100%'}
      py={4}
      pl={6}
    >
      <Flex alignItems={'center'}>
        {props.identifier == 'USER' && (
          <Checkbox
            size="lg"
            colorScheme="purple"
            bgColor={'white'}
            borderColor={'gray.500'}
          ></Checkbox>
        )}
        <>
          <Divider
            borderColor={'gray.900'}
            orientation={'vertical'}
            mx={12}
            size={'2xl'}
          />
          <Text fontSize={13} fontWeight={'bold'}>
            {props.identifier}
          </Text>
          {props.identifier == 'ACTION' && (
            <Divider
              borderColor={'gray.900'}
              orientation={'vertical'}
              mx={12}
              size={'2xl'}
            />
          )}
        </>
      </Flex>
    </Flex>
  );
};

const RoleStack = () => {
  const [session, setSession] = useState();
  const getCurrentSession = async () => {
    const session = await getSession();
    setSession(session);
  };
  useEffect(() => {
    getCurrentSession();
  }, []);
  return (
    <Flex direction={'row'} mt={6} bgColor={'white'} w={'100%'} py={4} pl={6}>
      <Flex alignItems={'center'} direction={'row'}></Flex>
    </Flex>
  );
};
