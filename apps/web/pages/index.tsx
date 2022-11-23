/* eslint-disable arrow-parens */
import { ReactElement, useEffect, useState, useRef } from 'react';
import {
  Button,
  ButtonGroup,
  Center,
  Heading,
  Text,
  Flex,
  Container,
  Stack,
} from '@chakra-ui/react';
import {
  ArrowUpTrayIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Layout from '@components/Layout';
import Head from 'next/head';

import DashboardImage from '../public/Dashboard.png';
import InScansImage from '../public/InScans.png';
import ScansImage from '../public/Scans.png';

export default function Home() {
  const ref = useRef<null | HTMLDivElement>(null);

  const [y, setY] = useState(0);
 
  const updateScrollPosition = () => {
    setY(window.scrollY);
  };

  useEffect(() => {
    updateScrollPosition();
    // adding the event when scroll change background
    window.addEventListener('scroll', updateScrollPosition);
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
                onClick={() => {}}
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
                  onClick={() => {}}
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
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
