import {
  Flex,
  Input,
  InputGroup,
  Switch,
  Text,
  Button,
  Collapse,
  InputRightElement,
  SystemStyleObject,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '@utils/trpc';
export default function Review() {
  const nullCode = '--+|[]';
  // UPLOAD VARS AND LOGIC
  const { isLoading: uploadPageQLoading, data: uploadPageQData } =
    trpc.site.getPageData.useQuery({ name: 'upload' }, { enabled: true });
  const utils = trpc.useContext();
  const [customReason, setCustomReason] = useState<string>(nullCode);
  const updatePage = trpc.site.updatePage.useMutation({
    async onSuccess() {
      await utils.site.invalidate();
    },
  });

  const handleApply = (change: number) => {
    if (!uploadPageQData) return;
    // change "0" changes the upload page's maintenance value to on or off depending on the current value
    if (change == 0) {
      updatePage.mutateAsync({
        name: 'upload',
        maintenance: !uploadPageQData.maintenance,
        isCustomAlert: uploadPageQData.isCustomAlert,
        alertTitle: uploadPageQData.alertTitle,
        alertDescription: uploadPageQData.alertDescription,
      });
      // change "1" changes the upload page's isCustomAlert value to toggled or not toggled depending on the current value
    } else if (change == 1) {
      updatePage.mutateAsync({
        name: 'upload',
        maintenance: uploadPageQData.maintenance,
        isCustomAlert: !uploadPageQData.isCustomAlert,
        alertTitle: uploadPageQData.alertTitle,
        alertDescription: uploadPageQData.alertDescription,
      });
      // change "2" sets the upload page's custom maintenance reason (alertTitle) to a certain string value
    } else if (change == 2) {
      updatePage.mutateAsync({
        name: 'upload',
        maintenance: uploadPageQData.maintenance,
        isCustomAlert: uploadPageQData.isCustomAlert,
        alertTitle: customReason,
        alertDescription: uploadPageQData.alertDescription,
      });
    }
  };

  const handleReset = () => {
    if (!uploadPageQData) return;

    updatePage.mutateAsync({
      name: 'upload',
      maintenance: uploadPageQData.maintenance,
      isCustomAlert: uploadPageQData?.isCustomAlert,
      alertTitle: nullCode,
      alertDescription: uploadPageQData.alertDescription,
    });
  };
  return (
    <Flex direction={'column'} gap={5} mb={5}>
      {uploadPageQLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Data Collection & Uploading</Text>
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
              defaultChecked={!uploadPageQData?.maintenance}
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
              opacity={!uploadPageQData?.maintenance ? '0.4' : '1'}
              _hover={
                !uploadPageQData?.maintenance ? { cursor: 'not-allowed' } : {}
              }
            >
              Use custom message
            </Text>
            <Switch
              size={'md'}
              onChange={() => {
                handleApply(1);
              }}
              defaultChecked={uploadPageQData?.isCustomAlert}
              disabled={!uploadPageQData?.maintenance}
            />
          </Flex>
          <Collapse in={uploadPageQData?.isCustomAlert} animateOpacity>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                placeholder={
                  uploadPageQData?.alertTitle == nullCode
                    ? 'Uploading footage is under maintenance...'
                    : (uploadPageQData?.alertTitle as string)
                }
                onChange={event => setCustomReason(event.target.value)}
                disabled={!uploadPageQData?.maintenance}
              />
              <InputRightElement width="4.5rem">
                {uploadPageQData?.alertTitle == nullCode ? (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!uploadPageQData?.maintenance}
                    onClick={() => handleApply(2)}
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!uploadPageQData?.maintenance}
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
