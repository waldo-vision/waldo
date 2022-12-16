import {
  Container,
  Center,
  Flex,
  Heading,
  Button,
  Text,
  Card,
  Box,
  Image,
  Stack,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import { ReactElement, useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
export default function index() {
  const [userSession, setUserSession] = useState<Session | null>();

  const getCurrentSession = async () => {
    const session = await getSession();
    setUserSession(session);
  };

  useEffect(() => {
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
          content="Submit your clips to the Waldo AI. Community submission reviewer will be available soon! Check out our discord for more information "
        />
      </Head>
      <Container maxW={'7xl'} minH={'100vh'}>
        <Center minH={'100vh'}>
          <Flex
            direction={'column'}
            textAlign={'center'}
            alignItems={'center'}
            gap={8}
          >
            <Box>
              <Flex
                direction={'column'}
                textAlign={'center'}
                alignItems={'center'}
                gap={4}
              >
                <Heading
                  fontWeight={600}
                  fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
                >
                  <Text>
                    <b>Upload</b> or <b>Review</b> community clips.
                  </Text>
                </Heading>
                <Text maxW={'4xl'}>
                  To aid Waldo's progress, we need the community to post and
                  submit their own gameplay video! We now accept a broad variety
                  of first-person shooter games which can be found on the upload
                  page. To help the project forward, we are seeking for manual
                  reviewers to ensure the game uploaded is under the right
                  title.
                </Text>
              </Flex>
            </Box>
            <Flex direction={'row'} width={'100%'} gap={4}>
              <Box
                width={'100%'}
                height={'45vh'}
                bg={'white'}
                borderRadius={'16px'}
              >
                <Link href={'/submissions/upload'}>
                  <Center h={'100%'}>Upload a video</Center>
                </Link>
              </Box>
              <Box
                width={'100%'}
                height={'45vh'}
                bg={'white'}
                borderRadius={'16px'}
              >
                <Link href={'/submissions/review'}>
                  <Center h={'100%'}>Review a video</Center>
                </Link>
              </Box>
            </Flex>
            <Text>You are logged in as {userSession?.user.name}</Text>
          </Flex>
        </Center>
      </Container>
    </>
  );
}
index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
