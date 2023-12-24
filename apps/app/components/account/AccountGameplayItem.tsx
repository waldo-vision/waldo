import { Box, Flex, Text, Image, useToast, Button } from '@chakra-ui/react';
import Loading from '@components/Loading';
import Link from 'next/link';
import { Gameplay } from 'pages/account';
import { useEffect, useState } from 'react';
import { trpc } from '@utils/trpc';
import { BiTrash } from 'react-icons/bi';
import * as Sentry from '@sentry/nextjs';

type youtubeOembed = {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
};
export default function AccountGameplayItem({ item }: { item: Gameplay }) {
  const [videoData, setVideoData] = useState<youtubeOembed>();
  const utils = trpc.useContext();
  const toast = useToast();

  const deleteGameplayTrpc = trpc.gameplay.delete.useMutation({
    async onSuccess() {
      await utils.gameplay.invalidate();
    },
  });

  const deleteGameplay = () => {
    try {
      deleteGameplayTrpc.mutateAsync({ gameplayId: item.id });
      toast({
        position: 'bottom-right',
        title: 'Gameplay Deletion',
        description: 'Successfully deleted the gameplay!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      Sentry.captureException(error);
      toast({
        position: 'bottom-right',
        title: 'Gameplay Deletion',
        description:
          'An error occurred while attempting to delete the gameplay. Try logging out and then back in. If the issue persists please contact support@waldo.vision',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getVideo(item.youtubeUrl).then(data => {
      console.log(data);
      setVideoData({
        title: data.title,
        author_name: data.author_name,
        author_url: data.author_url,
        thumbnail_url: data.thumbnail_url,
      });
    });
  }, [item.youtubeUrl]);

  return !videoData ? (
    <Box>
      <Loading color={'purple.500'} />
    </Box>
  ) : (
    <Box>
      <Flex direction={'column'} gap={4}>
        <Link href={item.youtubeUrl}>
          <Image
            src={videoData.thumbnail_url}
            rounded={'3xl'}
            width={'full'}
            alt={`${videoData.title} by ${videoData.author_name}`}
          />
        </Link>
        <Flex direction={'row'}>
          <Flex direction={'column'} width={'90%'}>
            <Text fontSize={'lg'}>{videoData.title}</Text>
            <Text fontSize={'md'}>
              By&nbsp;
              <Link href={videoData.author_url}>
                <b>{videoData.author_name}</b>
              </Link>
            </Text>
          </Flex>
          <Box alignSelf={'end'}>
            <Button
              ml={3}
              variant={'solid'}
              bgColor={'red.300'}
              _hover={{ bgColor: 'red.200' }}
              color={'white'}
              onClick={() => deleteGameplay()}
            >
              <BiTrash size={25} />
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

async function getVideo(url: string) {
  const youtubeUrl = encodeURIComponent(url);
  url = 'https://www.youtube.com/oembed?url=' + youtubeUrl + '&format=json';
  const data = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return data.json();
}
