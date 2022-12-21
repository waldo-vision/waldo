import { Box, Text, Button, Flex, useToast, Divider } from '@chakra-ui/react';
import Layout from '@components/Layout';
import React, { useState, useEffect } from 'react';
import { signOut, getSession } from 'next-auth/react';
import { ReactElement } from 'react';
import { trpc } from '@utils/trpc';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { TiTick } from 'react-icons/ti';
import { RxCross2 } from 'react-icons/rx';
import DeleteAccModal from '@components/DeleteAccModal';
import Loading from '@components/Loading';
import AccGameplayItems from '@components/AccGameplayItems';
import Head from 'next/head';
import { FaDiscord, FaBattleNet, FaTwitch } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub, BsFacebook } from 'react-icons/bs';
import { MdOutlineRemove } from 'react-icons/md';
import Link from 'next/link';

type ProvidersListType = {
  name: string;
  icon: React.ReactElement;
};
const ProvidersList: Array<ProvidersListType> = [
  {
    name: 'Discord',
    icon: <FaDiscord size={30} color={'#5865F2'} />,
  },
  {
    name: 'Google',
    icon: <FcGoogle size={30} />,
  },
  {
    name: 'BattleNet',
    icon: <FaBattleNet size={30} color={'#009AE4'} />,
  },
  {
    name: 'Twitch',
    icon: <FaTwitch size={30} color={'#9146FF'} />,
  },
  {
    name: 'Github',
    icon: <BsGithub size={30} color={'#000000'} />,
  },
  {
    name: 'Facebook',
    icon: <BsFacebook size={30} color={'#0165E1'} />,
  },
];

