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
    trpc.site.getPageData.useQuery({ pageName: 'review' }, { enabled: true });
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
        pageName: 'review',
        isDisabled: !reviewPageQData?.disabled,
        isCustomReason: reviewPageQData?.isCustomReason as boolean,
        customReason: reviewPageQData?.customReason as string,
      });
    } else if (change == 1) {
      updatePage.mutateAsync({
        pageName: 'review',
        isDisabled: reviewPageQData?.disabled,
        isCustomReason: !reviewPageQData?.isCustomReason as boolean,
        customReason: reviewPageQData?.customReason as string,
      });
    } else if (change == 2) {
      updatePage.mutateAsync({
        pageName: 'review',
        isDisabled: reviewPageQData?.disabled,
        isCustomReason: reviewPageQData?.isCustomReason as boolean,
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
      {reviewPageQLoading ? (
        <Text>dfsdfsdf</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Configure Service</Text>
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
              defaultChecked={!reviewPageQData?.disabled}
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
              opacity={!reviewPageQData?.disabled ? '0.4' : '1'}
              _hover={
                !reviewPageQData?.disabled ? { cursor: 'not-allowed' } : {}
              }
            >
              Use custom message
            </Text>
            <Switch
              size={'md'}
              onChange={() => {
                handleApply(1);
              }}
              defaultChecked={reviewPageQData?.isCustomReason}
              disabled={!reviewPageQData?.disabled}
            />
          </Flex>
          <Collapse in={!reviewPageQData?.isCustomReason} animateOpacity>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                placeholder={'Reviewing gameplay is under maintenance...'}
                onChange={event => setCustomReason(event.target.value)}
                disabled={
                  !reviewPageQData?.disabled || !reviewPageQData?.isCustomReason
                }
              />
              <InputRightElement width="4.5rem">
                {customReason ? (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={
                      !reviewPageQData?.disabled ||
                      !reviewPageQData?.isCustomReason
                    }
                    onClick={() => handleApply(2)}
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    h="1.75rem"
                    size="sm"
                    disabled={
                      !reviewPageQData?.disabled ||
                      !reviewPageQData?.isCustomReason
                    }
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
