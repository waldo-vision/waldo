import { Box, Flex, Text, Image } from '@chakra-ui/react';
import Loading from '@components/Loading';
import Link from 'next/link';
import { Gameplay } from 'pages/account';
import { useEffect, useState } from 'react';

type youtubeOembed = {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
};
export default function AccountGameplayItem({ item }: { item: Gameplay }) {
  const [videoData, setVideoData] = useState<youtubeOembed>();

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
        <Flex direction={'column'}>
          <Text fontSize={'lg'}>{videoData.title}</Text>
          <Link href={videoData.author_url}>
            <Text fontSize={'md'}>
              By <b>{videoData.author_name}</b>
            </Text>
          </Link>
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
