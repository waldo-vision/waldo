import {
  Flex,
  Input,
  InputGroup,
  Switch,
  Text,
  Collapse,
  Button,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '@utils/trpc';
export default function Review() {
  const nullCode = '--+|[]';
  // UPLOAD VARS AND LOGIC
  const { isLoading: reviewPageQLoading, data: reviewPageQData } =
    trpc.site.getPageData.useQuery({ name: 'review' }, { enabled: true });
  const utils = trpc.useContext();
  const [customReason, setCustomReason] = useState<string>(nullCode);
  const updatePage = trpc.site.updatePage.useMutation({
    async onSuccess() {
      await utils.site.invalidate();
    },
  });

  const handleApply = (change: number) => {
    if (!reviewPageQData) return;
    // change "0" changes the review page's maintenance value to on or off depending on the current value
    if (change == 0) {
      updatePage.mutateAsync({
        name: 'review',
        maintenance: !reviewPageQData.maintenance,
        isCustomAlert: reviewPageQData.isCustomAlert,
        alertTitle: reviewPageQData.alertTitle,
        alertDescription: reviewPageQData.alertDescription,
      });
      // change "1" changes the review page's isCustomAlert value to toggled or not toggled depending on the current value
    } else if (change == 1) {
      updatePage.mutateAsync({
        name: 'review',
        maintenance: reviewPageQData.maintenance,
        isCustomAlert: !reviewPageQData.isCustomAlert,
        alertTitle: reviewPageQData.alertTitle,
        alertDescription: reviewPageQData.alertDescription,
      });
      // change "2" sets the review page's custom maintenance reason (alertTitle) to a certain string value
    } else if (change == 2) {
      updatePage.mutateAsync({
        name: 'review',
        maintenance: reviewPageQData.maintenance,
        isCustomAlert: reviewPageQData.isCustomAlert,
        alertTitle: customReason,
        alertDescription: reviewPageQData.alertDescription,
      });
    }
  };

  const handleReset = () => {
    if (!reviewPageQData) return;

    updatePage.mutateAsync({
      name: 'review',
      maintenance: reviewPageQData?.maintenance,
      isCustomAlert: reviewPageQData?.isCustomAlert,
      alertTitle: nullCode,
      alertDescription: reviewPageQData.alertDescription,
    });
  };
  return (
    <Flex direction={'column'} gap={5} mb={5}>
      {reviewPageQLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Gameplay Reviewing</Text>
            <Text fontSize={'medium'} fontWeight={'medium'}>
              By disabling this service you are preventing users from creating
              voting on gameplay in the database. This includes all users
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
              defaultChecked={!reviewPageQData?.maintenance}
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
              opacity={!reviewPageQData?.maintenance ? '0.4' : '1'}
              _hover={
                !reviewPageQData?.maintenance ? { cursor: 'not-allowed' } : {}
              }
            >
              Use custom message
            </Text>
            <Switch
              size={'md'}
              onChange={() => {
                handleApply(1);
              }}
              defaultChecked={reviewPageQData?.isCustomAlert}
              disabled={!reviewPageQData?.maintenance}
            />
          </Flex>
          <Collapse in={reviewPageQData?.isCustomAlert} animateOpacity>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                placeholder={
                  reviewPageQData?.alertTitle == nullCode
                    ? 'Reviewing footage is under maintenance...'
                    : reviewPageQData?.alertTitle
                    ? reviewPageQData.alertTitle
                    : ''
                }
                onChange={event => setCustomReason(event.target.value)}
                disabled={!reviewPageQData?.maintenance}
              />
              <InputRightElement width="4.5rem">
                {reviewPageQData?.alertTitle == nullCode ? (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!reviewPageQData?.maintenance}
                    onClick={() => handleApply(2)}
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!reviewPageQData?.maintenance}
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
