import Layout from '@components/Layout';
import { checkURL } from '@utils/helpers/apiHelper';
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
  chakra,
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
const Upload = () => {
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
  const [requestDone, setRequestDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<string>('csg');
  const [legalConfirmations, setLegalConfirmations] = useState<number>(0);

  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [userSession, setUserSession] = useState<Session | undefined>();
  const toast = useToast();
  const utils = trpc.useContext();
  const router = useRouter();

  const createGameplay = trpc.gameplay.createGameplay.useMutation({
    async onSuccess() {
      await utils.gameplay.invalidate();
    },
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

  const games = [
    { name: 'Counter Strike: Global Offensive', shortName: 'csg' },
    { name: 'VALORANT', shortName: 'val' },
    { name: 'Team Fortress 2', shortName: 'tf2' },
    { name: 'Apex Legends', shortName: 'ape' },
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

    setSelectedGame('csg');
    setCurrentUrl('');
    setRequestDone(false);
    createToast(
      "Successfully uploaded your footage to waldo's server!",
      'success',
      'Sucess!',
    );
  };

  const handleClipUpload = async () => {
    if (!isRequestValid) {
      handleRequestError('Request Invalid. Reload and try again.');
      return;
    }
    if (requestDone) {
      setSelectedGame('csg');
      setCurrentUrl('');
      setRequestDone(false);
      setError(false);
      return;
    }
    setWaitingForResponse(true);
    if (!checkURL(currentUrl)) {
      handleRequestError('Please enter a valid youtube link');
      return;
    }

    if (legalConfirmations != 3) {
      handleRequestError('Please check the required legal agreement options.');
      return;
    }
    type Input = inferProcedureInput<AppRouter['gameplay']['createGameplay']>;
    //    ^?
    const input: Input = {
      gameplayType: selectedGame.toUpperCase() as
        | 'CSG'
        | 'VAL'
        | 'TF2'
        | 'COD'
        | 'APE',
      youtubeUrl: currentUrl as string,
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
    const getCurrentSession = async () => {
      const session = await getSession();
      if (session === null) {
        router.push('/auth/login');
      } else {
        setUserSession(session);
        setLoading(false);
      }
    };
    setLoading(true);
    getCurrentSession();
  }, [router]);
  return (
    <div>
      {loading ? (
        <Box>
          <Loading color={'blue.500'} />
        </Box>
      ) : (
        <Center h={'100vh'} maxW={'7xl'}>
          <Flex direction={{ lg: 'row', base: 'column' }}>
            <Container width={{ lg: '30%' }}>
              <Flex gap={5} direction={'column'}>
                <Heading mt={{ base: 16, md: 0, lg: 0, sm: 16 }}>
                  Submit Your Clips
                </Heading>
                <Text fontSize={{ base: 0, sm: 0, md: 14, lg: 14 }}>
                  Before you submit a video make sure you have read the rules
                  regarding
                </Text>
                <TurnstileWidget valid={result => setIsRequestValid(result)} />
              </Flex>
            </Container>
            <Container>
              <Box
                py={6}
                px={6}
                bg={'white'}
                borderRadius={'16px'}
                maxW={{ sm: '450px', lg: '700px' }}
              >
                <Flex direction={'row'}>
                  <CIMG
                    src={userSession?.user?.avatarUrl}
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
                      placeholder={'https://youtube.com/example'}
                      size={'lg'}
                      value={currentUrl}
                      onChange={event => setCurrentUrl(event.target.value)}
                      borderRadius={15}
                    />
                  </Box>
                  <Box mt={4}>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon width={16} height={16} />}
                        borderRadius={15}
                      >
                        Select a Game:
                      </MenuButton>
                      <MenuList>
                        <MenuOptionGroup
                          defaultValue="csg"
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
                  </Box>
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
                  <Flex direction={'row'}>
                    <Center>
                      <Box mt={6} maxW={'400px'}>
                        <Text>
                          By submitting, you are agreeing to the&nbsp;
                          <chakra.span
                            fontWeight={'bold'}
                            textDecoration={'underline'}
                          >
                            Terms of Service
                          </chakra.span>
                          &nbsp;and the&nbsp;
                          <chakra.span
                            fontWeight={'bold'}
                            textDecoration={'underline'}
                          >
                            Privacy Policy
                          </chakra.span>
                          .
                        </Text>
                      </Box>
                      <Button
                        ml={4}
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
                          <Flex direction={'row'} alignItems={'center'}>
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
                    </Center>
                  </Flex>
                </Flex>
              </Box>
            </Container>
          </Flex>
        </Center>
      )}
    </div>
  );
};

export default Upload;

Upload.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
