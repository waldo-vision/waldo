import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import Layout from '@components/Layout';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { FaCodeBranch, FaRocket } from 'react-icons/fa';
import { HiUpload } from 'react-icons/hi';
import { MdAllInclusive, MdInfoOutline, MdMoneyOff } from 'react-icons/md';
import { TbEyeCheck } from 'react-icons/tb';
import DashboardImage from '../public/Dashboard.png';
import InScansImage from '../public/InScans.png';
import ScansImage from '../public/Scans.png';
import { discord, githubrepo } from '@utils/links';
import useSite from '@site';

export default function Home() {
  const helpRef = useRef<null | HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const { session, services } = useSite();
  const updateScrollPosition = () => {
    setY(window.scrollY);
  };

  useEffect(() => {
    updateScrollPosition();
    window.addEventListener('scroll', updateScrollPosition);
  }, []);
  return (
    <>
      <Head>
        <title>
          WALDO | Open-source visual cheat detection, powered by A.I
        </title>
        <meta
          name="description"
          content="WALDO is an Open-source visual cheat detection, powered by A.I"
        />
      </Head>

      <Flex direction={'column'} mb={150}>
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
              left: `${-141.82 - y}px`,
              top: `${380 - y / 2}px`,
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
        <Container
          maxW={'7xl'}
          minH={'100vh'}
          pt={{ base: 0, md: '120px', lg: 0 }}
          pb={10}
        >
          <Center minH={'100vh'}>
            <Flex
              direction={'column'}
              textAlign={'center'}
              alignItems={'center'}
              gap={3}
            >
              <Heading fontSize={'57px'} py={2} textAlign={'center'}>
                WALDO
              </Heading>
              <Text fontSize={'27px'} textAlign={'center'}>
                <b>Open-source </b>
                <span>visual cheat detection, </span>
                <b>powered by A.I</b>
              </Text>

              <Text fontSize={'l'} fontWeight={'thin'}>
                Currently in construction
              </Text>
              <Flex direction={{ base: 'column', md: 'row' }} gap={5}>
                <Link href={'/submissions'}>
                  <Button variant={'solid'} colorScheme={'purple'}>
                    <HiUpload height={16} width={16} />
                    <Text marginLeft={2}>Submissions</Text>
                  </Button>
                </Link>
                <Button
                  variant={'outline'}
                  colorScheme={'purple'}
                  leftIcon={<MdInfoOutline />}
                  onClick={() =>
                    helpRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }
                >
                  Learn More
                </Button>
              </Flex>
            </Flex>
          </Center>
        </Container>
        <Features />
        <Container paddingTop={{ base: 20, md: 28 }} maxW={'7xl'} ref={helpRef}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            paddingBottom={{ base: 20, md: 28 }}
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
                  What is
                </Text>
                <br />
                <Text as={'span'} color={'purple.400'}>
                  WALDO?
                </Text>
              </Heading>
              <Flex direction={'column'} gap={3}>
                <Text>
                  WALDO Vision is a machine learning system that will analyze
                  FPS gameplay clips, and return a probability that the player
                  is using aimbot cheats.
                </Text>
                <Text>
                  <b>How?</b> WALDO Vision will train on hundreds of hours of
                  gameplay to learn what characteristics distinguish human aim
                  from computer aim
                </Text>
              </Flex>
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
        <Container maxW={'7xl'}>
          <Flex
            direction={'column'}
            textAlign={'left'}
            alignItems={'center'}
            gap={'5px'}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
            >
              <Text>WALDO needs your help!</Text>
            </Heading>
            <Text maxW={'4xl'}>
              The WALDO system isn&apos;t ready for showtime yet. In order to
              get good results, our machine learning model needs to train on
              hundreds of hours of gameplay videos.{' '}
              <b>This is where you come in. </b> Help train WALDO by submitting
              links to your gameplay videos, or by reviewing clips that others
              have submitted for relevance.
              <br />
              <br />
              <br />
            </Text>
            <Heading fontWeight={600} fontSize={'lg'}>
              Want to help build WALDO?
            </Heading>
            <Text maxW={'4xl'}>
              We need volunteers with a wide variety of skill-sets: Machine
              Learning / Computer Vision, DevOps & Infrastructure, Web Design,
              Programming, Testing, Data Collection, and more. Join our to start
              helping us make WALDO Vision a reality.
            </Text>
            <Flex direction={{ base: 'column', md: 'row' }} gap={'4'} my={5}>
              <Link href={'/submissions/upload'}>
                <Button variant={'solid'} colorScheme={'purple'}>
                  <HiUpload height={16} width={16} />
                  <Text marginLeft={2}>Upload your footage</Text>
                </Button>
              </Link>
              <Link href={'/submissions/review'}>
                <Button variant={'outline'} colorScheme={'purple'}>
                  <TbEyeCheck height={16} width={16} />
                  <Text marginLeft={2}>Review Submissions</Text>
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Container>
        <Box
          width={'100%'}
          position={'absolute'}
          left={0}
          top={'60px'}
          zIndex={5}
        >
          {/* imp trpc query to retrieve data from waldosite if maintenance mode is enabled */}
          {session?.user?.blacklisted ? (
            <Alert status={'warning'}>
              <AlertIcon />
              <Box>
                <AlertTitle>Your account has been suspended</AlertTitle>
                <AlertDescription>
                  Certain features will no longer be available.
                </AlertDescription>
              </Box>
            </Alert>
          ) : services.site?.maintenance ||
            services.upload?.maintenance ||
            services.account?.maintenance ||
            services.review?.maintenance ? (
            <Alert status={'error'}>
              <AlertIcon />
              <Box>
                <AlertTitle fontSize={'lg'} mb={1}>
                  Platform Outage
                </AlertTitle>
                <AlertDescription>
                  <Flex direction={'column'}>
                    <Box>
                      {services.upload?.maintenance && (
                        <Flex gap={3}>
                          <Text>
                            <b>Upload Service</b>
                          </Text>
                          <Text>
                            <i>Reason:</i> {services.upload.alertTitle}
                          </Text>
                        </Flex>
                      )}
                    </Box>
                    <Box>
                      {services.account?.maintenance && (
                        <Flex gap={3}>
                          <Text>
                            <b>Account and Authentication Services</b>
                          </Text>
                          <Text>
                            <i>Reason:</i> {services.account.alertTitle}
                          </Text>
                        </Flex>
                      )}
                    </Box>
                    <Box>
                      {services.review?.maintenance && (
                        <Flex gap={3}>
                          <Text>
                            <b>Review Service</b>
                          </Text>
                          <Text>
                            <i>Reason:</i> {services.review.alertTitle}
                          </Text>
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </AlertDescription>
              </Box>
            </Alert>
          ) : (
            <></>
          )}
        </Box>
      </Flex>
    </>
  );
}

interface FeatureProps {
  title: string;
  text: ReactElement;
  image?: ReactElement;
}

const Feature = ({ title, text, image }: FeatureProps) => {
  return (
    <Center h={'100%'}>
      <Flex align={'center'} direction={'column'} gap={2}>
        {image}
        <Text fontWeight={600}>{title}</Text>
        {text}
      </Flex>
    </Center>
  );
};

const Features = () => {
  return (
    <Container maxW={'7xl'} textAlign={'center'}>
      <Grid
        height={'100%'}
        templateRows={{ sm: 'repeat(6, 1fr)', md: 'repeat(5, 1fr)' }}
        templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(7, 1fr)' }}
        gap={4}
      >
        <GridItem
          rowSpan={{ sm: 2, md: 5 }}
          colSpan={{ sm: 1, md: 3 }}
          bg={'#8552D910'}
          overflow={'hidden'}
          p={3}
          textAlign={'center'}
          borderRadius={'16px'}
        >
          <Center h={'100%'}>
            <Flex
              align={'center'}
              direction={'column'}
              gap={{ md: 20, sm: 20 }}
            >
              <Flex direction={'column'}>
                <Text fontSize={'2rem'} fontWeight={'bold'}>
                  WALDO
                </Text>
                <Text fontWeight={450}>
                  Bring back the fun in your games with WALDO.
                </Text>
              </Flex>
              <Link href={discord}>
                <Button variant={'solid'} colorScheme={'purple'}>
                  Join the Discord
                </Button>
              </Link>
            </Flex>
          </Center>
        </GridItem>

        <GridItem
          rowSpan={{ sm: 1, md: 2 }}
          colSpan={{ sm: 1, md: 2 }}
          bg="white"
          borderRadius={'16px'}
          p={3}
        >
          <Feature
            image={<FaCodeBranch size={35} />}
            title={'Open Source'}
            text={
              <Text>
                View WALDO source code on our{' '}
                <Link href={githubrepo}>
                  <Text as={'span'} fontWeight={'bold'}>
                    github
                  </Text>
                </Link>
                .
              </Text>
            }
          />
        </GridItem>
        <GridItem
          rowSpan={{ sm: 1, md: 3 }}
          colSpan={{ sm: 1, md: 2 }}
          bg="white"
          borderRadius={'16px'}
          p={3}
        >
          <Feature
            image={<MdAllInclusive size={45} />}
            title={'Community'}
            text={
              <Text>
                We have a passionate{' '}
                <Link href={discord}>
                  <Text as={'span'} fontWeight={'bold'}>
                    community
                  </Text>
                </Link>{' '}
                of developers and contributors making WALDO Vision a reality.
              </Text>
            }
          />
        </GridItem>
        <GridItem
          rowSpan={{ sm: 1, md: 3 }}
          colSpan={{ sm: 1, md: 2 }}
          bg="white"
          borderRadius={'16px'}
          p={3}
        >
          <Feature
            image={<MdMoneyOff size={60} />}
            title={'Free'}
            text={
              <Text>
                WALDO Vision is community supported, and will be a free service
                at launch
              </Text>
            }
          />
        </GridItem>
        <GridItem
          rowSpan={{ sm: 1, md: 2 }}
          colSpan={{ sm: 1, md: 2 }}
          bg="white"
          borderRadius={'16px'}
          p={3}
        >
          <Feature
            image={<FaRocket size={35} />}
            title={'Growing'}
            text={
              <Text>
                We're starting small, and will only support a few games at
                launch. As we develop WALDO Vision, we hope to add support for a
                lot more games.
              </Text>
            }
          />
        </GridItem>
      </Grid>
    </Container>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
