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
      enabled: true,
    },
  );
  const [alertDescription, setAlertDescription] = useState<string | null>(null);
  const [alertTitle, setAlertTitle] = useState<string | null>(null);

  const handleSwitchChanges = async (change: number) => {
    // change "0" changes the site's maintenance mode's value to true or false depending on the current value
    if (change == 0) {
      await updateSite.mutateAsync({
        isCustomAlert: data?.isCustomAlert as boolean,
        alertDescription: data?.alertDescription as string,
        alertTitle: data?.alertTitle as string,
        maintenance: !data?.maintenance,
      });
      //change "1" changes the site's maintenance mode custom reason to a certain string value
    } else if (change == 1) {
      await updateSite.mutateAsync({
        isCustomAlert: !data?.isCustomAlert,
        alertDescription: data?.alertDescription as string,
        alertTitle: data?.alertTitle as string,
        maintenance: data?.maintenance as boolean,
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
        isCustomAlert: data?.isCustomAlert as boolean,
        alertDescription: data?.alertDescription as string,
        alertTitle: alertTitle as string,
        maintenance: !data?.maintenance,
      });
    } else if (alertTitle == null) {
      await updateSite.mutateAsync({
        isCustomAlert: data?.isCustomAlert as boolean,
        alertDescription: alertDescription as string,
        alertTitle: data?.alertTitle as string,
        maintenance: data?.maintenance as boolean,
      });
    } else {
      await updateSite.mutateAsync({
        isCustomAlert: data?.isCustomAlert as boolean,
        alertDescription: alertDescription as string,
        alertTitle: alertTitle as string,
        maintenance: data?.maintenance as boolean,
      });
    }
    window.location.reload();
  };

  return (
    <Flex direction={'column'} gap={5} mb={5}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Flex direction={'column'}>
            <Text>Maintenance Mode</Text>
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
              defaultChecked={data?.isCustomAlert}
              onChange={() => handleSwitchChanges(1)}
            />
          </Flex>
          <Collapse in={data?.isCustomAlert} animateOpacity>
            <Flex direction={'column'} gap={2}>
              <Input
                placeholder={
                  data?.alertTitle
                    ? 'Title'
                    : data?.alertTitle
                    ? data.alertTitle
                    : ''
                }
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
                  data?.alertDescription == ''
                    ? 'Enter a Description'
                    : data?.alertDescription
                    ? data.alertDescription
                    : ''
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
