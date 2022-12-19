import { Box, Text, Button, Center, Flex, useToast } from '@chakra-ui/react';
import Layout from '@components/Layout';
import { useState, useEffect } from 'react';
import { signOut, getSession } from 'next-auth/react';
import { ReactElement } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { trpc } from '@utils/trpc';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { FaMinusCircle } from 'react-icons/fa';
import DeleteAccModal from '@components/DeleteAccModal';
import Loading from '@components/Loading';
import AccGameplayItems from '@components/AccGameplayItems';
import Head from 'next/head';
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
        description: 'An unexpected error occured, please try again later.',
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
  return (
    <>
      <Head>
        <title>Waldo | Account</title>
        <meta
          name="description"
          content="Waldo is an Open-source visual cheat detection, powered by A.I"
        />
      </Head>
      <div>
        <Center h={'100vh'}>
          {laLoading || siteLoading ? (
            <Loading color={'default'} />
          ) : (
            <>
              <DeleteAccModal show={showM} />
              <Box bg={'white'} p={8} overflow={'hidden'}>
                <Flex
                  direction={'column'}
                  w={{ base: 'xs', md: 'sm', lg: 'xl' }}
                >
                  {/* heading */}
                  <Box>
                    <Text fontWeight={'bold'} fontSize={30}>
                      Your Account
                    </Text>
                  </Box>
                  {/* Linked Account */}
                  <Flex>
                    <Box mt={5} mb={2}>
                      <Text fontWeight={'regular'} fontSize={11}>
                        Linked Accounts
                      </Text>
                      {linkedAccounts &&
                        linkedAccounts.map((account, index) => (
                          <Flex
                            direction={'row'}
                            alignItems={'center'}
                            key={index}
                          >
                            <Box
                              mt={2}
                              borderRadius={10}
                              borderColor={'gray.500'}
                              borderWidth={1}
                              width={'18vh'}
                            >
                              <Box ml={2}>
                                <Flex justifyItems={'center'}>
                                  <Center>
                                    {/* TODO: Check provider and render the logo that is associated w the provider*/}
                                    <FaDiscord size={28} />
                                    <Text fontSize={'xx-small'} ml={2}>
                                      {account.provider.toUpperCase()}{' '}
                                      {account.provider ==
                                      userSession?.user?.provider
                                        ? 'Primary'
                                        : 'Secondary'}
                                    </Text>
                                  </Center>
                                </Flex>
                              </Box>
                            </Box>
                            <Box mt={2} ml={2}>
                              {account.provider !=
                                userSession?.user?.provider && (
                                <FaMinusCircle
                                  size={15}
                                  color={'red'}
                                  onClick={() => unlinkProvider(account)}
                                  cursor={'pointer'}
                                />
                              )}
                            </Box>
                          </Flex>
                        ))}
                    </Box>
                    {/* Uploaded Gameplay */}
                    <Box mt={5} mb={2} right={0} ml={'auto'}>
                      <Text fontWeight={'regular'} fontSize={11}>
                        Your Uploads
                      </Text>
                      <AccGameplayItems />
                    </Box>
                  </Flex>
                  <Box ml={'auto'} right={0} mt={12}>
                    <Button
                      color={'red.300'}
                      variant={'ghost'}
                      _hover={{ bgColor: 'white', color: 'red.400' }}
                      mr={2}
                      onClick={() => handleAccountDeletion()}
                    >
                      Delete Primary Account
                    </Button>
                    <Button
                      bgColor={'#373737'}
                      boxShadow={'dark-lg'}
                      color={'white'}
                      _hover={{ bgColor: 'gray.700' }}
                      onClick={() => signOut()}
                    >
                      Logout
                    </Button>
                  </Box>
                </Flex>
              </Box>
            </>
          )}
        </Center>
      </div>
    </>
  );
}

Account.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
