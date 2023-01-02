import { Container, Center, Flex, Heading, Text, Box } from '@chakra-ui/react';
import { ReactElement, useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { VscOpenPreview } from 'react-icons/vsc';
import Layout from '@components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
export default function Index() {
  const [, setUserSession] = useState<Session | null>();

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
        <title>WALDO | Submissions </title>
        <meta
          name="description"
          content="Submit your gameplay to the WALDO AI. Check out our discord for more information "
        />
      </Head>
      <Container
        maxW={'7xl'}
        minH={'100vh'}
        pt={{ base: '60px', md: '120px', lg: 0 }}
        pb={10}
      >
        <Center minH={'100vh'}>
          <Flex
            direction={'column'}
            textAlign={'center'}
            alignItems={'center'}
            gap={8}
          >
            <Box>
              <Flex direction={'column'} textAlign={'left'} gap={4}>
                <Heading
                  textAlign={'left'}
                  fontWeight={600}
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                >
                  <Text>
                    <b>Upload</b> or <b>Review</b> community gameplay.
                  </Text>
                </Heading>
                <Text maxW={'4xl'} fontSize={{ base: 13, md: 16, lg: 16 }}>
                  Help us curate a dataset to train WALDO on. Submit links to
                  first-person shooter gameplay videos and clips on YouTube, or
                  review others&apos; submissions to ensure they&apos;re
                  labelled properly.
                </Text>
              </Flex>
            </Box>
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              width={'100%'}
              gap={4}
            >
              <Box
                width={'100%'}
                height={'45vh'}
                bg={'white'}
                borderRadius={'16px'}
              >
                <Link href={'/submissions/upload'}>
                  <Center h={'100%'} w={'full'} flexDirection={'column'}>
                    <AiOutlineCloudUpload size={150} />
                    <Text fontSize={'2xl'}>Submit Gameplay</Text>
                  </Center>
                </Link>
              </Box>
              <Box
                width={'100%'}
                height={'45vh'}
                bg={'white'}
                borderRadius={'16px'}
              >
                <Link href={'/submissions/review'}>
                  <Center h={'100%'} w={'full'} flexDirection={'column'}>
                    <VscOpenPreview size={150} />
                    <Text fontSize={'2xl'}>Review Gameplay</Text>
                  </Center>
                </Link>
              </Box>
            </Flex>
            <Text>Please make sure you have read and understood the TOS.</Text>
          </Flex>
        </Center>
      </Container>
    </>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
