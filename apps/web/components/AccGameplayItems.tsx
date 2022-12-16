import React, { useState, useEffect, use } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  Tag,
  Spinner,
  Center,
  Image,
} from '@chakra-ui/react';
import { trpc } from '@utils/trpc';
import Loading from './Loading';
import { getYtVidDataFromId } from '@utils/helpers/apiHelper';
import AccGameplayItemExtended from './AccGameplayItemExtended';
interface Gameplay {
  id: string;
  userId: string;
  youtubeUrl: string;
  footageType: string;
  upVotes: number;
  downVotes: number;
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

  var videoIdFromUrlRegex =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  // format http://img.youtube.com/vi/[video-id]/[thumbnail-number].jpg
  var youtubeThumbnailRetrievalUrl = 'http://img.youtube.com/vi/';
  const getVideoId = (url: string) => {
    var result = url.match(videoIdFromUrlRegex);
    return result[2];
  };

  const getThumbnail = (url: string) => {
    var videoId = getVideoId(url);
    var url = `${youtubeThumbnailRetrievalUrl}${videoId}/${0}.jpg`;
    return url;
  };

  const getNecessaryData = async () => {
    if (!isLoading) setGameplayItems(data);
    if (!data) setGameplayItems(undefined);
    setComponentLoading(false);
  };

  useEffect(() => {
    getNecessaryData();
  }, [data]);
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
                gameplayItems?.map((item, index) => (
                  <Flex
                    direction={'row'}
                    mt={2}
                    boxShadow={'lg'}
                    borderRadius={14}
                  >
                    <Center>
                      <Image
                        src={getThumbnail(item.youtubeUrl)}
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
