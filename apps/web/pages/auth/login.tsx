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
  useToast,
  ModalFooter,
  Divider,
  Heading,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn, getSession, signOut } from 'next-auth/react';
import WaldoLogo from '../../public/android-chrome-256x256.png';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaDiscord, FaBattleNet, FaTwitch } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub, BsFacebook } from 'react-icons/bs';
import Head from 'next/head';
type Provider = {
  provider: string;
  hex?: string;
  selected?: boolean;
};
export default function Login() {
  const [linkAlertOpen, setLinkAlertOpen] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<Session | null>();
  const [lastSelected, setLastSelected] = useState<number | null>(null);
  const [currentProvider, setCurrentProvider] = useState<string>();
  const [authProviders, setAuthProviders] = useState<Array<Provider>>();
  const toast = useToast();
  const createToast = () => {
    toast({
      position: 'bottom-right',
      title: 'Error',
      description:
        "You can't login with the provider currently associated with your account.",
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };
  const retrieveUserSession = async () => {
    const session = await getSession();
    setUserSession(session);
  };

  const handleSelect = (index: number) => {
    if (!authProviders) return;
    setCurrentProvider(authProviders[index].provider.toLowerCase());
    if (
      userSession?.user?.provider.toLocaleLowerCase() ==
      authProviders[index].provider.toLocaleLowerCase()
    ) {
      createToast();
      return;
    }
    setLastSelected(index);
    if (lastSelected == null) {
      const val = authProviders[index];
      val.selected = !val.selected;
    } else {
      authProviders[lastSelected].selected = false;
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
        hex: '#5865F2',
        selected: false,
      },
      {
        provider: 'Google',
        selected: false,
      },
      {
        provider: 'Github',
        hex: '#000000',
        selected: false,
      },
      {
        provider: 'BattleNET',
        hex: '#009AE4',
        selected: false,
      },
      {
        provider: 'Twitch',
        hex: '#9146FF',
        selected: false,
      },
    ];
    retrieveUserSession();
    setAuthProviders(providers);
  }, []);

  return (
    <>
      <Head>
        <title>Waldo Vision | Login</title>
        <meta
          name="description"
          content="Waldo Vision is an Open-source visual cheat detection, powered by A.I"
        />
      </Head>
      <Box maxWidth={'100%'} maxHeight={'100vh'} textAlign={'left'}>
        <Flex direction={'row'} height={'100vh'} width={'100v'}>
          <Box
            display={{ base: 'none', lg: 'flex' }}
            w={{ base: 0, md: 0, lg: '50%' }}
            height={'full'}
          >
            <Flex
              width={'100%'}
              height={'100%'}
              direction={'column'}
              py={10}
              px={20}
              justify={'space-between'}
            >
              <Box>
                <Link href={'/'}>
                  <Flex
                    flexDirection={'row'}
                    alignItems={'center'}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <Image src={WaldoLogo} width={40} height={40} alt="Logo" />
                    <Heading size={'md'} pl={3}>
                      Waldo Vision
                    </Heading>
                  </Flex>
                </Link>
              </Box>
              <Box>
                <Flex direction={'column'}>
                  <Text
                    fontWeight={'bold'}
                    fontSize={{ base: 0, md: 25, lg: 30 }}
                    color={'gray.600'}
                    mb={2}
                  >
                    Sign up
                  </Text>
                  <Text
                    fontWeight={'semibold'}
                    fontSize={{ base: 0, md: 15, lg: 20 }}
                    color={'gray.600'}
                  >
                    To access uploading and reviewing community clips you must
                    be logged in.
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Box>
          <Box w={'full'} maxHeight={'full'} bg="white" overflowY={'scroll'}>
            <Box mt={6} mx={'20px'}>
              <Box mb={10}>
                <Link href={'/'}>
                  <Flex
                    flexDirection={'row'}
                    alignItems={'center'}
                    display={{ base: 'flex', lg: 'none' }}
                  >
                    <Image src={WaldoLogo} width={40} height={40} alt="Logo" />
                    <Heading size={'md'} pl={3}>
                      Waldo Vision
                    </Heading>
                  </Flex>
                </Link>
              </Box>
              <Heading fontWeight={'semibold'} fontSize={32}>
                Sign up with an authentication gateway
              </Heading>
              <Text mt={2}>Choose your gateway to connect with below.</Text>
            </Box>
            <Divider mt={12} />
            {authProviders &&
              authProviders.map(({ provider, hex, selected }, index) => (
                <Box
                  w={'full'}
                  mt={12}
                  cursor={'pointer'}
                  onClick={() => handleSelect(index)}
                  key={index}
                  px={5}
                >
                  <Box
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
                              {provider == 'FaceBook' && (
                                <BsFacebook size={40} color={hex} />
                              )}
                              {provider == 'Twitch' && (
                                <FaTwitch size={40} color={hex} />
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
                    </Flex>
                  </Box>
                </Box>
              ))}
            <Flex justifyContent={'end'}>
              <Button
                mr={{ base: 5 }}
                mb={12}
                mt={8}
                bgColor="black"
                _hover={{ backgroundColor: 'gray.800' }}
                color="white"
                onClick={() => handleLoginLogic()}
                disabled={currentProvider ? false : true}
              >
                Connect
              </Button>
            </Flex>
          </Box>
          <Center h={'100vh'}>
            <Modal
              isOpen={linkAlertOpen}
              onClose={() => setLinkAlertOpen(false)}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Account Linking</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  To prevent accidental account linking, please confirm that you
                  wish to link your current account;{' '}
                  {userSession && userSession?.user?.provider} with the account
                  you are trying to login to;{' '}
                  {currentProvider && currentProvider}.
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
      </Box>
    </>
  );
}