export default function Account() {
  const [userSession, setUserSession] = useState<Session | undefined>();
  const utils = trpc.useContext();
  const toast = useToast();
  const { isLoading: laLoading, data: laData } =
    trpc.user.getLinkedAccounts.useQuery();
  const unlinkAccount = trpc.user.unlinkAccount.useMutation({
    async onSuccess() {
      await utils.user.invalidate();
    },
  });
  const [linkedAccounts, setLinkedAccounts] = useState(laData);
  const [showM, setShowM] = useState(false);
  const [siteLoading, setSiteLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleAccountDeletion = async () => {
    if (showM) {
      setShowM(false);
    } else {
      setShowM(true);
    }
  };

  const unlinkProvider = async (account: {
    id: string;
    userId: string;
    provider: string;
  }) => {
    console.log(account);
    try {
      await unlinkAccount.mutateAsync({ accountId: account.id });
      toast({
        position: 'bottom-right',
        title: 'Unlink Account',
        description: 'Successfully unlinked the account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'bottom-right',
        title: 'Unlink Account',
        description: 'An unexpected error occurred, please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    const getCurrentSession = async () => {
      const session = await getSession();
      if (session) {
        setUserSession(session);
      } else {
        router.push('/auth/login');
      }
      setSiteLoading(false);
    };
    const getNecessaryData = () => {
      if (!laLoading) setLinkedAccounts(laData);
      // in the future perhaps we add getting names for linked accounts, so we make a query here to get the user model
      // associated with the linked account.
    };
    getCurrentSession();
    getNecessaryData();
  }, [laData, laLoading, router]);

  if (laLoading || siteLoading) {
    return (
      <Box>
        <Loading color={'blue.500'} />
      </Box>
    );
  } else {
    return (
      <>
        <Head>
          <title>Waldo | Account</title>
          <meta
            name="description"
            content="Waldo is an Open-source visual cheat detection, powered by A.I"
          />
        </Head>
        <Box minHeight={'100vh'} mt={{ base: '60px' }} mb={20}>
          <Flex direction={'column'} gap={3}>
            <Text fontWeight={'bold'} fontSize={30}>
              Your Account
              <Text fontWeight={'normal'} fontSize={15}>
                Manage your account settings.
              </Text>
            </Text>
            <Box
              borderRadius={'16px'}
              bg={'white'}
              p={{ base: 4, md: 8 }}
              overflow={'hidden'}
              minWidth={'30vw'}
              minHeight={'60vh'}
              width={{ base: '90vw', md: '80vw' }}
            >
              <DeleteAccModal show={showM} />
              <Flex direction={'column'} gap={20}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  justify={'space-between'}
                  gap={{ base: 10, lg: 0 }}
                >
                  {/* Linked Account */}
                  <Box width={{ md: '100%', lg: '30%' }}>
                    <Text
                      fontWeight={'normal'}
                      mb={5}
                      fontSize={{ base: 15, sm: 18 }}
                    >
                      You have linked <b>all</b> of the following accounts:
                    </Text>
                    <Flex direction={'column'} gap={5}>
                      {linkedAccounts &&
                        ProvidersList.map(({ name, icon }, index) => (
                          <>
                            <Divider />
                            <Box key={index}>
                              <Flex direction={'column'} gap={2}>
                                <Flex
                                  align={'center'}
                                  direction={'row'}
                                  gap={3}
                                >
                                  {icon}
                                  <Text fontWeight={500}>{name}</Text>
                                </Flex>
                                <Flex direction={'column'}>
                                  {linkedAccounts.some(
                                    account =>
                                      account.provider.toUpperCase() ===
                                      name.toUpperCase(),
                                  ) ? (
                                    <>
                                      {name.toUpperCase() ==
                                      userSession?.user?.provider.toUpperCase() ? (
                                        <Flex
                                          direction={'row'}
                                          align={'center'}
                                          ml={3}
                                          gap={1}
                                        >
                                          <TiTick color={'green'} />
                                          <Text fontSize={{ base: 13, sm: 15 }}>
                                            This is your primary account
                                          </Text>
                                        </Flex>
                                      ) : (
                                        <></>
                                      )}
                                      <Flex
                                        direction={'row'}
                                        align={'center'}
                                        ml={3}
                                        gap={1}
                                      >
                                        <TiTick color={'green'} />
                                        <Text
                                          fontSize={{
                                            base: 11,
                                            sm: 13,
                                            md: 15,
                                          }}
                                        >
                                          Your are connected to a {name}{' '}
                                          account.
                                        </Text>
                                      </Flex>
                                      {name.toUpperCase() !=
                                      userSession?.user?.provider.toUpperCase() ? (
                                        <Button
                                          leftIcon={<MdOutlineRemove />}
                                          colorScheme={'red'}
                                          variant={'solid'}
                                          my={3}
                                          onClick={() => {
                                            const account = linkedAccounts.find(
                                              account =>
                                                account.provider.toUpperCase() ===
                                                name.toUpperCase(),
                                            );
                                            if (!account) {
                                              toast({
                                                position: 'bottom-right',
                                                title: 'Account Error',
                                                description:
                                                  'An unexpected error occurred, please try again later.',
                                                status: 'error',
                                                duration: 5000,
                                                isClosable: true,
                                              });
                                              return;
                                            }
                                            unlinkProvider(account);
                                          }}
                                        >
                                          Disconnect
                                        </Button>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  ) : (
                                    <Flex
                                      direction={'row'}
                                      align={'center'}
                                      ml={3}
                                      gap={1}
                                    >
                                      <RxCross2 color={'red'} />
                                      <Text
                                        fontSize={{ base: 11, sm: 13, md: 15 }}
                                      >
                                        You are not connected to a {name}{' '}
                                        account.
                                      </Text>
                                    </Flex>
                                  )}
                                </Flex>
                              </Flex>
                            </Box>
                          </>
                        ))}
                    </Flex>
                  </Box>
                  {/* Uploaded Gameplay */}
                  <Box width={{ md: '100%', lg: '60%' }} px={{ lg: 5 }}>
                    <Text
                      fontWeight={'normal'}
                      mb={5}
                      fontSize={{ base: 15, sm: 18 }}
                    >
                      Your Gameplay:
                    </Text>
                    <AccGameplayItems />
                  </Box>
                </Flex>
                {/* Delete Account */}
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  ml={{ md: 'auto' }}
                  right={0}
                  gap={3}
                >
                  <Button
                    bgColor={'red.300'}
                    color={'white'}
                    variant={'solid'}
                    _hover={{ bgColor: 'white', color: 'red.400' }}
                    onClick={() => handleAccountDeletion()}
                  >
                    Delete Account
                  </Button>
                  <Button
                    bgColor={'#373737'}
                    backgroundColor={'gray.800'}
                    colorScheme={'blackAlpha'}
                    boxShadow={'lg'}
                    onClick={() => router.push('/auth/login')}
                  >
                    Add Connection
                  </Button>
                  <Button
                    bgColor={'#373737'}
                    backgroundColor={'gray.800'}
                    colorScheme={'blackAlpha'}
                    boxShadow={'lg'}
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </>
    );
  }
}

Account.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
