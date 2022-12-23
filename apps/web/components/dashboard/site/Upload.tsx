import {
  Flex,
  Input,
  InputGroup,
  Switch,
  Text,
  Button,
  Collapse,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '@utils/trpc';
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
    if (!uploadPageQData) return;

    if (change == 0) {
      updatePage.mutateAsync({
        pageName: 'upload',
        isDisabled: !uploadPageQData.disabled,
        isCustomReason: uploadPageQData.isCustomReason,
        customReason: uploadPageQData.customReason,
      });
    } else if (change == 1) {
      updatePage.mutateAsync({
        pageName: 'upload',
        isDisabled: uploadPageQData.disabled,
        isCustomReason: !uploadPageQData.isCustomReason,
        customReason: uploadPageQData.customReason,
      });
    } else if (change == 2) {
      updatePage.mutateAsync({
        pageName: 'upload',
        isDisabled: uploadPageQData.disabled,
        isCustomReason: uploadPageQData.isCustomReason,
        customReason: customReason,
      });
    }
  };

  const handleReset = () => {
    if (!uploadPageQData) return;

    updatePage.mutateAsync({
      pageName: 'upload',
      isDisabled: uploadPageQData.disabled,
      isCustomReason: uploadPageQData?.isCustomReason,
      customReason: nullCode,
    });
  };
  return (
    <Flex direction={'column'} gap={5} mb={5}>
      {uploadPageQLoading ? (
        <Text>Dfsdfsdf</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Configure Service</Text>
            <Text fontSize={'medium'} fontWeight={'medium'}>
              By disabling this service you are preventing users from uploading
              new gameplay or footage to the database. This includes all users
              regardless of privileges.
            </Text>
          </Flex>
          <Flex
            direction={'row'}
            alignItems={'center'}
            gap={2}
            justify={'space-between'}
          >
            <Text fontWeight={'normal'} fontSize={'lg'}>
              Enable service
            </Text>
            <Switch
              size={'md'}
              defaultChecked={!uploadPageQData?.disabled}
              onChange={() => handleApply(0)}
            />
          </Flex>
          <Flex
            direction={'row'}
            alignItems={'center'}
            gap={2}
            justify={'space-between'}
          >
            <Text
              fontWeight={'normal'}
              fontSize={'lg'}
              opacity={!uploadPageQData?.disabled ? '0.4' : '1'}
              _hover={
                !uploadPageQData?.disabled ? { cursor: 'not-allowed' } : {}
              }
            >
              Use custom message
            </Text>
            <Switch
              size={'md'}
              onChange={() => {
                handleApply(1);
              }}
              defaultChecked={uploadPageQData?.isCustomReason}
              disabled={!uploadPageQData?.disabled}
            />
          </Flex>
          <Collapse in={uploadPageQData?.isCustomReason} animateOpacity>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                placeholder={
                  uploadPageQData?.customReason == nullCode
                    ? 'Uploading footage is under maintenance...'
                    : uploadPageQData?.customReason
                }
                onChange={event => setCustomReason(event.target.value)}
                disabled={!uploadPageQData?.disabled}
              />
              <InputRightElement width="4.5rem">
                {uploadPageQData?.customReason == nullCode ? (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!uploadPageQData?.disabled}
                    onClick={() => handleApply(2)}
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!uploadPageQData?.disabled}
                    onClick={() => handleReset()}
                  >
                    Reset
                  </Button>
                )}
              </InputRightElement>
            </InputGroup>
          </Collapse>
        </>
      )}
    </Flex>
  );
}
