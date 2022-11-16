import { ReactElement, useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Layout from '@components/Layout';
import {handleUploadFileLogic} from "../utils/helpers/apiHelper"
import { ArrowUpTrayIcon, ArrowRightIcon, ShieldCheckIcon, CheckCircleIcon, UserCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
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
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
  Image as CImg,
} from '@chakra-ui/react';

import Link from 'next/link';
import { signIn, getSession, signOut } from "next-auth/react"
import { GlobalContext } from '@context/GlobalContext';
import { useRouter } from "next/router"
export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const gc = useContext(GlobalContext)
  const [sessionExists, setSessionExists] = useState<boolean>(false);
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>()
  const [requestDone, setRequestDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [userSession, setUserSession] = useState<any>();
  const [currentUrl, setCurrentUrl] = useState<String>();
  const [y, setY] = useState(0);
  const router = useRouter()
  const toast = useToast()

  const changeBackground = () => {
    setY(window.scrollY);
  };
  const getCurrentSession = async () => {
    const session = await getSession();
    if (session == null) {
      setSessionExists(false)
    } else {
      setSessionExists(true)
      setUserSession(session)
    }
  }

  const handleSignout = () => {
    signOut(userSession);
    router.push('/')
  }

  const createToast = (msg: string, type: any, title: string) => {
    toast({
      position: "bottom-right",
      title: title,
      description: msg,
      status: type,
      duration: 9000,
      isClosable: true,
    })
  }
  const delay = () => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
  const handleClipUpload = async () => {
    if (requestDone) {
      setIsOpen(false)
      setCurrentUrl("")
      setRequestDone(false)
      setError(false)
      return;
    }
    setWaitingForResponse(true)
    console.log(userSession)
    await handleUploadFileLogic(currentUrl, userSession.user.id.toString(), userSession.user.access_token).then(async res => {
      if (res.error || !res.isInGuild) {
        setWaitingForResponse(false)
        
        createToast(res.message, "error", "Error")
        setRequestDone(true)
        setError(true);
        await delay()
        setError(false)
        setRequestDone(false)
      } else {
        setWaitingForResponse(false)
        const msg = "Successfully uploaded your footage to waldo's server!"
        setRequestDone(true)
        setError(false)
        await delay()
        setIsOpen(false)
        setCurrentUrl("")
        setRequestDone(false)
        createToast(msg, "success", "Sucess!")

      }
    })
  }

  useEffect(() => {
    changeBackground();
    // adding the event when scroll change background
    window.addEventListener('scroll', changeBackground);
    getCurrentSession()
  }, []);
  return (
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
          src={'/Dashboard.png'}
          alt={'Dashboard'}
          width={720}
          height={450}
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
          src={'/InScans.png'}
          priority={true}
          alt={'Dashboard'}
          width={720}
          height={450}
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
            <Link href={'#About'}>
              <Button variant={'outline'} colorScheme={'purple'}>
                <Text marginRight={2}>Learn More</Text>
                <ArrowRightIcon height={16} width={16} />
              </Button>
            </Link>
          </ButtonGroup>
        </Flex>
      </Center>
      <Container maxW={'7xl'}>
        <Stack
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
              id={'About'}
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
              Waldo requires hundreds of hours of footage. We are in the stages
              of training the AI and you can help now by uploading your gaming
              clips!
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
              alt={'Hero Image'}
              width={1000}
              height={600}
              style={{
                borderRadius: '16px',
                boxShadow: '0px 0px 32px 5px rgba(0, 0, 0, 0.25)',
              }}
              src={'/Scans.png'}
            />
          </Flex>
        </Stack>
      </Container>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setRequestDone(false);
          setCurrentUrl("");
          setError(false)
        }}
        isCentered
        size={'xl'}
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent >
          <ModalHeader>
          <Flex alignItems={'center'}>
          <Menu>
            <Box as={MenuButton} backgroundColor={'gray.300'} padding={1} borderRadius={8} >

            { userSession ?
            <CImg
              src={userSession.user.avatarUrl}
              alt="Avatar"
              width={30}
              height={30}
              borderRadius={12}
            />
            :
            <UserCircleIcon
              width={35} 
              height={35} 
              color="black" 
            />
            }
            </Box>

            <MenuList>
              { userSession ? 
              <MenuItem onClick={() => signOut(userSession)}>Log out</MenuItem>
              :
              <MenuItem onClick={() => signIn("discord")}>Log In</MenuItem>
              }
            </MenuList>
          </Menu>
         <Text marginLeft={3}> Clip Submission </Text>
         </Flex>

          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Youtube URL</FormLabel>
              <Input placeholder="https://youtube.com/watch?v=..." onChange={event => setCurrentUrl(event.target.value)}/>
              <FormHelperText>
                {sessionExists ? 
                <Flex direction={'row'} alignItems={'center'}>
                  <Text>
                Hi, {userSession.user.name}! You are securely connected to a discord account!
                </Text>
                <Box paddingLeft={1}>
                <ShieldCheckIcon width={14} height={14} color={'black'}/>
                </Box>
                </Flex>
                : "You must be connected to a discord account to submit a clip."}
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter gap={5}>
            <Text>
              By submitting you agree to the{' '}
              <Text
                as={'span'}
                fontWeight={'bold'}
                textDecorationLine={'underline'}
              >
                Terms of Service.
              </Text>
            </Text>
            <Button
              colorScheme={gc.user.auth.discord.connected ? 'green' : 'purple'}
              onClick={() => {
                sessionExists ?
                handleSignout()
                :
                signIn("discord")

              }}
            >
              {sessionExists ?  "Log out" : "Log in" }
            </Button>
            <Button
              colorScheme={sessionExists ? 'purple' : 'red'}
              disabled={!sessionExists ? true : false}
              onClick={() => handleClipUpload()}
              isLoading={waitingForResponse}
            >
              {!requestDone ? "Submit" : 
                <Flex direction={'row'} alignItems={'center'}>
              <SlideFade in={requestDone} offsetY='35px' delay={0.3}>
                { error ? 
                <XCircleIcon color="white" width={26} height={26} />
                :
              <CheckCircleIcon color='white' width={26} height={26} />
                }
              </SlideFade>
              </Flex> 
              }
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
