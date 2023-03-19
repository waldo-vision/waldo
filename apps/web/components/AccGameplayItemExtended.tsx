import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Button, Text, Spinner, useToast } from '@chakra-ui/react';
import { trpc } from '@utils/trpc';
import { decode } from 'html-entities';
import { BiTrash } from 'react-icons/bi';
interface Item {
  item: {
    youtubeUrl: string;
    id: string;
  };
  id: string;
}
export default function AccGameplayItemExtended(props: Item) {
  const [meta, setMeta] = useState<string>();
  const utils = trpc.useContext();
  const deleteGameplayTrpc = trpc.gameplay.delete.useMutation({
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
          'An error occurred while attempting to delete the gameplay. Try logging out and then back in. If the issue persists please contact support@waldo.vision',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction={'row'} justify={'space-between'}>
      <Box>
        {componentLoading ? (
          <Spinner color={'default'} size={'sm'} mt={2} />
        ) : (
          <>
            <Text
              fontSize={{ base: 12, sm: 12, md: 16, lg: 18 }}
              fontWeight={'bold'}
            >
              {meta && meta.substring(0, 30) + '...'}
            </Text>
            <Text fontSize={{ base: 7, sm: 7, md: 8, lg: 13 }}>
              {props.item && decode(props.item.youtubeUrl)}
            </Text>
          </>
        )}
      </Box>
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
    </Flex>
  );
}
