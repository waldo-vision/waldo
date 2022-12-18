import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Tag, Spinner, Center, Image } from '@chakra-ui/react';
import { trpc } from '@utils/trpc';
import AccGameplayItemExtended from './AccGameplayItemExtended';
interface Gameplay {
  id: string;
  userId: string;
  youtubeUrl: string;
  footageType: string;
  upVotes?: number;
  downVotes?: number;
  isAnalyzed: boolean;
}
const AccGameplayItems = () => {
  const [gameplayItems, setGameplayItems] = useState<
    Array<Gameplay> | undefined
  >();
  const [componentLoading, setComponentLoading] = useState<boolean>(true);
  const { isLoading, data } = trpc.gameplay.getUserGameplay.useQuery({
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
    <div>
      <Flex>
        {componentLoading || isLoading ? (
          <Center>
            <Spinner color={'default'} size={'sm'} mt={2} />
          </Center>
        ) : (
          <>
            <Box>
              {gameplayItems &&
                gameplayItems?.map(item => (
                  <Flex
                    direction={'row'}
                    mt={2}
                    boxShadow={'lg'}
                    borderRadius={14}
                  >
                    <Center>
                      <Image
                        src={getThumbnail(item.youtubeUrl)}
                        alt={'Profile Icon'}
                        height={{
                          base: '40px',
                          sm: '40px',
                          md: '40px',
                          lg: '60px',
                        }}
                        width={{
                          base: '60px',
                          sm: '60px',
                          md: '60px',
                          lg: '90px',
                        }}
                        borderRadius={14}
                        onClick={() => {
                          console.log(gameplayItems);
                        }}
                      ></Image>
                      <Box>
                        <Flex direction={'column'}>
                          <Box ml={2} mr={2}>
                            <AccGameplayItemExtended
                              item={item}
                              id={getVideoId(item.youtubeUrl)}
                            />
                          </Box>
                        </Flex>
                      </Box>
                    </Center>
                  </Flex>
                ))}
            </Box>
            {gameplayItems && gameplayItems.length < 1 && (
              <Box>
                <Tag
                  size={'md'}
                  variant={'solid'}
                  colorScheme={'purple'}
                  mt={2}
                >
                  No uploads found
                </Tag>
              </Box>
            )}
          </>
        )}
      </Flex>
    </div>
  );
};

export default AccGameplayItems;
