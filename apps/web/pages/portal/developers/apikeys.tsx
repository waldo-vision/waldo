/* eslint-disable react/no-unescaped-entities */
import Sidebar from '@components/portal/developers/Sidebar';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { prisma } from '@server/db/client';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Button, Input, useDisclosure, chakra } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import useSite from '@contexts/SiteContext';
import { trpc } from '@utils/trpc';
import { useEffect, useState } from 'react';
import { ApiKeyState } from 'database';
import { compareKeyAgainstHash } from '@utils/helpers/apiHelper';
import * as Sentry from '@sentry/nextjs';
interface ApiKey {
  id: string;
  keyOwnerId: string;
  state: ApiKeyState;
  name?: string;
  clientKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const ApiKeys = () => {
  const [modalKeyField, setModalKeyField] = useState<string | undefined>(
    undefined,
  );
  const [modalKeyName, setModalKeyName] = useState<string | null>(null);
  const [keyList, setKeyList] = useState<ApiKey[]>();
  const { session } = useSite();
  const utils = trpc.useContext();
  const toast = useToast();

  const createKey = trpc.apiKey.create.useMutation({
    async onSuccess() {
      await utils.apiKey.invalidate();
    },
  });

  const deleteKeyMutation = trpc.apiKey.delete.useMutation({
    async onSuccess() {
      await utils.apiKey.invalidate();
    },
  });

  const { isLoading, data, refetch } = trpc.apiKey.getUserApiKeys.useQuery(
    {
      // again we know session can't be undefined because it is checked through ssr on page load so its safe to cast a type here.
      userId: session?.user?.id as string,
    },
    { enabled: true },
  );

  useEffect(() => {
    if (data !== undefined) {
      setKeyList(data);
    }
  }, [data]);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const handleKeyCopy = () => {
    navigator.clipboard.writeText(modalKeyField as string);
    toast({
      position: 'bottom-right',
      title: 'Copied!',
      description: 'Successfully copied the api key to the clipboard.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const updateModalKeyName = (name: string) => {
    if (name.length == 0) {
      setModalKeyName(null);
    } else {
      setModalKeyName(name);
    }
  };

  const createApiKey = async () => {
    if (modalKeyName == null) {
      toast({
        position: 'bottom-right',
        title: 'Missing Field',
        description: 'Please provide a name to label your api key.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const data = await createKey.mutateAsync({
        name: modalKeyName,
        // we are already checking for session with ssr so its ok to cast string type here to confirm it's not null.
        userId: session?.user?.id as string,
      });
      toast({
        position: 'bottom-right',
        title: 'Success',
        description: 'Successfully created your api key.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setModalKeyField(data.clientKey);
    } catch (error) {
      Sentry.captureException(error);
      toast({
        position: 'bottom-right',
        title: 'Error',
        description:
          'An error occured while trying to create an api key. If this keeps occuring please contact an administrator',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleModalClose = () => {
    // just reset all states back to default.
    console.log('ok');
    setModalKeyField(undefined);
    setModalKeyName(null);
  };

  const deleteKey = async (id: string) => {
    try {
      await deleteKeyMutation.mutateAsync({ id: id });
      toast({
        position: 'bottom-right',
        title: 'Success',
        description: 'Successfully deleted the api key.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      refetch();
    } catch (error) {
      Sentry.captureException(error);
      toast({
        position: 'bottom-right',
        title: 'Error',
        description:
          'An error occured while trying to delete the api key. If this keeps occuring please contact an administrator',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Sidebar>
      <Flex mt={{ base: '60px' }} mb={20} justifyContent={'center'}>
        <Flex alignItems={'center'} direction={'column'}>
          <Flex direction={'row'}>
            <Text ml={5} fontWeight={'extrabold'} fontSize={25}>
              Generate an API Key
            </Text>
            <Button
              colorScheme={'purple'}
              ml={3}
              borderRadius={12}
              onClick={onCreateOpen}
            >
              Generate
            </Button>
          </Flex>
          {!isLoading &&
            keyList &&
            keyList.map((object: ApiKey, index: number) => {
              return (
                <Flex mt={6} key={index}>
                  <Flex bgColor={'gray.900'} borderRadius={12}>
                    {/* name */}
                    <Flex
                      direction={'column'}
                      width={'sm'}
                      height={20}
                      ml={3}
                      py={2}
                    >
                      <Flex direction={'row'} alignItems={'center'}>
                        <Flex left={0} top={0} mb={'auto'} mr={'auto'}>
                          <Text textColor={'purple.500'}>{object.name}</Text>
                          {/* Scopes */}
                          <Text textColor={'gray.500'}>
                            &nbsp;— full api access
                          </Text>
                        </Flex>
                        {/* Custom Button From Box */}
                        <Box
                          onClick={() => deleteKey(object.id)}
                          right={0}
                          top={0}
                          mb={'auto'}
                          ml={'auto'}
                          mr={3}
                          py={0.5}
                          px={3}
                          bgColor={'gray.700'}
                          textColor={'red.500'}
                          borderRadius={8}
                          fontWeight={'semibold'}
                          borderColor={'gray.600'}
                          borderWidth={1}
                          fontSize={15}
                          _hover={{
                            cursor: 'pointer',
                            bgColor: 'red.500',
                            textColor: 'white',
                            borderColor: 'red.500',
                          }}
                        >
                          Delete
                        </Box>
                      </Flex>
                      {/* Status */}
                      {object.state == 'ACTIVE' ? (
                        <Text
                          textColor={'white'}
                          bottom={0}
                          mt={'auto'}
                          fontSize={15}
                          fontStyle={'italic'}
                          fontWeight={'semibold'}
                        >
                          Active
                        </Text>
                      ) : (
                        <Text
                          textColor={'goldenrod'}
                          bottom={0}
                          mt={'auto'}
                          fontSize={15}
                          fontStyle={'italic'}
                          fontWeight={'semibold'}
                        >
                          Expired
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
        </Flex>
      </Flex>
      {/* Modals */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={-3} fontWeight={'bold'}>
            Create an API key
          </ModalHeader>
          <ModalBody>
            <Text fontWeight={'medium'}>Let's name your key</Text>
            <Input
              size={'sm'}
              placeholder={'Dev Key'}
              borderRadius={8}
              focusBorderColor={'purple.500'}
              onChange={event => updateModalKeyName(event.target.value)}
              cursor={modalKeyField != null ? 'not-allowed' : 'horizontal-text'}
              readOnly={modalKeyField != null ? true : false}
            />
            {modalKeyField != undefined && (
              <>
                <Text fontWeight={'semibold'} mt={3}>
                  Your key:
                </Text>
                <Input
                  bgColor={'gray.200'}
                  borderRadius={8}
                  textColor={'gray.500'}
                  readOnly={true}
                  value={modalKeyField}
                  onClick={handleKeyCopy}
                />
                <Text>
                  This key will only be shown once.{' '}
                  <chakra.span
                    fontWeight={'bold'}
                    textDecoration={'underline'}
                    onClick={handleKeyCopy}
                    cursor={'pointer'}
                  >
                    Click to copy
                  </chakra.span>
                </Text>
              </>
            )}
          </ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                handleModalClose();
                onCreateClose();
              }}
            >
              Close
            </Button>
            <Button
              colorScheme="purple"
              onClick={createApiKey}
              cursor={modalKeyField != null ? 'not-allowed' : 'pointer'}
              disabled={modalKeyField != null ? true : false}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Sidebar>
  );
};

export default ApiKeys;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function getServerSideProps(context) {
  const user = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  const config = await prisma.waldoPage.findUnique({
    where: {
      name: 'account',
    },
  });
  if (config && config?.maintenance) {
    return { redirect: { destination: '/', permanent: false } };
  } else if (!user) {
    return { redirect: { destination: '/auth/login' } };
  } else if (user.user?.role === 'USER' || user.user?.role === 'TRUSTED') {
    return { redirect: { destination: '/404' } };
  } else return { props: {} };
}
