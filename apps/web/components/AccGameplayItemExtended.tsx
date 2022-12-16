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
  useToast,
} from '@chakra-ui/react';
import { trpc } from '@utils/trpc';
import Loading from './Loading';
import { BiTrash } from 'react-icons/bi';
import { getYtVidDataFromId } from '@utils/helpers/apiHelper';
// TODO
interface Item {}

interface Id {
  id: string;
}
const AccGameplayItemExtended = ({ item, id }) => {
  const [meta, setMeta] = useState();
  const utils = trpc.useContext();
  const deleteGameplayTrpc = trpc.gameplay.deleteGameplay.useMutation({
    async onSuccess() {
      await utils.gameplay.invalidate();
    },
  });
  const [componentLoading, setComponentLoading] = useState<boolean>(true);
  const toast = useToast();
  const getd = async () => {
    const data = await getYtVidDataFromId(id);
    setMeta(data);
    setComponentLoading(false);
  };
  useEffect(() => {
    getd();
  }, [item]);

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
                {meta && meta.title.substring(0, 15) + '...'}
              </Text>
              <Text fontSize={{ base: 0, sm: 0, md: 8, lg: 8 }}>
                {item && item.youtubeUrl}
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
