import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Square,
  Divider,
} from '@chakra-ui/react';
import Layout from '@components/Layout';
import { Session } from 'next-auth';
import { signIn, getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { ReactElement, useState, useEffect } from 'react';
import {
  FaDiscord,
  FaGithub,
  FaGoogle,
  FaBattleNet,
  FaSteam,
  FaApple,
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { SiFaceit } from 'react-icons/si';
const Login = () => {
  type Provider = {
    provider: string;
    docs: string;
    hex: string;
    selected: boolean;
  };
  const [userSession, setUserSession] = useState<Session | null>();
  const [lastSelected, setLastSelected] = useState<number | null>(null);
  const [currentProvider, setCurrentProvider] = useState<string>();
  const [authProviders, setAuthProviders] = useState<Array<Provider>>();
  const retrieveUserSession = async () => {
    const session = await getSession();
    setUserSession(session);
  };

  const handleSelect = (index: number) => {
    setCurrentProvider(authProviders[index].provider.toLowerCase());
    setLastSelected(index);
    if (lastSelected == null) {
      const val = authProviders[index];
      val.selected = !val.selected;
    } else {
      const resetLastItem = (authProviders[lastSelected].selected = false);
      const val = authProviders[index];
      val.selected = !val.selected;
    }
  };

  let providers = [
    {
      provider: 'Discord',
      docs: 'https://example.com',
      hex: '#5865F2',
      selected: false,
    },
    { provider: 'Google', docs: 'https://example.com', selectedd: false },
    {
      provider: 'Github',
      docs: 'https://example.com',
      hex: '#000000',
      selected: false,
    },
    {
      provider: 'BattleNET',
      docs: 'https://example.com',
      hex: '#009AE4',
      selected: false,
    },
    {
      provider: 'Faceit',
      docs: 'https://example.com',
      hex: '#FF5500',
      selected: false,
    },
    {
      provider: 'Steam',
      docs: 'https://example.com',
      hex: '#00adee',
      selected: false,
    },
    {
      provider: 'Apple',
      docs: 'https://example.com',
      hex: '#000000',
      selected: false,
    },
  ];

  const login = async (type: string) => {
    if (type == 'discord') {
      signIn('discord');
    } else if (type == 'github') {
      signIn('github');
    } else if (type == 'google') {
      signIn('google');
    }
  };
  useEffect(() => {
    retrieveUserSession();
    setAuthProviders(providers);
  }, []);

  return (
    <div>
      <Flex direction={'row'} minHeight={'100vh'} position={'relative'}>
        <Flex color="white">
          <Box w={'xl'} bottom="0">
            <Text position={'absolute'} bottom="0"></Text>
          </Box>
        </Flex>
        <Box w={'full'} bg="white">
          <Box mt={12} ml={12}>
            <Text fontWeight={'semibold'} fontSize={32}>
              Sign up with an authentication gateway
            </Text>
            <Text>Choose your gateway to connect with below.</Text>
          </Box>
          <Divider mt={12} />
          {authProviders &&
            authProviders.map(({ provider, docs, hex, selected }, index) => (
              <Box
                w={'full'}
                mt={12}
                mb={provider == 'Apple' && 12}
                cursor={'pointer'}
                onClick={() => handleSelect(index)}
                key={index}
              >
                <Box
                  ml={16}
                  mr={16}
                  boxShadow={'lg'}
                  borderRadius={8}
                  h={24}
                  bgColor={selected ? 'gray.700' : 'white'}
                >
                  <Flex direction={'row'}>
                    <Center h={24}>
                      <Box ml={6}>
                        <Flex direction={'row'}>
                          <Center>
                            {provider == 'Discord' && (
                              <FaDiscord size={40} color={hex} />
                            )}
                            {provider == 'Google' && <FcGoogle size={40} />}
                            {provider == 'Github' && (
                              <BsGithub size={40} color={hex} />
                            )}
                            {provider == 'BattleNET' && (
                              <FaBattleNet size={40} color={hex} />
                            )}
                            {provider == 'Faceit' && (
                              <SiFaceit size={40} color={hex} />
                            )}
                            {provider == 'Steam' && (
                              <FaSteam size={40} color={hex} />
                            )}
                            {provider == 'Apple' && (
                              <FaApple size={40} color={hex} />
                            )}

                            <Flex direction={'column'} ml={3}>
                              <Text
                                fontWeight={'semibold'}
                                fontSize={15}
                                color={selected ? 'white' : ''}
                              >
                                {provider}
                              </Text>
                              <Text color={selected ? 'white' : ''}>
                                Use your {provider} account to gain access to
                                waldo services.
                              </Text>
                            </Flex>
                          </Center>
                        </Flex>
                      </Box>
                    </Center>
                    <Flex right="0" ml={'auto'}>
                      <Center>
                        <Button variant="none" mr={6}>
                          <Link href={docs}>
                            <Text color={selected ? 'white' : ''}>
                              Learn More
                            </Text>
                          </Link>
                        </Button>
                      </Center>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            ))}
          <Flex justifyContent={'end'}>
            <Button
              mr={16}
              mb={12}
              bgColor="black"
              _hover={{ backgroundColor: 'gray.800' }}
              color="white"
              onClick={() => signIn(currentProvider)}
            >
              Connect
            </Button>
          </Flex>
        </Box>
      </Flex>
      {/*
      <Center h={'100vh'}>
        
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Account Linking</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              To prevent accidental account linking, please confirm that you
              wish to link your current account;{' '}
              {userSession && userSession?.user?.provider} with the account you
              are trying to login to;{' '}
              {attemptedLoginProvider && attemptedLoginProvider}.
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="purple"
                mr={3}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="purple" mr={3} onClick={() => signOut()}>
                Logout
              </Button>
              <Button
                variant="outline"
                onClick={() => signIn(attemptedLoginProvider)}
              >
                Continue
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>
  */}
    </div>
  );
};

export default Login;
