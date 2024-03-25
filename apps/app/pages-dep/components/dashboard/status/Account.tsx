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
  const { isLoading: accountPageQLoading, data: accountPageQData } =
    trpc.site.getPageData.useQuery({ name: 'account' });
  const utils = trpc.useContext();
  const [customReason, setCustomReason] = useState<string>(nullCode);
  const updatePage = trpc.site.updatePage.useMutation({
    async onSuccess() {
      await utils.site.invalidate();
    },
  });

  const handleApply = (change: number) => {
    if (!accountPageQData) return;
    // change "0" changes the account page's maintenance value to on or off depending on the current value
    if (change == 0) {
      updatePage.mutateAsync({
        name: 'account',
        maintenance: !accountPageQData.maintenance,
        isCustomAlert: accountPageQData.isCustomAlert,
        alertTitle: accountPageQData.alertTitle,
        alertDescription: accountPageQData.alertDescription,
      });
      // change "1" changes the account page's isCustomAlert value to toggled or not toggled depending on the current value
    } else if (change == 1) {
      updatePage.mutateAsync({
        name: 'account',
        maintenance: accountPageQData.maintenance,
        isCustomAlert: !accountPageQData.isCustomAlert,
        alertTitle: accountPageQData.alertTitle,
        alertDescription: accountPageQData.alertDescription,
      });
      // change "2" sets the account page's custom maintenance reason (alertTitle) to a certain string value
    } else if (change == 2) {
      updatePage.mutateAsync({
        name: 'account',
        maintenance: accountPageQData.maintenance,
        isCustomAlert: accountPageQData.isCustomAlert,
        alertTitle: customReason,
        alertDescription: accountPageQData.alertDescription,
      });
    }
  };
  const handleReset = () => {
    if (!accountPageQData) return;

    updatePage.mutateAsync({
      name: 'account',
      maintenance: accountPageQData.maintenance,
      isCustomAlert: accountPageQData.isCustomAlert,
      alertTitle: nullCode,
      alertDescription: accountPageQData.alertDescription,
    });
  };
  return (
    <Flex direction={'column'} gap={5} mb={5}>
      {accountPageQLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Security & Authentication</Text>
            <Text fontSize={'medium'} fontWeight={'medium'}>
              By disabling this service you are preventing users from creating
              new accounts or logging in. However already logged in accounts
              will still be able to log in and access other services as usual.
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
              defaultChecked={!accountPageQData?.maintenance}
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
              opacity={!accountPageQData?.maintenance ? '0.4' : '1'}
              _hover={
                !accountPageQData?.maintenance ? { cursor: 'not-allowed' } : {}
              }
            >
              Use custom message
            </Text>
            <Switch
              size={'md'}
              onChange={() => {
                handleApply(1);
              }}
              defaultChecked={accountPageQData?.isCustomAlert}
              disabled={!accountPageQData?.maintenance}
            />
          </Flex>
          <Collapse in={accountPageQData?.isCustomAlert} animateOpacity>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                placeholder={
                  accountPageQData?.alertTitle == nullCode
                    ? 'Creating new accounts is under maintenance...'
                    : accountPageQData?.alertTitle
                    ? accountPageQData.alertTitle
                    : ''
                }
                onChange={event => setCustomReason(event.target.value)}
                disabled={!accountPageQData?.maintenance}
              />
              <InputRightElement width="4.5rem">
                {accountPageQData?.alertTitle == nullCode ? (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!accountPageQData?.maintenance}
                    onClick={() => handleApply(2)}
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!accountPageQData?.maintenance}
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
