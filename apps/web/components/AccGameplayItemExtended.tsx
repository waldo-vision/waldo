import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Button, Text, Spinner, useToast } from '@chakra-ui/react';
import { trpc } from '@utils/trpc';
import { BiTrash } from 'react-icons/bi';
interface Item {
  item: {
    youtubeUrl: string;
    id: string;
  };
  id: string;
}
const AccGameplayItemExtended = (props: Item) => {
  const [meta, setMeta] = useState<string>();
  const utils = trpc.useContext();
  const deleteGameplayTrpc = trpc.gameplay.deleteGameplay.useMutation({
    async onSuccess() {
      await utils.gameplay.invalidate();
    },
  });
  const { data, refetch } = trpc.util.getYtVidDataFromId.useQuery(
    {
      videoId: props.id,
    },
    {
      enabled: false,
    },
  );
  const [componentLoading, setComponentLoading] = useState<boolean>(true);
  const toast = useToast();
  const getData = useCallback(async () => {
    await refetch();
    if (data) {
      setMeta(data.title);
    }
    setComponentLoading(false);
  }, [data, refetch]);

  useEffect(() => {
    getData();
  }, [props.item, getData]);

  const deleteGameplay = () => {
    try {
      deleteGameplayTrpc.mutateAsync({ gameplayId: props.item.id });
      toast({
        position: 'bottom-right',
        title: 'Gameplay Deletion',
        description: 'Successfully deleted the gameplay!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'bottom-right',
        title: 'Gameplay Deletion',
        description:
          'An error occured while attempting to delete the gameplay. Try logging out and then back in. If the issue persists please contact support@waldo.vision',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Flex direction={'row'}>
        <Box>
          {componentLoading ? (
            <Spinner color={'default'} size={'sm'} mt={2} />
          ) : (
            <>
              <Text
                fontSize={{ base: 0, sm: 0, md: 16, lg: 16 }}
                fontWeight={'bold'}
              >
                {meta && meta.substring(0, 15) + '...'}
                {meta && meta.substring(0, 15) + '...'}
              </Text>
              <Text fontSize={{ base: 0, sm: 0, md: 8, lg: 8 }}>
                {props.item && props.item.youtubeUrl}
              </Text>
            </>
          )}
        </Box>
        <Flex ml={'auto'} right={0}>
          <Button
            ml={3}
            variant={'ghost'}
            color={'red'}
            onClick={() => deleteGameplay()}
          >
            <BiTrash size={20} />
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default AccGameplayItemExtended;
