import Layout from '@components/Layout';
import React from 'react'
import { handleUploadFileLogic, checkURL } from '@utils/helpers/apiHelper';
import { ReactElement, useEffect, useState } from 'react';
import {
    Button,
    Center,
    Text,
    Flex,
    FormControl,
    FormLabel,
    Input,
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
    ShieldCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDownIcon,
  } from '@heroicons/react/24/outline';
  import Image from 'next/image';
  import Link from 'next/link';
import { Session } from 'next-auth';
import { getSession, signOut, signIn } from 'next-auth/react';
const Upload = () => {
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>();
  const [requestDone, setRequestDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<string>('csg');

  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [userSession, setUserSession] = useState<Session | undefined>();
  const toast = useToast();
  let games = [
    { name: "Counter Strike: Global Offensive", shortName: "csg" },
    { name: "VALORANT", shortName: "val" },
    { name: "Team Fortress 2", shortName: "tf2" },
    { name: "Apex Legends", shortName: "ape" },
  ]

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
    getCurrentSession();
  }, []);
  return (
    <div>
        <Center h={'100vh'}>
        <Flex
          direction={'column'}
          backgroundColor={'white'}
          borderRadius={8}
          borderColor={'white'}
          borderWidth={1}
        
        >
          <Box
        my={6}
        mx={6}
          >
            <Box>
              <Text 
              fontWeight={'semibold'} 
              fontSize={'2xl'} 
              mb={5}
              >Clip Submission</Text>
            </Box>
            <Box />
            <Box pb={6}>
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
                        <Text>You are securely logged into a&nbsp;</Text>
                        <Popover>
                          <PopoverTrigger>
                            <Text
                              as={'span'}
                              fontWeight={'bold'}
                              cursor={'pointer'}
                            >
                              {userSession && userSession.user.provider} account!
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
                      'You must be logged into an account to submit a clip.'
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
            </Box>
            <Flex 
            gap={5}
            direction={'row'}
            alignItems={'center'}
            >
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
            </Flex>
          </Box>
        </Flex>
        </Center>
    </div>
  )
}

export default Upload

Upload.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };