import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  Switch,
  Text,
  Stack,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { trpc } from '@utils/trpc';
import Loading from '@components/Loading';
export default function Review() {
  const nullCode = '--+|[]';
  // UPLOAD VARS AND LOGIC
  const { isLoading: uploadPageQLoading, data: uploadPageQData } =
    trpc.site.getPageData.useQuery({ pageName: 'upload' }, { enabled: true });
  const utils = trpc.useContext();
  const [customReason, setCustomReason] = useState<string>(nullCode);
  const updatePage = trpc.site.updatePage.useMutation({
    async onSuccess() {
      await utils.site.invalidate();
    },
  });

  const handleApply = (change: number) => {
    if (change == 0) {
      updatePage.mutateAsync({
        pageName: 'upload',
        isDisabled: !uploadPageQData?.disabled,
        isCustomReason: uploadPageQData?.isCustomReason as boolean,
        customReason: uploadPageQData?.customReason as string,
      });
    } else if (change == 1) {
      updatePage.mutateAsync({
        pageName: 'upload',
        isDisabled: uploadPageQData?.disabled,
        isCustomReason: !uploadPageQData?.isCustomReason as boolean,
        customReason: uploadPageQData?.customReason as string,
      });
    } else if (change == 2) {
      updatePage.mutateAsync({
        pageName: 'upload',
        isDisabled: uploadPageQData?.disabled,
        isCustomReason: uploadPageQData?.isCustomReason as boolean,
        customReason: customReason as string,
      });
    }
    window.location.reload();
  };
  return (
    <div>
      <Flex direction={'row'}>
        {uploadPageQLoading ? (
          <Center w={'150vh'} h={'100vh'}>
            <Spinner size={'lg'} color={'blue.500'} />
          </Center>
        ) : (
          <Flex w={'inherit'} p={12} direction={'column'}>
            <Flex bgColor={'white'} borderRadius={14} direction={'column'}>
              <Box
                py={2}
                borderTopRadius={14}
                bgColor={uploadPageQData?.disabled ? 'red.400' : 'green.400'}
              ></Box>
              <Box p={4}>
                <Text fontWeight={'semibold'} fontSize={'3xl'}>
                  {uploadPageQData?.name.charAt(0).toUpperCase() +
                    uploadPageQData?.name.slice(1)}
                </Text>
                <Flex mt={2} direction={'row'} alignItems={'center'} gap={2}>
                  <Text fontWeight={'normal'} fontSize={'lg'}>
                    Disabled
                  </Text>
                  <Switch
                    size={'md'}
                    defaultChecked={uploadPageQData?.disabled}
                    onChange={() => handleApply(0)}
                  />
                </Flex>
                <Flex mt={2} direction={'row'} alignItems={'center'} gap={2}>
                  <Text fontWeight={'normal'} fontSize={'lg'}>
                    Custom Reason
                  </Text>
                  <Switch
                    size={'md'}
                    onChange={() => {
                      handleApply(1);
                    }}
                    defaultChecked={uploadPageQData?.isCustomReason}
                  />
                </Flex>
                {uploadPageQData?.isCustomReason && (
                  <>
                    <Text
                      onClick={() => {
                        setCustomReason(nullCode);
                        handleApply(2);
                      }}
                      mt={4}
                      mb={1}
                      fontStyle={'italic'}
                      cursor={'pointer'}
                      _hover={{ textColor: 'gray.600' }}
                    >
                      Unset Reason
                    </Text>
                    <Stack spacing={4}>
                      <InputGroup>
                        <InputLeftAddon
                          children={
                            <Box
                              _hover={{ bgColor: 'gray.300', borderRadius: 12 }}
                              onClick={() => handleApply(2)}
                            >
                              <BsCheckCircle size={26} cursor={'pointer'} />
                            </Box>
                          }
                        />
                        <Input
                          placeholder={
                            uploadPageQData?.customReason == nullCode
                              ? 'Custom Reason'
                              : uploadPageQData?.customReason
                          }
                          onChange={event =>
                            setCustomReason(event.target.value)
                          }
                        />
                      </InputGroup>
                    </Stack>
                  </>
                )}
              </Box>
            </Flex>
          </Flex>
        )}
      </Flex>
    </div>
  );
}
