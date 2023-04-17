import Layout from '@components/Layout';
import { ReactElement, useEffect, useState } from 'react';
import { AlertStatus } from '@chakra-ui/alert';
import {
  Button,
  Center,
  Text,
  Flex,
  Input,
  useToast,
  Box,
  SlideFade,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Image as CIMG,
  Checkbox,
  Link,
  Container,
  Heading,
} from '@chakra-ui/react';
import TurnstileWidget from '@components/TurnstileWidget';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
import Loading from '@components/Loading';
import { trpc } from '@utils/trpc';
import { inferProcedureInput } from '@trpc/server';
import { AppRouter } from '@server/trpc/router/_app';
import { TRPCError } from '@trpc/server';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { prisma } from '@server/db/client';
import { legal } from '@utils/links';
import { games } from '@config/gameplay';
import { GameplayType } from '@utils/zod/gameplay';

type Cheat = 'NOCHEAT' | 'AIMBOT' | 'TRIGGERBOT' | 'ESP' | 'SPINBOT';
export default function Upload() {
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
  const [tsToken, setTsToken] = useState<string | undefined>('');
  const [requestDone, setRequestDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<string>('csg');
  const [cheats, setCheats] = useState<Cheat[]>([]);
  const [legalConfirmations, setLegalConfirmations] = useState<number>(0);

  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [userSession, setUserSession] = useState<Session | undefined>();
  const toast = useToast();
  const utils = trpc.useContext();
  const router = useRouter();
  const createGameplay = trpc.gameplay.create.useMutation({
    async onSuccess() {
      await utils.gameplay.invalidate();
    },
  });
  const checkURL = (url: string): boolean => {
    const p =
      // eslint-disable-next-line max-len
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

    if (url.match(p)) {
      return true;
    }
    return false;
  };

  const { data: isDisabled } = trpc.site.getPageData.useQuery({
    name: 'upload',
  });

  const handleRequestError = async (error: TRPCError | string) => {
    setWaitingForResponse(false);
    setRequestDone(true);
    setCurrentUrl('');

    // Create toasts
    createToast(error.toString() as unknown as string, 'error', 'Error');
    // Enable Error
    setError(true);
    await delay();

    // End handle
    setError(false);
    setRequestDone(false);
  };

  const cheatsArray = [
    { name: 'NOCHEAT' },
    { name: 'AIMBOT' },
    { name: 'TRIGGERBOT' },
    { name: 'ESP' },
    { name: 'SPINBOT' },
  ];

  const options = [
    {
      option: 'Do you have permission from the owner to submit?',
      checked: false,
    },
    {
      option: 'Does this video contain the confirmed game footage?',
      checked: false,
    },
    {
      option: 'Do you understand that any violations will result in a ban?',
      checked: false,
    },
  ];

  const createToast = (msg: string, type: AlertStatus, title: string) => {
    toast({
      position: 'bottom-right',
      title: title,
      description: msg,
      status: type,
      duration: 5000,
      isClosable: true,
    });
  };

  const delay = () => {
    return new Promise(resolve => setTimeout(resolve, 2200));
  };

  const handleRequestSuccess = async () => {
    setWaitingForResponse(false);
    setRequestDone(true);
    setError(false);

    await delay();

    setSelectedGame('');
    setCurrentUrl('');
    setRequestDone(false);
    createToast(
      "Successfully uploaded your footage to waldo's server!",
      'success',
      'Success!',
    );
  };

  const handleClipUpload = async () => {
    if (!isRequestValid) {
      handleRequestError('Request Invalid. Reload and try again.');
      return;
    }
    if (requestDone) {
      setSelectedGame('');
      setCurrentUrl('');
      setRequestDone(false);
      setError(false);
      return;
    }
    setWaitingForResponse(true);
    if (!checkURL(currentUrl)) {
      handleRequestError(
        "That is not a valid YouTube link. Please make sure 'https' is included.",
      );
      return;
    }

    if (legalConfirmations != 3) {
      handleRequestError('Please check the required legal agreement options.');
      return;
    }
    type Input = inferProcedureInput<AppRouter['gameplay']['create']>;
    //    ^?
    const input: Input = {
      gameplayType: selectedGame.toUpperCase() as GameplayType,
      youtubeUrl: currentUrl as string,
      cheats: cheats.length == 0 ? ['NOCHEAT'] : (cheats as Cheat[]),
      tsToken: tsToken as string,
    };
    try {
      await createGameplay.mutateAsync(input);
      handleRequestSuccess();
    } catch (error: unknown) {
      console.log(error);
      handleRequestError(error as TRPCError);
    }
  };

  useEffect(() => {
    setLegalConfirmations(0);
    const doPageLoadThings = async () => {
      if (isDisabled?.maintenance) {
        router.push('/');
      }
      const session = await getSession();
      if (session === null) {
        router.push('/auth/login');
      } else {
        setUserSession(session);
      }
      setLoading(false);
    };
    setLoading(true);
    doPageLoadThings();
  }, [router, isDisabled]);

  if (loading) {
    return (
      <Box>
        <Loading color={'purple.500'} />
      </Box>
    );
  } else {
    return (
      <>
        <Head>
          <title>Submissions | Upload</title>
          <meta
            name="description"
            content="Waldo Vision is an open-source visual cheat detection project, powered by deep learning"
          />
        </Head>
        <Container
          mt={10}
          maxWidth={{ base: '100%', md: '90%', lg: '80%' }}
          minHeight={'100vh'}
          height={'100%'}
          textAlign={'left'}
          pt={{ base: 0, lg: '200px' }}
          pb={10}
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            height={'100%'}
            width={'100%'}
            gap={10}
          >
            <Box height={'100%'} width={{ lg: '50%' }}>
              <Center width={'100%'} height={'100%'}>
                <Flex direction={'column'} maxWidth={'450px'} gap={5}>
                  <Heading mt={16} fontSize={{ base: 30, lg: 40 }}>
                    Submit Your Gameplay
                  </Heading>
                  <Text fontSize={{ base: 14, lg: 16 }}>
                    You can provide us <b>gameplay footage</b> so we can train
                    the model. We require <b>hundreds of hours of footage</b>{' '}
                    and the community is the only source available. It will be
                    processed by the model, which will help make the model so
                    much more <b>accurate.</b>
                    <br />
                    <br />
                    Before you submit a video make sure you have read the rules
                    regarding the submission and reviewing of gameplay. You can
                    read our{' '}
                    <Link href={legal.TOS}>
                      <Text as={'span'} fontWeight={'bold'}>
                        Terms of Service
                      </Text>
                    </Link>
                    .
                  </Text>
                  <TurnstileWidget
                    valid={(result, token) => {
                      setIsRequestValid(result);
                      setTsToken(token);
                    }}
                    refreshState={0}
                  />
                </Flex>
              </Center>
            </Box>
            <Box width={{ lg: '50%' }}>
              <Center>
                <Box
                  py={6}
                  px={6}
                  bg={'white'}
                  borderRadius={'16px'}
                  maxW={{ sm: '450px', lg: '700px' }}
                >
                  <Flex direction={'row'}>
                    <CIMG
                      src={userSession?.user?.image as string}
                      alt={'img'}
                      borderRadius={40}
                      width={20}
                      height={20}
                    />
                    <Center>
                      <Box ml={3}>
                        <Text
                          fontWeight={'bold'}
                          fontSize={'2xl'}
                          onClick={() => signOut()}
                        >
                          {userSession?.user?.name}
                        </Text>
                        <Flex direction={'row'}>
                          <Text>
                            Logged in from {userSession?.user?.provider}
                          </Text>
                          <Box mt={'1.5'} ml={1}>
                            <ShieldCheckIcon
                              height={14}
                              width={14}
                              color={'black'}
                            />
                          </Box>
                        </Flex>
                      </Box>
                    </Center>
                  </Flex>
                  <Flex direction={'column'} mt={6}>
                    <Box>
                      <Text mb={2}>Youtube URL</Text>
                      <Input
                        placeholder={
                          'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                        }
                        size={'lg'}
                        value={currentUrl}
                        onChange={event => setCurrentUrl(event.target.value)}
                        borderRadius={15}
                      />
                    </Box>
                    <Flex mt={4} gap={4}>
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon width={16} height={16} />}
                          borderRadius={15}
                        >
                          {!selectedGame
                            ? 'Select a Game:'
                            : games.find(game => game.shortName == selectedGame)
                                ?.name}
                        </MenuButton>
                        <MenuList>
                          <MenuOptionGroup
                            title="Games"
                            type="radio"
                            onChange={game => setSelectedGame(game.toString())}
                          >
                            {games &&
                              games.map(game => (
                                <MenuItemOption
                                  key={game.shortName}
                                  value={game.shortName}
                                >
                                  {game.name}
                                </MenuItemOption>
                              ))}
                          </MenuOptionGroup>
                        </MenuList>
                      </Menu>
                      {userSession?.user?.role !== 'USER' && (
                        <Menu closeOnSelect={false}>
                          <MenuButton
                            as={Button}
                            rightIcon={
                              <ChevronDownIcon width={16} height={16} />
                            }
                            borderRadius={15}
                          >
                            Select a Cheat:
                          </MenuButton>
                          <MenuList>
                            <MenuOptionGroup title="Cheats" type="checkbox">
                              {cheatsArray.map(cheat => (
                                <MenuItemOption
                                  key={cheat.name}
                                  value={cheat.name}
                                  onClick={() => {
                                    if (cheats.includes(cheat.name as Cheat)) {
                                      setCheats(
                                        cheats.filter(c => c !== cheat.name),
                                      );
                                    } else {
                                      setCheats([
                                        ...cheats,
                                        cheat.name as Cheat,
                                      ]);
                                    }
                                  }}
                                >
                                  {cheat.name}
                                </MenuItemOption>
                              ))}
                            </MenuOptionGroup>
                          </MenuList>
                        </Menu>
                      )}
                    </Flex>
                    <Box mt={6}>
                      {options.map((option, index) => (
                        <Box key={index}>
                          <Flex direction={'column'}>
                            <Checkbox
                              size="md"
                              colorScheme="purple"
                              required={true}
                              mb={3}
                              onChange={event => {
                                const target = event.target;
                                if (target.checked) {
                                  setLegalConfirmations(legalConfirmations + 1);
                                } else {
                                  setLegalConfirmations(legalConfirmations - 1);
                                }
                              }}
                            >
                              {option.option}
                            </Checkbox>
                          </Flex>
                        </Box>
                      ))}
                    </Box>
                    <Flex direction={{ base: 'column', md: 'row' }} gap={5}>
                      <Box mt={6} maxW={'400px'}>
                        <Text onClick={() => console.log(cheats)}>
                          By submitting, you are agreeing to our&nbsp;
                          <Link href={legal.TOS}>
                            <Text as={'span'} fontWeight={'bold'}>
                              Terms of Service
                            </Text>
                          </Link>
                          &nbsp;and &nbsp;
                          <Link href={legal.privacy}>
                            <Text as={'span'} fontWeight={'bold'}>
                              Privacy Policy
                            </Text>
                          </Link>
                          .
                        </Text>
                      </Box>
                      <Button
                        width={'100px'}
                        backgroundColor={'gray.800'}
                        colorScheme={'blackAlpha'}
                        boxShadow="lg"
                        mt={5}
                        onClick={() => handleClipUpload()}
                        isLoading={waitingForResponse}
                      >
                        {!requestDone ? (
                          <SlideFade in={!requestDone} offsetY="5px">
                            <Text>Submit</Text>
                          </SlideFade>
                        ) : (
                          <Flex direction={'row'}>
                            <SlideFade
                              in={requestDone}
                              offsetY="5px"
                              delay={0.3}
                            >
                              {error ? (
                                <XCircleIcon
                                  color="white"
                                  width={26}
                                  height={26}
                                />
                              ) : (
                                <CheckCircleIcon
                                  color="white"
                                  width={26}
                                  height={26}
                                />
                              )}
                            </SlideFade>
                          </Flex>
                        )}
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              </Center>
            </Box>
          </Flex>
        </Container>
      </>
    );
  }
}

export const getServerSideProps = async () => {
  const config = await prisma.waldoPage.findUnique({
    where: {
      name: 'upload',
    },
  });
  if (config && config?.maintenance) {
    return { redirect: { destination: '/', permanent: false } };
  } else return { props: {} };
};

Upload.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
