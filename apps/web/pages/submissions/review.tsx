import {
  Box,
  Center,
  Text,
  Flex,
  Button,
  useToast,
  Spinner,
  Tag,
} from '@chakra-ui/react';
import { useState, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import Layout from '@components/Layout';
import { trpc } from '@utils/trpc';
import Head from 'next/head';
import { prisma } from '@server/db/client';
import TurnstileWidget from '@components/TurnstileWidget';
import Finished from '@components/Finished';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { games } from '@config/gameplay';
import { GameplayType } from '@utils/zod/gameplay';
interface ReviewItem {
  id: string;
  user: {
    image?: string | null | undefined;
    name?: string | null | undefined;
  };
  userId: string;
  youtubeUrl: string;
  gameplayType: GameplayType;
  isAnalyzed: boolean;
  _count: { gameplayVotes: number };
  total: number;
}
export default function Review() {
  const utils = trpc.useContext();
  const toast = useToast();
  const reviewGameplay = trpc.gameplay.review.useMutation({
    async onSuccess() {
      await utils.gameplay.invalidate();
    },
  });
  const [refreshState, setRefreshState] = useState<number>(0);

  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
  const [tsToken, setTsToken] = useState<string | undefined>('');
  const router = useRouter();
  // const toast = useToast();
  const videoIdFromUrlRegex =
    // eslint-disable-next-line no-useless-escape
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const {
    data: reviewItemData,
    refetch,
    error,
  } = trpc.gameplay.getReviewItems.useQuery(
    {
      tsToken: tsToken as string,
    },
    { enabled: false },
  );
  const [reviewItem, setReviewItem] = useState<ReviewItem | undefined>(
    reviewItemData,
  );
  // format http://img.youtube.com/vi/[video-id]/[thumbnail-number].jpg
  const getYtEmbedLink = (url: string) => {
    const result = url.match(videoIdFromUrlRegex);
    if (result == null) {
      return;
    }
    return `https://youtube.com/embed/${result[2]}`;
  };

  const doClickLogic = async (action: 'yes' | 'no') => {
    if (!reviewItem) {
      setLoading(true);
      setFinished(true);
      return;
    }
    // force update turnstile widget
    setIsRequestValid(false);
    setRefreshState(refreshState + 1);

    if (!isRequestValid) {
      toast({
        position: 'bottom-right',
        title: 'Invalid Request',
        description:
          'Your request was deemed invalid. Please reload the page or try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const review = action === 'yes';
    await reviewGameplay.mutateAsync({
      gameplayId: reviewItem.id,
      actualGame: reviewItem.gameplayType,
      isGame: review,
      tsToken: tsToken as string,
    });
    setLoading(true);
    await refetch();
    setReviewItem(reviewItemData);
    setLoading(false);
  };

  const handleYesClick = () => {
    doClickLogic('yes');
  };

  const handleNoClick = () => {
    doClickLogic('no');
  };

  const getGameName = (gameplayType: GameplayType) => {
    const game = games.find(
      game => game.shortName === gameplayType.toLowerCase(),
    );
    if (game) {
      return game.name;
    }
    return 'a relevant First Person Shooter game?';
  };

  useEffect(() => {
    const getNecessaryData = async () => {
      if (tsToken && tsToken.length > 3 && !reviewItemData) {
        await refetch();
        return;
      }
      setReviewItem(reviewItemData);
      if (error?.data?.code == 'NOT_FOUND') {
        setFinished(true);
      }
      setLoading(false);
    };
    const getCurrentSession = async () => {
      const session = await getSession();
      // if blacklisted just keep loading, don't load page
      if (session?.user?.blacklisted) {
        setLoading(true);
        return;
      }
      if (session === null) {
        router.push('/auth/login');
      }
    };
    getCurrentSession();
    getNecessaryData();
  }, [router, tsToken, reviewItemData, error, refetch]);
  return (
    <>
      <Head>
        <title>Submissions | Review</title>
        <meta
          name="description"
          content="Waldo Vision is an open-source visual cheat detection project, powered by deep learning"
        />
      </Head>
      <Center h={'100vh'} mt={{ base: 5 }}>
        {loading || !reviewItemData || tsToken == '' || tsToken == undefined ? (
          <Flex direction={'column'} alignItems={'center'}>
            <Spinner size={'xl'} />
            <TurnstileWidget
              valid={(result, token) => {
                setIsRequestValid(result);
                setTsToken(token);
              }}
              refreshState={refreshState}
            />
          </Flex>
        ) : (
          <Flex direction={'column'}>
            {finished || error ? (
              <Finished />
            ) : (
              <>
                <Center mb={4} display={{ base: 'none', md: 'flex' }}></Center>
                <TurnstileWidget
                  valid={(result, token) => {
                    setIsRequestValid(result);
                    setTsToken(token);
                  }}
                  refreshState={refreshState}
                />
                <Box bgColor={'white'} p={6} borderRadius={12}>
                  <Flex direction={'row'}>
                    {/* User Icon */}
                    <Box>
                      <Image
                        src={
                          reviewItem != null &&
                          reviewItem.user != null &&
                          reviewItem.user.image != null
                            ? reviewItem.user.image
                            : 'https://waldo.vision/battle_net.png'
                        }
                        alt={'User Icon'}
                        width={54}
                        height={54}
                        style={{ borderRadius: '100%' }}
                        onClick={() => setRefreshState(refreshState + 1)}
                      />
                    </Box>
                    {/* Top titles */}
                    {reviewItem && (
                      <Flex
                        direction={'column'}
                        justifyContent={'center'}
                        fontSize={18}
                        ml={2}
                        minWidth={'42vw'}
                      >
                        <Flex direction={'row'} gap={2}>
                          <Text>
                            Submitted by&nbsp;
                            <Text as={'span'} fontWeight={'bold'}>
                              {reviewItem?.user?.name}
                            </Text>
                          </Text>
                          <Tag
                            justifyContent={'right'}
                            ml={'auto'}
                            bgColor={'purple.500'}
                            textColor={'white'}
                          >
                            {reviewItem._count.gameplayVotes} /{' '}
                            {reviewItem.total}
                          </Tag>
                        </Flex>
                        <Text fontWeight={'normal'}>
                          Does this clip match gameplay from{' '}
                          <Text fontWeight={'bold'} as={'span'}>
                            {getGameName(reviewItem?.gameplayType)}
                          </Text>
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                  {/* Iframe */}
                  <Box mt={6}>
                    {/* we might want to find a alternative to iframe as it doesn't inherit styles from parent w chakra -ceri */}
                    {reviewItem && (
                      <iframe
                        src={getYtEmbedLink(reviewItem.youtubeUrl)}
                        style={{
                          borderRadius: 12,
                          width: '100%',
                          height: '42vh',
                        }}
                        allowFullScreen={true}
                      />
                    )}
                  </Box>
                  {/* Footer */}
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    mt={4}
                    gap={3}
                  >
                    <Text>
                      By answering you accept the{' '}
                      <Text
                        as={'span'}
                        fontWeight={'semibold'}
                        textDecoration={'underline'}
                      >
                        Terms of Service
                      </Text>
                    </Text>
                    {/* Button */}
                    <Box ml={'auto'} right={0}>
                      <Button
                        color={'white'}
                        bgColor={'#373737'}
                        px={4}
                        _hover={{ bgColor: '#474747' }}
                        mr={3}
                        ml={3}
                        onClick={() => handleYesClick()}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="outline"
                        color={'#373737'}
                        borderColor={'#373737'}
                        px={4}
                        _hover={{ bgColor: 'gray.300' }}
                        onClick={() => handleNoClick()}
                      >
                        No
                      </Button>
                    </Box>
                  </Flex>
                </Box>
                <Text
                  mt={3}
                  maxW={'70%'}
                  textAlign={'center'}
                  alignSelf={'center'}
                  fontWeight={'light'}
                  fontSize={'3xs'}
                >
                  The videos shown are not related to Waldo Intelligence and may
                  contain sensitive content. Viewer discretion is advised
                </Text>
              </>
            )}
          </Flex>
        )}
      </Center>
    </>
  );
}

export const getServerSideProps = async () => {
  const config = await prisma.waldoPage.findUnique({
    where: {
      name: 'review',
    },
  });
  if (config && config?.maintenance) {
    return { redirect: { destination: '/', permanent: false } };
  } else return { props: {} };
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
