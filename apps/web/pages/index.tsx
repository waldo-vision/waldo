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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import Layout from '@components/Layout';
import DashboardImage from '../public/Dashboard.png';
import InScansImage from '../public/InScans.png';
import ScansImage from '../public/Scans.png';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { FaCodeBranch, FaRocket } from 'react-icons/fa';
import { MdAllInclusive, MdMoneyOff, MdInfoOutline } from 'react-icons/md';
import { HiUpload } from 'react-icons/hi';
import { TbEyeCheck } from 'react-icons/tb';

export default function Home() {
  const helpRef = useRef<null | HTMLDivElement>(null);
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
      <Flex direction={'column'} gap={25} mb={150}>
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
        <Container>
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
                    helpRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Learn More
                </Button>
              </ButtonGroup>
            </Flex>
          </Center>
        </Container>
        <Features />
        <Container maxW={'7xl'}>
          <Stack
            ref={helpRef}
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
                  What is
                </Text>
                <br />
                <Text as={'span'} color={'purple.400'}>
                  Waldo?
                </Text>
              </Heading>
              <Text>
                Waldo analyses POV clips and returns a probability that the user
                is cheating. How? Waldo is trained to detect the human
                behavioral characteristics of moving a mouse, of which the
                program contrasts the model to the footage.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Link href={'https://discord.gg/MPAV4qP8Hx'}>
                  <Button variant={'solid'} colorScheme={'purple'}>
                    Join the Discord
                  </Button>
                </Link>
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
        <Container maxW={'7xl'}>
          <Center>
            <Flex
              direction={'column'}
              textAlign={'center'}
              alignItems={'center'}
              gap={'5px'}
            >
              <Heading
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text>Waldo needs your help!</Text>
              </Heading>
              <Text maxW={'3xl'}>
                However, Waldo is not ready yet. In order to have a model as
                accurate as possible We need thousands of hours of footage,
                which we do not currently have. We are asking the community to
                link their own clips from Youtube and upload the videos to
                Waldo.
              </Text>
              <ButtonGroup gap={'4'} m={3}>
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
              </ButtonGroup>
            </Flex>
          </Center>
        </Container>
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
    <Container maxW={'7xl'}>
      <Grid
        h={{ sm: '1250px', md: '650px' }}
        templateRows={{ md: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
        templateColumns={{ md: 'repeat(5, 1fr)', sm: 'repeat(2, 1fr)' }}
        gap={4}
      >
        <GridItem
          rowSpan={{ sm: 2, md: 2 }}
          colSpan={{ sm: 3, md: 2 }}
          bg={'#8552D910'}
          overflow={'hidden'}
          p={3}
          textAlign={'center'}
          borderRadius={'16px'}
        >
          <Center h={'100%'}>
            <Flex align={'center'} direction={'column'} gap={{ md: 20, sm: 5 }}>
              <Flex direction={'column'}>
                <Text fontSize={'2rem'} fontWeight={'bold'}>
                  Waldo
                </Text>
                <Text fontWeight={450}>
                  Bring back the fun in your games with Waldo.
                </Text>
              </Flex>
              <Link href={'https://discord.gg/MPAV4qP8Hx'}>
                <Button variant={'solid'} colorScheme={'purple'}>
                  Join the Discord
                </Button>
              </Link>
            </Flex>
          </Center>
        </GridItem>
        <GridItem rowSpan={2} colSpan={3}>
          <Grid
            h={'100%'}
            gap={4}
            templateColumns="repeat(4, 1fr)"
            templateRows="repeat(5, 1fr)"
            textAlign={'center'}
          >
            <GridItem
              rowSpan={2}
              colSpan={2}
              bg="white"
              borderRadius={'16px'}
              p={3}
            >
              <Feature
                image={<FaCodeBranch size={35} />}
                title={'Open Source'}
                text={
                  <Text>
                    You can view the source code on our{' '}
                    <Link href={'https://github.com/waldo-vision'}>
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
              rowSpan={3}
              colSpan={2}
              bg="white"
              borderRadius={'16px'}
              p={3}
            >
              <Feature
                image={<MdMoneyOff size={45} />}
                title={'Free to use'}
                text={
                  <Text>
                    Waldo uses a community driven model to learn, you are the
                    one who supports us.
                  </Text>
                }
              />
            </GridItem>
            <GridItem
              rowSpan={3}
              colSpan={2}
              bg="white"
              borderRadius={'16px'}
              p={3}
            >
              <Feature
                image={<MdAllInclusive size={60} />}
                title={'Inclusive'}
                text={
                  <Text>
                    Anybody can use Waldo, we pride ourselves for the ease of
                    use.
                  </Text>
                }
              />
            </GridItem>
            <GridItem
              rowSpan={2}
              colSpan={2}
              bg="white"
              borderRadius={'16px'}
              p={3}
            >
              <Feature
                image={<FaRocket size={35} />}
                title={'Stability'}
                text={
                  <Text>
                    Issues and fixes are much quicker through the community.
                    Check the{' '}
                    <Link href={'https://github.com/waldo-vision'}>
                      <Text as={'span'} fontWeight={'bold'}>
                        issues
                      </Text>
                    </Link>{' '}
                    tab.
                  </Text>
                }
              />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Container>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
