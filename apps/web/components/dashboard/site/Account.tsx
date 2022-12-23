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
  Button,
  Collapse,
  InputRightElement,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { trpc } from '@utils/trpc';
import Loading from '@components/Loading';
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
    if (change == 0) {
      updatePage.mutateAsync({
        pageName: 'account',
        isDisabled: !accountPageQData?.disabled,
        isCustomReason: accountPageQData?.isCustomReason as boolean,
        customReason: accountPageQData?.customReason as string,
      });
    } else if (change == 1) {
      updatePage.mutateAsync({
        pageName: 'account',
        isDisabled: accountPageQData?.disabled as boolean,
        isCustomReason: !accountPageQData?.isCustomReason as boolean,
        customReason: accountPageQData?.customReason as string,
      });
    } else if (change == 2) {
      updatePage.mutateAsync({
        pageName: 'account',
        isDisabled: accountPageQData?.disabled as boolean,
        isCustomReason: accountPageQData?.isCustomReason as boolean,
        customReason: customReason as string,
      });
    }
  };
  const handleReset = () => {
    updatePage.mutateAsync({
      pageName: 'account',
      isDisabled: accountPageQData?.disabled,
      isCustomReason: accountPageQData?.isCustomReason as boolean,
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
                placeholder={'Creating new accounts is under maintenance...'}
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
