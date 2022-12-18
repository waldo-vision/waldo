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
  Divider,
  Image,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn, getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaDiscord, FaBattleNet, FaSteam, FaApple } from 'react-icons/fa';
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
  const [linkAlertOpen, setLinkAlertOpen] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<Session | null>();
  const [lastSelected, setLastSelected] = useState<number | null>(null);
  const [currentProvider, setCurrentProvider] = useState<string>();
  const [authProviders, setAuthProviders] = useState<Array<Provider>>();
  const retrieveUserSession = async () => {
    const session = await getSession();
    setUserSession(session);
  };

  const handleSelect = (index: number) => {
    if (!authProviders) return;
    setCurrentProvider(authProviders[index].provider.toLowerCase());
    setLastSelected(index);
    if (lastSelected == null) {
      const val = authProviders[index];
      val.selected = !val.selected;
    } else {
      const val = authProviders[index];
      val.selected = !val.selected;
    }
  };

  const handleLoginLogic = () => {
    console.log('running');
    if (userSession) {
      setLinkAlertOpen(true);
      return;
    } else {
      setLinkAlertOpen(false);
    }
    signIn(currentProvider);
  };

  useEffect(() => {
    const providers = [
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
    retrieveUserSession();
    setAuthProviders(providers);
  }, []);

  return (
    <div>
      <Flex direction={'row'} minHeight={'0vh'} position={'relative'}>
        <Flex
          color="white"
          w={{ base: 0, md: 0, lg: 'xl' }}
          h={{ base: 0, md: 0, lg: 'auto' }}
        >
          <Box w={{ base: 0, md: 0, lg: 'xl' }} bottom="0" mt={'auto'} mb={12}>
            <Center h={{ base: 0, md: 0, lg: '100vh' }}>
              <Image
                src={'/group.png'}
                width={'xl'}
                height={{ base: 0, md: 0, lg: '305px' }}
                alt={'Group'}
              />
            </Center>
            {/* add in v1.1 */}
            {/* <LoginTabItems /> */}
            <Flex alignItems={'left'} mx={12} direction={'column'}>
              <Text
                fontWeight={'bold'}
                fontSize={{ base: 0, md: 20, lg: 30 }}
                color={'gray.600'}
                mb={2}
              >
                Sign up
              </Text>
              <Text
                fontWeight={'semibold'}
                fontSize={{ base: 0, md: 10, lg: 20 }}
                color={'gray.600'}
              >
                To access uploading and reviewing community clips you must be
                logged in
              </Text>
            </Flex>
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
                              <Text
                                color={selected ? 'white' : ''}
                                fontSize={{ md: 0, base: 0, lg: 14 }}
                              >
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
                            <Text
                              color={selected ? 'white' : ''}
                              fontSize={{ base: 10, sm: 10, md: 10, lg: 10 }}
                              textOverflow={'ellipsis'}
                            >
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
              onClick={() => handleLoginLogic()}
            >
              Connect
            </Button>
          </Flex>
        </Box>
        <Center h={'100vh'}>
          <Modal isOpen={linkAlertOpen} onClose={() => setLinkAlertOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Account Linking</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                To prevent accidental account linking, please confirm that you
                wish to link your current account;{' '}
                {userSession && userSession?.user?.provider} with the account
                you are trying to login to; {currentProvider && currentProvider}
                .
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="purple"
                  mr={3}
                  onClick={() => setLinkAlertOpen(false)}
                >
                  Cancel
                </Button>
                <Button colorScheme="purple" mr={3} onClick={() => signOut()}>
                  Logout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signIn(currentProvider)}
                >
                  Continue
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Center>
      </Flex>
    </div>
  );
};

export default Login;
