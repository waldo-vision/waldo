import { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Tag, Spinner, Center, Image } from '@chakra-ui/react';
import { trpc } from '@utils/trpc';
import AccGameplayItemExtended from './AccGameplayItemExtended';
interface Gameplay {
  id: string;
  userId: string;
  youtubeUrl: string;
  gameplayType: string;
  isAnalyzed: boolean;
}
export default function AccGameplayItems() {
  const [gameplayItems, setGameplayItems] = useState<
    Array<Gameplay> | undefined
  >();
  const [componentLoading, setComponentLoading] = useState<boolean>(true);
  const { isLoading, data } = trpc.gameplay.getUsers.useQuery({
    userId: null,
  });
  const videoIdFromUrlRegex =
    /* eslint-disable-next-line no-useless-escape */
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  // format http://img.youtube.com/vi/[video-id]/[thumbnail-number].jpg
  const youtubeThumbnailRetrievalUrl = 'http://img.youtube.com/vi/';
  const getVideoId = (url: string) => {
    const result = url.match(videoIdFromUrlRegex);
    if (result == null) {
      // will never happen types are just wack.
      return 'No result';
    }
    return result[2];
  };

  const getThumbnail = (urlInput: string) => {
    const videoId = getVideoId(urlInput);
    const url = `${youtubeThumbnailRetrievalUrl}${videoId}/${0}.jpg`;
    return url;
  };

  const getNecessaryData = useCallback(() => {
    if (!isLoading) setGameplayItems(data);
    if (!data) setGameplayItems(undefined);
    setComponentLoading(false);
  }, [data, isLoading]);

  useEffect(() => {
    getNecessaryData();
  }, [data, getNecessaryData]);
  return (
    <>
      {componentLoading || isLoading ? (
        <Center>
          <Spinner color={'default'} size={'sm'} mt={2} />
        </Center>
      ) : (
        <>
          <Flex
            direction={'column'}
            gap={10}
            maxW={'100%'}
            minHeight={'100%'}
            maxHeight={'2xl'}
            overflowY={'scroll'}
          >
            {gameplayItems &&
              gameplayItems?.map((item, index) => (
                <Box
                  key={index}
                  bgColor={'white'}
                  boxShadow={'md'}
                  borderRadius={14}
                  p={2}
                >
                  <Flex direction={'column'} gap={5}>
                    <Image
                      src={getThumbnail(item.youtubeUrl)}
                      alt={'Profile Icon'}
                      height={'full'}
                      width={'100%'}
                      borderRadius={14}
                      onClick={() => {
                        console.log(gameplayItems);
                      }}
                    />
                    <Box>
                      <Flex direction={'column'}>
                        <Box ml={2} mr={2} p={{ base: 0, lg: 5 }}>
                          <AccGameplayItemExtended
                            item={item}
                            id={getVideoId(item.youtubeUrl)}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))}
          </Flex>
          {gameplayItems && gameplayItems.length < 1 && (
            <Box>
              <Tag size={'md'} variant={'solid'} colorScheme={'purple'} mt={2}>
                No uploads found
              </Tag>
            </Box>
          )}
        </>
      )}
    </>
  );
}
