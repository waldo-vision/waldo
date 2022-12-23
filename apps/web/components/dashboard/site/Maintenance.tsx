import {
  Flex,
  Input,
  Switch,
  Text,
  Collapse,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '@utils/trpc';
import { useRouter } from 'next/router';

export default function Maintenance() {
  const utils = trpc.useContext();
  const toast = useToast();
  const router = useRouter();
  const updateSite = trpc.site.updateSite.useMutation({
    async onSuccess() {
      await utils.site.invalidate();
    },
  });
  const { data, isLoading } = trpc.site.getSiteData.useQuery(
    {
      siteName: 'waldo',
    },
    {
      // every 15 seconds
      refetchInterval: 15000,
    },
  );
  const [alertDescription, setAlertDescription] = useState<string | null>(null);
  const [alertTitle, setAlertTitle] = useState<string | null>(null);

  const handleSwitchChanges = async (change: number) => {
    if (change == 0) {
      await updateSite.mutateAsync({
        showLpAlert: data?.showLpAlert as boolean,
        lpAlertDescription: data?.lpAlertDescription as string,
        lpAlertTitle: data?.lpAlertTitle as string,
        isMaintenance: !data?.maintenance,
      });
    } else if (change == 1) {
      await updateSite.mutateAsync({
        showLpAlert: !data?.showLpAlert,
        lpAlertDescription: data?.lpAlertDescription as string,
        lpAlertTitle: data?.lpAlertTitle as string,
        isMaintenance: data?.maintenance as boolean,
      });
    }
  };

  const applyChanges = async () => {
    if (alertDescription == null || alertTitle == null) {
      toast({
        position: 'bottom-right',
        title: 'Error',
        description:
          "You can't apply changes when nothing was unchanged. You probably didn't type any text in the title or description inputs. ",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (alertDescription == null) {
      await updateSite.mutateAsync({
        showLpAlert: data?.showLpAlert as boolean,
        lpAlertDescription: data?.lpAlertDescription as string,
        lpAlertTitle: alertTitle as string,
        isMaintenance: !data?.maintenance,
      });
    } else if (alertTitle == null) {
      await updateSite.mutateAsync({
        showLpAlert: data?.showLpAlert as boolean,
        lpAlertDescription: alertDescription as string,
        lpAlertTitle: data?.lpAlertTitle as string,
        isMaintenance: data?.maintenance as boolean,
      });
    } else {
      await updateSite.mutateAsync({
        showLpAlert: data?.showLpAlert as boolean,
        lpAlertDescription: alertDescription as string,
        lpAlertTitle: alertTitle as string,
        isMaintenance: data?.maintenance as boolean,
      });
    }
    window.location.reload();
  };

  return (
    <Flex direction={'column'} gap={5} mb={5}>
      {isLoading ? (
        <Text>dfsdfsdf</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Configure Service</Text>
            <Text fontSize={'medium'} fontWeight={'medium'}>
              By enabling this service you are preventing users from entering
              the site.
            </Text>
          </Flex>
          <Flex
            direction={'row'}
            alignItems={'center'}
            gap={2}
            justify={'space-between'}
          >
            <Text fontWeight={'normal'} fontSize={'lg'}>
              Enable Maintenance Mode
            </Text>
            <Switch
              size={'md'}
              defaultChecked={data?.maintenance}
              onChange={() => handleSwitchChanges(0)}
            />
          </Flex>
          <Flex
            direction={'row'}
            alignItems={'center'}
            gap={2}
            justify={'space-between'}
          >
            <Flex direction={'column'} gap={0}>
              <Text fontWeight={'normal'} fontSize={'lg'}>
                Show Alert
              </Text>
              <Text
                fontWeight={'hairline'}
                color={'gray.400'}
                fontSize={'2xs'}
                mt={-1}
              >
                This will show on {router.basePath || 'localhost:3000'}/.
              </Text>
            </Flex>
            <Switch
              size={'md'}
              defaultChecked={data?.showLpAlert}
              onChange={() => handleSwitchChanges(1)}
            />
          </Flex>
          <Collapse in={data?.showLpAlert} animateOpacity>
            <Flex direction={'column'} gap={2}>
              <Input
                placeholder={data?.lpAlertTitle ? 'Title' : data?.lpAlertTitle}
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                onChange={event => setAlertTitle(event.target.value)}
                _placeholder={{
                  fontWeight: 'normal',
                }}
              />
              <Input
                placeholder={
                  data?.lpAlertDescription == ''
                    ? 'Enter a Description'
                    : data?.lpAlertDescription
                }
                pr="4.5rem"
                borderRadius={10}
                _focus={{ boxShadow: 'none' }}
                type={'text'}
                onChange={event => setAlertDescription(event.target.value)}
                _placeholder={{
                  fontWeight: 'normal',
                }}
              />
            </Flex>
            <Flex direction={'row'}>
              <Button
                mt={3}
                bgColor={'black'}
                _hover={{ bgColor: 'gray.700' }}
                color={'white'}
                onClick={() => applyChanges()}
              >
                Apply
              </Button>
            </Flex>
          </Collapse>
        </>
      )}
    </Flex>
  );
}
