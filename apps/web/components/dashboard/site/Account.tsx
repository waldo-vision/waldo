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
    trpc.site.getPageData.useQuery({ pageName: 'account' });
  const utils = trpc.useContext();
  const [customReason, setCustomReason] = useState<string>(nullCode);
  const updatePage = trpc.site.updatePage.useMutation({
    async onSuccess() {
      await utils.site.invalidate();
    },
  });

  const handleApply = (change: number) => {
    if (!accountPageQData) return;

    if (change == 0) {
      updatePage.mutateAsync({
        pageName: 'account',
        isDisabled: !accountPageQData.disabled,
        isCustomReason: accountPageQData.isCustomReason,
        customReason: accountPageQData.customReason,
      });
    } else if (change == 1) {
      updatePage.mutateAsync({
        pageName: 'account',
        isDisabled: accountPageQData.disabled,
        isCustomReason: !accountPageQData.isCustomReason,
        customReason: accountPageQData.customReason,
      });
    } else if (change == 2) {
      updatePage.mutateAsync({
        pageName: 'account',
        isDisabled: accountPageQData.disabled,
        isCustomReason: accountPageQData.isCustomReason,
        customReason: customReason,
      });
    }
  };
  const handleReset = () => {
    if (!accountPageQData) return;

    updatePage.mutateAsync({
      pageName: 'account',
      isDisabled: accountPageQData.disabled,
      isCustomReason: accountPageQData.isCustomReason,
      customReason: nullCode,
    });
  };
  return (
    <Flex direction={'column'} gap={5} mb={5}>
      {accountPageQLoading ? (
        <Text>dfsdfds</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Configure Service</Text>
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
              defaultChecked={!accountPageQData?.disabled}
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
              opacity={!accountPageQData?.disabled ? '0.4' : '1'}
              _hover={
                !accountPageQData?.disabled ? { cursor: 'not-allowed' } : {}
              }
            >
              Use custom message
            </Text>
            <Switch
              size={'md'}
              onChange={() => {
                handleApply(1);
              }}
              defaultChecked={accountPageQData?.isCustomReason}
              disabled={!accountPageQData?.disabled}
            />
          </Flex>
          <Collapse in={accountPageQData?.isCustomReason} animateOpacity>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                placeholder={
                  accountPageQData?.customReason == nullCode
                    ? 'Creating new accounts is under maintenance...'
                    : accountPageQData?.customReason
                }
                onChange={event => setCustomReason(event.target.value)}
                disabled={!accountPageQData?.disabled}
              />
              <InputRightElement width="4.5rem">
                {customReason ? (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!accountPageQData?.disabled}
                    onClick={() => handleApply(2)}
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={!accountPageQData?.disabled}
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
