import {
  Box,
  Center,
  Text,
  Flex,
  Button,
  Image,
  useToast,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useState, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import Loading from '@components/Loading';
import Layout from '@components/Layout';
import { trpc } from '@utils/trpc';
import Head from 'next/head';
import { prisma } from '@server/db/client';
import TurnstileWidget from '@components/TurnstileWidget';
import Finished from '@components/Finished';
interface ReviewItem {
  id: string;
  user: {
    image?: string | null | undefined;
    name?: string | null | undefined;
  };
  userId: string;
  youtubeUrl: string;
  gameplayType: 'VAL' | 'CSG' | 'TF2' | 'APE' | 'COD' | 'R6S';
  isAnalyzed: boolean;
}
export default function Review() {
  const utils = trpc.useContext();
  const {
    data: reviewItemData,
    refetch,
    error,
    isError,
  } = trpc.gameplay.getReviewItems.useQuery();

  const reviewGameplay = trpc.gameplay.review.useMutation({
    async onSuccess() {
      await utils.gameplay.invalidate();
    },
  });

  const [reviewItem, setReviewItem] = useState<ReviewItem | undefined>(
    reviewItemData,
  );
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();
  const videoIdFromUrlRegex =
    // eslint-disable-next-line no-useless-escape
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  // format http://img.youtube.com/vi/[video-id]/[thumbnail-number].jpg
  const getYtEmbedLink = (url: string) => {
    const result = url.match(videoIdFromUrlRegex);
    if (result == null) {
      return;
    }
    return `https://youtube.com/embed/${result[2]}`;
  };

  const doClickLogic = async (action: 'yes' | 'no') => {
    setLoading(true);

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
    });
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

  useEffect(() => {
    const getNecessaryData = async () => {
      await refetch();
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
  }, [router, reviewItemData, refetch, error?.data?.code]);
  return (
    <>
      <Head>
        <title>Submissions | Review</title>
        <meta
          name="description"
          content="Waldo is an Open-source visual cheat detection, powered by A.I"
        />
      </Head>
      <div>
        <Center h={'100vh'}>
          {loading || !reviewItemData ? (
            <Loading color={'purple.500'} />
          ) : (
            <Flex direction={'column'}>
              {finished || error ? (
                <Finished />
              ) : (
                <>
                  <Center mb={4}>
                    <TurnstileWidget
                      valid={result => setIsRequestValid(result)}
                    />
                  </Center>
                  <Box bgColor={'white'} p={6} borderRadius={12}>
                    <Flex direction={'row'}>
                      {/* User Icon */}
                      <Box>
                        <Image
                          src={reviewItem?.user?.image as string}
                          alt={'User Icon'}
                          w={54}
                          h={54}
                          borderRadius={28}
                        />
                      </Box>
                      {/* Top titles */}
                      {reviewItem && (
                        <Flex
                          direction={'column'}
                          justifyContent={'center'}
                          fontSize={18}
                          ml={2}
                        >
                          <Text>
                            Submitted by&nbsp;
                            <Text as={'span'} fontWeight={'bold'}>
                              {reviewItem?.user?.name}
                            </Text>
                          </Text>

                          <Text fontWeight={'normal'}>
                            Does this clip match gameplay from{' '}
                            <Text fontWeight={'bold'} as={'span'}>
                              {reviewItem?.gameplayType === 'CSG'
                                ? 'Counter Strike: Global Offensive'
                                : reviewItem?.gameplayType === 'VAL'
                                ? 'Valorant'
                                : reviewItem?.gameplayType === 'APE'
                                ? 'Apex Legends'
                                : reviewItem?.gameplayType === 'TF2'
                                ? 'Team Fortress 2'
                                : reviewItem?.gameplayType === 'COD'
                                ? 'Call of Duty'
                                : 'a relevant First Person Shooter game?'}
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
                        />
                      )}
                    </Box>
                    {/* Footer */}
                    <Flex mt={4} alignItems={'center'}>
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
                </>
              )}
            </Flex>
          )}
        </Center>
      </div>
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
