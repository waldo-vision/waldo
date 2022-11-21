/* eslint-disable arrow-parens */
import { ReactElement, useEffect, useState, useRef } from 'react';
import { handleUploadFileLogic, checkURL } from '@utils/helpers/apiHelper';
import { signIn, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Button,
  ButtonGroup,
  Center,
  Heading,
  Text,
  Flex,
  Container,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormHelperText,
  useToast,
  Box,
  SlideFade,
  PopoverTrigger,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
} from '@chakra-ui/react';
import {
  ArrowUpTrayIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Layout from '@components/Layout';
import Link from 'next/link';
import Head from 'next/head';

import DashboardImage from '../public/Dashboard.png';
import InScansImage from '../public/InScans.png';
import ScansImage from '../public/Scans.png';
import { Session } from 'next-auth';

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>();
  const [requestDone, setRequestDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<string>('csg');
  const ref = useRef<null | HTMLDivElement>(null);

  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [userSession, setUserSession] = useState<Session | undefined>();
  const [y, setY] = useState(0);
  const router = useRouter();
  const toast = useToast();
  let games = [
    { name: "Counter Strike: Global Offensive", shortName: "csg"},
    { name: "VALORANT", shortName: "val"},
    { name: "Team Fortress 2", shortName: "tf2"},
    { name: "Apex Legends", shortName: "ape"},
  ]
  const updateScrollPosition = () => {
    setY(window.scrollY);
  };

  const getCurrentSession = async () => {
    const session = await getSession();
    if (session === null) {
      setUserSession(undefined);
    } else {
      setUserSession(session);
    }
  };

  const handleSignout = () => {
    signOut();
    router.push('/');
  };

  const createToast = (msg: string, type: any, title: string) => {
    toast({
      position: 'bottom-right',
      title: title,
      description: msg,
      status: type,
      duration: 9000,
      isClosable: true,
    });
  };

  const delay = () => {
    return new Promise(resolve => setTimeout(resolve, 4000));
  };

  const handleRequestError = async (msg: string) => {
    setWaitingForResponse(false);
    setRequestDone(true);
    // Create toasts
    createToast(msg, 'error', 'Error');
    // Enable Error
    setError(true);
    await delay();

    // End handle
    setError(false);
    setRequestDone(false);
  };

  const handleRequestSuccess = async () => {
    setWaitingForResponse(false);
    setRequestDone(true);
    setError(false);

    await delay();

    setIsOpen(false);
    setSelectedGame('csg')
    setCurrentUrl('');
    setRequestDone(false);
    createToast(
      "Successfully uploaded your footage to waldo's server!",
      'success',
      'Sucess!',
    );
  };

  const handleClipUpload = async () => {
    if (requestDone) {
      setIsOpen(false);
      setSelectedGame('csg')
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

    if (userSession !== undefined) {
      await handleUploadFileLogic(
        currentUrl,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userSession.user.id.toString(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        selectedGame,
      ).then(async res => {
        if (res.error || !res.isInGuild) {
          handleRequestError(res.message);
        } else {
          handleRequestSuccess();
        }
      });
    }
  };

  useEffect(() => {
    updateScrollPosition();
    // adding the event when scroll change background
    window.addEventListener('scroll', updateScrollPosition);
    getCurrentSession();
  }, []);
  return (
    <>
      <Head>
        <title>
          Waldo | Open-source visual cheat detection, powered by A.I
        </title>
        <meta
          name="description"
          content="Waldo is an Open-source visual cheat detection, powered by A.I"
        />
      </Head>
      <div>
        <Container display={{ base: 'none', lg: 'fixed' }}>
          <Image
            style={{
              position: 'fixed',
              zIndex: -10,
              borderRadius: '16px',
              left: `${y + 1160.18}px`,
              top: `${y / 2 + 88}px`,
              boxShadow: '0px 0px 32px 5px rgba(0, 0, 0, 0.25)',
              transform: 'rotate(25deg)',
            }}
            src={DashboardImage}
            alt={'Dashboard homepage'}
            width={720}
            height={450}
            priority
            // quality={1}
            placeholder={'blur'}
          />
          <Image
            style={{
              position: 'fixed',
              zIndex: -10,
              borderRadius: '16px',
              left: `${-221.82 - y}px`,
              top: `${210 - y / 2}px`,
              boxShadow: '0px 0px 32px 5px rgba(0, 0, 0, 0.25)',
              transform: 'rotate(25deg)',
            }}
            src={InScansImage}
            alt={'Dashboard in scans page'}
            width={720}
            height={450}
            priority
            // quality={1}
            placeholder={'blur'}
          />
        </Container>
        <Center h={'100vh'}>
          <Flex
            direction={'column'}
            textAlign={'center'}
            alignItems={'center'}
            gap={'5px'}
          >
            <Heading fontSize={'57px'} py={2} textAlign={'center'}>
              Waldo
            </Heading>
            <Flex>
              <Text fontSize={'27px'} textAlign={'center'}>
                <b>Open-source </b>
                <span>visual cheat detection, </span>
                <b>powered by A.I</b>
              </Text>
            </Flex>
            <Text fontSize={'l'} fontWeight={'thin'}>
              Currently in construction
            </Text>
            <ButtonGroup gap={'4'} m={3}>
              <Button
                variant={'solid'}
                colorScheme={'purple'}
                onClick={() => setIsOpen(!isOpen)}
              >
                <ArrowUpTrayIcon height={16} width={16} />
                <Text marginLeft={2}>Clip Submission</Text>
              </Button>
              <Button
                variant={'outline'}
                colorScheme={'purple'}
                onClick={() =>
                  ref.current?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <Text marginRight={2}>Learn More</Text>
                <ArrowRightIcon height={16} width={16} />
              </Button>
            </ButtonGroup>
          </Flex>
        </Center>
        <Container maxW={'7xl'}>
          <Stack
            ref={ref}
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text
                  as={'span'}
                  position={'relative'}
                  _after={{
                    content: "''",
                    width: 'full',
                    height: '30%',
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: 'purple.400',
                    zIndex: -1,
                  }}
                >
                  Waldo,
                </Text>
                <br />
                <Text as={'span'} color={'purple.400'}>
                  needs your help!
                </Text>
              </Heading>
              <Text>
                Waldo requires hundreds of hours of footage. We are in the
                stages of training the AI and you can help now by uploading your
                gaming clips!
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  variant={'solid'}
                  colorScheme={'purple'}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <ArrowUpTrayIcon height={16} width={16} />
                  <Text marginLeft={2}>Clip Submission</Text>
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
            >
              <Image
                alt={'Dashboard scans page'}
                width={1000}
                height={600}
                style={{
                  borderRadius: '16px',
                  boxShadow: '0px 0px 32px 5px rgba(0, 0, 0, 0.25)',
                }}
                src={ScansImage}
                placeholder={'blur'}
              />
            </Flex>
          </Stack>
        </Container>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setRequestDone(false);
            setCurrentUrl('');
            setError(false);
          }}
          isCentered
          size={'xl'}
        >
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader>
              <Text>Clip Submission</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Youtube URL</FormLabel>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  onChange={event => setCurrentUrl(event.target.value)}
                />
                <FormHelperText>
                  <Flex direction={'column'} gap={1}>
                    {userSession !== undefined ? (
                      <Flex alignItems={'center'}>
                        <Text>You are securely connected to a&nbsp;</Text>
                        <Popover>
                          <PopoverTrigger>
                            <Text
                              as={'span'}
                              fontWeight={'bold'}
                              cursor={'pointer'}
                            >
                              discord account!
                            </Text>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>
                              <Flex
                                justify={'center'}
                                align={'center'}
                                gap={2}
                                p={2}
                              >
                                <Image
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  src={userSession.user.avatarUrl}
                                  alt="Avatar"
                                  width={85}
                                  height={85}
                                  style={{ borderRadius: 5 }}
                                />
                              </Flex>
                              <PopoverFooter gap={2}>
                                <Flex align={'center'} justify={'center'}>
                                  <Text fontSize={15}>
                                    Thank you for joining us,{' '}
                                    <Text as={'span'} fontWeight={'bold'}>
                                      {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore */}
                                      {userSession.user.name}
                                    </Text>
                                    !
                                  </Text>
                                </Flex>
                              </PopoverFooter>
                            </PopoverHeader>
                          </PopoverContent>
                        </Popover>

                        <Box paddingLeft={1}>
                          <ShieldCheckIcon
                            width={14}
                            height={14}
                            color={'black'}
                          />
                        </Box>
                      </Flex>
                    ) : (
                      'You must be connected to a discord account to submit a clip.'
                    )}
                  </Flex>
                  <Flex mt={5}>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Choose a game:
                      </MenuButton>
                      <MenuList>
                        <MenuOptionGroup
                          defaultValue="csg"
                          title="Games"
                          type="radio"
                          onChange={game => setSelectedGame(game.toString())}
                        >
                          {games && games.map(game => (
                          <MenuItemOption key={game.shortName} value={game.shortName}>
                            {game.name}
                          </MenuItemOption>
                          ))}
                        </MenuOptionGroup>
                      </MenuList>
                    </Menu>
                  </Flex>
                </FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter gap={5}>
              <Text>
                By submitting you agree to the{' '}
                <Link href={'/tos'} passHref target={'_blank'}>
                  <Text
                    as={'span'}
                    fontWeight={'bold'}
                    textDecorationLine={'underline'}
                  >
                    Terms of Service.
                  </Text>
                </Link>
              </Text>
              <Button
                colorScheme={userSession !== undefined ? 'red' : 'purple'}
                onClick={() => {
                  userSession !== undefined
                    ? handleSignout()
                    : signIn('discord');
                }}
                width={'81px'}
              >
                {userSession !== undefined ? 'Log out' : 'Log in'}
              </Button>
              <Button
                colorScheme={userSession !== undefined ? 'purple' : 'gray'}
                disabled={!(userSession !== undefined) ? true : false}
                onClick={() => handleClipUpload()}
                isLoading={waitingForResponse}
                width={'81px'}
              >
                {!requestDone ? (
                  <SlideFade in={!requestDone} offsetY="5px">
                    <Text>Submit</Text>
                  </SlideFade>
                ) : (
                  <Flex direction={'row'} alignItems={'center'}>
                    <SlideFade in={requestDone} offsetY="5px" delay={0.3}>
                      {error ? (
                        <XCircleIcon color="white" width={26} height={26} />
                      ) : (
                        <CheckCircleIcon color="white" width={26} height={26} />
                      )}
                    </SlideFade>
                  </Flex>
                )}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
