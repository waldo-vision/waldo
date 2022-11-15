import { ReactElement, useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Layout from '@components/Layout';
import { ArrowUpTrayIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
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
} from '@chakra-ui/react';
import Link from 'next/link';
import { GlobalContext } from '@context/GlobalContext';

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const gc = useContext(GlobalContext);
  const [y, setY] = useState(0);

  const changeBackground = () => {
    setY(window.scrollY);
  };

  useEffect(() => {
    changeBackground();
    // adding the event when scroll change background
    window.addEventListener('scroll', changeBackground);
  });
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
        onClose={() => setIsOpen(false)}
        isCentered
        size={'xl'}
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Clip Submission</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Youtube URL</FormLabel>
              <Input placeholder="https://youtube.com/watch?v=..." />
              <FormHelperText>
                You must be connected to a discord account to submit a clip.
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
            >
              Discord
            </Button>
            <Button
              colorScheme={gc.user.auth.discord.connected ? 'purple' : 'red'}
              disabled={!gc.user.auth.discord.connected ? true : false}
            >
              Submit
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
