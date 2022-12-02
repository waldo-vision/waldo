import Layout from '@components/Layout';
import { handleUploadFileLogic, checkURL } from '@utils/helpers/apiHelper';
import { ReactElement, useEffect, useState } from 'react';
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
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router'
import Loading from '@components/Loading';

export default function Upload() {
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true)
  const [requestDone, setRequestDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<string>('csg');

  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [userSession, setUserSession] = useState<Session | undefined>();
  const toast = useToast();
  const router = useRouter()
  let games = [
    { name: "Counter Strike: Global Offensive", shortName: "csg" },
    { name: "VALORANT", shortName: "val" },
    { name: "Team Fortress 2", shortName: "tf2" },
    { name: "Apex Legends", shortName: "ape" },
  ]

  let options = [
    { option: "Do you have permission from the owner to submit?", checked: false },
    { option: "Does this video contain the confirmed game footage?", checked: false },
    { option: "Do you understand that any violations will result in a ban?", checked: false },
  ]

  const getCurrentSession = async () => {
    await getSession()
      .then((session) => {
        if (session === null) {
          router.push('/auth/login')
        } else {
          setUserSession(session);
          setLoading(false)
        }
      })
  };

  const createToast = (msg: string, type: any, title: string) => {
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
        userSession.user.id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        selectedGame.toUpperCase(),
      ).then(async res => {
        if (res.error) {
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
        {loading ?
          <Box>
            <Loading color={"blue.500"} />
          </Box>
          :
          <Center h={'100vh'} maxW={'7xl'}>
            <Flex direction={{ lg: 'row', base: 'column' }}>
              <Container width={{ lg: '30%' }}>
                <Flex gap={5} direction={'column'}>
                  <Heading>
                    Sumbit Your Clips
                  </Heading>
                  <Text>
                    Before you submit a video make sure you have read the rules regarding
                  </Text>
                </Flex>
              </Container>
              <Container>
                <Box py={6} px={6} bg={'white'} borderRadius={'16px'} maxW={{ sm: '450px', lg: '700px' }}>
                  <Flex direction={'row'}>
                    <CIMG src={userSession?.user.avatarUrl} alt={"img"} borderRadius={40} width={20} height={20} />
                    <Center>
                      <Box ml={3}>
                        <Text fontWeight={'bold'} fontSize={'2xl'} onClick={() => signOut()}>{userSession?.user.name}</Text>
                        <Flex direction={'row'}>
                          <Text>Logged in from {userSession?.user.provider}
                          </Text>
                          <Box mt={'1.5'} ml={1}>
                            <ShieldCheckIcon height={14} width={14} color={'black'} />
                          </Box>
                        </Flex>
                      </Box>
                    </Center>
                  </Flex>
                  <Flex direction={'column'} mt={6}>
                    <Box>
                      <Text mb={2}>Youtube URL</Text>
                      <Input placeholder={'https://youtube.com/example'} size={'lg'} onChange={event => setCurrentUrl(event.target.value)} borderRadius={15} />
                    </Box>
                    <Box mt={4}>
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon width={16} height={16} />} borderRadius={15}>
                          Select a Game:
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
                      {options.map((option, index) => (
                        <Box key={index}>
                          <Flex direction={'column'}>
                            <Checkbox size='md' colorScheme='purple' required={true} mb={3} onChange={event => options[index].checked = event.target.checked} checked={option.checked}>
                              {option.option}
                            </Checkbox>
                          </Flex>
                        </Box>
                      ))}
                    </Box>
                    <Flex direction={'row'}>
                      <Center>
                        <Box mt={6} maxW={'400px'}>
                          <Text>By submitting, you are agreeing to the&nbsp;
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
                            </chakra.span>.
                          </Text>
                        </Box>
                        <Button
                          ml={4}
                          width={'100px'}
                          backgroundColor={'gray.800'}
                          colorScheme={'blackAlpha'}
                          boxShadow='lg' mt={5}
                          onClick={() => handleClipUpload()}
                          isLoading={waitingForResponse}
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

                      </Center>
                    </Flex>
                  </Flex>
                </Box>
              </Container>
            </Flex>
          </Center>
        }
      </Center>
    </div>
  )
}

Upload.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
