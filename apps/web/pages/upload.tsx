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
    Image as CIMG,
    Checkbox,
    chakra,
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

  let options = [
    { option: "Do you have permission from the owner to submit?"},
    { option: "Does this video contain the confirmed game footage?"},
    { option: "Do you understand that any violations will result in a ban?"},
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
          <Box my={6} mx={6}>
          <Flex direction={'row'}>
            <CIMG src={userSession?.user.avatarUrl} alt={"img"} borderRadius={40} width={20} height={20}/>
            <Center>
            <Box ml={3}>
              <Text  fontWeight={'bold'} fontSize={'2xl'}>{userSession?.user.name}</Text>
              <Text>Logged in from {userSession?.user.provider}</Text>
            </Box>
            </Center>
            </Flex>
            <Flex direction={'column'} mt={6}>
            <Box>
              <Text mb={2}>Youtube URL</Text>
              <Input placeholder='https://youtube.com/example' size='lg' borderRadius={15} w={'50vh'}/>
            </Box>
            <Box mt={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon width={16} height={16} />} borderRadius={15}>
                Select a Game
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
            </Box>
            <Box mt={6}>
              {options.map(option => (
                <Flex direction={'column'}>
                <Checkbox size='md' colorScheme='purple' required={true} mb={3}>
                {option.option}
              </Checkbox>
              </Flex>

              ))}
            </Box>
            <Flex direction={'row'}>
            <Center>
              <Box mt={6}>
                <Text>By submitting, you are agreeing to the 
                  <chakra.span 
                  fontWeight={'bold'} 
                  textDecoration={'underline'}
                  >
                    Terms of Service
                  </chakra.span>
                  <br/>
                   and the&nbsp;
                   <chakra.span
                   fontWeight={'bold'} 
                   textDecoration={'underline'}
                   >
                    Privacy Policy.
                   </chakra.span>
                </Text>
            </Box>
            <Button ml={4} backgroundColor={'gray.800'} colorScheme={'blackAlpha'} boxShadow='lg' mt={5}>Submit</Button>

            </Center>
            </Flex>
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